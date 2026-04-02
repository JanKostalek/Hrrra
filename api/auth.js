const crypto = require("crypto");
const { kv } = require("@vercel/kv");

const ACCOUNT_KEY_PREFIX = "hrrra:auth:account:";
const NAME_INDEX_KEY_PREFIX = "hrrra:auth:name:";
const HASH_ITERATIONS = 120000;
const HASH_KEYLEN = 32;
const HASH_DIGEST = "sha256";

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store, max-age=0");
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

function normalizePassword(value) {
  return String(value || "").trim().slice(0, 128);
}

function createPlayerId() {
  return normalizePlayerId("a_" + Date.now().toString(36) + "_" + crypto.randomBytes(6).toString("hex"));
}

function nameKey(name) {
  return NAME_INDEX_KEY_PREFIX + name.toLowerCase();
}

function accountKey(playerId) {
  return ACCOUNT_KEY_PREFIX + playerId;
}

function hashPassword(password, saltHex) {
  return crypto
    .pbkdf2Sync(password, Buffer.from(saltHex, "hex"), HASH_ITERATIONS, HASH_KEYLEN, HASH_DIGEST)
    .toString("hex");
}

async function signInOrRegister(name, password) {
  const normalizedName = normalizePlayerName(name);
  const normalizedPassword = normalizePassword(password);

  if (!normalizedName || normalizedPassword.length < 4) {
    return { ok: false, status: 400, code: "INVALID_PAYLOAD", error: "Invalid name or password." };
  }

  const nKey = nameKey(normalizedName);
  let existingPlayerId = normalizePlayerId(await kv.get(nKey));

  if (!existingPlayerId) {
    const playerId = createPlayerId();
    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = hashPassword(normalizedPassword, salt);
    const now = String(Date.now());

    await kv
      .multi()
      .set(nKey, playerId)
      .hset(accountKey(playerId), {
        name: normalizedName,
        salt,
        passwordHash,
        createdAt: now,
        updatedAt: now,
      })
      .exec();

    return { ok: true, created: true, playerId, name: normalizedName };
  }

  const rawAccount = await kv.hgetall(accountKey(existingPlayerId));
  const salt = rawAccount && typeof rawAccount.salt === "string" ? rawAccount.salt : "";
  const storedHash = rawAccount && typeof rawAccount.passwordHash === "string" ? rawAccount.passwordHash : "";
  if (!salt || !storedHash) {
    return { ok: false, status: 500, code: "AUTH_DATA_MISSING", error: "Authentication data missing." };
  }

  const incomingHash = hashPassword(normalizedPassword, salt);
  if (incomingHash !== storedHash) {
    return { ok: false, status: 409, code: "WRONG_PASSWORD", error: "This player name already exists, but the password does not match." };
  }

  await kv.hset(accountKey(existingPlayerId), {
    updatedAt: String(Date.now()),
    name: normalizedName,
  });

  return { ok: true, created: false, playerId: existingPlayerId, name: normalizedName };
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  try {
    const body = req.body || {};
    const result = await signInOrRegister(body.name, body.password);
    if (!result.ok) {
      return res.status(result.status || 400).json({
        ok: false,
        code: result.code || "AUTH_FAILED",
        error: result.error || "Authentication failed.",
      });
    }
    return res.status(200).json({
      ok: true,
      created: Boolean(result.created),
      playerId: result.playerId,
      name: result.name,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, code: "AUTH_FAILED", error: "Authentication failed." });
  }
};
