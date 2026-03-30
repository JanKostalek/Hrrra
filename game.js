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
- Tripple jump: tripleJumpUnlockScore, tripleJumpEffectSeconds
- Tripple jump movement: tripleJumpGravity, tripleJumpInitialVelocity, tripleJumpHoldAcceleration, tripleJumpHoldMaxTime
- Slow icon: slowUnlockSpeedPercent, slowDownByPercent, slowIconSizeRatio, slowRespawnMinSeconds, slowRespawnMaxSeconds
- Money bag: scoreBagUnlockScore, scoreBagBonus, scoreBagIconSizeRatio, scoreBagRespawnMinSeconds, scoreBagRespawnMaxSeconds
- Cracked coin: crackedCoinUnlockScore, crackedCoinPenaltyPercent, crackedCoinRespawnMinSeconds, crackedCoinRespawnMaxSeconds
- Question coin: questionCoinUnlockScore, questionCoinRespawnMinSeconds, questionCoinRespawnMaxSeconds
- Live: liveUnlockScore, liveRespawnMinSeconds, liveRespawnMaxSeconds
- Shield: shieldUnlockScore, shieldRespawnMinSeconds, shieldRespawnMaxSeconds
- Magnet: magnetUnlockScore, magnetEffectSeconds, magnetRespawnMinSeconds, magnetRespawnMaxSeconds
- Blocker: blockerUnlockScore, blockerRespawnMinSeconds, blockerRespawnMaxSeconds
- Coins: platformCoinUnlockScore, coinScoreBonus, coinIconSizeRatio, platformCoinInitialDelaySeconds, platformCoinRespawnMinSeconds, platformCoinRespawnMaxSeconds
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
  var updateNoticeEl = document.getElementById("update-notice");
  var updateNoticeTitleEl = document.getElementById("update-notice-title");
  var updateNoticeMessageEl = document.getElementById("update-notice-message");
  var updateNoticeLaterBtn = document.getElementById("update-notice-later");
  var updateNoticeApplyBtn = document.getElementById("update-notice-apply");
  var preRunSelectScreenEl = document.getElementById("pre-run-select-screen");
  var preRunDetailScreenEl = document.getElementById("pre-run-detail-screen");
  var preRunJumpBtn = document.getElementById("pre-run-jump-btn");
  var preRunFullBtn = document.getElementById("pre-run-full-btn");
  var preRunEasyBtn = document.getElementById("pre-run-easy-btn");
  var preRunHardBtn = document.getElementById("pre-run-hard-btn");
  var preRunFullLockEl = document.getElementById("pre-run-full-lock");
  var preRunHardLockEl = document.getElementById("pre-run-hard-lock");
  var preRunBackBtn = document.getElementById("pre-run-back-btn");
  var preRunCompactBackBtn = document.getElementById("pre-run-compact-back-btn");
  var preRunCompactAdminBtn = document.getElementById("pre-run-compact-admin-btn");
  var preRunCompactStartBtn = document.getElementById("pre-run-compact-start-btn");
  var preRunTesterInfoBtn = document.getElementById("pre-run-tester-info-btn");
  var preRunFutureReleaseBtn = document.getElementById("pre-run-future-release-btn");
  var preRunDetailAdminBtn = document.getElementById("pre-run-detail-admin-btn");
  var APP_VERSION_INFO = window.HrrraVersionInfo || { versionCode: 0, versionName: "0.0.0" };
  var TESTER_INFO_URL = "https://hrrra.vercel.app/TESTER_INFO.md";
  var FUTURE_RELEASE_URL = "https://hrrra.vercel.app/future-release.html";
  var VERSION_INFO_URL = "https://hrrra.vercel.app/version.json";
  var STORE_URL = "https://play.google.com/store/apps/details?id=cz.hrrra.game";
  var STORE_MARKET_URL = "market://details?id=cz.hrrra.game";
  var preRunStartBtn = document.getElementById("pre-run-start-btn");
  var preRunDetailTitleEl = document.getElementById("pre-run-detail-title");
  var preRunDetailSubtitleEl = document.getElementById("pre-run-detail-subtitle");
  var preRunDetailLevelEl = document.getElementById("pre-run-detail-level");
  var preRunCompactLevelEl = document.getElementById("pre-run-compact-level");
  var preRunDetailLifeRulesEl = document.getElementById("pre-run-detail-life-rules");
  var preRunLevelGoalCopyEl = document.getElementById("pre-run-level-goal-copy");
  var preRunCompactGoalCopyEl = document.getElementById("pre-run-compact-goal-copy");
  var preRunSkinGridEl = document.getElementById("pre-run-skin-grid");
  var preRunSkinCopyEl = document.getElementById("pre-run-skin-copy");
  var preRunCompactShellEl = document.getElementById("pre-run-compact-shell");
  var preRunDetailFullContentEl = document.getElementById("pre-run-detail-full-content");
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
  var adminResetAllBtn = document.getElementById("admin-reset-all");
  var adminResetConfirmEl = document.getElementById("admin-reset-confirm");
  var adminResetConfirmCancelBtn = document.getElementById("admin-reset-confirm-cancel");
  var adminResetConfirmApplyBtn = document.getElementById("admin-reset-confirm-apply");
  var adminExportBtn = document.getElementById("admin-export");
  var adminCopyJsonBtn = document.getElementById("admin-copy-json");
  var adminImportFileBtn = document.getElementById("admin-import-file-btn");
  var adminImportTextBtn = document.getElementById("admin-import-text");
  var adminImportFileInput = document.getElementById("admin-import-file");
  var adminPrivacy = document.getElementById("admin-privacy");
  var adminForm = document.getElementById("admin-form");
  var mode1Wrap = document.getElementById("mode-1-wrap");
  var mode1Btn = document.getElementById("mode-1-btn");
  var mode1LivesEl = document.getElementById("mode-1-lives");
  var mode2Wrap = document.getElementById("mode-2-wrap");
  var mode2Btn = document.getElementById("mode-2-btn");
  var mode2LivesEl = document.getElementById("mode-2-lives");
  var levelFinishedEl = document.getElementById("level-finished");
  var levelFinishedTitleEl = document.getElementById("level-finished-title");
  var levelFinishedScoreEl = document.getElementById("level-finished-score");
  var levelFinishedRuntimeEl = document.getElementById("level-finished-runtime");
  var levelFinishedCoinsEl = document.getElementById("level-finished-coins");
  var levelFinishedBagsEl = document.getElementById("level-finished-bags");
  var levelFinishedContinueBtn = document.getElementById("level-finished-continue");
  var ADMIN_STORAGE_KEY_PREFIX = "hrrra_admin_config_v3_";
  var LEGACY_ADMIN_STORAGE_KEY_PREFIX = "hrrra_admin_config_v2_";
  var GLOBAL_ADMIN_STORAGE_KEY = "hrrra_admin_global_v1";
  var MAX_SCORE_STORAGE_KEY_PREFIX = "hrrra_max_score_v2_";
  var PLAYER_SKIN_PROGRESS_STORAGE_KEY = "hrrra_player_skin_progress_v1";
  var LEVEL_COUNT = 5;
  var configDefaultsSnapshot = {};
  var modeTuning = window.HrrraModeTuning || {};
  var difficultyTuning = window.HrrraDifficultyTuning || {};
  var levelTuning = window.HrrraLevelTuning || {};
  var sceneArt = {
    backgroundSky: null,
    backgroundForeground: null,
    level2CaveBack: null,
    level2CaveFront: null,
    level3VolcanoBack: null,
    level3VolcanoFront: null,
    level4ForestBack: null,
    level4ForestMid: null,
    level4ForestFront: null,
    level5Sky: null,
    level5Foreground: null,
    platform: null,
    elevator: null,
    blocker: null,
    coin: null,
    magnet: null,
    moneybag: null,
    heart: null,
    heroSkins: {},
    heroSkinIcons: {},
    rocket1: null,
    rocket2: null,
    teleportFrames: [],
    shieldBurstFrames: [],
    shieldIdleFrame: null,
    levelVariants: {}
  };
  var HERO_WALK_FRAME_FILENAMES = [
    "hero-walk-01.png",
    "hero-walk-02.png",
    "hero-walk-03.png",
    "hero-walk-04.png",
    "hero-walk-05.png",
    "hero-walk-06.png"
  ];
  var HERO_JUMP_FRAME_FILENAMES = [
    "hero-jump-01.png",
    "hero-jump-02.png",
    "hero-jump-03.png",
    "hero-jump-04.png",
    "hero-jump-05.png",
    "hero-jump-06.png",
    "hero-jump-07.png",
    "hero-jump-08.png",
    "hero-jump-09.png"
  ];
  var HERO_WALK_FRAME_FILENAMES_SKIN03 = [
    "hero-walk-01.png",
    "hero-walk-02.png",
    "hero-walk-03.png",
    "hero-walk-04.png",
    "hero-walk-05.png",
    "hero-walk-06.png",
    "hero-walk-07.png",
    "hero-walk-08.png"
  ];
  var HERO_JUMP_FRAME_FILENAMES_SKIN03 = [
    "hero-jump-01.png",
    "hero-jump-02.png",
    "hero-jump-03.png",
    "hero-jump-04.png",
    "hero-jump-05.png",
    "hero-jump-06.png",
    "hero-jump-07.png"
  ];
  var HERO_WALK_FRAME_FILENAMES_SKIN02 = [
    "hero-walk-01.png",
    "hero-walk-02.png",
    "hero-walk-03.png",
    "hero-walk-04.png",
    "hero-walk-05.png",
    "hero-walk-06.png",
    "hero-walk-07.png",
    "hero-walk-08.png",
    "hero-walk-09.png"
  ];
  var HERO_JUMP_FRAME_FILENAMES_SKIN02 = [
    "hero-jump-01.png",
    "hero-jump-02.png",
    "hero-jump-03.png",
    "hero-jump-04.png",
    "hero-jump-05.png",
    "hero-jump-06.png",
    "hero-jump-07.png"
  ];
  var HERO_WALK_FRAME_FILENAMES_SKIN04 = [
    "hero-walk-01.png",
    "hero-walk-02.png",
    "hero-walk-03.png",
    "hero-walk-04.png",
    "hero-walk-05.png",
    "hero-walk-06.png",
    "hero-walk-07.png",
    "hero-walk-08.png",
    "hero-walk-09.png",
    "hero-walk-10.png",
    "hero-walk-11.png",
    "hero-walk-12.png",
    "hero-walk-13.png",
    "hero-walk-14.png",
    "hero-walk-15.png",
    "hero-walk-16.png"
  ];
  var HERO_JUMP_FRAME_FILENAMES_SKIN04 = [
    "hero-jump-01.png",
    "hero-jump-02.png",
    "hero-jump-03.png",
    "hero-jump-04.png",
    "hero-jump-05.png",
    "hero-jump-06.png",
    "hero-jump-07.png"
  ];
  var SKIN_DISPLAY_NAMES = {
    Skin01: "Zyro",
    Skin02: "Vexi",
    Skin03: "Nemu",
    Skin04: "Krob"
  };
  var FUTURE_SKIN_SLOT_COUNT = 2;
  var FUTURE_SKIN_ICON_PATH = "assets/hero-question-mark-icon.png";
  var SKIN_OPTIONS = [
    { value: "Skin01", label: "Zyro" },
    { value: "Skin02", label: "Vexi" },
    { value: "Skin03", label: "Nemu" },
    { value: "Skin04", label: "Krob" }
  ];
  var DISCOVERABLE_SKIN_OPTIONS = ["Skin02", "Skin03", "Skin04"];
  var SKIN_UI_CONFIGS = {
    Skin01: {
      label: "Zyro",
      previewAssetPath: "assets/skins/Skin01/hero-walk-01.png",
      pickupAssetPath: "assets/skins/Skin01/hero-walk-01.png"
    },
    Skin02: {
      label: "Vexi",
      previewAssetPath: "assets/skins/Skin02/hero-icon.png",
      pickupAssetPath: "assets/skins/Skin02/hero-icon.png"
    },
    Skin03: {
      label: "Nemu",
      previewAssetPath: "assets/skins/Skin03/hero-icon.png",
      pickupAssetPath: "assets/skins/Skin03/hero-icon.png"
    },
    Skin04: {
      label: "Krob",
      previewAssetPath: "assets/skins/Skin04/hero-icon.png",
      pickupAssetPath: "assets/skins/Skin04/hero-icon.png"
    }
  };
  for (var skinOptionIndex = 0; skinOptionIndex < SKIN_OPTIONS.length; skinOptionIndex += 1) {
    sceneArt.heroSkins[SKIN_OPTIONS[skinOptionIndex].value] = {
      heroFrames: [],
      heroJumpFrames: []
    };
  }
  var SKIN_FRAME_CONFIGS = {
    Skin01: {
      walkFilenames: HERO_WALK_FRAME_FILENAMES,
      jumpFilenames: HERO_JUMP_FRAME_FILENAMES
    },
    Skin03: {
      walkFilenames: HERO_WALK_FRAME_FILENAMES_SKIN03,
      jumpFilenames: HERO_JUMP_FRAME_FILENAMES_SKIN03,
      usesFullFrameSourceRects: true,
      renderScale: 1.5
    },
    Skin02: {
      walkFilenames: HERO_WALK_FRAME_FILENAMES_SKIN02,
      jumpFilenames: HERO_JUMP_FRAME_FILENAMES_SKIN02,
      usesFullFrameSourceRects: true,
      renderScale: 1.25
    },
    Skin04: {
      walkFilenames: HERO_WALK_FRAME_FILENAMES_SKIN04,
      jumpFilenames: HERO_JUMP_FRAME_FILENAMES_SKIN04,
      usesFullFrameSourceRects: true,
      renderScale: 1.1,
      walkFrameSeconds: 0.032
    }
  };
  for (var sceneArtLevel = 1; sceneArtLevel <= LEVEL_COUNT; sceneArtLevel += 1) {
    sceneArt.levelVariants[sceneArtLevel] = {
      platform: null,
      elevator: null,
      blocker: null,
      coin: null,
      moneybag: null,
      heart: null,
      rocket1: null,
      rocket2: null
    };
  }
  var BACKGROUND_SKY_ART_PATH = "assets/level1/background_sky_tile.png";
  var BACKGROUND_FOREGROUND_ART_PATH = "assets/level1/background_foreground_tile.png";
  var LEVEL2_CAVE_BACK_ART_PATH = "assets/level2/background_back_tile.png";
  var LEVEL2_CAVE_FRONT_ART_PATH = "assets/level2/background_front_tile.png";
  var LEVEL3_VOLCANO_BACK_ART_PATH = "assets/level3/background_back_tile.png";
  var LEVEL3_VOLCANO_FRONT_ART_PATH = "assets/level3/background_front_tile.png";
  var LEVEL4_FOREST_BACK_ART_PATH = "assets/level4/background_back_tile.png";
  var LEVEL4_FOREST_MID_ART_PATH = "assets/level4/background_mid_tile.png";
  var LEVEL4_FOREST_FRONT_ART_PATH = "assets/level4/background_front_tile.png";
  var LEVEL5_SKY_ART_PATH = "assets/level5/background_sky_tile.png";
  var LEVEL5_FOREGROUND_ART_PATH = "assets/level5/background_foreground_tile.png";
  var PLATFORM_ART_PATH = "assets/platform-tile-clean.png";
  var ELEVATOR_ART_PATH = "assets/vytah01-clean.png";
  var BLOCKER_ART_PATH = "assets/blocker01-clean.png";
  var COIN_ART_PATH = "assets/coin01-clean.png";
  var MAGNET_ART_PATH = "assets/magnet.png";
  var MONEYBAG_ART_PATH = "assets/moneybag-clean.png";
  var HEART_ART_PATH = "assets/heart01.png";
  var LEVEL_SCENE_ART_FILENAMES = {
    platform: "platform.png",
    elevator: "elevator.png",
    blocker: "blocker.png",
    coin: "coin.png",
    moneybag: "moneybag.png",
    heart: "heart.png",
    rocket1: "projectile1.png",
    rocket2: "projectile2.png"
  };
  var TELEPORT_ART_PATHS = [
    "assets/teleport01.png",
    "assets/teleport02.png",
    "assets/teleport03.png"
  ];
  var SHIELD_BURST_ART_PATHS = [
    "assets/Bubble_burst/bubble-burst-01.png",
    "assets/Bubble_burst/bubble-burst-02.png",
    "assets/Bubble_burst/bubble-burst-03.png",
    "assets/Bubble_burst/bubble-burst-04.png",
    "assets/Bubble_burst/bubble-burst-05.png",
    "assets/Bubble_burst/bubble-burst-06.png",
    "assets/Bubble_burst/bubble-burst-07.png",
    "assets/Bubble_burst/bubble-burst-08.png",
    "assets/Bubble_burst/bubble-burst-09.png"
  ];
  var SHIELD_IDLE_ART_PATH = "assets/Bubble_burst/shield-idle.png";
  var HERO_WALK_FRAME_SOURCE_RECTS_SKIN01 = [
    { x: 40, y: 40, w: 80, h: 80 },
    { x: 40, y: 35, w: 80, h: 80 },
    { x: 40, y: 40, w: 80, h: 80 },
    { x: 40, y: 40, w: 85, h: 80 },
    { x: 40, y: 35, w: 85, h: 80 },
    { x: 40, y: 40, w: 80, h: 80 }
  ];
  var HERO_JUMP_FRAME_SOURCE_RECTS_SKIN01 = [
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
  var HERO_FRAME_SOURCE_RECTS_FULL_FRAME = [
    { x: 0, y: 0, w: 160, h: 160 },
    { x: 0, y: 0, w: 160, h: 160 },
    { x: 0, y: 0, w: 160, h: 160 },
    { x: 0, y: 0, w: 160, h: 160 },
    { x: 0, y: 0, w: 160, h: 160 },
    { x: 0, y: 0, w: 160, h: 160 },
    { x: 0, y: 0, w: 160, h: 160 },
    { x: 0, y: 0, w: 160, h: 160 },
    { x: 0, y: 0, w: 160, h: 160 }
  ];
  var ROCKET1_ART_PATH = "assets/rocket01-clean.png";
  var ROCKET2_ART_PATH = "assets/rocket02-clean.png";
  var PLATFORM_ART_RENDER_HEIGHT = 24;
  var PLATFORM_RIGHT_CAP_WIDTH = 16;
  var ELEVATOR_CAP_WIDTH = 76;
  var HERO_WALK_FRAME_SECONDS = 0.1;
  var HERO_JUMP_FRAME_SECONDS = 0.07;
  var ROCKET_ANIMATION_FRAME_SECONDS = 0.08;
  var TELEPORT_ANIMATION_FRAME_SECONDS = 0.09;
  var ADMIN_EXPORT_VERSION = 1;
  var TELEPORT_FINISH_HERO_SHRINK_SECONDS = 0.5;
  var TELEPORT_FINISH_SPARK_GROW_SECONDS = 0.5;

  function getLevelAssetPath(level, fileName) {
    return "assets/level" + String(level) + "/" + fileName;
  }

  function normalizeSkinName(value) {
    if (value === "Skin07") {
      return "Skin02";
    }
    for (var i = 0; i < SKIN_OPTIONS.length; i += 1) {
      if (SKIN_OPTIONS[i].value === value) {
        return value;
      }
    }
    return "Skin01";
  }

  function createDefaultSkinProgress() {
      return {
        unlockedSkins: {
          Skin01: true,
          Skin02: false,
          Skin03: false,
          Skin04: false
        },
      selectedSkin: "Skin01",
      highestLevelReached: 1,
      hardModeOverride: "default",
      fullModeOverride: "default"
    };
  }

  function sanitizeHighestLevelReached(value) {
    var parsed = Math.floor(Number(value));
    if (!Number.isFinite(parsed)) {
      return 1;
    }
    return Math.max(1, Math.min(LEVEL_COUNT, parsed));
  }

  function cloneSkinUnlocks(source) {
    var defaults = createDefaultSkinProgress().unlockedSkins;
    var clone = {};
    for (var i = 0; i < SKIN_OPTIONS.length; i += 1) {
      var skinName = SKIN_OPTIONS[i].value;
      clone[skinName] = skinName === "Skin01";
      if (source && Object.prototype.hasOwnProperty.call(source, skinName)) {
        clone[skinName] = Boolean(source[skinName]);
      } else if (Object.prototype.hasOwnProperty.call(defaults, skinName)) {
        clone[skinName] = Boolean(defaults[skinName]);
      }
    }
    clone.Skin01 = true;
    return clone;
  }

  function readPlayerSkinProgress() {
    var fallback = createDefaultSkinProgress();
    try {
      var raw = window.localStorage.getItem(PLAYER_SKIN_PROGRESS_STORAGE_KEY);
      if (!raw) {
        return fallback;
      }
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") {
        return fallback;
      }
      return {
        unlockedSkins: cloneSkinUnlocks(parsed.unlockedSkins),
        selectedSkin: normalizeSkinName(parsed.selectedSkin),
        highestLevelReached: sanitizeHighestLevelReached(parsed.highestLevelReached),
        hardModeOverride: parsed.hardModeOverride === "locked" || parsed.hardModeOverride === "unlocked"
          ? parsed.hardModeOverride
          : "default",
        fullModeOverride: parsed.fullModeOverride === "locked" || parsed.fullModeOverride === "unlocked"
          ? parsed.fullModeOverride
          : "default"
      };
    } catch (error) {
      return fallback;
    }
  }

  function writePlayerSkinProgress() {
    try {
      window.localStorage.setItem(
        PLAYER_SKIN_PROGRESS_STORAGE_KEY,
        JSON.stringify({
          unlockedSkins: cloneSkinUnlocks(state.unlockedSkins),
          selectedSkin: normalizeOwnedSkinName(C.selectedSkin),
          highestLevelReached: sanitizeHighestLevelReached(state.highestLevelReached),
          hardModeOverride: state.hardModeOverride === "locked" || state.hardModeOverride === "unlocked"
            ? state.hardModeOverride
            : "default",
          fullModeOverride: state.fullModeOverride === "locked" || state.fullModeOverride === "unlocked"
            ? state.fullModeOverride
            : "default"
        })
      );
    } catch (error) {
      // ignore broken localStorage data
    }
  }

  function isSkinUnlocked(skinName) {
    var normalized = normalizeSkinName(skinName);
    if (normalized === "Skin01") {
      return true;
    }
    return Boolean(state.unlockedSkins[normalized]);
  }

  function normalizeOwnedSkinName(value) {
    var normalized = normalizeSkinName(value);
    return isSkinUnlocked(normalized) ? normalized : "Skin01";
  }

  function loadPlayerSkinProgress() {
    var progress = readPlayerSkinProgress();
    state.unlockedSkins = cloneSkinUnlocks(progress.unlockedSkins);
    C.selectedSkin = normalizeOwnedSkinName(progress.selectedSkin);
    state.highestLevelReached = sanitizeHighestLevelReached(progress.highestLevelReached);
    state.hardModeOverride = progress.hardModeOverride;
    state.fullModeOverride = progress.fullModeOverride;
    writePlayerSkinProgress();
  }

  function sanitizeGlobalAdminNumber(key, value) {
    var parsed = Math.floor(Number(value));
    if (!Number.isFinite(parsed)) {
      return C[key];
    }
    if (key === "hardModeUnlockLevel") {
      return Math.max(1, Math.min(LEVEL_COUNT, parsed));
    }
    if (key === "fullModeUnlockJumpHardScore") {
      return Math.max(0, parsed);
    }
    return parsed;
  }

  function getHardModeUnlockLevel() {
    return sanitizeGlobalAdminNumber("hardModeUnlockLevel", C.hardModeUnlockLevel);
  }

  function isHardDifficultyUnlocked() {
    if (state.hardModeOverride === "unlocked") {
      return true;
    }
    if (state.hardModeOverride === "locked") {
      return false;
    }
    return state.highestLevelReached >= getHardModeUnlockLevel();
  }

  function getFullModeUnlockJumpHardScore() {
    return sanitizeGlobalAdminNumber("fullModeUnlockJumpHardScore", C.fullModeUnlockJumpHardScore);
  }

  function getJumpHardBestScore() {
    return readMaxScoreFromStorage(2, "hard");
  }

  function isFullModeUnlocked() {
    if (state.fullModeOverride === "unlocked") {
      return true;
    }
    if (state.fullModeOverride === "locked") {
      return false;
    }
    return getJumpHardBestScore() >= getFullModeUnlockJumpHardScore();
  }

  function getHardDifficultyLockText() {
    return "Locked - Reach " + getLevelDisplayName(getHardModeUnlockLevel()) + ".";
  }

  function getFullModeLockText() {
    return "Locked - Reach " + getFullModeUnlockJumpHardScore().toLocaleString("en-US") + " score in Jump Mode Hard.";
  }

  function normalizeUnlockedPreRunSelection() {
    if (!isFullModeUnlocked() && state.gameMode === 1) {
      state.gameMode = 2;
    }
    if (!isHardDifficultyUnlocked() && state.gameDifficulty === "hard") {
      state.gameDifficulty = "easy";
    }
  }

  function setModeUnlockOverride(kind, value) {
    var normalized = value === "locked" || value === "unlocked" ? value : "default";
    if (kind === "hard") {
      state.hardModeOverride = normalized;
    } else if (kind === "full") {
      state.fullModeOverride = normalized;
    }
    normalizeUnlockedPreRunSelection();
    writePlayerSkinProgress();
    renderPreRunScreen();
  }

  function unlockSkin(skinName) {
    var normalized = normalizeSkinName(skinName);
    if (normalized === "Skin01" || isSkinUnlocked(normalized)) {
      return false;
    }
    state.unlockedSkins[normalized] = true;
    state.skinUnlockToastText = getSkinDisplayName(normalized) + " unlocked";
    state.skinUnlockToastTimeLeft = 3;
    writePlayerSkinProgress();
    refreshPreRunBriefValues();
    return true;
  }

  function setSelectedSkinFromUi(skinName) {
    var nextSkin = normalizeOwnedSkinName(skinName);
    if (C.selectedSkin === nextSkin) {
      return;
    }
    C.selectedSkin = nextSkin;
    writePlayerSkinProgress();
    refreshPreRunSkinSelection();
  }

  function getSkinUiConfig(skinName) {
    return SKIN_UI_CONFIGS[normalizeSkinName(skinName)] || SKIN_UI_CONFIGS.Skin01;
  }

  function getSkinDisplayName(skinName) {
    var normalized = normalizeSkinName(skinName);
    return SKIN_DISPLAY_NAMES[normalized] || normalized;
  }

  function getSkinPreviewAssetPath(skinName) {
    return getSkinUiConfig(skinName).previewAssetPath;
  }

  function getSkinPickupIconAssetPath(skinName) {
    return getSkinUiConfig(skinName).pickupAssetPath;
  }

  function getSkinPickupLevelSettingKey(skinName, level) {
    return "skinPickup" + normalizeSkinName(skinName) + "Level" + String(level) + "Enabled";
  }

  function isSkinPickupLevelEnabled(skinName, level) {
    return Boolean(C[getSkinPickupLevelSettingKey(skinName, level)]);
  }

  function getAllowedSkinPickupLevels(skinName) {
    var levels = [];
    for (var level = 1; level <= LEVEL_COUNT; level += 1) {
      if (isSkinPickupLevelEnabled(skinName, level)) {
        levels.push(level);
      }
    }
    return levels;
  }

  function getUnopenedDiscoverableSkins() {
    var skins = [];
    for (var i = 0; i < DISCOVERABLE_SKIN_OPTIONS.length; i += 1) {
      var skinName = DISCOVERABLE_SKIN_OPTIONS[i];
      if (!isSkinUnlocked(skinName)) {
        skins.push(skinName);
      }
    }
    return skins;
  }

  function getSkinDiscoveryScoreRange(level, mode, difficulty) {
    var currentConfig = buildModeConfig(level, mode, difficulty);
    var upperBound = Math.max(0, Math.floor(currentConfig.finishScore || 0));
    var lowerBound = 0;
    if (level > 1) {
      var previousConfig = buildModeConfig(level - 1, mode, difficulty);
      lowerBound = Math.max(0, Math.floor(previousConfig.finishScore || 0));
    }
    if (upperBound <= lowerBound + 1) {
      return null;
    }
    return {
      min: lowerBound,
      max: upperBound
    };
  }

  function pickSkinDiscoveryTriggerScore(range) {
    if (!range) {
      return 0;
    }
    var width = Math.max(1, range.max - range.min);
    var minMargin = Math.min(Math.floor(width * 0.2), Math.max(1, width - 1));
    var maxMargin = Math.min(Math.floor(width * 0.15), Math.max(1, width - 1));
    var minScore = range.min + minMargin;
    var maxScore = range.max - maxMargin;
    if (maxScore <= minScore) {
      minScore = range.min + 1;
      maxScore = range.max - 1;
    }
    if (maxScore <= minScore) {
      return Math.max(range.min + 1, Math.min(range.max - 1, range.min + Math.floor(width * 0.5)));
    }
    return Math.floor(randomRange(minScore, maxScore));
  }

  function buildSkinDiscoveryPlan(mode, difficulty) {
    var unopenedSkins = getUnopenedDiscoverableSkins();
    if (!unopenedSkins.length) {
      return {
        active: false,
        skinName: "",
        level: 0,
        triggerScore: 0,
        assigned: false
      };
    }

    var targetSkin = unopenedSkins.length === 1
      ? unopenedSkins[0]
      : unopenedSkins[Math.floor(Math.random() * unopenedSkins.length)];
    var candidateLevels = getAllowedSkinPickupLevels(targetSkin);
    var validCandidates = [];

    for (var i = 0; i < candidateLevels.length; i += 1) {
      var targetLevel = candidateLevels[i];
      var scoreRange = getSkinDiscoveryScoreRange(targetLevel, mode, difficulty);
      if (!scoreRange) {
        continue;
      }
      validCandidates.push({
        level: targetLevel,
        triggerScore: pickSkinDiscoveryTriggerScore(scoreRange)
      });
    }

    if (!validCandidates.length) {
      return {
        active: false,
        skinName: "",
        level: 0,
        triggerScore: 0,
        assigned: false
      };
    }

    var chosenCandidate = validCandidates[Math.floor(Math.random() * validCandidates.length)];
    return {
      active: true,
      skinName: targetSkin,
      level: chosenCandidate.level,
      triggerScore: chosenCandidate.triggerScore,
      assigned: false
    };
  }

  function getHeroSkinAssetPath(skinName, fileName) {
    return "assets/skins/" + normalizeSkinName(skinName) + "/" + fileName;
  }

  function getHeroSkinFrameConfig(skinName) {
    return SKIN_FRAME_CONFIGS[normalizeSkinName(skinName)] || SKIN_FRAME_CONFIGS.Skin01;
  }

  function getSelectedHeroSkinName() {
    return normalizeSkinName(C.selectedSkin);
  }

  function getSelectedHeroSkinSceneArt() {
    var skinName = getSelectedHeroSkinName();
    if (sceneArt.heroSkins[skinName]) {
      return sceneArt.heroSkins[skinName];
    }
    return sceneArt.heroSkins.Skin01 || { heroFrames: [], heroJumpFrames: [] };
  }

  function getHeroRenderMetrics(scaleMultiplier) {
    var skinConfig = getHeroSkinFrameConfig(getSelectedHeroSkinName());
    var renderScale = skinConfig && skinConfig.renderScale ? skinConfig.renderScale : 1;
    if (typeof scaleMultiplier === "number") {
      renderScale *= scaleMultiplier;
    }
    var drawWidth = player.width * renderScale;
    var drawHeight = player.height * renderScale;
    return {
      drawWidth: drawWidth,
      drawHeight: drawHeight,
      drawX: -drawWidth * 0.5,
      drawY: player.height * 0.5 - drawHeight
    };
  }

  function getHeroWalkFrameSourceRects() {
    var skinName = getSelectedHeroSkinName();
    return getHeroSkinFrameConfig(skinName).usesFullFrameSourceRects ? HERO_FRAME_SOURCE_RECTS_FULL_FRAME : HERO_WALK_FRAME_SOURCE_RECTS_SKIN01;
  }

  function getHeroJumpFrameSourceRects() {
    var skinName = getSelectedHeroSkinName();
    return getHeroSkinFrameConfig(skinName).usesFullFrameSourceRects ? HERO_FRAME_SOURCE_RECTS_FULL_FRAME : HERO_JUMP_FRAME_SOURCE_RECTS_SKIN01;
  }

  function getHeroFrameSourceRect(heroFrame) {
    var skinName = getSelectedHeroSkinName();
    var skinConfig = getHeroSkinFrameConfig(skinName);
    if (!heroFrame || !heroFrame.image) {
      return { x: 0, y: 0, w: 0, h: 0 };
    }
    if (skinConfig.usesFullFrameSourceRects) {
      return {
        x: 0,
        y: 0,
        w: heroFrame.image.width,
        h: heroFrame.image.height
      };
    }
    var heroSourceRects = heroFrame.type === "jump" ? HERO_JUMP_FRAME_SOURCE_RECTS_SKIN01 : HERO_WALK_FRAME_SOURCE_RECTS_SKIN01;
    return heroSourceRects[heroFrame.index] || {
      x: 0,
      y: 0,
      w: heroFrame.image.width,
      h: heroFrame.image.height
    };
  }

  function getModeStorageKey(level, mode, difficulty) {
    return ADMIN_STORAGE_KEY_PREFIX + "level" + String(level) + "_" + String(difficulty) + "_" + String(mode);
  }

  function getLegacyModeStorageKey(mode, difficulty) {
    return LEGACY_ADMIN_STORAGE_KEY_PREFIX + String(difficulty) + "_" + String(mode);
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

  function clearAllHrrraStorageData() {
    try {
      var keysToRemove = [];
      for (var i = 0; i < window.localStorage.length; i += 1) {
        var key = window.localStorage.key(i);
        if (!key) {
          continue;
        }
        if (
          key === GLOBAL_ADMIN_STORAGE_KEY ||
          key === PLAYER_SKIN_PROGRESS_STORAGE_KEY ||
          key.indexOf(ADMIN_STORAGE_KEY_PREFIX) === 0 ||
          key.indexOf(LEGACY_ADMIN_STORAGE_KEY_PREFIX) === 0 ||
          key.indexOf(MAX_SCORE_STORAGE_KEY_PREFIX) === 0
        ) {
          keysToRemove.push(key);
        }
      }

      for (var keyIndex = 0; keyIndex < keysToRemove.length; keyIndex += 1) {
        window.localStorage.removeItem(keysToRemove[keyIndex]);
      }
    } catch (error) {
      // ignore storage failures
    }
  }

  function resetAllSettingsToDefaults() {
    setAdminOpen(false);
    clearAllHrrraStorageData();
    state.gameMode = 2;
    state.gameDifficulty = "easy";
    state.currentLevel = 1;
    applyModeConfig(state.currentLevel, state.gameMode, state.gameDifficulty);
    loadGlobalAdminConfig();
    loadPlayerSkinProgress();
    sessionMaxScore = readMaxScoreFromStorage(state.gameMode, state.gameDifficulty);
    openPreRunScreen();
    renderAdminForm();
    refreshPreRunBriefValues();
    updateLivesUi();
  }

  function setAdminResetConfirmOpen(isOpen) {
    if (!adminResetConfirmEl) {
      return;
    }
    adminResetConfirmEl.classList.toggle("hidden", !isOpen);
  }

  function getAllAdminFieldKeys() {
    var keys = {};
    for (var sectionIndex = 0; sectionIndex < adminSections.length; sectionIndex += 1) {
      var section = adminSections[sectionIndex];
      for (var fieldIndex = 0; fieldIndex < section.fields.length; fieldIndex += 1) {
        keys[section.fields[fieldIndex].key] = true;
      }
    }
    return Object.keys(keys);
  }

  function getAllGlobalAdminFieldKeys() {
    var keys = {};
    for (var sectionIndex = 0; sectionIndex < globalAdminSections.length; sectionIndex += 1) {
      var section = globalAdminSections[sectionIndex];
      for (var fieldIndex = 0; fieldIndex < section.fields.length; fieldIndex += 1) {
        var field = section.fields[fieldIndex];
        if (field.type === "skin-pickup-levels") {
          for (var skinOptionIndex = 0; skinOptionIndex < SKIN_OPTIONS.length; skinOptionIndex += 1) {
            for (var level = 1; level <= LEVEL_COUNT; level += 1) {
              keys[getSkinPickupLevelSettingKey(SKIN_OPTIONS[skinOptionIndex].value, level)] = true;
            }
          }
          continue;
        }
        keys[field.key] = true;
      }
    }
    return Object.keys(keys);
  }

  function getAdminUiStorageObject() {
    var stored = readGlobalAdminStorageObject();
    if (!stored.adminUiState || typeof stored.adminUiState !== "object") {
      stored.adminUiState = {};
    }
    if (!stored.adminUiState.globals || typeof stored.adminUiState.globals !== "object") {
      stored.adminUiState.globals = {};
    }
    if (!stored.adminUiState.difficulties || typeof stored.adminUiState.difficulties !== "object") {
      stored.adminUiState.difficulties = {};
    }
    if (!stored.adminUiState.levels || typeof stored.adminUiState.levels !== "object") {
      stored.adminUiState.levels = {};
    }
    return stored.adminUiState;
  }

  function writeAdminUiStorageObject(uiState) {
    var stored = readGlobalAdminStorageObject();
    stored.adminUiState = uiState;
    writeGlobalAdminStorageObject(stored);
  }

  function getDifficultyCollapseState(difficulty) {
    var uiState = getAdminUiStorageObject();
    if (Object.prototype.hasOwnProperty.call(uiState.difficulties, difficulty)) {
      return Boolean(uiState.difficulties[difficulty]);
    }
    return true;
  }

  function getGlobalCollapseState(key) {
    var uiState = getAdminUiStorageObject();
    if (Object.prototype.hasOwnProperty.call(uiState.globals, key)) {
      return Boolean(uiState.globals[key]);
    }
    return true;
  }

  function setGlobalCollapseState(key, isCollapsed) {
    var uiState = getAdminUiStorageObject();
    uiState.globals[key] = Boolean(isCollapsed);
    writeAdminUiStorageObject(uiState);
  }

  function setDifficultyCollapseState(difficulty, isCollapsed) {
    var uiState = getAdminUiStorageObject();
    uiState.difficulties[difficulty] = Boolean(isCollapsed);
    writeAdminUiStorageObject(uiState);
  }

  function getLevelCollapseStorageKey(difficulty, level) {
    return String(difficulty) + "_level_" + String(level);
  }

  function getLevelCollapseState(difficulty, level) {
    var uiState = getAdminUiStorageObject();
    var key = getLevelCollapseStorageKey(difficulty, level);
    if (Object.prototype.hasOwnProperty.call(uiState.levels, key)) {
      return Boolean(uiState.levels[key]);
    }
    return true;
  }

  function setLevelCollapseState(difficulty, level, isCollapsed) {
    var uiState = getAdminUiStorageObject();
    uiState.levels[getLevelCollapseStorageKey(difficulty, level)] = Boolean(isCollapsed);
    writeAdminUiStorageObject(uiState);
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
      } else if (typeof C[key] === "number" && Number.isFinite(value)) {
        C[key] = sanitizeGlobalAdminNumber(key, value);
      } else if (typeof C[key] === "string" && typeof value === "string") {
        C[key] = key === "selectedSkin" ? normalizeSkinName(value) : value;
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

  function readAdminStorageObject(level, mode, difficulty) {
    try {
      var raw = window.localStorage.getItem(getModeStorageKey(level, mode, difficulty));
      if (!raw && level === 1) {
        raw = window.localStorage.getItem(getLegacyModeStorageKey(mode, difficulty));
      }
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

  function loadAdminConfigFromStorage(level, mode, difficulty) {
    var stored = readAdminStorageObject(level, mode, difficulty);
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

  function saveAdminFieldToStorage(level, mode, difficulty, key, value) {
    var stored = readAdminStorageObject(level, mode, difficulty);
    stored[key] = value;
    try {
      window.localStorage.setItem(getModeStorageKey(level, mode, difficulty), JSON.stringify(stored));
    } catch (error) {
      // ignore write failures
    }
  }

  function writeAdminStorageObject(level, mode, difficulty, obj) {
    try {
      window.localStorage.setItem(getModeStorageKey(level, mode, difficulty), JSON.stringify(obj));
    } catch (error) {
      // ignore write failures
    }
  }

  function buildAdminSettingsExportObject() {
    var exportData = {
      format: "hrrra-admin-settings",
      version: ADMIN_EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      global: {},
      levels: {}
    };
    var globalKeys = getAllGlobalAdminFieldKeys();
    var adminKeys = getAllAdminFieldKeys();
    var levels = [1, 2, 3, 4, 5];
    var difficulties = ["easy", "hard"];
    var modes = [2, 1];
    var globalState = readGlobalAdminStorageObject();

    for (var globalKeyIndex = 0; globalKeyIndex < globalKeys.length; globalKeyIndex += 1) {
      var globalKey = globalKeys[globalKeyIndex];
      if (typeof C[globalKey] === "boolean") {
        exportData.global[globalKey] = Boolean(C[globalKey]);
      } else if (typeof C[globalKey] === "number" && Number.isFinite(C[globalKey])) {
        exportData.global[globalKey] = sanitizeGlobalAdminNumber(globalKey, C[globalKey]);
      } else if (typeof C[globalKey] === "string") {
        exportData.global[globalKey] = globalKey === "selectedSkin"
          ? normalizeSkinName(C[globalKey])
          : String(C[globalKey]);
      }
    }
    if (globalState.adminUiState && typeof globalState.adminUiState === "object") {
      exportData.adminUiState = globalState.adminUiState;
    }

    for (var levelIndex = 0; levelIndex < levels.length; levelIndex += 1) {
      var level = levels[levelIndex];
      exportData.levels[String(level)] = {};
      for (var difficultyIndex = 0; difficultyIndex < difficulties.length; difficultyIndex += 1) {
        var difficulty = difficulties[difficultyIndex];
        exportData.levels[String(level)][difficulty] = {};
        for (var modeIndex = 0; modeIndex < modes.length; modeIndex += 1) {
          var mode = modes[modeIndex];
          var built = buildModeConfig(level, mode, difficulty);
          var snapshot = {};
          for (var keyIndex = 0; keyIndex < adminKeys.length; keyIndex += 1) {
            var key = adminKeys[keyIndex];
            if (typeof built[key] === "number" && Number.isFinite(built[key])) {
              snapshot[key] = sanitizeConfigValue(key, built[key]);
            } else if (typeof built[key] === "boolean") {
              snapshot[key] = built[key];
            }
          }
          exportData.levels[String(level)][difficulty][String(mode)] = snapshot;
        }
      }
    }

    return exportData;
  }

  function triggerSettingsExportDownload() {
    var exportData = buildAdminSettingsExportObject();
    var json = JSON.stringify(exportData, null, 2);
    var blob = new Blob([json], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    var timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    link.href = url;
    link.download = "hrrra-settings-" + timestamp + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function copySettingsJsonToClipboard() {
    var json = JSON.stringify(buildAdminSettingsExportObject(), null, 2);
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      navigator.clipboard.writeText(json).then(function () {
        window.alert("Settings JSON copied to clipboard.");
      }).catch(function () {
        window.prompt("Copy settings JSON:", json);
      });
      return;
    }
    window.prompt("Copy settings JSON:", json);
  }

  function importSettingsJsonText(jsonText) {
    var parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (error) {
      window.alert("Settings import failed: invalid JSON.");
      return false;
    }

    if (!parsed || parsed.format !== "hrrra-admin-settings" || !parsed.levels || !parsed.global) {
      window.alert("Settings import failed: unsupported file format.");
      return false;
    }

    var globalKeys = getAllGlobalAdminFieldKeys();
    for (var globalKeyIndex = 0; globalKeyIndex < globalKeys.length; globalKeyIndex += 1) {
      var globalKey = globalKeys[globalKeyIndex];
      if (typeof parsed.global[globalKey] === "boolean") {
        saveGlobalAdminField(globalKey, parsed.global[globalKey]);
      } else if (typeof C[globalKey] === "number" && Number.isFinite(parsed.global[globalKey])) {
        saveGlobalAdminField(globalKey, sanitizeGlobalAdminNumber(globalKey, parsed.global[globalKey]));
      } else if (typeof C[globalKey] === "string" && typeof parsed.global[globalKey] === "string") {
        saveGlobalAdminField(
          globalKey,
          globalKey === "selectedSkin" ? normalizeSkinName(parsed.global[globalKey]) : parsed.global[globalKey]
        );
      }
    }

    if (parsed.adminUiState && typeof parsed.adminUiState === "object") {
      writeAdminUiStorageObject(parsed.adminUiState);
    }

    var adminKeys = getAllAdminFieldKeys();
    var levels = [1, 2, 3, 4, 5];
    var difficulties = ["easy", "hard"];
    var modes = [2, 1];

    for (var levelIndex = 0; levelIndex < levels.length; levelIndex += 1) {
      var level = levels[levelIndex];
      var levelEntry = parsed.levels[String(level)];
      if (!levelEntry || typeof levelEntry !== "object") {
        continue;
      }
      for (var difficultyIndex = 0; difficultyIndex < difficulties.length; difficultyIndex += 1) {
        var difficulty = difficulties[difficultyIndex];
        var difficultyEntry = levelEntry[difficulty];
        if (!difficultyEntry || typeof difficultyEntry !== "object") {
          continue;
        }
        for (var modeIndex = 0; modeIndex < modes.length; modeIndex += 1) {
          var mode = modes[modeIndex];
          var importedConfig = difficultyEntry[String(mode)] || difficultyEntry[mode];
          if (!importedConfig || typeof importedConfig !== "object") {
            continue;
          }

          var persisted = {};
          for (var keyIndex = 0; keyIndex < adminKeys.length; keyIndex += 1) {
            var key = adminKeys[keyIndex];
            var value = importedConfig[key];
            if (typeof value === "number" && Number.isFinite(value)) {
              persisted[key] = sanitizeConfigValue(key, value);
            } else if (typeof value === "boolean") {
              persisted[key] = value;
            }
          }
          writeAdminStorageObject(level, mode, difficulty, persisted);
        }
      }
    }

    loadCurrentLevelConfig();
    applyVisualThemeToUi();
    renderAdminForm();
    refreshPreRunBriefValues();
    updateLivesUi();
    return true;
  }

  function promptAndImportSettingsJson() {
    var pasted = window.prompt("Paste exported Hrrra settings JSON:");
    if (!pasted) {
      return;
    }
    if (importSettingsJsonText(pasted)) {
      window.alert("Settings imported.");
    }
  }

  function importSettingsFile(file) {
    if (!file) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function () {
      if (typeof reader.result !== "string") {
        window.alert("Settings import failed: file could not be read.");
        return;
      }
      if (importSettingsJsonText(reader.result)) {
        window.alert("Settings imported from file.");
      }
    };
    reader.onerror = function () {
      window.alert("Settings import failed: file could not be read.");
    };
    reader.readAsText(file);
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

    if (key === "finishScore") {
      return Math.max(0, Math.round(value));
    }

    if (key === "crackedCoinPenaltyPercent") {
      return Math.min(100, Math.max(0, Math.round(value)));
    }

    return value;
  }

  function buildModeConfig(level, mode, difficulty) {
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

    var levelOverrides = getLevelDifficultyModeOverrides(level, difficulty, mode);
    for (key in levelOverrides) {
      if (Object.prototype.hasOwnProperty.call(levelOverrides, key)) {
        cfg[key] = levelOverrides[key];
      }
    }

    var storageOverrides = readAdminStorageObject(level, mode, difficulty);
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

  function getLevelDisplayName(level) {
    return "Level " + String(level);
  }

  function getFinishScoreGoalText(finishScore) {
    if (!Number.isFinite(finishScore) || finishScore <= 0) {
      return "Final endless level. No finish teleport.";
    }
    return "Finish Level with " + finishScore.toLocaleString("en-US") + " score.";
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

  function getLevelDifficultyModeOverrides(level, difficulty, mode) {
    if (!levelTuning || typeof levelTuning !== "object") {
      return {};
    }
    var levelEntry = levelTuning[String(level)] || levelTuning[level];
    if (!levelEntry || typeof levelEntry !== "object") {
      return {};
    }
    var difficultyEntry = levelEntry[difficulty];
    if (!difficultyEntry || typeof difficultyEntry !== "object") {
      return {};
    }
    var modeEntry = difficultyEntry[String(mode)] || difficultyEntry[mode];
    if (!modeEntry || typeof modeEntry !== "object") {
      return {};
    }
    return modeEntry;
  }

  function applyModeConfig(level, mode, difficulty) {
    applyObjectConfig(configDefaultsSnapshot);
    applyObjectConfig(getModeFileOverrides(mode));
    applyObjectConfig(getDifficultyModeOverrides(difficulty, mode));
    applyObjectConfig(getLevelDifficultyModeOverrides(level, difficulty, mode));
    loadAdminConfigFromStorage(level, mode, difficulty);
  }

  snapshotConfigDefaults();

  var state = {
    running: true,
    adminPaused: false,
    preRunActive: false,
    preRunStep: "select",
    currentLevel: 1,
    highestLevelReached: 1,
    hardModeOverride: "default",
    fullModeOverride: "default",
    updateNoticeActive: false,
    updateNoticeForce: false,
    availableUpdateInfo: null,
    gameMode: 2,
    gameDifficulty: "easy",
    unlockedSkins: {
      Skin01: true,
      Skin02: false,
      Skin03: false,
      Skin04: false
    },
    skinDiscoveryPlan: {
      active: false,
      skinName: "",
      level: 0,
      triggerScore: 0,
      assigned: false
    },
    skinUnlockToastTimeLeft: 0,
    skinUnlockToastText: "",
    score: 0,
    scoreCarryOver: 0,
    bonusScore: 0,
    runTimeSeconds: 0,
    levelRunTimeSeconds: 0,
    collectedCoins: 0,
    collectedBags: 0,
    levelCollectedCoins: 0,
    levelCollectedBags: 0,
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
    pendingDoubleJumpTimeLeft: 0,
    pendingTripleJumpTimeLeft: 0,
    pendingStoredDoubleJumpTimeLeft: 0,
    pendingJumpTimerStart: false,
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
    crackedCoinRespawnTimer: 0,
    crackedCoinIcon: {
      active: false,
      x: 0,
      y: 0,
      size: C.playerSize * C.crackedCoinIconSizeRatio
    },
    questionCoinRespawnTimer: 0,
    questionCoinIcon: {
      active: false,
      x: 0,
      y: 0,
      size: C.playerSize * C.questionCoinIconSizeRatio,
      stakeScore: 0
    },
    liveUnlocked: false,
    liveRespawnTimer: 0,
    liveIcon: {
      active: false,
      x: 0,
      y: 0,
      size: C.playerSize * C.liveIconSizeRatio
    },
    shieldRespawnTimer: 0,
    shieldCharges: 0,
    shieldBurstActive: false,
    shieldBurstElapsed: 0,
    shieldBurstDuration: 0.5,
    shieldIcon: {
      active: false,
      x: 0,
      y: 0,
      size: C.playerSize * C.shieldIconSizeRatio
    },
    magnetRespawnTimer: 0,
    magnetTimeLeft: 0,
    magnetIcon: {
      active: false,
      x: 0,
      y: 0,
      size: C.playerSize * C.magnetIconSizeRatio
    },
    magnetAttractedItems: [],
    curseRespawnTimer: 0,
    curseTimeLeft: 0,
    blockedDistanceScore: 0,
    lastRawDistanceScore: 0,
    curseIcon: {
      active: false,
      x: 0,
      y: 0,
      size: C.playerSize * C.curseIconSizeRatio
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
    teleportFinishAnimActive: false,
    teleportFinishAnimElapsed: 0,
    teleportFinishAnimHeroStartSize: C.playerSize,
    teleportFinishAnimHeroCenterX: 0,
    teleportFinishAnimHeroCenterY: 0,
    questionCoinAnimActive: false,
    questionCoinAnimElapsed: 0,
    questionCoinAnimDuration: 3,
    questionCoinAnimStakeScore: 0,
    questionCoinAnimResult: "",
    questionCoinAnimDelta: 0,
    questionCoinAnimApplied: false,
    platformCoinTimer: C.platformCoinInitialDelaySeconds,
    lastPlatformCoinPlatformId: -1,
    platformCoinIcon: {
      active: false,
      x: 0,
      y: 0,
      size: C.playerSize * C.coinIconSizeRatio,
      platformId: -1
    },
    levelGoalReached: false,
    teleport: {
      active: false,
      x: 0,
      width: 96
    },
    skinPickupIcon: {
      active: false,
      size: C.playerSize * 0.82,
      skinName: ""
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
    respawnPoint: null,
    levelFinishedActive: false
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
        { key: "modernVisualsEnabled", label: "Modern visuals", type: "checkbox" },
        { key: "selectedSkin", label: "Skin", type: "select", options: SKIN_OPTIONS },
        { key: "skinPickupLevels", label: "Skin Pickup Level", type: "skin-pickup-levels" },
        { key: "hardModeUnlockLevel", label: "Jump Hard unlock at Level", type: "number", min: 1, max: LEVEL_COUNT, step: 1 },
        { key: "hardModeOverrideControls", label: "", type: "hard-mode-override-controls" },
        { key: "fullModeUnlockJumpHardScore", label: "Full Mode unlock on Jump Hard score", type: "number", min: 0, step: 1 },
        { key: "fullModeOverrideControls", label: "", type: "full-mode-override-controls" }
      ]
    }
  ];
  var adminSections = [
    {
      title: "Level Goal",
      fields: [
        { key: "finishScore", label: "Finish score (0 = endless)", min: 0, step: 1 }
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
      title: "Coin",
      fields: [
        { key: "platformCoinUnlockScore", label: "Unlock score" },
        { key: "coinScoreBonus", label: "Coin bonus" },
        { key: "platformCoinInitialDelaySeconds", label: "Initial delay sec" },
        { key: "platformCoinRespawnMinSeconds", label: "Respawn min sec" },
        { key: "platformCoinRespawnMaxSeconds", label: "Respawn max sec" }
      ]
    },
    {
      title: "Money Bag",
      fields: [
        { key: "scoreBagUnlockScore", label: "Unlock score" },
        { key: "scoreBagBonus", label: "Bonus score" },
        { key: "scoreBagRespawnMinSeconds", label: "Respawn min sec" },
        { key: "scoreBagRespawnMaxSeconds", label: "Respawn max sec" }
      ]
    },
    {
      title: "Cracked Coin",
      fields: [
        { key: "crackedCoinUnlockScore", label: "Unlock score" },
        { key: "crackedCoinPenaltyPercent", label: "Penalty percent" },
        { key: "crackedCoinRespawnMinSeconds", label: "Respawn min sec" },
        { key: "crackedCoinRespawnMaxSeconds", label: "Respawn max sec" }
      ]
    },
    {
      title: "Question Coin",
      fields: [
        { key: "questionCoinUnlockScore", label: "Unlock score" },
        { key: "questionCoinRespawnMinSeconds", label: "Respawn min sec" },
        { key: "questionCoinRespawnMaxSeconds", label: "Respawn max sec" }
      ]
    },
    {
      title: "Curse",
      fields: [
        { key: "curseUnlockScore", label: "Unlock score" },
        { key: "curseEffectSeconds", label: "Duration sec" },
        { key: "curseRespawnMinSeconds", label: "Respawn min sec" },
        { key: "curseRespawnMaxSeconds", label: "Respawn max sec" }
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
      title: "Projectile 1",
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
        { key: "doubleJumpUnlockScore", label: "Unlock score" },
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
        { key: "tripleJumpUnlockScore", label: "Unlock score" },
        { key: "tripleJumpGravity", label: "Gravity" },
        { key: "tripleJumpInitialVelocity", label: "Jump initial velocity" },
        { key: "tripleJumpHoldAcceleration", label: "Jump hold acceleration" },
        { key: "tripleJumpHoldMaxTime", label: "Jump hold max time" },
        { key: "tripleJumpEffectSeconds", label: "Effect seconds" }
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
      title: "Shield",
      fields: [
        { key: "shieldUnlockScore", label: "Unlock score" },
        { key: "shieldRespawnMinSeconds", label: "Respawn min sec" },
        { key: "shieldRespawnMaxSeconds", label: "Respawn max sec" }
      ]
    },
    {
      title: "Magnet",
      fields: [
        { key: "magnetUnlockScore", label: "Unlock score" },
        { key: "magnetEffectSeconds", label: "Duration sec" },
        { key: "magnetRespawnMinSeconds", label: "Respawn min sec" },
        { key: "magnetRespawnMaxSeconds", label: "Respawn max sec" }
      ]
    },
    {
      title: "Slow",
      fields: [
        { key: "slowUnlockSpeedPercent", label: "Unlock speed %" },
        { key: "slowDownByPercent", label: "Slow down by %" },
        { key: "slowRespawnMinSeconds", label: "Respawn min sec" },
        { key: "slowRespawnMaxSeconds", label: "Respawn max sec" }
      ]
    },
    {
      title: "Elevator",
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
    applyModeConfig(state.currentLevel, state.gameMode, state.gameDifficulty);
    loadGlobalAdminConfig();
    loadPlayerSkinProgress();
    applyVisualThemeToUi();
    sessionMaxScore = readMaxScoreFromStorage(state.gameMode, state.gameDifficulty);
    openPreRunScreen();
    attachInput();
    attachTouchControls();
    attachModeSwitch();
    applyGameModeToUi();
    attachAdminPanel();
    attachPreRunScreen();
    attachLevelFinishedScreen();
    renderAdminForm();
    updateOverlayUiVisibility();
    checkForAvailableUpdate();
    requestAnimationFrame(loop);
  }

  function primeSceneArt() {
    loadSceneArtAsset(BACKGROUND_SKY_ART_PATH, function (image) {
      sceneArt.backgroundSky = image;
    });
    loadSceneArtAsset(BACKGROUND_FOREGROUND_ART_PATH, function (image) {
      sceneArt.backgroundForeground = image;
    });
    loadSceneArtAsset(LEVEL2_CAVE_BACK_ART_PATH, function (image) {
      sceneArt.level2CaveBack = image;
    });
    loadSceneArtAsset(LEVEL2_CAVE_FRONT_ART_PATH, function (image) {
      sceneArt.level2CaveFront = image;
    });
    loadSceneArtAsset(LEVEL3_VOLCANO_BACK_ART_PATH, function (image) {
      sceneArt.level3VolcanoBack = image;
    });
    loadSceneArtAsset(LEVEL3_VOLCANO_FRONT_ART_PATH, function (image) {
      sceneArt.level3VolcanoFront = image;
    });
    loadSceneArtAsset(LEVEL4_FOREST_BACK_ART_PATH, function (image) {
      sceneArt.level4ForestBack = image;
    });
    loadSceneArtAsset(LEVEL4_FOREST_MID_ART_PATH, function (image) {
      sceneArt.level4ForestMid = image;
    });
    loadSceneArtAsset(LEVEL4_FOREST_FRONT_ART_PATH, function (image) {
      sceneArt.level4ForestFront = image;
    });
    loadSceneArtAsset(LEVEL5_SKY_ART_PATH, function (image) {
      sceneArt.level5Sky = image;
    });
    loadSceneArtAsset(LEVEL5_FOREGROUND_ART_PATH, function (image) {
      sceneArt.level5Foreground = image;
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
    loadSceneArtAsset(MAGNET_ART_PATH, function (image) {
      sceneArt.magnet = image;
    });
    loadSceneArtAsset(MONEYBAG_ART_PATH, function (image) {
      sceneArt.moneybag = image;
    });
    loadSceneArtAsset(HEART_ART_PATH, function (image) {
      sceneArt.heart = image;
    });
    primeHeroSkins();
    primeHeroSkinIcons();
    loadSceneArtAsset(ROCKET1_ART_PATH, function (image) {
      sceneArt.rocket1 = image;
    });
    loadSceneArtAsset(ROCKET2_ART_PATH, function (image) {
      sceneArt.rocket2 = image;
    });
    primeLevelVariantSceneArt();
    for (var teleportFrameIndex = 0; teleportFrameIndex < TELEPORT_ART_PATHS.length; teleportFrameIndex += 1) {
      (function (targetIndex) {
        loadSceneArtAsset(TELEPORT_ART_PATHS[targetIndex], function (image) {
          sceneArt.teleportFrames[targetIndex] = image;
        });
      })(teleportFrameIndex);
    }
    for (var shieldBurstFrameIndex = 0; shieldBurstFrameIndex < SHIELD_BURST_ART_PATHS.length; shieldBurstFrameIndex += 1) {
      (function (targetIndex) {
        loadSceneArtAsset(SHIELD_BURST_ART_PATHS[targetIndex], function (image) {
          sceneArt.shieldBurstFrames[targetIndex] = image;
        });
      })(shieldBurstFrameIndex);
    }
    loadSceneArtAsset(SHIELD_IDLE_ART_PATH, function (image) {
      sceneArt.shieldIdleFrame = image;
    });
  }

  function primeLevelVariantSceneArt() {
    for (var level = 1; level <= LEVEL_COUNT; level += 1) {
      primeLevelVariantSceneArtForLevel(level);
    }
  }

  function primeHeroSkins() {
    for (var i = 0; i < SKIN_OPTIONS.length; i += 1) {
      primeHeroSkin(SKIN_OPTIONS[i].value);
    }
  }

  function primeHeroSkinIcons() {
    for (var i = 0; i < SKIN_OPTIONS.length; i += 1) {
      (function (skinName) {
        loadSceneArtAsset(
          getSkinPickupIconAssetPath(skinName),
          function (image) {
            sceneArt.heroSkinIcons[skinName] = image;
          },
          function () {}
        );
      })(SKIN_OPTIONS[i].value);
    }
  }

  function primeHeroSkin(skinName) {
    var skinConfig = getHeroSkinFrameConfig(skinName);
    for (var heroFrameIndex = 0; heroFrameIndex < skinConfig.walkFilenames.length; heroFrameIndex += 1) {
      (function (targetSkinName, targetIndex) {
        loadSceneArtAsset(
          getHeroSkinAssetPath(targetSkinName, skinConfig.walkFilenames[targetIndex]),
          function (image) {
            if (sceneArt.heroSkins[targetSkinName]) {
              sceneArt.heroSkins[targetSkinName].heroFrames[targetIndex] = image;
            }
          },
          function () {}
        );
      })(skinName, heroFrameIndex);
    }

    for (var heroJumpFrameIndex = 0; heroJumpFrameIndex < skinConfig.jumpFilenames.length; heroJumpFrameIndex += 1) {
      (function (targetSkinName, targetIndex) {
        loadSceneArtAsset(
          getHeroSkinAssetPath(targetSkinName, skinConfig.jumpFilenames[targetIndex]),
          function (image) {
            if (sceneArt.heroSkins[targetSkinName]) {
              sceneArt.heroSkins[targetSkinName].heroJumpFrames[targetIndex] = image;
            }
          },
          function () {}
        );
      })(skinName, heroJumpFrameIndex);
    }
  }

  function primeLevelVariantSceneArtForLevel(level) {
    for (var key in LEVEL_SCENE_ART_FILENAMES) {
      if (!Object.prototype.hasOwnProperty.call(LEVEL_SCENE_ART_FILENAMES, key)) {
        continue;
      }

      (function (targetLevel, targetKey) {
        loadSceneArtAsset(
          getLevelAssetPath(targetLevel, LEVEL_SCENE_ART_FILENAMES[targetKey]),
          function (image) {
            if (sceneArt.levelVariants[targetLevel]) {
              sceneArt.levelVariants[targetLevel][targetKey] = image;
            }
          },
          function () {}
        );
      })(level, key);
    }
  }

  function loadSceneArtAsset(path, onReady, onError) {
    var image = new Image();
    image.onload = function () {
      onReady(image);
    };
    image.onerror = function () {
      if (typeof onError === "function") {
        onError();
      }
    };
    image.src = path;
  }

  function getCurrentLevelSceneArt(key) {
    var levelEntry = sceneArt.levelVariants[state.currentLevel];
    if (levelEntry && levelEntry[key]) {
      return levelEntry[key];
    }
    return sceneArt[key] || null;
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

  function getSkinSelectionHintText() {
    var unopenedSkins = getUnopenedDiscoverableSkins();
    if (!unopenedSkins.length) {
      return "All available skins are unlocked for this build.";
    }

    if (state.skinDiscoveryPlan.active && !state.skinDiscoveryPlan.assigned) {
      return "This run can reveal " + getSkinDisplayName(state.skinDiscoveryPlan.skinName) + " in Level " + state.skinDiscoveryPlan.level + ".";
    }

    return "A hidden skin can appear once per run in Level 3 or 4.";
  }

  function refreshPreRunSkinSelection() {
    if (!preRunSkinGridEl) {
      return;
    }

    preRunSkinGridEl.innerHTML = "";
    for (var i = 0; i < SKIN_OPTIONS.length; i += 1) {
      var skinName = SKIN_OPTIONS[i].value;
      var isUnlocked = isSkinUnlocked(skinName);
      var skinBtn = document.createElement("button");
      skinBtn.type = "button";
      skinBtn.className = "pre-run-skin-btn";
      skinBtn.dataset.skin = skinName;
      if (!isUnlocked) {
        skinBtn.classList.add("locked");
        skinBtn.disabled = true;
      }
      if (C.selectedSkin === skinName && isUnlocked) {
        skinBtn.classList.add("selected");
      }

      var preview = document.createElement("span");
      preview.className = "pre-run-skin-preview";
      var previewImg = document.createElement("img");
      previewImg.className = "pre-run-skin-preview-img pre-run-skin-preview-" + skinName.toLowerCase();
      previewImg.src = getSkinPreviewAssetPath(skinName);
      previewImg.alt = getSkinDisplayName(skinName);
      preview.appendChild(previewImg);

      var nameEl = document.createElement("span");
      nameEl.className = "pre-run-skin-name";
      nameEl.textContent = getSkinDisplayName(skinName);

      var statusEl = document.createElement("span");
      statusEl.className = "pre-run-skin-status";
      if (isUnlocked) {
        statusEl.textContent = C.selectedSkin === skinName ? "Selected" : "Unlocked";
      } else {
        statusEl.textContent = "Locked";
      }

      skinBtn.appendChild(preview);
      skinBtn.appendChild(nameEl);
      skinBtn.appendChild(statusEl);
      preRunSkinGridEl.appendChild(skinBtn);
    }

    for (var futureSkinIndex = 0; futureSkinIndex < FUTURE_SKIN_SLOT_COUNT; futureSkinIndex += 1) {
      var futureSkinCard = document.createElement("div");
      futureSkinCard.className = "pre-run-skin-btn future";
      futureSkinCard.setAttribute("aria-hidden", "true");

      var futurePreview = document.createElement("span");
      futurePreview.className = "pre-run-skin-preview";
      var futurePreviewImg = document.createElement("img");
      futurePreviewImg.className = "pre-run-skin-preview-img pre-run-skin-preview-future";
      futurePreviewImg.src = FUTURE_SKIN_ICON_PATH;
      futurePreviewImg.alt = "Future hero";
      futurePreview.appendChild(futurePreviewImg);

      var futureNameEl = document.createElement("span");
      futureNameEl.className = "pre-run-skin-name";
      futureNameEl.textContent = "????";

      var futureStatusEl = document.createElement("span");
      futureStatusEl.className = "pre-run-skin-status";
      futureStatusEl.textContent = "Soon";

      futureSkinCard.appendChild(futurePreview);
      futureSkinCard.appendChild(futureNameEl);
      futureSkinCard.appendChild(futureStatusEl);
      preRunSkinGridEl.appendChild(futureSkinCard);
    }

    if (preRunSkinCopyEl) {
      preRunSkinCopyEl.textContent = getSkinSelectionHintText();
    }
  }

  function refreshPreRunBriefValues() {
    var compactLevelBriefing = state.currentLevel > 1;
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
    if (preRunDetailLevelEl) {
      preRunDetailLevelEl.textContent = getLevelDisplayName(state.currentLevel);
    }
    if (preRunCompactLevelEl) {
      preRunCompactLevelEl.textContent = getLevelDisplayName(state.currentLevel);
    }
    if (preRunLevelGoalCopyEl) {
      preRunLevelGoalCopyEl.textContent = getFinishScoreGoalText(C.finishScore);
    }
    if (preRunCompactGoalCopyEl) {
      preRunCompactGoalCopyEl.textContent = getFinishScoreGoalText(C.finishScore);
    }
    if (preRunStartBtn) {
      preRunStartBtn.textContent = state.currentLevel > 1 ? "Continue" : "Start Run";
    }
    if (preRunCompactStartBtn) {
      preRunCompactStartBtn.textContent = "Start";
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
    refreshPreRunSkinSelection();
    if (preRunBackBtn) {
      preRunBackBtn.textContent = compactLevelBriefing ? "Exit Run" : "Back";
      preRunBackBtn.setAttribute("aria-label", compactLevelBriefing ? "Exit run and go back" : "Back to mode selection");
    }
  }

  function renderPreRunScreen() {
    var hardUnlocked = isHardDifficultyUnlocked();
    var fullUnlocked = isFullModeUnlocked();
    var compactLevelBriefing = state.preRunStep === "details" && state.currentLevel > 1;

    normalizeUnlockedPreRunSelection();

    if (preRunSelectScreenEl) {
      preRunSelectScreenEl.classList.toggle("hidden", state.preRunStep !== "select");
    }
    if (preRunDetailScreenEl) {
      preRunDetailScreenEl.classList.toggle("hidden", state.preRunStep !== "details");
    }
    if (preRunCompactShellEl) {
      preRunCompactShellEl.classList.toggle("hidden", !compactLevelBriefing);
    }
    if (preRunDetailFullContentEl) {
      preRunDetailFullContentEl.classList.toggle("hidden", compactLevelBriefing);
    }
    if (preRunEasyBtn) {
      preRunEasyBtn.classList.toggle("active", state.gameDifficulty === "easy");
    }
    if (preRunHardBtn) {
      preRunHardBtn.classList.toggle("active", state.gameDifficulty === "hard");
      preRunHardBtn.classList.toggle("locked", !hardUnlocked);
      preRunHardBtn.disabled = !hardUnlocked;
      preRunHardBtn.title = hardUnlocked ? "" : getHardDifficultyLockText();
      preRunHardBtn.setAttribute("aria-disabled", hardUnlocked ? "false" : "true");
    }
    if (preRunHardLockEl) {
      preRunHardLockEl.classList.toggle("hidden", hardUnlocked);
      preRunHardLockEl.textContent = getHardDifficultyLockText();
    }
    if (preRunFullBtn) {
      preRunFullBtn.classList.toggle("locked", !fullUnlocked);
      preRunFullBtn.disabled = !fullUnlocked;
      preRunFullBtn.title = fullUnlocked ? "" : getFullModeLockText();
      preRunFullBtn.setAttribute("aria-disabled", fullUnlocked ? "false" : "true");
    }
    if (preRunFullLockEl) {
      preRunFullLockEl.classList.toggle("hidden", fullUnlocked);
      preRunFullLockEl.textContent = getFullModeLockText();
    }
  }

  function isNativeAndroidPlatform() {
    return !!(
      window.Capacitor &&
      typeof window.Capacitor.getPlatform === "function" &&
      window.Capacitor.getPlatform() === "android"
    );
  }

  function setUpdateNoticeOpen(isOpen, forceUpdate) {
    state.updateNoticeActive = Boolean(isOpen);
    state.updateNoticeForce = Boolean(forceUpdate);
    if (!updateNoticeEl) {
      return;
    }
    updateNoticeEl.classList.toggle("hidden", !state.updateNoticeActive);
    if (updateNoticeLaterBtn) {
      updateNoticeLaterBtn.classList.toggle("hidden", state.updateNoticeForce);
    }
  }

  function applyAvailableUpdateInfo(info) {
    state.availableUpdateInfo = info;
    if (updateNoticeTitleEl) {
      updateNoticeTitleEl.textContent = "New Version Available";
    }
    if (updateNoticeMessageEl) {
      var versionLabel = info.versionName ? " " + info.versionName : "";
      updateNoticeMessageEl.textContent =
        info.message ||
        ("Hrrra" + versionLabel + " is now available in Google Play. Update now to get the latest fixes and improvements.");
    }
    if (updateNoticeApplyBtn) {
      updateNoticeApplyBtn.textContent = info.forceUpdate ? "Update now" : "Open update";
    }
    setUpdateNoticeOpen(true, info.forceUpdate);
  }

  function openStoreUpdatePage() {
    var targetUrl =
      (state.availableUpdateInfo && state.availableUpdateInfo.storeUrl) || STORE_URL;
    if (isNativeAndroidPlatform()) {
      try {
        window.location.href = STORE_MARKET_URL;
      } catch (error) {}
      window.setTimeout(function () {
        window.open(targetUrl, "_blank");
      }, 700);
      return;
    }
    window.open(targetUrl, "_blank");
  }

  function checkForAvailableUpdate() {
    if (!isNativeAndroidPlatform() || typeof window.fetch !== "function") {
      return;
    }

    var requestUrl = VERSION_INFO_URL + "?t=" + Date.now();
    window
      .fetch(requestUrl, { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Version request failed.");
        }
        return response.json();
      })
      .then(function (data) {
        if (!data || !Number.isFinite(Number(data.latestVersionCode))) {
          return;
        }
        var latestVersionCode = Number(data.latestVersionCode);
        var minSupportedVersionCode = Number.isFinite(Number(data.minSupportedVersionCode))
          ? Number(data.minSupportedVersionCode)
          : 0;
        if (latestVersionCode <= APP_VERSION_INFO.versionCode) {
          return;
        }
        applyAvailableUpdateInfo({
          versionCode: latestVersionCode,
          versionName: data.latestVersionName || "",
          storeUrl: data.storeUrl || STORE_URL,
          message: data.message || "",
          forceUpdate: APP_VERSION_INFO.versionCode < minSupportedVersionCode
        });
      })
      .catch(function () {});
  }

  function loadCurrentLevelConfig() {
    applyModeConfig(state.currentLevel, state.gameMode, state.gameDifficulty);
    loadGlobalAdminConfig();
    C.selectedSkin = normalizeOwnedSkinName(C.selectedSkin);
    sessionMaxScore = readMaxScoreFromStorage(state.gameMode, state.gameDifficulty);
  }

  function prepareRunSetup(mode, difficulty) {
    state.gameMode = mode === 1 ? 1 : 2;
    state.gameDifficulty = difficulty === "hard" ? "hard" : "easy";
    normalizeUnlockedPreRunSelection();
    state.currentLevel = 1;
    state.skinDiscoveryPlan = buildSkinDiscoveryPlan(state.gameMode, state.gameDifficulty);
    state.scoreCarryOver = 0;
    state.runTimeSeconds = 0;
    state.collectedCoins = 0;
    state.collectedBags = 0;
    loadCurrentLevelConfig();
    restartGame(true);
    state.preRunActive = true;
    applyResponsiveLayout();
    renderAdminForm();
    refreshPreRunBriefValues();
    applyGameModeToUi();
    renderPreRunScreen();
  }

  function prepareLevelContinuation(level) {
    var carryDoubleJumpTime = 0;
    var carryTripleJumpTime = 0;
    var carryStoredDoubleJumpTime = 0;

    if (state.tripleJumpTimeLeft > 0) {
      carryTripleJumpTime = state.tripleJumpTimeLeft * 2;
      carryStoredDoubleJumpTime = state.storedDoubleJumpTimeLeft * 2;
    } else if (state.doubleJumpTimeLeft > 0) {
      carryDoubleJumpTime = state.doubleJumpTimeLeft * 2;
    }

    state.currentLevel = Math.max(1, Math.min(LEVEL_COUNT, level));
    state.highestLevelReached = Math.max(state.highestLevelReached, state.currentLevel);
    writePlayerSkinProgress();
    loadCurrentLevelConfig();
    restartGame(false);
    state.pendingDoubleJumpTimeLeft = carryDoubleJumpTime;
    state.pendingTripleJumpTimeLeft = carryTripleJumpTime;
    state.pendingStoredDoubleJumpTimeLeft = carryStoredDoubleJumpTime;
    state.pendingJumpTimerStart =
      carryDoubleJumpTime > 0 || carryTripleJumpTime > 0 || carryStoredDoubleJumpTime > 0;
    state.doubleJumpTimeLeft = carryDoubleJumpTime;
    state.tripleJumpTimeLeft = carryTripleJumpTime;
    state.storedDoubleJumpTimeLeft = carryStoredDoubleJumpTime;
    state.preRunStep = "details";
    state.preRunActive = true;
    if (preRunScreenEl) {
      preRunScreenEl.classList.remove("hidden");
    }
    renderAdminForm();
    refreshPreRunBriefValues();
    applyGameModeToUi();
    renderPreRunScreen();
    updateOverlayUiVisibility();
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
    if (mode === 1 && !isFullModeUnlocked()) {
      renderPreRunScreen();
      return;
    }
    state.preRunStep = "details";
    prepareRunSetup(mode, state.gameDifficulty);
  }

  function setPreRunDifficulty(difficulty) {
    if (difficulty === "hard" && !isHardDifficultyUnlocked()) {
      renderPreRunScreen();
      return;
    }
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

  function updateLevelFinishedSummary() {
    if (levelFinishedTitleEl) {
      levelFinishedTitleEl.textContent = getLevelDisplayName(state.currentLevel) + " Finished";
    }
    if (levelFinishedScoreEl) {
      levelFinishedScoreEl.textContent = "Score: " + state.score;
    }
    if (levelFinishedRuntimeEl) {
      levelFinishedRuntimeEl.textContent = "Level Time: " + state.levelRunTimeSeconds.toFixed(1) + "s";
    }
    if (levelFinishedCoinsEl) {
      levelFinishedCoinsEl.textContent = "Coins collected: " + state.levelCollectedCoins;
    }
    if (levelFinishedBagsEl) {
      levelFinishedBagsEl.textContent = "Bags collected: " + state.levelCollectedBags;
    }
  }

  function attachPreRunScreen() {
    if (updateNoticeLaterBtn) {
      updateNoticeLaterBtn.addEventListener("click", function () {
        setUpdateNoticeOpen(false, false);
      });
    }
    if (updateNoticeApplyBtn) {
      updateNoticeApplyBtn.addEventListener("click", function () {
        openStoreUpdatePage();
      });
    }
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
        if (state.currentLevel > 1) {
          openPreRunScreen();
          return;
        }
        state.preRunStep = "select";
        renderPreRunScreen();
      });
    }
    if (preRunCompactBackBtn) {
      preRunCompactBackBtn.addEventListener("click", function () {
        openPreRunScreen();
      });
    }
    if (preRunCompactAdminBtn) {
      preRunCompactAdminBtn.addEventListener("click", function () {
        setAdminOpen(true);
      });
    }
    if (preRunTesterInfoBtn) {
      preRunTesterInfoBtn.addEventListener("click", function () {
        window.open(TESTER_INFO_URL, "_blank");
      });
    }

    if (preRunFutureReleaseBtn) {
      preRunFutureReleaseBtn.addEventListener("click", function () {
        window.open(FUTURE_RELEASE_URL, "_blank");
      });
    }
    if (preRunDetailAdminBtn) {
      preRunDetailAdminBtn.addEventListener("click", function () {
        setAdminOpen(true);
      });
    }
    if (preRunStartBtn) {
      preRunStartBtn.addEventListener("click", function () {
        closePreRunScreenAndStartRun();
      });
    }
    if (preRunCompactStartBtn) {
      preRunCompactStartBtn.addEventListener("click", function () {
        closePreRunScreenAndStartRun();
      });
    }
    if (preRunSkinGridEl) {
      preRunSkinGridEl.addEventListener("click", function (event) {
        var skinBtn = event.target && event.target.closest ? event.target.closest(".pre-run-skin-btn") : null;
        if (!skinBtn || !skinBtn.dataset.skin || skinBtn.disabled) {
          return;
        }
        setSelectedSkinFromUi(skinBtn.dataset.skin);
      });
    }
  }

  function attachLevelFinishedScreen() {
    if (!levelFinishedContinueBtn) {
      return;
    }
    levelFinishedContinueBtn.addEventListener("click", function () {
      if (!state.levelFinishedActive) {
        return;
      }
      state.levelFinishedActive = false;
      if (levelFinishedEl) {
        levelFinishedEl.classList.add("hidden");
      }
      if (state.currentLevel < LEVEL_COUNT) {
        prepareLevelContinuation(state.currentLevel + 1);
      }
    });
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
      setAdminResetConfirmOpen(false);
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
      adminToggle.classList.toggle("hidden", state.preRunActive || state.levelFinishedActive);
    }
    if (state.preRunActive || state.levelFinishedActive) {
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

      var globalSectionCollapsed = getGlobalCollapseState("section_" + String(globalSectionIndex));
      var globalSectionTitle = document.createElement("button");
      globalSectionTitle.type = "button";
      globalSectionTitle.className = "admin-collapsible-toggle admin-section-title-toggle";
      globalSectionTitle.setAttribute("aria-expanded", globalSectionCollapsed ? "false" : "true");
      globalSectionTitle.dataset.globalKey = "section_" + String(globalSectionIndex);
      globalSectionTitle.addEventListener("click", function (event) {
        var key = event.currentTarget.dataset.globalKey;
        setGlobalCollapseState(key, !getGlobalCollapseState(key));
        renderAdminForm();
      });
      var globalSectionTitleLabel = document.createElement("span");
      globalSectionTitleLabel.textContent = globalSection.title;
      var globalSectionArrow = document.createElement("span");
      globalSectionArrow.className = "admin-toggle-arrow";
      globalSectionArrow.textContent = globalSectionCollapsed ? ">" : "v";
      globalSectionTitle.appendChild(globalSectionTitleLabel);
      globalSectionTitle.appendChild(globalSectionArrow);
      globalSectionEl.appendChild(globalSectionTitle);

      var globalSectionContent = document.createElement("div");
      globalSectionContent.className = "admin-collapsible-content";
      globalSectionContent.classList.toggle("hidden", globalSectionCollapsed);

      for (var globalFieldIndex = 0; globalFieldIndex < globalSection.fields.length; globalFieldIndex += 1) {
        var globalField = globalSection.fields[globalFieldIndex];

        var globalRow = document.createElement("div");
        globalRow.className = "admin-field";

        var globalLabel = document.createElement("label");
        globalLabel.setAttribute("for", "admin-global-" + globalField.key);
        globalLabel.textContent = globalField.label;

        var globalInput;
        if (globalField.type === "checkbox") {
          if (typeof C[globalField.key] !== "boolean") {
            continue;
          }
          globalRow.classList.add("checkbox-field");
          globalInput = document.createElement("input");
          globalInput.type = "checkbox";
          globalInput.checked = Boolean(C[globalField.key]);
        } else if (globalField.type === "select") {
          if (typeof C[globalField.key] !== "string") {
            continue;
          }
          globalInput = document.createElement("select");
          var selectOptions = globalField.options || [];
          for (var optionIndex = 0; optionIndex < selectOptions.length; optionIndex += 1) {
            var option = document.createElement("option");
            option.value = selectOptions[optionIndex].value;
            option.textContent = selectOptions[optionIndex].label;
            globalInput.appendChild(option);
          }
          globalInput.value = globalField.key === "selectedSkin"
            ? normalizeSkinName(C[globalField.key])
            : String(C[globalField.key]);
        } else if (globalField.type === "number") {
          if (typeof C[globalField.key] !== "number") {
            continue;
          }
          globalInput = document.createElement("input");
          globalInput.type = "number";
          if (typeof globalField.min === "number") {
            globalInput.min = String(globalField.min);
          }
          if (typeof globalField.max === "number") {
            globalInput.max = String(globalField.max);
          }
          globalInput.step = typeof globalField.step === "number" ? String(globalField.step) : "1";
          globalInput.value = String(sanitizeGlobalAdminNumber(globalField.key, C[globalField.key]));
        } else if (globalField.type === "skin-pickup-levels") {
          globalRow.classList.add("admin-field-stacked");
          globalInput = document.createElement("div");
          globalInput.className = "admin-inline-checkbox-wrap";

          var selectedSkinName = normalizeSkinName(C.selectedSkin);
          var selectedSkinCaption = document.createElement("div");
          selectedSkinCaption.className = "admin-inline-checkbox-caption";
          selectedSkinCaption.textContent = "Configure pickup levels for " + getSkinDisplayName(selectedSkinName);
          globalInput.appendChild(selectedSkinCaption);

          var levelCheckboxList = document.createElement("div");
          levelCheckboxList.className = "admin-inline-checkbox-list";
          for (var skinPickupLevel = 1; skinPickupLevel <= LEVEL_COUNT; skinPickupLevel += 1) {
            var levelItem = document.createElement("label");
            levelItem.className = "admin-inline-checkbox-item";

            var levelCheckbox = document.createElement("input");
            levelCheckbox.type = "checkbox";
            levelCheckbox.checked = isSkinPickupLevelEnabled(selectedSkinName, skinPickupLevel);
            levelCheckbox.dataset.key = getSkinPickupLevelSettingKey(selectedSkinName, skinPickupLevel);
            levelCheckbox.addEventListener("change", function (event) {
              var target = event.target;
              var key = target.dataset.key;
              var nextValue = Boolean(target.checked);
              saveGlobalAdminField(key, nextValue);
              C[key] = nextValue;
            });

            var levelText = document.createElement("span");
            levelText.textContent = "Level " + String(skinPickupLevel);

            levelItem.appendChild(levelCheckbox);
            levelItem.appendChild(levelText);
            levelCheckboxList.appendChild(levelItem);
          }
          globalInput.appendChild(levelCheckboxList);
        } else if (
          globalField.type === "hard-mode-override-controls" ||
          globalField.type === "full-mode-override-controls"
        ) {
          globalRow.classList.add("admin-field-stacked");
          globalRow.classList.add("admin-field-no-label");
          globalInput = document.createElement("div");
          globalInput.className = "admin-inline-checkbox-wrap";

          var targetKind = globalField.type === "hard-mode-override-controls" ? "hard" : "full";
          var currentOverride = targetKind === "hard" ? state.hardModeOverride : state.fullModeOverride;

          var overrideCaption = document.createElement("div");
          overrideCaption.className = "admin-inline-checkbox-caption";
          overrideCaption.textContent =
            "Current override: " +
            (currentOverride === "default" ? "Default progression" : currentOverride === "unlocked" ? "Forced unlock" : "Forced lock");
          globalInput.appendChild(overrideCaption);

          var overrideButtonWrap = document.createElement("div");
          overrideButtonWrap.className = "admin-inline-checkbox-list";

          function makeOverrideButton(kind, labelText, overrideValue, isActive) {
            var button = document.createElement("button");
            button.type = "button";
            button.className = "admin-reset-max-btn";
            if (isActive) {
              button.classList.add("is-active");
            }
            button.textContent = labelText;
            button.addEventListener("click", function () {
              setModeUnlockOverride(kind, overrideValue);
              renderAdminForm();
            });
            return button;
          }

          overrideButtonWrap.appendChild(makeOverrideButton(targetKind, "Unlock", "unlocked", currentOverride === "unlocked"));
          overrideButtonWrap.appendChild(makeOverrideButton(targetKind, "Lock", "locked", currentOverride === "locked" || currentOverride === "default"));
          globalInput.appendChild(overrideButtonWrap);
        } else {
          continue;
        }

        if (globalField.type !== "skin-pickup-levels") {
          globalInput.id = "admin-global-" + globalField.key;
          globalInput.dataset.key = globalField.key;
          globalInput.addEventListener("change", function (event) {
            var target = event.target;
            var key = target.dataset.key;
            var nextValue;
            if (target.type === "checkbox") {
              nextValue = Boolean(target.checked);
            } else if (target.type === "number") {
              nextValue = parseFloat(target.value);
              if (!Number.isFinite(nextValue)) {
                nextValue = sanitizeGlobalAdminNumber(key, C[key]);
              }
              nextValue = sanitizeGlobalAdminNumber(key, nextValue);
              target.value = String(nextValue);
            } else {
              nextValue = String(target.value);
              if (key === "selectedSkin") {
                nextValue = normalizeSkinName(nextValue);
                target.value = nextValue;
              }
            }
            saveGlobalAdminField(key, nextValue);
            C[key] = nextValue;
            if (key === "modernVisualsEnabled") {
              applyVisualThemeToUi();
              updateLivesUi();
            } else if (key === "selectedSkin") {
              C.selectedSkin = normalizeSkinName(nextValue);
              refreshPreRunSkinSelection();
              renderAdminForm();
            } else if (key === "hardModeUnlockLevel" || key === "fullModeUnlockJumpHardScore") {
              normalizeUnlockedPreRunSelection();
              refreshPreRunBriefValues();
              renderPreRunScreen();
            }
          });
        }

        if (!globalRow.classList.contains("admin-field-no-label")) {
          globalRow.appendChild(globalLabel);
        }
        globalRow.appendChild(globalInput);
        globalSectionContent.appendChild(globalRow);
      }

      globalSectionEl.appendChild(globalSectionContent);
      adminForm.appendChild(globalSectionEl);
    }

    var maxScoreSectionEl = document.createElement("section");
    maxScoreSectionEl.className = "admin-section admin-global-section";
    var maxScoreCollapsed = getGlobalCollapseState("reset_max_score");
    var maxScoreSectionTitle = document.createElement("button");
    maxScoreSectionTitle.type = "button";
    maxScoreSectionTitle.className = "admin-collapsible-toggle admin-section-title-toggle";
    maxScoreSectionTitle.setAttribute("aria-expanded", maxScoreCollapsed ? "false" : "true");
    maxScoreSectionTitle.dataset.globalKey = "reset_max_score";
    maxScoreSectionTitle.addEventListener("click", function (event) {
      var key = event.currentTarget.dataset.globalKey;
      setGlobalCollapseState(key, !getGlobalCollapseState(key));
      renderAdminForm();
    });
    var maxScoreSectionTitleLabel = document.createElement("span");
    maxScoreSectionTitleLabel.textContent = "Reset Max Score";
    var maxScoreArrow = document.createElement("span");
    maxScoreArrow.className = "admin-toggle-arrow";
    maxScoreArrow.textContent = maxScoreCollapsed ? ">" : "v";
    maxScoreSectionTitle.appendChild(maxScoreSectionTitleLabel);
    maxScoreSectionTitle.appendChild(maxScoreArrow);
    maxScoreSectionEl.appendChild(maxScoreSectionTitle);

    var maxScoreActions = [
      { mode: 2, difficulty: "easy", label: "Reset Easy Jump" },
      { mode: 1, difficulty: "easy", label: "Reset Easy Full" },
      { mode: 2, difficulty: "hard", label: "Reset Hard Jump" },
      { mode: 1, difficulty: "hard", label: "Reset Hard Full" }
    ];
    var maxScoreSectionContent = document.createElement("div");
    maxScoreSectionContent.className = "admin-collapsible-content";
    maxScoreSectionContent.classList.toggle("hidden", maxScoreCollapsed);
    var maxScoreActionGrid = document.createElement("div");
    maxScoreActionGrid.className = "admin-global-button-grid";
    for (var maxScoreActionIndex = 0; maxScoreActionIndex < maxScoreActions.length; maxScoreActionIndex += 1) {
      var maxScoreAction = maxScoreActions[maxScoreActionIndex];
      var maxScoreButton = document.createElement("button");
      maxScoreButton.type = "button";
      maxScoreButton.className = "mode-reset-max-score";
      maxScoreButton.textContent = maxScoreAction.label;
      maxScoreButton.dataset.mode = String(maxScoreAction.mode);
      maxScoreButton.dataset.difficulty = maxScoreAction.difficulty;
      maxScoreButton.addEventListener("click", function (event) {
        var targetMode = parseInt(event.target.dataset.mode, 10);
        var targetDifficulty = event.target.dataset.difficulty;
        writeMaxScoreToStorage(targetMode, targetDifficulty, 0);
        if (state.gameMode === targetMode && state.gameDifficulty === targetDifficulty) {
          sessionMaxScore = 0;
        }
      });
      maxScoreActionGrid.appendChild(maxScoreButton);
    }
    maxScoreSectionContent.appendChild(maxScoreActionGrid);
    maxScoreSectionEl.appendChild(maxScoreSectionContent);
    adminForm.appendChild(maxScoreSectionEl);

    var adminDifficultyGrid = document.createElement("div");
    adminDifficultyGrid.className = "admin-difficulty-grid";
    var difficulties = [
      { key: "easy", label: "Mechanics Easy Admin" },
      { key: "hard", label: "Mechanics Hard Admin" }
    ];
    var levels = [1, 2, 3, 4, 5];
    var modes = [2, 1];

    for (var difficultyIndex = 0; difficultyIndex < difficulties.length; difficultyIndex += 1) {
      var difficultyEntry = difficulties[difficultyIndex];
      var difficultyColumn = document.createElement("div");
      difficultyColumn.className = "admin-difficulty-column";

      var difficultyCollapsed = getDifficultyCollapseState(difficultyEntry.key);
      var difficultyToggle = document.createElement("button");
      difficultyToggle.type = "button";
      difficultyToggle.className = "admin-collapsible-toggle admin-difficulty-title";
      difficultyToggle.setAttribute("aria-expanded", difficultyCollapsed ? "false" : "true");
      difficultyToggle.dataset.difficulty = difficultyEntry.key;
      difficultyToggle.addEventListener("click", function (event) {
        var difficulty = event.currentTarget.dataset.difficulty;
        setDifficultyCollapseState(difficulty, !getDifficultyCollapseState(difficulty));
        renderAdminForm();
      });
      var difficultyArrow = document.createElement("span");
      difficultyArrow.className = "admin-toggle-arrow";
      difficultyArrow.textContent = difficultyCollapsed ? ">" : "v";
      var difficultyLabel = document.createElement("span");
      difficultyLabel.textContent = difficultyEntry.label;
      difficultyToggle.appendChild(difficultyLabel);
      difficultyToggle.appendChild(difficultyArrow);
      difficultyColumn.appendChild(difficultyToggle);

      var difficultyContent = document.createElement("div");
      difficultyContent.className = "admin-collapsible-content";
      difficultyContent.classList.toggle("hidden", difficultyCollapsed);

      for (var levelIndex = 0; levelIndex < levels.length; levelIndex += 1) {
        var level = levels[levelIndex];
        var levelCollapsed = getLevelCollapseState(difficultyEntry.key, level);
        var levelGroup = document.createElement("section");
        levelGroup.className = "admin-level-group";
        levelGroup.classList.add("admin-level-group-" + String(level));

        var levelToggle = document.createElement("button");
        levelToggle.type = "button";
        levelToggle.className = "admin-collapsible-toggle admin-level-title";
        levelToggle.setAttribute("aria-expanded", levelCollapsed ? "false" : "true");
        levelToggle.dataset.level = String(level);
        levelToggle.dataset.difficulty = difficultyEntry.key;
        levelToggle.addEventListener("click", function (event) {
          var target = event.currentTarget;
          var targetLevel = parseInt(target.dataset.level, 10);
          var targetDifficulty = target.dataset.difficulty;
          setLevelCollapseState(targetDifficulty, targetLevel, !getLevelCollapseState(targetDifficulty, targetLevel));
          renderAdminForm();
        });
        var levelLabel = document.createElement("span");
        levelLabel.textContent = "Admin " + getLevelDisplayName(level);
        var levelArrow = document.createElement("span");
        levelArrow.className = "admin-toggle-arrow";
        levelArrow.textContent = levelCollapsed ? ">" : "v";
        levelToggle.appendChild(levelLabel);
        levelToggle.appendChild(levelArrow);
        levelGroup.appendChild(levelToggle);

        var levelContent = document.createElement("div");
        levelContent.className = "admin-collapsible-content";
        levelContent.classList.toggle("hidden", levelCollapsed);

        for (var modeIndex = 0; modeIndex < modes.length; modeIndex += 1) {
          var mode = modes[modeIndex];
          var modeConfig = buildModeConfig(level, mode, difficultyEntry.key);

          var modeGroup = document.createElement("div");
          modeGroup.className = "admin-mode-group";

          var modeHeader = document.createElement("div");
          modeHeader.className = "admin-mode-header";
          var modeTitle = document.createElement("h3");
          modeTitle.textContent = getModeDisplayName(mode);
          var modeDefaultBtn = document.createElement("button");
          modeDefaultBtn.className = "mode-default";
          modeDefaultBtn.textContent = "Default";
          modeDefaultBtn.dataset.level = String(level);
          modeDefaultBtn.dataset.mode = String(mode);
          modeDefaultBtn.dataset.difficulty = difficultyEntry.key;
          modeDefaultBtn.addEventListener("click", function (event) {
            var targetLevel = parseInt(event.target.dataset.level, 10);
            var targetMode = parseInt(event.target.dataset.mode, 10);
            var targetDifficulty = event.target.dataset.difficulty;
            var modeFileOverrides = getModeFileOverrides(targetMode);
            var difficultyOverrides = getDifficultyModeOverrides(targetDifficulty, targetMode);
            var levelOverrides = getLevelDifficultyModeOverrides(targetLevel, targetDifficulty, targetMode);
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
                if (Object.prototype.hasOwnProperty.call(levelOverrides, key)) {
                  value = levelOverrides[key];
                }
                if (typeof value === "number" && Number.isFinite(value)) {
                  persisted[key] = sanitizeConfigValue(key, value);
                } else if (typeof value === "boolean") {
                  persisted[key] = value;
                }
              }
            }

            writeAdminStorageObject(targetLevel, targetMode, targetDifficulty, persisted);
            if (
              state.currentLevel === targetLevel &&
              state.gameMode === targetMode &&
              state.gameDifficulty === targetDifficulty
            ) {
              loadCurrentLevelConfig();
              refreshPreRunBriefValues();
            }
            renderAdminForm();
          });
          var modeActions = document.createElement("div");
          modeActions.className = "admin-mode-actions";
          modeActions.appendChild(modeDefaultBtn);
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
              label.setAttribute("for", "admin-" + difficultyEntry.key + "-" + level + "-" + mode + "-" + field.key);
              label.textContent = field.label;

              var input = document.createElement("input");
              input.id = "admin-" + difficultyEntry.key + "-" + level + "-" + mode + "-" + field.key;
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
              input.dataset.level = String(level);
              input.dataset.mode = String(mode);
              input.dataset.difficulty = difficultyEntry.key;
              input.addEventListener("change", function (event) {
                var target = event.target;
                var key = target.dataset.key;
                var targetLevel = parseInt(target.dataset.level, 10);
                var targetMode = parseInt(target.dataset.mode, 10);
                var targetDifficulty = target.dataset.difficulty;
                var nextValue;

                if (target.type === "checkbox") {
                  nextValue = Boolean(target.checked);
                  saveAdminFieldToStorage(targetLevel, targetMode, targetDifficulty, key, nextValue);
                  if (
                    state.currentLevel === targetLevel &&
                    state.gameMode === targetMode &&
                    state.gameDifficulty === targetDifficulty
                  ) {
                    C[key] = nextValue;
                  }
                  updateLivesUi();
                  return;
                }

                nextValue = parseFloat(target.value);
                if (Number.isFinite(nextValue)) {
                  nextValue = sanitizeConfigValue(key, nextValue);
                  target.value = String(nextValue);
                  saveAdminFieldToStorage(targetLevel, targetMode, targetDifficulty, key, nextValue);
                  if (
                    state.currentLevel === targetLevel &&
                    state.gameMode === targetMode &&
                    state.gameDifficulty === targetDifficulty
                  ) {
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
                  var fallback = buildModeConfig(targetLevel, targetMode, targetDifficulty)[key];
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

          levelContent.appendChild(modeGroup);
        }

        levelGroup.appendChild(levelContent);
        difficultyContent.appendChild(levelGroup);
      }

      difficultyColumn.appendChild(difficultyContent);
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
      setAdminResetConfirmOpen(false);
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

    if (adminExportBtn) {
      adminExportBtn.addEventListener("click", function () {
        triggerSettingsExportDownload();
      });
    }

    if (adminResetAllBtn) {
      adminResetAllBtn.addEventListener("click", function () {
        setAdminResetConfirmOpen(true);
      });
    }

    if (adminResetConfirmCancelBtn) {
      adminResetConfirmCancelBtn.addEventListener("click", function () {
        setAdminResetConfirmOpen(false);
      });
    }

    if (adminResetConfirmApplyBtn) {
      adminResetConfirmApplyBtn.addEventListener("click", function () {
        setAdminResetConfirmOpen(false);
        resetAllSettingsToDefaults();
      });
    }

    if (adminCopyJsonBtn) {
      adminCopyJsonBtn.addEventListener("click", function () {
        copySettingsJsonToClipboard();
      });
    }

    if (adminImportFileBtn && adminImportFileInput) {
      adminImportFileBtn.addEventListener("click", function () {
        adminImportFileInput.click();
      });
      adminImportFileInput.addEventListener("change", function (event) {
        var file = event.target.files && event.target.files[0];
        importSettingsFile(file);
        event.target.value = "";
      });
    }

    if (adminImportTextBtn) {
      adminImportTextBtn.addEventListener("click", function () {
        promptAndImportSettingsJson();
      });
    }

    updateAdminPrivacyVisibility();

  }

  function setGameMode(mode) {
    state.gameMode = mode === 2 ? 2 : 1;
    applyModeConfig(state.currentLevel, state.gameMode, state.gameDifficulty);
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

  function restartGame(resetLives) {
    setAdminOpen(false);
    var carriedShieldCharges = resetLives ? 0 : state.shieldCharges;
    world.reset();
    var spawnX = 80;
    var spawnY = world.currentPlatformY - C.playerSize;
    player = new Player(spawnX, spawnY);
    player.isGrounded = true;
    state.running = true;
    state.adminPaused = false;
    state.preRunActive = false;
    state.levelFinishedActive = false;
    state.score = state.scoreCarryOver;
    state.bonusScore = 0;
    state.levelRunTimeSeconds = 0;
    state.levelCollectedCoins = 0;
    state.levelCollectedBags = 0;
    state.maxLives = sanitizeConfigValue("livesCount", C.livesCount);
    if (resetLives) {
      state.livesLeft = state.maxLives;
    } else {
      state.livesLeft = Math.max(1, Math.min(state.livesLeft, state.maxLives));
    }
    state.lifeLossFlashTimeLeft = 0;
    state.skinUnlockToastTimeLeft = 0;
    state.skinUnlockToastText = "";
    state.speedPercent = 0;
    state.scrollSpeed = C.worldAutoRunSpeed;
    state.speedSlowMultiplier = 1;
    state.startX = spawnX;
    state.cameraX = 0;
    state.doubleJumpTimeLeft = 0;
    state.tripleJumpTimeLeft = 0;
    state.storedDoubleJumpTimeLeft = 0;
    state.pendingDoubleJumpTimeLeft = 0;
    state.pendingTripleJumpTimeLeft = 0;
    state.pendingStoredDoubleJumpTimeLeft = 0;
    state.pendingJumpTimerStart = false;
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
    state.crackedCoinRespawnTimer = randomRange(
      C.crackedCoinRespawnMinSeconds,
      C.crackedCoinRespawnMaxSeconds
    );
    state.crackedCoinIcon.active = false;
    state.crackedCoinIcon.x = 0;
    state.crackedCoinIcon.y = 0;
    state.crackedCoinIcon.size = C.playerSize * C.crackedCoinIconSizeRatio;
    state.questionCoinRespawnTimer = randomRange(
      C.questionCoinRespawnMinSeconds,
      C.questionCoinRespawnMaxSeconds
    );
    state.questionCoinIcon.active = false;
    state.questionCoinIcon.x = 0;
    state.questionCoinIcon.y = 0;
    state.questionCoinIcon.size = C.playerSize * C.questionCoinIconSizeRatio;
    state.questionCoinIcon.stakeScore = 0;
    state.liveUnlocked = false;
    state.liveRespawnTimer = 0;
    state.liveIcon.active = false;
    state.liveIcon.x = 0;
    state.liveIcon.y = 0;
    state.liveIcon.size = C.playerSize * C.liveIconSizeRatio;
    state.shieldRespawnTimer = randomRange(
      C.shieldRespawnMinSeconds,
      C.shieldRespawnMaxSeconds
    );
    state.shieldCharges = carriedShieldCharges;
    state.shieldBurstActive = false;
    state.shieldBurstElapsed = 0;
    state.shieldBurstDuration = 0.5;
    state.shieldIcon.active = false;
    state.shieldIcon.x = 0;
    state.shieldIcon.y = 0;
    state.shieldIcon.size = C.playerSize * C.shieldIconSizeRatio;
    state.magnetRespawnTimer = randomRange(
      C.magnetRespawnMinSeconds,
      C.magnetRespawnMaxSeconds
    );
    state.magnetTimeLeft = 0;
    state.magnetIcon.active = false;
    state.magnetIcon.x = 0;
    state.magnetIcon.y = 0;
    state.magnetIcon.size = C.playerSize * C.magnetIconSizeRatio;
    state.magnetAttractedItems = [];
    state.curseRespawnTimer = randomRange(
      C.curseRespawnMinSeconds,
      C.curseRespawnMaxSeconds
    );
    state.curseTimeLeft = 0;
    state.blockedDistanceScore = 0;
    state.lastRawDistanceScore = 0;
    state.curseIcon.active = false;
    state.curseIcon.x = 0;
    state.curseIcon.y = 0;
    state.curseIcon.size = C.playerSize * C.curseIconSizeRatio;
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
    state.teleportFinishAnimActive = false;
    state.teleportFinishAnimElapsed = 0;
    state.teleportFinishAnimHeroStartSize = C.playerSize;
    state.teleportFinishAnimHeroCenterX = 0;
    state.teleportFinishAnimHeroCenterY = 0;
    state.questionCoinAnimActive = false;
    state.questionCoinAnimElapsed = 0;
    state.questionCoinAnimStakeScore = 0;
    state.questionCoinAnimResult = "";
    state.questionCoinAnimDelta = 0;
    state.questionCoinAnimApplied = false;
    state.platformCoinTimer = C.platformCoinInitialDelaySeconds;
    state.lastPlatformCoinPlatformId = -1;
    state.platformCoinIcon.active = false;
    state.platformCoinIcon.x = 0;
    state.platformCoinIcon.y = 0;
    state.platformCoinIcon.platformId = -1;
    state.skinPickupIcon.active = false;
    state.skinPickupIcon.size = C.playerSize * C.coinIconSizeRatio;
    state.skinPickupIcon.skinName = "";
    state.levelGoalReached = false;
    state.teleport.active = false;
    state.teleport.x = 0;
    state.teleport.width = Math.max(84, Math.round(C.playerSize * 1.6));
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
    if (levelFinishedEl) {
      levelFinishedEl.classList.add("hidden");
    }
    updateOverlayUiVisibility();
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

  function getLevelEarnedScore() {
    return Math.max(0, state.score - state.scoreCarryOver);
  }

  function isCurseActive() {
    return state.curseTimeLeft > 0;
  }

  function applyLevelScoreDelta(delta) {
    if (!Number.isFinite(delta) || delta === 0) {
      return 0;
    }

    var levelEarned = getLevelEarnedScore();
    var applied = delta;
    if (delta < 0) {
      applied = -Math.min(levelEarned, Math.abs(delta));
    }

    state.bonusScore += applied;
    state.score = Math.max(state.scoreCarryOver, state.score + applied);
    return applied;
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

  function isShieldProtectableCause(cause) {
    return (
      cause === "topDeathZone" ||
      cause === "bottomDeathZone" ||
      cause === "projectile" ||
      cause === "blocker"
    );
  }

  function buildSupportCandidate(ref, type) {
    return {
      ref: ref,
      type: type,
      x: ref.x,
      y: ref.y,
      width: ref.width
    };
  }

  function findNearestSafeSupport(preferredX) {
    var best = null;
    var bestScore = Number.POSITIVE_INFINITY;
    var i;

    function consider(support) {
      if (!support || !Number.isFinite(support.width) || support.width < player.width * 0.9) {
        return;
      }
      var respawnY = support.y - player.height;
      if (respawnY < C.topDeathLineY || respawnY > C.bottomDeathLineY - player.height) {
        return;
      }

      var supportCenter = support.x + support.width * 0.5;
      var distance = Math.abs(supportCenter - preferredX);
      var offscreenPenalty = 0;
      if (support.x + support.width < state.cameraX - 40 || support.x > state.cameraX + C.canvasWidth + 160) {
        offscreenPenalty = 2000;
      }
      var behindPenalty = supportCenter < preferredX ? 150 : 0;
      var score = distance + offscreenPenalty + behindPenalty;
      if (score < bestScore) {
        best = support;
        bestScore = score;
      }
    }

    for (i = 0; i < world.platforms.length; i += 1) {
      consider(buildSupportCandidate(world.platforms[i], "platform"));
    }
    for (i = 0; i < world.elevators.length; i += 1) {
      consider(buildSupportCandidate(world.elevators[i], "elevator"));
    }

    return best;
  }

  function placePlayerOnSupport(support, preferredX) {
    if (!support) {
      return false;
    }

    var targetX = preferredX - player.width * 0.5;
    if (!Number.isFinite(targetX)) {
      targetX = support.x;
    }
    if (support.width > player.width) {
      targetX = Math.min(Math.max(targetX, support.x), support.x + support.width - player.width);
    } else {
      targetX = support.x;
    }

    player.x = targetX;
    player.y = support.y - player.height;
    player.velocityX = 0;
    player.velocityY = 0;
    player.isGrounded = true;
    player.supportType = support.type;
    player.supportRef = support.ref;
    player.isJumpHolding = false;
    player.jumpHoldTime = 0;
    player.jumpsUsed = 0;
    input.jumpDown = false;
    input.jumpPressed = false;
    state.cameraX = Math.max(0, player.x - C.canvasWidth * C.cameraAnchorRatio);
    state.playerRotationLockedInAir = false;
    state.playerAirSpinRemainingRad = 0;
    updateRespawnPoint();
    return true;
  }

  function rescuePlayerFromBottomDeathZone() {
    var referenceX = player.x + player.width * 0.5;
    var support = findNearestSafeSupport(referenceX);
    if (placePlayerOnSupport(support, referenceX)) {
      return true;
    }

    var fallback = resolveRespawnPoint();
    player.x = fallback.x;
    player.y = fallback.y;
    player.velocityX = 0;
    player.velocityY = 0;
    player.isGrounded = false;
    player.supportType = null;
    player.supportRef = null;
    player.isJumpHolding = false;
    player.jumpHoldTime = 0;
    player.jumpsUsed = 0;
    input.jumpDown = false;
    input.jumpPressed = false;
    state.cameraX = Math.max(0, player.x - C.canvasWidth * C.cameraAnchorRatio);
    state.playerRotationLockedInAir = false;
    state.playerAirSpinRemainingRad = 0;
    return true;
  }

  function consumeShield(cause) {
    if (state.shieldCharges <= 0 || !isShieldProtectableCause(cause)) {
      return false;
    }

    state.shieldCharges = Math.max(0, state.shieldCharges - 1);
    state.lifeLossFlashTimeLeft = 0.25;

    if (cause === "bottomDeathZone") {
      return rescuePlayerFromBottomDeathZone();
    }

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
      startShieldBurstEffect();
      return true;
    }

    startShieldBurstEffect();
    return true;
  }

  function startShieldBurstEffect() {
    state.shieldBurstActive = true;
    state.shieldBurstElapsed = 0;
    state.shieldBurstDuration = 0.5;
  }

  function consumeLife(cause) {
    if (consumeShield(cause)) {
      updateLivesUi();
      return true;
    }

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

      if (state.levelFinishedActive && (event.key === " " || event.key === "Enter")) {
        if (levelFinishedContinueBtn) {
          levelFinishedContinueBtn.click();
        }
        return;
      }

      if (
        (event.key === " " || event.key === "Enter") &&
        !state.running &&
        !state.projectileDeathAnimActive &&
        !state.teleportFinishAnimActive &&
        !state.questionCoinAnimActive
      ) {
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
      if (!state.running && !state.projectileDeathAnimActive && !state.teleportFinishAnimActive && !state.questionCoinAnimActive) {
        openPreRunScreen();
      }
    });

    canvas.addEventListener("pointerdown", function () {
      tryForceFullscreen();
    });

    if (levelFinishedEl) {
      levelFinishedEl.addEventListener("pointerdown", function () {
        tryForceFullscreen();
      });
    }
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
    } else if (state.questionCoinAnimActive && !state.adminPaused && !state.preRunActive) {
      updateQuestionCoinAnimation(dt);
    } else if (state.teleportFinishAnimActive && !state.adminPaused && !state.preRunActive) {
      updateTeleportFinishAnimation(dt);
    } else if (state.projectileDeathAnimActive && !state.adminPaused && !state.preRunActive) {
      updateProjectileDeathAnimation(dt);
    }
    render();

    input.jumpPressed = false;
    requestAnimationFrame(loop);
  }

  function update(dt) {
    state.runTimeSeconds += dt;
    state.levelRunTimeSeconds += dt;
    if (state.lifeLossFlashTimeLeft > 0) {
      state.lifeLossFlashTimeLeft = Math.max(0, state.lifeLossFlashTimeLeft - dt);
    }
    if (state.skinUnlockToastTimeLeft > 0) {
      state.skinUnlockToastTimeLeft = Math.max(0, state.skinUnlockToastTimeLeft - dt);
    }
    updateShieldBurstEffect(dt);
    updateDoubleJumpEffect(dt);
    updateMagnetEffect(dt);
    updateCurseEffect(dt);

    world.updateElevators(dt);
    updateSkinPickupLifetime();
    var scoreMultiplier = getSpeedMultiplierFromScore(state.score);
    state.scrollSpeed = C.worldAutoRunSpeed * scoreMultiplier * state.speedSlowMultiplier;
    var wasGroundedBeforePhysics = player.isGrounded;
    var jumpsUsedBeforePhysics = player.jumpsUsed;
    physics.updatePlayer(player, world, input, dt, state.scrollSpeed);
    var jumpStarted = player.jumpsUsed > jumpsUsedBeforePhysics;
    var jumpStartedInAir = jumpStarted && !wasGroundedBeforePhysics;
    var landedThisFrame = !wasGroundedBeforePhysics && player.isGrounded;
    if (jumpStarted && state.pendingJumpTimerStart) {
      state.pendingJumpTimerStart = false;
      state.pendingDoubleJumpTimeLeft = 0;
      state.pendingTripleJumpTimeLeft = 0;
      state.pendingStoredDoubleJumpTimeLeft = 0;
    }
    updatePlayerRotation(dt, jumpStartedInAir);
    updateHeroJumpAnimation(dt, jumpStarted, landedThisFrame);
    updateRespawnPoint();

    state.cameraX = Math.max(0, player.x - C.canvasWidth * C.cameraAnchorRatio);
    if (!state.teleport.active) {
      world.generateAhead(state.cameraX, C.canvasWidth);
    }
    world.cleanupBehind(state.cameraX);
    syncSkinPickupStateFromWorld();

    var rawDistanceScore = Math.max(0, Math.floor((player.x - state.startX) * C.distanceScoreMultiplier));
    if (isCurseActive()) {
      state.blockedDistanceScore += Math.max(0, rawDistanceScore - state.lastRawDistanceScore);
    }
    state.lastRawDistanceScore = rawDistanceScore;
    var distanceScore = Math.max(0, rawDistanceScore - state.blockedDistanceScore);
    state.score = state.scoreCarryOver + distanceScore + state.bonusScore;
    if (state.score > sessionMaxScore) {
      sessionMaxScore = state.score;
      writeMaxScoreToStorage(state.gameMode, state.gameDifficulty, sessionMaxScore);
    }
    state.speedPercent = Math.round((state.scrollSpeed / C.worldAutoRunSpeed - 1) * 100);
    updateSkinDiscoverySpawner();
    updateLevelGoalTeleport();
    if (checkTeleportCollision()) {
      startTeleportFinishAnimation();
      return;
    }
    if (state.teleport.active) {
      checkDoubleJumpIconPickup();
      checkSlowIconPickup();
      checkScoreBagPickup();
      checkCrackedCoinPickup();
      checkQuestionCoinPickup();
      checkCursePickup();
      checkLivePickup();
      checkShieldPickup();
      checkMagnetPickup();
      checkSkinPickup();
      checkPlatformCoinPickup();
      checkElevatorCoinPickup();

      if (physics.isPastBottomDeathLine(player)) {
        if (consumeShield("bottomDeathZone")) {
          return;
        }
        startProjectileDeathAnimation();
        return;
      }
      if (physics.isPastTopDeathLine(player)) {
        if (consumeLife("topDeathZone")) {
          return;
        }
        startProjectileDeathAnimation();
      }
      return;
    }
    updateDoubleJumpSpawner(dt);
    checkDoubleJumpIconPickup();
    updateSlowSpawner(dt);
    checkSlowIconPickup();
    updateScoreBagSpawner(dt);
    checkScoreBagPickup();
    updateCrackedCoinSpawner(dt);
    checkCrackedCoinPickup();
    updateQuestionCoinSpawner(dt);
    checkQuestionCoinPickup();
    updateCurseSpawner(dt);
    checkCursePickup();
    updateLiveSpawner(dt);
    checkLivePickup();
    updateShieldSpawner(dt);
    checkShieldPickup();
    updateMagnetSpawner(dt);
    checkMagnetPickup();
    checkSkinPickup();
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
      if (consumeShield("bottomDeathZone")) {
        return;
      }
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

  function updateShieldBurstEffect(dt) {
    if (!state.shieldBurstActive) {
      return;
    }

    state.shieldBurstElapsed += dt;
    if (state.shieldBurstElapsed >= state.shieldBurstDuration) {
      state.shieldBurstActive = false;
      state.shieldBurstElapsed = 0;
    }
  }

  function finishRunAndShowGameOver() {
    state.running = false;
    updateGameOverSummary();
    gameOverEl.classList.remove("hidden");
  }

  function finishCurrentLevel() {
    state.running = false;
    state.levelFinishedActive = true;
    state.teleport.active = false;
    state.scoreCarryOver = state.score;
    updateLevelFinishedSummary();
    if (levelFinishedEl) {
      levelFinishedEl.classList.remove("hidden");
    }
    updateOverlayUiVisibility();
  }

  function startTeleportFinishAnimation() {
    if (state.teleportFinishAnimActive) {
      return;
    }

    var heroRenderMetrics = getHeroRenderMetrics();
    state.running = false;
    state.teleportFinishAnimActive = true;
    state.teleportFinishAnimElapsed = 0;
    state.teleportFinishAnimHeroStartSize = heroRenderMetrics.drawHeight;
    state.teleportFinishAnimHeroCenterX = player.x + player.width * 0.5;
    state.teleportFinishAnimHeroCenterY = player.y + player.height * 0.5;
    state.projectile.active = false;
    state.projectile2.active = false;
    player.velocityX = 0;
    player.velocityY = 0;
    player.isGrounded = false;
    player.supportType = null;
    player.supportRef = null;
    player.isJumpHolding = false;
    player.jumpHoldTime = 0;
    input.left = false;
    input.right = false;
    input.jumpDown = false;
    input.jumpPressed = false;
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

  function updateTeleportFinishAnimation(dt) {
    state.teleportFinishAnimElapsed += dt;
    var totalDuration = TELEPORT_FINISH_HERO_SHRINK_SECONDS + TELEPORT_FINISH_SPARK_GROW_SECONDS;
    if (state.teleportFinishAnimElapsed >= totalDuration) {
      state.teleportFinishAnimActive = false;
      finishCurrentLevel();
    }
  }

  function updateQuestionCoinAnimation(dt) {
    var randomizerDuration = 2;
    state.questionCoinAnimElapsed += dt;
    if (!state.questionCoinAnimApplied && state.questionCoinAnimElapsed >= randomizerDuration) {
      var stake = state.questionCoinAnimStakeScore;
      if (state.questionCoinAnimResult === "+") {
        state.questionCoinAnimDelta = applyLevelScoreDelta(stake * 2);
      } else {
        state.questionCoinAnimDelta = applyLevelScoreDelta(-Math.floor(stake * 0.5));
      }
      state.questionCoinAnimApplied = true;
    }

    if (state.questionCoinAnimElapsed >= state.questionCoinAnimDuration) {
      state.questionCoinAnimActive = false;
      state.running = true;
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
    drawCrackedCoinIcon();
    drawQuestionCoinIcon();
    drawCurseIcon();
    drawLiveIcon();
    drawShieldIcon();
    drawMagnetIcon();
    drawBlockerIcon();
    drawProjectile();
    drawProjectile2();
    drawSkinPickupIcon();
    drawPlatformCoinIcon();
    drawMagnetAttractedItems();
    drawElevatorCoins();
    drawPlayer();
    drawPlayerStatusEffects();
    drawShieldBurstEffect();
    drawTeleportFinishAnimation();
    ctx.restore();
    drawTeleport();
    drawDeathLines();
    drawProjectileDeathAnimation();
    drawQuestionCoinAnimation();
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

  function updateLevelGoalTeleport() {
    if (state.levelGoalReached) {
      return;
    }
    if (!Number.isFinite(C.finishScore) || C.finishScore <= 0) {
      return;
    }
    if (state.score < C.finishScore) {
      return;
    }

    state.levelGoalReached = true;
    state.teleport.active = true;
    state.teleport.x = state.cameraX + C.canvasWidth + 120;
    trimWorldAtTeleport();
  }

  function trimWorldAtTeleport() {
    var teleportLeft = state.teleport.x;

    world.platforms = world.platforms.filter(function (platform) {
      if (platform.x >= teleportLeft) {
        return false;
      }
      var right = platform.x + platform.width;
      if (right > teleportLeft) {
        platform.width = Math.max(0, teleportLeft - platform.x);
      }
      return platform.width > 0;
    });

    world.elevators = world.elevators.filter(function (elevator) {
      return elevator.x + elevator.width <= teleportLeft;
    });
    syncSkinPickupStateFromWorld();

    world.cursorX = Math.min(world.cursorX, teleportLeft);

    state.blockerIcons = state.blockerIcons.filter(function (icon) {
      return icon.x + icon.size <= teleportLeft;
    });

    if (state.doubleJumpIcon.x >= teleportLeft) {
      state.doubleJumpIcon.active = false;
    }
    if (state.slowIcon.x >= teleportLeft) {
      state.slowIcon.active = false;
    }
    if (state.scoreBagIcon.x >= teleportLeft) {
      state.scoreBagIcon.active = false;
    }
    if (state.crackedCoinIcon.x >= teleportLeft) {
      state.crackedCoinIcon.active = false;
    }
    if (state.questionCoinIcon.x >= teleportLeft) {
      state.questionCoinIcon.active = false;
      state.questionCoinIcon.stakeScore = 0;
    }
    if (state.curseIcon.x >= teleportLeft) {
      state.curseIcon.active = false;
    }
    if (state.liveIcon.x >= teleportLeft) {
      state.liveIcon.active = false;
    }
    if (state.shieldIcon.x >= teleportLeft) {
      state.shieldIcon.active = false;
    }
    if (state.magnetIcon.x >= teleportLeft) {
      state.magnetIcon.active = false;
    }
    if (state.platformCoinIcon.x >= teleportLeft) {
      state.platformCoinIcon.active = false;
    }
    if (state.projectile.x >= teleportLeft) {
      state.projectile.active = false;
    }
    if (state.projectile2.x >= teleportLeft) {
      state.projectile2.active = false;
    }
  }

  function checkTeleportCollision() {
    if (!state.teleport.active) {
      return false;
    }

    var playerCenter = player.x + player.width * 0.5;
    var teleportCenter = state.teleport.x + state.teleport.width * 0.5;
    var centerTolerance = Math.max(6, Math.round(Math.min(player.width, state.teleport.width) * 0.08));
    return Math.abs(playerCenter - teleportCenter) <= centerTolerance;
  }

  function scheduleNextDoubleJumpSpawn() {
    state.doubleJumpRespawnTimer = randomRange(
      C.doubleJumpRespawnMinSeconds,
      C.doubleJumpRespawnMaxSeconds
    );
  }

  function updateDoubleJumpEffect(dt) {
    var isBaseDoubleActive = state.gameMode === 2;
    var jumpTimersPaused = state.pendingJumpTimerStart;

    if (jumpTimersPaused) {
      var hasPendingTripleJump = state.tripleJumpTimeLeft > 0;
      var hasPendingDoubleJump =
        isBaseDoubleActive || state.doubleJumpTimeLeft > 0 || hasPendingTripleJump;
      player.hasDoubleJump = hasPendingDoubleJump;
      player.maxJumps = hasPendingTripleJump ? 3 : (hasPendingDoubleJump ? 2 : 1);
      return;
    }

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

  function getDoubleJumpPickupUnlockScore() {
    return state.gameMode === 2 ? C.tripleJumpUnlockScore : C.doubleJumpUnlockScore;
  }

  function updateDoubleJumpSpawner(dt) {
    if (state.score < getDoubleJumpPickupUnlockScore()) {
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

  function scheduleNextCrackedCoinSpawn() {
    state.crackedCoinRespawnTimer = randomRange(
      C.crackedCoinRespawnMinSeconds,
      C.crackedCoinRespawnMaxSeconds
    );
  }

  function startQuestionCoinAnimation(stakeScore) {
    if (state.questionCoinAnimActive) {
      return;
    }

    state.running = false;
    state.questionCoinAnimActive = true;
    state.questionCoinAnimElapsed = 0;
    state.questionCoinAnimStakeScore = Math.max(0, Math.floor(stakeScore));
    state.questionCoinAnimResult = Math.random() < 0.5 ? "-" : "+";
    state.questionCoinAnimDelta = 0;
    state.questionCoinAnimApplied = false;
    player.velocityX = 0;
    player.velocityY = 0;
    player.isJumpHolding = false;
    player.jumpHoldTime = 0;
    input.left = false;
    input.right = false;
    input.jumpDown = false;
    input.jumpPressed = false;
  }

  function scheduleNextQuestionCoinSpawn() {
    state.questionCoinRespawnTimer = randomRange(
      C.questionCoinRespawnMinSeconds,
      C.questionCoinRespawnMaxSeconds
    );
  }

  function scheduleNextCurseSpawn() {
    state.curseRespawnTimer = randomRange(
      C.curseRespawnMinSeconds,
      C.curseRespawnMaxSeconds
    );
  }

  function scheduleNextLiveSpawn() {
    state.liveRespawnTimer = randomRange(
      C.liveRespawnMinSeconds,
      C.liveRespawnMaxSeconds
    );
  }

  function scheduleNextShieldSpawn() {
    state.shieldRespawnTimer = randomRange(
      C.shieldRespawnMinSeconds,
      C.shieldRespawnMaxSeconds
    );
  }

  function scheduleNextMagnetSpawn() {
    state.magnetRespawnTimer = randomRange(
      C.magnetRespawnMinSeconds,
      C.magnetRespawnMaxSeconds
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

  function trySpawnCrackedCoin() {
    var icon = state.crackedCoinIcon;
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

  function trySpawnQuestionCoin() {
    var icon = state.questionCoinIcon;
    var stakeScore = getLevelEarnedScore();
    if (icon.active || stakeScore <= 0) {
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
    icon.stakeScore = Math.floor(stakeScore);
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

  function trySpawnShieldIcon() {
    var icon = state.shieldIcon;
    if (icon.active || state.shieldCharges > 0) {
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

  function trySpawnMagnetIcon() {
    var icon = state.magnetIcon;
    if (icon.active || state.magnetTimeLeft > 0) {
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

  function trySpawnCurseIcon() {
    var icon = state.curseIcon;
    if (icon.active || state.curseTimeLeft > 0) {
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
    if (state.score < C.scoreBagUnlockScore) {
      icon.active = false;
      state.scoreBagRespawnTimer = 0;
      return;
    }

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

  function updateCrackedCoinSpawner(dt) {
    var icon = state.crackedCoinIcon;
    if (state.score < C.crackedCoinUnlockScore) {
      icon.active = false;
      state.crackedCoinRespawnTimer = 0;
      return;
    }

    if (icon.active) {
      if (icon.x + icon.size < state.cameraX - 40) {
        icon.active = false;
        scheduleNextCrackedCoinSpawn();
      }
      return;
    }

    if (state.crackedCoinRespawnTimer > 0) {
      state.crackedCoinRespawnTimer = Math.max(0, state.crackedCoinRespawnTimer - dt);
      return;
    }

    if (trySpawnCrackedCoin()) {
      scheduleNextCrackedCoinSpawn();
    }
  }

  function updateQuestionCoinSpawner(dt) {
    var icon = state.questionCoinIcon;
    if (state.score < C.questionCoinUnlockScore) {
      icon.active = false;
      icon.stakeScore = 0;
      state.questionCoinRespawnTimer = 0;
      return;
    }

    if (icon.active) {
      if (icon.x + icon.size < state.cameraX - 40) {
        icon.active = false;
        icon.stakeScore = 0;
        scheduleNextQuestionCoinSpawn();
      }
      return;
    }

    if (state.questionCoinRespawnTimer > 0) {
      state.questionCoinRespawnTimer = Math.max(0, state.questionCoinRespawnTimer - dt);
      return;
    }

    if (trySpawnQuestionCoin()) {
      scheduleNextQuestionCoinSpawn();
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

  function updateShieldSpawner(dt) {
    var icon = state.shieldIcon;
    if (state.score < C.shieldUnlockScore) {
      icon.active = false;
      state.shieldRespawnTimer = 0;
      return;
    }

    if (state.shieldCharges > 0) {
      icon.active = false;
      return;
    }

    if (icon.active) {
      if (icon.x + icon.size < state.cameraX - 40) {
        icon.active = false;
        scheduleNextShieldSpawn();
      }
      return;
    }

    if (state.shieldRespawnTimer > 0) {
      state.shieldRespawnTimer = Math.max(0, state.shieldRespawnTimer - dt);
      return;
    }

    if (trySpawnShieldIcon()) {
      scheduleNextShieldSpawn();
    }
  }

  function updateMagnetSpawner(dt) {
    var icon = state.magnetIcon;
    if (state.score < C.magnetUnlockScore) {
      icon.active = false;
      state.magnetRespawnTimer = 0;
      return;
    }

    if (state.magnetTimeLeft > 0) {
      icon.active = false;
      return;
    }

    if (icon.active) {
      if (icon.x + icon.size < state.cameraX - 40) {
        icon.active = false;
        scheduleNextMagnetSpawn();
      }
      return;
    }

    if (state.magnetRespawnTimer > 0) {
      state.magnetRespawnTimer = Math.max(0, state.magnetRespawnTimer - dt);
      return;
    }

    if (trySpawnMagnetIcon()) {
      scheduleNextMagnetSpawn();
    }
  }

  function updateCurseSpawner(dt) {
    var icon = state.curseIcon;
    if (state.score < C.curseUnlockScore) {
      icon.active = false;
      state.curseRespawnTimer = 0;
      return;
    }

    if (state.curseTimeLeft > 0) {
      icon.active = false;
      return;
    }

    if (icon.active) {
      if (icon.x + icon.size < state.cameraX - 40) {
        icon.active = false;
        scheduleNextCurseSpawn();
      }
      return;
    }

    if (state.curseRespawnTimer > 0) {
      state.curseRespawnTimer = Math.max(0, state.curseRespawnTimer - dt);
      return;
    }

    if (trySpawnCurseIcon()) {
      scheduleNextCurseSpawn();
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
    if (state.score < C.platformCoinUnlockScore) {
      coin.active = false;
      state.platformCoinTimer = 0;
      state.lastPlatformCoinPlatformId = -1;
      return;
    }

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
    if (icon.active || state.score < getDoubleJumpPickupUnlockScore()) {
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
    pushIconRectIfActive(rects, state.crackedCoinIcon);
    pushIconRectIfActive(rects, state.questionCoinIcon);
    pushIconRectIfActive(rects, state.curseIcon);
    pushIconRectIfActive(rects, state.liveIcon);
    pushIconRectIfActive(rects, state.shieldIcon);
    pushIconRectIfActive(rects, state.magnetIcon);
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

    if (state.score >= C.platformCoinUnlockScore) {
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

  function findNearestBottomElevatorAhead() {
    var best = null;
    var bestDistance = Infinity;
    for (var i = 0; i < world.elevators.length; i += 1) {
      var elevator = world.elevators[i];
      if (elevator.skinPickupActive) {
        continue;
      }
      if (elevator.x + elevator.width < player.x + 12) {
        continue;
      }
      var isAtBottom = elevator.wrappedThisFrame || elevator.y >= elevator.maxY - 8;
      if (!isAtBottom) {
        continue;
      }
      var distance = elevator.x - player.x;
      if (distance < bestDistance) {
        best = elevator;
        bestDistance = distance;
      }
    }
    return best;
  }

  function tryAssignSkinDiscoveryPickup() {
    if (!state.skinDiscoveryPlan.active || state.skinDiscoveryPlan.assigned) {
      return false;
    }
    if (state.currentLevel !== state.skinDiscoveryPlan.level) {
      return false;
    }
    if (state.score < state.skinDiscoveryPlan.triggerScore) {
      return false;
    }

    var elevator = findNearestBottomElevatorAhead();
    if (!elevator) {
      return false;
    }

    elevator.skinPickupActive = true;
    elevator.skinPickupSkinName = state.skinDiscoveryPlan.skinName;
    if (typeof elevator.consumeCoin === "function") {
      elevator.consumeCoin();
    } else {
      elevator.coinActive = false;
    }
    state.skinPickupIcon.active = true;
    state.skinPickupIcon.skinName = state.skinDiscoveryPlan.skinName;
    state.skinDiscoveryPlan.assigned = true;
    return true;
  }

  function updateSkinDiscoverySpawner() {
    if (!state.skinDiscoveryPlan.active || state.skinDiscoveryPlan.assigned) {
      return;
    }
    if (state.currentLevel > state.skinDiscoveryPlan.level) {
      state.skinDiscoveryPlan.assigned = true;
      return;
    }
    tryAssignSkinDiscoveryPickup();
  }

  function checkSkinPickup() {
    if (!state.skinPickupIcon.active) {
      return;
    }

    var playerRect = { x: player.x, y: player.y, w: player.width, h: player.height };
    var size = state.skinPickupIcon.size;
    for (var i = 0; i < world.elevators.length; i += 1) {
      var elevator = world.elevators[i];
      if (!elevator.skinPickupActive) {
        continue;
      }
      var iconX = elevator.x + elevator.width * 0.5 - size * 0.5;
      var iconY = elevator.y - size;
      var iconRect = { x: iconX, y: iconY, w: size, h: size };
      if (!isRectIntersect(playerRect, iconRect)) {
        continue;
      }

      unlockSkin(elevator.skinPickupSkinName);
      elevator.skinPickupActive = false;
      elevator.skinPickupSkinName = "";
      state.skinPickupIcon.active = false;
      state.skinPickupIcon.skinName = "";
      return;
    }
  }

  function syncSkinPickupStateFromWorld() {
    if (!state.skinPickupIcon.active) {
      return;
    }

    for (var i = 0; i < world.elevators.length; i += 1) {
      if (world.elevators[i].skinPickupActive) {
        return;
      }
    }

    state.skinPickupIcon.active = false;
    state.skinPickupIcon.skinName = "";
  }

  function updateSkinPickupLifetime() {
    if (!state.skinPickupIcon.active) {
      return;
    }

    for (var i = 0; i < world.elevators.length; i += 1) {
      var elevator = world.elevators[i];
      if (!elevator.skinPickupActive) {
        continue;
      }
      if (!elevator.wrappedThisFrame) {
        continue;
      }
      elevator.skinPickupActive = false;
      elevator.skinPickupSkinName = "";
    }

    syncSkinPickupStateFromWorld();
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
      var slowDownPercent = Math.max(0, Number(C.slowDownByPercent) || 0);
      var slowMultiplier = Math.max(0, 1 - (slowDownPercent / 100));
      icon.active = false;
      state.scrollSpeed *= slowMultiplier;
      state.speedSlowMultiplier *= slowMultiplier;
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
      if (!isCurseActive()) {
        state.bonusScore += C.scoreBagBonus;
      }
      state.collectedBags += 1;
      state.levelCollectedBags += 1;
      scheduleNextScoreBagSpawn();
    }
  }

  function checkCrackedCoinPickup() {
    var icon = state.crackedCoinIcon;
    if (!icon.active) {
      return;
    }

    var playerRect = { x: player.x, y: player.y, w: player.width, h: player.height };
    var iconRect = { x: icon.x, y: icon.y, w: icon.size, h: icon.size };

    if (isRectIntersect(playerRect, iconRect)) {
      icon.active = false;
      applyLevelScoreDelta(-Math.floor(getLevelEarnedScore() * (C.crackedCoinPenaltyPercent / 100)));
      scheduleNextCrackedCoinSpawn();
    }
  }

  function checkQuestionCoinPickup() {
    var icon = state.questionCoinIcon;
    if (!icon.active) {
      return;
    }

    var playerRect = { x: player.x, y: player.y, w: player.width, h: player.height };
    var iconRect = { x: icon.x, y: icon.y, w: icon.size, h: icon.size };

    if (isRectIntersect(playerRect, iconRect)) {
      var stakeScore = icon.stakeScore;
      icon.active = false;
      icon.stakeScore = 0;
      scheduleNextQuestionCoinSpawn();
      startQuestionCoinAnimation(stakeScore);
    }
  }

  function checkCursePickup() {
    var icon = state.curseIcon;
    if (!icon.active) {
      return;
    }

    var playerRect = { x: player.x, y: player.y, w: player.width, h: player.height };
    var iconRect = { x: icon.x, y: icon.y, w: icon.size, h: icon.size };

    if (isRectIntersect(playerRect, iconRect)) {
      icon.active = false;
      state.curseTimeLeft += C.curseEffectSeconds;
      scheduleNextCurseSpawn();
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

  function checkShieldPickup() {
    var icon = state.shieldIcon;
    if (!icon.active) {
      return;
    }

    var playerRect = { x: player.x, y: player.y, w: player.width, h: player.height };
    var iconRect = { x: icon.x, y: icon.y, w: icon.size, h: icon.size };

    if (isRectIntersect(playerRect, iconRect)) {
      icon.active = false;
      state.shieldCharges = 1;
      scheduleNextShieldSpawn();
    }
  }

  function checkMagnetPickup() {
    var icon = state.magnetIcon;
    if (!icon.active) {
      return;
    }

    var playerRect = { x: player.x, y: player.y, w: player.width, h: player.height };
    var iconRect = { x: icon.x, y: icon.y, w: icon.size, h: icon.size };

    if (isRectIntersect(playerRect, iconRect)) {
      icon.active = false;
      state.magnetTimeLeft += C.magnetEffectSeconds;
      scheduleNextMagnetSpawn();
      convertVisiblePickupsToMagnetTargets();
    }
  }

  function isRectVisibleOnScreen(rect, padding) {
    var extra = Number.isFinite(padding) ? padding : 0;
    return (
      rect.x + rect.w >= state.cameraX - extra &&
      rect.x <= state.cameraX + C.canvasWidth + extra &&
      rect.y + rect.h >= C.topDeathLineY - extra &&
      rect.y <= C.bottomDeathLineY + extra
    );
  }

  function addMagnetAttractedItem(type, x, y, size) {
    state.magnetAttractedItems.push({
      type: type,
      x: x,
      y: y,
      size: size,
      age: 0
    });
  }

  function convertVisiblePickupsToMagnetTargets() {
    if (state.magnetTimeLeft <= 0) {
      return;
    }

    if (state.platformCoinIcon.active) {
      var platformCoinRect = {
        x: state.platformCoinIcon.x,
        y: state.platformCoinIcon.y,
        w: state.platformCoinIcon.size,
        h: state.platformCoinIcon.size
      };
      if (isRectVisibleOnScreen(platformCoinRect, 0)) {
        addMagnetAttractedItem("platformCoin", state.platformCoinIcon.x, state.platformCoinIcon.y, state.platformCoinIcon.size);
        state.platformCoinIcon.active = false;
      }
    }

    if (state.liveIcon.active) {
      var liveRect = {
        x: state.liveIcon.x,
        y: state.liveIcon.y,
        w: state.liveIcon.size,
        h: state.liveIcon.size
      };
      if (isRectVisibleOnScreen(liveRect, 0)) {
        addMagnetAttractedItem("live", state.liveIcon.x, state.liveIcon.y, state.liveIcon.size);
        state.liveIcon.active = false;
      }
    }

    if (state.score >= C.platformCoinUnlockScore) {
      for (var i = 0; i < world.elevators.length; i += 1) {
        var elevator = world.elevators[i];
        if (!elevator.coinActive) {
          continue;
        }

        var coinSize = C.playerSize * C.coinIconSizeRatio;
        var elevatorCoinX = elevator.x + elevator.width * 0.5 - coinSize * 0.5;
        var elevatorCoinY = elevator.y - coinSize;
        var elevatorCoinRect = {
          x: elevatorCoinX,
          y: elevatorCoinY,
          w: coinSize,
          h: coinSize
        };
        if (!isRectVisibleOnScreen(elevatorCoinRect, 0)) {
          continue;
        }

        addMagnetAttractedItem("elevatorCoin", elevatorCoinX, elevatorCoinY, coinSize);
        elevator.consumeCoin();
      }
    }
  }

  function collectMagnetAttractedItem(item) {
    if (item.type === "live") {
      state.livesLeft = Math.min(state.maxLives, state.livesLeft + 1);
      updateLivesUi();
      scheduleNextLiveSpawn();
      return;
    }

    if (!isCurseActive()) {
      state.bonusScore += C.coinScoreBonus;
    }
    state.collectedCoins += 1;
    state.levelCollectedCoins += 1;
    if (item.type === "platformCoin") {
      scheduleNextPlatformCoinSpawn();
    }
  }

  function updateMagnetAttractedItems(dt) {
    if (!state.magnetAttractedItems.length) {
      return;
    }

    var playerRect = { x: player.x, y: player.y, w: player.width, h: player.height };
    var playerCenterX = player.x + player.width * 0.5;
    var playerCenterY = player.y + player.height * 0.5;
    var attractSpeed = Math.max(520, state.scrollSpeed * 2.6);
    var collectDelay = 0.08;

    for (var i = state.magnetAttractedItems.length - 1; i >= 0; i -= 1) {
      var item = state.magnetAttractedItems[i];
      item.age += dt;
      var itemCenterX = item.x + item.size * 0.5;
      var itemCenterY = item.y + item.size * 0.5;
      var dx = playerCenterX - itemCenterX;
      var dy = playerCenterY - itemCenterY;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0.001) {
        var step = Math.min(distance, attractSpeed * dt);
        item.x += (dx / distance) * step;
        item.y += (dy / distance) * step;
      }

      var itemRect = { x: item.x, y: item.y, w: item.size, h: item.size };
      if (item.age >= collectDelay && isRectIntersect(playerRect, itemRect)) {
        collectMagnetAttractedItem(item);
        state.magnetAttractedItems.splice(i, 1);
      }
    }
  }

  function updateMagnetEffect(dt) {
    if (state.magnetTimeLeft > 0) {
      state.magnetTimeLeft = Math.max(0, state.magnetTimeLeft - dt);
      convertVisiblePickupsToMagnetTargets();
    } else {
      state.magnetTimeLeft = 0;
    }
    updateMagnetAttractedItems(dt);
  }

  function updateCurseEffect(dt) {
    if (state.curseTimeLeft <= 0) {
      state.curseTimeLeft = 0;
      return;
    }

    state.curseTimeLeft = Math.max(0, state.curseTimeLeft - dt);
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
      if (!isCurseActive()) {
        state.bonusScore += C.coinScoreBonus;
      }
      state.collectedCoins += 1;
      state.levelCollectedCoins += 1;
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
    if (state.score < C.platformCoinUnlockScore) {
      return;
    }

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
        if (!isCurseActive()) {
          state.bonusScore += C.coinScoreBonus;
        }
        state.collectedCoins += 1;
        state.levelCollectedCoins += 1;
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
    var isLevel2Cave = state.currentLevel === 2 && useModernVisuals();
    var isLevel3Volcano = state.currentLevel === 3 && useModernVisuals();
    var isLevel4Forest = state.currentLevel === 4 && useModernVisuals();
    ctx.fillStyle = state.lifeLossFlashTimeLeft > 0 ? "#ffb14a" : (isLevel2Cave ? "#050813" : (isLevel3Volcano ? "#2c0614" : (isLevel4Forest ? "#050c09" : "#ffffff")));
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var playableHeight = C.bottomDeathLineY - C.topDeathLineY;
    ctx.fillStyle = state.lifeLossFlashTimeLeft > 0 ? "#ffd08a" : (isLevel2Cave ? "#0b1223" : (isLevel3Volcano ? "#551123" : (isLevel4Forest ? "#11211a" : "#e8f4ff")));
    ctx.fillRect(0, C.topDeathLineY, canvas.width, playableHeight);

    if (state.lifeLossFlashTimeLeft > 0 || !useModernVisuals()) {
      return;
    }

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, C.topDeathLineY, canvas.width, playableHeight);
    ctx.clip();
    if (state.currentLevel === 2) {
      drawParallaxStrip(sceneArt.level2CaveBack, 0.08, C.topDeathLineY, playableHeight);
      drawParallaxStrip(sceneArt.level2CaveFront, 0.2, C.topDeathLineY, playableHeight);
    } else if (state.currentLevel === 3) {
      drawParallaxStrip(sceneArt.level3VolcanoBack, 0.07, C.topDeathLineY, playableHeight);
      drawParallaxStrip(sceneArt.level3VolcanoFront, 0.18, C.topDeathLineY, playableHeight);
    } else if (state.currentLevel === 4) {
      drawParallaxStrip(sceneArt.level4ForestBack, 0.06, C.topDeathLineY, playableHeight);
      drawParallaxStrip(sceneArt.level4ForestMid, 0.14, C.topDeathLineY, playableHeight);
      drawParallaxStrip(sceneArt.level4ForestFront, 0.24, C.topDeathLineY, playableHeight);
    } else if (state.currentLevel === 5) {
      drawParallaxStrip(sceneArt.level5Sky, 0.12, C.topDeathLineY, playableHeight);
      drawParallaxStrip(sceneArt.level5Foreground, 0.32, C.topDeathLineY, playableHeight);
    } else {
      drawParallaxStrip(sceneArt.backgroundSky, 0.12, C.topDeathLineY, playableHeight);
      drawParallaxStrip(sceneArt.backgroundForeground, 0.32, C.topDeathLineY, playableHeight);
    }
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
    var platformArt = getCurrentLevelSceneArt("platform");
    for (var i = 0; i < world.platforms.length; i += 1) {
      var p = world.platforms[i];
      var x = worldToScreenX(p.x);
      var drewModernPlatform = useModernVisuals() && drawSceneArtStrip(
        platformArt,
        x,
        p.y,
        p.width,
        PLATFORM_ART_RENDER_HEIGHT,
        {
          leftCapSourceX: 0,
          leftCapSourceWidth: PLATFORM_RIGHT_CAP_WIDTH,
          rightCapSourceX: platformArt ? platformArt.width - PLATFORM_RIGHT_CAP_WIDTH : 0,
          rightCapSourceWidth: PLATFORM_RIGHT_CAP_WIDTH,
          centerSourceX: 0,
          centerSourceWidth: platformArt ? platformArt.width - PLATFORM_RIGHT_CAP_WIDTH : 0,
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
    var elevatorArt = getCurrentLevelSceneArt("elevator");
    for (var i = 0; i < world.elevators.length; i += 1) {
      var e = world.elevators[i];
      var x = worldToScreenX(e.x);
      var modernElevatorHeight = e.height;
      var retroElevatorHeight = C.platformHeight;
      var drewModernElevator = useModernVisuals() && drawSceneArtStrip(
        elevatorArt,
        x,
        e.y,
        e.width,
        modernElevatorHeight,
        {
          leftCapSourceX: 0,
          leftCapSourceWidth: ELEVATOR_CAP_WIDTH,
          rightCapSourceX: elevatorArt ? elevatorArt.width - ELEVATOR_CAP_WIDTH : 0,
          rightCapSourceWidth: ELEVATOR_CAP_WIDTH,
          centerSourceX: ELEVATOR_CAP_WIDTH,
          centerSourceWidth: elevatorArt ? elevatorArt.width - ELEVATOR_CAP_WIDTH * 2 : 0,
          mirrorLeftCapFromRight: false
        }
      );
      if (!drewModernElevator) {
        ctx.fillStyle = state.doubleJumpExpireFlashTimeLeft > 0 ? "#d70000" : "#222";
        ctx.fillRect(x, e.y, e.width, retroElevatorHeight);
      }
    }
  }

  function getPlayerVisualYOffset() {
    if (player && player.isGrounded && player.supportType === "elevator") {
      return 4;
    }
    return 0;
  }

  function drawPlayer() {
    if (state.projectileDeathAnimActive || state.teleportFinishAnimActive || state.levelFinishedActive) {
      return;
    }

    var x = worldToScreenX(player.x);
    var y = player.y + getPlayerVisualYOffset();
    var cx = x + player.width * 0.5;
    var cy = y + player.height * 0.5;
    var heroFrame = useModernVisuals() ? getCurrentHeroFrame() : null;

    ctx.save();
    ctx.translate(cx, cy);
    if (heroFrame) {
      var heroRenderMetrics = getHeroRenderMetrics();
      var heroSourceRect = getHeroFrameSourceRect(heroFrame);
      ctx.drawImage(
        heroFrame.image,
        heroSourceRect.x,
        heroSourceRect.y,
        heroSourceRect.w,
        heroSourceRect.h,
        heroRenderMetrics.drawX,
        heroRenderMetrics.drawY,
        heroRenderMetrics.drawWidth,
        heroRenderMetrics.drawHeight
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

  function drawTeleportFinishAnimation() {
    if (!state.teleportFinishAnimActive) {
      return;
    }

    var elapsed = state.teleportFinishAnimElapsed;
    var centerX = worldToScreenX(state.teleportFinishAnimHeroCenterX);
    var centerY = state.teleportFinishAnimHeroCenterY;
    var heroStartSize = state.teleportFinishAnimHeroStartSize;

    if (elapsed < TELEPORT_FINISH_HERO_SHRINK_SECONDS) {
      var shrinkT = smoothStep01(elapsed / TELEPORT_FINISH_HERO_SHRINK_SECONDS);
      var currentSize = heroStartSize * (1 - shrinkT * 0.88);
      var alpha = 1 - shrinkT * 0.5;
      var heroFrame = useModernVisuals() ? getCurrentHeroFrame() : null;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.globalAlpha = alpha;
      if (heroFrame) {
        var teleportRenderMetrics = getHeroRenderMetrics(currentSize / Math.max(1, player.height));
        var heroSourceRect = getHeroFrameSourceRect(heroFrame);
        ctx.drawImage(
          heroFrame.image,
          heroSourceRect.x,
          heroSourceRect.y,
          heroSourceRect.w,
          heroSourceRect.h,
          teleportRenderMetrics.drawX,
          teleportRenderMetrics.drawY,
          teleportRenderMetrics.drawWidth,
          teleportRenderMetrics.drawHeight
        );
      } else {
        ctx.fillStyle = "#0077ff";
        ctx.fillRect(-currentSize * 0.28, -currentSize * 0.28, currentSize * 0.56, currentSize * 0.56);
      }
      ctx.restore();
      return;
    }

    var sparkElapsed = elapsed - TELEPORT_FINISH_HERO_SHRINK_SECONDS;
    var sparkT = smoothStep01(Math.min(1, sparkElapsed / TELEPORT_FINISH_SPARK_GROW_SECONDS));
    var sparkSize = heroStartSize * (0.18 + sparkT * 2.32);
    var rotation = sparkElapsed * 8;
    var sparkFadeInOutT = sparkT <= 0.5 ? (sparkT / 0.5) : ((1 - sparkT) / 0.5);
    var sparkAlphaEnvelope = smoothStep01(Math.max(0, sparkFadeInOutT));

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    ctx.globalAlpha = 0.95 * sparkAlphaEnvelope;

    var glowRadius = sparkSize * 0.6;
    var glow = ctx.createRadialGradient(0, 0, sparkSize * 0.06, 0, 0, glowRadius);
    glow.addColorStop(0, "rgba(255,255,255,0.98)");
    glow.addColorStop(0.24, "rgba(255,240,130,0.95)");
    glow.addColorStop(0.55, "rgba(255,130,40,0.72)");
    glow.addColorStop(1, "rgba(255,80,20,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255,250,220,0.98)";
    drawSparkShape(sparkSize);
    ctx.rotate(-rotation * 1.7);
    ctx.globalAlpha = 0.72 * sparkAlphaEnvelope;
    ctx.fillStyle = "rgba(255,180,70,0.95)";
    drawSparkShape(sparkSize * 0.58);
    ctx.restore();
  }

  function drawSparkShape(size) {
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.5);
    ctx.lineTo(size * 0.12, -size * 0.12);
    ctx.lineTo(size * 0.5, 0);
    ctx.lineTo(size * 0.12, size * 0.12);
    ctx.lineTo(0, size * 0.5);
    ctx.lineTo(-size * 0.12, size * 0.12);
    ctx.lineTo(-size * 0.5, 0);
    ctx.lineTo(-size * 0.12, -size * 0.12);
    ctx.closePath();
    ctx.fill();
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
    var heroSkin = getSelectedHeroSkinSceneArt();
    if (!heroSkin.heroFrames.length) {
      return null;
    }

    var loadedFrames = heroSkin.heroFrames.filter(function (frame) {
      return Boolean(frame);
    });
    if (!loadedFrames.length) {
      return null;
    }

    var selectedSkinName = getSelectedHeroSkinName();
    var skinFrameConfig = SKIN_FRAME_CONFIGS[selectedSkinName] || SKIN_FRAME_CONFIGS.Skin01;
    var walkFrameSeconds = skinFrameConfig.walkFrameSeconds || HERO_WALK_FRAME_SECONDS;
    var frameIndex = Math.floor(state.runTimeSeconds / walkFrameSeconds) % loadedFrames.length;
    return {
      image: loadedFrames[frameIndex] || null,
      index: frameIndex,
      type: "walk"
    };
  }

  function getHeroJumpFrame() {
    var heroSkin = getSelectedHeroSkinSceneArt();
    if (!heroSkin.heroJumpFrames.length) {
      return null;
    }

    var loadedFrames = heroSkin.heroJumpFrames.filter(function (frame) {
      return Boolean(frame);
    });
    if (!loadedFrames.length) {
      return null;
    }

    var apexFrameIndex = loadedFrames.length >= 9 ? 4 : Math.min(loadedFrames.length - 1, Math.max(0, Math.floor((loadedFrames.length - 1) * 0.5)));
    var ascentFrameCount = Math.max(1, Math.min(apexFrameIndex, 4));
    var frameIndex = apexFrameIndex;
    if (state.heroJumpAnimStarted && player.velocityY < 0) {
      frameIndex = Math.min(apexFrameIndex, Math.floor(state.heroJumpAnimTime / HERO_JUMP_FRAME_SECONDS), ascentFrameCount);
    }

    return {
      image: loadedFrames[frameIndex] || null,
      index: frameIndex,
      type: "jump"
    };
  }

  function getHeroLandingFrame() {
    var heroSkin = getSelectedHeroSkinSceneArt();
    if (!heroSkin.heroJumpFrames.length) {
      return null;
    }

    var loadedFrames = heroSkin.heroJumpFrames.filter(function (frame) {
      return Boolean(frame);
    });
    if (!loadedFrames.length) {
      return null;
    }

    var landingStartIndex = loadedFrames.length >= 9 ? 5 : Math.max(0, loadedFrames.length - 3);
    var landingFrameCount = Math.max(1, loadedFrames.length - landingStartIndex);
    var landingFrameIndex = landingStartIndex + Math.min(landingFrameCount - 1, Math.floor(state.heroLandingAnimTime / HERO_JUMP_FRAME_SECONDS));
    return {
      image: loadedFrames[landingFrameIndex] || null,
      index: landingFrameIndex,
      type: "jump"
    };
  }

  function getHeroLandingFrameCount() {
    var heroSkin = getSelectedHeroSkinSceneArt();
    if (!heroSkin.heroJumpFrames.length) {
      return 1;
    }

    var loadedFrames = heroSkin.heroJumpFrames.filter(function (frame) {
      return Boolean(frame);
    });
    if (!loadedFrames.length) {
      return 1;
    }

    var landingStartIndex = loadedFrames.length >= 9 ? 5 : Math.max(0, loadedFrames.length - 3);
    return Math.max(1, loadedFrames.length - landingStartIndex);
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
        var landingFrameCount = getHeroLandingFrameCount();
        var landingMaxDuration = HERO_JUMP_FRAME_SECONDS * landingFrameCount;
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
    var moneybagArt = getCurrentLevelSceneArt("moneybag");
    if (useModernVisuals() && moneybagArt) {
      ctx.drawImage(moneybagArt, x, y, s, s);
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

  function drawCrackedCoinIcon() {
    var icon = state.crackedCoinIcon;
    if (!icon.active) {
      return;
    }

    var x = worldToScreenX(icon.x);
    var y = icon.y;
    var s = icon.size;
    var cx = x + s * 0.5;
    var cy = y + s * 0.5;

    ctx.save();
    ctx.fillStyle = "#d3a63a";
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.46, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f6d66f";
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.33, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#6f4e17";
    ctx.lineWidth = Math.max(3, s * 0.08);
    ctx.beginPath();
    ctx.moveTo(x + s * 0.32, y + s * 0.1);
    ctx.lineTo(x + s * 0.54, y + s * 0.34);
    ctx.lineTo(x + s * 0.43, y + s * 0.45);
    ctx.lineTo(x + s * 0.64, y + s * 0.67);
    ctx.lineTo(x + s * 0.48, y + s * 0.88);
    ctx.stroke();
    ctx.restore();
  }

  function drawQuestionCoinIcon() {
    var icon = state.questionCoinIcon;
    if (!icon.active) {
      return;
    }

    var x = worldToScreenX(icon.x);
    var y = icon.y;
    var s = icon.size;
    var cx = x + s * 0.5;
    var cy = y + s * 0.5;
    var stakeText = icon.stakeScore.toLocaleString("en-US");

    ctx.save();
    ctx.fillStyle = "#f0c94a";
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.46, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffe282";
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.34, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#5d3fd3";
    ctx.textAlign = "center";
    ctx.font = "bold " + Math.max(18, Math.floor(s * 0.54)) + "px Arial";
    ctx.fillText("?", cx, y + s * 0.68);
    ctx.font = "bold " + Math.max(19, Math.floor(s * 0.37)) + "px Arial";
    ctx.lineWidth = Math.max(2, s * 0.05);
    ctx.strokeStyle = "rgba(52, 35, 0, 0.95)";
    ctx.strokeText(stakeText, cx, y - Math.max(8, s * 0.14));
    ctx.fillStyle = "#ffe45e";
    ctx.fillText(stakeText, cx, y - Math.max(8, s * 0.14));
    ctx.restore();
  }

  function drawCurseIcon() {
    var icon = state.curseIcon;
    if (!icon.active) {
      return;
    }

    var x = worldToScreenX(icon.x);
    var y = icon.y;
    var s = icon.size;
    var cx = x + s * 0.5;
    var cy = y + s * 0.5;

    ctx.save();
    ctx.fillStyle = "#2b2345";
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.46, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#171125";
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.33, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#a56bff";
    ctx.lineWidth = Math.max(3, s * 0.06);
    ctx.beginPath();
    ctx.moveTo(cx, y + s * 0.18);
    ctx.bezierCurveTo(x + s * 0.72, y + s * 0.22, x + s * 0.72, y + s * 0.42, cx, y + s * 0.48);
    ctx.bezierCurveTo(x + s * 0.34, y + s * 0.5, x + s * 0.36, y + s * 0.66, cx, y + s * 0.72);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, y + s * 0.84, Math.max(2, s * 0.045), 0, Math.PI * 2);
    ctx.fillStyle = "#a56bff";
    ctx.fill();
    ctx.restore();
  }

  function drawLiveIcon() {
    var icon = state.liveIcon;
    if (!icon.active) {
      return;
    }

    var x = worldToScreenX(icon.x);
    var y = icon.y;
    var s = icon.size;
    var heartArt = getCurrentLevelSceneArt("heart");
    if (useModernVisuals() && heartArt) {
      ctx.drawImage(heartArt, x, y, s, s);
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

  function drawShieldIcon() {
    var icon = state.shieldIcon;
    if (!icon.active) {
      return;
    }

    var x = worldToScreenX(icon.x);
    var y = icon.y;
    var s = icon.size;
    var cx = x + s * 0.5;
    var cy = y + s * 0.5;
    var radius = s * 0.34;
    var pulse = 1 + Math.sin(state.runTimeSeconds * 5) * 0.04;

    ctx.save();
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = "rgba(96, 227, 255, 0.22)";
    ctx.beginPath();
    ctx.arc(cx, cy, radius * pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#7ae7ff";
    ctx.lineWidth = Math.max(3, s * 0.075);
    ctx.beginPath();
    ctx.arc(cx, cy, radius * pulse, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.78)";
    ctx.lineWidth = Math.max(2, s * 0.04);
    ctx.beginPath();
    ctx.arc(cx - s * 0.07, cy - s * 0.08, radius * 0.4, Math.PI * 1.15, Math.PI * 1.8);
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.beginPath();
    ctx.arc(cx - s * 0.12, cy - s * 0.14, s * 0.055, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawMagnetIcon() {
    var icon = state.magnetIcon;
    if (!icon.active) {
      return;
    }

    var x = worldToScreenX(icon.x);
    var y = icon.y;
    var s = icon.size;
    if (sceneArt.magnet) {
      ctx.drawImage(sceneArt.magnet, x, y, s, s);
      return;
    }
    var poleWidth = s * 0.22;
    var topY = y + s * 0.16;
    var bottomY = y + s * 0.72;
    var leftX = x + s * 0.24;
    var rightX = x + s * 0.76;
    var innerRadius = s * 0.26;
    var arcCenterY = y + s * 0.47;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(5, s * 0.12);
    ctx.strokeStyle = "#1f2a44";
    ctx.beginPath();
    ctx.moveTo(leftX, topY);
    ctx.lineTo(leftX, bottomY);
    ctx.arc(x + s * 0.5, arcCenterY, innerRadius, Math.PI, 0, false);
    ctx.lineTo(rightX, topY);
    ctx.stroke();

    ctx.fillStyle = "#e63946";
    ctx.fillRect(leftX - poleWidth * 0.5, topY - s * 0.03, poleWidth, s * 0.18);
    ctx.fillRect(rightX - poleWidth * 0.5, topY - s * 0.03, poleWidth, s * 0.18);
    ctx.fillStyle = "#8ecae6";
    ctx.fillRect(leftX - poleWidth * 0.5, topY + s * 0.15, poleWidth, s * 0.14);
    ctx.fillRect(rightX - poleWidth * 0.5, topY + s * 0.15, poleWidth, s * 0.14);

    ctx.strokeStyle = "rgba(255, 224, 122, 0.9)";
    ctx.lineWidth = Math.max(2, s * 0.045);
    ctx.beginPath();
    ctx.arc(x + s * 0.5, y + s * 0.36, s * 0.1, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + s * 0.5, y + s * 0.36, s * 0.18, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    ctx.restore();
  }

  function drawPlayerStatusEffects() {
    if (state.projectileDeathAnimActive || state.teleportFinishAnimActive || state.levelFinishedActive) {
      return;
    }

    var visualYOffset = getPlayerVisualYOffset();
    var centerX = worldToScreenX(player.x + player.width * 0.5);
    var centerY = player.y + visualYOffset + player.height * 0.5;
    var radius = player.width * 0.62;
    var time = state.runTimeSeconds;

    if (state.shieldCharges > 0) {
      var shieldFrame = sceneArt.shieldIdleFrame || sceneArt.shieldBurstFrames[0] || null;
      if (shieldFrame) {
        var shieldSize = player.width * 2.18;
        var shieldCenterY = centerY - player.height * 0.10;
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.drawImage(
          shieldFrame,
          centerX - shieldSize * 0.5,
          shieldCenterY - shieldSize * 0.5,
          shieldSize,
          shieldSize
        );
        ctx.restore();
      } else {
        ctx.save();
        ctx.strokeStyle = "rgba(79, 215, 255, 0.25)";
        ctx.lineWidth = Math.max(3, player.width * 0.06);
        ctx.shadowColor = "rgba(79, 215, 255, 0.18)";
        ctx.shadowBlur = player.width * 0.18;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    if (state.magnetTimeLeft > 0) {
      ctx.save();
      ctx.strokeStyle = "rgba(255, 212, 89, 0.9)";
      ctx.lineWidth = Math.max(2, player.width * 0.045);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 8, time * 3, time * 3 + Math.PI * 0.9);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 16, -time * 3.5, -time * 3.5 + Math.PI * 0.9);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawShieldBurstEffect() {
    if (!state.shieldBurstActive || !sceneArt.shieldBurstFrames.length) {
      return;
    }

    var loadedFrames = sceneArt.shieldBurstFrames.filter(function (frame) {
      return Boolean(frame);
    });
    if (!loadedFrames.length) {
      return;
    }

    var progress = Math.max(0, Math.min(1, state.shieldBurstElapsed / Math.max(0.001, state.shieldBurstDuration)));
    var frameIndex = Math.min(
      loadedFrames.length - 1,
      Math.floor(progress * loadedFrames.length)
    );
    var frame = loadedFrames[frameIndex];
    var visualYOffset = getPlayerVisualYOffset();
    var centerX = worldToScreenX(player.x + player.width * 0.5);
    var centerY = player.y + visualYOffset + player.height * 0.5;
    var burstSize = player.width * 2.46;

    ctx.save();
    ctx.globalAlpha = 0.25 * (1 - progress * 0.2);
    ctx.drawImage(
      frame,
      centerX - burstSize * 0.5,
      centerY - burstSize * 0.5,
      burstSize,
      burstSize
    );
    ctx.restore();
  }

  function drawBlockerIcon() {
    var blockerArt = getCurrentLevelSceneArt("blocker");
    for (var i = 0; i < state.blockerIcons.length; i += 1) {
      var icon = state.blockerIcons[i];
      var x = worldToScreenX(icon.x);
      var y = icon.y;
      var s = icon.size;
      if (useModernVisuals() && blockerArt) {
        ctx.drawImage(blockerArt, x, y, s, s);
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

  function drawTeleport() {
    if (!state.teleport.active) {
      return;
    }

    var x = worldToScreenX(state.teleport.x);
    var width = state.teleport.width;
    var y = C.topDeathLineY;
    var height = C.bottomDeathLineY - C.topDeathLineY;
    var teleportFrame = getTeleportFrame();

    if (useModernVisuals() && teleportFrame) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.92;
      ctx.drawImage(teleportFrame, x, y, width, height);
      ctx.restore();
      return;
    }

    var gradient = ctx.createLinearGradient(x, y, x + width, y);
    gradient.addColorStop(0, "rgba(72, 218, 255, 0.18)");
    gradient.addColorStop(0.5, "rgba(72, 218, 255, 0.68)");
    gradient.addColorStop(1, "rgba(72, 218, 255, 0.18)");
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);

    ctx.strokeStyle = "#72daff";
    ctx.lineWidth = 4;
    ctx.strokeRect(x + 2, y + 2, Math.max(0, width - 4), Math.max(0, height - 4));
  }

  function getTeleportFrame() {
    if (!sceneArt.teleportFrames.length) {
      return null;
    }

    var loadedFrames = sceneArt.teleportFrames.filter(function (frame) {
      return !!frame;
    });
    if (!loadedFrames.length) {
      return null;
    }

    var frameIndex = Math.floor(state.runTimeSeconds / TELEPORT_ANIMATION_FRAME_SECONDS) % loadedFrames.length;
    return loadedFrames[frameIndex];
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
    var rocket1 = getCurrentLevelSceneArt("rocket1");
    var rocket2 = getCurrentLevelSceneArt("rocket2");
    if (!rocket1 && !rocket2) {
      return null;
    }

    if (!rocket1) {
      return rocket2;
    }

    if (!rocket2) {
      return rocket1;
    }

    var animationStep = Math.floor(state.runTimeSeconds / ROCKET_ANIMATION_FRAME_SECONDS) % 5;
    return animationStep < 3 ? rocket1 : rocket2;
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

  function drawQuestionCoinAnimation() {
    if (!state.questionCoinAnimActive) {
      return;
    }

    var randomizerDuration = 2;
    var w = Math.min(canvas.width * 0.46, 420);
    var h = Math.min(canvas.height * 0.28, 220);
    var x = canvas.width * 0.5 - w * 0.5;
    var y = canvas.height * 0.5 - h * 0.5;
    var stakeText = state.questionCoinAnimStakeScore.toLocaleString("en-US");
    var resultText = Math.abs(state.questionCoinAnimDelta).toLocaleString("en-US");
    var revealPhase = state.questionCoinAnimElapsed >= randomizerDuration;
    var displaySymbol = revealPhase
      ? state.questionCoinAnimResult
      : (Math.floor(state.questionCoinAnimElapsed * 14) % 2 === 0 ? "+" : "-");

    ctx.save();
    ctx.fillStyle = "rgba(4, 10, 24, 0.72)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255, 247, 219, 0.96)";
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 3;
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);

    ctx.textAlign = "center";
    ctx.fillStyle = "#111";
    ctx.font = "bold 26px Arial";
    ctx.fillText("Question Coin", canvas.width * 0.5, y + 42);
    ctx.font = "20px Arial";
    if (revealPhase) {
      if (state.questionCoinAnimResult === "+") {
        ctx.fillText("You won " + resultText, canvas.width * 0.5, y + 76);
      } else {
        ctx.fillText("You lost " + resultText, canvas.width * 0.5, y + 76);
      }
    } else {
      ctx.fillText("Playing for " + stakeText + " score", canvas.width * 0.5, y + 76);
    }
    ctx.font = "bold 92px Arial";
    ctx.fillStyle = displaySymbol === "+" ? "#1f9d55" : "#d64545";
    ctx.fillText(displaySymbol, canvas.width * 0.5, y + h * 0.72);
    ctx.restore();
  }

  function drawCoinSymbol(screenX, screenY, size) {
    var coinArt = getCurrentLevelSceneArt("coin");
    if (useModernVisuals() && coinArt) {
      ctx.drawImage(coinArt, screenX, screenY, size, size);
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

  function drawSkinCoinSymbol(screenX, screenY, size, skinName) {
    var iconImage = sceneArt.heroSkinIcons[normalizeSkinName(skinName)] || null;
    drawCoinSymbol(screenX, screenY, size);

    if (!iconImage) {
      return;
    }

    var iconSize = size * 0.68;
    var iconX = screenX + (size - iconSize) * 0.5;
    var iconY = screenY + (size - iconSize) * 0.5;
    ctx.drawImage(iconImage, iconX, iconY, iconSize, iconSize);
  }

  function drawSkinPickupIcon() {
    if (!state.skinPickupIcon.active) {
      return;
    }

    var size = state.skinPickupIcon.size;
    for (var i = 0; i < world.elevators.length; i += 1) {
      var elevator = world.elevators[i];
      if (!elevator.skinPickupActive) {
        continue;
      }

      var x = worldToScreenX(elevator.x + elevator.width * 0.5 - size * 0.5);
      var y = elevator.y - size;
      drawSkinCoinSymbol(x, y, size, elevator.skinPickupSkinName);
    }
  }

  function drawPlatformCoinIcon() {
    var coin = state.platformCoinIcon;
    if (!coin.active) {
      return;
    }
    drawCoinSymbol(worldToScreenX(coin.x), coin.y, coin.size);
  }

  function drawMagnetAttractedItems() {
    for (var i = 0; i < state.magnetAttractedItems.length; i += 1) {
      var item = state.magnetAttractedItems[i];
      var screenX = worldToScreenX(item.x);
      if (item.type === "live") {
        var liveArt = getCurrentLevelSceneArt("heart");
        if (useModernVisuals() && liveArt) {
          ctx.drawImage(liveArt, screenX, item.y, item.size, item.size);
        } else {
          var cx = screenX + item.size * 0.5;
          ctx.strokeStyle = "#111";
          ctx.lineWidth = Math.max(2, item.size * 0.06);
          ctx.beginPath();
          ctx.moveTo(cx, item.y + item.size * 0.92);
          ctx.bezierCurveTo(screenX + item.size * 0.18, item.y + item.size * 0.7, screenX + item.size * 0.08, item.y + item.size * 0.38, screenX + item.size * 0.26, item.y + item.size * 0.22);
          ctx.bezierCurveTo(screenX + item.size * 0.4, item.y + item.size * 0.08, cx, item.y + item.size * 0.18, cx, item.y + item.size * 0.34);
          ctx.bezierCurveTo(cx, item.y + item.size * 0.18, screenX + item.size * 0.6, item.y + item.size * 0.08, screenX + item.size * 0.74, item.y + item.size * 0.22);
          ctx.bezierCurveTo(screenX + item.size * 0.92, item.y + item.size * 0.38, screenX + item.size * 0.82, item.y + item.size * 0.7, cx, item.y + item.size * 0.92);
          ctx.stroke();
        }
      } else {
        drawCoinSymbol(screenX, item.y, item.size);
      }
    }
  }

  function drawElevatorCoins() {
    if (state.score < C.platformCoinUnlockScore) {
      return;
    }

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
    var hudTextColor =
      state.currentLevel === 2 || state.currentLevel === 3 || state.currentLevel === 4 ? "#ffffff" : "#111";
    ctx.fillStyle = hudTextColor;
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
    if (state.curseTimeLeft > 0) {
      ctx.fillText("Curse: " + state.curseTimeLeft.toFixed(1) + "s", canvas.width * 0.5, 92);
    }
    ctx.textAlign = "right";
    ctx.font = "24px Arial";
    ctx.fillText(getLevelDisplayName(state.currentLevel), canvas.width - 18, 36);
    ctx.font = "20px Arial";
    ctx.fillText("Speed +" + state.speedPercent + "%", canvas.width - 18, 64);
    if (state.shieldCharges > 0) {
      ctx.fillText("Shield: ON", canvas.width - 18, 90);
    }
    if (state.magnetTimeLeft > 0) {
      ctx.fillText("Magnet: " + state.magnetTimeLeft.toFixed(1) + "s", canvas.width - 18, 116);
    }
    ctx.textAlign = "left";

    if (state.skinUnlockToastTimeLeft > 0 && state.skinUnlockToastText) {
      ctx.save();
      ctx.textAlign = "center";
      ctx.font = "bold 22px Arial";
      ctx.fillStyle = "#08293a";
      ctx.fillText(state.skinUnlockToastText, canvas.width * 0.5, C.topDeathLineY + 34);
      ctx.restore();
    }
  }

  init();
})();
