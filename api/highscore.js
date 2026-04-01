const { kv } = require("@vercel/kv");

const ALLOWED_BOARDS = new Set(["jump_easy", "jump_hard", "full_easy", "full_hard"]);
const LEADERBOARD_LIMIT = 15;

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

async function readLeaderboard(board, playerId, currentScore = 0) {
  const scoresKey = getBoardScoresKey(board);
  const rawEntries = await kv.zrange(scoresKey, 0, LEADERBOARD_LIMIT - 1, {
    rev: true,
    withScores: true,
  });
  const parsedEntries = normalizeZsetEntries(rawEntries);
  const allEntries = normalizeZsetEntries(
    await kv.zrange(scoresKey, 0, -1, {
      rev: true,
      withScores: true,
    })
  );

  const leaderboard = await Promise.all(
    parsedEntries.map(async (entry) => {
      let displayName = "";
      try {
        displayName = normalizePlayerName(await kv.hget(getPlayerMetaKey(entry.playerId), "name"));
      } catch (error) {
        displayName = "";
      }
      return {
        name: displayName || "Player",
        score: entry.score,
      };
    })
  );

  const rankIndex = playerId ? await kv.zrevrank(scoresKey, playerId) : null;
  const bestScore = playerId ? normalizeScore(await kv.zscore(scoresKey, playerId)) : 0;

  return {
    leaderboard,
    rank: typeof rankIndex === "number" ? rankIndex + 1 : null,
    bestScore,
    currentScoreRank: computeRankForScore(allEntries, currentScore),
  };
}

async function submitScore(board, playerId, name, score) {
  const scoresKey = getBoardScoresKey(board);
  const metaKey = getPlayerMetaKey(playerId);
  const currentBest = normalizeScore(await kv.zscore(scoresKey, playerId));

  await kv.hset(metaKey, {
    name,
    updatedAt: String(Date.now()),
  });

  if (score > currentBest) {
    await kv.zadd(scoresKey, {
      score,
      member: playerId,
    });
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
        leaderboard: result.leaderboard,
        rank: result.rank,
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
        leaderboard: result.leaderboard,
        rank: result.rank,
        bestScore: result.bestScore,
        currentScoreRank: result.currentScoreRank,
      });
    }

    return res.status(405).json({ error: "Method not allowed." });
  } catch (error) {
    return res.status(500).json({ error: "Leaderboard request failed." });
  }
};
