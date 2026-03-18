/*
README - Hrrra prototype
Controls:
- Left Arrow / A: move left
- Right Arrow / D: move right
- Space: jump (hold for higher jump, capped)
- Enter or Space on game over: restart

File structure:
- index.html: canvas + overlay + script loading
- style.css: basic page/canvas/overlay styling
- config.js: all tuning constants
- player.js: player state
- platform.js: static platform model
- elevator.js: moving elevator model
- world.js: procedural world generation
- physics.js: movement, collisions, support rule, death checks
- game.js: loop, input, camera, render, score, restart

Main tuning points:
- Movement: moveSpeedGroundPercentL, moveSpeedGroundPercentR, moveSpeedAir
- Single jump: singleJumpGravity, singleJumpInitialVelocity, singleJumpHoldAcceleration, singleJumpHoldMaxTime
- Shaft/elevators: shaftWidthMin/Max, widthExpandMaxMultiplier, elevatorMinCount/MaxCount, elevatorSpeed, elevatorWidth, elevatorWidthMaxMultiplier, elevatorMaxStepX
- Speed scaling: worldAutoRunSpeed, speedStepScore, speedStepMultiplier, speedStepScoreMultiplier, distanceScoreMultiplier
- Projectile: projectileUnlockScore, projectileRespawnMinSeconds, projectileRespawnMaxSeconds, projectileSpeedMultiplier
- Double jump: doubleJumpUnlockScore, doubleJumpGravity, doubleJumpInitialVelocity, doubleJumpHoldAcceleration, doubleJumpHoldMaxTime, doubleJumpIconSizeRatio, doubleJumpEffectSeconds, doubleJumpRespawnMinSeconds, doubleJumpRespawnMaxSeconds
- Tripple jump: tripleJumpEffectSeconds
- Tripple jump movement: tripleJumpGravity, tripleJumpInitialVelocity, tripleJumpHoldAcceleration, tripleJumpHoldMaxTime
- Slow icon: slowUnlockSpeedPercent, slowIconSizeRatio, slowRespawnMinSeconds, slowRespawnMaxSeconds
- Score bag: scoreBagBonus, scoreBagIconSizeRatio, scoreBagRespawnMinSeconds, scoreBagRespawnMaxSeconds
- Live: liveUnlockScore, liveRespawnMinSeconds, liveRespawnMaxSeconds
- Blocker: blockerUnlockScore, blockerRespawnMinSeconds, blockerRespawnMaxSeconds
- Coins: coinScoreBonus, coinIconSizeRatio, platformCoinInitialDelaySeconds, platformCoinRespawnMinSeconds, platformCoinRespawnMaxSeconds
- Death lines: topDeathLineY, bottomDeathLineY
*/
(function () {
  var C = window.HrrraConfig;
  var Player = window.HrrraPlayer;
  var World = window.HrrraWorld;
  var Physics = window.HrrraPhysics;

  var canvas = document.getElementById("game-canvas");
  var gameShell = document.getElementById("game-shell");
  var touchControls = document.getElementById("touch-controls");
  var ctx = canvas.getContext("2d");
  var gameOverEl = document.getElementById("game-over");
  var finalScoreEl = document.getElementById("final-score");
  var finalRuntimeEl = document.getElementById("final-runtime");
  var finalCoinsEl = document.getElementById("final-coins");
  var finalBagsEl = document.getElementById("final-bags");
  var finalHighscoresEl = document.getElementById("final-highscores");
  var preRunScreenEl = document.getElementById("pre-run-screen");
  var preRunSelectScreenEl = document.getElementById("pre-run-select-screen");
  var preRunDetailScreenEl = document.getElementById("pre-run-detail-screen");
  var preRunJumpBtn = document.getElementById("pre-run-jump-btn");
  var preRunFullBtn = document.getElementById("pre-run-full-btn");
  var preRunEasyBtn = document.getElementById("pre-run-easy-btn");
  var preRunHardBtn = document.getElementById("pre-run-hard-btn");
  var preRunBackBtn = document.getElementById("pre-run-back-btn");
  var preRunStartBtn = document.getElementById("pre-run-start-btn");
  var preRunDetailTitleEl = document.getElementById("pre-run-detail-title");
  var preRunDetailSubtitleEl = document.getElementById("pre-run-detail-subtitle");
  var preRunDetailLifeRulesEl = document.getElementById("pre-run-detail-life-rules");
  var briefTopDeathZoneRuleEl = document.getElementById("brief-top-death-zone-rule");
  var briefProjectilesRuleEl = document.getElementById("brief-projectiles-rule");
  var briefBlockerRuleEl = document.getElementById("brief-blocker-rule");
  var preRunControlsCopyEl = document.getElementById("pre-run-controls-copy");
  var briefMoneyBagEl = document.getElementById("brief-money-bag");
  var briefCoinEl = document.getElementById("brief-coin");
  var briefLivesEl = document.getElementById("brief-lives");
  var briefBlockerUnlockEl = document.getElementById("brief-blocker-unlock");
  var briefBlockerRespawnEl = document.getElementById("brief-blocker-respawn");
  var briefProjectile1UnlockEl = document.getElementById("brief-projectile-1-unlock");
  var briefProjectile2UnlockEl = document.getElementById("brief-projectile-2-unlock");
  var btnJump = document.getElementById("btn-jump");
  var btnLeft = document.getElementById("btn-left");
  var btnRight = document.getElementById("btn-right");
  var adminToggle = document.getElementById("admin-toggle");
  var adminPanel = document.getElementById("admin-panel");
  var adminClose = document.getElementById("admin-close");
  var adminPrivacy = document.getElementById("admin-privacy");
  var adminForm = document.getElementById("admin-form");
  var mode1Wrap = document.getElementById("mode-1-wrap");
  var mode1Btn = document.getElementById("mode-1-btn");
  var mode1LivesEl = document.getElementById("mode-1-lives");
  var mode2Wrap = document.getElementById("mode-2-wrap");
  var mode2Btn = document.getElementById("mode-2-btn");
  var mode2LivesEl = document.getElementById("mode-2-lives");
  var ADMIN_STORAGE_KEY_PREFIX = "hrrra_admin_config_v2_";
  var GLOBAL_ADMIN_STORAGE_KEY = "hrrra_admin_global_v1";
  var MAX_SCORE_STORAGE_KEY_PREFIX = "hrrra_max_score_v2_";
  var configDefaultsSnapshot = {};
  var modeTuning = window.HrrraModeTuning || {};
  var difficultyTuning = window.HrrraDifficultyTuning || {};
  var sceneArt = {
    backgroundSky: null,
    backgroundForeground: null,
    platform: null,
    elevator: null,
    blocker: null,
    coin: null,
    moneybag: null,
    heart: null,
    heroFrames: [],
    heroJumpFrames: [],
    rocket1: null,
    rocket2: null
  };
  var BACKGROUND_SKY_ART_PATH = "assets/gamebackground_sky_tile.png";
  var BACKGROUND_FOREGROUND_ART_PATH = "assets/gamebackground_foreground_tile.png";
  var PLATFORM_ART_PATH = "assets/platform-tile-clean.png";
  var ELEVATOR_ART_PATH = "assets/vytah01-clean.png";
  var BLOCKER_ART_PATH = "assets/blocker01-clean.png";
  var COIN_ART_PATH = "assets/coin01-clean.png";
  var MONEYBAG_ART_PATH = "assets/moneybag-clean.png";
  var HEART_ART_PATH = "assets/heart01.png";
  var HERO_WALK_ART_PATHS = [
    "assets/hero-walk-01.png",
    "assets/hero-walk-02.png",
    "assets/hero-walk-03.png",
    "assets/hero-walk-04.png",
    "assets/hero-walk-05.png",
    "assets/hero-walk-06.png"
  ];
  var HERO_JUMP_ART_PATHS = [
    "assets/hero-jump-01.png",
    "assets/hero-jump-02.png",
    "assets/hero-jump-03.png",
    "assets/hero-jump-04.png",
    "assets/hero-jump-05.png",
    "assets/hero-jump-06.png",
    "assets/hero-jump-07.png",
    "assets/hero-jump-08.png",
    "assets/hero-jump-09.png"
  ];
  var HERO_WALK_FRAME_SOURCE_RECTS = [
    { x: 40, y: 40, w: 80, h: 80 },
    { x: 40, y: 35, w: 80, h: 80 },
    { x: 40, y: 40, w: 80, h: 80 },
    { x: 40, y: 40, w: 85, h: 80 },
    { x: 40, y: 35, w: 85, h: 80 },
    { x: 40, y: 40, w: 80, h: 80 }
  ];
  var HERO_JUMP_FRAME_SOURCE_RECTS = [
    { x: 45, y: 45, w: 80, h: 75 },
    { x: 45, y: 55, w: 80, h: 65 },
    { x: 45, y: 35, w: 70, h: 80 },
    { x: 40, y: 30, w: 80, h: 80 },
    { x: 40, y: 30, w: 80, h: 80 },
    { x: 45, y: 45, w: 80, h: 75 },
    { x: 45, y: 55, w: 80, h: 65 },
    { x: 45, y: 45, w: 80, h: 75 },
    { x: 40, y: 40, w: 80, h: 80 }
  ];
  var ROCKET1_ART_PATH = "assets/rocket01-clean.png";
  var ROCKET2_ART_PATH = "assets/rocket02-clean.png";
  var PLATFORM_ART_RENDER_HEIGHT = 24;
  var PLATFORM_RIGHT_CAP_WIDTH = 16;
  var ELEVATOR_CAP_WIDTH = 76;
  var HERO_WALK_FRAME_SECONDS = 0.1;
  var HERO_JUMP_FRAME_SECONDS = 0.07;
  var ROCKET_ANIMATION_FRAME_SECONDS = 0.08;

  function getModeStorageKey(mode, difficulty) {
    return ADMIN_STORAGE_KEY_PREFIX + String(difficulty) + "_" + String(mode);
  }

  function readGlobalAdminStorageObject() {
    try {
      var raw = window.localStorage.getItem(GLOBAL_ADMIN_STORAGE_KEY);
      if (!raw) {
        return {};
      }
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    } catch (error) {
      // ignore broken localStorage data
    }
    return {};
  }

  function writeGlobalAdminStorageObject(obj) {
    try {
      window.localStorage.setItem(GLOBAL_ADMIN_STORAGE_KEY, JSON.stringify(obj));
    } catch (error) {
      // ignore write failures
    }
  }

  function saveGlobalAdminField(key, value) {
    var stored = readGlobalAdminStorageObject();
    stored[key] = value;
    writeGlobalAdminStorageObject(stored);
  }

  function loadGlobalAdminConfig() {
    var stored = readGlobalAdminStorageObject();
    for (var key in stored) {
      if (!Object.prototype.hasOwnProperty.call(stored, key)) {
        continue;
      }
      var value = stored[key];
      if (typeof C[key] === "boolean" && typeof value === "boolean") {
        C[key] = value;
      }
    }
  }

  function getMaxScoreStorageKey(mode, difficulty) {
    return MAX_SCORE_STORAGE_KEY_PREFIX + String(difficulty) + "_" + String(mode);
  }

  function readMaxScoreFromStorage(mode, difficulty) {
    try {
      var raw = window.localStorage.getItem(getMaxScoreStorageKey(mode, difficulty));
      if (raw === null || raw === "") {
        return 0;
      }
      var parsed = parseInt(raw, 10);
      if (Number.isFinite(parsed) && parsed >= 0) {
        return parsed;
      }
    } catch (error) {
      // ignore broken localStorage data
    }
    return 0;
  }

  function writeMaxScoreToStorage(mode, difficulty, maxScore) {
    var safeValue = Math.max(0, Math.floor(maxScore));
    try {
      window.localStorage.setItem(getMaxScoreStorageKey(mode, difficulty), String(safeValue));
    } catch (error) {
      // ignore write failures
    }
  }

  function readAdminStorageObject(mode, difficulty) {
    try {
      var raw = window.localStorage.getItem(getModeStorageKey(mode, difficulty));
      if (!raw) {
        return {};
      }
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    } catch (error) {
      // ignore broken localStorage data
    }
    return {};
  }

  function useModernVisuals() {
    return Boolean(C.modernVisualsEnabled);
  }

  function applyVisualThemeToUi() {
    if (!document.body) {
      return;
    }
    document.body.classList.toggle("visual-theme-modern", useModernVisuals());
    document.body.classList.toggle("visual-theme-retro", !useModernVisuals());
  }

  function loadAdminConfigFromStorage(mode, difficulty) {
    var stored = readAdminStorageObject(mode, difficulty);
    for (var key in stored) {
      if (!Object.prototype.hasOwnProperty.call(stored, key)) {
        continue;
      }
      var value = stored[key];
      if (typeof C[key] === "number" && Number.isFinite(value)) {
        C[key] = sanitizeConfigValue(key, value);
      } else if (typeof C[key] === "boolean" && typeof value === "boolean") {
        C[key] = value;
      }
    }
  }

  function saveAdminFieldToStorage(mode, difficulty, key, value) {
    var stored = readAdminStorageObject(mode, difficulty);
    stored[key] = value;
    try {
      window.localStorage.setItem(getModeStorageKey(mode, difficulty), JSON.stringify(stored));
    } catch (error) {
      // ignore write failures
    }
  }

  function writeAdminStorageObject(mode, difficulty, obj) {
    try {
      window.localStorage.setItem(getModeStorageKey(mode, difficulty), JSON.stringify(obj));
    } catch (error) {
      // ignore write failures
    }
  }

  function snapshotConfigDefaults() {
    var key;
    for (key in C) {
      if (Object.prototype.hasOwnProperty.call(C, key)) {
        configDefaultsSnapshot[key] = C[key];
      }
    }
  }

  function applyObjectConfig(source) {
    for (var key in source) {
      if (!Object.prototype.hasOwnProperty.call(source, key)) {
        continue;
      }
      var value = source[key];
      if (typeof C[key] === "number" && Number.isFinite(value)) {
        C[key] = sanitizeConfigValue(key, value);
      } else if (typeof C[key] === "boolean" && typeof value === "boolean") {
        C[key] = value;
      }
    }
  }

  function sanitizeConfigValue(key, value) {
    if (!Number.isFinite(value)) {
      return value;
    }

    if (key === "livesCount") {
      return Math.min(5, Math.max(1, Math.round(value)));
    }

    return value;
  }

  function buildModeConfig(mode, difficulty) {
    var cfg = {};
    var key;
    for (key in configDefaultsSnapshot) {
      if (Object.prototype.hasOwnProperty.call(configDefaultsSnapshot, key)) {
        cfg[key] = configDefaultsSnapshot[key];
      }
    }

    var fileOverrides = getModeFileOverrides(mode);
    for (key in fileOverrides) {
      if (Object.prototype.hasOwnProperty.call(fileOverrides, key)) {
        cfg[key] = fileOverrides[key];
      }
    }

    var difficultyOverrides = getDifficultyModeOverrides(difficulty, mode);
    for (key in difficultyOverrides) {
      if (Object.prototype.hasOwnProperty.call(difficultyOverrides, key)) {
        cfg[key] = difficultyOverrides[key];
      }
    }

    var storageOverrides = readAdminStorageObject(mode, difficulty);
    for (key in storageOverrides) {
      if (Object.prototype.hasOwnProperty.call(storageOverrides, key)) {
        cfg[key] = storageOverrides[key];
      }
    }

    return cfg;
  }

  function getModeDisplayName(mode) {
    return mode === 1 ? "Full Mode" : "Jump Mode";
  }

  function isFieldVisibleForMode(mode, key) {
    if (
      mode === 2 &&
      (
        key === "moveSpeedGroundPercentL" ||
        key === "moveSpeedGroundPercentR" ||
        key === "moveSpeedAir" ||
        key === "singleJumpGravity" ||
        key === "singleJumpInitialVelocity" ||
        key === "singleJumpHoldAcceleration" ||
        key === "singleJumpHoldMaxTime"
      )
    ) {
      return false;
    }
    return true;
  }

  function getModeFileOverrides(mode) {
    if (!modeTuning || typeof modeTuning !== "object") {
      return {};
    }
    var entry = modeTuning[String(mode)] || modeTuning[mode];
    if (!entry || typeof entry !== "object") {
      return {};
    }
    return entry;
  }

  function getDifficultyModeOverrides(difficulty, mode) {
    if (!difficultyTuning || typeof difficultyTuning !== "object") {
      return {};
    }
    var difficultyEntry = difficultyTuning[difficulty];
    if (!difficultyEntry || typeof difficultyEntry !== "object") {
      return {};
    }
    var modeEntry = difficultyEntry[String(mode)] || difficultyEntry[mode];
    if (!modeEntry || typeof modeEntry !== "object") {
      return {};
    }
    return modeEntry;
  }

  function applyModeConfig(mode, difficulty) {
    applyObjectConfig(configDefaultsSnapshot);
    applyObjectConfig(getModeFileOverrides(mode));
    applyObjectConfig(getDifficultyModeOverrides(difficulty, mode));
    loadAdminConfigFromStorage(mode, difficulty);
  }

  snapshotConfigDefaults();

  var state = {
    running: true,
    adminPaused: false,
    preRunActive: false,
    preRunStep: "select",
    gameMode: 2,
    gameDifficulty: "easy",
    score: 0,
    bonusScore: 0,
    runTimeSeconds: 0,
    collectedCoins: 0,
    collectedBags: 0,
    maxLives: 1,
    livesLeft: 1,
    lifeLossFlashTimeLeft: 0,
    speedPercent: 0,
    scrollSpeed: C.worldAutoRunSpeed,
    speedSlowMultiplier: 1,
    cameraX: 0,
    startX: 0,
    doubleJumpTimeLeft: 0,
    tripleJumpTimeLeft: 0,
    storedDoubleJumpTimeLeft: 0,
    doubleJumpExpireFlashTimeLeft: 0,
    doubleJumpRespawnTimer: 0,
    firstDoubleJumpSpawned: false,
    doubleJumpIcon: {
      active: false,
      x: 0,
      y: 0,
      size: C.playerSize * C.doubleJumpIconSizeRatio
    },
    slowUnlocked: false,
    slowRespawnTimer: 0,
    slowIcon: {
      active: false,
      x: 0,
      y: 0,
      size: C.playerSize * C.slowIconSizeRatio
    },
    scoreBagRespawnTimer: 0,
    scoreBagIcon: {
      active: false,
      x: 0,
      y: 0,
      size: C.playerSize * C.scoreBagIconSizeRatio
    },
    liveUnlocked: false,
    liveRespawnTimer: 0,
    liveIcon: {
      active: false,
      x: 0,
      y: 0,
      size: C.playerSize * C.liveIconSizeRatio
    },
    blockerUnlocked: false,
    blockerRespawnTimer: 0,
    blockerIcons: [],
    projectileUnlocked: false,
    projectileRespawnTimer: 0,
    projectile: {
      active: false,
      x: 0,
      y: 0,
      width: C.playerSize * 1.9,
      height: C.playerSize * 0.55
    },
    projectile2Unlocked: false,
    projectile2RespawnTimer: 0,
    projectile2: {
      active: false,
      x: 0,
      y: 0,
      width: C.playerSize * 1.9,
      height: C.playerSize * 0.55
    },
    projectileDeathAnimActive: false,
    projectileDeathAnimElapsed: 0,
    projectileDeathAnimMoveSeconds: 0.45,
    projectileDeathAnimHoldSeconds: 1.0,
    projectileDeathStartX: 0,
    projectileDeathStartY: 0,
    projectileDeathStartSize: C.playerSize,
    projectileDeathCurrentX: 0,
    projectileDeathCurrentY: 0,
    projectileDeathCurrentSize: C.playerSize,
    platformCoinTimer: C.platformCoinInitialDelaySeconds,
    lastPlatformCoinPlatformId: -1,
    platformCoinIcon: {
      active: false,
      x: 0,
      y: 0,
      size: C.playerSize * C.coinIconSizeRatio,
      platformId: -1
    },
    playerRotationRad: 0,
    playerRotationLockRad: 0,
    playerRotationDirection: 1,
    playerRotationLockedInAir: false,
    playerAirSpinRemainingRad: 0,
    wasPlayerGrounded: true,
    prevPlayerX: 0,
    heroJumpAnimTime: 0,
    heroJumpAnimStarted: false,
    heroLandingAnimTime: 0,
    heroLandingAnimActive: false,
    respawnPoint: null
  };

  var input = {
    left: false,
    right: false,
    jumpDown: false,
    jumpPressed: false
  };

  var world = new World();
  var physics = new Physics();
  var player = null;
  var lastTime = 0;
  var baseCanvasWidth = C.canvasWidth;
  var baseCanvasHeight = C.canvasHeight;
  var fullscreenRequested = false;
  var sessionMaxScore = 0;
  var globalAdminSections = [
    {
      title: "Global",
      fields: [
        { key: "fullscreenAutoEnabled", label: "Auto fullscreen on mobile", type: "checkbox" },
        { key: "modernVisualsEnabled", label: "Modern visuals", type: "checkbox" }
      ]
    }
  ];
  var adminSections = [
    {
      title: "Lives",
      fields: [
        { key: "livesCount", label: "Lives count", type: "number", min: 1, max: 5, step: 1 },
        { key: "livesApplyTopDeathZone", label: "Apply to top death zone", type: "checkbox" },
        { key: "livesApplyProjectiles", label: "Apply to projectiles", type: "checkbox" },
        { key: "livesApplyBlocker", label: "Apply to blocker", type: "checkbox" }
      ]
    },
    {
      title: "Speed",
      fields: [
        { key: "speedStepScore", label: "Start score" },
        { key: "speedStepMultiplier", label: "Speed multiplier per step" },
        { key: "speedStepScoreMultiplier", label: "Next step score multiplier (x)" },
        { key: "distanceScoreMultiplier", label: "Distance score multiplier" }
      ]
    },
    {
      title: "Projectile",
      fields: [
        { key: "projectileUnlockScore", label: "Unlock score" },
        { key: "projectileRespawnMinSeconds", label: "Respawn min sec" },
        { key: "projectileRespawnMaxSeconds", label: "Respawn max sec" },
        { key: "projectileSpeedMultiplier", label: "Speed multiplier vs world" }
      ]
    },
    {
      title: "Projectile 2",
      fields: [
        { key: "projectile2UnlockScore", label: "Unlock score" },
        { key: "projectile2RespawnMinSeconds", label: "Respawn min sec" },
        { key: "projectile2RespawnMaxSeconds", label: "Respawn max sec" },
        { key: "projectile2SpeedMultiplier", label: "Speed multiplier vs world" }
      ]
    },
    {
      title: "Single Jump",
      fields: [
        { key: "singleJumpGravity", label: "Gravity" },
        { key: "singleJumpInitialVelocity", label: "Jump initial velocity" },
        { key: "singleJumpHoldAcceleration", label: "Jump hold acceleration" },
        { key: "singleJumpHoldMaxTime", label: "Jump hold max time" }
      ]
    },
    {
      title: "Double Jump",
      fields: [
        { key: "doubleJumpGravity", label: "Gravity" },
        { key: "doubleJumpInitialVelocity", label: "Jump initial velocity" },
        { key: "doubleJumpHoldAcceleration", label: "Jump hold acceleration" },
        { key: "doubleJumpHoldMaxTime", label: "Jump hold max time" },
        { key: "doubleJumpEffectSeconds", label: "Effect seconds" },
        { key: "doubleJumpRespawnMinSeconds", label: "Respawn min sec" },
        { key: "doubleJumpRespawnMaxSeconds", label: "Respawn max sec" }
      ]
    },
    {
      title: "Tripple Jump",
      fields: [
        { key: "tripleJumpGravity", label: "Gravity" },
        { key: "tripleJumpInitialVelocity", label: "Jump initial velocity" },
        { key: "tripleJumpHoldAcceleration", label: "Jump hold acceleration" },
        { key: "tripleJumpHoldMaxTime", label: "Jump hold max time" },
        { key: "tripleJumpEffectSeconds", label: "Effect seconds" }
      ]
    },
    {
      title: "Slow",
      fields: [
        { key: "slowUnlockSpeedPercent", label: "Unlock speed %" },
        { key: "slowRespawnMinSeconds", label: "Respawn min sec" },
        { key: "slowRespawnMaxSeconds", label: "Respawn max sec" }
      ]
    },
    {
      title: "Score Bag",
      fields: [
        { key: "scoreBagBonus", label: "Bonus score" },
        { key: "scoreBagRespawnMinSeconds", label: "Respawn min sec" },
        { key: "scoreBagRespawnMaxSeconds", label: "Respawn max sec" }
      ]
    },
    {
      title: "Live",
      fields: [
        { key: "liveUnlockScore", label: "Unlock score" },
        { key: "liveRespawnMinSeconds", label: "Respawn min sec" },
        { key: "liveRespawnMaxSeconds", label: "Respawn max sec" }
      ]
    },
    {
      title: "Blocker",
      fields: [
        { key: "blockerUnlockScore", label: "Unlock score" },
        { key: "blockerRespawnMinSeconds", label: "Respawn min sec" },
        { key: "blockerRespawnMaxSeconds", label: "Respawn max sec" }
      ]
    },
    {
      title: "Coin",
      fields: [
        { key: "coinScoreBonus", label: "Coin bonus" },
        { key: "platformCoinInitialDelaySeconds", label: "Initial delay sec" },
        { key: "platformCoinRespawnMinSeconds", label: "Respawn min sec" },
        { key: "platformCoinRespawnMaxSeconds", label: "Respawn max sec" }
      ]
    },
    {
      title: "Movement",
      fields: [
        { key: "moveSpeedGroundPercentL", label: "Move speed ground L (% of speed)" },
        { key: "moveSpeedGroundPercentR", label: "Move speed ground R (% of speed)" },
        { key: "moveSpeedAir", label: "Move speed air" }
      ]
    },
    {
      title: "Elevators",
      fields: [
        { key: "elevatorSpeed", label: "Elevator speed" }
      ]
    }
  ];

  function init() {
    canvas.width = baseCanvasWidth;
    canvas.height = baseCanvasHeight;
    primeSceneArt();
    applyResponsiveLayout();
    window.addEventListener("resize", applyResponsiveLayout);
    document.addEventListener("fullscreenchange", function () {
      fullscreenRequested = Boolean(document.fullscreenElement);
    });
    applyModeConfig(state.gameMode, state.gameDifficulty);
    loadGlobalAdminConfig();
    applyVisualThemeToUi();
    sessionMaxScore = readMaxScoreFromStorage(state.gameMode, state.gameDifficulty);
    openPreRunScreen();
    attachInput();
    attachTouchControls();
    attachModeSwitch();
    applyGameModeToUi();
    attachAdminPanel();
    attachPreRunScreen();
    renderAdminForm();
    updateOverlayUiVisibility();
    requestAnimationFrame(loop);
  }

  function primeSceneArt() {
    loadSceneArtAsset(BACKGROUND_SKY_ART_PATH, function (image) {
      sceneArt.backgroundSky = image;
    });
    loadSceneArtAsset(BACKGROUND_FOREGROUND_ART_PATH, function (image) {
      sceneArt.backgroundForeground = image;
    });
    loadSceneArtAsset(PLATFORM_ART_PATH, function (image) {
      sceneArt.platform = image;
    });
    loadSceneArtAsset(ELEVATOR_ART_PATH, function (image) {
      sceneArt.elevator = image;
    });
    loadSceneArtAsset(BLOCKER_ART_PATH, function (image) {
      sceneArt.blocker = image;
    });
    loadSceneArtAsset(COIN_ART_PATH, function (image) {
      sceneArt.coin = image;
    });
    loadSceneArtAsset(MONEYBAG_ART_PATH, function (image) {
      sceneArt.moneybag = image;
    });
    loadSceneArtAsset(HEART_ART_PATH, function (image) {
      sceneArt.heart = image;
    });
    for (var heroFrameIndex = 0; heroFrameIndex < HERO_WALK_ART_PATHS.length; heroFrameIndex += 1) {
      (function (targetIndex) {
        loadSceneArtAsset(HERO_WALK_ART_PATHS[targetIndex], function (image) {
          sceneArt.heroFrames[targetIndex] = image;
        });
      })(heroFrameIndex);
    }
    for (var heroJumpFrameIndex = 0; heroJumpFrameIndex < HERO_JUMP_ART_PATHS.length; heroJumpFrameIndex += 1) {
      (function (targetIndex) {
        loadSceneArtAsset(HERO_JUMP_ART_PATHS[targetIndex], function (image) {
          sceneArt.heroJumpFrames[targetIndex] = image;
        });
      })(heroJumpFrameIndex);
    }
    loadSceneArtAsset(ROCKET1_ART_PATH, function (image) {
      sceneArt.rocket1 = image;
    });
    loadSceneArtAsset(ROCKET2_ART_PATH, function (image) {
      sceneArt.rocket2 = image;
    });
  }

  function loadSceneArtAsset(path, onReady) {
    var image = new Image();
    image.onload = function () {
      onReady(image);
    };
    image.src = path;
  }

  function drawSceneArtStrip(asset, x, y, width, renderHeight, options) {
    if (!asset || width <= 0 || renderHeight <= 0) {
      return false;
    }

    var sourceHeight = asset.height;
    var sourceWidth = asset.width;

    var leftCapSourceX = options.leftCapSourceX;
    var leftCapSourceWidth = options.leftCapSourceWidth;
    var rightCapSourceX = options.rightCapSourceX;
    var rightCapSourceWidth = options.rightCapSourceWidth;
    var centerSourceX = options.centerSourceX;
    var centerSourceWidth = options.centerSourceWidth;

    var capScale = renderHeight / sourceHeight;
    var leftCapDestWidth = Math.max(1, Math.round(leftCapSourceWidth * capScale));
    var rightCapDestWidth = Math.max(1, Math.round(rightCapSourceWidth * capScale));

    if (leftCapDestWidth + rightCapDestWidth >= width - 2) {
      var totalCapWidth = Math.max(1, leftCapDestWidth + rightCapDestWidth);
      var fittedLeftCapWidth = Math.max(
        1,
        Math.round(width * (leftCapDestWidth / totalCapWidth))
      );
      var fittedRightCapWidth = Math.max(1, width - fittedLeftCapWidth);

      if (options.mirrorLeftCapFromRight) {
        ctx.save();
        ctx.translate(x + fittedLeftCapWidth, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(
          asset,
          rightCapSourceX,
          0,
          rightCapSourceWidth,
          sourceHeight,
          0,
          y,
          fittedLeftCapWidth,
          renderHeight
        );
        ctx.restore();
      } else {
        ctx.drawImage(
          asset,
          leftCapSourceX,
          0,
          leftCapSourceWidth,
          sourceHeight,
          x,
          y,
          fittedLeftCapWidth,
          renderHeight
        );
      }

      ctx.drawImage(
        asset,
        rightCapSourceX,
        0,
        rightCapSourceWidth,
        sourceHeight,
        x + width - fittedRightCapWidth,
        y,
        fittedRightCapWidth,
        renderHeight
      );
      return true;
    }

    if (options.mirrorLeftCapFromRight) {
      ctx.save();
      ctx.translate(x + leftCapDestWidth, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(
        asset,
        rightCapSourceX,
        0,
        rightCapSourceWidth,
        sourceHeight,
        0,
        y,
        leftCapDestWidth,
        renderHeight
      );
      ctx.restore();
    } else {
      ctx.drawImage(
        asset,
        leftCapSourceX,
        0,
        leftCapSourceWidth,
        sourceHeight,
        x,
        y,
        leftCapDestWidth,
        renderHeight
      );
    }

    ctx.drawImage(
      asset,
      rightCapSourceX,
      0,
      rightCapSourceWidth,
      sourceHeight,
      x + width - rightCapDestWidth,
      y,
      rightCapDestWidth,
      renderHeight
    );

    var centerDestX = x + leftCapDestWidth;
    var centerDestWidth = width - leftCapDestWidth - rightCapDestWidth;
    var centerChunkDestWidth = Math.max(1, Math.round(centerSourceWidth * capScale));

    for (var cursor = 0; cursor < centerDestWidth; cursor += centerChunkDestWidth) {
      var segmentDestWidth = Math.min(centerChunkDestWidth, centerDestWidth - cursor);
      var segmentSourceWidth = Math.max(
        1,
        Math.round(centerSourceWidth * (segmentDestWidth / centerChunkDestWidth))
      );

      ctx.drawImage(
        asset,
        centerSourceX,
        0,
        segmentSourceWidth,
        sourceHeight,
        centerDestX + cursor,
        y,
        segmentDestWidth,
        renderHeight
      );
    }

    return true;
  }

  function getDifficultyDisplayName() {
    return state.gameDifficulty === "hard" ? "Hard" : "Easy";
  }

  function getLivesSummaryText() {
    if (C.livesCount <= 1) {
      return "1 (instant death)";
    }
    return String(C.livesCount);
  }

  function getLifeRuleText(applies) {
    if (C.livesCount <= 1) {
      return "InstaDeath";
    }
    return applies ? "Lose 1 Life" : "InstaDeath";
  }

  function applyLifeRuleUi(el, applies) {
    if (!el) {
      return;
    }
    var isSafe = C.livesCount > 1 && applies;
    el.textContent = getLifeRuleText(applies);
    el.classList.toggle("brief-life-rule-safe", isSafe);
    el.classList.toggle("brief-life-rule-instant", !isSafe);
  }

  function getModeControlsHtml() {
    if (state.gameMode === 1) {
      return [
        "<p><strong>Mobile:</strong></p>",
        "<div class=\"pre-run-fullmode-diagram\" aria-hidden=\"true\">",
        "<span class=\"diag-jump\">Jump</span>",
        "<span class=\"diag-right\">Right</span>",
        "<span class=\"diag-left\">Left</span>",
        "</div>",
        "<p><strong>Desktop:</strong> Left/Right Arrows (or A/D)</p>",
        "<p>Space to jump</p>"
      ].join("");
    }

    return [
      "<p><strong>Mobile:</strong> Whole touch area = Jump</p>",
      "<p><strong>Desktop:</strong> Space = Jump</p>",
      "<p><strong>Double Jump</strong> is always enabled</p>"
    ].join("");
  }

  function refreshPreRunBriefValues() {
    if (briefMoneyBagEl) {
      briefMoneyBagEl.textContent = String(C.scoreBagBonus);
    }
    if (briefCoinEl) {
      briefCoinEl.textContent = String(C.coinScoreBonus);
    }
    if (briefLivesEl) {
      briefLivesEl.textContent = getLivesSummaryText();
    }
    if (briefBlockerUnlockEl) {
      briefBlockerUnlockEl.textContent = String(C.blockerUnlockScore);
    }
    if (briefBlockerRespawnEl) {
      briefBlockerRespawnEl.textContent = C.blockerRespawnMinSeconds + "-" + C.blockerRespawnMaxSeconds + "s";
    }
    if (briefProjectile1UnlockEl) {
      briefProjectile1UnlockEl.textContent = String(C.projectileUnlockScore);
    }
    if (briefProjectile2UnlockEl) {
      briefProjectile2UnlockEl.textContent = String(C.projectile2UnlockScore);
    }
    if (preRunDetailTitleEl) {
      preRunDetailTitleEl.textContent = getModeDisplayName(state.gameMode);
    }
    if (preRunDetailSubtitleEl) {
      preRunDetailSubtitleEl.textContent = getDifficultyDisplayName() + " | Lives: " + getLivesSummaryText();
    }
    if (preRunDetailLifeRulesEl) {
      preRunDetailLifeRulesEl.classList.toggle("hidden", false);
    }
    applyLifeRuleUi(briefTopDeathZoneRuleEl, C.livesApplyTopDeathZone);
    applyLifeRuleUi(briefProjectilesRuleEl, C.livesApplyProjectiles);
    applyLifeRuleUi(briefBlockerRuleEl, C.livesApplyBlocker);
    if (preRunControlsCopyEl) {
      preRunControlsCopyEl.innerHTML = getModeControlsHtml();
    }
  }

  function renderPreRunScreen() {
    if (preRunSelectScreenEl) {
      preRunSelectScreenEl.classList.toggle("hidden", state.preRunStep !== "select");
    }
    if (preRunDetailScreenEl) {
      preRunDetailScreenEl.classList.toggle("hidden", state.preRunStep !== "details");
    }
    if (preRunEasyBtn) {
      preRunEasyBtn.classList.toggle("active", state.gameDifficulty === "easy");
    }
    if (preRunHardBtn) {
      preRunHardBtn.classList.toggle("active", state.gameDifficulty === "hard");
    }
  }

  function prepareRunSetup(mode, difficulty) {
    state.gameMode = mode === 1 ? 1 : 2;
    state.gameDifficulty = difficulty === "hard" ? "hard" : "easy";
    applyModeConfig(state.gameMode, state.gameDifficulty);
    loadGlobalAdminConfig();
    sessionMaxScore = readMaxScoreFromStorage(state.gameMode, state.gameDifficulty);
    restartGame();
    state.preRunActive = true;
    applyResponsiveLayout();
    renderAdminForm();
    refreshPreRunBriefValues();
    applyGameModeToUi();
    renderPreRunScreen();
  }

  function openPreRunScreen() {
    state.preRunStep = "select";
    setAdminOpen(false);
    prepareRunSetup(state.gameMode, state.gameDifficulty);
    state.preRunActive = true;
    if (preRunScreenEl) {
      preRunScreenEl.classList.remove("hidden");
    }
    renderPreRunScreen();
    updateOverlayUiVisibility();
  }

  function openPreRunModeDetails(mode) {
    state.preRunStep = "details";
    prepareRunSetup(mode, state.gameDifficulty);
  }

  function setPreRunDifficulty(difficulty) {
    state.gameDifficulty = difficulty === "hard" ? "hard" : "easy";
    if (state.preRunStep === "details") {
      prepareRunSetup(state.gameMode, state.gameDifficulty);
    } else {
      renderPreRunScreen();
    }
  }

  function closePreRunScreenAndStartRun() {
    setAdminOpen(false);
    state.preRunActive = false;
    if (preRunScreenEl) {
      preRunScreenEl.classList.add("hidden");
    }
    updateOverlayUiVisibility();
  }

  function updateGameOverSummary() {
    if (finalScoreEl) {
      finalScoreEl.textContent = "Score: " + state.score;
    }
    if (finalRuntimeEl) {
      finalRuntimeEl.textContent = "Run Time: " + state.runTimeSeconds.toFixed(1) + "s";
    }
    if (finalCoinsEl) {
      finalCoinsEl.textContent = "Coins collected: " + state.collectedCoins;
    }
    if (finalBagsEl) {
      finalBagsEl.textContent = "Bags collected: " + state.collectedBags;
    }
    if (finalHighscoresEl) {
      finalHighscoresEl.innerHTML = [
        "<h2>Stored High Scores</h2>",
        "<p>Easy Jump: " + readMaxScoreFromStorage(2, "easy") + "</p>",
        "<p>Easy Full: " + readMaxScoreFromStorage(1, "easy") + "</p>",
        "<p>Hard Jump: " + readMaxScoreFromStorage(2, "hard") + "</p>",
        "<p>Hard Full: " + readMaxScoreFromStorage(1, "hard") + "</p>"
      ].join("");
    }
  }

  function attachPreRunScreen() {
    if (preRunJumpBtn) {
      preRunJumpBtn.addEventListener("click", function () {
        openPreRunModeDetails(2);
      });
    }
    if (preRunFullBtn) {
      preRunFullBtn.addEventListener("click", function () {
        openPreRunModeDetails(1);
      });
    }
    if (preRunEasyBtn) {
      preRunEasyBtn.addEventListener("click", function () {
        setPreRunDifficulty("easy");
      });
    }
    if (preRunHardBtn) {
      preRunHardBtn.addEventListener("click", function () {
        setPreRunDifficulty("hard");
      });
    }
    if (preRunBackBtn) {
      preRunBackBtn.addEventListener("click", function () {
        state.preRunStep = "select";
        renderPreRunScreen();
      });
    }
    if (preRunStartBtn) {
      preRunStartBtn.addEventListener("click", function () {
        closePreRunScreenAndStartRun();
      });
    }
  }

  function setAdminOpen(isOpen) {
    if (!adminPanel) {
      return;
    }

    if (isOpen) {
      adminPanel.hidden = false;
      adminPanel.classList.remove("hidden");
      state.adminPaused = true;
    } else {
      adminPanel.hidden = true;
      adminPanel.classList.add("hidden");
      state.adminPaused = false;
    }

    input.left = false;
    input.right = false;
    input.jumpDown = false;
    input.jumpPressed = false;
  }

  function isNativePrivacyOptionsAvailable() {
    return !!(
      window.Capacitor &&
      window.Capacitor.Plugins &&
      window.Capacitor.Plugins.PrivacyOptions &&
      typeof window.Capacitor.Plugins.PrivacyOptions.show === "function"
    );
  }

  function updateAdminPrivacyVisibility() {
    if (!adminPrivacy) {
      return;
    }
    adminPrivacy.classList.toggle("hidden", !isNativePrivacyOptionsAvailable());
  }

  function updateOverlayUiVisibility() {
    if (adminToggle) {
      adminToggle.classList.toggle("hidden", state.preRunActive);
    }
    if (state.preRunActive) {
      setAdminOpen(false);
    }
  }

  function renderAdminForm() {
    if (!adminForm) {
      return;
    }

    adminForm.innerHTML = "";
    for (var globalSectionIndex = 0; globalSectionIndex < globalAdminSections.length; globalSectionIndex += 1) {
      var globalSection = globalAdminSections[globalSectionIndex];
      var globalSectionEl = document.createElement("section");
      globalSectionEl.className = "admin-section admin-global-section";

      var globalSectionTitle = document.createElement("h3");
      globalSectionTitle.textContent = globalSection.title;
      globalSectionEl.appendChild(globalSectionTitle);

      for (var globalFieldIndex = 0; globalFieldIndex < globalSection.fields.length; globalFieldIndex += 1) {
        var globalField = globalSection.fields[globalFieldIndex];
        if (typeof C[globalField.key] !== "boolean") {
          continue;
        }

        var globalRow = document.createElement("div");
        globalRow.className = "admin-field checkbox-field";

        var globalLabel = document.createElement("label");
        globalLabel.setAttribute("for", "admin-global-" + globalField.key);
        globalLabel.textContent = globalField.label;

        var globalInput = document.createElement("input");
        globalInput.id = "admin-global-" + globalField.key;
        globalInput.type = "checkbox";
        globalInput.checked = Boolean(C[globalField.key]);
        globalInput.dataset.key = globalField.key;
        globalInput.addEventListener("change", function (event) {
          var target = event.target;
          var key = target.dataset.key;
          var nextValue = Boolean(target.checked);
          saveGlobalAdminField(key, nextValue);
          C[key] = nextValue;
          if (key === "modernVisualsEnabled") {
            applyVisualThemeToUi();
            updateLivesUi();
          }
        });

        globalRow.appendChild(globalLabel);
        globalRow.appendChild(globalInput);
        globalSectionEl.appendChild(globalRow);
      }

      adminForm.appendChild(globalSectionEl);
    }

    var adminDifficultyGrid = document.createElement("div");
    adminDifficultyGrid.className = "admin-difficulty-grid";
    var difficulties = [
      { key: "easy", label: "Mechanics Easy Admin" },
      { key: "hard", label: "Mechanics Hard Admin" }
    ];
    var modes = [2, 1];

    for (var difficultyIndex = 0; difficultyIndex < difficulties.length; difficultyIndex += 1) {
      var difficultyEntry = difficulties[difficultyIndex];
      var difficultyColumn = document.createElement("div");
      difficultyColumn.className = "admin-difficulty-column";

      var difficultyTitle = document.createElement("h3");
      difficultyTitle.className = "admin-difficulty-title";
      difficultyTitle.textContent = difficultyEntry.label;
      difficultyColumn.appendChild(difficultyTitle);

      for (var modeIndex = 0; modeIndex < modes.length; modeIndex += 1) {
        var mode = modes[modeIndex];
        var modeConfig = buildModeConfig(mode, difficultyEntry.key);

        var modeGroup = document.createElement("div");
        modeGroup.className = "admin-mode-group";

        var modeHeader = document.createElement("div");
        modeHeader.className = "admin-mode-header";
        var modeTitle = document.createElement("h3");
        modeTitle.textContent = getModeDisplayName(mode);
        var modeDefaultBtn = document.createElement("button");
        modeDefaultBtn.className = "mode-default";
        modeDefaultBtn.textContent = "Default";
        modeDefaultBtn.dataset.mode = String(mode);
        modeDefaultBtn.dataset.difficulty = difficultyEntry.key;
        modeDefaultBtn.addEventListener("click", function (event) {
          var targetMode = parseInt(event.target.dataset.mode, 10);
          var targetDifficulty = event.target.dataset.difficulty;
          var modeFileOverrides = getModeFileOverrides(targetMode);
          var difficultyOverrides = getDifficultyModeOverrides(targetDifficulty, targetMode);
          var persisted = {};

          for (var sectionIndex = 0; sectionIndex < adminSections.length; sectionIndex += 1) {
            var section = adminSections[sectionIndex];
            for (var fieldIndex = 0; fieldIndex < section.fields.length; fieldIndex += 1) {
              var field = section.fields[fieldIndex];
              var key = field.key;
              var value = configDefaultsSnapshot[key];
              if (Object.prototype.hasOwnProperty.call(modeFileOverrides, key)) {
                value = modeFileOverrides[key];
              }
              if (Object.prototype.hasOwnProperty.call(difficultyOverrides, key)) {
                value = difficultyOverrides[key];
              }
              if (typeof value === "number" && Number.isFinite(value)) {
                persisted[key] = sanitizeConfigValue(key, value);
              } else if (typeof value === "boolean") {
                persisted[key] = value;
              }
            }
          }

          writeAdminStorageObject(targetMode, targetDifficulty, persisted);
          if (state.gameMode === targetMode && state.gameDifficulty === targetDifficulty) {
            applyModeConfig(targetMode, targetDifficulty);
            refreshPreRunBriefValues();
          }
          renderAdminForm();
        });
        var modeResetMaxScoreBtn = document.createElement("button");
        modeResetMaxScoreBtn.className = "mode-reset-max-score";
        modeResetMaxScoreBtn.textContent = "Reset max Score";
        modeResetMaxScoreBtn.dataset.mode = String(mode);
        modeResetMaxScoreBtn.dataset.difficulty = difficultyEntry.key;
        modeResetMaxScoreBtn.addEventListener("click", function (event) {
          var targetMode = parseInt(event.target.dataset.mode, 10);
          var targetDifficulty = event.target.dataset.difficulty;
          writeMaxScoreToStorage(targetMode, targetDifficulty, 0);
          if (state.gameMode === targetMode && state.gameDifficulty === targetDifficulty) {
            sessionMaxScore = 0;
          }
        });
        var modeActions = document.createElement("div");
        modeActions.className = "admin-mode-actions";
        modeActions.appendChild(modeDefaultBtn);
        modeActions.appendChild(modeResetMaxScoreBtn);
        modeHeader.appendChild(modeTitle);
        modeHeader.appendChild(modeActions);
        modeGroup.appendChild(modeHeader);

        for (var sectionIndex = 0; sectionIndex < adminSections.length; sectionIndex += 1) {
          var section = adminSections[sectionIndex];
          var sectionEl = document.createElement("section");
          sectionEl.className = "admin-section";
          var visibleRows = 0;

          var sectionTitle = document.createElement("h3");
          sectionTitle.textContent = section.title;
          sectionEl.appendChild(sectionTitle);

          for (var fieldIndex = 0; fieldIndex < section.fields.length; fieldIndex += 1) {
            var field = section.fields[fieldIndex];
            if (!isFieldVisibleForMode(mode, field.key)) {
              continue;
            }
            if (typeof modeConfig[field.key] !== "number" && typeof modeConfig[field.key] !== "boolean") {
              continue;
            }

            var row = document.createElement("div");
            row.className = "admin-field";
            if (field.type === "checkbox") {
              row.classList.add("checkbox-field");
            }

            var label = document.createElement("label");
            label.setAttribute("for", "admin-" + difficultyEntry.key + "-" + mode + "-" + field.key);
            label.textContent = field.label;

            var input = document.createElement("input");
            input.id = "admin-" + difficultyEntry.key + "-" + mode + "-" + field.key;
            input.type = field.type === "checkbox" ? "checkbox" : "number";
            if (field.type === "checkbox") {
              input.checked = Boolean(modeConfig[field.key]);
            } else {
              input.step = field.step ? String(field.step) : "any";
              if (typeof field.min === "number") {
                input.min = String(field.min);
              }
              if (typeof field.max === "number") {
                input.max = String(field.max);
              }
              input.value = String(modeConfig[field.key]);
            }
            input.dataset.key = field.key;
            input.dataset.mode = String(mode);
            input.dataset.difficulty = difficultyEntry.key;
            input.addEventListener("change", function (event) {
              var target = event.target;
              var key = target.dataset.key;
              var targetMode = parseInt(target.dataset.mode, 10);
              var targetDifficulty = target.dataset.difficulty;
              var nextValue;

              if (target.type === "checkbox") {
                nextValue = Boolean(target.checked);
                saveAdminFieldToStorage(targetMode, targetDifficulty, key, nextValue);
                if (state.gameMode === targetMode && state.gameDifficulty === targetDifficulty) {
                  C[key] = nextValue;
                }
                updateLivesUi();
                return;
              }

              nextValue = parseFloat(target.value);
              if (Number.isFinite(nextValue)) {
                nextValue = sanitizeConfigValue(key, nextValue);
                target.value = String(nextValue);
                saveAdminFieldToStorage(targetMode, targetDifficulty, key, nextValue);
                if (state.gameMode === targetMode && state.gameDifficulty === targetDifficulty) {
                  C[key] = nextValue;
                  refreshPreRunBriefValues();
                  if (key === "livesCount") {
                    state.maxLives = nextValue;
                    state.livesLeft = Math.min(state.livesLeft, nextValue);
                    if (state.preRunActive) {
                      state.livesLeft = nextValue;
                    }
                    updateLivesUi();
                  }
                }
              } else {
                var fallback = buildModeConfig(targetMode, targetDifficulty)[key];
                target.value = String(fallback);
              }
            });

            row.appendChild(label);
            row.appendChild(input);
            sectionEl.appendChild(row);
            visibleRows += 1;
          }

          if (visibleRows > 0) {
            modeGroup.appendChild(sectionEl);
          }
        }

        difficultyColumn.appendChild(modeGroup);
      }

      adminDifficultyGrid.appendChild(difficultyColumn);
    }

    adminForm.appendChild(adminDifficultyGrid);
  }

  function attachAdminPanel() {
    if (!adminToggle || !adminPanel || !adminClose) {
      return;
    }

    adminToggle.addEventListener("click", function () {
      var shouldOpen = adminPanel.classList.contains("hidden");
      setAdminOpen(shouldOpen);
    });

    adminClose.addEventListener("click", function () {
      setAdminOpen(false);
    });

    if (adminPrivacy) {
      adminPrivacy.addEventListener("click", function () {
        if (!isNativePrivacyOptionsAvailable()) {
          return;
        }
        window.Capacitor.Plugins.PrivacyOptions.show().catch(function () {});
      });
    }

    updateAdminPrivacyVisibility();

  }

  function setGameMode(mode) {
    state.gameMode = mode === 2 ? 2 : 1;
    applyModeConfig(state.gameMode, state.gameDifficulty);
    sessionMaxScore = readMaxScoreFromStorage(state.gameMode, state.gameDifficulty);
    input.left = false;
    input.right = false;
    input.jumpDown = false;
    input.jumpPressed = false;
    openPreRunScreen();
    applyResponsiveLayout();
    renderAdminForm();
  }

  function getDisplayedLivesCount() {
    return state.maxLives > 1 ? state.maxLives : 0;
  }

  function renderLivesInto(element) {
    if (!element) {
      return;
    }

    element.innerHTML = "";
    var count = getDisplayedLivesCount();
    for (var i = 0; i < count; i += 1) {
      var square = document.createElement("span");
      square.className = "life-square life-heart";
      square.classList.add(useModernVisuals() ? "modern" : "retro");
      if (!useModernVisuals()) {
        square.textContent = "♡";
      }
      if (i >= state.livesLeft) {
        square.classList.add("lost");
      }
      element.appendChild(square);
    }
  }

  function updateLivesUi() {
    if (mode1Wrap) {
      mode1Wrap.classList.toggle("active", state.gameMode === 1);
    }
    if (mode2Wrap) {
      mode2Wrap.classList.toggle("active", state.gameMode === 2);
    }

    renderLivesInto(mode1LivesEl);
    renderLivesInto(mode2LivesEl);

    if (mode1LivesEl) {
      mode1LivesEl.style.visibility = state.gameMode === 1 ? "visible" : "hidden";
    }
    if (mode2LivesEl) {
      mode2LivesEl.style.visibility = state.gameMode === 2 ? "visible" : "hidden";
    }
  }

  function applyGameModeToUi() {
    if (mode1Btn && mode2Btn) {
      mode1Btn.classList.toggle("active", state.gameMode === 1);
      mode2Btn.classList.toggle("active", state.gameMode === 2);
    }
    if (mode1Wrap && mode2Wrap) {
      mode1Wrap.classList.toggle("hidden", state.gameMode !== 1);
      mode2Wrap.classList.toggle("hidden", state.gameMode !== 2);
    }

    if (touchControls) {
      touchControls.classList.toggle("mode-full", state.gameMode === 1);
      touchControls.classList.toggle("mode-jump", state.gameMode === 2);
    }

    updateLivesUi();
  }

  function attachModeSwitch() {
    // In-game mode switch is display-only. Mode is chosen in the briefing flow.
  }

  function detectMobileDevice() {
    var ua = navigator.userAgent || "";
    var coarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    return coarsePointer || /android|iphone|ipad|ipod|mobile/i.test(ua);
  }

  function applyResponsiveLayout() {
    var isMobile = detectMobileDevice();

    if (!isMobile) {
      document.body.style.overflow = "";
      gameShell.style.width = "";
      gameShell.style.height = "";
      canvas.style.width = "";
      canvas.style.height = "";
      if (touchControls) {
        touchControls.style.display = "flex";
      }
      applyGameModeToUi();
      return;
    }

    document.body.style.overflow = "hidden";
    var viewportW = Math.max(1, window.innerWidth || 1);
    var viewportH = Math.max(1, window.innerHeight || 1);

    gameShell.style.width = Math.floor(viewportW) + "px";
    gameShell.style.height = Math.floor(viewportH) + "px";
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    if (touchControls) {
      touchControls.style.display = "flex";
    }
    applyGameModeToUi();
  }

  function tryForceFullscreen() {
    if (!C.fullscreenAutoEnabled) {
      return;
    }
    if (!detectMobileDevice()) {
      return;
    }
    if (document.fullscreenElement) {
      return;
    }
    if (fullscreenRequested) {
      return;
    }

    var target = document.documentElement;
    var request =
      target.requestFullscreen ||
      target.webkitRequestFullscreen ||
      target.msRequestFullscreen;

    if (typeof request !== "function") {
      return;
    }

    fullscreenRequested = true;
    try {
      var result = request.call(target);
      if (result && typeof result.catch === "function") {
        result.catch(function () {
          fullscreenRequested = false;
        });
      }
    } catch (error) {
      fullscreenRequested = false;
    }
  }

  function restartGame() {
    setAdminOpen(false);
    world.reset();
    var spawnX = 80;
    var spawnY = world.currentPlatformY - C.playerSize;
    player = new Player(spawnX, spawnY);
    player.isGrounded = true;
    state.running = true;
    state.adminPaused = false;
    state.preRunActive = false;
    state.score = 0;
    state.bonusScore = 0;
    state.runTimeSeconds = 0;
    state.collectedCoins = 0;
    state.collectedBags = 0;
    state.maxLives = sanitizeConfigValue("livesCount", C.livesCount);
    state.livesLeft = state.maxLives;
    state.lifeLossFlashTimeLeft = 0;
    state.speedPercent = 0;
    state.scrollSpeed = C.worldAutoRunSpeed;
    state.speedSlowMultiplier = 1;
    state.startX = spawnX;
    state.cameraX = 0;
    state.doubleJumpTimeLeft = 0;
    state.tripleJumpTimeLeft = 0;
    state.storedDoubleJumpTimeLeft = 0;
    state.doubleJumpExpireFlashTimeLeft = 0;
    state.doubleJumpRespawnTimer = 0;
    state.firstDoubleJumpSpawned = false;
    state.doubleJumpIcon.active = false;
    state.doubleJumpIcon.x = 0;
    state.doubleJumpIcon.y = 0;
    state.slowUnlocked = false;
    state.slowRespawnTimer = 0;
    state.slowIcon.active = false;
    state.slowIcon.x = 0;
    state.slowIcon.y = 0;
    state.scoreBagRespawnTimer = randomRange(
      C.scoreBagRespawnMinSeconds,
      C.scoreBagRespawnMaxSeconds
    );
    state.scoreBagIcon.active = false;
    state.scoreBagIcon.x = 0;
    state.scoreBagIcon.y = 0;
    state.scoreBagIcon.size = C.playerSize * C.scoreBagIconSizeRatio;
    state.liveUnlocked = false;
    state.liveRespawnTimer = 0;
    state.liveIcon.active = false;
    state.liveIcon.x = 0;
    state.liveIcon.y = 0;
    state.liveIcon.size = C.playerSize * C.liveIconSizeRatio;
    state.blockerUnlocked = false;
    state.blockerRespawnTimer = 0;
    state.blockerIcons = [];
    state.projectileUnlocked = false;
    state.projectileRespawnTimer = 0;
    state.projectile.active = false;
    state.projectile.x = 0;
    state.projectile.y = 0;
    state.projectile.width = C.playerSize * 1.9;
    state.projectile.height = C.playerSize * 0.55;
    state.projectile2Unlocked = false;
    state.projectile2RespawnTimer = 0;
    state.projectile2.active = false;
    state.projectile2.x = 0;
    state.projectile2.y = 0;
    state.projectile2.width = C.playerSize * 1.9;
    state.projectile2.height = C.playerSize * 0.55;
    state.projectileDeathAnimActive = false;
    state.projectileDeathAnimElapsed = 0;
    state.projectileDeathStartX = 0;
    state.projectileDeathStartY = 0;
    state.projectileDeathStartSize = C.playerSize;
    state.projectileDeathCurrentX = 0;
    state.projectileDeathCurrentY = 0;
    state.projectileDeathCurrentSize = C.playerSize;
    state.platformCoinTimer = C.platformCoinInitialDelaySeconds;
    state.lastPlatformCoinPlatformId = -1;
    state.platformCoinIcon.active = false;
    state.platformCoinIcon.x = 0;
    state.platformCoinIcon.y = 0;
    state.platformCoinIcon.platformId = -1;
    state.playerRotationRad = 0;
    state.playerRotationLockRad = 0;
    state.playerRotationDirection = 1;
    state.playerRotationLockedInAir = false;
    state.playerAirSpinRemainingRad = 0;
    state.wasPlayerGrounded = true;
    state.prevPlayerX = spawnX;
    state.heroJumpAnimTime = 0;
    state.heroJumpAnimStarted = false;
    state.heroLandingAnimTime = 0;
    state.heroLandingAnimActive = false;
    state.respawnPoint = {
      x: spawnX,
      y: spawnY,
      sourceX: 0,
      sourceY: world.currentPlatformY
    };
    player.hasDoubleJump = state.gameMode === 2;
    player.maxJumps = state.gameMode === 2 ? 2 : 1;
    gameOverEl.classList.add("hidden");
    updateLivesUi();
  }

  function getSpeedMultiplierFromScore(score) {
    var startScore = Math.max(1, C.speedStepScore);
    var stepScoreMultiplier = Number.isFinite(C.speedStepScoreMultiplier) ? C.speedStepScoreMultiplier : 1;
    var steps = 0;

    if (score >= startScore) {
      if (stepScoreMultiplier <= 1) {
        steps = Math.floor(score / startScore);
      } else {
        var ratio = score / startScore;
        steps = Math.floor(Math.log(ratio) / Math.log(stepScoreMultiplier) + 1e-9) + 1;
      }
    }

    return Math.pow(C.speedStepMultiplier, steps);
  }

  function shouldUseLivesForCause(cause) {
    if (state.maxLives <= 1 || state.livesLeft <= 1) {
      return false;
    }

    if (cause === "topDeathZone") {
      return Boolean(C.livesApplyTopDeathZone);
    }
    if (cause === "projectile") {
      return Boolean(C.livesApplyProjectiles);
    }
    if (cause === "blocker") {
      return Boolean(C.livesApplyBlocker);
    }

    return false;
  }

  function updateRespawnPoint() {
    if (!player.isGrounded || !player.supportRef) {
      return;
    }

    state.respawnPoint = {
      x: player.x,
      y: player.y,
      sourceX: player.supportRef.x,
      sourceY: player.supportRef.y
    };
  }

  function resolveRespawnPoint() {
    var point = state.respawnPoint;
    if (!point) {
      return {
        x: 80,
        y: world.currentPlatformY - C.playerSize
      };
    }

    var support = null;
    var tolerance = 1;
    for (var i = 0; i < world.platforms.length; i += 1) {
      if (
        Math.abs(world.platforms[i].x - point.sourceX) <= tolerance &&
        Math.abs(world.platforms[i].y - point.sourceY) <= tolerance
      ) {
        support = world.platforms[i];
        break;
      }
    }

    if (!support) {
      for (var j = 0; j < world.elevators.length; j += 1) {
        if (
          Math.abs(world.elevators[j].x - point.sourceX) <= tolerance &&
          Math.abs(world.elevators[j].y - point.sourceY) <= 24
        ) {
          support = world.elevators[j];
          break;
        }
      }
    }

    if (support) {
      var respawnX = Math.min(
        Math.max(point.x, support.x),
        support.x + support.width - player.width
      );
      return {
        x: respawnX,
        y: support.y - player.height
      };
    }

    return {
      x: point.x,
      y: point.y
    };
  }

  function consumeLife(cause) {
    if (!shouldUseLivesForCause(cause)) {
      return false;
    }

    state.livesLeft = Math.max(1, state.livesLeft - 1);
    state.lifeLossFlashTimeLeft = 0.25;

    if (cause === "topDeathZone") {
      player.y = C.topDeathLineY;
      player.velocityX = 0;
      player.velocityY = 0;
      player.isGrounded = false;
      player.supportType = null;
      player.supportRef = null;
      player.isJumpHolding = false;
      player.jumpHoldTime = 0;
      if (player.jumpsUsed < 1) {
        player.jumpsUsed = 1;
      }
      input.jumpDown = false;
      input.jumpPressed = false;
      state.playerRotationLockedInAir = false;
      state.playerAirSpinRemainingRad = 0;
      updateLivesUi();
      return true;
    }

    player.velocityX = 0;
    player.isJumpHolding = false;
    player.jumpHoldTime = 0;
    input.jumpDown = false;
    input.jumpPressed = false;
    state.cameraX = Math.max(0, player.x - C.canvasWidth * C.cameraAnchorRatio);
    updateLivesUi();
    return true;
  }

  function randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function normalizeAngle(angle) {
    var twoPi = Math.PI * 2;
    var out = angle % twoPi;
    if (out < 0) {
      out += twoPi;
    }
    return out;
  }

  function approachAngle(current, target, maxDelta) {
    var delta = target - current;
    if (Math.abs(delta) <= maxDelta) {
      return target;
    }
    return current + Math.sign(delta) * maxDelta;
  }

  function approachAngleClockwise(current, target, maxDelta) {
    var twoPi = Math.PI * 2;
    var from = normalizeAngle(current);
    var to = normalizeAngle(target);
    var deltaClockwise = (to - from + twoPi) % twoPi;

    if (deltaClockwise <= maxDelta) {
      return to;
    }
    return normalizeAngle(from + maxDelta);
  }

  function updatePlayerRotation(dt, jumpStartedInAir) {
    var quarterTurn = Math.PI * 0.5;
    var radius = player.width * 0.5;
    var deltaX = player.x - state.prevPlayerX;
    var absDeltaX = Math.abs(deltaX);
    var spinSpeed = Math.max(10, state.scrollSpeed / Math.max(1, player.width) * 4.5);

    if (jumpStartedInAir) {
      state.playerAirSpinRemainingRad += Math.PI;
      state.playerRotationLockedInAir = false;
    }

    if (player.isGrounded) {
      state.playerRotationLockedInAir = false;
      state.playerAirSpinRemainingRad = 0;
      if (absDeltaX > 0.001) {
        state.playerRotationDirection = deltaX >= 0 ? 1 : -1;
        state.playerRotationRad += deltaX / radius;
      }
      state.playerRotationRad = normalizeAngle(state.playerRotationRad);
    } else {
      if (state.wasPlayerGrounded && !state.playerRotationLockedInAir) {
        var current = normalizeAngle(state.playerRotationRad);
        var ratio = current / quarterTurn;
        var epsilon = 0.0001;
        var targetQuarter = Math.ceil(ratio + epsilon) * quarterTurn;
        state.playerRotationLockRad = normalizeAngle(targetQuarter);
        state.playerRotationLockedInAir = true;
      }

      if (state.playerAirSpinRemainingRad > 0) {
        var spinStep = Math.min(state.playerAirSpinRemainingRad, spinSpeed * dt);
        state.playerRotationRad = normalizeAngle(state.playerRotationRad + spinStep);
        state.playerAirSpinRemainingRad -= spinStep;
      } else if (state.playerRotationLockedInAir) {
        var rotateToLockSpeed = Math.max(12, state.scrollSpeed / Math.max(1, player.width));
        state.playerRotationRad = approachAngleClockwise(
          state.playerRotationRad,
          state.playerRotationLockRad,
          rotateToLockSpeed * dt
        );
      }
    }

    state.wasPlayerGrounded = player.isGrounded;
    state.prevPlayerX = player.x;
  }

  function attachInput() {
    window.addEventListener("keydown", function (event) {
      tryForceFullscreen();
      var key = event.key.toLowerCase();

      if (state.preRunActive && state.preRunStep === "details" && (event.key === " " || event.key === "Enter")) {
        closePreRunScreenAndStartRun();
        return;
      }
      if (state.preRunActive) {
        return;
      }

      if ((event.key === " " || event.key === "Enter") && !state.running && !state.projectileDeathAnimActive) {
        openPreRunScreen();
        return;
      }

      if (key === "arrowleft" || key === "a") {
        if (state.gameMode === 1) {
          input.left = true;
        }
      }
      if (key === "arrowright" || key === "d") {
        if (state.gameMode === 1) {
          input.right = true;
        }
      }
      if (event.key === " ") {
        if (!input.jumpDown) {
          input.jumpPressed = true;
        }
        input.jumpDown = true;
      }
    });

    window.addEventListener("keyup", function (event) {
      var key = event.key.toLowerCase();
      if (key === "arrowleft" || key === "a") {
        input.left = false;
      }
      if (key === "arrowright" || key === "d") {
        input.right = false;
      }
      if (event.key === " ") {
        input.jumpDown = false;
      }
    });

    gameOverEl.addEventListener("click", function () {
      tryForceFullscreen();
      if (!state.running && !state.projectileDeathAnimActive) {
        openPreRunScreen();
      }
    });

    canvas.addEventListener("pointerdown", function () {
      tryForceFullscreen();
    });
  }

  function bindHoldButton(button, onPress, onRelease) {
    if (!button) {
      return;
    }

    button.addEventListener("pointerdown", function (event) {
      event.preventDefault();
      tryForceFullscreen();
      if (button.setPointerCapture) {
        button.setPointerCapture(event.pointerId);
      }
      onPress();
    });

    button.addEventListener("pointerup", function (event) {
      event.preventDefault();
      onRelease();
    });

    button.addEventListener("pointercancel", function (event) {
      event.preventDefault();
      onRelease();
    });

    button.addEventListener("pointerleave", function (event) {
      event.preventDefault();
      onRelease();
    });
  }

  function attachTouchControls() {
    bindHoldButton(btnLeft, function () {
      if (state.gameMode === 1) {
        input.left = true;
      }
    }, function () {
      input.left = false;
    });

    bindHoldButton(btnRight, function () {
      if (state.gameMode === 1) {
        input.right = true;
      }
    }, function () {
      input.right = false;
    });

    bindHoldButton(btnJump, function () {
      if (!input.jumpDown) {
        input.jumpPressed = true;
      }
      input.jumpDown = true;
    }, function () {
      input.jumpDown = false;
    });
  }

  function loop(timestamp) {
    var dt = Math.min((timestamp - lastTime) / 1000 || 0, 0.033);
    lastTime = timestamp;

    if (state.running && !state.adminPaused && !state.preRunActive) {
      update(dt);
    } else if (state.projectileDeathAnimActive && !state.adminPaused && !state.preRunActive) {
      updateProjectileDeathAnimation(dt);
    }
    render();

    input.jumpPressed = false;
    requestAnimationFrame(loop);
  }

  function update(dt) {
    state.runTimeSeconds += dt;
    if (state.lifeLossFlashTimeLeft > 0) {
      state.lifeLossFlashTimeLeft = Math.max(0, state.lifeLossFlashTimeLeft - dt);
    }
    updateDoubleJumpEffect(dt);

    world.updateElevators(dt);
    var scoreMultiplier = getSpeedMultiplierFromScore(state.score);
    state.scrollSpeed = C.worldAutoRunSpeed * scoreMultiplier * state.speedSlowMultiplier;
    var wasGroundedBeforePhysics = player.isGrounded;
    var jumpsUsedBeforePhysics = player.jumpsUsed;
    physics.updatePlayer(player, world, input, dt, state.scrollSpeed);
    var jumpStarted = player.jumpsUsed > jumpsUsedBeforePhysics;
    var jumpStartedInAir = jumpStarted && !wasGroundedBeforePhysics;
    var landedThisFrame = !wasGroundedBeforePhysics && player.isGrounded;
    updatePlayerRotation(dt, jumpStartedInAir);
    updateHeroJumpAnimation(dt, jumpStarted, landedThisFrame);
    updateRespawnPoint();

    state.cameraX = Math.max(0, player.x - C.canvasWidth * C.cameraAnchorRatio);
    world.generateAhead(state.cameraX, C.canvasWidth);
    world.cleanupBehind(state.cameraX);

    var distanceScore = Math.max(0, Math.floor((player.x - state.startX) * C.distanceScoreMultiplier));
    state.score = distanceScore + state.bonusScore;
    if (state.score > sessionMaxScore) {
      sessionMaxScore = state.score;
      writeMaxScoreToStorage(state.gameMode, state.gameDifficulty, sessionMaxScore);
    }
    state.speedPercent = Math.round((state.scrollSpeed / C.worldAutoRunSpeed - 1) * 100);
    updateDoubleJumpSpawner(dt);
    checkDoubleJumpIconPickup();
    updateSlowSpawner(dt);
    checkSlowIconPickup();
    updateScoreBagSpawner(dt);
    checkScoreBagPickup();
    updateLiveSpawner(dt);
    checkLivePickup();
    updateBlockerSpawner(dt);
    if (checkBlockerCollision()) {
      if (consumeLife("blocker")) {
        return;
      }
      startProjectileDeathAnimation();
      return;
    }
    updateProjectileSpawner(dt);
    if (checkProjectileCollision()) {
      state.projectile.active = false;
      if (consumeLife("projectile")) {
        scheduleNextProjectileSpawn();
        return;
      }
      startProjectileDeathAnimation();
      return;
    }
    updateProjectile2Spawner(dt);
    if (checkProjectile2Collision()) {
      state.projectile2.active = false;
      if (consumeLife("projectile")) {
        scheduleNextProjectile2Spawn();
        return;
      }
      startProjectileDeathAnimation();
      return;
    }
    updatePlatformCoinSpawner(dt);
    checkPlatformCoinPickup();
    checkElevatorCoinPickup();

    if (physics.isPastBottomDeathLine(player)) {
      startProjectileDeathAnimation();
      return;
    }
    if (physics.isPastTopDeathLine(player)) {
      if (consumeLife("topDeathZone")) {
        return;
      }
      startProjectileDeathAnimation();
    }
  }

  function finishRunAndShowGameOver() {
    state.running = false;
    updateGameOverSummary();
    gameOverEl.classList.remove("hidden");
  }

  function startProjectileDeathAnimation() {
    state.running = false;
    state.projectile.active = false;
    state.projectile2.active = false;
    state.projectileDeathAnimActive = true;
    state.projectileDeathAnimElapsed = 0;
    state.projectileDeathStartSize = player.width;
    state.projectileDeathStartX = worldToScreenX(player.x + player.width * 0.5) - state.projectileDeathStartSize * 0.5;
    state.projectileDeathStartY = player.y + player.height * 0.5 - state.projectileDeathStartSize * 0.5;
    state.projectileDeathCurrentX = state.projectileDeathStartX;
    state.projectileDeathCurrentY = state.projectileDeathStartY;
    state.projectileDeathCurrentSize = state.projectileDeathStartSize;
  }

  function smoothStep01(t) {
    if (t <= 0) {
      return 0;
    }
    if (t >= 1) {
      return 1;
    }
    return t * t * (3 - 2 * t);
  }

  function updateProjectileDeathAnimation(dt) {
    state.projectileDeathAnimElapsed += dt;
    var moveDuration = Math.max(0.01, state.projectileDeathAnimMoveSeconds);
    var moveT = Math.min(1, state.projectileDeathAnimElapsed / moveDuration);
    var eased = smoothStep01(moveT);

    var targetSize = state.projectileDeathStartSize * 5;
    var targetX = canvas.width * 0.5 - targetSize * 0.5;
    var targetY = canvas.height * 0.5 - targetSize * 0.5;

    state.projectileDeathCurrentSize =
      state.projectileDeathStartSize + (targetSize - state.projectileDeathStartSize) * eased;
    state.projectileDeathCurrentX =
      state.projectileDeathStartX + (targetX - state.projectileDeathStartX) * eased;
    state.projectileDeathCurrentY =
      state.projectileDeathStartY + (targetY - state.projectileDeathStartY) * eased;

    if (state.projectileDeathAnimElapsed >= moveDuration + state.projectileDeathAnimHoldSeconds) {
      state.projectileDeathAnimActive = false;
      finishRunAndShowGameOver();
    }
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, C.topDeathLineY, canvas.width, C.bottomDeathLineY - C.topDeathLineY);
    ctx.clip();
    drawPlatforms();
    drawElevators();
    drawDoubleJumpIcon();
    drawSlowIcon();
    drawScoreBagIcon();
    drawLiveIcon();
    drawBlockerIcon();
    drawProjectile();
    drawProjectile2();
    drawPlatformCoinIcon();
    drawElevatorCoins();
    drawPlayer();
    ctx.restore();
    drawDeathLines();
    drawProjectileDeathAnimation();
    drawHud();
  }

  function findPlatformAtX(worldX) {
    var best = null;
    for (var i = 0; i < world.platforms.length; i += 1) {
      var p = world.platforms[i];
      if (worldX >= p.x && worldX <= p.x + p.width) {
        if (!best || p.y < best.y) {
          best = p;
        }
      }
    }
    return best;
  }

  function findNearestPlatformAhead(minX) {
    var nearest = null;
    for (var i = 0; i < world.platforms.length; i += 1) {
      var p = world.platforms[i];
      if (p.x >= minX) {
        if (!nearest || p.x < nearest.x) {
          nearest = p;
        }
      }
    }
    return nearest;
  }

  function scheduleNextDoubleJumpSpawn() {
    state.doubleJumpRespawnTimer = randomRange(
      C.doubleJumpRespawnMinSeconds,
      C.doubleJumpRespawnMaxSeconds
    );
  }

  function updateDoubleJumpEffect(dt) {
    var isBaseDoubleActive = state.gameMode === 2;

    if (state.tripleJumpTimeLeft > 0) {
      state.tripleJumpTimeLeft = Math.max(0, state.tripleJumpTimeLeft - dt);
      if (state.tripleJumpTimeLeft <= 0) {
        state.doubleJumpTimeLeft = state.storedDoubleJumpTimeLeft;
        state.storedDoubleJumpTimeLeft = 0;
        state.doubleJumpExpireFlashTimeLeft = 0.5;
      }
    } else if (state.doubleJumpTimeLeft > 0) {
      state.doubleJumpTimeLeft = Math.max(0, state.doubleJumpTimeLeft - dt);
      if (state.doubleJumpTimeLeft <= 0 && !isBaseDoubleActive) {
        state.doubleJumpExpireFlashTimeLeft = 0.5;
      }
    }

    if (state.doubleJumpExpireFlashTimeLeft > 0) {
      state.doubleJumpExpireFlashTimeLeft = Math.max(0, state.doubleJumpExpireFlashTimeLeft - dt);
    }

    var hasTripleJump = state.tripleJumpTimeLeft > 0;
    var hasDoubleJump = isBaseDoubleActive || state.doubleJumpTimeLeft > 0 || hasTripleJump;
    player.hasDoubleJump = hasDoubleJump;
    player.maxJumps = hasTripleJump ? 3 : (hasDoubleJump ? 2 : 1);
  }

  function updateDoubleJumpSpawner(dt) {
    if (state.score < C.doubleJumpUnlockScore) {
      return;
    }

    if (state.doubleJumpIcon.active) {
      var offscreenLeft = state.doubleJumpIcon.x + state.doubleJumpIcon.size < state.cameraX - 40;
      if (offscreenLeft) {
        state.doubleJumpIcon.active = false;
        scheduleNextDoubleJumpSpawn();
      }
      return;
    }

    if (!state.firstDoubleJumpSpawned) {
      if (trySpawnDoubleJumpIcon()) {
        state.firstDoubleJumpSpawned = true;
      }
      return;
    }

    if (state.doubleJumpRespawnTimer > 0) {
      state.doubleJumpRespawnTimer = Math.max(0, state.doubleJumpRespawnTimer - dt);
      return;
    }

    trySpawnDoubleJumpIcon();
  }

  function scheduleNextSlowSpawn() {
    state.slowRespawnTimer = randomRange(
      C.slowRespawnMinSeconds,
      C.slowRespawnMaxSeconds
    );
  }

  function trySpawnSlowIcon() {
    var icon = state.slowIcon;
    if (icon.active) {
      return false;
    }

    var rightEdgeX = state.cameraX + C.canvasWidth - 1;
    var platform = findNearestPlatformAhead(rightEdgeX);
    if (!platform) {
      return false;
    }

    var spawnX = platform.x + platform.width * 0.25 - icon.size * 0.5;
    var spawnY = platform.y - icon.size;
    if (!canSpawnMechanicIcon(spawnX, spawnY, icon.size)) {
      return false;
    }

    icon.x = spawnX;
    icon.y = spawnY;
    icon.active = true;
    return true;
  }

  function updateSlowSpawner(dt) {
    if (!state.slowUnlocked) {
      if (state.speedPercent >= C.slowUnlockSpeedPercent) {
        state.slowUnlocked = true;
        trySpawnSlowIcon();
      }
      return;
    }

    if (state.slowIcon.active) {
      var offscreenLeft = state.slowIcon.x + state.slowIcon.size < state.cameraX - 40;
      if (offscreenLeft) {
        state.slowIcon.active = false;
        scheduleNextSlowSpawn();
      }
      return;
    }

    if (state.slowRespawnTimer > 0) {
      state.slowRespawnTimer = Math.max(0, state.slowRespawnTimer - dt);
      return;
    }

    if (trySpawnSlowIcon()) {
      scheduleNextSlowSpawn();
    }
  }

  function scheduleNextScoreBagSpawn() {
    state.scoreBagRespawnTimer = randomRange(
      C.scoreBagRespawnMinSeconds,
      C.scoreBagRespawnMaxSeconds
    );
  }

  function scheduleNextLiveSpawn() {
    state.liveRespawnTimer = randomRange(
      C.liveRespawnMinSeconds,
      C.liveRespawnMaxSeconds
    );
  }

  function scheduleNextProjectileSpawn() {
    state.projectileRespawnTimer = randomRange(
      C.projectileRespawnMinSeconds,
      C.projectileRespawnMaxSeconds
    );
  }

  function scheduleNextProjectile2Spawn() {
    state.projectile2RespawnTimer = randomRange(
      C.projectile2RespawnMinSeconds,
      C.projectile2RespawnMaxSeconds
    );
  }

  function trySpawnProjectile(projectile) {
    if (projectile.active) {
      return false;
    }

    projectile.width = C.playerSize * 1.9;
    projectile.height = C.playerSize * 0.55;
    projectile.x = state.cameraX + C.canvasWidth + 20;

    var minY = C.topDeathLineY + 8;
    var maxY = C.bottomDeathLineY - projectile.height - 8;
    if (maxY <= minY) {
      return false;
    }
    projectile.y = randomRange(minY, maxY);
    projectile.active = true;
    return true;
  }

  function updateProjectileSpawner(dt) {
    var projectile = state.projectile;

    if (!state.projectileUnlocked) {
      if (state.score >= C.projectileUnlockScore) {
        state.projectileUnlocked = true;
        scheduleNextProjectileSpawn();
      }
      return;
    }

    if (projectile.active) {
      var speedFactor = Math.max(0, C.projectileSpeedMultiplier - 1);
      var worldSpeed = state.scrollSpeed * speedFactor;
      projectile.x -= worldSpeed * dt;

      var offscreenLeft = projectile.x + projectile.width < state.cameraX - 60;
      if (offscreenLeft) {
        projectile.active = false;
        scheduleNextProjectileSpawn();
      }
      return;
    }

    if (state.projectileRespawnTimer > 0) {
      state.projectileRespawnTimer = Math.max(0, state.projectileRespawnTimer - dt);
      return;
    }

    if (trySpawnProjectile(projectile)) {
      scheduleNextProjectileSpawn();
    }
  }

  function updateProjectile2Spawner(dt) {
    var projectile = state.projectile2;

    if (!state.projectile2Unlocked) {
      if (state.score >= C.projectile2UnlockScore) {
        state.projectile2Unlocked = true;
        scheduleNextProjectile2Spawn();
      }
      return;
    }

    if (projectile.active) {
      var speedFactor = C.projectile2SpeedMultiplier - 1;
      var worldSpeed = state.scrollSpeed * speedFactor;
      projectile.x -= worldSpeed * dt;

      var offscreenLeft = projectile.x + projectile.width < state.cameraX - 60;
      if (offscreenLeft) {
        projectile.active = false;
        scheduleNextProjectile2Spawn();
      }
      return;
    }

    if (state.projectile2RespawnTimer > 0) {
      state.projectile2RespawnTimer = Math.max(0, state.projectile2RespawnTimer - dt);
      return;
    }

    if (trySpawnProjectile(projectile)) {
      scheduleNextProjectile2Spawn();
    }
  }

  function scheduleNextBlockerSpawn() {
    state.blockerRespawnTimer = randomRange(
      C.blockerRespawnMinSeconds,
      C.blockerRespawnMaxSeconds
    );
  }

  function trySpawnBlocker() {
    var size = C.playerSize * C.blockerIconSizeRatio;

    var rightEdgeX = state.cameraX + C.canvasWidth - 1;
    var platform = findPlatformAtX(rightEdgeX);
    if (!platform) {
      return false;
    }

    var preferredX = rightEdgeX - size - 8;
    var minSpawnX = platform.x;
    var maxSpawnX = platform.x + platform.width - size;
    var spawnX = Math.min(Math.max(preferredX, minSpawnX), maxSpawnX);
    var spawnY = platform.y - size;
    if (!canSpawnMechanicIcon(spawnX, spawnY, size)) {
      return false;
    }

    state.blockerIcons.push({
      x: spawnX,
      y: spawnY,
      size: size
    });
    return true;
  }

  function updateBlockerSpawner(dt) {
    if (!state.blockerUnlocked) {
      if (state.score >= C.blockerUnlockScore) {
        state.blockerUnlocked = true;
        scheduleNextBlockerSpawn();
      }
      return;
    }

    state.blockerIcons = state.blockerIcons.filter(function (icon) {
      return icon.x + icon.size >= state.cameraX - 40;
    });

    if (state.blockerRespawnTimer > 0) {
      state.blockerRespawnTimer = Math.max(0, state.blockerRespawnTimer - dt);
    }

    if (state.blockerRespawnTimer <= 0 && trySpawnBlocker()) {
      scheduleNextBlockerSpawn();
    }
  }

  function trySpawnScoreBag() {
    var icon = state.scoreBagIcon;
    if (icon.active) {
      return false;
    }

    var rightEdgeX = state.cameraX + C.canvasWidth - 1;
    var platform = findPlatformAtX(rightEdgeX);
    if (!platform) {
      return false;
    }

    var preferredX = rightEdgeX - icon.size - 8;
    var minSpawnX = platform.x;
    var maxSpawnX = platform.x + platform.width - icon.size;
    var spawnX = Math.min(Math.max(preferredX, minSpawnX), maxSpawnX);
    var spawnY = platform.y - icon.size;
    if (!canSpawnMechanicIcon(spawnX, spawnY, icon.size)) {
      return false;
    }

    icon.x = spawnX;
    icon.y = spawnY;
    icon.active = true;
    return true;
  }

  function trySpawnLiveIcon() {
    var icon = state.liveIcon;
    if (icon.active || state.maxLives <= 1) {
      return false;
    }

    var rightEdgeX = state.cameraX + C.canvasWidth - 1;
    var platform = findPlatformAtX(rightEdgeX);
    if (!platform) {
      return false;
    }

    var preferredX = rightEdgeX - icon.size - 8;
    var minSpawnX = platform.x;
    var maxSpawnX = platform.x + platform.width - icon.size;
    var spawnX = Math.min(Math.max(preferredX, minSpawnX), maxSpawnX);
    var spawnY = platform.y - icon.size;
    if (!canSpawnMechanicIcon(spawnX, spawnY, icon.size)) {
      return false;
    }

    icon.x = spawnX;
    icon.y = spawnY;
    icon.active = true;
    return true;
  }

  function updateScoreBagSpawner(dt) {
    var icon = state.scoreBagIcon;
    if (icon.active) {
      var offscreenLeft = icon.x + icon.size < state.cameraX - 40;
      if (offscreenLeft) {
        icon.active = false;
        scheduleNextScoreBagSpawn();
      }
      return;
    }

    if (state.scoreBagRespawnTimer > 0) {
      state.scoreBagRespawnTimer = Math.max(0, state.scoreBagRespawnTimer - dt);
      return;
    }

    if (trySpawnScoreBag()) {
      scheduleNextScoreBagSpawn();
    }
  }

  function updateLiveSpawner(dt) {
    var icon = state.liveIcon;

    if (state.maxLives <= 1) {
      icon.active = false;
      state.liveUnlocked = false;
      state.liveRespawnTimer = 0;
      return;
    }

    if (!state.liveUnlocked) {
      if (state.score >= C.liveUnlockScore) {
        state.liveUnlocked = true;
        scheduleNextLiveSpawn();
      }
      return;
    }

    if (icon.active) {
      var offscreenLeft = icon.x + icon.size < state.cameraX - 40;
      if (offscreenLeft) {
        icon.active = false;
        scheduleNextLiveSpawn();
      }
      return;
    }

    if (state.liveRespawnTimer > 0) {
      state.liveRespawnTimer = Math.max(0, state.liveRespawnTimer - dt);
      return;
    }

    if (trySpawnLiveIcon()) {
      scheduleNextLiveSpawn();
    }
  }

  function scheduleNextPlatformCoinSpawn() {
    state.platformCoinTimer = randomRange(
      C.platformCoinRespawnMinSeconds,
      C.platformCoinRespawnMaxSeconds
    );
  }

  function trySpawnPlatformCoin() {
    var coin = state.platformCoinIcon;
    if (coin.active) {
      return false;
    }

    var rightEdgeX = state.cameraX + C.canvasWidth - 1;
    var platform = findPlatformAtX(rightEdgeX);
    if (!platform) {
      return false;
    }
    if (platform.id === state.lastPlatformCoinPlatformId) {
      return false;
    }

    var preferredX = rightEdgeX - coin.size - 6;
    var minX = platform.x;
    var maxX = platform.x + platform.width - coin.size;
    var spawnX = Math.min(Math.max(preferredX, minX), maxX);
    var spawnY = platform.y - coin.size;
    if (!canSpawnMechanicIcon(spawnX, spawnY, coin.size)) {
      return false;
    }

    coin.active = true;
    coin.x = spawnX;
    coin.y = spawnY;
    coin.platformId = platform.id;
    state.lastPlatformCoinPlatformId = platform.id;
    return true;
  }

  function updatePlatformCoinSpawner(dt) {
    var coin = state.platformCoinIcon;
    if (coin.active) {
      var offscreenLeft = coin.x + coin.size < state.cameraX - 40;
      if (offscreenLeft) {
        coin.active = false;
        scheduleNextPlatformCoinSpawn();
      }
      return;
    }

    if (state.platformCoinTimer > 0) {
      state.platformCoinTimer = Math.max(0, state.platformCoinTimer - dt);
      return;
    }

    if (trySpawnPlatformCoin()) {
      scheduleNextPlatformCoinSpawn();
    }
  }

  function trySpawnDoubleJumpIcon() {
    var icon = state.doubleJumpIcon;
    if (icon.active || state.score < C.doubleJumpUnlockScore) {
      return false;
    }

    var rightEdgeX = state.cameraX + C.canvasWidth - 1;
    var platform = findPlatformAtX(rightEdgeX);

    if (!platform) {
      return false;
    }

    var spawnX = platform.x + platform.width * 0.5 - icon.size * 0.5;
    var spawnY = platform.y - icon.size;
    if (!canSpawnMechanicIcon(spawnX, spawnY, icon.size)) {
      return false;
    }

    icon.active = true;
    icon.x = spawnX;
    icon.y = spawnY;
    return true;
  }

  function isRectIntersect(a, b) {
    return (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    );
  }

  function pushIconRectIfActive(rects, iconState) {
    if (!iconState.active) {
      return;
    }
    rects.push({
      x: iconState.x,
      y: iconState.y,
      w: iconState.size,
      h: iconState.size
    });
  }

  function getActiveMechanicIconRects() {
    var rects = [];
    pushIconRectIfActive(rects, state.doubleJumpIcon);
    pushIconRectIfActive(rects, state.slowIcon);
    pushIconRectIfActive(rects, state.scoreBagIcon);
    pushIconRectIfActive(rects, state.liveIcon);
    pushIconRectIfActive(rects, state.platformCoinIcon);
    for (var blockerIndex = 0; blockerIndex < state.blockerIcons.length; blockerIndex += 1) {
      var blockerIcon = state.blockerIcons[blockerIndex];
      rects.push({
        x: blockerIcon.x,
        y: blockerIcon.y,
        w: blockerIcon.size,
        h: blockerIcon.size
      });
    }

    var elevatorCoinSize = C.playerSize * C.coinIconSizeRatio;
    for (var i = 0; i < world.elevators.length; i += 1) {
      var elevator = world.elevators[i];
      if (!elevator.coinActive) {
        continue;
      }
      rects.push({
        x: elevator.x + elevator.width * 0.5 - elevatorCoinSize * 0.5,
        y: elevator.y - elevatorCoinSize,
        w: elevatorCoinSize,
        h: elevatorCoinSize
      });
    }

    return rects;
  }

  function canSpawnMechanicIcon(x, y, size) {
    var minGap = C.playerSize * 3;
    var candidate = { x: x, y: y, w: size, h: size };
    var activeRects = getActiveMechanicIconRects();

    for (var i = 0; i < activeRects.length; i += 1) {
      var r = activeRects[i];
      var expanded = {
        x: r.x - minGap,
        y: r.y - minGap,
        w: r.w + minGap * 2,
        h: r.h + minGap * 2
      };
      if (isRectIntersect(candidate, expanded)) {
        return false;
      }
    }

    return true;
  }

  function checkDoubleJumpIconPickup() {
    var icon = state.doubleJumpIcon;
    if (!icon.active) {
      return;
    }

    var playerRect = { x: player.x, y: player.y, w: player.width, h: player.height };
    var iconRect = { x: icon.x, y: icon.y, w: icon.size, h: icon.size };

    if (isRectIntersect(playerRect, iconRect)) {
      icon.active = false;
      var hasDoubleJumpNow = state.gameMode === 2 || state.doubleJumpTimeLeft > 0 || state.tripleJumpTimeLeft > 0;
      if (state.tripleJumpTimeLeft > 0) {
        state.tripleJumpTimeLeft += C.tripleJumpEffectSeconds;
      } else if (hasDoubleJumpNow) {
        state.storedDoubleJumpTimeLeft = state.doubleJumpTimeLeft;
        state.doubleJumpTimeLeft = 0;
        state.tripleJumpTimeLeft = C.tripleJumpEffectSeconds;
      } else {
        state.doubleJumpTimeLeft += C.doubleJumpEffectSeconds;
      }
      player.hasDoubleJump = true;
      scheduleNextDoubleJumpSpawn();
    }
  }

  function checkSlowIconPickup() {
    var icon = state.slowIcon;
    if (!icon.active) {
      return;
    }

    var playerRect = { x: player.x, y: player.y, w: player.width, h: player.height };
    var iconRect = { x: icon.x, y: icon.y, w: icon.size, h: icon.size };

    if (isRectIntersect(playerRect, iconRect)) {
      icon.active = false;
      state.scrollSpeed *= 0.5;
      state.speedSlowMultiplier *= 0.5;
      scheduleNextSlowSpawn();
    }
  }

  function checkScoreBagPickup() {
    var icon = state.scoreBagIcon;
    if (!icon.active) {
      return;
    }

    var playerRect = { x: player.x, y: player.y, w: player.width, h: player.height };
    var iconRect = { x: icon.x, y: icon.y, w: icon.size, h: icon.size };

    if (isRectIntersect(playerRect, iconRect)) {
      icon.active = false;
      state.bonusScore += C.scoreBagBonus;
      state.collectedBags += 1;
      scheduleNextScoreBagSpawn();
    }
  }

  function checkLivePickup() {
    var icon = state.liveIcon;
    if (!icon.active) {
      return;
    }

    var playerRect = { x: player.x, y: player.y, w: player.width, h: player.height };
    var iconRect = { x: icon.x, y: icon.y, w: icon.size, h: icon.size };

    if (isRectIntersect(playerRect, iconRect)) {
      icon.active = false;
      state.livesLeft = Math.min(state.maxLives, state.livesLeft + 1);
      updateLivesUi();
      scheduleNextLiveSpawn();
    }
  }

  function checkBlockerCollision() {
    var playerRect = { x: player.x, y: player.y, w: player.width, h: player.height };
    for (var i = 0; i < state.blockerIcons.length; i += 1) {
      var icon = state.blockerIcons[i];
      var blockerRect = {
        x: icon.x,
        y: icon.y,
        w: icon.size * (2 / 3),
        h: icon.size
      };
      if (isRectIntersect(playerRect, blockerRect)) {
        state.blockerIcons.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  function checkPlatformCoinPickup() {
    var coin = state.platformCoinIcon;
    if (!coin.active) {
      return;
    }

    var playerRect = { x: player.x, y: player.y, w: player.width, h: player.height };
    var coinRect = { x: coin.x, y: coin.y, w: coin.size, h: coin.size };

    if (isRectIntersect(playerRect, coinRect)) {
      coin.active = false;
      state.bonusScore += C.coinScoreBonus;
      state.collectedCoins += 1;
      scheduleNextPlatformCoinSpawn();
    }
  }

  function checkProjectileCollision() {
    return isProjectileCollision(state.projectile);
  }

  function checkProjectile2Collision() {
    return isProjectileCollision(state.projectile2);
  }

  function isProjectileCollision(projectile) {
    if (!projectile.active) {
      return false;
    }

    var playerRect = { x: player.x, y: player.y, w: player.width, h: player.height };
    var projectileRect = {
      x: projectile.x,
      y: projectile.y,
      w: projectile.width,
      h: projectile.height
    };
    return isRectIntersect(playerRect, projectileRect);
  }

  function checkElevatorCoinPickup() {
    var playerRect = { x: player.x, y: player.y, w: player.width, h: player.height };

    for (var i = 0; i < world.elevators.length; i += 1) {
      var e = world.elevators[i];
      if (!e.coinActive) {
        continue;
      }

      var coinSize = C.playerSize * C.coinIconSizeRatio;
      var coinX = e.x + e.width * 0.5 - coinSize * 0.5;
      var coinY = e.y - coinSize;
      var coinRect = { x: coinX, y: coinY, w: coinSize, h: coinSize };

      if (isRectIntersect(playerRect, coinRect)) {
        e.consumeCoin();
        state.bonusScore += C.coinScoreBonus;
        state.collectedCoins += 1;
      }
    }
  }

  function worldToScreenX(x) {
    return x - state.cameraX;
  }

  function drawParallaxStrip(image, speedFactor, y, height) {
    if (!image || image.width <= 0 || image.height <= 0 || height <= 0) {
      return false;
    }

    var scale = height / image.height;
    var tileWidth = image.width * scale;
    if (tileWidth <= 0) {
      return false;
    }

    var offset = -((state.cameraX * speedFactor) % tileWidth);
    if (offset > 0) {
      offset -= tileWidth;
    }

    for (var drawX = offset; drawX < canvas.width; drawX += tileWidth) {
      ctx.drawImage(image, drawX, y, tileWidth, height);
    }
    return true;
  }

  function drawBackground() {
    ctx.fillStyle = state.lifeLossFlashTimeLeft > 0 ? "#ffb14a" : "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var playableHeight = C.bottomDeathLineY - C.topDeathLineY;
    ctx.fillStyle = state.lifeLossFlashTimeLeft > 0 ? "#ffd08a" : "#e8f4ff";
    ctx.fillRect(0, C.topDeathLineY, canvas.width, playableHeight);

    if (state.lifeLossFlashTimeLeft > 0 || !useModernVisuals()) {
      return;
    }

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, C.topDeathLineY, canvas.width, playableHeight);
    ctx.clip();
    drawParallaxStrip(sceneArt.backgroundSky, 0.12, C.topDeathLineY, playableHeight);
    drawParallaxStrip(sceneArt.backgroundForeground, 0.32, C.topDeathLineY, playableHeight);
    ctx.restore();
  }

  function drawDeathLines() {
    ctx.strokeStyle = "#d70000";
    ctx.fillStyle = "#d70000";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(0, C.topDeathLineY);
    ctx.lineTo(canvas.width, C.topDeathLineY);
    ctx.stroke();

    ctx.fillRect(0, C.bottomDeathLineY, canvas.width, 18);
  }

  function drawPlatforms() {
    for (var i = 0; i < world.platforms.length; i += 1) {
      var p = world.platforms[i];
      var x = worldToScreenX(p.x);
      var drewModernPlatform = useModernVisuals() && drawSceneArtStrip(
        sceneArt.platform,
        x,
        p.y,
        p.width,
        PLATFORM_ART_RENDER_HEIGHT,
        {
          leftCapSourceX: 0,
          leftCapSourceWidth: PLATFORM_RIGHT_CAP_WIDTH,
          rightCapSourceX: sceneArt.platform ? sceneArt.platform.width - PLATFORM_RIGHT_CAP_WIDTH : 0,
          rightCapSourceWidth: PLATFORM_RIGHT_CAP_WIDTH,
          centerSourceX: 0,
          centerSourceWidth: sceneArt.platform ? sceneArt.platform.width - PLATFORM_RIGHT_CAP_WIDTH : 0,
          mirrorLeftCapFromRight: true
        }
      );
      if (!drewModernPlatform) {
        ctx.fillStyle = state.doubleJumpExpireFlashTimeLeft > 0 ? "#d70000" : "#111";
        ctx.fillRect(x, p.y, p.width, p.height);
      }
    }
  }

  function drawElevators() {
    for (var i = 0; i < world.elevators.length; i += 1) {
      var e = world.elevators[i];
      var x = worldToScreenX(e.x);
      var modernElevatorHeight = e.height;
      var retroElevatorHeight = C.platformHeight;
      var drewModernElevator = useModernVisuals() && drawSceneArtStrip(
        sceneArt.elevator,
        x,
        e.y,
        e.width,
        modernElevatorHeight,
        {
          leftCapSourceX: 0,
          leftCapSourceWidth: ELEVATOR_CAP_WIDTH,
          rightCapSourceX: sceneArt.elevator ? sceneArt.elevator.width - ELEVATOR_CAP_WIDTH : 0,
          rightCapSourceWidth: ELEVATOR_CAP_WIDTH,
          centerSourceX: ELEVATOR_CAP_WIDTH,
          centerSourceWidth: sceneArt.elevator ? sceneArt.elevator.width - ELEVATOR_CAP_WIDTH * 2 : 0,
          mirrorLeftCapFromRight: false
        }
      );
      if (!drewModernElevator) {
        ctx.fillStyle = state.doubleJumpExpireFlashTimeLeft > 0 ? "#d70000" : "#222";
        ctx.fillRect(x, e.y, e.width, retroElevatorHeight);
      }
    }
  }

  function drawPlayer() {
    if (state.projectileDeathAnimActive) {
      return;
    }

    var x = worldToScreenX(player.x);
    var y = player.y;
    var cx = x + player.width * 0.5;
    var cy = y + player.height * 0.5;
    var heroFrame = useModernVisuals() ? getCurrentHeroFrame() : null;

    ctx.save();
    ctx.translate(cx, cy);
    if (heroFrame) {
      var heroSourceRects = heroFrame.type === "jump" ? HERO_JUMP_FRAME_SOURCE_RECTS : HERO_WALK_FRAME_SOURCE_RECTS;
      var heroSourceRect = heroSourceRects[heroFrame.index] || {
        x: 0,
        y: 0,
        w: heroFrame.image.width,
        h: heroFrame.image.height
      };
      ctx.drawImage(
        heroFrame.image,
        heroSourceRect.x,
        heroSourceRect.y,
        heroSourceRect.w,
        heroSourceRect.h,
        -player.width * 0.5,
        -player.height * 0.5,
        player.width,
        player.height
      );
    } else {
      ctx.fillStyle = "#0077ff";
      var retroPlayerRenderSize = player.width * 0.5625;
      var retroHalfSize = retroPlayerRenderSize * 0.5;
      var rotationAbsSin = Math.abs(Math.sin(state.playerRotationRad));
      var rotationAbsCos = Math.abs(Math.cos(state.playerRotationRad));
      var retroBottomExtent = retroHalfSize * (rotationAbsSin + rotationAbsCos);
      var retroCenterYOffset = player.height * 0.5 - retroBottomExtent;
      ctx.translate(0, retroCenterYOffset);
      ctx.rotate(state.playerRotationRad);
      ctx.fillRect(
        -retroHalfSize,
        -retroHalfSize,
        retroPlayerRenderSize,
        retroPlayerRenderSize
      );
    }
    ctx.restore();
  }

  function getCurrentHeroFrame() {
    if (player.isGrounded && state.heroLandingAnimActive) {
      return getHeroLandingFrame();
    }
    if (!player.isGrounded) {
      return getHeroJumpFrame();
    }
    return getHeroWalkFrame();
  }

  function getHeroWalkFrame() {
    if (!sceneArt.heroFrames.length) {
      return null;
    }

    var loadedFrames = sceneArt.heroFrames.filter(function (frame) {
      return Boolean(frame);
    });
    if (!loadedFrames.length) {
      return null;
    }

    var frameIndex = Math.floor(state.runTimeSeconds / HERO_WALK_FRAME_SECONDS) % loadedFrames.length;
    return {
      image: loadedFrames[frameIndex] || null,
      index: frameIndex,
      type: "walk"
    };
  }

  function getHeroJumpFrame() {
    if (!sceneArt.heroJumpFrames.length) {
      return null;
    }

    var loadedFrames = sceneArt.heroJumpFrames.filter(function (frame) {
      return Boolean(frame);
    });
    if (!loadedFrames.length) {
      return null;
    }

    var frameIndex = 4;
    if (state.heroJumpAnimStarted && player.velocityY < 0) {
      frameIndex = Math.min(3, Math.floor(state.heroJumpAnimTime / HERO_JUMP_FRAME_SECONDS));
    }

    return {
      image: loadedFrames[frameIndex] || null,
      index: frameIndex,
      type: "jump"
    };
  }

  function getHeroLandingFrame() {
    if (!sceneArt.heroJumpFrames.length) {
      return null;
    }

    var loadedFrames = sceneArt.heroJumpFrames.filter(function (frame) {
      return Boolean(frame);
    });
    if (!loadedFrames.length) {
      return null;
    }

    var landingFrameIndex = 5 + Math.min(3, Math.floor(state.heroLandingAnimTime / HERO_JUMP_FRAME_SECONDS));
    return {
      image: loadedFrames[landingFrameIndex] || null,
      index: landingFrameIndex,
      type: "jump"
    };
  }

  function updateHeroJumpAnimation(dt, jumpStarted, landedThisFrame) {
    if (jumpStarted) {
      state.heroJumpAnimStarted = true;
      state.heroJumpAnimTime = 0;
      state.heroLandingAnimTime = 0;
      state.heroLandingAnimActive = false;
      return;
    }

    if (landedThisFrame) {
      state.heroJumpAnimStarted = false;
      state.heroJumpAnimTime = 0;
      state.heroLandingAnimTime = 0;
      state.heroLandingAnimActive = true;
      return;
    }

    if (player.isGrounded) {
      if (state.heroLandingAnimActive) {
        var landingMaxDuration = HERO_JUMP_FRAME_SECONDS * 4;
        state.heroLandingAnimTime = Math.min(landingMaxDuration, state.heroLandingAnimTime + dt);
        if (state.heroLandingAnimTime >= landingMaxDuration) {
          state.heroLandingAnimActive = false;
          state.heroLandingAnimTime = 0;
        }
        return;
      }
      state.heroJumpAnimStarted = false;
      return;
    }

    state.heroLandingAnimActive = false;
    state.heroLandingAnimTime = 0;

    if (!state.heroJumpAnimStarted) {
      return;
    }

    var maxDuration = HERO_JUMP_FRAME_SECONDS * 4;
    state.heroJumpAnimTime = Math.min(maxDuration, state.heroJumpAnimTime + dt);
  }

  function drawProjectileDeathIcon(x, y, size) {
    var s = size;
    var cx = x + s * 0.5;
    var baseW = s * 0.95;
    var baseH = s * 0.17;
    var stoneW = s * 0.62;
    var stoneH = s * 0.78;
    var stoneX = cx - stoneW * 0.5;
    var stoneY = y + s * 0.12;
    var r = stoneW * 0.5;

    ctx.fillStyle = "#2b3d4c";
    ctx.beginPath();
    ctx.moveTo(stoneX, stoneY + stoneH);
    ctx.lineTo(stoneX, stoneY + r);
    ctx.arc(cx, stoneY + r, r, Math.PI, 0);
    ctx.lineTo(stoneX + stoneW, stoneY + stoneH);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#2b3d4c";
    ctx.fillRect(cx - baseW * 0.5, y + s * 0.87, baseW, baseH);
    ctx.fillRect(cx - baseW * 0.4, y + s * 0.8, baseW * 0.8, baseH * 0.55);

    ctx.strokeStyle = "#f5f7fa";
    ctx.lineWidth = Math.max(2, s * 0.02);
    ctx.textAlign = "center";
    ctx.font = "bold " + Math.max(12, Math.floor(s * 0.13)) + "px Arial";
    ctx.strokeText("RIP", cx, y + s * 0.48);
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.18, y + s * 0.57);
    ctx.lineTo(cx + s * 0.18, y + s * 0.57);
    ctx.moveTo(cx - s * 0.18, y + s * 0.65);
    ctx.lineTo(cx + s * 0.18, y + s * 0.65);
    ctx.stroke();
    ctx.textAlign = "left";
  }

  function drawDoubleJumpIcon() {
    var icon = state.doubleJumpIcon;
    if (!icon.active) {
      return;
    }

    var x = worldToScreenX(icon.x);
    var y = icon.y;
    var s = icon.size;

    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = "#f39c12";
    ctx.fillStyle = "#f39c12";
    ctx.lineWidth = Math.max(5, s * 0.14);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(s * 0.2, s * 0.85);
    ctx.bezierCurveTo(s * 0.14, s * 0.52, s * 0.26, s * 0.38, s * 0.44, s * 0.62);
    ctx.bezierCurveTo(s * 0.56, s * 0.28, s * 0.72, s * 0.12, s * 0.88, s * 0.16);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(s * 0.88, s * 0.16);
    ctx.lineTo(s * 0.72, s * 0.1);
    ctx.lineTo(s * 0.76, s * 0.26);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  function drawSlowIcon() {
    var icon = state.slowIcon;
    if (!icon.active) {
      return;
    }

    var x = worldToScreenX(icon.x);
    var y = icon.y;
    var s = icon.size;
    var cx = x + s * 0.5;
    var cy = y + s * 0.5;

    ctx.fillStyle = "#f4c430";
    ctx.strokeStyle = "#111";
    ctx.lineWidth = Math.max(3, s * 0.06);
    ctx.beginPath();
    ctx.moveTo(cx, y);
    ctx.lineTo(x + s, cy);
    ctx.lineTo(cx, y + s);
    ctx.lineTo(x, cy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#111";
    ctx.textAlign = "center";
    ctx.font = "bold " + Math.max(10, Math.floor(s * 0.18)) + "px Arial";
    ctx.fillText("SLOW", cx, y + s * 0.45);
    ctx.fillText("DOWN", cx, y + s * 0.67);
    ctx.textAlign = "left";
  }

  function drawScoreBagIcon() {
    var icon = state.scoreBagIcon;
    if (!icon.active) {
      return;
    }

    var x = worldToScreenX(icon.x);
    var y = icon.y;
    var s = icon.size;
    if (useModernVisuals() && sceneArt.moneybag) {
      ctx.drawImage(sceneArt.moneybag, x, y, s, s);
      return;
    }

    var retroScale = 0.75;
    var retroSize = s * retroScale;
    var offset = (s - retroSize) * 0.5;
    x += offset;
    y += offset;
    s = retroSize;
    var cx = x + s * 0.5;

    ctx.fillStyle = "#95cf4a";
    ctx.beginPath();
    ctx.ellipse(cx, y + s * 0.6, s * 0.38, s * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#7abf32";
    ctx.beginPath();
    ctx.ellipse(cx - s * 0.08, y + s * 0.62, s * 0.26, s * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f08a6c";
    ctx.fillRect(x + s * 0.22, y + s * 0.3, s * 0.56, s * 0.08);

    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.font = "bold " + Math.max(18, Math.floor(s * 0.42)) + "px Arial";
    ctx.fillText("$", cx, y + s * 0.78);
    ctx.textAlign = "left";
  }

  function drawLiveIcon() {
    var icon = state.liveIcon;
    if (!icon.active) {
      return;
    }

    var x = worldToScreenX(icon.x);
    var y = icon.y;
    var s = icon.size;
    if (useModernVisuals() && sceneArt.heart) {
      ctx.drawImage(sceneArt.heart, x, y, s, s);
      return;
    }

    var cx = x + s * 0.5;
    var cy = y + s * 0.56;
    var radius = s * 0.22;
    ctx.strokeStyle = "#111";
    ctx.lineWidth = Math.max(2, s * 0.06);
    ctx.beginPath();
    ctx.moveTo(cx, y + s * 0.92);
    ctx.bezierCurveTo(x + s * 0.18, y + s * 0.7, x + s * 0.08, y + s * 0.38, x + s * 0.26, y + s * 0.22);
    ctx.bezierCurveTo(x + s * 0.4, y + s * 0.08, cx, y + s * 0.18, cx, y + s * 0.34);
    ctx.bezierCurveTo(cx, y + s * 0.18, x + s * 0.6, y + s * 0.08, x + s * 0.74, y + s * 0.22);
    ctx.bezierCurveTo(x + s * 0.92, y + s * 0.38, x + s * 0.82, y + s * 0.7, cx, y + s * 0.92);
    ctx.stroke();
  }

  function drawBlockerIcon() {
    for (var i = 0; i < state.blockerIcons.length; i += 1) {
      var icon = state.blockerIcons[i];
      var x = worldToScreenX(icon.x);
      var y = icon.y;
      var s = icon.size;
      if (useModernVisuals() && sceneArt.blocker) {
        ctx.drawImage(sceneArt.blocker, x, y, s, s);
        continue;
      }

      var bar = Math.max(4, s * 0.12);
      ctx.fillStyle = "#c81414";
      ctx.fillRect(x, y + s * 0.2, s, bar);
      ctx.fillRect(x, y + s * 0.65, s, bar);
      ctx.fillRect(x + s * 0.12, y + s * 0.1, bar, s * 0.8);
      ctx.fillRect(x + s * 0.76, y + s * 0.1, bar, s * 0.8);
    }
  }

  function drawProjectile() {
    drawProjectileShape(state.projectile);
  }

  function drawProjectile2() {
    drawProjectileShape(state.projectile2);
  }

  function drawProjectileShape(projectile) {
    if (!projectile.active) {
      return;
    }

    var x = worldToScreenX(projectile.x);
    var y = projectile.y;
    var w = projectile.width;
    var h = projectile.height;
    var rocketFrame = useModernVisuals() ? getProjectileRocketFrame() : null;
    if (rocketFrame) {
      ctx.drawImage(rocketFrame, x, y, w, h);
      return;
    }

    var retroScale = 0.75;
    var scaledW = w * retroScale;
    var scaledH = h * retroScale;
    x += (w - scaledW) * 0.5;
    y += (h - scaledH) * 0.5;
    w = scaledW;
    h = scaledH;

    var r = h * 0.5;

    ctx.fillStyle = "#c81414";
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r * 1.1, y);
    ctx.quadraticCurveTo(x + w, y + r, x + w - r * 1.1, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x - r * 0.8, y + r, x + r, y);
    ctx.closePath();
    ctx.fill();

    ctx.fillRect(x + w * 0.28, y + h * 0.08, Math.max(2, w * 0.03), h * 0.84);
    ctx.fillRect(x + w * 0.78, y + h * 0.08, Math.max(2, w * 0.03), h * 0.84);

    ctx.strokeStyle = "#c81414";
    ctx.lineWidth = Math.max(2, h * 0.08);
    for (var i = 0; i < 4; i += 1) {
      var ty = y + h * (0.18 + i * 0.2);
      ctx.beginPath();
      ctx.moveTo(x + w + 4, ty);
      ctx.lineTo(x + w + 18 + i * 9, ty);
      ctx.stroke();
    }
  }

  function getProjectileRocketFrame() {
    if (!sceneArt.rocket1 && !sceneArt.rocket2) {
      return null;
    }

    if (!sceneArt.rocket1) {
      return sceneArt.rocket2;
    }

    if (!sceneArt.rocket2) {
      return sceneArt.rocket1;
    }

    var animationStep = Math.floor(state.runTimeSeconds / ROCKET_ANIMATION_FRAME_SECONDS) % 5;
    return animationStep < 3 ? sceneArt.rocket1 : sceneArt.rocket2;
  }

  function drawProjectileDeathAnimation() {
    if (!state.projectileDeathAnimActive) {
      return;
    }
    drawProjectileDeathIcon(
      state.projectileDeathCurrentX,
      state.projectileDeathCurrentY,
      state.projectileDeathCurrentSize
    );
  }

  function drawCoinSymbol(screenX, screenY, size) {
    if (useModernVisuals() && sceneArt.coin) {
      ctx.drawImage(sceneArt.coin, screenX, screenY, size, size);
      return;
    }

    var retroScale = 0.75;
    var drawSize = size * retroScale;
    var offset = (size - drawSize) * 0.5;
    screenX += offset;
    screenY += offset;
    size = drawSize;
    var cx = screenX + size * 0.5;
    var cy = screenY + size * 0.5;

    ctx.fillStyle = "#f2d45a";
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#e7b73d";
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fff2b7";
    ctx.textAlign = "center";
    ctx.font = "bold " + Math.max(12, Math.floor(size * 0.45)) + "px Arial";
    ctx.fillText("$", cx, screenY + size * 0.7);
    ctx.textAlign = "left";
  }

  function drawPlatformCoinIcon() {
    var coin = state.platformCoinIcon;
    if (!coin.active) {
      return;
    }
    drawCoinSymbol(worldToScreenX(coin.x), coin.y, coin.size);
  }

  function drawElevatorCoins() {
    var coinSize = C.playerSize * C.coinIconSizeRatio;
    for (var i = 0; i < world.elevators.length; i += 1) {
      var e = world.elevators[i];
      if (!e.coinActive) {
        continue;
      }

      var x = worldToScreenX(e.x + e.width * 0.5 - coinSize * 0.5);
      var y = e.y - coinSize;
      drawCoinSymbol(x, y, coinSize);
    }
  }

  function drawHud() {
    ctx.fillStyle = "#111";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + state.score, 18, 36);
    ctx.font = "20px Arial";
    ctx.fillText("Max Score: " + sessionMaxScore, 18, 64);
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    if (state.gameMode === 2) {
      ctx.fillText("Double Jump: ON", canvas.width * 0.5, 36);
    } else if (state.doubleJumpTimeLeft > 0) {
      ctx.fillText("Double Jump: " + state.doubleJumpTimeLeft.toFixed(1) + "s", canvas.width * 0.5, 36);
    } else {
      ctx.fillText("Double Jump: OFF", canvas.width * 0.5, 36);
    }
    ctx.font = "20px Arial";
    if (state.tripleJumpTimeLeft > 0) {
      ctx.fillText("Tripple Jump: " + state.tripleJumpTimeLeft.toFixed(1) + "s", canvas.width * 0.5, 64);
    }
    ctx.textAlign = "right";
    ctx.font = "24px Arial";
    ctx.fillText("Speed +" + state.speedPercent + "%", canvas.width - 18, 36);
    ctx.textAlign = "left";
  }

  init();
})();
