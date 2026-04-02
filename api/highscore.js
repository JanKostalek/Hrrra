const { kv } = require("@vercel/kv");

const ALLOWED_BOARDS = new Set(["jump_easy", "jump_hard", "full_easy", "full_hard"]);
const LEADERBOARD_LIMIT = 15;
const MAX_TOP_SCORE_RUNS = 2000;

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store, max-age=0");
}

function normalizeBoard(value) {
  const board = String(value || "").trim().toLowerCase();
  return ALLOWED_BOARDS.has(board) ? board : "";
}

function normalizePlayerName(value) {
  return String(value || "")
    .replace(/[^\p{L}\p{N} _-]+/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 16);
}

function normalizePlayerId(value) {
  return String(value || "")
    .replace(/[^a-z0-9_-]+/gi, "")
    .trim()
    .slice(0, 48);
}

function normalizeScore(value) {
  const parsed = Math.floor(Number(value) || 0);
  return Number.isFinite(parsed) ? Math.max(0, Math.min(parsed, 999999999)) : 0;
}

function getBoardScoresKey(board) {
  return `hrrra:leaderboard:${board}:scores`;
}

function getBoardTopScoresKey(board) {
  return `hrrra:leaderboard:${board}:top-scores`;
}

function getPlayerMetaKey(playerId) {
  return `hrrra:leaderboard:player:${playerId}`;
}

function normalizeZsetEntries(raw) {
  if (!Array.isArray(raw) || !raw.length) {
    return [];
  }

  if (typeof raw[0] === "object" && raw[0] !== null) {
    return raw
      .map((entry) => ({
        playerId: normalizePlayerId(entry.member || entry.value || entry.playerId || ""),
        score: normalizeScore(entry.score),
      }))
      .filter((entry) => entry.playerId);
  }

  const entries = [];
  for (let index = 0; index < raw.length; index += 2) {
    entries.push({
      playerId: normalizePlayerId(raw[index]),
      score: normalizeScore(raw[index + 1]),
    });
  }
  return entries.filter((entry) => entry.playerId);
}

function computeRankForScore(entries, score) {
  if (!Number.isFinite(Number(score)) || Number(score) <= 0) {
    return null;
  }
  let higherCount = 0;
  const safeScore = normalizeScore(score);
  for (const entry of entries) {
    if (entry.score > safeScore) {
      higherCount += 1;
    }
  }
  return higherCount + 1;
}

function normalizeRunZsetEntries(raw) {
  if (!Array.isArray(raw) || !raw.length) {
    return [];
  }

  if (typeof raw[0] === "object" && raw[0] !== null) {
    return raw
      .map((entry) => ({
        member: String(entry.member || entry.value || entry.playerId || ""),
        score: normalizeScore(entry.score),
      }))
      .filter((entry) => entry.member);
  }

  const entries = [];
  for (let index = 0; index < raw.length; index += 2) {
    entries.push({
      member: String(raw[index] || ""),
      score: normalizeScore(raw[index + 1]),
    });
  }
  return entries.filter((entry) => entry.member);
}

function getRunMemberPlayerId(member) {
  const raw = String(member || "");
  const firstSeparator = raw.indexOf("~");
  const candidate = firstSeparator >= 0 ? raw.slice(0, firstSeparator) : raw;
  return normalizePlayerId(candidate);
}

function createRunMember(playerId) {
  const now = Date.now();
  const random = Math.floor(Math.random() * 1000000000);
  return `${playerId}~${now}~${random}`;
}

async function readNamesMap(playerIds) {
  const uniqueIds = Array.from(
    new Set(
      (Array.isArray(playerIds) ? playerIds : [])
        .map((id) => normalizePlayerId(id))
        .filter(Boolean)
    )
  );
  const names = new Map();
  await Promise.all(
    uniqueIds.map(async (id) => {
      try {
        const raw = await kv.hget(getPlayerMetaKey(id), "name");
        names.set(id, normalizePlayerName(raw) || "Player");
      } catch (error) {
        names.set(id, "Player");
      }
    })
  );
  return names;
}

async function readLeaderboard(board, playerId, currentScore = 0) {
  const topPlayersKey = getBoardScoresKey(board);
  const topScoresKey = getBoardTopScoresKey(board);

  const topPlayersRaw = await kv.zrange(topPlayersKey, 0, LEADERBOARD_LIMIT - 1, {
    rev: true,
    withScores: true,
  });
  const topScoresRaw = await kv.zrange(topScoresKey, 0, LEADERBOARD_LIMIT - 1, {
    rev: true,
    withScores: true,
  });
  const allTopScoresRaw = await kv.zrange(topScoresKey, 0, -1, {
    rev: true,
    withScores: true,
  });

  const topPlayersParsed = normalizeZsetEntries(topPlayersRaw);
  const topScoresParsed = normalizeRunZsetEntries(topScoresRaw).map((entry) => ({
    member: String(entry.member || ""),
    playerId: getRunMemberPlayerId(entry.member),
    score: normalizeScore(entry.score),
  }));
  const allTopScores = normalizeRunZsetEntries(allTopScoresRaw).map((entry) => ({
    member: String(entry.member || ""),
    playerId: getRunMemberPlayerId(entry.member),
    score: normalizeScore(entry.score),
  }));

  const namesMap = await readNamesMap(
    topPlayersParsed
      .map((entry) => entry.playerId)
      .concat(topScoresParsed.map((entry) => entry.playerId))
      .concat(playerId ? [playerId] : [])
  );

  const topPlayers = topPlayersParsed.map((entry) => ({
    name: namesMap.get(entry.playerId) || "Player",
    score: entry.score,
  }));

  const topScores = topScoresParsed.map((entry) => ({
    name: namesMap.get(entry.playerId) || "Player",
    score: entry.score,
  }));

  const bestPlayerRankIndex = playerId ? await kv.zrevrank(topPlayersKey, playerId) : null;
  const bestScore = playerId ? normalizeScore(await kv.zscore(topPlayersKey, playerId)) : 0;

  return {
    topScores,
    topPlayers,
    bestPlayerRank: typeof bestPlayerRankIndex === "number" ? bestPlayerRankIndex + 1 : null,
    bestScoreRank: allTopScores.length ? computeRankForScore(allTopScores, bestScore) : null,
    bestScore,
    currentScoreRank: allTopScores.length ? computeRankForScore(allTopScores, currentScore) : null,
  };
}

async function submitScore(board, playerId, name, score) {
  const topPlayersKey = getBoardScoresKey(board);
  const topScoresKey = getBoardTopScoresKey(board);
  const metaKey = getPlayerMetaKey(playerId);
  const currentBest = normalizeScore(await kv.zscore(topPlayersKey, playerId));

  await kv.hset(metaKey, {
    name,
    updatedAt: String(Date.now()),
  });

  if (score > currentBest) {
    await kv.zadd(topPlayersKey, {
      score,
      member: playerId,
    });
  }

  if (score > 0) {
    await kv.zadd(topScoresKey, {
      score,
      member: createRunMember(playerId),
    });
    try {
      const runCount = Number(await kv.zcard(topScoresKey)) || 0;
      if (runCount > MAX_TOP_SCORE_RUNS) {
        await kv.zremrangebyrank(topScoresKey, 0, runCount - MAX_TOP_SCORE_RUNS - 1);
      }
    } catch (error) {}
  }

  return readLeaderboard(board, playerId, score);
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method === "GET") {
      const board = normalizeBoard(req.query && req.query.board);
      const playerId = normalizePlayerId(req.query && req.query.playerId);
      if (!board) {
        return res.status(400).json({ error: "Invalid board." });
      }

      const result = await readLeaderboard(board, playerId);
      return res.status(200).json({
        ok: true,
        board,
        topScores: result.topScores,
        topPlayers: result.topPlayers,
        bestPlayerRank: result.bestPlayerRank,
        bestScoreRank: result.bestScoreRank,
        bestScore: result.bestScore,
        currentScoreRank: result.currentScoreRank,
      });
    }

    if (req.method === "POST") {
      const body = req.body || {};
      const board = normalizeBoard(body.board);
      const playerId = normalizePlayerId(body.playerId);
      const name = normalizePlayerName(body.name);
      const score = normalizeScore(body.score);

      if (!board || !playerId || !name) {
        return res.status(400).json({ error: "Invalid payload." });
      }

      const result = await submitScore(board, playerId, name, score);
      return res.status(200).json({
        ok: true,
        board,
        topScores: result.topScores,
        topPlayers: result.topPlayers,
        bestPlayerRank: result.bestPlayerRank,
        bestScoreRank: result.bestScoreRank,
        bestScore: result.bestScore,
        currentScoreRank: result.currentScoreRank,
      });
    }

    return res.status(405).json({ error: "Method not allowed." });
  } catch (error) {
    return res.status(500).json({ error: "Leaderboard request failed." });
  }
};
