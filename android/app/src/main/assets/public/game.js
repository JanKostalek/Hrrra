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
- Question coin: questionCoinUnlockScore, questionCoinWinPercent, questionCoinLosePercent, questionCoinRespawnMinSeconds, questionCoinRespawnMaxSeconds
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
    var gameOverBannerEl = document.getElementById("game-over-banner");
    var finalScoreEl = document.getElementById("final-score");
    var finalCoinsEarnedEl = document.getElementById("final-coins-earned");
  var finalWalletBalanceEl = document.getElementById("final-wallet-balance");
  var finalContinueStatusEl = document.getElementById("final-continue-status");
  var finalContinueActionsEl = document.getElementById("final-continue-actions");
  var finalContinueBtn = document.getElementById("final-continue-btn");
  var finalWatchAdBtn = document.getElementById("final-watch-ad-btn");
  var finalEndRunBtn = document.getElementById("final-end-run-btn");
  var continuePurchaseOverlayEl = document.getElementById("continue-purchase-overlay");
  var continuePurchaseHeartsEl = document.getElementById("continue-purchase-hearts");
  var continuePurchaseUnitPriceEl = document.getElementById("continue-purchase-unit-price");
  var continuePurchaseWalletEl = document.getElementById("continue-purchase-wallet");
  var continuePurchaseTotalEl = document.getElementById("continue-purchase-total");
  var continuePurchaseStatusEl = document.getElementById("continue-purchase-status");
  var continuePurchaseBuyBtn = document.getElementById("continue-purchase-buy");
  var continuePurchaseBackBtn = document.getElementById("continue-purchase-back");
  var finalHighscoresEl = document.getElementById("final-highscores");
  var finalTopScoresStatusEl = document.getElementById("final-top-scores-status");
  var finalTopScoresListEl = document.getElementById("final-top-scores-list");
  var finalOnlineHighscoreEl = document.getElementById("final-online-highscore");
  var finalOnlineStatusEl = document.getElementById("final-online-status");
  var finalOnlineListEl = document.getElementById("final-online-list");
  var badgeRewardOverlayEl = document.getElementById("badge-reward-overlay");
  var badgeRewardKickerEl = document.getElementById("badge-reward-kicker");
  var badgeRewardNameEl = document.getElementById("badge-reward-name");
  var badgeRewardTierEl = document.getElementById("badge-reward-tier");
  var badgeRewardTrophyBaseEl = document.getElementById("badge-reward-trophy-base");
  var badgeRewardTrophyArtEl = document.getElementById("badge-reward-trophy-art");
  var badgeRewardGoalEl = document.getElementById("badge-reward-goal");
  var badgeRewardProgressEl = document.getElementById("badge-reward-progress");
  var badgeRewardPromptEl = document.getElementById("badge-reward-prompt");
  var skinRewardOverlayEl = document.getElementById("skin-reward-overlay");
  var skinRewardKickerEl = document.getElementById("skin-reward-kicker");
  var skinRewardNameEl = document.getElementById("skin-reward-name");
  var skinRewardTierEl = document.getElementById("skin-reward-tier");
  var skinRewardTrophyBaseEl = document.getElementById("skin-reward-trophy-base");
  var skinRewardTrophyArtEl = document.getElementById("skin-reward-trophy-art");
  var skinRewardGoalEl = document.getElementById("skin-reward-goal");
  var skinRewardProgressEl = document.getElementById("skin-reward-progress");
  var skinRewardPromptEl = document.getElementById("skin-reward-prompt");
  var modeRewardOverlayEl = document.getElementById("skin-reward-overlay");
  var preRunScreenEl = document.getElementById("pre-run-screen");
  var preRunLaunchOverlayEl = document.getElementById("pre-run-launch-overlay");
  var preRunLaunchCopyEl = document.getElementById("pre-run-launch-copy");
  var updateNoticeEl = document.getElementById("update-notice");
  var updateNoticeTitleEl = document.getElementById("update-notice-title");
  var updateNoticeMessageEl = document.getElementById("update-notice-message");
  var updateNoticeLaterBtn = document.getElementById("update-notice-later");
  var updateNoticeApplyBtn = document.getElementById("update-notice-apply");
  var whatsNewNoticeEl = document.getElementById("whats-new-notice");
  var whatsNewTitleEl = document.getElementById("whats-new-title");
  var whatsNewVersionEl = document.getElementById("whats-new-version");
  var whatsNewListEl = document.getElementById("whats-new-list");
  var whatsNewOkBtn = document.getElementById("whats-new-ok");
  var badgeResetNoticeEl = document.getElementById("badge-reset-notice");
  var badgeResetOkBtn = document.getElementById("badge-reset-ok");
  var playerNameNoticeEl = document.getElementById("player-name-notice");
  var playerNameTitleEl = document.getElementById("player-name-title");
  var playerNameCopyEl = document.getElementById("player-name-copy");
  var playerNameInputEl = document.getElementById("player-name-input");
  var playerPasswordInputEl = document.getElementById("player-password-input");
  var playerNameErrorEl = document.getElementById("player-name-error");
  var playerNameGuestBtn = document.getElementById("player-name-guest");
  var playerNameSaveBtn = document.getElementById("player-name-save");
  var preRunSelectScreenEl = document.getElementById("pre-run-select-screen");
  var preRunSelectGfx2El = document.getElementById("pre-run-select-gfx2");
  var preRunGfx2SceneEl = preRunSelectGfx2El ? preRunSelectGfx2El.querySelector(".pre-run-gfx2-scene") : null;
  var preRunGfx2CloudRulesEl = preRunSelectGfx2El ? preRunSelectGfx2El.querySelector(".pre-run-gfx2-static-cloud-rules") : null;
  var preRunGfx2CloudCreditsEl = preRunSelectGfx2El ? preRunSelectGfx2El.querySelector(".pre-run-gfx2-static-cloud-credits") : null;
  var preRunGfx2CloudFortuneEl = preRunSelectGfx2El ? preRunSelectGfx2El.querySelector(".pre-run-gfx2-static-cloud-fortune") : null;
  var preRunGfx2CloudShopEl = preRunSelectGfx2El ? preRunSelectGfx2El.querySelector(".pre-run-gfx2-static-cloud-shop") : null;
  var preRunGfx2ForegroundEl = document.getElementById("pre-run-gfx2-animation-frame");
  var preRunBadgesScreenEl = document.getElementById("pre-run-badges-screen");
  var preRunScoresScreenEl = document.getElementById("pre-run-scores-screen");
  var preRunRulesScreenEl = document.getElementById("pre-run-rules-screen");
  var preRunCreditsScreenEl = document.getElementById("pre-run-credits-screen");
  var preRunRulesPageTitleEl = document.getElementById("pre-run-rules-page-title");
  var preRunRulesTextEl = document.getElementById("pre-run-rules-text");
  var preRunRulesPageLabelEl = document.getElementById("pre-run-rules-page-label");
  var preRunRulesPrevBtn = document.getElementById("pre-run-rules-prev-btn");
  var preRunRulesNextBtn = document.getElementById("pre-run-rules-next-btn");
  var preRunCreditsVersionEl = document.getElementById("pre-run-credits-version");
  var preRunShopScreenEl = document.getElementById("pre-run-shop-screen");
  var preRunSettingsScreenEl = document.getElementById("pre-run-settings-screen");
  var gamePauseHitboxBtn = document.getElementById("game-pause-hitbox");
  var preRunDetailScreenEl = document.getElementById("pre-run-detail-screen");
  var preRunJumpBtn = document.getElementById("pre-run-jump-btn");
  var preRunFullBtn = document.getElementById("pre-run-full-btn");
  var preRunDifficultyToggleEl = document.getElementById("pre-run-difficulty-toggle");
  var preRunDifficultyImageEl = document.getElementById("pre-run-difficulty-image");
  var preRunDifficultyRowEl = document.getElementById("pre-run-difficulty-row");
  var preRunRulesBtn = document.getElementById("pre-run-rules-btn");
  var preRunCreditsBtn = document.getElementById("pre-run-credits-btn");
  var preRunShopBtn = document.getElementById("pre-run-shop-btn");
  var preRunSettingsBtn = document.getElementById("pre-run-settings-btn");
  var preRunBadgesBtn = document.getElementById("pre-run-badges-btn");
  var preRunScoresBtn = document.getElementById("pre-run-scores-btn");
  var preRunGfx2RulesBtn = document.getElementById("pre-run-gfx2-rules-btn");
  var preRunGfx2CreditsBtn = document.getElementById("pre-run-gfx2-credits-btn");
  var preRunGfx2MineBtn = document.getElementById("pre-run-gfx2-mine-btn");
  var preRunGfx2ShopBtn = document.getElementById("pre-run-gfx2-shop-btn");
  var preRunGfx2ClassicCornerBtn = document.getElementById("pre-run-gfx2-classic-corner-btn");
  var preRunGfx2SettingsCornerBtn = document.getElementById("pre-run-gfx2-settings-corner-btn");
  var preRunGfx2HouseClassicBtn = document.getElementById("pre-run-gfx2-house-classic-btn");
  var preRunGfx2HouseSettingsBtn = document.getElementById("pre-run-gfx2-house-settings-btn");
  var preRunGfx2ClassicBtn = document.getElementById("pre-run-gfx2-classic-btn");
  var preRunGfx2AdvancedBtn = document.getElementById("pre-run-gfx2-advanced-btn");
  var preRunGfx2SettingsBtn = document.getElementById("pre-run-gfx2-settings-btn");
  var preRunGfx2BadgesBtn = document.getElementById("pre-run-gfx2-badges-btn");
  var preRunGfx2ScoresBtn = document.getElementById("pre-run-gfx2-scores-btn");
  var preRunGfx2LockNoteEl = document.getElementById("pre-run-gfx2-lock-note");
  var PRE_RUN_GFX2_CLOUD_MOTION_CONFIGS = [
    {
      el: preRunGfx2CloudRulesEl,
      baseSpeed: 8,
      speedFactor: 0.75,
      waveAmplitude: 8.5,
      waveCycles: 1.4,
      wavePhase: 0.1,
      initialProgress: 0.15
    },
    {
      el: preRunGfx2CloudCreditsEl,
      baseSpeed: 8,
      speedFactor: 1.0,
      waveAmplitude: 7.5,
      waveCycles: 1.15,
      wavePhase: 1.55,
      initialProgress: 0.42
    },
    {
      el: preRunGfx2CloudFortuneEl,
      baseSpeed: 8,
      speedFactor: 1.2,
      waveAmplitude: 11.25,
      waveCycles: 1.15,
      wavePhase: 2.35,
      initialProgress: 0.58
    },
    {
      el: preRunGfx2CloudShopEl,
      baseSpeed: 8,
      speedFactor: 1.33,
      waveAmplitude: 6.8,
      waveCycles: 1.05,
      wavePhase: 2.75,
      initialProgress: 0.73
    }
  ];
  var PRE_RUN_GFX2_WAIT_FRAMES = buildPreRunFrameSet("assets/gfx2/crossing_wait", 13, 0);
  var PRE_RUN_GFX2_WAIT_ANIM_SECONDS = 4 / 3;
  function buildPreRunFrameSet(basePath, totalFrames, lowerCaseCount) {
    var frames = [];
    var frameIndex;
    for (frameIndex = 1; frameIndex <= totalFrames; frameIndex++) {
      var extension = frameIndex <= lowerCaseCount ? ".png" : ".PNG";
      frames.push(basePath + "/frame-" + ("0" + frameIndex).slice(-2) + extension);
    }
    return frames;
  }
  var PRE_RUN_GFX2_ENTRANCE_FRAMES = buildPreRunFrameSet("assets/gfx2/entrance", 10, 8);
  var PRE_RUN_GFX2_CLASSIC_FRAMES = buildPreRunFrameSet("assets/gfx2/classic", 10, 7);
  var PRE_RUN_GFX2_ADVANCE_FRAMES = buildPreRunFrameSet("assets/gfx2/advance", 10, 6);
  var PRE_RUN_GFX2_SCORES_FRAMES = buildPreRunFrameSet("assets/gfx2/scores", 10, 5);
  var PRE_RUN_GFX2_BADGES_FRAMES = buildPreRunFrameSet("assets/gfx2/badges", 10, 8);
  var PRE_RUN_GFX2_SHOP_FRAMES = buildPreRunFrameSet("assets/gfx2/shop", 10, 7);
  var PRE_RUN_GFX2_SETTINGS_FRAMES = buildPreRunFrameSet("assets/gfx2/settings", 10, 9);
  var PRE_RUN_GFX2_MINE_ENTRY_FRAMES = buildPreRunFrameSet("assets/gfx2/mine", 24, 24);
  var PRE_RUN_GFX2_MINE_ENTRY_ANIM_SECONDS = 1;
  var PRE_RUN_GFX2_CLASSIC_BACK_FRAMES = buildPreRunFrameSet("assets/gfx2/classic_back", 10, 8);
  var PRE_RUN_GFX2_ADVANCE_BACK_FRAMES = buildPreRunFrameSet("assets/gfx2/advance_back", 10, 7);
  var PRE_RUN_GFX2_BADGES_BACK_FRAMES = buildPreRunFrameSet("assets/gfx2/badges_back", 10, 8);
  var preRunRulesPagesPromise = null;
  var preRunRulesPagesCache = null;
  var PRE_RUN_GFX2_BADGE_TROPHY_SLUGS = {
    bag_collector: true,
    big_spender: true,
    banger: true,
    bubble_saver: true,
    coin_collector: true,
    doom_magnet: true,
    first_runner: true,
    fortunate: true,
    greedy: true,
    heart_hunter: true,
    cursed: true,
    martyr: true,
    purist: true,
    shield_bubble: true,
    speed_demon: true,
    survivor: true,
    jumper: true,
    unkillable_custommer: true,
    lucky: true,
    teleporter: true,
    unlucky: true,
    unlocker: true,
    untouchable: true,
    still_runing: true
    };
  var PRE_RUN_GFX2_BADGE_TROPHY_SLUGS_V2 = {
    bag_collector: true,
    banger: true,
    big_spender: true,
    bubble_saver: true,
    coin_collector: true,
    cursed: true,
    doom_magnet: true,
    endless_greed: true,
    first_runner: true,
    fortunate: true,
    greedy: true,
    heart_hunter: true,
    jumper: true,
    lucky: true,
    magneto: true,
    martyr: true,
    purist: true,
    shopaholic: true,
    speed_demon: true,
    starter: true,
    still_runing: true,
    shield_teleporter: true,
    survivor: true,
    teleporter: true,
    unkillable_custommer: true,
    unlocker: true,
    unlucky: true,
    untouchable: true
  };
  var BADGE_TROPHY_SLUGS_BY_SERIES_ID = {
    bag_collector_single_run: "bag_collector",
    big_spender_all_runs: "big_spender",
    banger_all_runs: "banger",
    bubble_saver_legends: "bubble_saver",
    coin_collector_single_run: "coin_collector",
    doom_magnet_all_runs: "doom_magnet",
    first_runner_legends: "first_runner",
    fortunate_all_runs: "fortunate",
    greedy_single_run: "greedy",
    heart_hunter_legends: "heart_hunter",
    cursed_legends: "cursed",
    lucky_single_run: "lucky",
    martyr_skills: "martyr",
    purist_skills: "purist",
    shield_teleporter_skills: "shield_bubble",
    teleporter_legends: "teleporter",
    survivor_skills: "survivor",
    speed_demon_skills: "speed_demon",
    jumper_all_runs: "jumper",
    unkillable_custommer_all_runs: "unkillable_custommer",
    unlocker_discovery: "unlocker",
    unlucky_single_run: "unlucky",
    untouchable_single_run: "untouchable",
    still_running_legends: "still_runing"
  };
  var BADGE_TROPHY_SLUGS_BY_SERIES_ID_V2 = {
    bag_collector_single_run: "bag_collector",
    big_spender_all_runs: "big_spender",
    banger_all_runs: "banger",
    bubble_saver_legends: "bubble_saver",
    coin_collector_single_run: "coin_collector",
    doom_magnet_all_runs: "doom_magnet",
    endless_greed_all_runs: "endless_greed",
    first_runner_legends: "first_runner",
    fortunate_all_runs: "fortunate",
    greedy_single_run: "greedy",
    heart_hunter_legends: "heart_hunter",
    jumper_all_runs: "jumper",
    lucky_single_run: "lucky",
    magneto_legends: "magneto",
    martyr_skills: "martyr",
    purist_skills: "purist",
    shield_teleporter_skills: "shield_teleporter",
    speed_demon_skills: "speed_demon",
    starter_legends: "starter",
    still_running_legends: "still_runing",
    survivor_skills: "survivor",
    teleporter_legends: "teleporter",
    unkillable_custommer_all_runs: "unkillable_custommer",
    unlocker_discovery: "unlocker",
    unlucky_single_run: "unlucky",
    untouchable_single_run: "untouchable"
  };
  var PRE_RUN_GFX2_SHOP_BACK_FRAMES = [
    "assets/gfx2/shop_back/frame-01.png",
    "assets/gfx2/shop_back/frame-02.png",
    "assets/gfx2/shop_back/frame-03.png",
    "assets/gfx2/shop_back/frame-04.png",
    "assets/gfx2/shop_back/frame-05.png",
    "assets/gfx2/shop_back/frame-06.png",
    "assets/gfx2/shop_back/frame-07.png"
  ];
  var PRE_RUN_GFX2_SETTINGS_BACK_FRAMES = [
    "assets/gfx2/settings_back/frame-01.png",
    "assets/gfx2/settings_back/frame-02.png",
    "assets/gfx2/settings_back/frame-03.png",
    "assets/gfx2/settings_back/frame-04.png",
    "assets/gfx2/settings_back/frame-05.png",
    "assets/gfx2/settings_back/frame-06.png",
    "assets/gfx2/settings_back/frame-07.png",
    "assets/gfx2/settings_back/frame-08.png",
    "assets/gfx2/settings_back/frame-09.png"
  ];
  var PRE_RUN_GFX2_SCORES_BACK_FRAMES = [
    "assets/gfx2/scores_back/frame-01.png",
    "assets/gfx2/scores_back/frame-02.png",
    "assets/gfx2/scores_back/frame-03.png",
    "assets/gfx2/scores_back/frame-04.png",
    "assets/gfx2/scores_back/frame-05.png",
    "assets/gfx2/scores_back/frame-06.png"
    ];
    var PRE_RUN_GFX2_SHOP_BACK_FRAMES = buildPreRunFrameSet("assets/gfx2/shop_back", 10, 7);
    var PRE_RUN_GFX2_SETTINGS_BACK_FRAMES = buildPreRunFrameSet("assets/gfx2/settings_back", 10, 9);
    var PRE_RUN_GFX2_SCORES_BACK_FRAMES = buildPreRunFrameSet("assets/gfx2/scores_back", 10, 6);
  var PRE_RUN_GFX2_ALL_FRAMES = Array.from(new Set(
    PRE_RUN_GFX2_ENTRANCE_FRAMES
      .concat(PRE_RUN_GFX2_CLASSIC_FRAMES)
      .concat(PRE_RUN_GFX2_ADVANCE_FRAMES)
      .concat(PRE_RUN_GFX2_SCORES_FRAMES)
      .concat(PRE_RUN_GFX2_BADGES_FRAMES)
      .concat(PRE_RUN_GFX2_SHOP_FRAMES)
      .concat(PRE_RUN_GFX2_SETTINGS_FRAMES)
      .concat(PRE_RUN_GFX2_MINE_ENTRY_FRAMES)
      .concat(PRE_RUN_GFX2_CLASSIC_BACK_FRAMES)
      .concat(PRE_RUN_GFX2_ADVANCE_BACK_FRAMES)
      .concat(PRE_RUN_GFX2_BADGES_BACK_FRAMES)
      .concat(PRE_RUN_GFX2_SHOP_BACK_FRAMES)
      .concat(PRE_RUN_GFX2_SETTINGS_BACK_FRAMES)
      .concat(PRE_RUN_GFX2_SCORES_BACK_FRAMES)
      .concat(PRE_RUN_GFX2_WAIT_FRAMES)
  ));
  var preRunGfx2FrameCache = Object.create(null);
  var preRunGfx2PreloadPromise = null;
  var preRunGfx2CloudMotionReady = false;
  var preRunRulesBackBtn = document.getElementById("pre-run-rules-back-btn");
  var preRunCreditsBackBtn = document.getElementById("pre-run-credits-back-btn");
  var preRunShopBackBtn = document.getElementById("pre-run-shop-back-btn");
  var preRunSettingsBackBtn = document.getElementById("pre-run-settings-back-btn");
  var preRunSettingsGfx2El = document.getElementById("pre-run-settings-gfx2");
  var preRunSettingsGfx2BackBtn = document.getElementById("pre-run-settings-gfx2-back-btn");
  var preRunSettingsGfx2MusicGraphicBtn = document.getElementById("pre-run-settings-gfx2-music-graphic-btn");
  var preRunSettingsGfx2SfxGraphicBtn = document.getElementById("pre-run-settings-gfx2-sfx-graphic-btn");
  var preRunSettingsGfx2MusicBtn = document.getElementById("pre-run-settings-gfx2-music-btn");
  var preRunSettingsGfx2SfxBtn = document.getElementById("pre-run-settings-gfx2-sfx-btn");
  var preRunSettingsGfx2GlobalVolumeBtn = document.getElementById("pre-run-settings-gfx2-global-volume");
  var preRunSettingsGfx2DebugBoxMusicEl = document.getElementById("pre-run-settings-gfx2-debug-box-music");
  var preRunSettingsGfx2DebugBoxSfxEl = document.getElementById("pre-run-settings-gfx2-debug-box-sfx");
  var preRunSettingsGfx2MusicVolumeEl = preRunSettingsGfx2MusicBtn ? preRunSettingsGfx2MusicBtn.parentElement : null;
  var preRunSettingsGfx2SfxVolumeEl = preRunSettingsGfx2SfxBtn ? preRunSettingsGfx2SfxBtn.parentElement : null;
  var preRunSettingsGfx2AccountBtn = document.getElementById("pre-run-settings-gfx2-account-btn");
  var preRunAccountConfirmEl = document.getElementById("pre-run-account-confirm");
  var preRunAccountConfirmNoBtn = document.getElementById("pre-run-account-confirm-no");
  var preRunAccountConfirmYesBtn = document.getElementById("pre-run-account-confirm-yes");
  var preRunPlayerNameBtn = document.getElementById("pre-run-player-name-btn");
  var preRunBadgesBackBtn = document.getElementById("pre-run-badges-back-btn");
  var preRunBadgesExitBtn = document.getElementById("pre-run-badges-exit-btn");
  var preRunScoresBackBtn = document.getElementById("pre-run-scores-back-btn");
  var preRunBadgesGroupsEl = document.getElementById("pre-run-badges-groups");
  var preRunScoresGridEl = document.getElementById("pre-run-scores-grid");
  var preRunToggleSfxBtn = document.getElementById("pre-run-toggle-sfx-btn");
  var preRunToggleMusicBtn = document.getElementById("pre-run-toggle-music-btn");
  var preRunSettingsGfx2MusicRestoreVolumePercent = null;
  var preRunSettingsGfx2SfxRestoreVolumePercent = null;
  var preRunShopWalletEl = document.getElementById("pre-run-shop-wallet");
  var preRunShopTotalScoreEl = document.getElementById("pre-run-shop-total-score");
  var preRunShopRateEl = document.getElementById("pre-run-shop-rate");
  var preRunShopExchangeCopyEl = document.getElementById("pre-run-shop-exchange-copy");
  var preRunShopExchangeOneBtn = document.getElementById("pre-run-shop-exchange-one-btn");
  var preRunShopExchangeTenBtn = document.getElementById("pre-run-shop-exchange-ten-btn");
  var preRunShopExchangeStatusEl = document.getElementById("pre-run-shop-exchange-status");
  var preRunShopBuyKrobBtn = document.getElementById("pre-run-shop-buy-krob-btn");
  var preRunShopKrobStatusEl = document.getElementById("pre-run-shop-krob-status");
  var preRunShopSpecialLevelStatusEl = document.getElementById("pre-run-shop-special-level-status");
  var preRunShopGfx2El = document.getElementById("pre-run-shop-gfx2");
  var preRunShopGfx2BoardEl = document.getElementById("pre-run-shop-gfx2-board");
  var preRunShopGfx2ExitBtn = document.getElementById("pre-run-shop-gfx2-exit-btn");
  var preRunShopGfx2NewLevelBtn = document.getElementById("pre-run-shop-gfx2-new-level-btn");
  var preRunShopGfx2SkinCatBtn = document.getElementById("pre-run-shop-gfx2-skin-cat-btn");
  var preRunShopGfx2SkinCubeBtn = document.getElementById("pre-run-shop-gfx2-skin-cube-btn");
  var preRunShopGfx2Skin06Btn = document.getElementById("pre-run-shop-gfx2-skin-06-btn");
  var preRunShopGfx2ChestBtn = document.getElementById("pre-run-shop-gfx2-chest-btn");
  var preRunShopGfx2CoinOneBtn = document.getElementById("pre-run-shop-gfx2-coin-one-btn");
  var preRunShopGfx2CoinTenBtn = document.getElementById("pre-run-shop-gfx2-coin-ten-btn");
  var preRunShopGfx2TotalValueEl = document.getElementById("pre-run-shop-gfx2-total-value");
  var preRunShopGfx2WalletValueEl = document.getElementById("pre-run-shop-gfx2-wallet-value");
  var preRunShopGfx2SelectionLabelEl = document.getElementById("pre-run-shop-gfx2-selection-label");
  var preRunShopGfx2SelectionValueEl = document.getElementById("pre-run-shop-gfx2-selection-value");
  var preRunShopGfx2CostValueEl = document.getElementById("pre-run-shop-gfx2-cost-value");
  var preRunShopGfx2StatusEl = document.getElementById("pre-run-shop-gfx2-status");
  var preRunShopGfx2BuyBtn = document.getElementById("pre-run-shop-gfx2-buy-btn");
  var preRunMineInsideEl = document.getElementById("pre-run-mine-screen");
  var preRunMineGfx2ExitBtn = document.getElementById("pre-run-mine-gfx2-exit-btn");
  var preRunMineGfx2WalletValueEl = document.getElementById("pre-run-mine-gfx2-wallet-value");
  var preRunMineGfx2StorageValueEl = document.getElementById("pre-run-mine-gfx2-storage-value");
  var preRunMineGfx2CountdownEl = document.getElementById("pre-run-mine-gfx2-countdown");
  var preRunMineGfx2TransferBtn = document.getElementById("pre-run-mine-gfx2-transfer-btn");
  var preRunMineGfx2MessageEl = document.getElementById("pre-run-mine-gfx2-message");
  var preRunMineGfx2MessageFaceEl = document.getElementById("pre-run-mine-gfx2-message-face");
  var preRunMineGfx2MessageTextEl = document.getElementById("pre-run-mine-gfx2-message-text");
  var preRunClassicGfx2El = document.getElementById("pre-run-classic-gfx2");
  var preRunClassicGfx2ExitBtn = document.getElementById("pre-run-classic-gfx2-exit-btn");
  var preRunClassicGfx2AdminBtn = document.getElementById("pre-run-classic-gfx2-admin-btn");
  var preRunClassicGfx2StartBtn = document.getElementById("pre-run-classic-gfx2-start-btn");
  var preRunClassicGfx2Skin1Btn = document.getElementById("pre-run-classic-gfx2-skin-1-btn");
  var preRunClassicGfx2Skin2Btn = document.getElementById("pre-run-classic-gfx2-skin-2-btn");
  var preRunClassicGfx2Skin3Btn = document.getElementById("pre-run-classic-gfx2-skin-3-btn");
  var preRunClassicGfx2Skin4Btn = document.getElementById("pre-run-classic-gfx2-skin-4-btn");
  var preRunClassicGfx2SkinFuture1Btn = document.getElementById("pre-run-classic-gfx2-skin-future-1-btn");
  var preRunClassicGfx2Skin6Btn = document.getElementById("pre-run-classic-gfx2-skin-6-btn");
  var preRunClassicGfx2Skin7Btn = document.getElementById("pre-run-classic-gfx2-skin-7-btn");
  var preRunClassicGfx2Skin1Img = document.getElementById("pre-run-classic-gfx2-skin-1-img");
  var preRunClassicGfx2Skin2Img = document.getElementById("pre-run-classic-gfx2-skin-2-img");
  var preRunClassicGfx2Skin3Img = document.getElementById("pre-run-classic-gfx2-skin-3-img");
  var preRunClassicGfx2Skin4Img = document.getElementById("pre-run-classic-gfx2-skin-4-img");
  var preRunClassicGfx2Skin5Img = document.getElementById("pre-run-classic-gfx2-skin-5-img");
  var preRunClassicGfx2Skin6Img = document.getElementById("pre-run-classic-gfx2-skin-6-img");
  var preRunClassicGfx2Skin7Img = document.getElementById("pre-run-classic-gfx2-skin-7-img");
  var preRunClassicGfx2BoardEl = preRunClassicGfx2El ? preRunClassicGfx2El.querySelector(".pre-run-classic-gfx2-board") : null;
  var preRunClassicGfx2LevelValueEl = document.getElementById("pre-run-classic-gfx2-level-value");
  var preRunClassicGfx2LivesValueEl = document.getElementById("pre-run-classic-gfx2-lives-value");
  var preRunClassicGfx2ControlsCopyEl = document.getElementById("pre-run-classic-gfx2-controls-copy");
  var preRunClassicGfx2GoalValueEl = document.getElementById("pre-run-classic-gfx2-goal-value");
  var preRunClassicGfx2NoteEl = document.getElementById("pre-run-classic-gfx2-note");
  var preRunClassicGfx2EasyBtn = document.getElementById("pre-run-classic-gfx2-easy-btn");
  var preRunClassicGfx2HardBtn = document.getElementById("pre-run-classic-gfx2-hard-btn");
  var preRunClassicGfx2DifficultyNoteEl = document.getElementById("pre-run-classic-gfx2-difficulty-note");
  var preRunAdvancedGfx2El = document.getElementById("pre-run-advanced-gfx2");
  var preRunAdvancedGfx2ExitBtn = document.getElementById("pre-run-advanced-gfx2-exit-btn");
  var preRunAdvancedGfx2AdminBtn = document.getElementById("pre-run-advanced-gfx2-admin-btn");
  var preRunAdvancedGfx2StartBtn = document.getElementById("pre-run-advanced-gfx2-start-btn");
  var preRunAdvancedGfx2Skin1Btn = document.getElementById("pre-run-advanced-gfx2-skin-1-btn");
  var preRunAdvancedGfx2Skin2Btn = document.getElementById("pre-run-advanced-gfx2-skin-2-btn");
  var preRunAdvancedGfx2Skin3Btn = document.getElementById("pre-run-advanced-gfx2-skin-3-btn");
  var preRunAdvancedGfx2Skin4Btn = document.getElementById("pre-run-advanced-gfx2-skin-4-btn");
  var preRunAdvancedGfx2SkinFuture1Btn = document.getElementById("pre-run-advanced-gfx2-skin-future-1-btn");
  var preRunAdvancedGfx2Skin6Btn = document.getElementById("pre-run-advanced-gfx2-skin-6-btn");
  var preRunAdvancedGfx2Skin7Btn = document.getElementById("pre-run-advanced-gfx2-skin-7-btn");
  var preRunAdvancedGfx2Skin1Img = document.getElementById("pre-run-advanced-gfx2-skin-1-img");
  var preRunAdvancedGfx2Skin2Img = document.getElementById("pre-run-advanced-gfx2-skin-2-img");
  var preRunAdvancedGfx2Skin3Img = document.getElementById("pre-run-advanced-gfx2-skin-3-img");
  var preRunAdvancedGfx2Skin4Img = document.getElementById("pre-run-advanced-gfx2-skin-4-img");
  var preRunAdvancedGfx2Skin5Img = document.getElementById("pre-run-advanced-gfx2-skin-5-img");
  var preRunAdvancedGfx2Skin6Img = document.getElementById("pre-run-advanced-gfx2-skin-6-img");
  var preRunAdvancedGfx2Skin7Img = document.getElementById("pre-run-advanced-gfx2-skin-7-img");
  var preRunAdvancedGfx2BoardEl = preRunAdvancedGfx2El ? preRunAdvancedGfx2El.querySelector(".pre-run-classic-gfx2-board") : null;
  var preRunAdvancedGfx2LevelValueEl = document.getElementById("pre-run-advanced-gfx2-level-value");
  var preRunAdvancedGfx2LivesValueEl = document.getElementById("pre-run-advanced-gfx2-lives-value");
  var preRunAdvancedGfx2ControlsCopyEl = document.getElementById("pre-run-advanced-gfx2-controls-copy");
  var preRunAdvancedGfx2GoalValueEl = document.getElementById("pre-run-advanced-gfx2-goal-value");
  var preRunAdvancedGfx2NoteEl = document.getElementById("pre-run-advanced-gfx2-note");
  var preRunAdvancedGfx2EasyBtn = document.getElementById("pre-run-advanced-gfx2-easy-btn");
  var preRunAdvancedGfx2HardBtn = document.getElementById("pre-run-advanced-gfx2-hard-btn");
  var preRunAdvancedGfx2DifficultyNoteEl = document.getElementById("pre-run-advanced-gfx2-difficulty-note");
  var preRunBadgesTotalValueEl = document.getElementById("pre-run-badges-total-value");
  var preRunBadgesTotalLabelEl = document.getElementById("pre-run-badges-total-label");
  var preRunFullLockEl = document.getElementById("pre-run-full-lock");
  var preRunBackBtn = document.getElementById("pre-run-back-btn");
  var preRunCompactBackBtn = document.getElementById("pre-run-compact-back-btn");
  var preRunCompactAdminBtn = document.getElementById("pre-run-compact-admin-btn");
  var preRunCompactStartBtn = document.getElementById("pre-run-compact-start-btn");
  var preRunCompactStartLabelEl = document.getElementById("pre-run-compact-start-label");
  var preRunTesterInfoBtn = document.getElementById("pre-run-tester-info-btn");
  var preRunFutureReleaseBtn = document.getElementById("pre-run-future-release-btn");
  var preRunDetailAdminBtn = document.getElementById("pre-run-detail-admin-btn");
  var APP_VERSION_INFO = window.HrrraVersionInfo || { versionCode: 0, versionName: "0.0.0" };
  var DEFAULT_ADMIN_PASSWORD = "H3510";
  var TESTER_INFO_URL = "https://hrrra.vercel.app/TESTER_INFO.md";
  var FUTURE_RELEASE_URL = "https://hrrra.vercel.app/future-release.html";
  var VERSION_INFO_URL = "https://hrrra.vercel.app/version.json";
  var STORE_URL = "https://play.google.com/store/apps/details?id=cz.hrrra.game";
  var STORE_MARKET_URL = "market://details?id=cz.hrrra.game";
  var updateCheckRetryTimer = null;
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
  var modeSwitchEl = document.getElementById("mode-switch");
  var levelFinishedEl = document.getElementById("level-finished");
  var levelFinishedArtEl = document.getElementById("level-finished-art");
  var levelFinishedContinueBtn = document.getElementById("level-finished-continue");
  var ADMIN_STORAGE_KEY_PREFIX = "hrrra_admin_config_v3_";
  var LEGACY_ADMIN_STORAGE_KEY_PREFIX = "hrrra_admin_config_v2_";
  var GLOBAL_ADMIN_STORAGE_KEY = "hrrra_admin_global_v1";
  var LEGACY_MAX_SCORE_STORAGE_KEY_PREFIX = "hrrra_max_score_v2_";
  var MAX_SCORE_STORAGE_KEY_PREFIX = "hrrra_max_score_v3_";
  var LEGACY_PLAYER_SKIN_PROGRESS_STORAGE_KEY = "hrrra_player_skin_progress_v1";
  var PLAYER_SKIN_PROGRESS_STORAGE_KEY_PREFIX = "hrrra_player_skin_progress_v2_";
  var PLAYER_NAME_STORAGE_KEY = "hrrra_player_name_v1";
  var PLAYER_ID_STORAGE_KEY = "hrrra_player_id_v1";
  var LEGACY_BADGE_STATS_STORAGE_KEY = "hrrra_badge_stats_v1";
  var BADGE_STATS_STORAGE_KEY_PREFIX = "hrrra_badge_stats_v2_";
  var LEGACY_ECONOMY_STORAGE_KEY = "hrrra_economy_v1";
  var ECONOMY_STORAGE_KEY_PREFIX = "hrrra_economy_v2_";
  var WHATS_NEW_SEEN_VERSION_STORAGE_KEY = "hrrra_whats_new_seen_version_v1";
  var START_SCREEN_GFX2_MIGRATION_STORAGE_KEY = "hrrra_start_screen_default_gfx2_v34";
  var activeProfilePlayerId = "";
  function getOnlineApiBaseOrigin() {
    var fallbackOrigin = "https://hrrra.vercel.app";
    if (typeof window === "undefined" || !window.location) {
      return fallbackOrigin;
    }
    if (!/^https?:$/i.test(window.location.protocol)) {
      return fallbackOrigin;
    }
    var hostname = String(window.location.hostname || "").toLowerCase();
    if (!hostname || hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]") {
      return fallbackOrigin;
    }
    return window.location.origin || fallbackOrigin;
  }

  var ONLINE_HIGHSCORE_API_URL = getOnlineApiBaseOrigin().replace(/\/$/, "") + "/api/highscore";
  var ONLINE_AUTH_API_URL = getOnlineApiBaseOrigin().replace(/\/$/, "") + "/api/auth";
  var LEVEL_COUNT = 5;
  var BADGE_CATEGORY_ORDER = ["Single Run", "All Runs", "Skills", "Lifetime Legends", "Discovery"];
  var BADGE_CATEGORY_COPY = {
    "Single Run": "Push a single run as far as possible and hit big one-shot milestones.",
    "All Runs": "Long-term collection goals that reward steady return play.",
    "Skills": "Style, survival, shop mastery, and mechanic-driven challenges for mastery runs.",
    "Lifetime Legends": "Rare long-term badges for players who keep building a real Hrrra career.",
    "Discovery": "Badges tied to unlocking more of Hrrra over time."
  };
  var AUDIO_LEVEL_FIELD_KEYS = [
    "levelMusicLoopPath",
    "levelJumpSoundPath",
    "levelCoinSoundPath",
    "levelBagSoundPath",
    "levelQuestionCoinSoundPath",
    "levelCrackedCoinSoundPath",
    "levelCurseSoundPath",
    "levelLifeSoundPath",
    "levelLifeLossSoundPath",
    "levelShieldSoundPath",
    "levelShieldBreakSoundPath",
    "levelMagnetSoundPath",
    "levelSlowSoundPath",
    "levelTeleportSoundPath",
    "levelDeathSoundPath"
  ];
  var AUDIO_GLOBAL_PATH_KEYS = [
    "uiSoundButtonPath",
    "uiSoundPageOpenPath",
    "uiSoundBadgesPagePath",
    "uiSoundBadgeRevealPath",
    "uiCrossingMusicPath",
    "uiPreRunMusicPath",
    "uiLevelFinishedMusicPath",
    "uiGameOverMusicPath"
  ];
  var BADGE_SERIES = [
    {
      id: "greedy_single_run",
      category: "Single Run",
      name: "Greedy",
      description: "Stack raw score in one explosive run.",
      tiers: [
        { tier: "Bronze", value: "100k points", sprite: "bronze" },
        { tier: "Silver", value: "250k points", sprite: "silver" },
        { tier: "Gold", value: "500k points", sprite: "gold" }
      ]
    },
    {
      id: "coin_collector_single_run",
      category: "Single Run",
      name: "Coin Collector",
      description: "Vacuum up coins before the run breaks.",
      tiers: [
        { tier: "Bronze", value: "100 coins", sprite: "bronze" },
        { tier: "Silver", value: "200 coins", sprite: "silver" },
        { tier: "Gold", value: "400 coins", sprite: "gold" }
      ]
    },
    {
      id: "bag_collector_single_run",
      category: "Single Run",
      name: "Bag Collector",
      description: "Turn one run into a real jackpot.",
      tiers: [
        { tier: "Bronze", value: "10 money bags", sprite: "bronze" },
        { tier: "Silver", value: "50 money bags", sprite: "silver" },
        { tier: "Gold", value: "100 money bags", sprite: "gold" }
      ]
    },
    {
      id: "lucky_single_run",
      category: "Single Run",
      name: "Lucky",
      description: "Win big repeatedly on Question Coin rolls.",
      tiers: [
        { tier: "Bronze", value: "5 positive ? Coin wins", sprite: "bronze" },
        { tier: "Silver", value: "10 positive ? Coin wins", sprite: "silver" },
        { tier: "Gold", value: "20 positive ? Coin wins", sprite: "gold" }
      ]
    },
    {
      id: "unlucky_single_run",
      category: "Single Run",
      name: "Unlucky",
      description: "Survive a run full of bad gambles.",
      tiers: [
        { tier: "Bronze", value: "5 negative ? Coin results", sprite: "bronze" },
        { tier: "Silver", value: "10 negative ? Coin results", sprite: "silver" },
        { tier: "Gold", value: "20 negative ? Coin results", sprite: "gold" }
      ]
    },
    {
      id: "untouchable_single_run",
      category: "Single Run",
      name: "Untouchable",
      description: "Chain clean levels without giving up a life.",
      tiers: [
        { tier: "Bronze", value: "Finish 2 levels clean", sprite: "bronze" },
        { tier: "Silver", value: "Finish 3 levels clean", sprite: "silver" },
        { tier: "Gold", value: "Finish 4 levels clean", sprite: "gold" }
      ]
    },
    {
      id: "endless_greed_all_runs",
      category: "All Runs",
      name: "Endless Greed",
      description: "Build lifetime score across many return runs.",
      tiers: [
        { tier: "Bronze", value: "1m total score", sprite: "bronze" },
        { tier: "Silver", value: "5m total score", sprite: "silver" },
        { tier: "Gold", value: "10m total score", sprite: "gold" }
      ]
    },
    {
      id: "coin_collector_all_runs",
      category: "All Runs",
      name: "Coin Collector",
      description: "Persistent coin progress for long-term players.",
      tiers: [
        { tier: "Bronze", value: "1k lifetime coins", sprite: "bronze" },
        { tier: "Silver", value: "5k lifetime coins", sprite: "silver" },
        { tier: "Gold", value: "10k lifetime coins", sprite: "gold" }
      ]
    },
    {
      id: "bag_collector_all_runs",
      category: "All Runs",
      name: "Bag Collector",
      description: "Keep banking high-value pickups across runs.",
      tiers: [
        { tier: "Bronze", value: "500 lifetime bags", sprite: "bronze" },
        { tier: "Silver", value: "1k lifetime bags", sprite: "silver" },
        { tier: "Gold", value: "5k lifetime bags", sprite: "gold" }
      ]
    },
    {
      id: "banger_all_runs",
      category: "All Runs",
      name: "Banger",
      description: "Convert enough stored score into coins to become a real economy regular.",
      tiers: [
        { tier: "Bronze", value: "Exchange 10 coins", sprite: "bronze" },
        { tier: "Silver", value: "Exchange 100 coins", sprite: "silver" },
        { tier: "Gold", value: "Exchange 1000 coins", sprite: "gold" }
      ]
    },
    {
      id: "big_spender_all_runs",
      category: "All Runs",
      name: "Big Spender",
      description: "Spend enough coins in the shop economy to earn a title for it.",
      tiers: [
        { tier: "Bronze", value: "Spend 50 coins", sprite: "bronze" },
        { tier: "Silver", value: "Spend 250 coins", sprite: "silver" },
        { tier: "Gold", value: "Spend 1000 coins", sprite: "gold" }
      ]
    },
    {
      id: "unkillable_custommer_all_runs",
      category: "All Runs",
      name: "Unkillable Custommer",
      description: "Use continue often enough that the comeback itself becomes a badge.",
      tiers: [
        { tier: "Bronze", value: "Use continue 1 time", sprite: "bronze" },
        { tier: "Silver", value: "Use continue 5 times", sprite: "silver" },
        { tier: "Gold", value: "Use continue 25 times", sprite: "gold" }
      ]
    },
    {
      id: "jumper_all_runs",
      category: "All Runs",
      name: "Jumper",
      description: "Count every jump input across all runs.",
      tiers: [
        { tier: "Bronze", value: "1000 jumps", sprite: "bronze" },
        { tier: "Silver", value: "5000 jumps", sprite: "silver" },
        { tier: "Gold", value: "10000 jumps", sprite: "gold" }
      ]
    },
    {
      id: "fortunate_all_runs",
      category: "All Runs",
      name: "Fortunate",
      description: "Track your long-term winning streak with Question Coin.",
      tiers: [
        { tier: "Bronze", value: "50 positive ? Coin wins", sprite: "bronze" },
        { tier: "Silver", value: "100 positive ? Coin wins", sprite: "silver" },
        { tier: "Gold", value: "200 positive ? Coin wins", sprite: "gold" }
      ]
    },
    {
      id: "doom_magnet_all_runs",
      category: "All Runs",
      name: "Doom Magnet",
      description: "Even bad luck counts toward the legend.",
      tiers: [
        { tier: "Bronze", value: "50 negative ? Coin results", sprite: "bronze" },
        { tier: "Silver", value: "100 negative ? Coin results", sprite: "silver" },
        { tier: "Gold", value: "200 negative ? Coin results", sprite: "gold" }
      ]
    },
    {
      id: "speed_demon_skills",
      category: "Skills",
      name: "Speed Demon",
      description: "Prove you can handle the late-run acceleration.",
      tiers: [
        { tier: "Bronze", value: "Reach +200% speed", sprite: "bronze" },
        { tier: "Silver", value: "Reach +300% speed", sprite: "silver" },
        { tier: "Gold", value: "Reach +500% speed", sprite: "gold" }
      ]
    },
    {
      id: "shield_teleporter_skills",
      category: "Skills",
      name: "Shield Teleporter",
      description: "Finish levels while still holding protection.",
      tiers: [
        { tier: "Bronze", value: "Teleport with shield 20x", sprite: "bronze" },
        { tier: "Silver", value: "Teleport with shield 50x", sprite: "silver" },
        { tier: "Gold", value: "Teleport with shield 100x", sprite: "gold" }
      ]
    },
    {
      id: "survivor_skills",
      category: "Skills",
      name: "Survivor",
      description: "Reach the endgame without losing a life.",
      tiers: [
        { tier: "Bronze", value: "Level 5 on Jump Classic Easy", sprite: "bronze" },
        { tier: "Silver", value: "Level 5 on Jump Classic Hard", sprite: "silver" },
        { tier: "Gold", value: "Level 5 on Jump Classic Hard & Jump Advanced", sprite: "gold" }
      ]
    },
    {
      id: "martyr_skills",
      category: "Skills",
      name: "Martyr",
      description: "A brutal run still leaves scars worth tracking.",
      tiers: [
        { tier: "Bronze", value: "Lose 5 lives in one run", sprite: "bronze" },
        { tier: "Silver", value: "Lose 20 lives in one run", sprite: "silver" },
        { tier: "Gold", value: "Lose 50 lives in one run", sprite: "gold" }
      ]
    },
    {
      id: "purist_skills",
      category: "Skills",
      name: "Purist",
      description: "Climb deep into Hrrra without touching a negative pickup.",
      tiers: [
        { tier: "Bronze", value: "Reach Level 2 clean", sprite: "bronze" },
        { tier: "Silver", value: "Reach Level 4 clean", sprite: "silver" },
        { tier: "Gold", value: "Reach Level 5 clean", sprite: "gold" }
      ]
    },
    {
      id: "shopaholic_skills",
      category: "Skills",
      name: "Shopaholic",
      description: "Buy across the shop until every unique branch is completed.",
      tiers: [
        { tier: "Bronze", value: "1 unique shop item", sprite: "bronze" },
        { tier: "Silver", value: "3 unique shop items", sprite: "silver" },
        { tier: "Gold", value: "7 unique shop items", sprite: "gold" }
      ]
    },
    {
      id: "first_runner_legends",
      category: "Lifetime Legends",
      name: "First Runner",
      description: "Start your very first run and enter the world of Hrrra.",
      tiers: [
        { tier: "Legend", value: "Start 1 run", sprite: "gold" }
      ]
    },
    {
      id: "heart_hunter_legends",
      category: "Lifetime Legends",
      name: "Heart Hunter",
      description: "Collect an absurd number of bonus lives over time.",
      tiers: [
        { tier: "Legend", value: "Collect 1000 lives", sprite: "gold" }
      ]
    },
    {
      id: "still_running_legends",
      category: "Lifetime Legends",
      name: "Still Running",
      description: "Lose a huge number of lives and keep coming back anyway.",
      tiers: [
        { tier: "Legend", value: "Lose 1000 lives", sprite: "gold" }
      ]
    },
    {
      id: "teleporter_legends",
      category: "Lifetime Legends",
      name: "Teleporter",
      description: "Use teleports so often it becomes second nature.",
      tiers: [
        { tier: "Legend", value: "Use 500 teleports", sprite: "gold" }
      ]
    },
    {
      id: "bubble_saver_legends",
      category: "Lifetime Legends",
      name: "Bubble Saver",
      description: "Let shield saves stack up into a real legend stat.",
      tiers: [
        { tier: "Legend", value: "Trigger 500 shield saves", sprite: "gold" }
      ]
    },
    {
      id: "cursed_legends",
      category: "Lifetime Legends",
      name: "Cursed",
      description: "Spend a very long time playing under cursed score lock.",
      tiers: [
        { tier: "Legend", value: "Stay cursed for 1000s", sprite: "gold" }
      ]
    },
    {
      id: "magneto_legends",
      category: "Lifetime Legends",
      name: "Magneto",
      description: "Lean on magnet pickups often enough to earn a title.",
      tiers: [
        { tier: "Legend", value: "Pick up 1000 magnets", sprite: "gold" }
      ]
    },
    {
      id: "starter_legends",
      category: "Lifetime Legends",
      name: "Starter",
      description: "Start run after run until the count itself becomes a badge.",
      tiers: [
        { tier: "Legend", value: "Start 500 runs", sprite: "gold" }
      ]
    },
    {
      id: "unlocker_discovery",
      category: "Discovery",
      name: "Unlocker",
      description: "Open up the full game and complete the collection.",
      tiers: [
        { tier: "Bronze", value: "Unlock Hard", sprite: "bronze" },
        { tier: "Silver", value: "Unlock Jump Advanced", sprite: "silver" },
        { tier: "Gold", value: "Unlock all skins", sprite: "gold" }
      ]
    }
  ];
  var configDefaultsSnapshot = {};
  var modeTuning = window.HrrraModeTuning || {};
  var difficultyTuning = window.HrrraDifficultyTuning || {};
  var levelTuning = window.HrrraLevelTuning || {};

  function createDefaultBadgeStats() {
    return {
      unlockedDates: {},
      lifetime: {
        totalScore: 0,
        totalCoins: 0,
        totalBags: 0,
        exchangedCoins: 0,
        continuesUsed: 0,
        questionPositive: 0,
        questionNegative: 0,
        livesCollected: 0,
        livesLost: 0,
        teleportsUsed: 0,
        shieldSaves: 0,
        shieldTeleports: 0,
        cursedSeconds: 0,
        magnetPickups: 0,
        runsStarted: 0,
        jumps: 0
      },
      best: {
        singleRunScore: 0,
        singleRunCoins: 0,
        singleRunBags: 0,
        singleRunQuestionPositive: 0,
        singleRunQuestionNegative: 0,
        cleanLevelsSingleRun: 0,
        maxSpeedPercent: 0,
        livesLostSingleRun: 0,
        puristLevel: 0,
        survivorEasyJumpLevel: 0,
        survivorHardJumpLevel: 0,
        survivorHardFullLevel: 0
      }
    };
  }

  function sanitizeBadgeStats(raw) {
    var defaults = createDefaultBadgeStats();
    var out = createDefaultBadgeStats();
    var key;

    if (!raw || typeof raw !== "object") {
      return defaults;
    }

    if (raw.unlockedDates && typeof raw.unlockedDates === "object") {
      for (key in raw.unlockedDates) {
        if (!Object.prototype.hasOwnProperty.call(raw.unlockedDates, key)) {
          continue;
        }
        if (typeof raw.unlockedDates[key] === "string" && raw.unlockedDates[key].trim()) {
          out.unlockedDates[key] = raw.unlockedDates[key].trim();
        }
      }
    }

    ["lifetime", "best"].forEach(function (section) {
      var source = raw[section];
      var target = out[section];
      var sectionDefaults = defaults[section];
      for (key in sectionDefaults) {
        if (!Object.prototype.hasOwnProperty.call(sectionDefaults, key)) {
          continue;
        }
        target[key] = Number.isFinite(source && source[key]) ? Math.max(0, Number(source[key])) : sectionDefaults[key];
      }
    });

    return out;
  }

  function getActiveProfileStoragePlayerId() {
    return isAuthenticatedPlayerId(activeProfilePlayerId) ? normalizePlayerId(activeProfilePlayerId) : "";
  }

  function setActiveProfileStoragePlayerId(playerId) {
    activeProfilePlayerId = isAuthenticatedPlayerId(playerId) ? normalizePlayerId(playerId) : "";
  }

  function getScopedStorageKey(prefix, playerId) {
    var normalizedPlayerId = normalizePlayerId(playerId);
    return normalizedPlayerId ? prefix + normalizedPlayerId : "";
  }

  function getActiveProfileStorageKey(prefix) {
    var playerId = getActiveProfileStoragePlayerId();
    return playerId ? prefix + playerId : "";
  }

  function getScopedMaxScoreStorageKey(playerId, mode, difficulty) {
    var normalizedPlayerId = normalizePlayerId(playerId);
    if (!normalizedPlayerId) {
      return "";
    }
    return MAX_SCORE_STORAGE_KEY_PREFIX + normalizedPlayerId + "_" + String(difficulty) + "_" + String(mode);
  }

  function hasLocalStorageKeyWithPrefix(prefix) {
    try {
      for (var index = 0; index < window.localStorage.length; index += 1) {
        var key = window.localStorage.key(index);
        if (key && key.indexOf(prefix) === 0) {
          return true;
        }
      }
    } catch (error) {
      // ignore storage failures
    }
    return false;
  }

  function readLegacyBadgeStatsFromStorage() {
    try {
      var raw = window.localStorage.getItem(LEGACY_BADGE_STATS_STORAGE_KEY);
      if (!raw) {
        return null;
      }
      return sanitizeBadgeStats(JSON.parse(raw));
    } catch (error) {
      return null;
    }
  }

  function readLegacyEconomyStatsFromStorage() {
    try {
      var raw = window.localStorage.getItem(LEGACY_ECONOMY_STORAGE_KEY);
      if (!raw) {
        return null;
      }
      return sanitizeEconomyStats(JSON.parse(raw));
    } catch (error) {
      return null;
    }
  }

  function readLegacyPlayerSkinProgressFromStorage() {
    try {
      var raw = window.localStorage.getItem(LEGACY_PLAYER_SKIN_PROGRESS_STORAGE_KEY);
      if (!raw) {
        return null;
      }
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") {
        return null;
      }
      return {
        unlockedSkins: cloneSkinUnlocks(parsed.unlockedSkins),
        selectedSkin: normalizeSkinName(parsed.selectedSkin),
        highestLevelReached: sanitizeHighestLevelReached(parsed.highestLevelReached),
        levelXUnlocked: Boolean(parsed.levelXUnlocked),
        hardModeOverride: parsed.hardModeOverride === "locked" || parsed.hardModeOverride === "unlocked"
          ? parsed.hardModeOverride
          : "default",
        fullModeOverride: parsed.fullModeOverride === "locked" || parsed.fullModeOverride === "unlocked"
          ? parsed.fullModeOverride
          : "default"
      };
    } catch (error) {
      return null;
    }
  }

  function hasScopedPlayerProgressStorage(playerId) {
    var normalizedPlayerId = normalizePlayerId(playerId);
    if (!normalizedPlayerId) {
      return false;
    }
    if (window.localStorage.getItem(getScopedStorageKey(BADGE_STATS_STORAGE_KEY_PREFIX, normalizedPlayerId)) !== null) {
      return true;
    }
    if (window.localStorage.getItem(getScopedStorageKey(ECONOMY_STORAGE_KEY_PREFIX, normalizedPlayerId)) !== null) {
      return true;
    }
    if (window.localStorage.getItem(getScopedStorageKey(PLAYER_SKIN_PROGRESS_STORAGE_KEY_PREFIX, normalizedPlayerId)) !== null) {
      return true;
    }
    return hasLocalStorageKeyWithPrefix(MAX_SCORE_STORAGE_KEY_PREFIX + normalizedPlayerId + "_");
  }

  function removeLegacyProfileStorage() {
    try {
      var keysToRemove = [];
      for (var i = 0; i < window.localStorage.length; i += 1) {
        var key = window.localStorage.key(i);
        if (!key) {
          continue;
        }
        if (
          key === LEGACY_BADGE_STATS_STORAGE_KEY ||
          key === LEGACY_ECONOMY_STORAGE_KEY ||
          key === LEGACY_PLAYER_SKIN_PROGRESS_STORAGE_KEY ||
          key.indexOf(LEGACY_MAX_SCORE_STORAGE_KEY_PREFIX) === 0
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

  function migrateLegacyProfileStorageIfNeeded(playerId) {
    var normalizedPlayerId = isAuthenticatedPlayerId(playerId) ? normalizePlayerId(playerId) : "";
    if (!normalizedPlayerId || hasScopedPlayerProgressStorage(normalizedPlayerId)) {
      return;
    }

    var legacyBadgeStats = readLegacyBadgeStatsFromStorage();
    var legacyEconomyStats = readLegacyEconomyStatsFromStorage();
    var legacySkinProgress = readLegacyPlayerSkinProgressFromStorage();
    var hasLegacyMaxScores = hasLocalStorageKeyWithPrefix(LEGACY_MAX_SCORE_STORAGE_KEY_PREFIX);
    if (!legacyBadgeStats && !legacyEconomyStats && !legacySkinProgress && !hasLegacyMaxScores) {
      return;
    }

    try {
      if (legacyBadgeStats) {
        window.localStorage.setItem(getScopedStorageKey(BADGE_STATS_STORAGE_KEY_PREFIX, normalizedPlayerId), JSON.stringify(legacyBadgeStats));
      }
      if (legacyEconomyStats) {
        window.localStorage.setItem(getScopedStorageKey(ECONOMY_STORAGE_KEY_PREFIX, normalizedPlayerId), JSON.stringify(legacyEconomyStats));
      }
      if (legacySkinProgress) {
        window.localStorage.setItem(getScopedStorageKey(PLAYER_SKIN_PROGRESS_STORAGE_KEY_PREFIX, normalizedPlayerId), JSON.stringify(legacySkinProgress));
      }
      var legacyMaxScoreEntries = [];
      for (var index = 0; index < window.localStorage.length; index += 1) {
        var key = window.localStorage.key(index);
        if (!key || key.indexOf(LEGACY_MAX_SCORE_STORAGE_KEY_PREFIX) !== 0) {
          continue;
        }
        legacyMaxScoreEntries.push({
          suffix: key.slice(LEGACY_MAX_SCORE_STORAGE_KEY_PREFIX.length),
          value: window.localStorage.getItem(key)
        });
      }
      for (var entryIndex = 0; entryIndex < legacyMaxScoreEntries.length; entryIndex += 1) {
        var legacyEntry = legacyMaxScoreEntries[entryIndex];
        if (legacyEntry.value === null) {
          continue;
        }
        window.localStorage.setItem(MAX_SCORE_STORAGE_KEY_PREFIX + normalizedPlayerId + "_" + legacyEntry.suffix, legacyEntry.value);
      }
      removeLegacyProfileStorage();
    } catch (error) {
      // ignore migration failures
    }
  }

  function readBadgeStats() {
    try {
      var storageKey = getActiveProfileStorageKey(BADGE_STATS_STORAGE_KEY_PREFIX);
      if (!storageKey) {
        return createDefaultBadgeStats();
      }
      var raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        return createDefaultBadgeStats();
      }
      return sanitizeBadgeStats(JSON.parse(raw));
    } catch (error) {
      return createDefaultBadgeStats();
    }
  }

  function writeBadgeStats() {
    try {
      var storageKey = getActiveProfileStorageKey(BADGE_STATS_STORAGE_KEY_PREFIX);
      if (!storageKey) {
        return;
      }
      window.localStorage.setItem(storageKey, JSON.stringify(badgeStats));
    } catch (error) {
      // ignore write failures
    }
  }

  var badgeStats = createDefaultBadgeStats();

  function createDefaultEconomyStats() {
    var defaultMineStorageCapacity = sanitizeGlobalAdminNumber("mineStorageCapacity", C.mineStorageCapacity);
    var defaultMineIntervalMs = getMineBaseIntervalMs();
    return {
      coinsBalance: 0,
      totalCoinsEarned: 0,
      totalCoinsSpent: 0,
      buy10CoinsPurchasedOnce: false,
      mineStorageCoins: 0,
      mineStorageCapacity: defaultMineStorageCapacity,
      mineStorageUpgradeLevel: 1,
      mineStorageAdWatches: 0,
      mineMineIntervalMs: defaultMineIntervalMs,
      mineNextCoinAt: 0,
      mineFrozenRemainingMs: 0,
      mineUnlocked: true,
      mineShortTimerUnlocked: false
    };
  }

  function sanitizeEconomyStats(raw) {
    var defaults = createDefaultEconomyStats();
    var out = createDefaultEconomyStats();
    if (!raw || typeof raw !== "object") {
      return defaults;
    }
    out.coinsBalance = Number.isFinite(raw.coinsBalance) ? Math.max(0, Math.floor(Number(raw.coinsBalance))) : defaults.coinsBalance;
    out.totalCoinsEarned = Number.isFinite(raw.totalCoinsEarned) ? Math.max(0, Math.floor(Number(raw.totalCoinsEarned))) : defaults.totalCoinsEarned;
    out.totalCoinsSpent = Number.isFinite(raw.totalCoinsSpent) ? Math.max(0, Math.floor(Number(raw.totalCoinsSpent))) : defaults.totalCoinsSpent;
    out.buy10CoinsPurchasedOnce = typeof raw.buy10CoinsPurchasedOnce === "boolean" ? raw.buy10CoinsPurchasedOnce : defaults.buy10CoinsPurchasedOnce;
    out.mineStorageCoins = Number.isFinite(raw.mineStorageCoins) ? Math.max(0, Math.floor(Number(raw.mineStorageCoins))) : defaults.mineStorageCoins;
    out.mineStorageCapacity = Number.isFinite(raw.mineStorageCapacity) ? Math.max(1, Math.floor(Number(raw.mineStorageCapacity))) : defaults.mineStorageCapacity;
    out.mineStorageUpgradeLevel = Number.isFinite(raw.mineStorageUpgradeLevel) ? Math.max(1, Math.min(4, Math.floor(Number(raw.mineStorageUpgradeLevel)))) : defaults.mineStorageUpgradeLevel;
    out.mineStorageAdWatches = Number.isFinite(raw.mineStorageAdWatches) ? Math.max(0, Math.floor(Number(raw.mineStorageAdWatches))) : defaults.mineStorageAdWatches;
    out.mineMineIntervalMs = Number.isFinite(raw.mineMineIntervalMs) ? Math.max(1000, Math.floor(Number(raw.mineMineIntervalMs))) : defaults.mineMineIntervalMs;
    out.mineNextCoinAt = Number.isFinite(raw.mineNextCoinAt) ? Math.max(0, Math.floor(Number(raw.mineNextCoinAt))) : defaults.mineNextCoinAt;
    out.mineFrozenRemainingMs = Number.isFinite(raw.mineFrozenRemainingMs) ? Math.max(0, Math.floor(Number(raw.mineFrozenRemainingMs))) : defaults.mineFrozenRemainingMs;
    out.mineUnlocked = typeof raw.mineUnlocked === "boolean" ? raw.mineUnlocked : defaults.mineUnlocked;
    out.mineShortTimerUnlocked = typeof raw.mineShortTimerUnlocked === "boolean" ? raw.mineShortTimerUnlocked : defaults.mineShortTimerUnlocked;
    out.mineStorageCoins = Math.min(out.mineStorageCoins, out.mineStorageCapacity);
    out.mineStorageAdWatches = Math.max(0, Math.floor(Number(out.mineStorageAdWatches) || 0));
    return out;
  }

  function readEconomyStats() {
    try {
      var storageKey = getActiveProfileStorageKey(ECONOMY_STORAGE_KEY_PREFIX);
      if (!storageKey) {
        return createDefaultEconomyStats();
      }
      var raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        return createDefaultEconomyStats();
      }
      return sanitizeEconomyStats(JSON.parse(raw));
    } catch (error) {
      return createDefaultEconomyStats();
    }
  }

  function writeEconomyStats() {
    try {
      var storageKey = getActiveProfileStorageKey(ECONOMY_STORAGE_KEY_PREFIX);
      if (!storageKey) {
        return;
      }
      window.localStorage.setItem(storageKey, JSON.stringify(economyStats));
    } catch (error) {
      // ignore write failures
    }
  }

  var economyStats = createDefaultEconomyStats();

  function migrateEconomyShopProgressFromBadgeHistory() {
    if (!economyStats || typeof economyStats !== "object") {
      return false;
    }
    if (economyStats.buy10CoinsPurchasedOnce) {
      return false;
    }
    if (!badgeStats || !badgeStats.lifetime || !Number.isFinite(badgeStats.lifetime.exchangedCoins)) {
      return false;
    }
    if (Math.max(0, Math.floor(Number(badgeStats.lifetime.exchangedCoins) || 0)) <= 0) {
      return false;
    }
    economyStats.buy10CoinsPurchasedOnce = true;
    return true;
  }

  function readWhatsNewSeenVersionCode() {
    try {
      var raw = window.localStorage.getItem(WHATS_NEW_SEEN_VERSION_STORAGE_KEY);
      var parsed = Number(raw);
      return Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : 0;
    } catch (error) {
      return 0;
    }
  }

  function writeWhatsNewSeenVersionCode(versionCode) {
    try {
      window.localStorage.setItem(WHATS_NEW_SEEN_VERSION_STORAGE_KEY, String(Math.max(0, Math.floor(Number(versionCode) || 0))));
    } catch (error) {
      // ignore write failures
    }
  }

  function applyStartScreenGfx2Migration() {
    try {
      if (window.localStorage.getItem(START_SCREEN_GFX2_MIGRATION_STORAGE_KEY) === "1") {
        return;
      }
    } catch (error) {
      // ignore storage read failures
    }

    try {
      window.localStorage.setItem(START_SCREEN_GFX2_MIGRATION_STORAGE_KEY, "1");
    } catch (error) {
      // ignore storage write failures
    }
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

  function isAuthenticatedPlayerId(value) {
    return /^a_[a-z0-9_]+$/i.test(String(value || ""));
  }

  function isGuestPlayerId(value) {
    return /^g_[a-z0-9_]+$/i.test(String(value || ""));
  }

  function createGuestPlayerId() {
    return normalizePlayerId("g_" + Date.now().toString(36));
  }

  function readPlayerNameFromStorage() {
    try {
      return normalizePlayerName(window.localStorage.getItem(PLAYER_NAME_STORAGE_KEY) || "");
    } catch (error) {
      return "";
    }
  }

  function writePlayerNameToStorage(value) {
    try {
      var normalized = normalizePlayerName(value);
      if (normalized) {
        window.localStorage.setItem(PLAYER_NAME_STORAGE_KEY, normalized);
      } else {
        window.localStorage.removeItem(PLAYER_NAME_STORAGE_KEY);
      }
    } catch (error) {
      // ignore write failures
    }
  }

  function readPlayerIdFromStorage() {
    try {
      return normalizePlayerId(window.localStorage.getItem(PLAYER_ID_STORAGE_KEY) || "");
    } catch (error) {
      return "";
    }
  }

  function writePlayerIdToStorage(value) {
    try {
      var normalized = normalizePlayerId(value);
      if (normalized) {
        window.localStorage.setItem(PLAYER_ID_STORAGE_KEY, normalized);
      } else {
        window.localStorage.removeItem(PLAYER_ID_STORAGE_KEY);
      }
    } catch (error) {
      // ignore write failures
    }
  }

  var sceneArt = {
    backgroundSky: null,
    backgroundForeground: null,
    level1Border: null,
    level2Border: null,
    level3Border: null,
    level4Border: null,
    level5Border: null,
    levelxBack: null,
    levelxFront: null,
    levelxBorder: null,
    levelxPlatform: null,
    levelxBlocker: null,
    levelxRocket1: null,
    levelxRocket2: null,
    level2Level1: null,
    level2Level2: null,
    level2Level3: null,
    level2Level4: null,
    level3Layer1: null,
    level3Layer2: null,
    level3Layer3: null,
    level4ForestBack: null,
    level4ForestMid: null,
    level4ForestFront: null,
    level5Layer1: null,
    level5Layer2: null,
    level5Layer3: null,
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
  var audioState = {
    unlocked: false,
    appActive: true,
    musicPath: "",
    musicAudio: null,
    musicStarted: false,
    musicFailedPath: "",
    audioElementCache: {},
    audioContext: null,
    sfxOutputGain: null,
    decodedSfxCache: {},
    pendingDecodedSfxLoads: {},
    lastPlayTimes: {}
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
  var HERO_WALK_FRAME_FILENAMES_SKIN05 = [
    "hero-walk-01.png",
    "hero-walk-02.png",
    "hero-walk-03.png",
    "hero-walk-04.png",
    "hero-walk-05.png",
    "hero-walk-06.png"
  ];
  var HERO_JUMP_FRAME_FILENAMES_SKIN05 = [
    "hero-jump-01.png",
    "hero-jump-02.png",
    "hero-jump-03.png",
    "hero-jump-04.png",
    "hero-jump-05.png"
  ];
  var HERO_WALK_FRAME_FILENAMES_SKIN06 = [
    "hero-walk-01.png",
    "hero-walk-02.png",
    "hero-walk-03.png",
    "hero-walk-04.png",
    "hero-walk-05.png",
    "hero-walk-06.png",
    "hero-walk-07.png",
    "hero-walk-08.png"
  ];
  var HERO_JUMP_FRAME_FILENAMES_SKIN06 = [
    "hero-jump-01.png",
    "hero-jump-02.png",
    "hero-jump-03.png",
    "hero-jump-04.png",
    "hero-jump-05.png",
    "hero-jump-06.png"
  ];
  var SKIN_DISPLAY_NAMES = {
    Skin01: "Zyro",
    Skin02: "Vexi",
    Skin03: "Nemu",
    Skin04: "Krob",
    Skin05: "Grey",
    Skin06: "Kaja",
    Skin07: "Cube"
  };
  var FUTURE_SKIN_SLOT_COUNT = 0;
  var FUTURE_SKIN_ICON_PATH = "assets/hero-question-mark-icon.png";
  var QUESTION_COIN_AUTO_STOP_SECONDS = 5;
  var LIFE_LOSS_INVULNERABILITY_SECONDS = 2;
  var SKIN_OPTIONS = [
    { value: "Skin01", label: "Zyro" },
    { value: "Skin02", label: "Vexi" },
    { value: "Skin03", label: "Nemu" },
    { value: "Skin04", label: "Krob" },
    { value: "Skin05", label: "Grey" },
    { value: "Skin06", label: "Kaja" },
    { value: "Skin07", label: "Cube" }
  ];
  var DISCOVERABLE_SKIN_OPTIONS = ["Skin02", "Skin03", "Skin04", "Skin05", "Skin06", "Skin07"];
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
    },
    Skin05: {
      label: "Grey",
      previewAssetPath: "assets/skins/Skin05/hero-icon.png",
      pickupAssetPath: "assets/skins/Skin05/hero-icon.png"
    },
    Skin06: {
      label: "Kaja",
      previewAssetPath: "assets/skins/Skin06/hero-icon.png",
      pickupAssetPath: "assets/skins/Skin06/hero-icon.png"
    },
    Skin07: {
      label: "Cube",
      previewAssetPath: "assets/skins/Skin07/skin07_unselected.png",
      pickupAssetPath: "assets/skins/Skin07/skin07_selected.png"
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
    },
    Skin05: {
      walkFilenames: HERO_WALK_FRAME_FILENAMES_SKIN05,
      jumpFilenames: HERO_JUMP_FRAME_FILENAMES_SKIN05,
      usesFullFrameSourceRects: true
    },
    Skin07: {
      walkFilenames: HERO_WALK_FRAME_FILENAMES,
      jumpFilenames: HERO_JUMP_FRAME_FILENAMES
    },
    Skin06: {
      walkFilenames: HERO_WALK_FRAME_FILENAMES_SKIN06,
      jumpFilenames: HERO_JUMP_FRAME_FILENAMES_SKIN06,
      walkSourceRects: [
        { x: 40, y: 1, w: 121, h: 194 },
        { x: 52, y: 4, w: 115, h: 191 },
        { x: 10, y: 7, w: 154, h: 188 },
        { x: 19, y: 7, w: 142, h: 188 },
        { x: 46, y: 1, w: 115, h: 194 },
        { x: 16, y: 1, w: 133, h: 194 },
        { x: 10, y: 4, w: 151, h: 191 },
        { x: 28, y: 4, w: 112, h: 191 }
      ],
      jumpSourceRects: [
        { x: 71, y: 64, w: 81, h: 149 },
        { x: 52, y: 4, w: 106, h: 193 },
        { x: 71, y: 10, w: 81, h: 199 },
        { x: 49, y: 13, w: 118, h: 200 },
        { x: 43, y: 28, w: 112, h: 185 },
        { x: 61, y: 37, w: 88, h: 176 }
      ],
      usesFullFrameSourceRects: true
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
  var LEVEL1_BORDER_ART_PATH = "assets/level1/level1_border.png";
  var LEVEL2_BORDER_ART_PATH = "assets/level2/level2_border.png";
  var LEVEL2_CAVE_LAYER1_ART_PATH = "assets/level2/background 01.jpg";
  var LEVEL2_CAVE_LAYER2_ART_PATH = "assets/level2/background 02.png";
  var LEVEL2_CAVE_LAYER3_ART_PATH = "assets/level2/background 03.png";
  var LEVEL2_CAVE_LAYER4_ART_PATH = "assets/level2/background 04.png";
  var LEVEL3_BORDER_ART_PATH = "assets/level3/level3_border.png";
  var LEVEL3_LAYER1_ART_PATH = "assets/level3/background 01.jpg";
  var LEVEL3_LAYER2_ART_PATH = "assets/level3/background 02.png";
  var LEVEL3_LAYER3_ART_PATH = "assets/level3/background 03.png";
  var LEVEL4_BORDER_ART_PATH = "assets/level4/level4_border.png";
  var LEVEL4_FOREST_BACK_ART_PATH = "assets/level4/background_back_tile.jpg";
  var LEVEL4_FOREST_MID_ART_PATH = "assets/level4/background_mid_tile.png";
  var LEVEL4_FOREST_FRONT_ART_PATH = "assets/level4/background_front_tile.png";
  var LEVEL5_LAYER1_ART_PATH = "assets/level5/background 01.jpg";
  var LEVEL5_LAYER2_ART_PATH = "assets/level5/background 02.png";
  var LEVEL5_LAYER3_ART_PATH = "assets/level5/background 03.png";
  var LEVEL5_BORDER_ART_PATH = "assets/level5/level5_border.png";
  var LEVELX_BACK_ART_PATH = "assets/levelx/background_back_tile.jpg";
  var LEVELX_FRONT_ART_PATH = "assets/levelx/background_front_tile.png";
  var LEVELX_BORDER_ART_PATH = "assets/levelx/levelx_border.png";
  var LEVELX_PLATFORM_ART_PATH = "assets/levelx/levelx_platform.png";
  var LEVELX_BLOCKER_ART_PATH = "assets/levelx/levelx_blocker.png";
  var LEVELX_ROCKET1_ART_PATH = "assets/levelx/levelx_rocket01.png";
  var LEVELX_ROCKET2_ART_PATH = "assets/levelx/levelx_rocket02.png";
  var PLATFORM_ART_PATH = "assets/platform-tile-clean.png";
  var LEVEL_FINISHED_ART_PATHS = {
    1: "assets/level1/level1_finished.jpg",
    2: "assets/level2/level2_finished.jpg",
    3: "assets/level3/level3_finished.jpg",
    4: "assets/level4/level4_finished.jpg",
    5: "assets/level5/level5_finished.jpg"
  };
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
    rocket1: "rocket01.png",
    rocket2: "rocket02.png"
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

  function getClampedAudioVolumePercent(value, fallback) {
    var parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      parsed = Number(fallback);
    }
    if (!Number.isFinite(parsed)) {
      parsed = 100;
    }
    return Math.max(0, Math.min(100, parsed));
  }

  function getAudioVolumeRatio(percentValue, fallback) {
    return getClampedAudioVolumePercent(percentValue, fallback) / 100;
  }

  function getMasterAudioVolumeRatio() {
    return getAudioVolumeRatio(C.audioMasterVolumePercent, 75);
  }

  function getMusicAudioVolumeRatio() {
    return getMasterAudioVolumeRatio() * getAudioVolumeRatio(C.audioMusicVolumePercent, 10) * 0.33 * getMusicSceneVolumeMultiplier();
  }

  function getMusicSceneVolumeMultiplier() {
    if (state.levelFinishedActive) {
      return 0.75;
    }
    if (state.preRunActive && state.preRunStep === "details" && (isPreRunGfx2ClassicInsideActive() || isPreRunGfx2AdvancedInsideActive())) {
      return 0.75;
    }
    return 1;
  }

  function getMusicFadeRatio() {
    if (!state.preRunLaunchActive) {
      return 1;
    }
    return Math.max(0, 1 - state.preRunLaunchElapsed / state.preRunLaunchDuration);
  }

  function getSfxAudioVolumeRatio() {
    return getMasterAudioVolumeRatio() * getAudioVolumeRatio(C.audioSfxVolumePercent, 85);
  }

  function getNormalizedLevelAudioPath(configKey) {
    if (typeof C[configKey] !== "string") {
      return "";
    }
    return sanitizeAudioPathValue(C[configKey]);
  }

  function getNormalizedGlobalAudioPath(configKey) {
    if (typeof C[configKey] !== "string") {
      return "";
    }
    return sanitizeAudioPathValue(C[configKey]);
  }

  function getAudioExtensionFallbackPaths(path) {
    var normalizedPath = sanitizeAudioPathValue(path);
    if (!normalizedPath) {
      return [];
    }

    var fallbackPaths = [normalizedPath];
    var alternatePath = "";
    if (/\.mp3$/i.test(normalizedPath)) {
      alternatePath = normalizedPath.replace(/\.mp3$/i, ".ogg");
    } else if (/\.ogg$/i.test(normalizedPath)) {
      alternatePath = normalizedPath.replace(/\.ogg$/i, ".mp3");
    }

    if (alternatePath && alternatePath !== normalizedPath) {
      fallbackPaths.push(alternatePath);
    }

    if (/\/level[234x]\/sound\/(?:l[234]|lx)-music-loop\.(mp3|ogg)$/i.test(normalizedPath)) {
      fallbackPaths.push("assets/level1/sound/l1-music-loop.mp3");
    }

    return fallbackPaths;
  }

  function getUiButtonSoundPath() {
    return getNormalizedGlobalAudioPath("uiSoundButtonPath");
  }

  function getUiPageOpenSoundPath() {
    return getNormalizedGlobalAudioPath("uiSoundPageOpenPath");
  }

  function getUiBadgesPageSoundPath() {
    return getNormalizedGlobalAudioPath("uiSoundBadgesPagePath");
  }

  function getUiBadgeRevealSoundPath() {
    return getNormalizedGlobalAudioPath("uiSoundBadgeRevealPath");
  }

  function getUiCrossingMusicPath() {
    return getNormalizedGlobalAudioPath("uiCrossingMusicPath");
  }

  function getUiPreRunMusicPath() {
    return getNormalizedGlobalAudioPath("uiPreRunMusicPath");
  }

  function getUiLevelFinishedMusicPath() {
    return getNormalizedGlobalAudioPath("uiLevelFinishedMusicPath");
  }

  function getUiGameOverMusicPath() {
    return getNormalizedGlobalAudioPath("uiGameOverMusicPath");
  }

  function getLevelMusicLoopPath() {
    return getNormalizedLevelAudioPath("levelMusicLoopPath");
  }

  function getLevelSfxPath(configKey) {
    return getNormalizedLevelAudioPath(configKey);
  }

  function isGameplayAudioStateActive() {
    return (
      state.running ||
      state.questionCoinAnimActive ||
      state.teleportFinishAnimActive ||
      state.projectileDeathAnimActive ||
      state.badgeRewardActive
    );
  }

  function isGameOverScreenVisible() {
    return Boolean(gameOverEl && !gameOverEl.classList.contains("hidden"));
  }

  function getCurrentMusicPath() {
    if (state.adminPaused && !state.inGameSettingsActive) {
      return "";
    }
    if (state.preRunActive) {
      if (
        state.preRunStep === "select" ||
        state.preRunStep === "badges" ||
        state.preRunStep === "scores" ||
        state.preRunStep === "shop" ||
        state.preRunStep === "settings" ||
        state.preRunStep === "rules" ||
        state.preRunStep === "credits"
      ) {
        return getUiCrossingMusicPath();
      }
      return getUiPreRunMusicPath();
    }
    if (state.levelFinishedActive) {
      return getUiLevelFinishedMusicPath();
    }
    if (state.projectileDeathAnimActive || state.badgeRewardActive) {
      return "";
    }
    if (isGameOverScreenVisible()) {
      return getUiGameOverMusicPath();
    }
    return isGameplayAudioStateActive() ? getLevelMusicLoopPath() : "";
  }

  function canPlayMusic() {
    return (
      audioState.appActive &&
      audioState.unlocked &&
      Boolean(C.audioMusicEnabled) &&
      getMusicAudioVolumeRatio() > 0 &&
      Boolean(getCurrentMusicPath())
    );
  }

  function canPlaySfx() {
    return audioState.appActive && audioState.unlocked && Boolean(C.audioSfxEnabled) && getSfxAudioVolumeRatio() > 0;
  }

  function applyCurrentMusicVolume() {
    if (!audioState.musicAudio) {
      return;
    }
    audioState.musicAudio.volume = getMusicAudioVolumeRatio() * getMusicFadeRatio();
  }

  function ensureAudioContext() {
    var AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (typeof AudioContextCtor !== "function") {
      return null;
    }

    if (!audioState.audioContext || audioState.audioContext.state === "closed") {
      audioState.audioContext = new AudioContextCtor();
      audioState.sfxOutputGain = audioState.audioContext.createGain();
      audioState.sfxOutputGain.connect(audioState.audioContext.destination);
    }

    return audioState.audioContext;
  }

  function refreshSfxOutputGain() {
    if (!audioState.sfxOutputGain) {
      return;
    }
    audioState.sfxOutputGain.gain.value = getSfxAudioVolumeRatio();
  }

  function decodeAudioDataWithContext(audioContext, arrayBuffer) {
    if (!audioContext) {
      return Promise.resolve(null);
    }

    if (typeof audioContext.decodeAudioData === "function") {
      var decodeResult = audioContext.decodeAudioData(arrayBuffer.slice(0));
      if (decodeResult && typeof decodeResult.then === "function") {
        return decodeResult;
      }
    }

    return new Promise(function (resolve, reject) {
      audioContext.decodeAudioData(
        arrayBuffer.slice(0),
        function (buffer) {
          resolve(buffer || null);
        },
        function (error) {
          reject(error);
        }
      );
    });
  }

  function preloadDecodedSfx(path) {
    var normalizedPath = sanitizeAudioPathValue(path);
    if (!normalizedPath) {
      return Promise.resolve(null);
    }

    if (Object.prototype.hasOwnProperty.call(audioState.decodedSfxCache, normalizedPath)) {
      return Promise.resolve(audioState.decodedSfxCache[normalizedPath]);
    }

    if (audioState.pendingDecodedSfxLoads[normalizedPath]) {
      return audioState.pendingDecodedSfxLoads[normalizedPath];
    }

    var audioContext = ensureAudioContext();
    if (!audioContext || typeof window.fetch !== "function") {
      return Promise.resolve(null);
    }

    var loadPromise = window.fetch(normalizedPath)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to load audio: " + normalizedPath);
        }
        return response.arrayBuffer();
      })
      .then(function (arrayBuffer) {
        return decodeAudioDataWithContext(audioContext, arrayBuffer);
      })
      .then(function (audioBuffer) {
        audioState.decodedSfxCache[normalizedPath] = audioBuffer || null;
        delete audioState.pendingDecodedSfxLoads[normalizedPath];
        return audioState.decodedSfxCache[normalizedPath];
      })
      .catch(function () {
        audioState.decodedSfxCache[normalizedPath] = null;
        delete audioState.pendingDecodedSfxLoads[normalizedPath];
        return null;
      });

    audioState.pendingDecodedSfxLoads[normalizedPath] = loadPromise;
    return loadPromise;
  }

  function warmCurrentSfxBuffers() {
    if (!audioState.unlocked) {
      return;
    }

    var paths = [
      getUiButtonSoundPath(),
      getUiPageOpenSoundPath(),
      getUiBadgesPageSoundPath(),
      getUiBadgeRevealSoundPath()
    ];

    for (var sfxFieldIndex = 0; sfxFieldIndex < AUDIO_LEVEL_FIELD_KEYS.length; sfxFieldIndex += 1) {
      var sfxFieldKey = AUDIO_LEVEL_FIELD_KEYS[sfxFieldIndex];
      if (sfxFieldKey === "levelMusicLoopPath") {
        continue;
      }
      paths.push(getLevelSfxPath(sfxFieldKey));
    }

    var seenPaths = {};
    for (var pathIndex = 0; pathIndex < paths.length; pathIndex += 1) {
      var normalizedPath = sanitizeAudioPathValue(paths[pathIndex]);
      if (!normalizedPath || seenPaths[normalizedPath]) {
        continue;
      }
      seenPaths[normalizedPath] = true;
      preloadDecodedSfx(normalizedPath);
    }
  }

  function getAudioCachedElement(path, loop, fallbackPaths) {
    var normalizedPath = sanitizeAudioPathValue(path);
    if (!normalizedPath) {
      return null;
    }
    var cached = audioState.audioElementCache[normalizedPath];
    if (!cached) {
      cached = new Audio(normalizedPath);
      cached.preload = "auto";
      cached.loop = Boolean(loop);
      audioState.audioElementCache[normalizedPath] = cached;
      if (Boolean(loop) && fallbackPaths && fallbackPaths.length > 1) {
        cached._hrrraFallbackPaths = fallbackPaths.slice(0);
        cached._hrrraFallbackIndex = 0;
        cached.addEventListener("error", function () {
          var paths = cached._hrrraFallbackPaths;
          if (!paths || cached._hrrraFallbackIndex >= paths.length - 1) {
            if (audioState.musicAudio === cached) {
              audioState.musicStarted = false;
              audioState.musicFailedPath = audioState.musicPath;
            }
            try {
              cached.pause();
              cached.currentTime = 0;
            } catch (pauseError) {}
            return;
          }

          cached._hrrraFallbackIndex += 1;
          var nextPath = paths[cached._hrrraFallbackIndex];
          try {
            cached.src = nextPath;
            cached.load();
          } catch (loadError) {}
          if (audioState.musicAudio === cached) {
            audioState.musicStarted = false;
            audioState.musicFailedPath = "";
            var playResult = cached.play();
            audioState.musicStarted = true;
            if (playResult && typeof playResult.catch === "function") {
              playResult.catch(function () {
                audioState.musicStarted = false;
              });
            }
          }
        });
      }
    }
    cached.loop = Boolean(loop);
    return cached;
  }

  function unlockAudioIfNeeded() {
    var audioContext = ensureAudioContext();
    if (audioContext && audioContext.state === "suspended") {
      audioContext.resume().catch(function () {});
    }
    refreshSfxOutputGain();
    if (audioState.unlocked) {
      refreshMusicPlayback();
      warmCurrentSfxBuffers();
      return;
    }
    audioState.unlocked = true;
    refreshMusicPlayback();
    warmCurrentSfxBuffers();
  }

  function stopCurrentMusic() {
    if (!audioState.musicAudio) {
      audioState.musicPath = "";
      audioState.musicStarted = false;
      audioState.musicFailedPath = "";
      return;
    }
    try {
      audioState.musicAudio.pause();
      audioState.musicAudio.currentTime = 0;
    } catch (error) {}
    audioState.musicAudio = null;
    audioState.musicPath = "";
    audioState.musicStarted = false;
    audioState.musicFailedPath = "";
  }

  function setAudioAppActive(isActive) {
    var nextActive = Boolean(isActive);
    if (audioState.appActive === nextActive) {
      return;
    }

    audioState.appActive = nextActive;

    if (!audioState.appActive) {
      stopCurrentMusic();
      if (audioState.audioContext && audioState.audioContext.state === "running") {
        audioState.audioContext.suspend().catch(function () {});
      }
      return;
    }

    if (audioState.audioContext && audioState.audioContext.state === "suspended" && audioState.unlocked) {
      audioState.audioContext.resume().catch(function () {});
    }
    refreshMusicPlayback();
  }

  function refreshMusicPlayback() {
    var nextPath = canPlayMusic() ? getCurrentMusicPath() : "";
    if (!canPlayMusic() || !nextPath) {
      stopCurrentMusic();
      return;
    }

    if (audioState.musicFailedPath === nextPath) {
      return;
    }

    if (audioState.musicPath !== nextPath) {
      stopCurrentMusic();
      audioState.musicPath = nextPath;
      audioState.musicAudio = getAudioCachedElement(nextPath, true, getAudioExtensionFallbackPaths(nextPath));
      audioState.musicStarted = false;
    }

    if (!audioState.musicAudio) {
      return;
    }

    audioState.musicAudio.loop = true;
    applyCurrentMusicVolume();
    if (!audioState.musicStarted) {
      var playResult = audioState.musicAudio.play();
      audioState.musicStarted = true;
      if (playResult && typeof playResult.catch === "function") {
        playResult.catch(function () {
          audioState.musicStarted = false;
        });
      }
    }
  }

  function stopBadgesPageMusicIfLeaving() {
    var badgesMusicPath = sanitizeAudioPathValue(getUiBadgesPageSoundPath());
    if (!badgesMusicPath) {
      return;
    }
    if (state.preRunActive && state.preRunStep === "badges") {
      return;
    }
    if (audioState.musicPath === badgesMusicPath) {
      stopCurrentMusic();
    }
  }

  function applyGlobalAudioSetting(key, nextValue) {
    var normalizedValue = Boolean(nextValue);
    saveGlobalAdminField(key, normalizedValue);
    C[key] = normalizedValue;
    refreshSfxOutputGain();
    warmCurrentSfxBuffers();
    refreshMusicPlayback();
  }

  function applyGlobalVolumeSetting(key, nextValue) {
    var normalizedValue = sanitizeGlobalAdminNumber(key, nextValue);
    saveGlobalAdminField(key, normalizedValue);
    C[key] = normalizedValue;
    refreshSfxOutputGain();
    warmCurrentSfxBuffers();
    refreshMusicPlayback();
  }

  function getStoredMusicRestoreVolumePercent() {
    if (!Number.isFinite(preRunSettingsGfx2MusicRestoreVolumePercent)) {
      preRunSettingsGfx2MusicRestoreVolumePercent = sanitizeGlobalAdminNumber("audioMusicRestoreVolumePercent", C.audioMusicRestoreVolumePercent);
    }
    return preRunSettingsGfx2MusicRestoreVolumePercent;
  }

  function getStoredSfxRestoreVolumePercent() {
    if (!Number.isFinite(preRunSettingsGfx2SfxRestoreVolumePercent)) {
      preRunSettingsGfx2SfxRestoreVolumePercent = sanitizeGlobalAdminNumber("audioSfxRestoreVolumePercent", C.audioSfxRestoreVolumePercent);
    }
    return preRunSettingsGfx2SfxRestoreVolumePercent;
  }

  function rememberMusicRestoreVolumePercent(nextValue) {
    var normalizedValue = sanitizeGlobalAdminNumber("audioMusicVolumePercent", nextValue);
    if (normalizedValue > 0) {
      preRunSettingsGfx2MusicRestoreVolumePercent = normalizedValue;
      saveGlobalAdminField("audioMusicRestoreVolumePercent", normalizedValue);
      C.audioMusicRestoreVolumePercent = normalizedValue;
    }
  }

  function rememberSfxRestoreVolumePercent(nextValue) {
    var normalizedValue = sanitizeGlobalAdminNumber("audioSfxVolumePercent", nextValue);
    if (normalizedValue > 0) {
      preRunSettingsGfx2SfxRestoreVolumePercent = normalizedValue;
      saveGlobalAdminField("audioSfxRestoreVolumePercent", normalizedValue);
      C.audioSfxRestoreVolumePercent = normalizedValue;
    }
  }

  function renderPreRunSettingsScreen() {
    if (preRunSettingsGfx2El) {
      preRunSettingsGfx2El.classList.remove("hidden");
      preRunSettingsGfx2El.classList.toggle("is-music-off", !C.audioMusicEnabled || getMusicAudioVolumeRatio() <= 0);
      preRunSettingsGfx2El.classList.toggle("is-sfx-off", !C.audioSfxEnabled || getSfxAudioVolumeRatio() <= 0);
    }
    if (preRunSettingsGfx2MusicBtn) {
      var gfx2MusicVolume = sanitizeGlobalAdminNumber("audioMusicVolumePercent", C.audioMusicVolumePercent);
      var gfx2MusicDisplayVolume = C.audioMusicEnabled ? gfx2MusicVolume : 0;
      preRunSettingsGfx2MusicBtn.value = String(gfx2MusicDisplayVolume);
      preRunSettingsGfx2MusicBtn.setAttribute("aria-valuenow", String(gfx2MusicDisplayVolume));
      preRunSettingsGfx2MusicBtn.title = C.audioMusicEnabled
        ? "Music volume " + String(gfx2MusicDisplayVolume) + "%"
        : "Music muted";
    }
    if (preRunSettingsGfx2MusicGraphicBtn) {
      var musicGraphicEnabled = Boolean(C.audioMusicEnabled);
      preRunSettingsGfx2MusicGraphicBtn.setAttribute("aria-pressed", musicGraphicEnabled ? "true" : "false");
      preRunSettingsGfx2MusicGraphicBtn.setAttribute("aria-label", musicGraphicEnabled ? "Mute music" : "Unmute music");
      preRunSettingsGfx2MusicGraphicBtn.title = musicGraphicEnabled ? "Mute music" : "Unmute music";
    }
    if (preRunSettingsGfx2SfxBtn) {
      var gfx2SfxVolume = sanitizeGlobalAdminNumber("audioSfxVolumePercent", C.audioSfxVolumePercent);
      var gfx2SfxDisplayVolume = C.audioSfxEnabled ? gfx2SfxVolume : 0;
      preRunSettingsGfx2SfxBtn.value = String(gfx2SfxDisplayVolume);
      preRunSettingsGfx2SfxBtn.setAttribute("aria-valuenow", String(gfx2SfxDisplayVolume));
      preRunSettingsGfx2SfxBtn.title = C.audioSfxEnabled
        ? "Sound effects volume " + String(gfx2SfxDisplayVolume) + "%"
        : "Sound effects muted";
    }
    if (preRunSettingsGfx2SfxGraphicBtn) {
      var sfxGraphicEnabled = Boolean(C.audioSfxEnabled);
      preRunSettingsGfx2SfxGraphicBtn.setAttribute("aria-pressed", sfxGraphicEnabled ? "true" : "false");
      preRunSettingsGfx2SfxGraphicBtn.setAttribute("aria-label", sfxGraphicEnabled ? "Mute sound effects" : "Unmute sound effects");
      preRunSettingsGfx2SfxGraphicBtn.title = sfxGraphicEnabled ? "Mute sound effects" : "Unmute sound effects";
    }
    if (preRunSettingsGfx2GlobalVolumeBtn) {
      var gfx2GlobalVolume = sanitizeGlobalAdminNumber("audioMasterVolumePercent", C.audioMasterVolumePercent);
      preRunSettingsGfx2GlobalVolumeBtn.value = String(gfx2GlobalVolume);
      preRunSettingsGfx2GlobalVolumeBtn.setAttribute("aria-valuenow", String(gfx2GlobalVolume));
      preRunSettingsGfx2GlobalVolumeBtn.title = "Global volume " + String(gfx2GlobalVolume) + "%";
    }
    if (preRunToggleSfxBtn) {
      var sfxEnabled = Boolean(C.audioSfxEnabled);
      preRunToggleSfxBtn.textContent = sfxEnabled ? "ON" : "OFF";
      preRunToggleSfxBtn.classList.toggle("is-on", sfxEnabled);
      preRunToggleSfxBtn.classList.toggle("is-off", !sfxEnabled);
      preRunToggleSfxBtn.setAttribute("aria-pressed", sfxEnabled ? "true" : "false");
      preRunToggleSfxBtn.setAttribute("aria-label", sfxEnabled ? "Sound effects on" : "Sound effects off");
    }
    if (preRunToggleMusicBtn) {
      var musicEnabled = Boolean(C.audioMusicEnabled);
      preRunToggleMusicBtn.textContent = musicEnabled ? "ON" : "OFF";
      preRunToggleMusicBtn.classList.toggle("is-on", musicEnabled);
      preRunToggleMusicBtn.classList.toggle("is-off", !musicEnabled);
      preRunToggleMusicBtn.setAttribute("aria-pressed", musicEnabled ? "true" : "false");
      preRunToggleMusicBtn.setAttribute("aria-label", musicEnabled ? "Music on" : "Music off");
    }
  }

  function handlePreRunSettingsBackNavigation() {
    if (state.inGameSettingsActive) {
      closeInGameSettings();
      return;
    }
    if (isGfx2StartScreenEnabled()) {
      startPreRunGfx2BackAnimation(PRE_RUN_GFX2_SETTINGS_BACK_FRAMES);
      return;
    }
    playUiPageOpenSound();
    state.preRunStep = "select";
    renderPreRunScreen();
  }

  function openInGameSettings() {
    if (state.gamePauseActive || state.inGameSettingsActive || state.preRunActive || state.levelFinishedActive || isGameOverScreenVisible()) {
      return;
    }

    unlockAudioIfNeeded();
    playUiPageOpenSound();
    state.inGameSettingsPreviousPreRunStep = state.preRunStep;
    state.preRunStep = "settings";
    state.gamePauseActive = true;
    state.inGameSettingsActive = true;
    state.inGameSettingsInputLockUntil = performance.now() + 500;
    setPreRunScreenHidden(false);
    input.left = false;
    input.right = false;
    input.jumpDown = false;
    input.jumpPressed = false;
    renderPreRunScreen();
    renderPreRunSettingsScreen();
    updateGamePauseUiVisibility();
    refreshMusicPlayback();
  }

  function closeInGameSettings() {
    if (!state.inGameSettingsActive) {
      return;
    }

    if (state.inGameSettingsPreviousPreRunStep !== null) {
      state.preRunStep = state.inGameSettingsPreviousPreRunStep;
      state.inGameSettingsPreviousPreRunStep = null;
    }
    state.inGameSettingsActive = false;
    state.gamePauseActive = false;
    state.inGameSettingsInputLockUntil = 0;
    if (!state.preRunActive) {
      setPreRunScreenHidden(true);
    }
    if (preRunSettingsScreenEl) {
      preRunSettingsScreenEl.classList.add("hidden");
      preRunSettingsScreenEl.classList.remove("in-game-pause");
    }
    input.left = false;
    input.right = false;
    input.jumpDown = false;
    input.jumpPressed = false;
    updateGamePauseUiVisibility();
    refreshMusicPlayback();
  }

  function togglePreRunMusicSetting() {
    unlockAudioIfNeeded();
    if (C.audioSfxEnabled) {
      playUiButtonSound();
    }
    if (C.audioMusicEnabled) {
      rememberMusicRestoreVolumePercent(C.audioMusicVolumePercent);
      applyGlobalVolumeSetting("audioMusicVolumePercent", 0);
      applyGlobalAudioSetting("audioMusicEnabled", false);
    } else {
      var musicRestoreVolume = getStoredMusicRestoreVolumePercent();
      if (musicRestoreVolume <= 0) {
        musicRestoreVolume = sanitizeGlobalAdminNumber("audioMusicVolumePercent", C.audioMusicVolumePercent);
      }
      if (musicRestoreVolume <= 0) {
        musicRestoreVolume = 10;
      }
      applyGlobalVolumeSetting("audioMusicVolumePercent", musicRestoreVolume);
      applyGlobalAudioSetting("audioMusicEnabled", true);
    }
    renderPreRunSettingsScreen();
  }

  function togglePreRunSfxSetting() {
    unlockAudioIfNeeded();
    if (C.audioSfxEnabled) {
      playUiButtonSound();
    }
    if (C.audioSfxEnabled) {
      rememberSfxRestoreVolumePercent(C.audioSfxVolumePercent);
      applyGlobalVolumeSetting("audioSfxVolumePercent", 0);
      applyGlobalAudioSetting("audioSfxEnabled", false);
    } else {
      var sfxRestoreVolume = getStoredSfxRestoreVolumePercent();
      if (sfxRestoreVolume <= 0) {
        sfxRestoreVolume = sanitizeGlobalAdminNumber("audioSfxVolumePercent", C.audioSfxVolumePercent);
      }
      if (sfxRestoreVolume <= 0) {
        sfxRestoreVolume = 85;
      }
      applyGlobalVolumeSetting("audioSfxVolumePercent", sfxRestoreVolume);
      applyGlobalAudioSetting("audioSfxEnabled", true);
      if (C.audioSfxEnabled) {
        playUiButtonSound();
      }
    }
    renderPreRunSettingsScreen();
  }

  function openChangeUserConfirm() {
    if (preRunAccountConfirmEl) {
      preRunAccountConfirmEl.classList.remove("hidden");
    }
  }

  function isInGameSettingsInputLocked() {
    return state.inGameSettingsActive && performance.now() < state.inGameSettingsInputLockUntil;
  }

  function suppressInGameSettingsTapDuringCooldown(event) {
    if (!isInGameSettingsInputLocked()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    if (event.stopImmediatePropagation) {
      event.stopImmediatePropagation();
    }
  }

  function closeChangeUserConfirm() {
    if (preRunAccountConfirmEl) {
      preRunAccountConfirmEl.classList.add("hidden");
    }
  }

  function playAudioPath(path, volume, cooldownKey, cooldownMs) {
    var normalizedPath = sanitizeAudioPathValue(path);
    if (!normalizedPath || !canPlaySfx()) {
      return;
    }
    var now = Date.now();
    var key = cooldownKey || normalizedPath;
    var minDelay = Number.isFinite(cooldownMs) ? cooldownMs : 0;
    if (minDelay > 0 && audioState.lastPlayTimes[key] && now - audioState.lastPlayTimes[key] < minDelay) {
      return;
    }
    audioState.lastPlayTimes[key] = now;

    var audioContext = ensureAudioContext();
    refreshSfxOutputGain();
    if (audioContext) {
      var decodedBuffer = audioState.decodedSfxCache[normalizedPath];
      if (decodedBuffer) {
        var sourceNode = audioContext.createBufferSource();
        var gainNode = audioContext.createGain();
        sourceNode.buffer = decodedBuffer;
        gainNode.gain.value = Math.max(0, Math.min(1, Number.isFinite(volume) ? volume : 1));
        sourceNode.connect(gainNode);
        gainNode.connect(audioState.sfxOutputGain || audioContext.destination);
        sourceNode.start(0);
        return;
      }
      preloadDecodedSfx(normalizedPath);
    }

    var baseAudio = getAudioCachedElement(normalizedPath, false);
    if (baseAudio) {
      var audioInstance = baseAudio.cloneNode();
      audioInstance.volume = Math.max(0, Math.min(1, Number.isFinite(volume) ? volume : getSfxAudioVolumeRatio()));
      var playResult = audioInstance.play();
      if (playResult && typeof playResult.catch === "function") {
        playResult.catch(function () {});
      }
    }
  }

  function playUiSound(path, cooldownKey, cooldownMs) {
    playAudioPath(path, getSfxAudioVolumeRatio(), cooldownKey, cooldownMs);
  }

  function playUiButtonSound() {
    playUiSound(getUiButtonSoundPath(), "ui-button", 45);
  }

  function playUiPageOpenSound() {
    playUiSound(getUiPageOpenSoundPath(), "ui-page-open", 100);
  }

  function playUiBadgesPageSound() {
    playUiSound(getUiBadgesPageSoundPath(), "ui-badges-page", 100);
  }

  function playUiBadgeRevealSound() {
    playUiSound(getUiBadgeRevealSoundPath(), "ui-badge-reveal", 80);
  }

  function playLevelSfx(configKey, cooldownMs) {
    playAudioPath(getLevelSfxPath(configKey), getSfxAudioVolumeRatio(), configKey, cooldownMs);
  }
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

  function getLevelFinishedArtPath(level) {
    return LEVEL_FINISHED_ART_PATHS[level] || "";
  }

  function getLevelSceneArtFileName(level, key) {
    if (key === "platform") {
      return "level" + String(level) + "_platform.png";
    }
    if (key === "blocker") {
      return "level" + String(level) + "_blocker.png";
    }
    if (key === "rocket1") {
      return "level" + String(level) + "_rocket01.png";
    }
    if (key === "rocket2") {
      return "level" + String(level) + "_rocket02.png";
    }
    return LEVEL_SCENE_ART_FILENAMES[key];
  }

  function normalizeSkinName(value) {
    for (var i = 0; i < SKIN_OPTIONS.length; i += 1) {
      if (SKIN_OPTIONS[i].value === value) {
        return value;
      }
    }
    return "Skin01";
  }

  var SKIN_REWARD_TROPHY_ART_PATHS = {
    Skin02: "assets/gfx2/trophy_pics/trophy_vexi.png",
    Skin03: "assets/gfx2/trophy_pics/trophy_nemu.png",
    Skin04: "assets/gfx2/trophy_pics/trophy_krob.png",
    Skin05: "assets/gfx2/trophy_pics/trophy_grey.png",
    Skin06: "assets/skins/Skin06/hero-icon.png",
    Skin07: "assets/skins/Skin07/skin07_selected.png"
  };

  function getSkinRewardTrophyArtPath(skinName) {
    var normalized = normalizeSkinName(skinName);
    return SKIN_REWARD_TROPHY_ART_PATHS[normalized] || "";
  }

  function createDefaultSkinProgress() {
      return {
        unlockedSkins: {
          Skin01: true,
          Skin02: false,
          Skin03: false,
          Skin04: false,
          Skin05: false,
          Skin06: false,
          Skin07: false
        },
      selectedSkin: "Skin01",
      highestLevelReached: 1,
      levelXUnlocked: false,
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
      var storageKey = getActiveProfileStorageKey(PLAYER_SKIN_PROGRESS_STORAGE_KEY_PREFIX);
      if (!storageKey) {
        return fallback;
      }
      var raw = window.localStorage.getItem(storageKey);
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
        levelXUnlocked: Boolean(parsed.levelXUnlocked),
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
      var storageKey = getActiveProfileStorageKey(PLAYER_SKIN_PROGRESS_STORAGE_KEY_PREFIX);
      if (!storageKey) {
        return;
      }
      window.localStorage.setItem(storageKey, JSON.stringify({
        unlockedSkins: cloneSkinUnlocks(state.unlockedSkins),
        selectedSkin: normalizeOwnedSkinName(C.selectedSkin),
        highestLevelReached: sanitizeHighestLevelReached(state.highestLevelReached),
        levelXUnlocked: Boolean(state.levelXUnlocked),
        hardModeOverride: state.hardModeOverride === "locked" || state.hardModeOverride === "unlocked"
          ? state.hardModeOverride
          : "default",
        fullModeOverride: state.fullModeOverride === "locked" || state.fullModeOverride === "unlocked"
          ? state.fullModeOverride
          : "default"
      }));
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

  function isLevelXUnlocked() {
    return Boolean(state.levelXUnlocked);
  }

  function syncModernVisualsWithSelectedSkin(skinName) {
    var normalized = normalizeSkinName(skinName || C.selectedSkin);
    var nextModernVisualsEnabled = normalized !== "Skin07";
    C.modernVisualsEnabled = nextModernVisualsEnabled;
    saveGlobalAdminField("modernVisualsEnabled", nextModernVisualsEnabled);
    applyVisualThemeToUi();
    updateLivesUi();
    return nextModernVisualsEnabled;
  }

  function normalizeOwnedSkinName(value) {
    var normalized = normalizeSkinName(value);
    return isSkinUnlocked(normalized) ? normalized : "Skin01";
  }

  function loadPlayerSkinProgress(allowLegacyMigration) {
    var playerId = getActiveProfileStoragePlayerId();
    if (!playerId) {
      badgeStats = createDefaultBadgeStats();
      economyStats = createDefaultEconomyStats();
      var defaultProgress = createDefaultSkinProgress();
      state.unlockedSkins = cloneSkinUnlocks(defaultProgress.unlockedSkins);
      C.selectedSkin = normalizeOwnedSkinName(defaultProgress.selectedSkin);
      syncModernVisualsWithSelectedSkin(C.selectedSkin);
      state.highestLevelReached = sanitizeHighestLevelReached(defaultProgress.highestLevelReached);
      state.levelXUnlocked = Boolean(defaultProgress.levelXUnlocked);
      state.hardModeOverride = defaultProgress.hardModeOverride;
      state.fullModeOverride = defaultProgress.fullModeOverride;
      sessionMaxScore = 0;
      state.badgeStatsDirty = false;
      state.badgeStatsWriteElapsed = 0;
      return;
    }

    if (allowLegacyMigration !== false) {
      migrateLegacyProfileStorageIfNeeded(playerId);
    }

    badgeStats = readBadgeStats();
    economyStats = readEconomyStats();
    migrateEconomyShopProgressFromBadgeHistory();

    var progress = readPlayerSkinProgress();
    state.unlockedSkins = cloneSkinUnlocks(progress.unlockedSkins);
    C.selectedSkin = normalizeOwnedSkinName(progress.selectedSkin);
    syncModernVisualsWithSelectedSkin(C.selectedSkin);
    state.highestLevelReached = sanitizeHighestLevelReached(progress.highestLevelReached);
    state.levelXUnlocked = Boolean(progress.levelXUnlocked);
    state.hardModeOverride = progress.hardModeOverride;
    state.fullModeOverride = progress.fullModeOverride;
    sessionMaxScore = readMaxScoreFromStorage(state.gameMode, state.gameDifficulty);
    writeBadgeStats();
    writeEconomyStats();
    writePlayerSkinProgress();
    state.badgeStatsDirty = false;
    state.badgeStatsWriteElapsed = 0;
  }

  function sanitizeGlobalAdminNumber(key, value) {
    var parsed = Math.floor(Number(value));
    if (!Number.isFinite(parsed)) {
      return C[key];
    }
    if (
      key === "audioMasterVolumePercent" ||
      key === "audioMusicVolumePercent" ||
      key === "audioSfxVolumePercent"
    ) {
      return Math.max(0, Math.min(100, parsed));
    }
    if (key === "hardModeUnlockLevel") {
      return Math.max(1, Math.min(LEVEL_COUNT, parsed));
    }
    if (key === "fullModeUnlockJumpHardScore") {
      return Math.max(0, parsed);
    }
    if (
      key === "shopRewardedAdCoins" ||
      key === "shopContinuePrice1" ||
      key === "shopKrobPrice" ||
      key === "shopSkin05Price" ||
      key === "shopSkin06Price" ||
      key === "shopCubePrice" ||
      key === "shopSpecialLevelPrice" ||
      key === "shopMineShortTimerPrice" ||
      key === "shopMineStorageLevel2Price" ||
      key === "shopMineStorageLevel3Price" ||
      key === "shopMineStorageLevel4Price" ||
      key === "level5ScoreGoal"
    ) {
      return Math.max(0, parsed);
    }
    if (key === "shopScorePerCoin" || key === "shopContinueLivesGranted") {
      return Math.max(1, parsed);
    }
    if (key === "mineCoinTimerMs" || key === "mineShortTimerMs") {
      return Math.max(1000, parsed);
    }
    if (
      key === "mineStorageCapacity" ||
      key === "mineStorageCapacityL2" ||
      key === "mineStorageCapacityL3" ||
      key === "mineStorageCapacityL4"
    ) {
      return Math.max(1, parsed);
    }
    return parsed;
  }

  function getPersistentTotalScore() {
    return Math.max(0, Math.floor((badgeStats && badgeStats.lifetime && badgeStats.lifetime.totalScore) || 0));
  }

  function getCoinWalletBalance() {
    return Math.max(0, Math.floor((economyStats && economyStats.coinsBalance) || 0));
  }

  function getMineStorageCoins() {
    return Math.max(0, Math.floor((economyStats && economyStats.mineStorageCoins) || 0));
  }

  function getMineStorageCapacity() {
    return Math.max(1, Math.floor((economyStats && economyStats.mineStorageCapacity) || 50));
  }

  function getMineBaseIntervalMs() {
    return Math.max(1000, Math.floor(sanitizeGlobalAdminNumber("mineCoinTimerMs", C.mineCoinTimerMs)));
  }

  function getMineShortTimerMs() {
    return Math.max(1000, Math.floor(sanitizeGlobalAdminNumber("mineShortTimerMs", C.mineShortTimerMs)));
  }

  function formatMineShortTimerSecondsLabel(milliseconds) {
    var safeMs = Math.max(1000, Math.floor(Number(milliseconds) || 0));
    return Math.max(1, Math.floor(safeMs / 1000)).toLocaleString("en-US");
  }

  function isMineShortTimerUnlocked() {
    return Boolean(economyStats && economyStats.mineShortTimerUnlocked);
  }

  function getMineIntervalMs() {
    return isMineShortTimerUnlocked() ? getMineShortTimerMs() : getMineBaseIntervalMs();
  }

  function getMineNextCoinAt() {
    return Math.max(0, Math.floor((economyStats && economyStats.mineNextCoinAt) || 0));
  }

  function getMineFrozenRemainingMs() {
    return Math.max(0, Math.floor((economyStats && economyStats.mineFrozenRemainingMs) || 0));
  }

  function isMineUnlocked() {
    return !economyStats || typeof economyStats.mineUnlocked !== "boolean" ? true : Boolean(economyStats.mineUnlocked);
  }

  function getMineStorageCapacityForLevel(level) {
    var safeLevel = Math.max(1, Math.min(4, Math.floor(Number(level) || 1)));
    if (safeLevel === 2) {
      return sanitizeGlobalAdminNumber("mineStorageCapacityL2", C.mineStorageCapacityL2);
    }
    if (safeLevel === 3) {
      return sanitizeGlobalAdminNumber("mineStorageCapacityL3", C.mineStorageCapacityL3);
    }
    if (safeLevel === 4) {
      return sanitizeGlobalAdminNumber("mineStorageCapacityL4", C.mineStorageCapacityL4);
    }
    return sanitizeGlobalAdminNumber("mineStorageCapacity", C.mineStorageCapacity);
  }

  function getMineStorageUpgradeAdWatchCountForLevel(level) {
    var safeLevel = Math.max(1, Math.min(4, Math.floor(Number(level) || 1)));
    if (safeLevel === 2) {
      return sanitizeGlobalAdminNumber("shopMineStorageLevel2Price", C.shopMineStorageLevel2Price);
    }
    if (safeLevel === 3) {
      return sanitizeGlobalAdminNumber("shopMineStorageLevel3Price", C.shopMineStorageLevel3Price);
    }
    if (safeLevel === 4) {
      return sanitizeGlobalAdminNumber("shopMineStorageLevel4Price", C.shopMineStorageLevel4Price);
    }
    return 0;
  }

  function getMineStorageUpgradeLevel() {
    var storedLevel = Math.floor(Number(economyStats && economyStats.mineStorageUpgradeLevel) || 1);
    if (storedLevel >= 1 && storedLevel <= 4) {
      return storedLevel;
    }
    var currentCapacity = getMineStorageCapacity();
    if (currentCapacity >= getMineStorageCapacityForLevel(4)) {
      return 4;
    }
    if (currentCapacity >= getMineStorageCapacityForLevel(3)) {
      return 3;
    }
    if (currentCapacity >= getMineStorageCapacityForLevel(2)) {
      return 2;
    }
    return 1;
  }

  function getMineStorageUpgradeMeta() {
    var currentLevel = getMineStorageUpgradeLevel();
    var maxLevel = 4;
    var isMaxed = currentLevel >= maxLevel;
    var nextLevel = isMaxed ? maxLevel : currentLevel + 1;
    var nextCapacity = getMineStorageCapacityForLevel(nextLevel);
    var nextAdWatchCount = isMaxed ? 0 : getMineStorageUpgradeAdWatchCountForLevel(nextLevel);
    return {
      currentLevel: currentLevel,
      nextLevel: nextLevel,
      nextCapacity: nextCapacity,
      nextAdWatchCount: nextAdWatchCount,
      isMaxed: isMaxed
    };
  }

  function getMineStorageAdWatches() {
    return Math.max(0, Math.floor((economyStats && economyStats.mineStorageAdWatches) || 0));
  }

  function setMineStorageAdWatches(count) {
    economyStats.mineStorageAdWatches = Math.max(0, Math.floor(Number(count) || 0));
    writeEconomyStats();
    return economyStats.mineStorageAdWatches;
  }

  function getPendingRunCoinSpend() {
    return Math.max(0, Math.floor((state && state.pendingRunCoinSpend) || 0));
  }

  function getWalletBalanceAfterRunPreview() {
    return Math.max(0, getCoinWalletBalance() + state.collectedCoins - getPendingRunCoinSpend());
  }

  function getContinueMaxPurchasableLives() {
    return Math.max(1, Math.floor(Number(state.maxLives) || sanitizeConfigValue("livesCount", C.livesCount) || 1));
  }

  function getContinueCoinPrice() {
    return sanitizeGlobalAdminNumber("shopContinuePrice1", C.shopContinuePrice1);
  }

  function getContinueLivesGranted() {
    return sanitizeGlobalAdminNumber("shopContinueLivesGranted", C.shopContinueLivesGranted);
  }

  function addCoinsToWallet(amount) {
    var safeAmount = Math.max(0, Math.floor(Number(amount) || 0));
    if (safeAmount <= 0) {
      return 0;
    }
    economyStats.coinsBalance = getCoinWalletBalance() + safeAmount;
    economyStats.totalCoinsEarned = Math.max(0, Math.floor(Number(economyStats.totalCoinsEarned) || 0) + safeAmount);
    writeEconomyStats();
    return safeAmount;
  }

  function spendCoinsFromWallet(amount) {
    var safeAmount = Math.max(0, Math.floor(Number(amount) || 0));
    if (safeAmount <= 0 || getCoinWalletBalance() < safeAmount) {
      return false;
    }
    economyStats.coinsBalance = getCoinWalletBalance() - safeAmount;
    economyStats.totalCoinsSpent = Math.max(0, Math.floor(Number(economyStats.totalCoinsSpent) || 0) + safeAmount);
    writeEconomyStats();
    return true;
  }

  function spendCoinsForContinueOffer(amount) {
    var safeAmount = Math.max(0, Math.floor(Number(amount) || 0));
    if (safeAmount <= 0) {
      return false;
    }
    if (state.runFinalized) {
      return spendCoinsFromWallet(safeAmount);
    }
    if (getWalletBalanceAfterRunPreview() < safeAmount) {
      return false;
    }
    var walletDeduction = Math.min(getCoinWalletBalance(), safeAmount);
    var pendingDeduction = safeAmount - walletDeduction;
    economyStats.coinsBalance = getCoinWalletBalance() - walletDeduction;
    economyStats.totalCoinsSpent = Math.max(
      0,
      Math.floor(Number(economyStats.totalCoinsSpent) || 0) + safeAmount
    );
    state.pendingRunCoinSpend = getPendingRunCoinSpend() + pendingDeduction;
    writeEconomyStats();
    return true;
  }

  function ensureMineEconomyState(now) {
    var changed = false;
    var safeNow = Number.isFinite(now) ? Math.max(0, Math.floor(now)) : Date.now();
    var intervalMs = getMineIntervalMs();
    var storageCapacity = getMineStorageCapacity();

    if (!Number.isFinite(economyStats.mineStorageCoins)) {
      economyStats.mineStorageCoins = 0;
      changed = true;
    }
    if (!Number.isFinite(economyStats.mineStorageCapacity) || economyStats.mineStorageCapacity < 1) {
      economyStats.mineStorageCapacity = storageCapacity;
      changed = true;
    }
    var expectedStorageCapacity = getMineStorageCapacityForLevel(getMineStorageUpgradeLevel());
    if (economyStats.mineStorageCapacity !== expectedStorageCapacity) {
      economyStats.mineStorageCapacity = expectedStorageCapacity;
      changed = true;
    }
    if (!Number.isFinite(economyStats.mineMineIntervalMs) || economyStats.mineMineIntervalMs < 1000 || economyStats.mineMineIntervalMs !== intervalMs) {
      economyStats.mineMineIntervalMs = intervalMs;
      if (economyStats.mineNextCoinAt > 0) {
        economyStats.mineNextCoinAt = Math.min(economyStats.mineNextCoinAt, safeNow + intervalMs);
      }
      if (economyStats.mineFrozenRemainingMs > 0) {
        economyStats.mineFrozenRemainingMs = Math.min(economyStats.mineFrozenRemainingMs, intervalMs);
      }
      changed = true;
    }
    if (!Number.isFinite(economyStats.mineNextCoinAt) || economyStats.mineNextCoinAt < 0) {
      economyStats.mineNextCoinAt = 0;
      changed = true;
    }
    if (!Number.isFinite(economyStats.mineFrozenRemainingMs) || economyStats.mineFrozenRemainingMs < 0) {
      economyStats.mineFrozenRemainingMs = 0;
      changed = true;
    }
    if (typeof economyStats.mineUnlocked !== "boolean") {
      economyStats.mineUnlocked = true;
      changed = true;
    }
    if (typeof economyStats.mineShortTimerUnlocked !== "boolean") {
      economyStats.mineShortTimerUnlocked = false;
      changed = true;
    }

    if (!isMineUnlocked()) {
      syncMineStorageReminder(0);
      if (changed) {
        writeEconomyStats();
      }
      return {
        minedCoins: 0,
        becameFull: false,
        isFull: false,
        nextCoinInMs: 0
      };
    }

    var minedCoins = 0;
    var becameFull = false;
    if (economyStats.mineStorageCoins >= storageCapacity) {
      if (economyStats.mineFrozenRemainingMs <= 0 && economyStats.mineNextCoinAt > 0) {
        economyStats.mineFrozenRemainingMs = Math.max(0, economyStats.mineNextCoinAt - safeNow);
        economyStats.mineNextCoinAt = 0;
        changed = true;
      }
      if (changed) {
        writeEconomyStats();
      }
      return {
        minedCoins: 0,
        becameFull: false,
        isFull: true,
        nextCoinInMs: economyStats.mineFrozenRemainingMs
      };
    }

    if (economyStats.mineNextCoinAt <= 0) {
      var frozenDelay = getMineFrozenRemainingMs();
      economyStats.mineNextCoinAt = safeNow + (frozenDelay > 0 ? frozenDelay : intervalMs);
      economyStats.mineFrozenRemainingMs = 0;
      changed = true;
    }

    while (economyStats.mineStorageCoins < storageCapacity && economyStats.mineNextCoinAt > 0 && safeNow >= economyStats.mineNextCoinAt) {
      economyStats.mineStorageCoins += 1;
      minedCoins += 1;
      economyStats.mineNextCoinAt += intervalMs;
      changed = true;
      if (economyStats.mineStorageCoins >= storageCapacity) {
        economyStats.mineFrozenRemainingMs = Math.max(0, economyStats.mineNextCoinAt - safeNow);
        economyStats.mineNextCoinAt = 0;
        becameFull = true;
        break;
      }
    }

    if (changed) {
      writeEconomyStats();
    }

    return {
      minedCoins: minedCoins,
      becameFull: becameFull,
      isFull: false,
      nextCoinInMs: Math.max(0, getMineNextCoinAt() - safeNow)
    };
  }

  function transferMineStorageToWallet() {
    var transferAmount = getMineStorageCoins();
    if (transferAmount <= 0) {
      return 0;
    }
    var now = Date.now();
    var intervalMs = getMineIntervalMs();
    var nextAt = getMineNextCoinAt();
    var resumeDelay = getMineFrozenRemainingMs();
    if (resumeDelay <= 0 && nextAt > 0) {
      resumeDelay = Math.max(0, nextAt - now);
    }
    economyStats.coinsBalance = getCoinWalletBalance() + transferAmount;
    economyStats.totalCoinsEarned = Math.max(0, Math.floor(Number(economyStats.totalCoinsEarned) || 0) + transferAmount);
    economyStats.mineStorageCoins = 0;
    economyStats.mineFrozenRemainingMs = 0;
    economyStats.mineNextCoinAt = now + (resumeDelay > 0 ? resumeDelay : intervalMs);
    writeEconomyStats();
    syncMineStorageReminderFromCurrentState();
    return transferAmount;
  }

  function formatMineCountdown(millisecondsLeft) {
    var safeMs = Math.max(0, Math.floor(Number(millisecondsLeft) || 0));
    var totalSeconds = Math.ceil(safeMs / 1000);
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    return String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
  }

  function exchangePersistentScoreForCoins(coinCount) {
    var safeCoinCount = Math.max(0, Math.floor(Number(coinCount) || 0));
    var scorePerCoin = sanitizeGlobalAdminNumber("shopScorePerCoin", C.shopScorePerCoin);
    var totalScoreCost = safeCoinCount * scorePerCoin;
    if (safeCoinCount <= 0 || totalScoreCost <= 0 || getPersistentTotalScore() < totalScoreCost) {
      return false;
    }
    badgeStats.lifetime.totalScore = Math.max(0, getPersistentTotalScore() - totalScoreCost);
    incrementBadgeLifetimeStat("exchangedCoins", safeCoinCount);
    addCoinsToWallet(safeCoinCount);
    economyStats.buy10CoinsPurchasedOnce = true;
    writeBadgeStats();
    writeEconomyStats();
    return true;
  }

  function finalizeCompletedRun() {
    if (state.runFinalized) {
      return;
    }
    incrementBadgeLifetimeStat("totalScore", state.score);
    addCoinsToWallet(Math.max(0, state.collectedCoins - getPendingRunCoinSpend()));
    updateBadgeBestStat("singleRunScore", state.score);
    updateSurvivorBadgeProgressForCurrentRun();
    updatePuristBadgeProgressForCurrentRun();
    flushBadgeStatsStorage(true, 0);
    state.runFinalized = true;
    renderAdminForm();
  }

  function getContinueAdUsesRemaining() {
    return Math.max(0, 2 - Math.max(0, Math.floor(Number(state.continueAdUsesThisRun) || 0)));
  }

  function hasFirstContinueOpportunityForCurrentRun() {
    return state.continueUsesThisRun < 1 && state.continueAdUsesThisRun < 1 && getContinueCoinPrice() > 0;
  }

  function canUseContinueAdForCurrentRun() {
    return !state.runFinalized && getContinueAdUsesRemaining() > 0;
  }

  function shouldShowContinueForCurrentRun() {
    return !state.runFinalized && (hasFirstContinueOpportunityForCurrentRun() || canUseContinueAdForCurrentRun());
  }

  function canBuyContinueForCurrentRun() {
    return hasFirstContinueOpportunityForCurrentRun() && getWalletBalanceAfterRunPreview() >= getContinueCoinPrice();
  }

  function canReturnToPreRunFromGameOver() {
    return !state.continueOfferActive && !state.continuePurchaseOverlayActive && !state.continueAdWatchActive;
  }

  function getSelectedContinueLifeTotalPrice() {
    return Math.max(0, state.continuePurchaseSelectedLives * getContinueCoinPrice());
  }

  function closeContinuePurchaseOverlay() {
    state.continuePurchaseOverlayActive = false;
    state.continuePurchaseSelectedLives = 0;
    if (continuePurchaseOverlayEl) {
      continuePurchaseOverlayEl.classList.add("hidden");
    }
  }

  function renderContinuePurchaseOverlay() {
    if (!continuePurchaseOverlayEl) {
      return;
    }
    var lifePrice = getContinueCoinPrice();
    var selectedLives = Math.max(0, Math.floor(Number(state.continuePurchaseSelectedLives) || 0));
    var maxLives = getContinueMaxPurchasableLives();
    var walletAfterRun = getWalletBalanceAfterRunPreview();
    var totalPrice = selectedLives * lifePrice;
    var canAffordSelection = selectedLives > 0 && walletAfterRun >= totalPrice;

    continuePurchaseOverlayEl.classList.toggle("hidden", !state.continuePurchaseOverlayActive);
    if (continuePurchaseUnitPriceEl) {
      continuePurchaseUnitPriceEl.textContent =
        "1 life costs " + lifePrice.toLocaleString("en-US") + " coins.";
    }
    if (continuePurchaseWalletEl) {
      continuePurchaseWalletEl.textContent =
        "Wallet available: " + walletAfterRun.toLocaleString("en-US") + " coins";
    }
    if (continuePurchaseHeartsEl) {
      continuePurchaseHeartsEl.innerHTML = "";
      for (var lifeIndex = 1; lifeIndex <= maxLives; lifeIndex += 1) {
        var heartBtn = document.createElement("button");
        heartBtn.type = "button";
        heartBtn.className =
          "continue-life-heart" + (selectedLives >= lifeIndex ? " selected" : "");
        heartBtn.textContent = "\u2665";
        heartBtn.setAttribute("aria-label", "Buy " + lifeIndex + " " + (lifeIndex === 1 ? "life" : "lives"));
        heartBtn.addEventListener("click", (function (count) {
          return function (event) {
            event.preventDefault();
            event.stopPropagation();
            unlockAudioIfNeeded();
            playUiButtonSound();
            if (selectedLives >= count) {
              state.continuePurchaseSelectedLives = Math.max(0, count - 1);
            } else {
              state.continuePurchaseSelectedLives = count;
            }
            renderContinuePurchaseOverlay();
          };
        })(lifeIndex));
        continuePurchaseHeartsEl.appendChild(heartBtn);
      }
    }
    if (continuePurchaseTotalEl) {
      continuePurchaseTotalEl.textContent =
        selectedLives > 0
          ? "Total price: " + totalPrice.toLocaleString("en-US") + " coins"
          : "Total price: -";
    }
    if (continuePurchaseStatusEl) {
      if (selectedLives <= 0) {
        continuePurchaseStatusEl.textContent = "Select how many lives to buy.";
      } else if (!canAffordSelection) {
        continuePurchaseStatusEl.textContent =
          "You do not have enough coins for " +
          selectedLives.toLocaleString("en-US") +
          " " +
          (selectedLives === 1 ? "life." : "lives.");
      } else {
        continuePurchaseStatusEl.textContent =
          "Wallet after purchase: " + (walletAfterRun - totalPrice).toLocaleString("en-US");
      }
    }
    if (continuePurchaseBuyBtn) {
      continuePurchaseBuyBtn.textContent =
        selectedLives > 0
          ? "Buy - " + totalPrice.toLocaleString("en-US") + " Coins"
          : "Buy";
      continuePurchaseBuyBtn.disabled = !canAffordSelection;
    }
  }

  function openContinuePurchaseOverlay() {
    if (!state.continueOfferActive || !canBuyContinueForCurrentRun()) {
      return;
    }
    state.continuePurchaseSelectedLives = 0;
    state.continuePurchaseOverlayActive = true;
    renderContinuePurchaseOverlay();
  }

  function getContinueAdRewardLives() {
    return state.gameDifficulty === "hard" ? 2 : 3;
  }

  function clearContinueAdWatchTimer() {
    if (state.continueAdWatchTimerId) {
      window.clearInterval(state.continueAdWatchTimerId);
      state.continueAdWatchTimerId = 0;
    }
  }

  function finishContinueAdWatch(rewarded) {
    clearContinueAdWatchTimer();
    state.continueAdWatchActive = false;
    state.continueAdWatchMode = "";
    state.continueAdWatchSecondsLeft = 0;

    if (!rewarded) {
      state.continueOfferActive = shouldShowContinueForCurrentRun();
      updateGameOverSummary();
      return;
    }

    incrementBadgeLifetimeStat("continuesUsed", 1);
    renderAdminForm();
    revivePlayerAfterContinue(getContinueAdRewardLives(), "ad");
  }

  function updateContinueAdCountdown() {
    if (!state.continueAdWatchActive || state.continueAdWatchMode !== "fake") {
      return;
    }

    state.continueAdWatchSecondsLeft = Math.max(0, state.continueAdWatchSecondsLeft - 1);
    if (state.continueAdWatchSecondsLeft <= 0) {
      finishContinueAdWatch(true);
      return;
    }
    updateGameOverSummary(true);
  }

  function startFakeContinueAdWatch() {
    clearContinueAdWatchTimer();
    state.continueAdWatchActive = true;
    state.continueAdWatchMode = "fake";
    state.continueAdWatchSecondsLeft = 5;
    state.continueOfferActive = false;
    updateGameOverSummary();
    state.continueAdWatchTimerId = window.setInterval(updateContinueAdCountdown, 1000);
  }

  function handleContinueAdWatchFailure(message) {
    clearContinueAdWatchTimer();
    state.continueAdWatchActive = false;
    state.continueAdWatchMode = "";
    state.continueAdWatchSecondsLeft = 0;
    state.continueOfferActive = shouldShowContinueForCurrentRun();
    updateGameOverSummary();
  }

  function startNativeContinueAdWatch() {
    var plugin =
      window.Capacitor &&
      window.Capacitor.Plugins &&
      window.Capacitor.Plugins.RewardedContinue &&
      typeof window.Capacitor.Plugins.RewardedContinue.show === "function"
        ? window.Capacitor.Plugins.RewardedContinue
        : null;

    if (!plugin) {
      handleContinueAdWatchFailure("Rewarded ads are unavailable on this device.");
      return;
    }

    state.continueAdWatchActive = true;
    state.continueAdWatchMode = "android";
    state.continueAdWatchSecondsLeft = 0;
    state.continueOfferActive = false;
    updateGameOverSummary();

    plugin
      .show()
      .then(function (result) {
        if (!result || result.rewarded !== true) {
          handleContinueAdWatchFailure("Rewarded ad was not completed.");
          return;
        }
        finishContinueAdWatch(true);
      })
      .catch(function (error) {
        handleContinueAdWatchFailure(error && error.message ? error.message : "Rewarded ad failed.");
      });
  }

  function startContinueAdWatch() {
    if (!state.continueOfferActive || !canUseContinueAdForCurrentRun() || state.continueAdWatchActive) {
      return;
    }

    if (isNativeAndroidPlatform()) {
      startNativeContinueAdWatch();
      return;
    }
    startFakeContinueAdWatch();
  }

  function clearShopStorageAdWatchTimer() {
    if (state.preRunGfx2ShopStorageAdWatchTimerId) {
      window.clearInterval(state.preRunGfx2ShopStorageAdWatchTimerId);
      state.preRunGfx2ShopStorageAdWatchTimerId = 0;
    }
  }

  function finishShopStorageAdWatch(rewarded) {
    clearShopStorageAdWatchTimer();
    state.preRunGfx2ShopStorageAdWatchActive = false;
    state.preRunGfx2ShopStorageAdWatchMode = "";
    state.preRunGfx2ShopStorageAdWatchSecondsLeft = 0;

    if (!rewarded) {
      state.preRunGfx2ShopStatus = "Rewarded ad was not completed.";
      state.preRunGfx2ShopStatusTone = "error";
      renderPreRunShopScreen();
      return;
    }

    var storageMeta = getMineStorageUpgradeMeta();
    var storageProgress = setMineStorageAdWatches(getMineStorageAdWatches() + 1);
    state.preRunGfx2ShopStatusTone = "success";
    if (storageMeta.isMaxed) {
      state.preRunGfx2ShopStatus = "Storage capacity is already fully upgraded.";
    } else if (storageProgress >= storageMeta.nextAdWatchCount) {
      state.preRunGfx2ShopStatus = "Storage upgrade unlocked. Press Buy to purchase it.";
    } else {
      state.preRunGfx2ShopStatus =
        "Ad watch progress: " +
        storageProgress.toLocaleString("en-US") +
        " / " +
        storageMeta.nextAdWatchCount.toLocaleString("en-US") +
        ".";
    }
    renderPreRunShopScreen();
  }

  function updateShopStorageAdCountdown() {
    if (!state.preRunGfx2ShopStorageAdWatchActive || state.preRunGfx2ShopStorageAdWatchMode !== "fake") {
      return;
    }

    state.preRunGfx2ShopStorageAdWatchSecondsLeft = Math.max(0, state.preRunGfx2ShopStorageAdWatchSecondsLeft - 1);
    if (state.preRunGfx2ShopStorageAdWatchSecondsLeft <= 0) {
      finishShopStorageAdWatch(true);
      return;
    }
    state.preRunGfx2ShopStatus =
      "Watching ad... " + Math.max(0, state.preRunGfx2ShopStorageAdWatchSecondsLeft).toLocaleString("en-US") + "s left.";
    state.preRunGfx2ShopStatusTone = "info";
    renderPreRunShopScreen();
  }

  function startFakeShopStorageAdWatch() {
    clearShopStorageAdWatchTimer();
    state.preRunGfx2ShopStorageAdWatchActive = true;
    state.preRunGfx2ShopStorageAdWatchMode = "fake";
    state.preRunGfx2ShopStorageAdWatchSecondsLeft = 5;
    state.preRunGfx2ShopStatus = "Watching ad... 5s left.";
    state.preRunGfx2ShopStatusTone = "info";
    renderPreRunShopScreen();
    state.preRunGfx2ShopStorageAdWatchTimerId = window.setInterval(updateShopStorageAdCountdown, 1000);
  }

  function handleShopStorageAdWatchFailure(message) {
    clearShopStorageAdWatchTimer();
    state.preRunGfx2ShopStorageAdWatchActive = false;
    state.preRunGfx2ShopStorageAdWatchMode = "";
    state.preRunGfx2ShopStorageAdWatchSecondsLeft = 0;
    state.preRunGfx2ShopStatus = message || "Rewarded ad failed.";
    state.preRunGfx2ShopStatusTone = "error";
    renderPreRunShopScreen();
  }

  function startNativeShopStorageAdWatch() {
    var plugin =
      window.Capacitor &&
      window.Capacitor.Plugins &&
      window.Capacitor.Plugins.RewardedContinue &&
      typeof window.Capacitor.Plugins.RewardedContinue.show === "function"
        ? window.Capacitor.Plugins.RewardedContinue
        : null;

    if (!plugin) {
      handleShopStorageAdWatchFailure("Rewarded ads are unavailable on this device.");
      return;
    }

    state.preRunGfx2ShopStorageAdWatchActive = true;
    state.preRunGfx2ShopStorageAdWatchMode = "android";
    state.preRunGfx2ShopStorageAdWatchSecondsLeft = 0;
    state.preRunGfx2ShopStatus = "Loading rewarded ad...";
    state.preRunGfx2ShopStatusTone = "info";
    renderPreRunShopScreen();

    plugin
      .show()
      .then(function (result) {
        if (!result || result.rewarded !== true) {
          handleShopStorageAdWatchFailure("Rewarded ad was not completed.");
          return;
        }
        finishShopStorageAdWatch(true);
      })
      .catch(function (error) {
        handleShopStorageAdWatchFailure(error && error.message ? error.message : "Rewarded ad failed.");
      });
  }

  function startShopStorageAdWatch() {
    if (state.preRunGfx2ShopStorageAdWatchActive) {
      return;
    }
    if (isNativeAndroidPlatform()) {
      startNativeShopStorageAdWatch();
      return;
    }
    startFakeShopStorageAdWatch();
  }

  function clearMineTransferAdWatchTimer() {
    if (state.mineTransferAdWatchTimerId) {
      window.clearInterval(state.mineTransferAdWatchTimerId);
      state.mineTransferAdWatchTimerId = 0;
    }
  }

  function finishMineTransferAdWatch(rewarded) {
    clearMineTransferAdWatchTimer();
    state.mineTransferAdWatchActive = false;
    state.mineTransferAdWatchMode = "";
    state.mineTransferAdWatchSecondsLeft = 0;

    if (!rewarded) {
      setMineMessage("Rewarded ad was not completed.", "error", 3600, "05");
      renderPreRunScreen();
      return;
    }

    handleMineTransfer(true);
  }

  function updateMineTransferAdCountdown() {
    if (!state.mineTransferAdWatchActive || state.mineTransferAdWatchMode !== "fake") {
      return;
    }

    state.mineTransferAdWatchSecondsLeft = Math.max(0, state.mineTransferAdWatchSecondsLeft - 1);
    if (state.mineTransferAdWatchSecondsLeft <= 0) {
      finishMineTransferAdWatch(true);
      return;
    }

    setMineMessage(
      "Watching ad... " + Math.max(0, state.mineTransferAdWatchSecondsLeft).toLocaleString("en-US") + "s left.",
      "info",
      1200,
      "06"
    );
    renderPreRunScreen();
  }

  function startFakeMineTransferAdWatch() {
    clearMineTransferAdWatchTimer();
    state.mineTransferAdWatchActive = true;
    state.mineTransferAdWatchMode = "fake";
    state.mineTransferAdWatchSecondsLeft = 5;
    setMineMessage("Watching ad... 5s left.", "info", 1200, "06");
    renderPreRunScreen();
    state.mineTransferAdWatchTimerId = window.setInterval(updateMineTransferAdCountdown, 1000);
  }

  function handleMineTransferAdWatchFailure(message) {
    clearMineTransferAdWatchTimer();
    state.mineTransferAdWatchActive = false;
    state.mineTransferAdWatchMode = "";
    state.mineTransferAdWatchSecondsLeft = 0;
    setMineMessage(message || "Rewarded ad failed.", "error", 3600, "05");
    renderPreRunScreen();
  }

  function startNativeMineTransferAdWatch() {
    var plugin =
      window.Capacitor &&
      window.Capacitor.Plugins &&
      window.Capacitor.Plugins.RewardedContinue &&
      typeof window.Capacitor.Plugins.RewardedContinue.show === "function"
        ? window.Capacitor.Plugins.RewardedContinue
        : null;

    if (!plugin) {
      handleMineTransferAdWatchFailure("Rewarded ads are unavailable on this device.");
      return;
    }

    state.mineTransferAdWatchActive = true;
    state.mineTransferAdWatchMode = "android";
    state.mineTransferAdWatchSecondsLeft = 0;
    setMineMessage("Loading rewarded ad...", "info", 1200, "06");
    renderPreRunScreen();

    plugin
      .show()
      .then(function (result) {
        if (!result || result.rewarded !== true) {
          handleMineTransferAdWatchFailure("Rewarded ad was not completed.");
          return;
        }
        finishMineTransferAdWatch(true);
      })
      .catch(function (error) {
        handleMineTransferAdWatchFailure(error && error.message ? error.message : "Rewarded ad failed.");
      });
  }

  function startMineTransferAdWatch() {
    if (state.mineTransferAdWatchActive) {
      return;
    }
    if (isNativeAndroidPlatform()) {
      startNativeMineTransferAdWatch();
      return;
    }
    startFakeMineTransferAdWatch();
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
    return "Locked - Reach " + getFullModeUnlockJumpHardScore().toLocaleString("en-US") + " score in Jump Classic Hard.";
  }

  function normalizeUnlockedPreRunSelection() {
    if (!isFullModeUnlocked() && state.gameMode === 1) {
      state.gameMode = 2;
    }
    if (!isHardDifficultyUnlocked() && state.gameDifficulty === "hard") {
      state.gameDifficulty = "easy";
    }
  }

  function getStartScreenStyle() {
    return "gfx2";
  }

  function isGfx2StartScreenEnabled() {
    return true;
  }

  function loadPreRunGfx2Frame(src) {
    var existing = preRunGfx2FrameCache[src];
    if (existing && existing.promise) {
      return existing.promise;
    }

    var entry = {
      image: null,
      loaded: false,
      promise: null
    };
    var fallbackSrc = src.slice(-4) === ".PNG"
      ? src.slice(0, -4) + ".png"
      : src.slice(-4) === ".png"
        ? src.slice(0, -4) + ".PNG"
        : "";
    var triedFallback = false;

    function finalizeLoad(image, resolve) {
      var decodePromise = typeof image.decode === "function"
        ? image.decode().catch(function () {})
        : Promise.resolve();
      decodePromise.finally(function () {
        entry.image = image;
        entry.loaded = image.naturalWidth > 0 && image.naturalHeight > 0;
        resolve(entry);
      });
    }

    function finalizeFailure(resolve) {
      if (!triedFallback && fallbackSrc && fallbackSrc !== src) {
        triedFallback = true;
        image.src = fallbackSrc;
        return;
      }
      entry.loaded = false;
      resolve(entry);
    }

    var image = new Image();
    image.decoding = "async";

    entry.promise = new Promise(function (resolve) {
      image.addEventListener("load", function () {
        finalizeLoad(image, resolve);
      }, { once: true });
      image.addEventListener("error", function () {
        finalizeFailure(resolve);
      }, { once: true });
      image.src = src;
      if (image.complete && image.naturalWidth > 0) {
        finalizeLoad(image, resolve);
      }
    });

    preRunGfx2FrameCache[src] = entry;
    if (fallbackSrc) {
      preRunGfx2FrameCache[fallbackSrc] = entry;
    }
    return entry.promise;
  }

  function preloadPreRunGfx2EntranceFrames() {
    if (!preRunGfx2PreloadPromise) {
      preRunGfx2PreloadPromise = Promise.all(PRE_RUN_GFX2_ALL_FRAMES.map(loadPreRunGfx2Frame));
    }
    return preRunGfx2PreloadPromise;
  }

  function primePreRunGfx2CloudMotion(forceReset) {
    if (!preRunGfx2SceneEl || !PRE_RUN_GFX2_CLOUD_MOTION_CONFIGS.length) {
      return;
    }

    var sceneRect = preRunGfx2SceneEl.getBoundingClientRect();
    if (!sceneRect.width || !sceneRect.height) {
      return;
    }

    var shouldPrimeProgress = forceReset || !preRunGfx2CloudMotionReady;
    for (var i = 0; i < PRE_RUN_GFX2_CLOUD_MOTION_CONFIGS.length; i += 1) {
      var cloud = PRE_RUN_GFX2_CLOUD_MOTION_CONFIGS[i];
      if (!cloud.el) {
        continue;
      }

      var rect = cloud.el.getBoundingClientRect();
      var style = window.getComputedStyle(cloud.el);
      var cloudWidth = rect.width || parseFloat(style.width) || 0;
      var cloudHeight = rect.height || parseFloat(style.height) || 0;
      var baseLeft = parseFloat(style.left);
      if (!Number.isFinite(baseLeft)) {
        var baseRight = parseFloat(style.right);
        if (Number.isFinite(baseRight)) {
          baseLeft = sceneRect.width - baseRight - cloudWidth;
        } else {
          baseLeft = rect.left - sceneRect.left;
        }
      }
      var baseTop = parseFloat(style.top);
      if (!Number.isFinite(baseTop)) {
        baseTop = rect.top - sceneRect.top;
      }

      cloud.sceneWidth = sceneRect.width;
      cloud.sceneHeight = sceneRect.height;
      cloud.width = cloudWidth;
      cloud.height = cloudHeight;
      cloud.baseLeft = baseLeft;
      cloud.baseTop = baseTop;
      cloud.speed = Math.max(0, Number(cloud.baseSpeed) || 0) * Math.max(0, Number(cloud.speedFactor) || 0);
      cloud.travelMargin = Math.max(56, sceneRect.width * 0.08);
      cloud.travelDistance = sceneRect.width + cloudWidth + cloud.travelMargin * 2;
      cloud.startX = -cloudWidth - cloud.travelMargin;
      cloud.endX = sceneRect.width + cloud.travelMargin;

      if (shouldPrimeProgress) {
        var currentX = rect.left - sceneRect.left;
        cloud.x = Number.isFinite(currentX) ? currentX : cloud.startX + cloud.initialProgress * cloud.travelDistance;
      } else if (!Number.isFinite(cloud.x)) {
        cloud.x = cloud.startX + cloud.initialProgress * cloud.travelDistance;
      }

      cloud.x = Math.max(cloud.startX, Math.min(cloud.endX, cloud.x));
    }

    preRunGfx2CloudMotionReady = true;
  }

  function updatePreRunGfx2CloudMotion(dt) {
    if (!state.preRunActive || state.adminPaused || !isGfx2StartScreenEnabled()) {
      return;
    }
    if (!preRunSelectGfx2El || preRunSelectGfx2El.classList.contains("hidden")) {
      return;
    }
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (var resetIndex = 0; resetIndex < PRE_RUN_GFX2_CLOUD_MOTION_CONFIGS.length; resetIndex += 1) {
        if (PRE_RUN_GFX2_CLOUD_MOTION_CONFIGS[resetIndex].el) {
          PRE_RUN_GFX2_CLOUD_MOTION_CONFIGS[resetIndex].el.style.transform = "";
        }
      }
      return;
    }

    primePreRunGfx2CloudMotion(false);

    for (var i = 0; i < PRE_RUN_GFX2_CLOUD_MOTION_CONFIGS.length; i += 1) {
      var cloud = PRE_RUN_GFX2_CLOUD_MOTION_CONFIGS[i];
      if (!cloud.el || !cloud.travelDistance || !cloud.travelMargin) {
        continue;
      }

      if (!Number.isFinite(cloud.x)) {
        cloud.x = cloud.startX + cloud.initialProgress * cloud.travelDistance;
      }

      cloud.x += cloud.speed * dt;
      if (cloud.x > cloud.endX) {
        cloud.x = cloud.startX + (cloud.x - cloud.endX);
      } else if (cloud.x < cloud.startX) {
        cloud.x = cloud.endX - (cloud.startX - cloud.x);
      }

      var travelProgress = (cloud.x - cloud.startX) / cloud.travelDistance;
      var waveT = travelProgress * Math.PI * 2 * cloud.waveCycles + cloud.wavePhase;
      var offsetX = cloud.x - cloud.baseLeft;
      var offsetY = Math.sin(waveT) * cloud.waveAmplitude;
      cloud.el.style.transform = "translate3d(" + offsetX.toFixed(2) + "px, " + offsetY.toFixed(2) + "px, 0)";
      cloud.el.style.opacity = "1";
    }
  }

  function arePreRunGfx2FramesReady(frames) {
    if (!Array.isArray(frames) || !frames.length) {
      return false;
    }
    return frames.every(function (src) {
      var entry = preRunGfx2FrameCache[src];
      if (entry && entry.loaded) {
        return true;
      }
      var fallbackSrc = src.slice(-4) === ".PNG"
        ? src.slice(0, -4) + ".png"
        : src.slice(-4) === ".png"
          ? src.slice(0, -4) + ".PNG"
          : "";
      var fallbackEntry = fallbackSrc ? preRunGfx2FrameCache[fallbackSrc] : null;
      return Boolean(fallbackEntry && fallbackEntry.loaded);
    });
  }

  var preRunGfx2FullLockNoticeTimeoutId = 0;

  function showPreRunGfx2FullModeLockNotice() {
    state.preRunGfx2FullLockNoticeActive = true;
    renderPreRunScreen();
    if (preRunGfx2FullLockNoticeTimeoutId) {
      clearTimeout(preRunGfx2FullLockNoticeTimeoutId);
    }
    preRunGfx2FullLockNoticeTimeoutId = setTimeout(function () {
      state.preRunGfx2FullLockNoticeActive = false;
      renderPreRunScreen();
    }, 2200);
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
    writePlayerSkinProgress();
    refreshPreRunBriefValues();
    state.skinUnlockToastText = getSkinDisplayName(normalized) + " Unlocked";
    state.skinUnlockToastTimeLeft = 2.8;
    state.pendingSkinRewardName = normalized;
    state.pendingSkinRewardDeferred = Boolean(state.running && !state.preRunActive);
    state.pendingSkinRewardNextAction = "";
    if (!state.pendingSkinRewardDeferred) {
      showSkinRewardOverlay(normalized, "");
    }
    return true;
  }

  function setSelectedSkinFromUi(skinName) {
    var nextSkin = normalizeOwnedSkinName(skinName);
    if (C.selectedSkin === nextSkin) {
      return;
    }
    C.selectedSkin = nextSkin;
    syncModernVisualsWithSelectedSkin(nextSkin);
    writePlayerSkinProgress();
    refreshPreRunSkinSelection();
    renderPreRunGfx2ClassicInside();
    renderPreRunGfx2AdvancedInside();
  }

  function getSkinUiConfig(skinName) {
    return SKIN_UI_CONFIGS[normalizeSkinName(skinName)] || SKIN_UI_CONFIGS.Skin01;
  }

  function getSkinDisplayName(skinName) {
    var normalized = normalizeSkinName(skinName);
    return SKIN_DISPLAY_NAMES[normalized] || normalized;
  }

  function getSkinPreviewAssetPath(skinName, isSelected, isUnlocked) {
    var normalized = normalizeSkinName(skinName);
    if (normalized === "Skin07") {
      if (!isUnlocked) {
        return FUTURE_SKIN_ICON_PATH;
      }
      return isSelected
        ? "assets/skins/Skin07/skin07_selected.png"
        : "assets/skins/Skin07/skin07_unselected.png";
    }
    return getSkinUiConfig(normalized).previewAssetPath;
  }

  function getSkinPickupIconAssetPath(skinName) {
    return getSkinUiConfig(skinName).pickupAssetPath;
  }

  function getSkinPickupLevelSettingKey(skinName, level) {
    return "skinPickup" + normalizeSkinName(skinName) + "Level" + String(level) + "Enabled";
  }

  function getPreRunGfx2ClassicSkinButtons() {
    return [
      { button: preRunClassicGfx2Skin1Btn, skin: "Skin01" },
      { button: preRunClassicGfx2Skin2Btn, skin: "Skin02" },
      { button: preRunClassicGfx2Skin3Btn, skin: "Skin03" },
      { button: preRunClassicGfx2Skin4Btn, skin: "Skin04" },
      { button: preRunClassicGfx2SkinFuture1Btn, skin: "Skin05" },
      { button: preRunClassicGfx2Skin6Btn, skin: "Skin06" }
    ];
  }

  function getPreRunGfx2ClassicSkinSlots() {
    return [
      { img: preRunClassicGfx2Skin1Img, skin: "Skin01", slotIndex: 1 },
      { img: preRunClassicGfx2Skin2Img, skin: "Skin02", slotIndex: 2 },
      { img: preRunClassicGfx2Skin3Img, skin: "Skin03", slotIndex: 3 },
      { img: preRunClassicGfx2Skin4Img, skin: "Skin04", slotIndex: 4 },
      { img: preRunClassicGfx2Skin5Img, skin: "Skin05", slotIndex: 5 },
      { img: preRunClassicGfx2Skin6Img, skin: "Skin06", slotIndex: 6 }
    ];
  }

  function getClassicGfx2SkinSlotAssetPath(slotIndex, variant) {
    var slot = slotIndex < 10 ? "0" + String(slotIndex) : String(slotIndex);
    return "assets/gfx2/classic/layout/skin" + slot + "_" + variant + ".jpg";
  }

  function getPreRunGfx2AdvancedSkinButtons() {
    return [
      { button: preRunAdvancedGfx2Skin1Btn, skin: "Skin01" },
      { button: preRunAdvancedGfx2Skin2Btn, skin: "Skin02" },
      { button: preRunAdvancedGfx2Skin3Btn, skin: "Skin03" },
      { button: preRunAdvancedGfx2Skin4Btn, skin: "Skin04" },
      { button: preRunAdvancedGfx2SkinFuture1Btn, skin: "Skin05" },
      { button: preRunAdvancedGfx2Skin6Btn, skin: "Skin06" }
    ];
  }

  function getPreRunGfx2AdvancedSkinSlots() {
    return [
      { img: preRunAdvancedGfx2Skin1Img, skin: "Skin01", slotIndex: 1 },
      { img: preRunAdvancedGfx2Skin2Img, skin: "Skin02", slotIndex: 2 },
      { img: preRunAdvancedGfx2Skin3Img, skin: "Skin03", slotIndex: 3 },
      { img: preRunAdvancedGfx2Skin4Img, skin: "Skin04", slotIndex: 4 },
      { img: preRunAdvancedGfx2Skin5Img, skin: "Skin05", slotIndex: 5 },
      { img: preRunAdvancedGfx2Skin6Img, skin: "Skin06", slotIndex: 6 }
    ];
  }

  function getAdvancedGfx2SkinSlotAssetPath(slotIndex, variant) {
    return getClassicGfx2SkinSlotAssetPath(slotIndex, variant);
  }

  function isPreRunGfx2ClassicInsideActive() {
    return isGfx2StartScreenEnabled() && state.preRunStep === "details" && state.gameMode === 2;
  }

  function isPreRunGfx2AdvancedInsideActive() {
    return isGfx2StartScreenEnabled() && state.preRunStep === "details" && state.gameMode === 1;
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
    var upperBound = getConfiguredLevelGoalTargetScore(level, mode, difficulty);
    var lowerBound = level > 1 ? getConfiguredLevelGoalTargetScore(level - 1, mode, difficulty) : 0;
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
    var normalized = normalizeSkinName(skinName);
    if (normalized === "Skin07") {
      normalized = "Skin01";
    }
    return "assets/skins/" + normalized + "/" + fileName;
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
    var skinConfig = getHeroSkinFrameConfig(skinName);
    if (skinConfig.walkSourceRects && skinConfig.walkSourceRects.length) {
      return skinConfig.walkSourceRects;
    }
    return skinConfig.usesFullFrameSourceRects ? HERO_FRAME_SOURCE_RECTS_FULL_FRAME : HERO_WALK_FRAME_SOURCE_RECTS_SKIN01;
  }

  function getHeroJumpFrameSourceRects() {
    var skinName = getSelectedHeroSkinName();
    var skinConfig = getHeroSkinFrameConfig(skinName);
    if (skinConfig.jumpSourceRects && skinConfig.jumpSourceRects.length) {
      return skinConfig.jumpSourceRects;
    }
    return skinConfig.usesFullFrameSourceRects ? HERO_FRAME_SOURCE_RECTS_FULL_FRAME : HERO_JUMP_FRAME_SOURCE_RECTS_SKIN01;
  }

  function getHeroFrameSourceRect(heroFrame) {
    var skinName = getSelectedHeroSkinName();
    var skinConfig = getHeroSkinFrameConfig(skinName);
    if (!heroFrame || !heroFrame.image) {
      return { x: 0, y: 0, w: 0, h: 0 };
    }
    if (heroFrame.type === "walk" && skinConfig.walkSourceRects && skinConfig.walkSourceRects[heroFrame.index]) {
      return skinConfig.walkSourceRects[heroFrame.index];
    }
    if (heroFrame.type === "jump" && skinConfig.jumpSourceRects && skinConfig.jumpSourceRects[heroFrame.index]) {
      return skinConfig.jumpSourceRects[heroFrame.index];
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

  function seedDefaultAdminStorageIfMissing() {
    var seed = window.HrrraDefaultAdminSettings;
    var levelSeed;
    var levelKey;
    var difficultyKey;
    var modeKey;
    var storageKey;

    if (!seed || typeof seed !== "object") {
      return;
    }

    try {
      if (!window.localStorage.getItem(GLOBAL_ADMIN_STORAGE_KEY) && seed.global && typeof seed.global === "object") {
        writeGlobalAdminStorageObject(seed.global);
      }

      levelSeed = seed.levels;
      if (!levelSeed || typeof levelSeed !== "object") {
        return;
      }

      for (levelKey in levelSeed) {
        if (!Object.prototype.hasOwnProperty.call(levelSeed, levelKey)) {
          continue;
        }
        var numericLevel = Number(levelKey);
        var levelEntry = levelSeed[levelKey];
        if (!Number.isFinite(numericLevel) || !levelEntry || typeof levelEntry !== "object") {
          continue;
        }
        for (difficultyKey in levelEntry) {
          if (!Object.prototype.hasOwnProperty.call(levelEntry, difficultyKey)) {
            continue;
          }
          var difficultyEntry = levelEntry[difficultyKey];
          if (!difficultyEntry || typeof difficultyEntry !== "object") {
            continue;
          }
          for (modeKey in difficultyEntry) {
            if (!Object.prototype.hasOwnProperty.call(difficultyEntry, modeKey)) {
              continue;
            }
            var numericMode = Number(modeKey);
            var modeEntry = difficultyEntry[modeKey];
            if (!Number.isFinite(numericMode) || !modeEntry || typeof modeEntry !== "object") {
              continue;
            }
            storageKey = getModeStorageKey(numericLevel, numericMode, difficultyKey);
            if (!window.localStorage.getItem(storageKey)) {
              writeAdminStorageObject(numericLevel, numericMode, difficultyKey, modeEntry);
            }
          }
        }
      }
    } catch (error) {
      // ignore seeding failures
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
          key === LEGACY_PLAYER_SKIN_PROGRESS_STORAGE_KEY ||
          key === LEGACY_BADGE_STATS_STORAGE_KEY ||
          key === LEGACY_ECONOMY_STORAGE_KEY ||
          key === WHATS_NEW_SEEN_VERSION_STORAGE_KEY ||
          key.indexOf(ADMIN_STORAGE_KEY_PREFIX) === 0 ||
          key.indexOf(LEGACY_ADMIN_STORAGE_KEY_PREFIX) === 0 ||
          key.indexOf(PLAYER_SKIN_PROGRESS_STORAGE_KEY_PREFIX) === 0 ||
          key.indexOf(BADGE_STATS_STORAGE_KEY_PREFIX) === 0 ||
          key.indexOf(ECONOMY_STORAGE_KEY_PREFIX) === 0 ||
          key.indexOf(MAX_SCORE_STORAGE_KEY_PREFIX) === 0 ||
          key.indexOf(LEGACY_MAX_SCORE_STORAGE_KEY_PREFIX) === 0
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
    seedDefaultAdminStorageIfMissing();
    badgeStats = createDefaultBadgeStats();
    economyStats = createDefaultEconomyStats();
    state.gameMode = 2;
    state.gameDifficulty = "easy";
    state.currentLevel = 1;
    applyModeConfig(state.currentLevel, state.gameMode, state.gameDifficulty);
    loadGlobalAdminConfig();
    setActiveProfileStoragePlayerId(state.playerId);
    loadPlayerSkinProgress(false);
    openPreRunScreen();
    renderAdminForm();
    refreshPreRunBriefValues();
    updateLivesUi();
  }

  function resetBadgeProgressOnly() {
    badgeStats = createDefaultBadgeStats();
    resetRunBadgeStats();
    resetBadgeRewardQueue();
    state.runUnlockedBadgeKeysAtStart = {};
    state.badgeCursedSecondsAccumulator = 0;
    state.badgeStatsDirty = false;
    state.badgeStatsWriteElapsed = 0;
    if (state.preRunActive) {
      state.pendingFreshRunStart = true;
    }
    writeBadgeStats();
    if (state.preRunActive) {
      renderPreRunScreen();
    }
    renderAdminForm();
    setBadgeResetNoticeOpen(true);
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
        if (field.type === "shop-summary") {
          continue;
        }
        if (field.type === "skin-pickup-levels") {
          for (var skinOptionIndex = 0; skinOptionIndex < SKIN_OPTIONS.length; skinOptionIndex += 1) {
            for (var level = 1; level <= LEVEL_COUNT; level += 1) {
              keys[getSkinPickupLevelSettingKey(SKIN_OPTIONS[skinOptionIndex].value, level)] = true;
            }
          }
          continue;
        }
        if (field.type === "badges-config") {
          for (var badgeSeriesIndex = 0; badgeSeriesIndex < BADGE_SERIES.length; badgeSeriesIndex += 1) {
            var badgeSeries = BADGE_SERIES[badgeSeriesIndex];
            keys[getBadgeSeriesNameStorageKey(badgeSeries.id)] = true;
            for (var badgeTierIndex = 0; badgeTierIndex < badgeSeries.tiers.length; badgeTierIndex += 1) {
              keys[getBadgeSeriesTierTargetStorageKey(badgeSeries.id, badgeTierIndex)] = true;
            }
          }
          continue;
        }
        keys[field.key] = true;
      }
    }
    return Object.keys(keys);
  }

  function getBadgeSeriesNameStorageKey(seriesId) {
    return "badgeSeriesName_" + String(seriesId);
  }

  function isAudioLevelFieldKey(key) {
    return AUDIO_LEVEL_FIELD_KEYS.indexOf(String(key)) >= 0;
  }

  function isAudioGlobalPathKey(key) {
    return AUDIO_GLOBAL_PATH_KEYS.indexOf(String(key)) >= 0;
  }

  function sanitizeAudioPathValue(value) {
    return String(value || "")
      .replace(/\\/g, "/")
      .replace(/\s+/g, " ")
      .trim();
  }

  function getBadgeTierKey(series, tierIndex) {
    return String(series.id) + "_" + String(tierIndex);
  }

  function getLegacyBadgeSeriesTierValueStorageKey(seriesId, tierIndex) {
    return "badgeSeriesTierValue_" + String(seriesId) + "_" + String(tierIndex);
  }

  function getBadgeSeriesTierTargetStorageKey(seriesId, tierIndex) {
    return "badgeSeriesTierTarget_" + String(seriesId) + "_" + String(tierIndex);
  }

  function getBadgeSeriesName(series) {
    var stored = readGlobalAdminStorageObject();
    var override = stored[getBadgeSeriesNameStorageKey(series.id)];
    if (typeof override === "string" && override.trim()) {
      return override.trim();
    }
    return series.name;
  }

  function slugifyBadgeTrophyName(name) {
    return String(name || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function getBadgeTrophySlug(series) {
    var seriesId = String(series && series.id || "");
    var mappedSlug = (useBadgesV2() ? BADGE_TROPHY_SLUGS_BY_SERIES_ID_V2 : BADGE_TROPHY_SLUGS_BY_SERIES_ID)[seriesId];
    var allowedSlugs = useBadgesV2() ? PRE_RUN_GFX2_BADGE_TROPHY_SLUGS_V2 : PRE_RUN_GFX2_BADGE_TROPHY_SLUGS;
    if (mappedSlug && allowedSlugs[mappedSlug]) {
      return mappedSlug;
    }
    var derivedSlug = seriesId.replace(/_(single_run|all_runs|skills|legends|discovery)$/, "");
    if (derivedSlug && allowedSlugs[derivedSlug]) {
      return derivedSlug;
    }
    var nameSlug = slugifyBadgeTrophyName(getBadgeSeriesName(series));
    if (nameSlug && allowedSlugs[nameSlug]) {
      return nameSlug;
    }
    return "";
  }

  function getPreRunBadgeTrophyPath(series) {
    var trophySlug = getBadgeTrophySlug(series);
    if (!trophySlug) {
      return getBadgeTrophyFallbackPath();
    }
    return getBadgeTrophyBasePath() + "/" + getBadgeTrophyFileName(trophySlug);
  }

  function getDefaultBadgeTierTarget(series, tierIndex) {
    switch (series.id) {
      case "greedy_single_run":
        return [100000, 250000, 500000][tierIndex] || 0;
      case "coin_collector_single_run":
        return [100, 200, 400][tierIndex] || 0;
      case "bag_collector_single_run":
        return [10, 50, 100][tierIndex] || 0;
      case "lucky_single_run":
      case "unlucky_single_run":
        return [5, 10, 20][tierIndex] || 0;
      case "untouchable_single_run":
        return [2, 3, 4][tierIndex] || 0;
      case "endless_greed_all_runs":
        return [1000000, 5000000, 10000000][tierIndex] || 0;
      case "coin_collector_all_runs":
        return [1000, 5000, 10000][tierIndex] || 0;
      case "bag_collector_all_runs":
        return [500, 1000, 5000][tierIndex] || 0;
      case "banger_all_runs":
        return [10, 100, 1000][tierIndex] || 0;
      case "big_spender_all_runs":
        return [50, 250, 1000][tierIndex] || 0;
      case "unkillable_custommer_all_runs":
        return [1, 5, 25][tierIndex] || 0;
      case "jumper_all_runs":
        return [1000, 5000, 10000][tierIndex] || 0;
      case "fortunate_all_runs":
      case "doom_magnet_all_runs":
        return [50, 100, 200][tierIndex] || 0;
      case "speed_demon_skills":
        return [200, 300, 500][tierIndex] || 0;
      case "shield_teleporter_skills":
        return [20, 50, 100][tierIndex] || 0;
      case "survivor_skills":
        return 5;
      case "martyr_skills":
        return [5, 20, 50][tierIndex] || 0;
      case "purist_skills":
        return [2, 4, 5][tierIndex] || 0;
      case "shopaholic_skills":
        return [1, 3, 7][tierIndex] || 0;
      case "heart_hunter_legends":
      case "still_running_legends":
      case "cursed_legends":
      case "magneto_legends":
        return 1000;
      case "first_runner_legends":
        return 1;
      case "teleporter_legends":
      case "bubble_saver_legends":
      case "starter_legends":
        return 500;
      case "unlocker_discovery":
        return 1;
      default:
        return 0;
    }
  }

  function sanitizeBadgeTarget(series, tierIndex, value) {
    var parsed = Math.floor(Number(value));
    if (!Number.isFinite(parsed)) {
      return getDefaultBadgeTierTarget(series, tierIndex);
    }
    return Math.max(0, parsed);
  }

  function parseLegacyBadgeTarget(series, tierIndex, rawValue) {
    if (typeof rawValue !== "string" || !rawValue.trim()) {
      return getDefaultBadgeTierTarget(series, tierIndex);
    }

    var match = rawValue.trim().match(/([0-9]+(?:\.[0-9]+)?)\s*([kKmM]?)/);
    if (!match) {
      return getDefaultBadgeTierTarget(series, tierIndex);
    }

    var numeric = Number(match[1]);
    if (!Number.isFinite(numeric)) {
      return getDefaultBadgeTierTarget(series, tierIndex);
    }

    var suffix = String(match[2] || "").toLowerCase();
    if (suffix === "k") {
      numeric *= 1000;
    } else if (suffix === "m") {
      numeric *= 1000000;
    }
    return sanitizeBadgeTarget(series, tierIndex, numeric);
  }

  function getBadgeTierTarget(series, tierIndex) {
    var stored = readGlobalAdminStorageObject();
    var directOverride = stored[getBadgeSeriesTierTargetStorageKey(series.id, tierIndex)];
    if (Number.isFinite(directOverride)) {
      return sanitizeBadgeTarget(series, tierIndex, directOverride);
    }
    var legacyOverride = stored[getLegacyBadgeSeriesTierValueStorageKey(series.id, tierIndex)];
    if (typeof legacyOverride === "string" && legacyOverride.trim()) {
      return parseLegacyBadgeTarget(series, tierIndex, legacyOverride);
    }
    return getDefaultBadgeTierTarget(series, tierIndex);
  }

  function getShopaholicCollectedValue() {
    var collected = 0;
    if (economyStats && economyStats.buy10CoinsPurchasedOnce) {
      collected += 1;
    }
    if (isMineShortTimerUnlocked()) {
      collected += 1;
    }
    if (isLevelXUnlocked()) {
      collected += 1;
    }
    if (isSkinUnlocked("Skin05")) {
      collected += 1;
    }
    if (isSkinUnlocked("Skin06")) {
      collected += 1;
    }
    if (isSkinUnlocked("Skin07")) {
      collected += 1;
    }
    if (getMineStorageUpgradeMeta().isMaxed) {
      collected += 1;
    }
    return collected;
  }

  function formatBadgeCompactNumber(value) {
    var safe = Math.max(0, Number(value) || 0);
    if (safe >= 1000000) {
      var millions = safe / 1000000;
      return (millions % 1 === 0 ? String(millions) : millions.toFixed(1)) + "m";
    }
    if (safe >= 1000) {
      var thousands = safe / 1000;
      return (thousands % 1 === 0 ? String(thousands) : thousands.toFixed(1)) + "k";
    }
    return String(safe);
  }

  function shouldShowBadgeInlineProgress(series) {
    return series && (
      series.category === "All Runs" ||
      series.category === "Lifetime Legends" ||
      series.id === "shield_teleporter_skills"
    );
  }

  function appendBadgeInlineProgress(baseText, series, tierIndex) {
    if (!shouldShowBadgeInlineProgress(series)) {
      return baseText;
    }
    if (isBadgeTierCollected(series, tierIndex)) {
      return baseText;
    }
    return baseText + " (" + formatBadgeCollectedNumber(series, tierIndex) + ")";
  }

  function formatBadgeGoalText(series, tierIndex) {
    var target = getBadgeTierTarget(series, tierIndex);
    switch (series.id) {
      case "greedy_single_run":
        return formatBadgeCompactNumber(target) + " points";
      case "coin_collector_single_run":
      case "coin_collector_all_runs":
      case "banger_all_runs":
      case "big_spender_all_runs":
        return appendBadgeInlineProgress(formatBadgeCompactNumber(target) + " coins", series, tierIndex);
      case "bag_collector_single_run":
      case "bag_collector_all_runs":
        return appendBadgeInlineProgress(formatBadgeCompactNumber(target) + " money bags", series, tierIndex);
      case "unkillable_custommer_all_runs":
        return appendBadgeInlineProgress("Use continue " + formatBadgeCompactNumber(target) + " times", series, tierIndex);
      case "jumper_all_runs":
        return appendBadgeInlineProgress(formatBadgeCompactNumber(target) + " jumps", series, tierIndex);
      case "lucky_single_run":
      case "fortunate_all_runs":
        return appendBadgeInlineProgress(formatBadgeCompactNumber(target) + " positive ? Coin wins", series, tierIndex);
      case "unlucky_single_run":
      case "doom_magnet_all_runs":
        return appendBadgeInlineProgress(formatBadgeCompactNumber(target) + " negative ? Coin results", series, tierIndex);
      case "untouchable_single_run":
        return "Finish " + target + " levels clean";
      case "endless_greed_all_runs":
        return appendBadgeInlineProgress(formatBadgeCompactNumber(target) + " total score", series, tierIndex);
      case "speed_demon_skills":
        return "Reach +" + target + "% speed";
      case "shield_teleporter_skills":
        return appendBadgeInlineProgress("Teleport with shield " + target + "x", series, tierIndex);
      case "survivor_skills":
        if (tierIndex === 0) {
          return "Level " + target + " on Jump Classic Easy";
        }
        if (tierIndex === 1) {
          return "Level " + target + " on Jump Classic Hard";
        }
        return "Level " + target + " on Jump Advanced Hard";
      case "martyr_skills":
        return "Lose " + target + " lives in one run";
      case "purist_skills":
        return "Reach Level " + target + " clean";
      case "shopaholic_skills":
        return formatBadgeCompactNumber(target) + " unique shop item" + (target === 1 ? "" : "s");
      case "first_runner_legends":
        return appendBadgeInlineProgress("Start " + target + " run", series, tierIndex);
      case "heart_hunter_legends":
        return appendBadgeInlineProgress("Collect " + target + " lives", series, tierIndex);
      case "still_running_legends":
        return appendBadgeInlineProgress("Lose " + target + " lives", series, tierIndex);
      case "teleporter_legends":
        return appendBadgeInlineProgress("Use " + target + " teleports", series, tierIndex);
      case "bubble_saver_legends":
        return appendBadgeInlineProgress("Trigger " + target + " shield saves", series, tierIndex);
      case "cursed_legends":
        return appendBadgeInlineProgress("Stay cursed for " + target + "s", series, tierIndex);
      case "magneto_legends":
        return appendBadgeInlineProgress("Pick up " + target + " magnets", series, tierIndex);
      case "starter_legends":
        return appendBadgeInlineProgress("Start " + target + " runs", series, tierIndex);
      case "unlocker_discovery":
        if (tierIndex === 0) {
          return "Unlock Hard";
        }
        if (tierIndex === 1) {
          return "Unlock Jump Advanced";
        }
        return "Unlock all skins";
      default:
        return series.tiers[tierIndex] ? series.tiers[tierIndex].value : "";
    }
  }

  function getBadgeAdminUnitText(series, tierIndex) {
    switch (series.id) {
      case "greedy_single_run":
      case "endless_greed_all_runs":
        return "points";
      case "coin_collector_single_run":
      case "coin_collector_all_runs":
      case "banger_all_runs":
      case "big_spender_all_runs":
        return "coins";
      case "bag_collector_single_run":
      case "bag_collector_all_runs":
        return "money bags";
      case "unkillable_custommer_all_runs":
        return "continues";
      case "jumper_all_runs":
        return "jumps";
      case "lucky_single_run":
      case "fortunate_all_runs":
        return "positive ? Coin wins";
      case "unlucky_single_run":
      case "doom_magnet_all_runs":
        return "negative ? Coin results";
      case "untouchable_single_run":
        return "clean levels";
      case "speed_demon_skills":
        return "% speed";
      case "shield_teleporter_skills":
        return "shield teleports";
      case "survivor_skills":
        return tierIndex === 0 ? "level on Jump Classic Easy" : (tierIndex === 1 ? "level on Jump Classic Hard" : "level on Jump Advanced Hard");
      case "martyr_skills":
        return "lives lost in one run";
      case "purist_skills":
        return "clean level reached";
      case "shopaholic_skills":
        return "unique shop items";
      case "first_runner_legends":
        return "runs";
      case "heart_hunter_legends":
        return "lives";
      case "still_running_legends":
        return "lives lost";
      case "teleporter_legends":
        return "teleports";
      case "bubble_saver_legends":
        return "shield saves";
      case "cursed_legends":
        return "seconds cursed";
      case "magneto_legends":
        return "magnets";
      case "starter_legends":
        return "runs";
      case "unlocker_discovery":
        return tierIndex === 0 ? "Hard unlock" : (tierIndex === 1 ? "Jump Advanced unlock" : "all skins unlock");
      default:
        return "";
    }
  }

  function getUnlockedSkinCount() {
    var count = 0;
    for (var i = 0; i < SKIN_OPTIONS.length; i += 1) {
      if (isSkinUnlocked(SKIN_OPTIONS[i].value)) {
        count += 1;
      }
    }
    return count;
  }

  function getBadgeCollectedValue(series, tierIndex) {
    switch (series.id) {
      case "greedy_single_run":
        return badgeStats.best.singleRunScore;
      case "coin_collector_single_run":
        return badgeStats.best.singleRunCoins;
      case "bag_collector_single_run":
        return badgeStats.best.singleRunBags;
      case "lucky_single_run":
        return badgeStats.best.singleRunQuestionPositive;
      case "unlucky_single_run":
        return badgeStats.best.singleRunQuestionNegative;
      case "untouchable_single_run":
        return badgeStats.best.cleanLevelsSingleRun;
      case "endless_greed_all_runs":
        return badgeStats.lifetime.totalScore;
      case "coin_collector_all_runs":
        return badgeStats.lifetime.totalCoins;
      case "bag_collector_all_runs":
        return badgeStats.lifetime.totalBags;
      case "banger_all_runs":
        return badgeStats.lifetime.exchangedCoins;
      case "big_spender_all_runs":
        return Math.max(0, Math.floor(Number(economyStats.totalCoinsSpent) || 0));
      case "unkillable_custommer_all_runs":
        return badgeStats.lifetime.continuesUsed;
      case "jumper_all_runs":
        return badgeStats.lifetime.jumps;
      case "fortunate_all_runs":
        return badgeStats.lifetime.questionPositive;
      case "doom_magnet_all_runs":
        return badgeStats.lifetime.questionNegative;
      case "speed_demon_skills":
        return badgeStats.best.maxSpeedPercent;
      case "shield_teleporter_skills":
        return badgeStats.lifetime.shieldTeleports;
      case "survivor_skills":
        return tierIndex === 0
          ? badgeStats.best.survivorEasyJumpLevel
          : (tierIndex === 1 ? badgeStats.best.survivorHardJumpLevel : badgeStats.best.survivorHardFullLevel);
      case "martyr_skills":
        return badgeStats.best.livesLostSingleRun;
      case "purist_skills":
        return badgeStats.best.puristLevel;
      case "shopaholic_skills":
        return getShopaholicCollectedValue();
      case "first_runner_legends":
        return badgeStats.lifetime.runsStarted;
      case "heart_hunter_legends":
        return badgeStats.lifetime.livesCollected;
      case "still_running_legends":
        return badgeStats.lifetime.livesLost;
      case "teleporter_legends":
        return badgeStats.lifetime.teleportsUsed;
      case "bubble_saver_legends":
        return badgeStats.lifetime.shieldSaves;
      case "cursed_legends":
        return badgeStats.lifetime.cursedSeconds;
      case "magneto_legends":
        return badgeStats.lifetime.magnetPickups;
      case "starter_legends":
        return badgeStats.lifetime.runsStarted;
      case "unlocker_discovery":
        if (tierIndex === 0) {
          return isHardDifficultyUnlocked() ? 1 : 0;
        }
        if (tierIndex === 1) {
          return isFullModeUnlocked() ? 1 : 0;
        }
        return getUnlockedSkinCount() >= SKIN_OPTIONS.length ? 1 : 0;
      default:
        return 0;
    }
  }

  function isBadgeTierCollected(series, tierIndex) {
    return getBadgeCollectedValue(series, tierIndex) >= getBadgeTierTarget(series, tierIndex);
  }

  function formatBadgeCollectedNumber(series, tierIndex) {
    var value = Math.floor(Math.max(0, getBadgeCollectedValue(series, tierIndex)));
    if (series.id === "greedy_single_run" || series.id === "endless_greed_all_runs" || series.id === "jumper_all_runs") {
      return value.toLocaleString("en-US");
    }
    return String(value);
  }

  function getTodayBadgeDateString() {
    var now = new Date();
    var day = String(now.getDate()).padStart(2, "0");
    var month = String(now.getMonth() + 1).padStart(2, "0");
    var year = String(now.getFullYear()).slice(-2);
    return day + "." + month + "." + year;
  }

  function syncBadgeUnlockDates() {
    var changed = false;
    BADGE_SERIES.forEach(function (series) {
      for (var tierIndex = 0; tierIndex < series.tiers.length; tierIndex += 1) {
        var badgeTierKey = getBadgeTierKey(series, tierIndex);
        if (isBadgeTierCollected(series, tierIndex) && !badgeStats.unlockedDates[badgeTierKey]) {
          badgeStats.unlockedDates[badgeTierKey] = getTodayBadgeDateString();
          changed = true;
        }
      }
    });
    return changed;
  }

  function getBadgeUnlockDate(series, tierIndex) {
    return badgeStats.unlockedDates[getBadgeTierKey(series, tierIndex)] || "";
  }

  function getCollectedBadgeKeyMap() {
    var map = {};
    BADGE_SERIES.forEach(function (series) {
      for (var tierIndex = 0; tierIndex < series.tiers.length; tierIndex += 1) {
        if (isBadgeTierCollected(series, tierIndex)) {
          map[getBadgeTierKey(series, tierIndex)] = true;
        }
      }
    });
    return map;
  }

  function resetBadgeRewardQueue() {
    state.pendingBadgeRewardQueue = [];
    state.badgeRewardIndex = 0;
    state.badgeRewardPhase = "idle";
    state.badgeRewardTimer = 0;
    state.badgeRewardActive = false;
    state.badgeRewardShowRip = false;
    if (badgeRewardOverlayEl) {
      badgeRewardOverlayEl.classList.add("hidden");
      badgeRewardOverlayEl.classList.remove("is-revealing", "is-ready");
    }
    if (badgeRewardTrophyBaseEl) {
      badgeRewardTrophyBaseEl.removeAttribute("src");
    }
    if (badgeRewardTrophyArtEl) {
      badgeRewardTrophyArtEl.removeAttribute("src");
      badgeRewardTrophyArtEl.classList.remove("is-visible");
    }
  }

  function getBadgeRewardTrophyArtPath(series) {
    return getPreRunBadgeTrophyPath(series) || "";
  }

  function resetSkinRewardOverlay(clearPendingState) {
    if (skinRewardOverlayEl) {
      skinRewardOverlayEl.classList.add("hidden");
      skinRewardOverlayEl.classList.remove("is-revealing", "is-ready");
    }
    if (clearPendingState !== false) {
      state.pendingSkinRewardName = "";
      state.pendingSkinRewardDeferred = false;
      state.pendingSkinRewardNextAction = "";
    }
  }

  function showSkinRewardOverlay(skinName, nextAction) {
    if (!skinRewardOverlayEl) {
      return;
    }
    var displayName = getSkinDisplayName(skinName);
    var trophyArtPath = getSkinRewardTrophyArtPath(skinName);
    state.pendingSkinRewardName = normalizeSkinName(skinName);
    state.pendingSkinRewardDeferred = Boolean(nextAction);
    state.pendingSkinRewardNextAction = nextAction || "";
    if (skinRewardKickerEl) {
      skinRewardKickerEl.textContent = "New Skin";
    }
    if (skinRewardNameEl) {
      skinRewardNameEl.textContent = displayName;
    }
    if (skinRewardTierEl) {
      skinRewardTierEl.textContent = "Unlocked";
    }
    if (skinRewardTrophyBaseEl) {
      skinRewardTrophyBaseEl.removeAttribute("src");
      skinRewardTrophyBaseEl.style.display = "none";
    }
    if (skinRewardTrophyArtEl) {
      skinRewardTrophyArtEl.removeAttribute("src");
      if (trophyArtPath) {
        skinRewardTrophyArtEl.onerror = function () {
          if (skinRewardTrophyArtEl && skinRewardTrophyArtEl.getAttribute("src") === trophyArtPath) {
            skinRewardTrophyArtEl.removeAttribute("src");
          }
        };
        skinRewardTrophyArtEl.setAttribute("src", trophyArtPath);
      }
    }
    if (skinRewardGoalEl) {
      skinRewardGoalEl.textContent = displayName + " is now available.";
    }
    if (skinRewardProgressEl) {
      skinRewardProgressEl.textContent = "Check the pre-run skin select to use it.";
    }
    if (skinRewardPromptEl) {
      skinRewardPromptEl.textContent = "Tap or press Space to continue";
    }
    skinRewardOverlayEl.classList.remove("hidden", "is-revealing", "is-ready");
    void skinRewardOverlayEl.offsetWidth;
    skinRewardOverlayEl.classList.add("is-revealing");
    window.setTimeout(function () {
      if (skinRewardOverlayEl && !skinRewardOverlayEl.classList.contains("hidden")) {
        skinRewardOverlayEl.classList.remove("is-revealing");
        skinRewardOverlayEl.classList.add("is-ready");
      }
    }, 20);
  }

  function showQueuedSkinReward(nextAction) {
    if (!state.pendingSkinRewardName) {
      return false;
    }
    showSkinRewardOverlay(state.pendingSkinRewardName, nextAction || state.pendingSkinRewardNextAction || "");
    return true;
  }

  function advanceSkinRewardOverlay() {
    if (!skinRewardOverlayEl || skinRewardOverlayEl.classList.contains("hidden")) {
      return false;
    }
    var pendingAction = state.pendingSkinRewardNextAction;
    resetSkinRewardOverlay();
    if (pendingAction === "pre-run") {
      openPreRunScreen();
    } else if (pendingAction === "game-over") {
      showGameOverScreen();
    }
    return true;
  }

  function showModeRewardOverlay(kind) {
    if (!modeRewardOverlayEl) {
      return;
    }
    var isHard = kind === "hard";
    var title = isHard ? "Hard Mode" : "Advanced Mode";
    var subtitle = isHard ? "Unlocked" : "Unlocked";
    var message = isHard
      ? "Jump Classic Hard is now available."
      : "Jump Advanced is now available.";
    if (skinRewardKickerEl) {
      skinRewardKickerEl.textContent = isHard ? "New Hard Mode" : "New Advanced Mode";
    }
    if (skinRewardNameEl) {
      skinRewardNameEl.textContent = title;
    }
    if (skinRewardTierEl) {
      skinRewardTierEl.textContent = subtitle;
    }
    if (skinRewardTrophyBaseEl) {
      skinRewardTrophyBaseEl.src = "assets/gfx2/trophy_pics/trophy_clean.png";
      skinRewardTrophyBaseEl.style.display = "";
    }
    if (skinRewardTrophyArtEl) {
      skinRewardTrophyArtEl.classList.remove("is-visible");
      skinRewardTrophyArtEl.removeAttribute("src");
    }
    if (skinRewardGoalEl) {
      skinRewardGoalEl.textContent = message;
    }
    if (skinRewardProgressEl) {
      skinRewardProgressEl.textContent = "The unlock is reflected in the pre-run screen.";
    }
    if (skinRewardPromptEl) {
      skinRewardPromptEl.textContent = "Tap or press Space to continue";
    }
    modeRewardOverlayEl.classList.remove("hidden", "is-revealing", "is-ready");
    void modeRewardOverlayEl.offsetWidth;
    modeRewardOverlayEl.classList.add("is-revealing");
    window.setTimeout(function () {
      if (modeRewardOverlayEl && !modeRewardOverlayEl.classList.contains("hidden")) {
        modeRewardOverlayEl.classList.remove("is-revealing");
        modeRewardOverlayEl.classList.add("is-ready");
      }
    }, 20);
  }

  function buildNewlyUnlockedBadgeQueueForRun() {
    var queue = [];
    BADGE_SERIES.forEach(function (series) {
      for (var tierIndex = 0; tierIndex < series.tiers.length; tierIndex += 1) {
        var badgeKey = getBadgeTierKey(series, tierIndex);
        if (!isBadgeTierCollected(series, tierIndex) || state.runUnlockedBadgeKeysAtStart[badgeKey]) {
          continue;
        }
        queue.push({
          seriesId: series.id,
          trophyArtPath: getBadgeRewardTrophyArtPath(series),
          tierIndex: tierIndex,
          name: getBadgeSeriesName(series),
          tier: series.tiers[tierIndex].tier,
          sprite: series.tiers[tierIndex].sprite,
          goal: formatBadgeGoalText(series, tierIndex)
        });
      }
    });
    return queue;
  }

  function populateBadgeRewardOverlay(item) {
    if (!badgeRewardOverlayEl || !item) {
      return;
    }

    if (badgeRewardKickerEl) {
      badgeRewardKickerEl.textContent = state.pendingBadgeRewardQueue.length > 1 ? "New Badge Unlocked" : "Badge Unlocked";
    }
    if (badgeRewardNameEl) {
      badgeRewardNameEl.textContent = item.name;
    }
    if (badgeRewardTierEl) {
      badgeRewardTierEl.textContent = item.tier + " unlocked";
    }
    if (badgeRewardGoalEl) {
      badgeRewardGoalEl.textContent = item.goal;
    }
    if (badgeRewardProgressEl) {
      badgeRewardProgressEl.textContent =
        (state.badgeRewardIndex + 1) + " of " + state.pendingBadgeRewardQueue.length + " new badges from this run";
    }
    if (badgeRewardPromptEl) {
      badgeRewardPromptEl.textContent = "Tap or press Space to continue";
    }
    if (badgeRewardTrophyBaseEl) {
      badgeRewardTrophyBaseEl.removeAttribute("src");
      badgeRewardTrophyBaseEl.style.display = "none";
    }
    if (badgeRewardTrophyArtEl) {
      badgeRewardTrophyArtEl.removeAttribute("src");
      if (item.trophyArtPath) {
        var artPath = item.trophyArtPath;
        var fallbackPath = getBadgeTrophyFallbackPath();
        badgeRewardTrophyArtEl.onerror = function () {
          if (badgeRewardTrophyArtEl && badgeRewardTrophyArtEl.getAttribute("src") === artPath) {
            if (artPath !== fallbackPath) {
              badgeRewardTrophyArtEl.setAttribute("src", fallbackPath);
              return;
            }
            badgeRewardTrophyArtEl.removeAttribute("src");
          }
        };
        badgeRewardTrophyArtEl.setAttribute("src", artPath);
      }
    }
  }

  function showCurrentBadgeRewardItem() {
    var item = state.pendingBadgeRewardQueue[state.badgeRewardIndex];
    if (!item || !badgeRewardOverlayEl) {
      return;
    }

    populateBadgeRewardOverlay(item);
    state.badgeRewardActive = true;
    state.badgeRewardPhase = "intro";
    state.badgeRewardTimer = 0;
    state.badgeRewardShowRip = true;
    badgeRewardOverlayEl.classList.remove("hidden", "is-revealing", "is-ready");
    void badgeRewardOverlayEl.offsetWidth;
    refreshMusicPlayback();
  }

  function startBadgeRewardSequence(queue) {
    state.pendingBadgeRewardQueue = Array.isArray(queue) ? queue.slice() : [];
    state.badgeRewardIndex = 0;
    if (!state.pendingBadgeRewardQueue.length) {
      resetBadgeRewardQueue();
      return false;
    }
    showCurrentBadgeRewardItem();
    return true;
  }

  function finishBadgeRewardSequence() {
    resetBadgeRewardQueue();
    if (state.pendingSkinRewardDeferred && state.pendingSkinRewardName) {
      showQueuedSkinReward(state.returnToPreRunAfterBadgeRewards ? "pre-run" : "game-over");
      return;
    }
    if (state.returnToPreRunAfterBadgeRewards) {
      state.returnToPreRunAfterBadgeRewards = false;
      openPreRunScreen();
      return;
    }
    state.gameOverInputBlockUntil = Date.now() + 350;
    updateGameOverSummary(false);
    gameOverEl.classList.remove("hidden");
    refreshMusicPlayback();
  }

  function showGameOverScreen() {
    state.gameOverInputBlockUntil = Date.now() + 350;
    closeContinuePurchaseOverlay();
    updateGameOverSummary(false);
    if (gameOverEl) {
      gameOverEl.classList.remove("hidden");
    }
    refreshMusicPlayback();
  }

  function completeRunAndPresentGameOver(keepCurrentScreen) {
    state.continueOfferActive = false;
    closeContinuePurchaseOverlay();
    finalizeCompletedRun();
    if (!startBadgeRewardSequence(buildNewlyUnlockedBadgeQueueForRun())) {
      if (state.pendingSkinRewardDeferred && state.pendingSkinRewardName) {
        showQueuedSkinReward("game-over");
        return;
      }
      if (keepCurrentScreen) {
        state.gameOverInputBlockUntil = Date.now() + 350;
        updateGameOverSummary(true);
        refreshMusicPlayback();
      } else {
        showGameOverScreen();
      }
    }
  }

  function completeRunAndReturnToPreRun() {
    state.continueOfferActive = false;
    closeContinuePurchaseOverlay();
    finalizeCompletedRun();
    if (!startBadgeRewardSequence(buildNewlyUnlockedBadgeQueueForRun())) {
      if (state.pendingSkinRewardDeferred && state.pendingSkinRewardName) {
        showQueuedSkinReward("pre-run");
        return;
      }
      openPreRunScreen();
      return;
    }
    state.returnToPreRunAfterBadgeRewards = true;
  }

  function advanceBadgeRewardSequence() {
    if (!state.badgeRewardActive || state.badgeRewardPhase !== "ready") {
      return;
    }

    state.badgeRewardIndex += 1;
    if (state.badgeRewardIndex >= state.pendingBadgeRewardQueue.length) {
      finishBadgeRewardSequence();
      return;
    }
    showCurrentBadgeRewardItem();
  }

  function updateBadgeRewardSequence(dt) {
    if (!state.badgeRewardActive) {
      return;
    }

    state.badgeRewardTimer += dt;
    if (state.badgeRewardPhase === "intro" && state.badgeRewardTimer >= 2) {
      state.badgeRewardPhase = "reveal";
      state.badgeRewardTimer = 0;
      state.badgeRewardShowRip = false;
      playUiBadgeRevealSound();
      if (badgeRewardOverlayEl) {
        badgeRewardOverlayEl.classList.remove("is-ready");
        badgeRewardOverlayEl.classList.add("is-revealing");
      }
      return;
    }

    if (state.badgeRewardPhase === "reveal" && state.badgeRewardTimer >= 0.85) {
      state.badgeRewardPhase = "ready";
      state.badgeRewardTimer = 0;
      if (badgeRewardOverlayEl) {
        badgeRewardOverlayEl.classList.add("is-ready");
      }
    }
  }

  function createEmptyRunBadgeStats() {
    return {
      questionPositive: 0,
      questionNegative: 0,
      livesLost: 0,
      cleanLevelsFinished: 0,
      levelHadLifeLoss: false,
      touchedNegativePickup: false
    };
  }

  function resetRunBadgeStats() {
    state.runBadgeStats = createEmptyRunBadgeStats();
  }

  function persistBadgeStats() {
    syncBadgeUnlockDates();
    state.badgeStatsDirty = true;
    if (state.preRunActive && state.preRunStep === "badges") {
      renderBadgesScreen();
    }
  }

  function flushBadgeStatsStorage(force, dt) {
    if (!state.badgeStatsDirty) {
      state.badgeStatsWriteElapsed = 0;
      return;
    }

    if (!force) {
      state.badgeStatsWriteElapsed += Math.max(0, Number(dt) || 0);
      if (state.badgeStatsWriteElapsed < 10) {
        return;
      }
    }

    writeBadgeStats();
    state.badgeStatsDirty = false;
    state.badgeStatsWriteElapsed = 0;
  }

  function incrementBadgeLifetimeStat(key, amount) {
    var delta = Number.isFinite(amount) ? amount : 1;
    if (!badgeStats.lifetime || !Number.isFinite(badgeStats.lifetime[key])) {
      return;
    }
    badgeStats.lifetime[key] = Math.max(0, badgeStats.lifetime[key] + delta);
    persistBadgeStats();
  }

  function updateBadgeBestStat(key, value) {
    var safe = Math.max(0, Number(value) || 0);
    if (!badgeStats.best || !Number.isFinite(badgeStats.best[key])) {
      return;
    }
    if (safe <= badgeStats.best[key]) {
      return;
    }
    badgeStats.best[key] = safe;
    persistBadgeStats();
  }

  function recordNegativePickupTouch() {
    state.runBadgeStats.touchedNegativePickup = true;
  }

  function recordCoinCollected(amount) {
    var delta = Number.isFinite(amount) ? amount : 1;
    state.collectedCoins += delta;
    state.levelCollectedCoins += delta;
    incrementBadgeLifetimeStat("totalCoins", delta);
    updateBadgeBestStat("singleRunCoins", state.collectedCoins);
  }

  function recordBagCollected(amount) {
    var delta = Number.isFinite(amount) ? amount : 1;
    state.collectedBags += delta;
    state.levelCollectedBags += delta;
    incrementBadgeLifetimeStat("totalBags", delta);
    updateBadgeBestStat("singleRunBags", state.collectedBags);
  }

  function recordLifeCollected(amount) {
    incrementBadgeLifetimeStat("livesCollected", Number.isFinite(amount) ? amount : 1);
  }

  function recordQuestionCoinOutcome(result) {
    if (result === "+") {
      state.runBadgeStats.questionPositive += 1;
      incrementBadgeLifetimeStat("questionPositive", 1);
      updateBadgeBestStat("singleRunQuestionPositive", state.runBadgeStats.questionPositive);
      return;
    }

    state.runBadgeStats.questionNegative += 1;
    incrementBadgeLifetimeStat("questionNegative", 1);
    updateBadgeBestStat("singleRunQuestionNegative", state.runBadgeStats.questionNegative);
    recordNegativePickupTouch();
  }

  function recordLifeLost() {
    state.runBadgeStats.livesLost += 1;
    state.runBadgeStats.levelHadLifeLoss = true;
    incrementBadgeLifetimeStat("livesLost", 1);
    updateBadgeBestStat("livesLostSingleRun", state.runBadgeStats.livesLost);
  }

  function recordShieldSave() {
    incrementBadgeLifetimeStat("shieldSaves", 1);
  }

  function recordTeleportUse(withShield) {
    incrementBadgeLifetimeStat("teleportsUsed", 1);
    if (withShield) {
      incrementBadgeLifetimeStat("shieldTeleports", 1);
    }
  }

  function recordMagnetPickup() {
    incrementBadgeLifetimeStat("magnetPickups", 1);
  }

  function recordFreshRunStartIfNeeded() {
    if (!state.pendingFreshRunStart) {
      return;
    }
    state.pendingFreshRunStart = false;
    incrementBadgeLifetimeStat("runsStarted", 1);
  }

  function updateSurvivorBadgeProgressForCurrentRun() {
    if (state.runBadgeStats.livesLost > 0) {
      return;
    }

    if (state.gameMode === 2 && state.gameDifficulty === "easy") {
      updateBadgeBestStat("survivorEasyJumpLevel", state.currentLevel);
      return;
    }
    if (state.gameMode === 2 && state.gameDifficulty === "hard") {
      updateBadgeBestStat("survivorHardJumpLevel", state.currentLevel);
      return;
    }
    if (state.gameMode === 1 && state.gameDifficulty === "hard") {
      updateBadgeBestStat("survivorHardFullLevel", state.currentLevel);
    }
  }

  function updatePuristBadgeProgressForCurrentRun() {
    if (state.runBadgeStats.touchedNegativePickup) {
      return;
    }
    updateBadgeBestStat("puristLevel", state.currentLevel);
  }

  function finalizeLevelBadgeProgress() {
    if (!state.runBadgeStats.levelHadLifeLoss) {
      state.runBadgeStats.cleanLevelsFinished += 1;
      updateBadgeBestStat("cleanLevelsSingleRun", state.runBadgeStats.cleanLevelsFinished);
    }
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
        C[key] = normalizeGlobalAdminStringValue(key, value);
      }
    }
  }

  function getMaxScoreStorageKey(mode, difficulty) {
    var playerId = getActiveProfileStoragePlayerId();
    if (!playerId) {
      return "";
    }
    return MAX_SCORE_STORAGE_KEY_PREFIX + playerId + "_" + String(difficulty) + "_" + String(mode);
  }

  function readMaxScoreFromStorage(mode, difficulty) {
    try {
      var storageKey = getMaxScoreStorageKey(mode, difficulty);
      if (!storageKey) {
        return 0;
      }
      var raw = window.localStorage.getItem(storageKey);
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
    var storageKey = getMaxScoreStorageKey(mode, difficulty);
    if (!storageKey) {
      return;
    }
    try {
      window.localStorage.setItem(storageKey, String(safeValue));
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

  function useBadgesV2() {
    return Boolean(C.badgesV2Enabled);
  }

  var BADGE_TROPHY_V2_FILE_NAMES_BY_SLUG = {
    bag_collector: "trophy_bag_collector.png",
    banger: "trophy_banger.png",
    big_spender: "trophy_big_spender.png",
    bubble_saver: "bubble_saver.png",
    coin_collector: "trophy_coin_collector.png",
    cursed: "trophy_cursed.png",
    doom_magnet: "trophy_doom_magnet.png",
    endless_greed: "endless_greed.png",
    first_runner: "trophy_first_runner.png",
    fortunate: "trophy_fortunate.png",
    greedy: "trophy_greedy.png",
    heart_hunter: "trophy_heart_hunter.png",
    jumper: "trophy_jumper.png",
    lucky: "trophy_lucky.png",
    magneto: "trophy_magneto.png",
    martyr: "trophy_martyr.png",
    purist: "trophy_purist.png",
    shopaholic: "trophy_shopaholic.png",
    speed_demon: "trophy_speed_demon.png",
    starter: "trophy_starter.png",
    still_runing: "trophy_still_runing.png",
    survivor: "trophy_survivor.png",
    shield_teleporter: "trophy_shield_teleporter.png",
    teleporter: "trophy_teleporter.png",
    unkillable_custommer: "trophy_unkillable_custommer.png",
    unlocker: "trophy_unlocker.png",
    unlucky: "trophy_unlucky.png",
    untouchable: "trophy_untouchable.png"
  };

  function getBadgeTrophyBasePath() {
    return useBadgesV2() ? "assets/gfx2/trophy_pics/v2" : "assets/gfx2/trophy_pics";
  }

  function getBadgeTrophyFallbackPath() {
    return getBadgeTrophyBasePath() + "/trophy_clean.png";
  }

  function getBadgeTrophyFileName(slug) {
    var normalizedSlug = String(slug || "");
    if (!normalizedSlug) {
      return "";
    }
    if (useBadgesV2()) {
      return BADGE_TROPHY_V2_FILE_NAMES_BY_SLUG[normalizedSlug] || ("trophy_" + normalizedSlug + ".png");
    }
    return "trophy_" + normalizedSlug + ".png";
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
      } else if (typeof C[key] === "string" && typeof value === "string") {
        if (isAudioLevelFieldKey(key)) {
          var normalizedAudioPath = sanitizeAudioPathValue(value);
          if (!normalizedAudioPath) {
            continue;
          }
          C[key] = normalizedAudioPath;
        } else {
          C[key] = value;
        }
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
        exportData.global[globalKey] = normalizeGlobalAdminStringValue(globalKey, C[globalKey]);
      } else if (typeof globalState[globalKey] === "string") {
        exportData.global[globalKey] = globalState[globalKey];
      } else if (typeof globalState[globalKey] === "boolean") {
        exportData.global[globalKey] = globalState[globalKey];
      } else if (Number.isFinite(globalState[globalKey])) {
        exportData.global[globalKey] = globalState[globalKey];
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
            } else if (typeof built[key] === "string") {
              snapshot[key] = isAudioLevelFieldKey(key) ? sanitizeAudioPathValue(built[key]) : String(built[key]);
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
        saveGlobalAdminField(globalKey, normalizeGlobalAdminStringValue(globalKey, parsed.global[globalKey]));
      } else if (typeof parsed.global[globalKey] === "string") {
        saveGlobalAdminField(globalKey, normalizeGlobalAdminStringValue(globalKey, parsed.global[globalKey]));
      } else if (Number.isFinite(parsed.global[globalKey])) {
        saveGlobalAdminField(globalKey, parsed.global[globalKey]);
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
            } else if (typeof value === "string") {
              persisted[key] = isAudioLevelFieldKey(key) ? sanitizeAudioPathValue(value) : String(value);
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
      } else if (typeof C[key] === "string" && typeof value === "string") {
        C[key] = isAudioLevelFieldKey(key) || isAudioGlobalPathKey(key)
          ? sanitizeAudioPathValue(value)
          : value;
      }
    }
  }

  function getLevelAudioPathOverrides(level) {
    var normalizedLevel = Math.max(1, Math.min(LEVEL_COUNT, Math.floor(Number(level) || 1)));
    var audioLevelFolder = normalizedLevel === 5 && state.levelXEndlessActive ? "levelx" : "level" + String(normalizedLevel);
    var prefix = audioLevelFolder === "levelx" ? "lx" : "l" + String(normalizedLevel);
    var basePath = "assets/" + audioLevelFolder + "/sound/" + prefix;
    return {
      levelMusicLoopPath: basePath + "-music-loop.mp3",
      levelJumpSoundPath: basePath + "-sfx-jump.wav",
      levelCoinSoundPath: basePath + "-sfx-coin.wav",
      levelBagSoundPath: basePath + "-sfx-bag.wav",
      levelQuestionCoinSoundPath: basePath + "-sfx-question-coin.wav",
      levelCrackedCoinSoundPath: basePath + "-sfx-cracked-coin.wav",
      levelCurseSoundPath: basePath + "-sfx-curse.wav",
      levelLifeSoundPath: basePath + "-sfx-life.wav",
      levelLifeLossSoundPath: basePath + "-sfx-life-loss.wav",
      levelShieldSoundPath: basePath + "-sfx-shield.wav",
      levelShieldBreakSoundPath: basePath + "-sfx-shield-break.wav",
      levelMagnetSoundPath: basePath + "-sfx-magnet.wav",
      levelSlowSoundPath: basePath + "-sfx-slow.wav",
      levelTeleportSoundPath: basePath + "-sfx-teleport.wav",
      levelDeathSoundPath: basePath + "-sfx-death.wav"
    };
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

    if (key === "questionCoinWinPercent" || key === "questionCoinLosePercent") {
      return Math.max(0, Math.round(value));
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

    var levelAudioOverrides = getLevelAudioPathOverrides(level);
    for (key in levelAudioOverrides) {
      if (Object.prototype.hasOwnProperty.call(levelAudioOverrides, key)) {
        cfg[key] = levelAudioOverrides[key];
      }
    }

    var storageOverrides = readAdminStorageObject(level, mode, difficulty);
    for (key in storageOverrides) {
      if (Object.prototype.hasOwnProperty.call(storageOverrides, key)) {
        if (
          isAudioLevelFieldKey(key) &&
          typeof storageOverrides[key] === "string" &&
          !sanitizeAudioPathValue(storageOverrides[key])
        ) {
          continue;
        }
        cfg[key] = storageOverrides[key];
      }
    }

    return cfg;
  }

  function getModeDisplayName(mode) {
    return mode === 1 ? "Jump Advanced" : "Jump Classic";
  }

  function getLevelDisplayName(level, showLevelXName) {
    if (level === 5 && showLevelXName) {
      return "Level X";
    }
    return "Level " + String(level);
  }

  function getConfiguredLevelGoalTargetScore(level, mode, difficulty) {
    var total = 0;
    for (var currentLevel = 1; currentLevel <= level; currentLevel += 1) {
      var cfg = buildModeConfig(currentLevel, mode, difficulty);
      var required = Math.max(0, Math.floor(Number(cfg.finishScore) || 0));
      if (currentLevel === 5) {
        required = isLevelXUnlocked() && !state.levelXEndlessActive
          ? Math.max(0, Math.floor(Number(cfg.level5ScoreGoal) || 0))
          : 0;
      }
      if (required <= 0) {
        return total;
      }
      total += required;
    }
    return total;
  }

  function getCurrentLevelGoalTargetScore() {
    var required = Math.max(0, Math.floor(Number(C.finishScore) || 0));
    if (state.currentLevel === 5) {
      required = isLevelXUnlocked() && !state.levelXEndlessActive
        ? Math.max(0, Math.floor(Number(C.level5ScoreGoal) || 0))
        : 0;
    }
    if (required <= 0) {
      return 0;
    }
    return Math.max(0, Math.floor(Number(state.scoreCarryOver) || 0)) + required;
  }

  function getLevel5ScoreGoal() {
    return Math.max(0, Math.floor(Number(C.level5ScoreGoal) || 0));
  }

  function getFinishScoreGoalText(targetScore) {
    if (!Number.isFinite(targetScore) || targetScore <= 0) {
      return "Final endless level. No finish teleport.";
    }
    return "Finish Level with " + targetScore.toLocaleString("en-US") + " score.";
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
    applyObjectConfig(getLevelAudioPathOverrides(level));
    loadAdminConfigFromStorage(level, mode, difficulty);
    applyStartScreenGfx2Migration();
  }

  snapshotConfigDefaults();

  var state = {
    running: true,
    adminPaused: false,
    gamePauseActive: false,
    inGameSettingsActive: false,
    inGameSettingsPreviousPreRunStep: null,
    inGameSettingsInputLockUntil: 0,
    preRunActive: false,
    preRunStep: "select",
    preRunGfx2FullLockNoticeActive: false,
    preRunLaunchActive: false,
    preRunLaunchElapsed: 0,
    preRunLaunchDuration: 2,
    preRunLaunchPhase: "ready",
    playerName: "",
    playerId: "",
    playerNamePromptActive: false,
    playerAuthPending: false,
    currentLevel: 1,
    highestLevelReached: 1,
    levelXUnlocked: false,
    hardModeOverride: "default",
    fullModeOverride: "default",
    updateNoticeActive: false,
    updateNoticeForce: false,
    whatsNewActive: false,
    badgeResetNoticeActive: false,
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
    lastHardUnlockShown: false,
    lastFullUnlockShown: false,
    score: 0,
    scoreCarryOver: 0,
    bonusScore: 0,
    runTimeSeconds: 0,
    levelRunTimeSeconds: 0,
    collectedCoins: 0,
    pendingRunCoinSpend: 0,
    collectedBags: 0,
    levelCollectedCoins: 0,
    levelCollectedBags: 0,
    runBadgeStats: {
      questionPositive: 0,
      questionNegative: 0,
      livesLost: 0,
      cleanLevelsFinished: 0,
      levelHadLifeLoss: false,
      touchedNegativePickup: false
    },
    pendingFreshRunStart: false,
    badgeCursedSecondsAccumulator: 0,
    badgeStatsDirty: false,
    badgeStatsWriteElapsed: 0,
    runUnlockedBadgeKeysAtStart: {},
    pendingBadgeRewardQueue: [],
    badgeRewardActive: false,
    badgeRewardIndex: 0,
    badgeRewardPhase: "idle",
    badgeRewardTimer: 0,
    badgeRewardShowRip: false,
    returnToPreRunAfterBadgeRewards: false,
    pendingSkinRewardName: "",
    pendingSkinRewardDeferred: false,
    pendingSkinRewardNextAction: "",
    gameOverInputBlockUntil: 0,
    lifeLossInvulnerabilityTimeLeft: 0,
    continueUsesThisRun: 0,
    continueAdUsesThisRun: 0,
    continueOfferActive: false,
    continuePurchaseOverlayActive: false,
    continuePurchaseSelectedLives: 0,
    continueAdWatchActive: false,
    continueAdWatchMode: "",
    continueAdWatchSecondsLeft: 0,
    continueAdWatchTimerId: 0,
    runFinalized: false,
    preRunDifficultyLockNoticeActive: false,
    preRunDifficultyFlipTimerId: 0,
    preRunGfx2SelectFrames: PRE_RUN_GFX2_ENTRANCE_FRAMES,
    preRunGfx2SelectAnimEnabled: true,
    preRunGfx2EntranceAnimStarted: false,
    preRunGfx2EntranceAnimTime: 0,
    preRunGfx2BackActive: false,
    preRunGfx2BackTime: 0,
    preRunGfx2BackFrames: null,
    preRunGfx2ClassicExitActive: false,
    preRunGfx2ClassicExitTime: 0,
    preRunGfx2AdvanceExitActive: false,
    preRunGfx2AdvanceExitTime: 0,
    preRunGfx2ScoresExitActive: false,
    preRunGfx2ScoresExitTime: 0,
    preRunGfx2BadgesExitActive: false,
    preRunGfx2BadgesExitTime: 0,
    preRunGfx2ShopExitActive: false,
    preRunGfx2ShopExitTime: 0,
    preRunGfx2SettingsExitActive: false,
    preRunGfx2SettingsExitTime: 0,
    preRunGfx2MineEntryActive: false,
    preRunGfx2MineEntryTime: 0,
    preRunGfx2MineExitActive: false,
    preRunGfx2MineExitTime: 0,
    preRunGfx2IdleCountdown: 20,
    preRunGfx2WaitActive: false,
    preRunGfx2WaitAnimTime: 0,
    preRunGfx2ShopSelection: null,
    preRunGfx2ShopVisitCoinTotal: 0,
    preRunGfx2ShopStatus: "",
    preRunGfx2ShopStatusTone: "info",
    preRunGfx2ShopStorageAdWatchActive: false,
    preRunGfx2ShopStorageAdWatchMode: "",
    preRunGfx2ShopStorageAdWatchSecondsLeft: 0,
    preRunGfx2ShopStorageAdWatchTimerId: 0,
    mineTransferAdWatchActive: false,
    mineTransferAdWatchMode: "",
    mineTransferAdWatchSecondsLeft: 0,
    mineTransferAdWatchTimerId: 0,
    mineMessageText: "",
    mineMessageTone: "info",
    mineMessageKey: "",
    mineMessageExpiresAt: 0,
    mineMessageFollowUpText: "",
    mineMessageFollowUpTone: "info",
    mineMessageFollowUpKey: "",
    mineMessageFollowUpDurationMs: 0,
    mineTransferMessagePhase: null,
    mineIdleTipStartedAt: 0,
    mineHalfFullAnnounced: false,
    mineIntroShown: false,
    mineStorageReminderSyncKey: "",
    preRunScores: createInitialPreRunScoresState(),
    preRunRulesPageIndex: 0,
    onlineHighscore: {
      loading: false,
      message: "",
      topScores: [],
      topPlayers: [],
      bestPlayerRank: null,
      bestScoreRank: null,
      currentRunRank: null,
      bestScore: 0,
      requestId: 0
    },
    maxLives: 1,
    livesLeft: 1,
    levelXEndlessActive: false,
    lifeLossFlashTimeLeft: 0,
    speedPercent: 0,
    scrollSpeed: C.worldAutoRunSpeed,
    speedSlowMultiplier: 1,
    slowTimeLeft: 0,
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
    continueShieldActive: false,
    continueShieldTimeLeft: 0,
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
    questionCoinAnimDuration: 1,
    questionCoinAnimStakeScore: 0,
    questionCoinAnimResult: "",
    questionCoinAnimDelta: 0,
    questionCoinAnimApplied: false,
    elevatorCoinsUnlocked: false,
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
      x: 0,
      y: 0,
      platformId: -1,
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
  var responsiveLayoutRefreshFrameId = 0;
  var responsiveLayoutRefreshTimeoutId = 0;
  var sessionMaxScore = 0;
  var globalAdminSections = [
    {
      title: "Global",
      fields: [
        { key: "fullscreenAutoEnabled", label: "Auto fullscreen on mobile", type: "checkbox" },
        { key: "modernVisualsEnabled", label: "Modern visuals", type: "checkbox" },
        { key: "badgesV2Enabled", label: "Badges v2", type: "checkbox" },
        { key: "adminPasswordRequired", label: "Require admin password", type: "checkbox" },
        { key: "adminPassword", label: "Admin password", type: "password" },
        { key: "selectedSkin", label: "Skin", type: "select", options: SKIN_OPTIONS },
        { key: "skinPickupLevels", label: "Skin Pickup Level", type: "skin-pickup-levels" },
        { key: "hardModeUnlockLevel", label: "Jump Classic Hard unlock at Level", type: "number", min: 1, max: LEVEL_COUNT, step: 1 },
        { key: "hardModeOverrideControls", label: "", type: "hard-mode-override-controls" },
        { key: "fullModeUnlockJumpHardScore", label: "Jump Advanced unlock on Jump Classic Hard score", type: "number", min: 0, step: 1 },
        { key: "fullModeOverrideControls", label: "", type: "full-mode-override-controls" }
      ]
    },
    {
      title: "Badges",
      fields: [
        { key: "badgeConfig", label: "", type: "badges-config" }
      ]
    },
    {
      title: "Shop",
      fields: [
        { key: "shopSummary", label: "", type: "shop-summary" },
        { key: "shopScorePerCoin", label: "Score Needed Per 1 Coin", type: "number", min: 1, step: 1 },
        { key: "shopRewardedAdCoins", label: "Rewarded Ad Coin Reward", type: "number", min: 0, step: 1 },
        { key: "shopContinuePrice1", label: "Continue Price", type: "number", min: 0, step: 1 },
        { key: "shopContinueLivesGranted", label: "Continue Lives Granted", type: "number", min: 1, step: 1 },
        { key: "shopKrobPrice", label: "Krob Price", type: "number", min: 0, step: 1 },
        { key: "shopSkin05Price", label: "Grey Price", type: "number", min: 0, step: 1 },
        { key: "shopSkin06Price", label: "Kaja Price", type: "number", min: 0, step: 1 },
        { key: "shopCubePrice", label: "Cube Price", type: "number", min: 0, step: 1 },
        { key: "shopSpecialLevelPrice", label: "New Level Price", type: "number", min: 0, step: 1 },
        { key: "shopMineShortTimerPrice", label: "Faster Maining Price", type: "number", min: 0, step: 1 },
        { key: "shopMineStorageLevel2Price", label: "Mine Storage Level 2 Ad Watches", type: "number", min: 0, step: 1 },
        { key: "shopMineStorageLevel3Price", label: "Mine Storage Level 3 Ad Watches", type: "number", min: 0, step: 1 },
        { key: "shopMineStorageLevel4Price", label: "Mine Storage Level 4 Ad Watches", type: "number", min: 0, step: 1 }
      ]
    },
    {
      title: "Mine",
      fields: [
        { key: "mineCoinTimerMs", label: "Coin Timer (ms)", type: "number", min: 1000, step: 1000 },
        { key: "mineShortTimerMs", label: "Faster Maining (ms)", type: "number", min: 1000, step: 1000 },
        { key: "mineStorageCapacity", label: "Storage", type: "number", min: 1, step: 1 },
        { key: "mineStorageCapacityL2", label: "Storage L2", type: "number", min: 1, step: 1 },
        { key: "mineStorageCapacityL3", label: "Storage L3", type: "number", min: 1, step: 1 },
        { key: "mineStorageCapacityL4", label: "Storage L4", type: "number", min: 1, step: 1 }
      ]
    },
    {
      title: "Sounds",
      fields: [
        { key: "audioMusicEnabled", label: "Music enabled", type: "checkbox" },
        { key: "audioSfxEnabled", label: "SFX enabled", type: "checkbox" },
        { key: "audioMasterVolumePercent", label: "Master volume %", type: "number", min: 0, max: 100, step: 1 },
        { key: "audioMusicVolumePercent", label: "Music volume %", type: "number", min: 0, max: 100, step: 1 },
        { key: "audioSfxVolumePercent", label: "SFX volume %", type: "number", min: 0, max: 100, step: 1 }
      ]
    }
  ];
  var adminSections = [
    {
      title: "Level Goal",
      fields: [
        { key: "finishScore", label: "Level Goal Score (0 = endless)", min: 0, step: 1, levels: [1, 2, 3, 4] },
        { key: "level5ScoreGoal", label: "Level 5 Score Goal", min: 0, step: 1, levels: [5] }
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
        { key: "questionCoinWinPercent", label: "Win percent" },
        { key: "questionCoinLosePercent", label: "Lose percent" },
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
        { key: "slowEffectSeconds", label: "Duration sec" },
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
    seedDefaultAdminStorageIfMissing();
    primeSceneArt();
    scheduleResponsiveLayoutRefresh();
    window.addEventListener("resize", scheduleResponsiveLayoutRefresh);
    document.addEventListener("visibilitychange", function () {
      setAudioAppActive(!document.hidden);
      if (!document.hidden) {
        checkForAvailableUpdate();
        scheduleUpdateCheckRetry(7000);
      }
    });
    window.addEventListener("pagehide", function () {
      setAudioAppActive(false);
    });
    window.addEventListener("pageshow", function () {
      setAudioAppActive(true);
      scheduleResponsiveLayoutRefresh();
    });
    window.addEventListener("blur", function () {
      if (document.hidden) {
        setAudioAppActive(false);
      }
    });
    window.addEventListener("focus", function () {
      if (!document.hidden) {
        setAudioAppActive(true);
      }
    });
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", scheduleResponsiveLayoutRefresh);
      window.visualViewport.addEventListener("scroll", scheduleResponsiveLayoutRefresh);
    }
    window.addEventListener("pointerdown", function () {
      if (state.preRunActive && state.preRunStep === "select") {
        unlockAudioIfNeeded();
      }
    }, true);
    document.addEventListener("fullscreenchange", function () {
      fullscreenRequested = Boolean(document.fullscreenElement);
      scheduleResponsiveLayoutRefresh();
    });
    applyModeConfig(state.currentLevel, state.gameMode, state.gameDifficulty);
    loadGlobalAdminConfig();
    state.playerName = readPlayerNameFromStorage();
    state.playerId = readPlayerIdFromStorage();
    if (!isAuthenticatedPlayerId(state.playerId) && !isGuestPlayerId(state.playerId)) {
      state.playerId = "";
      writePlayerIdToStorage("");
    }
    setActiveProfileStoragePlayerId(state.playerId);
    loadPlayerSkinProgress(true);
    resetOnlineHighscoreUi("");
    applyVisualThemeToUi();
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
    maybeShowWhatsNewNotice();
    checkForAvailableUpdate();
    scheduleUpdateCheckRetry(7000);
    maybeShowPlayerNamePromptIfMissing();
    primePreRunGfx2CloudMotion(true);
    requestAnimationFrame(loop);
  }

  function primeSceneArt() {
    loadSceneArtAsset(BACKGROUND_SKY_ART_PATH, function (image) {
      sceneArt.backgroundSky = image;
    });
    loadSceneArtAsset(BACKGROUND_FOREGROUND_ART_PATH, function (image) {
      sceneArt.backgroundForeground = image;
    });
    loadSceneArtAsset(LEVEL1_BORDER_ART_PATH, function (image) {
      sceneArt.level1Border = image;
    });
    loadSceneArtAsset(LEVEL2_BORDER_ART_PATH, function (image) {
      sceneArt.level2Border = image;
    });
    loadSceneArtAsset(LEVEL2_CAVE_LAYER1_ART_PATH, function (image) {
      sceneArt.level2Level1 = image;
    });
    loadSceneArtAsset(LEVEL2_CAVE_LAYER2_ART_PATH, function (image) {
      sceneArt.level2Level2 = image;
    });
    loadSceneArtAsset(LEVEL2_CAVE_LAYER3_ART_PATH, function (image) {
      sceneArt.level2Level3 = image;
    });
    loadSceneArtAsset(LEVEL2_CAVE_LAYER4_ART_PATH, function (image) {
      sceneArt.level2Level4 = image;
    });
    loadSceneArtAsset(LEVEL3_BORDER_ART_PATH, function (image) {
      sceneArt.level3Border = image;
    });
    loadSceneArtAsset(LEVEL3_LAYER1_ART_PATH, function (image) {
      sceneArt.level3Layer1 = image;
    });
    loadSceneArtAsset(LEVEL3_LAYER2_ART_PATH, function (image) {
      sceneArt.level3Layer2 = image;
    });
    loadSceneArtAsset(LEVEL3_LAYER3_ART_PATH, function (image) {
      sceneArt.level3Layer3 = image;
    });
    loadSceneArtAsset(LEVEL4_BORDER_ART_PATH, function (image) {
      sceneArt.level4Border = image;
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
    loadSceneArtAsset(LEVEL5_BORDER_ART_PATH, function (image) {
      sceneArt.level5Border = image;
    });
    loadSceneArtAsset(LEVELX_BACK_ART_PATH, function (image) {
      sceneArt.levelxBack = image;
    });
    loadSceneArtAsset(LEVELX_FRONT_ART_PATH, function (image) {
      sceneArt.levelxFront = image;
    });
    loadSceneArtAsset(LEVELX_BORDER_ART_PATH, function (image) {
      sceneArt.levelxBorder = image;
    });
    loadSceneArtAsset(LEVELX_PLATFORM_ART_PATH, function (image) {
      sceneArt.levelxPlatform = image;
    });
    loadSceneArtAsset(LEVELX_BLOCKER_ART_PATH, function (image) {
      sceneArt.levelxBlocker = image;
    });
    loadSceneArtAsset(LEVELX_ROCKET1_ART_PATH, function (image) {
      sceneArt.levelxRocket1 = image;
    });
    loadSceneArtAsset(LEVELX_ROCKET2_ART_PATH, function (image) {
      sceneArt.levelxRocket2 = image;
    });
    loadSceneArtAsset(LEVEL5_LAYER1_ART_PATH, function (image) {
      sceneArt.level5Layer1 = image;
    });
    loadSceneArtAsset(LEVEL5_LAYER2_ART_PATH, function (image) {
      sceneArt.level5Layer2 = image;
    });
    loadSceneArtAsset(LEVEL5_LAYER3_ART_PATH, function (image) {
      sceneArt.level5Layer3 = image;
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
          getLevelAssetPath(targetLevel, getLevelSceneArtFileName(targetLevel, targetKey)),
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
    if (key === "platform" && state.currentLevel === 5 && state.levelXEndlessActive && sceneArt.levelxPlatform) {
      return sceneArt.levelxPlatform;
    }
    if (key === "blocker" && state.currentLevel === 5 && state.levelXEndlessActive && sceneArt.levelxBlocker) {
      return sceneArt.levelxBlocker;
    }
    if (key === "rocket1" && state.currentLevel === 5 && state.levelXEndlessActive && sceneArt.levelxRocket1) {
      return sceneArt.levelxRocket1;
    }
    if (key === "rocket2" && state.currentLevel === 5 && state.levelXEndlessActive && sceneArt.levelxRocket2) {
      return sceneArt.levelxRocket2;
    }
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

  function getPreRunIntroNoteText(mode) {
    var lives = Math.max(1, Math.floor(Number(C.livesCount) || 1));
    var note = "Starting with " + lives.toLocaleString("en-US") + (lives === 1 ? " life" : " lives");
    if (mode === 2) {
      note += " and Double Jump always enabled";
    }
    return note + ".";
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

  function getModeControlsHtml(mode) {
    if (mode === 1) {
      return [
        "<p>Jump&nbsp;&nbsp;Left/Right</p>"
      ].join("");
    }

    return [
      "<p>Tap To Jump</p>",
      "<p><strong>Double Jump</strong> is always enabled</p>"
    ].join("");
  }

  function getGameOverBannerAssetPath() {
    var modeKey = state.gameMode === 1 ? "advanced" : "classic";
    var difficultyKey = state.gameDifficulty === "hard" ? "hard" : "easy";
    return "assets/gfx2/game_over_scr/gameover_" + modeKey + difficultyKey + ".png";
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
    var visibleSkinOptions = SKIN_OPTIONS.filter(function (option) {
      return option && option.value !== "Skin07";
    });
    for (var i = 0; i < visibleSkinOptions.length; i += 1) {
      var skinName = visibleSkinOptions[i].value;
      var isUnlocked = isSkinUnlocked(skinName);
      var isSelected = C.selectedSkin === skinName && isUnlocked;
      var skinBtn = document.createElement("button");
      skinBtn.type = "button";
      skinBtn.className = "pre-run-skin-btn";
      skinBtn.dataset.skin = skinName;
      if (!isUnlocked) {
        skinBtn.classList.add("locked");
        skinBtn.disabled = true;
      }
      if (isSelected) {
        skinBtn.classList.add("selected");
      }

      var preview = document.createElement("span");
      preview.className = "pre-run-skin-preview";
      var previewImg = document.createElement("img");
      previewImg.className = "pre-run-skin-preview-img pre-run-skin-preview-" + skinName.toLowerCase();
      previewImg.src = getSkinPreviewAssetPath(skinName, isSelected, isUnlocked);
      previewImg.alt = isUnlocked ? getSkinDisplayName(skinName) : "Locked skin";
      preview.appendChild(previewImg);

      var nameEl = document.createElement("span");
      nameEl.className = "pre-run-skin-name";
      nameEl.textContent = !isUnlocked && skinName === "Skin07" ? "????" : getSkinDisplayName(skinName);

      var statusEl = document.createElement("span");
      statusEl.className = "pre-run-skin-status";
      if (isUnlocked) {
        statusEl.textContent = isSelected ? "Selected" : "Unlocked";
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
      preRunDetailLevelEl.textContent = getLevelDisplayName(state.currentLevel, state.currentLevel === 5 && state.levelXEndlessActive);
    }
    if (preRunCompactLevelEl) {
      preRunCompactLevelEl.textContent = getLevelDisplayName(state.currentLevel, state.currentLevel === 5 && state.levelXEndlessActive);
    }
    var currentLevelGoalTarget = getCurrentLevelGoalTargetScore();
    if (preRunLevelGoalCopyEl) {
      preRunLevelGoalCopyEl.textContent = getFinishScoreGoalText(currentLevelGoalTarget);
    }
    if (preRunCompactGoalCopyEl) {
      preRunCompactGoalCopyEl.textContent = getFinishScoreGoalText(currentLevelGoalTarget);
    }
    if (preRunStartBtn) {
      preRunStartBtn.textContent = state.currentLevel > 1 ? "Continue" : "Start Run";
    }
    if (preRunCompactStartBtn) {
      preRunCompactStartBtn.setAttribute("aria-label", state.currentLevel > 1 ? "Start next level" : "Start run");
    }
    if (preRunCompactStartLabelEl) {
      preRunCompactStartLabelEl.textContent = "START";
    }
    if (preRunDetailLifeRulesEl) {
      preRunDetailLifeRulesEl.classList.toggle("hidden", false);
    }
    applyLifeRuleUi(briefTopDeathZoneRuleEl, C.livesApplyTopDeathZone);
    applyLifeRuleUi(briefProjectilesRuleEl, C.livesApplyProjectiles);
    applyLifeRuleUi(briefBlockerRuleEl, C.livesApplyBlocker);
    if (preRunControlsCopyEl) {
      preRunControlsCopyEl.innerHTML = getModeControlsHtml(state.gameMode);
    }
    refreshPreRunSkinSelection();
    if (preRunBackBtn) {
      preRunBackBtn.textContent = compactLevelBriefing ? "Exit Run" : "Back";
      preRunBackBtn.setAttribute("aria-label", compactLevelBriefing ? "Exit run and go back" : "Back to mode selection");
    }
    renderPreRunGfx2ClassicInside();
    renderPreRunGfx2AdvancedInside();
  }

  function renderPreRunGfx2ClassicInside() {
    renderPreRunGfx2Inside({
      isActive: isPreRunGfx2ClassicInsideActive(),
      rootEl: preRunClassicGfx2El,
      boardEl: preRunClassicGfx2BoardEl,
      levelValueEl: preRunClassicGfx2LevelValueEl,
      livesValueEl: preRunClassicGfx2LivesValueEl,
      controlsCopyEl: preRunClassicGfx2ControlsCopyEl,
      goalValueEl: preRunClassicGfx2GoalValueEl,
      noteEl: preRunClassicGfx2NoteEl,
      startBtn: preRunClassicGfx2StartBtn,
      easyBtn: preRunClassicGfx2EasyBtn,
      hardBtn: preRunClassicGfx2HardBtn,
      difficultyNoteEl: preRunClassicGfx2DifficultyNoteEl,
      skinButtons: getPreRunGfx2ClassicSkinButtons(),
      skinSlots: getPreRunGfx2ClassicSkinSlots(),
      skinAssetPath: getClassicGfx2SkinSlotAssetPath,
      floorSkin: {
        img: preRunClassicGfx2Skin7Img,
        button: preRunClassicGfx2Skin7Btn,
        skin: "Skin07",
        assetPrefix: "skin07"
      }
    });
  }

  function renderPreRunGfx2AdvancedInside() {
    renderPreRunGfx2Inside({
      isActive: isPreRunGfx2AdvancedInsideActive(),
      rootEl: preRunAdvancedGfx2El,
      boardEl: preRunAdvancedGfx2BoardEl,
      levelValueEl: preRunAdvancedGfx2LevelValueEl,
      livesValueEl: preRunAdvancedGfx2LivesValueEl,
      controlsCopyEl: preRunAdvancedGfx2ControlsCopyEl,
      goalValueEl: preRunAdvancedGfx2GoalValueEl,
      noteEl: preRunAdvancedGfx2NoteEl,
      startBtn: preRunAdvancedGfx2StartBtn,
      easyBtn: preRunAdvancedGfx2EasyBtn,
      hardBtn: preRunAdvancedGfx2HardBtn,
      difficultyNoteEl: preRunAdvancedGfx2DifficultyNoteEl,
      skinButtons: getPreRunGfx2AdvancedSkinButtons(),
      skinSlots: getPreRunGfx2AdvancedSkinSlots(),
      skinAssetPath: getAdvancedGfx2SkinSlotAssetPath,
      floorSkin: {
        img: preRunAdvancedGfx2Skin7Img,
        button: preRunAdvancedGfx2Skin7Btn,
        skin: "Skin07",
        assetPrefix: "skin07"
      }
    });
  }

  function renderPreRunGfx2Inside(config) {
    var hardUnlocked = isHardDifficultyUnlocked();
    var canChangeDifficulty = state.currentLevel <= 1;

    if (config.rootEl) {
      config.rootEl.classList.toggle("hidden", !config.isActive);
    }
    if (!config.isActive) {
      return;
    }

    updatePreRunGfx2InsideBoardMetrics(config.boardEl);

    if (config.levelValueEl) {
      config.levelValueEl.textContent = String(state.currentLevel);
    }
    if (config.livesValueEl) {
      config.livesValueEl.textContent = getLivesSummaryText();
    }
    if (config.controlsCopyEl) {
      config.controlsCopyEl.innerHTML = getModeControlsHtml(state.gameMode);
    }
    if (config.goalValueEl) {
      config.goalValueEl.textContent = getFinishScoreGoalText(getCurrentLevelGoalTargetScore());
    }
    if (config.noteEl) {
      var showIntroNote = state.currentLevel === 1;
      config.noteEl.classList.toggle("hidden", !showIntroNote);
      config.noteEl.textContent = getPreRunIntroNoteText(state.gameMode);
    }
    if (config.startBtn) {
      config.startBtn.setAttribute("aria-label", state.currentLevel > 1 ? "Continue run" : "Start run");
      config.startBtn.title = state.currentLevel > 1 ? "Continue" : "Start Run";
    }
    if (config.easyBtn) {
      config.easyBtn.classList.toggle("selected", state.gameDifficulty !== "hard");
      config.easyBtn.setAttribute("aria-pressed", state.gameDifficulty === "hard" ? "false" : "true");
      config.easyBtn.disabled = !canChangeDifficulty;
    }
    if (config.hardBtn) {
      config.hardBtn.classList.toggle("selected", state.gameDifficulty === "hard");
      config.hardBtn.classList.toggle("locked", !hardUnlocked || !canChangeDifficulty);
      config.hardBtn.setAttribute("aria-pressed", state.gameDifficulty === "hard" ? "true" : "false");
      config.hardBtn.disabled = !canChangeDifficulty;
      config.hardBtn.title = !canChangeDifficulty ? "Difficulty can only be changed before level 1" : hardUnlocked ? "" : getHardDifficultyLockText();
    }
    if (config.difficultyNoteEl) {
      config.difficultyNoteEl.classList.toggle("hidden", !canChangeDifficulty || !state.preRunDifficultyLockNoticeActive);
      config.difficultyNoteEl.textContent = getHardDifficultyLockText();
    }
    if (config.boardEl) {
      config.boardEl.classList.toggle("is-between-levels", !canChangeDifficulty);
    }

    config.skinButtons.forEach(function (entry) {
      if (!entry.button) {
        return;
      }
      var isFuture = !entry.skin;
      var unlocked = !isFuture && isSkinUnlocked(entry.skin);
      var selected = unlocked && C.selectedSkin === entry.skin;

      entry.button.classList.toggle("selected", selected);
      entry.button.classList.toggle("locked", !isFuture && !unlocked);
      entry.button.classList.toggle("future", isFuture);
      entry.button.disabled = isFuture || !unlocked;
      entry.button.setAttribute("aria-pressed", selected ? "true" : "false");
      if (!isFuture) {
        entry.button.title = unlocked ? getSkinDisplayName(entry.skin) : getSkinDisplayName(entry.skin) + " locked";
      }
    });

    if (config.skinSlots && config.skinSlots.length) {
      config.skinSlots.forEach(function (entry) {
        if (!entry.img) {
          return;
        }
        var isFuture = Boolean(entry.isFuture);
        var unlocked = !isFuture && entry.skin ? isSkinUnlocked(entry.skin) : false;
        var selected = unlocked && entry.skin && C.selectedSkin === entry.skin;
        var variant = isFuture || !unlocked ? "locked" : selected ? "selected" : "unselected";
        if (entry.slotIndex === 1 && variant === "locked") {
          variant = "unselected";
        }
        var assetPath = typeof config.skinAssetPath === "function"
          ? config.skinAssetPath(entry.slotIndex, variant)
          : getAdvancedGfx2SkinSlotAssetPath(entry.slotIndex, variant);
        entry.img.src = assetPath;
      });
    }

    if (config.floorSkin && config.floorSkin.img && config.floorSkin.button && config.floorSkin.skin) {
      var floorSkinUnlocked = isSkinUnlocked(config.floorSkin.skin);
      var floorSkinSelected = floorSkinUnlocked && C.selectedSkin === config.floorSkin.skin;
      var floorSkinVisible = floorSkinUnlocked;
      config.floorSkin.img.classList.toggle("hidden", !floorSkinVisible);
      config.floorSkin.button.classList.toggle("hidden", !floorSkinVisible);
      config.floorSkin.button.classList.toggle("selected", floorSkinSelected);
      config.floorSkin.button.classList.toggle("locked", !floorSkinVisible);
      config.floorSkin.button.disabled = !floorSkinVisible;
      config.floorSkin.button.setAttribute("aria-pressed", floorSkinSelected ? "true" : "false");
      config.floorSkin.button.title = floorSkinVisible
        ? getSkinDisplayName(config.floorSkin.skin)
        : getSkinDisplayName(config.floorSkin.skin) + " locked";
      config.floorSkin.img.src = floorSkinSelected
        ? "assets/skins/" + config.floorSkin.skin + "/" + config.floorSkin.assetPrefix + "_selected.png"
        : "assets/skins/" + config.floorSkin.skin + "/" + config.floorSkin.assetPrefix + "_unselected.png";
    }
  }

  function updatePreRunClassicGfx2BoardMetrics() {
    updatePreRunGfx2InsideBoardMetrics(preRunClassicGfx2BoardEl);
  }

  function updatePreRunGfx2InsideBoardMetrics(boardEl) {
    if (!boardEl) {
      return;
    }

    var rect = boardEl.getBoundingClientRect();
    var width = rect.width || 0;
    var height = rect.height || 0;
    var scale = Math.min(width / 470, height / 280);

    if (!width || !height) {
      return;
    }

    scale = Math.max(0.72, Math.min(1.16, scale));

    boardEl.style.setProperty("--classic-board-title-size", Math.max(16, Math.min(25, 19 * scale)).toFixed(2) + "px");
    boardEl.style.setProperty("--classic-board-copy-size", Math.max(14, Math.min(20, 16 * scale)).toFixed(2) + "px");
    boardEl.style.setProperty("--classic-board-note-size", Math.max(11, Math.min(14, 12 * scale)).toFixed(2) + "px");
    boardEl.style.setProperty("--classic-board-gap", Math.max(3, Math.min(7, 5 * scale)).toFixed(2) + "px");
    boardEl.style.setProperty("--classic-board-section-gap", Math.max(2, Math.min(6, 4 * scale)).toFixed(2) + "px");
    boardEl.style.setProperty("--classic-board-divider-gap", Math.max(0, Math.min(3, 1.5 * scale)).toFixed(2) + "px");
    boardEl.style.setProperty("--classic-board-row-gap", Math.max(6, Math.min(12, 8 * scale)).toFixed(2) + "px");
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getRulesPageCount() {
    var pages = preRunRulesPagesCache || [];
    return pages.length;
  }

  function getCurrentRulesPageIndex() {
    var pageCount = getRulesPageCount();
    if (!pageCount) {
      return 0;
    }
    return Math.max(0, Math.min(pageCount - 1, Math.floor(Number(state.preRunRulesPageIndex) || 0)));
  }

  function setCurrentRulesPageIndex(nextIndex) {
    var pageCount = getRulesPageCount();
    if (!pageCount) {
      return;
    }
    state.preRunRulesPageIndex = ((Math.floor(Number(nextIndex) || 0) % pageCount) + pageCount) % pageCount;
    renderPreRunScreen();
  }

  function buildRulesIconRow(iconClass, labelHtml, valueHtml) {
    var row = '<div class="brief-row">';
    row += '<span class="brief-icon ' + iconClass + '" aria-hidden="true"></span>';
    row += '<span><strong>' + labelHtml + ':</strong> ' + valueHtml + '</span>';
    row += '</div>';
    return row;
  }

  function buildRulesPages() {
    var pages = [];
    pages.push({
      title: "Overal Info",
      body: "Hrrra is a classic Run & Jump (Jump&Run) game.\n\nYou’ll play through several levels, and in each one you must earn a certain number of points for the teleport to the next level to appear. Only the last level is endless. You’ll keep playing it until you lose all your lives or fall into the lava at the bottom of the screen.\n\nIn each run, you can use one Continue, where you can buy lives with coins, and two Continues, where you get 3 lives for watching an ad.\n\nAt the start, only Classic Easy mode is unlocked, but you’ll gradually unlock Classic Hard, Advanced Easy, and Advanced Hard as well."
    });
    pages.push({
      title: "Classic Mode",
      body: "In Classic mode, double jump is always enabled. Collecting the Double Jump bonus grants you a triple jump for a short time.\n\nYou’ll see the number of lives for Easy and Hard modes at the start of the run, as well as the score required to complete each level."
    });
    pages.push({
      title: "Advanced Mode",
      body: "In Advanced mode, in addition to jumping, you can also speed up and slow down your character's movement. To speed up, hold the top-right corner of the screen; to slow down, hold the bottom-right corner of the screen. Tap the left half of the screen to jump."
    });

    pages.push({
      title: "Bonuses",
      bodyHtml:
        '<div class="pre-run-brief-columns pre-run-brief-columns-single">' +
          buildRulesIconRow("brief-coin", "Coin", "<span>+<strong>" + escapeHtml(C.coinScoreBonus) + "</strong> score.</span>") +
          buildRulesIconRow("brief-money", "Money Bag", "<span>+<strong>" + escapeHtml(C.scoreBagBonus) + "</strong> score.</span>") +
          buildRulesIconRow("brief-live", "Extra Live", "<span>restore 1 lost life up to max.</span>") +
          buildRulesIconRow("brief-jump-bonus", "Double / Triple Jump", "<span>Gain ability to jump more and higher.</span>") +
          buildRulesIconRow("brief-shield", "Shield", "<span>blocks one deadly hit and can save you from bottom death zone.</span>") +
          buildRulesIconRow("brief-skin-pickup", "Skin Unlock", "<span>collect it to unlock a new character skin.</span>") +
        '</div>'
    });

    pages.push({
      title: "Hazards",
      bodyHtml:
        '<div class="pre-run-brief-columns pre-run-brief-columns-single">' +
          buildRulesIconRow("brief-blocker", "Blocker", "<span>do not touch, always jump over it.</span>") +
          buildRulesIconRow("brief-projectile", "Projectile", "<span>do not touch.</span>") +
          buildRulesIconRow("brief-cracked-coin", "Cracked Coin", "<span>removes <strong>" + escapeHtml(C.crackedCoinPenaltyPercent) + "%</strong> of score earned in this level.</span>") +
          buildRulesIconRow("brief-question-coin", "Question Coin", "<span>gamble for a big score win or loss. Win <strong>+" + escapeHtml(C.questionCoinWinPercent) + "%</strong>, lose <strong>-" + escapeHtml(C.questionCoinLosePercent) + "%</strong>.</span>") +
          buildRulesIconRow("brief-curse", "Curse", "<span>normal score gain is frozen for <strong>" + escapeHtml(C.curseEffectSeconds) + "s</strong>.</span>") +
        '</div>'
    });

    pages.push({
      title: "Shop",
      body: "In the shop, you can purchase new skins that aren’t available in-game, as well as a new bonus level for the game, additional storage space, and faster coin mining in Mine.\n\nSome items can be purchased with coins, while others can be obtained by watching ads."
    });

    pages.push({
      title: "Mine",
      body: "Here you can mine coins, which you can use to buy extra lives for continues or purchase items in the shop.\n\nCoins are mined and automatically stored in your storage. Once it is full, mining stops. The moment you transfer them to your wallet, mining resumes. You can increase the storage size several times over in the shop, just as you can increase the mining speed."
    });

    return pages;
  }

  function loadRulesPages() {
    if (preRunRulesPagesCache) {
      return Promise.resolve(preRunRulesPagesCache);
    }
    if (preRunRulesPagesPromise) {
      return preRunRulesPagesPromise;
    }
    preRunRulesPagesCache = buildRulesPages();
    preRunRulesPagesPromise = Promise.resolve(preRunRulesPagesCache).then(function (pages) {
      preRunRulesPagesPromise = null;
      return pages;
    });
    return preRunRulesPagesPromise;
  }

  function renderPreRunRulesPage() {
    var pageCount = getRulesPageCount();
    var pageIndex = getCurrentRulesPageIndex();
    var page = preRunRulesPagesCache && preRunRulesPagesCache[pageIndex] ? preRunRulesPagesCache[pageIndex] : null;
    var pageTitle = page ? page.title : "Rules";

    if (preRunRulesPageTitleEl) {
      preRunRulesPageTitleEl.textContent = pageTitle;
    }
    if (preRunRulesTextEl) {
      var isHtml = Boolean(page && page.bodyHtml);
      preRunRulesTextEl.classList.toggle("is-html", isHtml);
      if (isHtml) {
        preRunRulesTextEl.innerHTML = page.bodyHtml;
      } else {
        preRunRulesTextEl.textContent = page && page.body ? page.body : "";
      }
    }
    if (preRunRulesPageLabelEl) {
      preRunRulesPageLabelEl.textContent = pageCount ? (pageIndex + 1) + " / " + pageCount : "0 / 0";
    }
    if (preRunRulesPrevBtn) {
      preRunRulesPrevBtn.disabled = pageCount <= 1;
    }
    if (preRunRulesNextBtn) {
      preRunRulesNextBtn.disabled = pageCount <= 1;
    }
  }

  function openPreRunRulesScreen() {
    state.preRunStep = "rules";
    state.preRunRulesPageIndex = 0;
    renderPreRunScreen();
    loadRulesPages().then(function () {
      if (state.preRunStep === "rules") {
        renderPreRunScreen();
      }
    });
  }

  function renderPreRunScreen() {
    var hardUnlocked = isHardDifficultyUnlocked();
    var fullUnlocked = isFullModeUnlocked();
    var showClassicGfx2Inside = isPreRunGfx2ClassicInsideActive();
    var showAdvancedGfx2Inside = isPreRunGfx2AdvancedInsideActive();
    var showGfx2Inside = showClassicGfx2Inside || showAdvancedGfx2Inside;
    var compactLevelBriefing = state.preRunStep === "details" && state.currentLevel > 1 && !showGfx2Inside;

    normalizeUnlockedPreRunSelection();
    syncPlayerNameUi();

    if (preRunSelectScreenEl) {
      preRunSelectScreenEl.classList.toggle("hidden", state.preRunStep !== "select");
    }
    if (preRunSelectGfx2El) {
      preRunSelectGfx2El.classList.toggle("hidden", state.preRunStep !== "select");
    }
    if (preRunBadgesScreenEl) {
      preRunBadgesScreenEl.classList.toggle("hidden", state.preRunStep !== "badges");
    }
    if (preRunScoresScreenEl) {
      preRunScoresScreenEl.classList.toggle("hidden", state.preRunStep !== "scores");
    }
    if (preRunRulesScreenEl) {
      preRunRulesScreenEl.classList.toggle("hidden", state.preRunStep !== "rules");
    }
    if (state.preRunStep === "rules") {
      renderPreRunRulesPage();
    }
    if (preRunCreditsScreenEl) {
      preRunCreditsScreenEl.classList.toggle("hidden", state.preRunStep !== "credits");
    }
    if (preRunShopScreenEl) {
      preRunShopScreenEl.classList.toggle("hidden", state.preRunStep !== "shop");
    }
    if (preRunMineInsideEl) {
      preRunMineInsideEl.classList.toggle("hidden", state.preRunStep !== "mine");
    }
    if (preRunSettingsScreenEl) {
      preRunSettingsScreenEl.classList.toggle("hidden", state.preRunStep !== "settings");
    }
    if (preRunDetailScreenEl) {
      preRunDetailScreenEl.classList.toggle("hidden", state.preRunStep !== "details");
    }
    if (preRunClassicGfx2El) {
      preRunClassicGfx2El.classList.toggle("hidden", !showClassicGfx2Inside);
    }
    if (preRunAdvancedGfx2El) {
      preRunAdvancedGfx2El.classList.toggle("hidden", !showAdvancedGfx2Inside);
    }
    if (preRunCompactShellEl) {
      preRunCompactShellEl.classList.toggle("hidden", !compactLevelBriefing);
    }
    if (preRunDetailFullContentEl) {
      preRunDetailFullContentEl.classList.toggle("hidden", compactLevelBriefing || showGfx2Inside);
    }
    if (preRunScreenEl) {
      preRunScreenEl.classList.toggle("is-launch-transition", state.preRunLaunchActive);
    }
    if (preRunDifficultyToggleEl) {
      var difficultyImageName = state.preRunDifficultyLockNoticeActive
        ? "reachl5tounlock.png"
        : state.gameDifficulty === "hard"
          ? "hard.png"
          : "easy.png";
      if (preRunDifficultyImageEl) {
        preRunDifficultyImageEl.src = "assets/gfx2/buttons/" + difficultyImageName;
        preRunDifficultyImageEl.alt = state.preRunDifficultyLockNoticeActive
          ? "Reach level 5 to unlock hard difficulty"
          : state.gameDifficulty === "hard"
            ? "Hard difficulty"
            : "Easy difficulty";
      }
      preRunDifficultyToggleEl.classList.toggle("locked", !hardUnlocked && state.gameDifficulty !== "hard");
      preRunDifficultyToggleEl.title = hardUnlocked ? "" : getHardDifficultyLockText();
      preRunDifficultyToggleEl.setAttribute(
        "aria-label",
        state.preRunDifficultyLockNoticeActive
          ? "Hard difficulty locked"
          : state.gameDifficulty === "hard"
            ? "Difficulty set to Hard"
            : "Difficulty set to Easy"
      );
    }
    if (preRunDifficultyRowEl) {
      var difficultyBoardEl = showClassicGfx2Inside
        ? preRunClassicGfx2BoardEl
        : (showAdvancedGfx2Inside ? preRunAdvancedGfx2BoardEl : null);
      preRunDifficultyRowEl.classList.toggle("hidden", !difficultyBoardEl);
      if (difficultyBoardEl && preRunDifficultyRowEl.parentNode !== difficultyBoardEl) {
        difficultyBoardEl.insertBefore(preRunDifficultyRowEl, difficultyBoardEl.firstChild);
      }
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
    if (preRunGfx2AdvancedBtn) {
      preRunGfx2AdvancedBtn.classList.toggle("locked", !fullUnlocked);
      preRunGfx2AdvancedBtn.setAttribute("aria-disabled", fullUnlocked ? "false" : "true");
      preRunGfx2AdvancedBtn.title = fullUnlocked ? "" : getFullModeLockText();
    }
    if (preRunGfx2LockNoteEl) {
      preRunGfx2LockNoteEl.classList.toggle("hidden", !state.preRunGfx2FullLockNoticeActive);
      preRunGfx2LockNoteEl.textContent = getFullModeLockText();
    }
    if (preRunLaunchOverlayEl) {
      preRunLaunchOverlayEl.classList.toggle("hidden", !state.preRunLaunchActive);
      preRunLaunchOverlayEl.classList.toggle(
        "phase-ready",
        state.preRunLaunchActive && state.preRunLaunchPhase === "ready"
      );
      preRunLaunchOverlayEl.classList.toggle("phase-run", state.preRunLaunchActive && state.preRunLaunchPhase === "run");
    }
    if (preRunLaunchCopyEl) {
      preRunLaunchCopyEl.textContent = state.preRunLaunchPhase === "run" ? "RUN!" : "READY...";
      var phaseProgress = state.preRunLaunchPhase === "run"
        ? Math.max(0, Math.min(1, state.preRunLaunchElapsed - 1))
        : Math.max(0, Math.min(1, state.preRunLaunchElapsed));
      var scale = 0.18 + phaseProgress * 1.22;
      var opacity = 0.25 + phaseProgress * 0.75;
      preRunLaunchCopyEl.style.transform = "scale(" + scale.toFixed(3) + ")";
      preRunLaunchCopyEl.style.opacity = String(Math.max(0, Math.min(1, opacity)));
    }
    if (state.preRunStep === "badges") {
      renderBadgesScreen();
    }
    if (state.preRunStep === "scores") {
      renderPreRunScoresScreen();
    }
    if (state.preRunStep === "shop") {
      renderPreRunShopScreen();
    }
    if (state.preRunStep === "mine") {
      renderPreRunMineScreen();
    }
    if (preRunCreditsVersionEl) {
      preRunCreditsVersionEl.textContent = "v" + String((APP_VERSION_INFO && APP_VERSION_INFO.versionName) || "0.0.0");
    }
    if (state.preRunStep === "settings") {
      renderPreRunSettingsScreen();
    }
    renderPreRunGfx2ClassicInside();
    renderPreRunGfx2AdvancedInside();
    stopBadgesPageMusicIfLeaving();
    updatePreRunGfx2EntranceAnimation(0);
    refreshMusicPlayback();
  }

  function getPreRunGfx2EntranceAnimationActive() {
    return state.preRunActive &&
      state.preRunStep === "select" &&
      isGfx2StartScreenEnabled() &&
      !state.preRunGfx2BackActive &&
      !state.preRunGfx2MineEntryActive &&
      !state.preRunGfx2MineExitActive &&
      !state.preRunGfx2ClassicExitActive &&
      !state.preRunGfx2AdvanceExitActive &&
      !state.preRunGfx2ScoresExitActive &&
      !state.preRunGfx2BadgesExitActive &&
      !state.preRunGfx2ShopExitActive &&
      !state.preRunGfx2SettingsExitActive &&
      !state.preRunLaunchActive;
  }

  function getPreRunGfx2SelectFrames() {
    return Array.isArray(state.preRunGfx2SelectFrames) && state.preRunGfx2SelectFrames.length
      ? state.preRunGfx2SelectFrames
      : PRE_RUN_GFX2_ENTRANCE_FRAMES;
  }

  function isPreRunGfx2SceneTransitionActive() {
    return state.preRunGfx2BackActive ||
      state.preRunGfx2ClassicExitActive ||
      state.preRunGfx2AdvanceExitActive ||
      state.preRunGfx2ScoresExitActive ||
      state.preRunGfx2BadgesExitActive ||
      state.preRunGfx2ShopExitActive ||
      state.preRunGfx2SettingsExitActive ||
      state.preRunGfx2MineEntryActive ||
      state.preRunGfx2MineExitActive;
  }

  function resetPreRunGfx2SelectScene() {
    state.preRunGfx2SelectFrames = PRE_RUN_GFX2_ENTRANCE_FRAMES;
    state.preRunGfx2SelectAnimEnabled = true;
    state.preRunGfx2EntranceAnimStarted = false;
    state.preRunGfx2EntranceAnimTime = 0;
    state.preRunGfx2BackActive = false;
    state.preRunGfx2BackTime = 0;
    state.preRunGfx2BackFrames = null;
    state.preRunGfx2MineEntryActive = false;
    state.preRunGfx2MineEntryTime = 0;
    state.preRunGfx2MineExitActive = false;
    state.preRunGfx2MineExitTime = 0;
    state.preRunGfx2IdleCountdown = 20;
    state.preRunGfx2WaitActive = false;
    state.preRunGfx2WaitAnimTime = 0;
  }

  function resetPreRunGfx2IdleCountdown() {
    state.preRunGfx2IdleCountdown = 20;
    state.preRunGfx2WaitActive = false;
    state.preRunGfx2WaitAnimTime = 0;
  }

  function startPreRunGfx2BackAnimation(frames) {
    if (!Array.isArray(frames) || !frames.length) {
      state.preRunStep = "select";
      renderPreRunScreen();
      return;
    }
    state.preRunStep = "select";
    state.preRunGfx2BackActive = true;
    state.preRunGfx2BackTime = 0;
    state.preRunGfx2BackFrames = frames;
    state.preRunGfx2SelectFrames = frames;
    state.preRunGfx2SelectAnimEnabled = false;
    state.preRunGfx2EntranceAnimStarted = false;
    state.preRunGfx2EntranceAnimTime = 0;
    resetPreRunGfx2IdleCountdown();
    setPreRunGfx2ForegroundFrame(0, frames);
    renderPreRunScreen();
  }

  function startPreRunGfx2MineEntryAnimation() {
    if (!Array.isArray(PRE_RUN_GFX2_MINE_ENTRY_FRAMES) || !PRE_RUN_GFX2_MINE_ENTRY_FRAMES.length) {
      openPreRunMineScreen();
      return;
    }
    state.preRunStep = "select";
    state.preRunGfx2MineEntryActive = true;
    state.preRunGfx2MineEntryTime = 0;
    resetPreRunGfx2IdleCountdown();
    setPreRunGfx2ForegroundFrame(PRE_RUN_GFX2_MINE_ENTRY_FRAMES.length - 1, PRE_RUN_GFX2_MINE_ENTRY_FRAMES);
    renderPreRunScreen();
  }

  function startPreRunGfx2MineExitAnimation() {
    if (!Array.isArray(PRE_RUN_GFX2_MINE_ENTRY_FRAMES) || !PRE_RUN_GFX2_MINE_ENTRY_FRAMES.length) {
      handlePreRunMineBackNavigationImmediate();
      return;
    }
    state.preRunStep = "select";
    state.preRunGfx2MineExitActive = true;
    state.preRunGfx2MineExitTime = 0;
    state.preRunGfx2SelectAnimEnabled = false;
    state.preRunGfx2SelectFrames = PRE_RUN_GFX2_ENTRANCE_FRAMES;
    resetPreRunGfx2IdleCountdown();
    setPreRunGfx2ForegroundFrame(PRE_RUN_GFX2_MINE_ENTRY_FRAMES.length - 1, PRE_RUN_GFX2_MINE_ENTRY_FRAMES);
    renderPreRunScreen();
  }

  function handlePreRunMineBackNavigationImmediate() {
    playUiPageOpenSound();
    state.preRunGfx2MineEntryActive = false;
    state.preRunGfx2MineEntryTime = 0;
    state.preRunGfx2MineExitActive = false;
    state.preRunGfx2MineExitTime = 0;
    state.preRunGfx2SelectAnimEnabled = false;
    state.preRunGfx2SelectFrames = PRE_RUN_GFX2_ENTRANCE_FRAMES;
    clearMineTransferAdWatchTimer();
    state.mineTransferAdWatchActive = false;
    state.mineTransferAdWatchMode = "";
    state.mineTransferAdWatchSecondsLeft = 0;
    state.preRunStep = "select";
    renderPreRunScreen();
  }

  if (preRunSelectGfx2El) {
    preRunSelectGfx2El.addEventListener("pointerdown", function () {
      if (state.preRunActive && state.preRunStep === "select" && isGfx2StartScreenEnabled()) {
        resetPreRunGfx2IdleCountdown();
      }
    }, true);
  }

  document.addEventListener("keydown", function () {
    if (state.preRunActive && state.preRunStep === "select" && isGfx2StartScreenEnabled()) {
      resetPreRunGfx2IdleCountdown();
    }
  }, true);

  function updatePreRunGfx2WaitAnimation(dt) {
    if (!preRunGfx2ForegroundEl) {
      return;
    }

    var canRunIdleWait = state.preRunActive &&
      state.preRunStep === "select" &&
      isGfx2StartScreenEnabled() &&
      !state.preRunLaunchActive &&
      !state.preRunGfx2BackActive &&
      !state.preRunGfx2ClassicExitActive &&
      !state.preRunGfx2AdvanceExitActive &&
      !state.preRunGfx2ScoresExitActive &&
      !state.preRunGfx2BadgesExitActive &&
      !state.preRunGfx2ShopExitActive &&
      !state.preRunGfx2SettingsExitActive &&
      !state.preRunGfx2MineEntryActive &&
      !state.preRunGfx2MineExitActive;

    if (!canRunIdleWait) {
      if (state.preRunGfx2WaitActive) {
        state.preRunGfx2WaitActive = false;
        state.preRunGfx2WaitAnimTime = 0;
      }
      return;
    }

    if (state.preRunGfx2WaitActive) {
      if (!arePreRunGfx2FramesReady(PRE_RUN_GFX2_WAIT_FRAMES)) {
        preloadPreRunGfx2EntranceFrames();
        setPreRunGfx2ForegroundFrame(0, PRE_RUN_GFX2_WAIT_FRAMES);
        return;
      }

      if (dt > 0) {
        state.preRunGfx2WaitAnimTime = Math.min(PRE_RUN_GFX2_WAIT_ANIM_SECONDS, state.preRunGfx2WaitAnimTime + dt);
      }

      var waitProgress = Math.max(
        0,
        Math.min(1, state.preRunGfx2WaitAnimTime / PRE_RUN_GFX2_WAIT_ANIM_SECONDS)
      );
      var waitFrameIndex = Math.min(
        PRE_RUN_GFX2_WAIT_FRAMES.length - 1,
        Math.floor(waitProgress * PRE_RUN_GFX2_WAIT_FRAMES.length)
      );
      setPreRunGfx2ForegroundFrame(waitFrameIndex, PRE_RUN_GFX2_WAIT_FRAMES);

      if (waitProgress >= 1) {
        state.preRunGfx2WaitActive = false;
        state.preRunGfx2WaitAnimTime = 0;
        state.preRunGfx2IdleCountdown = 15;
        setPreRunGfx2ForegroundFrame(
          getPreRunGfx2SelectFrames().length - 1,
          getPreRunGfx2SelectFrames()
        );
      }
      return;
    }

    if (state.preRunGfx2IdleCountdown > 0 && dt > 0) {
      state.preRunGfx2IdleCountdown = Math.max(0, state.preRunGfx2IdleCountdown - dt);
    }

    if (state.preRunGfx2IdleCountdown <= 0) {
      state.preRunGfx2WaitActive = true;
      state.preRunGfx2WaitAnimTime = 0;
      setPreRunGfx2ForegroundFrame(0, PRE_RUN_GFX2_WAIT_FRAMES);
    }
  }

  function setPreRunGfx2ForegroundFrame(frameIndex, frames) {
    if (!preRunGfx2ForegroundEl) {
      return;
    }
    var activeFrames = Array.isArray(frames) && frames.length ? frames : PRE_RUN_GFX2_ENTRANCE_FRAMES;
    var clampedIndex = Math.max(0, Math.min(activeFrames.length - 1, frameIndex));
    preRunGfx2ForegroundEl.style.backgroundImage = 'url("' + activeFrames[clampedIndex] + '")';
  }

  function updatePreRunGfx2EntranceAnimation(dt) {
    if (!preRunGfx2ForegroundEl) {
      return;
    }

    if (state.preRunGfx2MineEntryActive || state.preRunGfx2MineExitActive) {
      return;
    }

    var activeFrames = getPreRunGfx2SelectFrames();

    if (!getPreRunGfx2EntranceAnimationActive()) {
      setPreRunGfx2ForegroundFrame(activeFrames.length - 1, activeFrames);
      return;
    }

    if (!state.preRunGfx2SelectAnimEnabled) {
      setPreRunGfx2ForegroundFrame(activeFrames.length - 1, activeFrames);
      return;
    }

    if (!arePreRunGfx2FramesReady(activeFrames)) {
      preloadPreRunGfx2EntranceFrames();
      state.preRunGfx2EntranceAnimStarted = false;
      state.preRunGfx2EntranceAnimTime = 0;
      setPreRunGfx2ForegroundFrame(activeFrames.length - 1, activeFrames);
      return;
    }

    if (!state.preRunGfx2EntranceAnimStarted) {
      state.preRunGfx2EntranceAnimStarted = true;
      state.preRunGfx2EntranceAnimTime = 0;
    } else if (dt > 0) {
      state.preRunGfx2EntranceAnimTime = Math.min(1, state.preRunGfx2EntranceAnimTime + dt);
    }

    var progress = Math.max(0, Math.min(1, state.preRunGfx2EntranceAnimTime / 1));
    var frameIndex = Math.min(
      activeFrames.length - 1,
      Math.floor(progress * activeFrames.length)
    );
    setPreRunGfx2ForegroundFrame(frameIndex, activeFrames);
  }

  function updatePreRunGfx2MineEntryAnimation(dt) {
    if (!preRunGfx2ForegroundEl) {
      return;
    }

    if (!state.preRunGfx2MineEntryActive) {
      state.preRunGfx2MineEntryTime = 0;
      return;
    }

    if (!arePreRunGfx2FramesReady(PRE_RUN_GFX2_MINE_ENTRY_FRAMES)) {
      preloadPreRunGfx2EntranceFrames();
      setPreRunGfx2ForegroundFrame(0, PRE_RUN_GFX2_MINE_ENTRY_FRAMES);
      return;
    }

    if (dt > 0) {
      state.preRunGfx2MineEntryTime = Math.min(PRE_RUN_GFX2_MINE_ENTRY_ANIM_SECONDS, state.preRunGfx2MineEntryTime + dt);
    }

    var progress = Math.max(0, Math.min(1, state.preRunGfx2MineEntryTime / PRE_RUN_GFX2_MINE_ENTRY_ANIM_SECONDS));
    var frameIndex = Math.max(
      0,
      (PRE_RUN_GFX2_MINE_ENTRY_FRAMES.length - 1) - Math.floor(progress * (PRE_RUN_GFX2_MINE_ENTRY_FRAMES.length - 1))
    );
    setPreRunGfx2ForegroundFrame(frameIndex, PRE_RUN_GFX2_MINE_ENTRY_FRAMES);

    if (progress >= 1) {
      state.preRunGfx2MineEntryActive = false;
      state.preRunGfx2MineEntryTime = 0;
      openPreRunMineScreen();
    }
  }

  function updatePreRunMineExitAnimation(dt) {
    if (!preRunGfx2ForegroundEl) {
      return;
    }

    if (!state.preRunGfx2MineExitActive) {
      state.preRunGfx2MineExitTime = 0;
      return;
    }

    if (!arePreRunGfx2FramesReady(PRE_RUN_GFX2_MINE_ENTRY_FRAMES)) {
      preloadPreRunGfx2EntranceFrames();
      setPreRunGfx2ForegroundFrame(0, PRE_RUN_GFX2_MINE_ENTRY_FRAMES);
      return;
    }

    if (dt > 0) {
      state.preRunGfx2MineExitTime = Math.min(PRE_RUN_GFX2_MINE_ENTRY_ANIM_SECONDS, state.preRunGfx2MineExitTime + dt);
    }

    var progress = Math.max(0, Math.min(1, state.preRunGfx2MineExitTime / PRE_RUN_GFX2_MINE_ENTRY_ANIM_SECONDS));
    var frameIndex = Math.min(
      PRE_RUN_GFX2_MINE_ENTRY_FRAMES.length - 1,
      Math.floor(progress * (PRE_RUN_GFX2_MINE_ENTRY_FRAMES.length - 1))
    );
    setPreRunGfx2ForegroundFrame(frameIndex, PRE_RUN_GFX2_MINE_ENTRY_FRAMES);

    if (progress >= 1) {
      state.preRunGfx2MineExitActive = false;
      state.preRunGfx2MineExitTime = 0;
      handlePreRunMineBackNavigationImmediate();
    }
  }

  function updatePreRunGfx2BackAnimation(dt) {
    if (!preRunGfx2ForegroundEl) {
      return;
    }

    if (!state.preRunGfx2BackActive) {
      state.preRunGfx2BackTime = 0;
      return;
    }

    var activeFrames = Array.isArray(state.preRunGfx2BackFrames) && state.preRunGfx2BackFrames.length
      ? state.preRunGfx2BackFrames
      : getPreRunGfx2SelectFrames();

    if (!arePreRunGfx2FramesReady(activeFrames)) {
      preloadPreRunGfx2EntranceFrames();
      setPreRunGfx2ForegroundFrame(0, activeFrames);
      return;
    }

    if (dt > 0) {
      state.preRunGfx2BackTime = Math.min(1, state.preRunGfx2BackTime + dt);
    }

    var progress = Math.max(0, Math.min(1, state.preRunGfx2BackTime / 1));
    var frameIndex = Math.min(
      activeFrames.length - 1,
      Math.floor(progress * activeFrames.length)
    );
    setPreRunGfx2ForegroundFrame(frameIndex, activeFrames);

    if (progress >= 1) {
      state.preRunGfx2BackActive = false;
      state.preRunGfx2BackTime = 0;
      state.preRunGfx2BackFrames = null;
      state.preRunGfx2SelectFrames = activeFrames;
      state.preRunGfx2SelectAnimEnabled = false;
      playUiPageOpenSound();
      renderPreRunScreen();
    }
  }

  function updatePreRunGfx2ClassicExitAnimation(dt) {
    if (!preRunGfx2ForegroundEl) {
      return;
    }

    if (!state.preRunGfx2ClassicExitActive) {
      state.preRunGfx2ClassicExitTime = 0;
      return;
    }

    if (!arePreRunGfx2FramesReady(PRE_RUN_GFX2_CLASSIC_FRAMES)) {
      preloadPreRunGfx2EntranceFrames();
      setPreRunGfx2ForegroundFrame(PRE_RUN_GFX2_CLASSIC_FRAMES.length - 1, PRE_RUN_GFX2_CLASSIC_FRAMES);
      return;
    }

    if (dt > 0) {
      state.preRunGfx2ClassicExitTime = Math.min(1, state.preRunGfx2ClassicExitTime + dt);
    }

    var progress = Math.max(0, Math.min(1, state.preRunGfx2ClassicExitTime / 1));
    var frameIndex = Math.min(
      PRE_RUN_GFX2_CLASSIC_FRAMES.length - 1,
      Math.floor(progress * PRE_RUN_GFX2_CLASSIC_FRAMES.length)
    );
    setPreRunGfx2ForegroundFrame(frameIndex, PRE_RUN_GFX2_CLASSIC_FRAMES);

    if (progress >= 1) {
      state.preRunGfx2ClassicExitActive = false;
      state.preRunGfx2ClassicExitTime = 0;
      playUiPageOpenSound();
      openPreRunModeDetails(2);
    }
  }

  function updatePreRunGfx2AdvanceExitAnimation(dt) {
    if (!preRunGfx2ForegroundEl) {
      return;
    }

    if (!state.preRunGfx2AdvanceExitActive) {
      state.preRunGfx2AdvanceExitTime = 0;
      return;
    }

    if (!arePreRunGfx2FramesReady(PRE_RUN_GFX2_ADVANCE_FRAMES)) {
      preloadPreRunGfx2EntranceFrames();
      setPreRunGfx2ForegroundFrame(PRE_RUN_GFX2_ADVANCE_FRAMES.length - 1, PRE_RUN_GFX2_ADVANCE_FRAMES);
      return;
    }

    if (dt > 0) {
      state.preRunGfx2AdvanceExitTime = Math.min(1, state.preRunGfx2AdvanceExitTime + dt);
    }

    var progress = Math.max(0, Math.min(1, state.preRunGfx2AdvanceExitTime / 1));
    var frameIndex = Math.min(
      PRE_RUN_GFX2_ADVANCE_FRAMES.length - 1,
      Math.floor(progress * PRE_RUN_GFX2_ADVANCE_FRAMES.length)
    );
    setPreRunGfx2ForegroundFrame(frameIndex, PRE_RUN_GFX2_ADVANCE_FRAMES);

    if (progress >= 1) {
      state.preRunGfx2AdvanceExitActive = false;
      state.preRunGfx2AdvanceExitTime = 0;
      playUiPageOpenSound();
      openPreRunModeDetails(1);
    }
  }

  function updatePreRunGfx2ScoresExitAnimation(dt) {
    if (!preRunGfx2ForegroundEl) {
      return;
    }

    if (!state.preRunGfx2ScoresExitActive) {
      state.preRunGfx2ScoresExitTime = 0;
      return;
    }

    if (!arePreRunGfx2FramesReady(PRE_RUN_GFX2_SCORES_FRAMES)) {
      preloadPreRunGfx2EntranceFrames();
      setPreRunGfx2ForegroundFrame(PRE_RUN_GFX2_SCORES_FRAMES.length - 1, PRE_RUN_GFX2_SCORES_FRAMES);
      return;
    }

    if (dt > 0) {
      state.preRunGfx2ScoresExitTime = Math.min(1, state.preRunGfx2ScoresExitTime + dt);
    }

    var progress = Math.max(0, Math.min(1, state.preRunGfx2ScoresExitTime / 1));
    var frameIndex = Math.min(
      PRE_RUN_GFX2_SCORES_FRAMES.length - 1,
      Math.floor(progress * PRE_RUN_GFX2_SCORES_FRAMES.length)
    );
    setPreRunGfx2ForegroundFrame(frameIndex, PRE_RUN_GFX2_SCORES_FRAMES);

    if (progress >= 1) {
      state.preRunGfx2ScoresExitActive = false;
      state.preRunGfx2ScoresExitTime = 0;
      state.preRunStep = "scores";
      renderPreRunScreen();
      loadPreRunScoresBoards();
    }
  }

  function updatePreRunGfx2BadgesExitAnimation(dt) {
    if (!preRunGfx2ForegroundEl) {
      return;
    }

    if (!state.preRunGfx2BadgesExitActive) {
      state.preRunGfx2BadgesExitTime = 0;
      return;
    }

    if (!arePreRunGfx2FramesReady(PRE_RUN_GFX2_BADGES_FRAMES)) {
      preloadPreRunGfx2EntranceFrames();
      setPreRunGfx2ForegroundFrame(PRE_RUN_GFX2_BADGES_FRAMES.length - 1, PRE_RUN_GFX2_BADGES_FRAMES);
      return;
    }

    if (dt > 0) {
      state.preRunGfx2BadgesExitTime = Math.min(1, state.preRunGfx2BadgesExitTime + dt);
    }

    var progress = Math.max(0, Math.min(1, state.preRunGfx2BadgesExitTime / 1));
    var frameIndex = Math.min(
      PRE_RUN_GFX2_BADGES_FRAMES.length - 1,
      Math.floor(progress * PRE_RUN_GFX2_BADGES_FRAMES.length)
    );
    setPreRunGfx2ForegroundFrame(frameIndex, PRE_RUN_GFX2_BADGES_FRAMES);

    if (progress >= 1) {
      state.preRunGfx2BadgesExitActive = false;
      state.preRunGfx2BadgesExitTime = 0;
      state.preRunStep = "badges";
      renderPreRunScreen();
    }
  }

  function updatePreRunGfx2ShopExitAnimation(dt) {
    if (!preRunGfx2ForegroundEl) {
      return;
    }

    if (!state.preRunGfx2ShopExitActive) {
      state.preRunGfx2ShopExitTime = 0;
      return;
    }

    if (!arePreRunGfx2FramesReady(PRE_RUN_GFX2_SHOP_FRAMES)) {
      preloadPreRunGfx2EntranceFrames();
      setPreRunGfx2ForegroundFrame(PRE_RUN_GFX2_SHOP_FRAMES.length - 1, PRE_RUN_GFX2_SHOP_FRAMES);
      return;
    }

    if (dt > 0) {
      state.preRunGfx2ShopExitTime = Math.min(1, state.preRunGfx2ShopExitTime + dt);
    }

    var progress = Math.max(0, Math.min(1, state.preRunGfx2ShopExitTime / 1));
    var frameIndex = Math.min(
      PRE_RUN_GFX2_SHOP_FRAMES.length - 1,
      Math.floor(progress * PRE_RUN_GFX2_SHOP_FRAMES.length)
    );
    setPreRunGfx2ForegroundFrame(frameIndex, PRE_RUN_GFX2_SHOP_FRAMES);

    if (progress >= 1) {
      state.preRunGfx2ShopExitActive = false;
      state.preRunGfx2ShopExitTime = 0;
      playUiPageOpenSound();
      state.preRunStep = "shop";
      renderPreRunScreen();
    }
  }

  function updatePreRunGfx2SettingsExitAnimation(dt) {
    if (!preRunGfx2ForegroundEl) {
      return;
    }

    if (!state.preRunGfx2SettingsExitActive) {
      state.preRunGfx2SettingsExitTime = 0;
      return;
    }

    if (!arePreRunGfx2FramesReady(PRE_RUN_GFX2_SETTINGS_FRAMES)) {
      preloadPreRunGfx2EntranceFrames();
      setPreRunGfx2ForegroundFrame(PRE_RUN_GFX2_SETTINGS_FRAMES.length - 1, PRE_RUN_GFX2_SETTINGS_FRAMES);
      return;
    }

    if (dt > 0) {
      state.preRunGfx2SettingsExitTime = Math.min(1, state.preRunGfx2SettingsExitTime + dt);
    }

    var progress = Math.max(0, Math.min(1, state.preRunGfx2SettingsExitTime / 1));
    var frameIndex = Math.min(
      PRE_RUN_GFX2_SETTINGS_FRAMES.length - 1,
      Math.floor(progress * PRE_RUN_GFX2_SETTINGS_FRAMES.length)
    );
    setPreRunGfx2ForegroundFrame(frameIndex, PRE_RUN_GFX2_SETTINGS_FRAMES);

    if (progress >= 1) {
      state.preRunGfx2SettingsExitActive = false;
      state.preRunGfx2SettingsExitTime = 0;
      playUiPageOpenSound();
      state.preRunStep = "settings";
      renderPreRunScreen();
    }
  }

  function getTotalBadgeCount() {
    var count = 0;
    BADGE_SERIES.forEach(function (series) {
      count += Array.isArray(series.tiers) ? series.tiers.length : 0;
    });
    return count;
  }

  function getCollectedBadgeCount() {
    var count = 0;
    BADGE_SERIES.forEach(function (series) {
      for (var i = 0; i < series.tiers.length; i += 1) {
        if (isBadgeTierCollected(series, i)) {
          count += 1;
        }
      }
    });
    return count;
  }

  function getBadgeSpriteClassName(sprite) {
    if (sprite === "silver") {
      return "badge-sprite-silver";
    }
    if (sprite === "gold") {
      return "badge-sprite-gold";
    }
    return "badge-sprite-bronze";
  }

  function getGfx2BadgeMedalAssetPath(sprite, isLocked) {
    var baseName = "medal-bronze";
    if (sprite === "silver") {
      baseName = "medal-silver";
    } else if (sprite === "gold") {
      baseName = "medal-gold";
    }
    return "assets/gfx2/badges/layout/" + baseName + (isLocked ? "-locked" : "") + ".png";
  }

  function renderBadgesScreen() {
    if (!preRunBadgesGroupsEl) {
      return;
    }

    if (syncBadgeUnlockDates()) {
      state.badgeStatsDirty = true;
      flushBadgeStatsStorage(true, 0);
    }

    var totalBadges = getTotalBadgeCount();
    var collectedBadges = getCollectedBadgeCount();

    if (preRunBadgesTotalValueEl) {
      preRunBadgesTotalValueEl.textContent = collectedBadges + "/" + totalBadges;
    }
    if (preRunBadgesTotalLabelEl) {
      preRunBadgesTotalLabelEl.textContent = "Total Badges Collected";
    }

    var categoryMarkup = BADGE_CATEGORY_ORDER.map(function (categoryName) {
      var seriesForCategory = BADGE_SERIES.filter(function (series) {
        return series.category === categoryName;
      });
      var categoryBadgeCount = 0;
      var categoryCollectedCount = 0;

      if (!seriesForCategory.length) {
        return "";
      }

      seriesForCategory.forEach(function (series) {
        categoryBadgeCount += Array.isArray(series.tiers) ? series.tiers.length : 0;
        for (var categoryTierIndex = 0; categoryTierIndex < series.tiers.length; categoryTierIndex += 1) {
          if (isBadgeTierCollected(series, categoryTierIndex)) {
            categoryCollectedCount += 1;
          }
        }
      });

      var rowsMarkup = seriesForCategory.map(function (series) {
        var trophyPath = getPreRunBadgeTrophyPath(series);
        var trophyCleanPath = getBadgeTrophyFallbackPath();
        var seriesHasCollectedBadge = false;
        for (var seriesTierIndex = 0; seriesTierIndex < series.tiers.length; seriesTierIndex += 1) {
          if (isBadgeTierCollected(series, seriesTierIndex)) {
            seriesHasCollectedBadge = true;
            break;
          }
        }
        var tierMarkup = series.tiers.map(function (tier, tierIndex) {
          var tierPositionClass = "pre-run-badges-gfx2-tier-shelf-bottom";
          var badgeUnlockDate = getBadgeUnlockDate(series, tierIndex);
          if (series.tiers.length === 1) {
            tierPositionClass = "pre-run-badges-gfx2-tier-shelf-top";
          } else if (tierIndex === 1) {
            tierPositionClass = "pre-run-badges-gfx2-tier-shelf-middle";
          } else if (tierIndex === 2) {
            tierPositionClass = "pre-run-badges-gfx2-tier-shelf-top";
          }
          var tierCollected = isBadgeTierCollected(series, tierIndex);
          return [
            '<div class="pre-run-badges-gfx2-tier ',
            tierPositionClass,
            tierCollected ? "" : " is-locked",
            '">',
            '<div class="pre-run-badges-gfx2-tier-medal-wrap">',
            '<img class="pre-run-badge-medal" src="',
            getGfx2BadgeMedalAssetPath(tier.sprite, !tierCollected),
            '" alt="" aria-hidden="true">',
            "</div>",
            '<div class="pre-run-badges-gfx2-tier-copy">',
            '<div class="pre-run-badges-gfx2-tier-meta">',
            '<div class="pre-run-badges-gfx2-tier-label">',
            tier.tier,
            "</div>",
            '<div class="pre-run-badges-gfx2-tier-date">',
            badgeUnlockDate,
            "</div>",
            "</div>",
            '<div class="pre-run-badges-gfx2-tier-value">',
            formatBadgeGoalText(series, tierIndex),
            "</div>",
            "</div>",
            "</div>"
          ].join("");
        }).join("");

        return [
          '<div class="pre-run-badges-gfx2-row">',
          [
            '<div class="pre-run-badges-gfx2-trophy-slot">',
            seriesHasCollectedBadge ? [
              '<img class="pre-run-badges-gfx2-trophy-art" src="',
              trophyPath,
              '" alt="" loading="lazy"',
              trophyPath !== trophyCleanPath ? ' onerror="this.onerror=null;this.src=\'' + trophyCleanPath + '\';"' : "",
              '>'
            ].join("") : "",
            "</div>"
          ].join(""),
          '<div class="pre-run-badges-gfx2-row-copy">',
          "<h4>",
          getBadgeSeriesName(series),
          "</h4>",
          "<p>",
          series.description,
          "</p>",
          "</div>",
          '<div class="pre-run-badges-gfx2-tier-stack">',
          tierMarkup,
          "</div>",
          "</div>"
        ].join("");
      }).join("");

      return [
        '<section class="pre-run-badges-gfx2-category">',
        '<div class="pre-run-badges-gfx2-category-header">',
        '<span class="pre-run-badges-gfx2-category-title">',
        categoryName,
        "</span>",
        '<span class="pre-run-badges-gfx2-category-count">',
        categoryCollectedCount,
        "/",
        categoryBadgeCount,
        " collected",
        "</span>",
        "</div>",
        '<div class="pre-run-badges-gfx2-rows">',
        rowsMarkup,
        "</div>",
        "</section>"
      ].join("");
    }).join("");

    preRunBadgesGroupsEl.innerHTML = categoryMarkup;
  }

  function isNativeAndroidPlatform() {
    return !!(
      window.Capacitor &&
      typeof window.Capacitor.getPlatform === "function" &&
      window.Capacitor.getPlatform() === "android"
    );
  }

  function getMineStorageReminderPlugin() {
    var plugin =
      window.Capacitor &&
      window.Capacitor.Plugins &&
      window.Capacitor.Plugins.MineStorageReminder &&
      typeof window.Capacitor.Plugins.MineStorageReminder.sync === "function"
        ? window.Capacitor.Plugins.MineStorageReminder
        : null;
    return plugin;
  }

  function getMineStorageReminderScheduleDelays() {
    var storageCoins = getMineStorageCoins();
    var storageCapacity = getMineStorageCapacity();
    var intervalMs = getMineIntervalMs();
    var storageCoinsToFull = Math.max(0, storageCapacity - storageCoins);
    var firstDelayMs = Math.max(0, storageCoinsToFull * intervalMs + 30 * 60 * 1000);
    var secondDelayMs = Math.max(firstDelayMs + 6 * 60 * 60 * 1000, firstDelayMs);
    return {
      firstDelayMs: firstDelayMs,
      secondDelayMs: secondDelayMs
    };
  }

  function syncMineStorageReminder(delayMs, followupDelayMs) {
    if (!isNativeAndroidPlatform()) {
      return;
    }

    var safeDelayMs = Math.max(0, Math.floor(Number(delayMs) || 0));
    var safeFollowupDelayMs = Math.max(0, Math.floor(Number(followupDelayMs) || 0));
    var reminderKey = String(safeDelayMs) + ":" + String(safeFollowupDelayMs);

    state.mineStorageReminderSyncKey = reminderKey;

    var plugin = getMineStorageReminderPlugin();
    if (!plugin) {
      state.mineStorageReminderSyncKey = "";
      return;
    }

    plugin
      .sync({
        delayMs: safeDelayMs,
        followupDelayMs: safeFollowupDelayMs,
      })
      .catch(function () {
        state.mineStorageReminderSyncKey = "";
      });
  }

  function syncMineStorageReminderFromCurrentState() {
    var schedule = getMineStorageReminderScheduleDelays();
    syncMineStorageReminder(schedule.firstDelayMs, schedule.secondDelayMs);
  }

  function setUpdateNoticeOpen(isOpen, forceUpdate) {
    state.updateNoticeActive = Boolean(isOpen);
    state.updateNoticeForce = Boolean(forceUpdate);
    if (!updateNoticeEl) {
      return;
    }
    if (state.updateNoticeActive && state.playerNamePromptActive) {
      setPlayerNamePromptOpen(false);
    }
    updateNoticeEl.classList.toggle("hidden", !state.updateNoticeActive);
    if (updateNoticeLaterBtn) {
      updateNoticeLaterBtn.classList.toggle("hidden", state.updateNoticeForce);
    }
    if (!state.updateNoticeActive) {
      maybeShowPlayerNamePromptIfMissing();
    }
  }

  function setWhatsNewNoticeOpen(isOpen) {
    state.whatsNewActive = Boolean(isOpen);
    if (!whatsNewNoticeEl) {
      return;
    }
    if (state.whatsNewActive && state.playerNamePromptActive) {
      setPlayerNamePromptOpen(false);
    }
    whatsNewNoticeEl.classList.toggle("hidden", !state.whatsNewActive);
    if (!state.whatsNewActive) {
      maybeShowPlayerNamePromptIfMissing();
    }
  }

  function setBadgeResetNoticeOpen(isOpen) {
    state.badgeResetNoticeActive = Boolean(isOpen);
    if (!badgeResetNoticeEl) {
      return;
    }
    badgeResetNoticeEl.classList.toggle("hidden", !state.badgeResetNoticeActive);
  }

  function syncPlayerNameUi() {
    if (preRunPlayerNameBtn) {
      preRunPlayerNameBtn.textContent = state.playerName ? "Name: " + state.playerName : "Sign In";
    }
    if (playerNameInputEl && playerNameNoticeEl && !playerNameNoticeEl.classList.contains("hidden")) {
      playerNameInputEl.value = state.playerName || "";
    }
  }

  function setPlayerAuthPending(isPending) {
    state.playerAuthPending = Boolean(isPending);
    if (playerNameSaveBtn) {
      playerNameSaveBtn.disabled = state.playerAuthPending;
      playerNameSaveBtn.textContent = state.playerAuthPending ? "Please wait..." : "Continue";
    }
    if (playerNameGuestBtn) {
      playerNameGuestBtn.disabled = state.playerAuthPending;
    }
    if (playerNameInputEl) {
      playerNameInputEl.disabled = state.playerAuthPending;
    }
    if (playerPasswordInputEl) {
      playerPasswordInputEl.disabled = state.playerAuthPending;
    }
  }

  function setPlayerNamePromptOpen(isOpen) {
    if (isOpen && (state.updateNoticeActive || state.whatsNewActive)) {
      return;
    }
    state.playerNamePromptActive = Boolean(isOpen);
    if (!playerNameNoticeEl) {
      return;
    }
    playerNameNoticeEl.classList.toggle("hidden", !state.playerNamePromptActive);
    if (playerNameErrorEl) {
      playerNameErrorEl.classList.add("hidden");
    }
    setPlayerAuthPending(false);
    if (state.playerNamePromptActive) {
      syncPlayerNameUi();
      if (playerNameTitleEl) {
        playerNameTitleEl.textContent = state.playerName ? "Change / Sign In" : "Sign In";
      }
      if (playerNameCopyEl) {
        playerNameCopyEl.textContent = "Enter name + password. If the name does not exist yet, it will be created automatically.";
      }
      if (playerPasswordInputEl) {
        playerPasswordInputEl.value = "";
      }
      if (playerNameInputEl) {
        window.setTimeout(function () {
          try {
            playerNameInputEl.focus();
            playerNameInputEl.select();
          } catch (error) {}
        }, 10);
      }
    }
  }

  function maybeShowPlayerNamePromptIfMissing() {
    if ((state.playerName && (isAuthenticatedPlayerId(state.playerId) || isGuestPlayerId(state.playerId))) || state.updateNoticeActive || state.whatsNewActive) {
      return;
    }
    setPlayerNamePromptOpen(true);
  }

  function refreshProfileDependentUi() {
    renderPreRunScreen();
    renderAdminForm();
    refreshPreRunBriefValues();
    updateLivesUi();
  }

  function persistActivePlayerProfile() {
    if (!isAuthenticatedPlayerId(getActiveProfileStoragePlayerId())) {
      return;
    }
    writeBadgeStats();
    writeEconomyStats();
    writePlayerSkinProgress();
    writeMaxScoreToStorage(state.gameMode, state.gameDifficulty, sessionMaxScore);
  }

  function switchPlayerSession(nextPlayerName, nextPlayerId, shouldPersistCurrentProfile) {
    var normalizedName = normalizePlayerName(nextPlayerName);
    var normalizedPlayerId = normalizePlayerId(nextPlayerId);
    var currentPlayerId = getActiveProfileStoragePlayerId();
    if (shouldPersistCurrentProfile && currentPlayerId && currentPlayerId !== normalizedPlayerId) {
      persistActivePlayerProfile();
    }
    state.playerName = normalizedName;
    state.playerId = normalizedPlayerId;
    writePlayerNameToStorage(normalizedName);
    writePlayerIdToStorage(normalizedPlayerId);
    setActiveProfileStoragePlayerId(normalizedPlayerId);
    loadPlayerSkinProgress(false);
    syncPlayerNameUi();
    refreshProfileDependentUi();
    setPlayerNamePromptOpen(false);
  }

  function continueAsGuest() {
    switchPlayerSession("Guest", createGuestPlayerId(), true);
  }

  function authenticatePlayer(name, password) {
    if (typeof window.fetch !== "function") {
      return Promise.reject(new Error("Authentication is unavailable on this device."));
    }
    return window.fetch(ONLINE_AUTH_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        password: password
      })
    }).then(function (response) {
      return response.json().catch(function () {
        return {};
      }).then(function (payload) {
        if (!response.ok || !payload || !payload.ok) {
          var message = payload && payload.error ? String(payload.error) : "Sign in failed.";
          var code = payload && payload.code ? String(payload.code) : "";
          var error = new Error(message);
          error.code = code;
          throw error;
        }
        return payload;
      });
    });
  }

  function getOnlineLeaderboardModeKey() {
    return (state.gameMode === 1 ? "full" : "jump") + "_" + (state.gameDifficulty === "hard" ? "hard" : "easy");
  }

  function getOnlineLeaderboardLabel() {
    return (state.gameMode === 1 ? "Jump Advanced" : "Jump Classic") + " " + (state.gameDifficulty === "hard" ? "Hard" : "Easy");
  }

  function getPreRunScoresBoardLabel(board) {
    switch (String(board || "")) {
      case "jump_hard":
        return "Classic Hard";
      case "full_easy":
        return "Advanced Easy";
      case "full_hard":
        return "Advanced Hard";
      default:
        return "Classic Easy";
    }
  }

  function createEmptyPreRunScoresBoardState() {
    return {
      loading: false,
      message: "",
      topPlayers: []
    };
  }

  function createInitialPreRunScoresState() {
    return {
      requestId: 0,
      boards: {
        jump_easy: createEmptyPreRunScoresBoardState(),
        jump_hard: createEmptyPreRunScoresBoardState(),
        full_easy: createEmptyPreRunScoresBoardState(),
        full_hard: createEmptyPreRunScoresBoardState()
      }
    };
  }

  function resetOnlineHighscoreUi(message) {
    var localBestScore = readMaxScoreFromStorage(state.gameMode || 2, state.gameDifficulty || "easy");
    state.onlineHighscore.loading = false;
    state.onlineHighscore.message = typeof message === "string" ? message : "";
    state.onlineHighscore.topScores = [];
    state.onlineHighscore.topPlayers = [];
    state.onlineHighscore.bestPlayerRank = null;
    state.onlineHighscore.bestScoreRank = null;
    state.onlineHighscore.currentRunRank = null;
    state.onlineHighscore.bestScore = Math.max(0, Math.floor(Number(localBestScore) || 0));
    renderOnlineHighscoreUi();
  }

  function renderOnlineHighscoreUi() {
    if (
      !finalHighscoresEl ||
      !gameOverBannerEl ||
      !finalTopScoresStatusEl ||
      !finalTopScoresListEl ||
      !finalOnlineHighscoreEl ||
      !finalOnlineStatusEl ||
      !finalOnlineListEl
    ) {
      return;
    }
    finalHighscoresEl.classList.toggle("hidden", false);
    finalOnlineHighscoreEl.classList.toggle("hidden", false);
    gameOverBannerEl.src = getGameOverBannerAssetPath();
    gameOverBannerEl.alt = getOnlineLeaderboardLabel() + " game over";
    var topScoresStatusText = "";
    var topPlayersStatusText = "";
    if (state.onlineHighscore.loading) {
      topScoresStatusText = "Loading top scores...";
      topPlayersStatusText = "Loading top players...";
    } else if (state.onlineHighscore.message) {
      topScoresStatusText = state.onlineHighscore.message;
      topPlayersStatusText = state.onlineHighscore.message;
    }
    finalTopScoresStatusEl.textContent = topScoresStatusText;
    finalOnlineStatusEl.textContent = topPlayersStatusText;
    finalTopScoresStatusEl.classList.toggle("hidden", !topScoresStatusText);
    finalOnlineStatusEl.classList.toggle("hidden", !topPlayersStatusText);

    var topScoreRows = state.onlineHighscore.topScores.slice(0, 15).map(function (entry, index) {
      return {
        label: "#" + (index + 1) + " " + entry.name,
        score: Number(entry.score || 0),
        className: ""
      };
    });
    var playerDisplayName = state.playerName || "You";
    var bestScoreValue = Math.max(
      0,
      Math.floor(
        Math.max(
          Number(state.onlineHighscore.bestScore) || 0,
          Number(readMaxScoreFromStorage(state.gameMode, state.gameDifficulty)) || 0
        )
      )
    );
    var bestRankPrefix = state.onlineHighscore.bestScoreRank ? "#" + state.onlineHighscore.bestScoreRank + " " : "#? ";
    var currentRunRankPrefix = state.onlineHighscore.currentRunRank ? "#" + state.onlineHighscore.currentRunRank + " " : "#? ";
    topScoreRows.push({
      label: currentRunRankPrefix + playerDisplayName + " (Current Run)",
      score: Math.max(0, Math.floor(Number(state.score) || 0)),
      className: "is-current-run-row"
    });
    topScoreRows.push({
      label: bestRankPrefix + playerDisplayName + " (Your Best)",
      score: bestScoreValue,
      className: "is-player-row"
    });

    finalTopScoresListEl.innerHTML = topScoreRows.map(function (entry) {
      var classAttribute = entry.className ? ' class="' + entry.className + '"' : "";
      return (
        "<li" +
        classAttribute +
        "><span>" +
        entry.label +
        "</span><strong>" +
        entry.score.toLocaleString("en-US") +
        "</strong></li>"
      );
    }).join("");

    finalOnlineListEl.innerHTML = state.onlineHighscore.topPlayers.slice(0, 15).map(function (entry, index) {
      var playerRowClass = state.playerName && entry.name === state.playerName ? ' class="is-player-row"' : "";
      return (
        "<li" +
        playerRowClass +
        "><span>#" +
        (index + 1) +
        " " +
        entry.name +
        "</span><strong>" +
        Number(entry.score || 0).toLocaleString("en-US") +
        "</strong></li>"
      );
    }).join("");
  }

  function renderPreRunScoresScreen() {
    if (!preRunScoresGridEl) {
      return;
    }

    var boardOrder = ["jump_easy", "jump_hard", "full_easy", "full_hard"];
    preRunScoresGridEl.innerHTML = boardOrder.map(function (boardKey) {
      var boardState = state.preRunScores && state.preRunScores.boards
        ? state.preRunScores.boards[boardKey]
        : null;
      var rowsHtml = "";
      if (boardState && Array.isArray(boardState.topPlayers) && boardState.topPlayers.length) {
        rowsHtml = boardState.topPlayers.slice(0, 15).map(function (entry, index) {
          return (
            "<li><span>#" +
            (index + 1) +
            " " +
            entry.name +
            "</span><strong>" +
            Number(entry.score || 0).toLocaleString("en-US") +
            "</strong></li>"
          );
        }).join("");
      }
      var statusText = "";
      if (boardState && boardState.loading) {
        statusText = "Loading top players...";
      } else if (boardState && boardState.message) {
        statusText = boardState.message;
      }
      return [
        '<section class="pre-run-scores-board pre-run-scores-board-' + boardKey + '">',
        '<header class="pre-run-scores-board-header">',
        "<h3>",
        getPreRunScoresBoardLabel(boardKey),
        "</h3>",
        "</header>",
        statusText ? '<p class="pre-run-scores-status">' + statusText + "</p>" : "",
        '<ol class="pre-run-scores-list">',
        rowsHtml,
        "</ol>",
        "</section>"
      ].join("");
    }).join("");
  }

  function resetPreRunScoresUi(message) {
    state.preRunScores = createInitialPreRunScoresState();
    if (message) {
      ["jump_easy", "jump_hard", "full_easy", "full_hard"].forEach(function (boardKey) {
        state.preRunScores.boards[boardKey].message = String(message);
      });
    }
    renderPreRunScoresScreen();
  }

  function loadPreRunScoresBoards() {
    if (typeof window.fetch !== "function") {
      resetPreRunScoresUi("Online leaderboard is unavailable on this device.");
      return;
    }

    state.preRunScores.requestId += 1;
    var requestId = state.preRunScores.requestId;
    var boardKeys = ["jump_easy", "jump_hard", "full_easy", "full_hard"];
    boardKeys.forEach(function (boardKey) {
      state.preRunScores.boards[boardKey] = {
        loading: true,
        message: "",
        topPlayers: []
      };
    });
    renderPreRunScoresScreen();

    boardKeys.forEach(function (boardKey) {
      var requestUrl =
        ONLINE_HIGHSCORE_API_URL +
        "?board=" +
        encodeURIComponent(boardKey) +
        "&playerId=" +
        encodeURIComponent(state.playerId || "");

      window.fetch(requestUrl, { method: "GET" })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Leaderboard request failed.");
          }
          return response.json();
        })
        .then(function (data) {
          if (!state.preRunScores || state.preRunScores.requestId !== requestId) {
            return;
          }
          var topPlayers = Array.isArray(data && data.topPlayers)
            ? data.topPlayers
                .map(function (entry) {
                  return {
                    name: normalizePlayerName(entry && entry.name) || "Player",
                    score: Math.max(0, Math.floor(Number(entry && entry.score) || 0))
                  };
                })
                .filter(function (entry) {
                  return entry.score >= 0;
                })
            : [];
          state.preRunScores.boards[boardKey] = {
            loading: false,
            message: topPlayers.length ? "" : "Be the first player in " + getPreRunScoresBoardLabel(boardKey) + ".",
            topPlayers: topPlayers
          };
          if (state.preRunStep === "scores") {
            renderPreRunScoresScreen();
          }
        })
        .catch(function () {
          if (!state.preRunScores || state.preRunScores.requestId !== requestId) {
            return;
          }
          state.preRunScores.boards[boardKey] = {
            loading: false,
            message: "Online leaderboard is currently unavailable.",
            topPlayers: []
          };
          if (state.preRunStep === "scores") {
            renderPreRunScoresScreen();
          }
        });
    });
  }

  function applyOnlineHighscorePayload(data, requestId) {
    if (state.onlineHighscore.requestId !== requestId) {
      return;
    }

    var topScores = Array.isArray(data && data.topScores)
      ? data.topScores
          .map(function (entry) {
            return {
              name: normalizePlayerName(entry && entry.name) || "Player",
              score: Math.max(0, Math.floor(Number(entry && entry.score) || 0))
            };
          })
          .filter(function (entry) {
            return entry.score >= 0;
          })
      : [];
    var topPlayers = Array.isArray(data && data.topPlayers)
      ? data.topPlayers
          .map(function (entry) {
            return {
              name: normalizePlayerName(entry && entry.name) || "Player",
              score: Math.max(0, Math.floor(Number(entry && entry.score) || 0))
            };
          })
          .filter(function (entry) {
            return entry.score >= 0;
          })
      : [];

    state.onlineHighscore.loading = false;
    state.onlineHighscore.message = topScores.length || topPlayers.length
      ? ""
      : "Be the first player to post a score in " + getOnlineLeaderboardLabel() + ".";
    state.onlineHighscore.topScores = topScores;
    state.onlineHighscore.topPlayers = topPlayers;
    state.onlineHighscore.bestPlayerRank = Number.isFinite(Number(data && data.bestPlayerRank))
      ? Math.max(1, Math.floor(Number(data.bestPlayerRank)))
      : null;
    state.onlineHighscore.bestScoreRank = Number.isFinite(Number(data && data.bestScoreRank))
      ? Math.max(1, Math.floor(Number(data.bestScoreRank)))
      : null;
    state.onlineHighscore.currentRunRank = Number.isFinite(Number(data && data.currentScoreRank))
      ? Math.max(1, Math.floor(Number(data.currentScoreRank)))
      : null;
    state.onlineHighscore.bestScore = Math.max(
      0,
      Math.floor(
        Math.max(
          Number(data && data.bestScore) || 0,
          Number(readMaxScoreFromStorage(state.gameMode, state.gameDifficulty)) || 0
        )
      )
    );
    renderOnlineHighscoreUi();
  }

  function loadOnlineHighscoreForCurrentBoard() {
    if (typeof window.fetch !== "function") {
      resetOnlineHighscoreUi("Online leaderboard is unavailable on this device.");
      return;
    }

    state.onlineHighscore.requestId += 1;
    var requestId = state.onlineHighscore.requestId;
    state.onlineHighscore.loading = true;
    state.onlineHighscore.message = "";
    state.onlineHighscore.topScores = [];
    state.onlineHighscore.topPlayers = [];
    state.onlineHighscore.bestPlayerRank = null;
    state.onlineHighscore.bestScoreRank = null;
    state.onlineHighscore.currentRunRank = null;
    state.onlineHighscore.bestScore = Math.max(0, Math.floor(Number(readMaxScoreFromStorage(state.gameMode, state.gameDifficulty)) || 0));
    renderOnlineHighscoreUi();

    var board = getOnlineLeaderboardModeKey();
    var scoreValue = Math.max(0, Math.floor(Number(state.score) || 0));
    var requestUrl = ONLINE_HIGHSCORE_API_URL;
    var requestOptions;

    if (scoreValue > 0 && state.playerName && isAuthenticatedPlayerId(state.playerId)) {
      requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          board: board,
          playerId: state.playerId,
          name: state.playerName,
          score: scoreValue
        })
      };
    } else {
      requestUrl +=
        "?board=" +
        encodeURIComponent(board) +
        "&playerId=" +
        encodeURIComponent(state.playerId || "");
      requestOptions = {
        method: "GET"
      };
    }

    window
      .fetch(requestUrl, requestOptions)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Leaderboard request failed.");
        }
        return response.json();
      })
      .then(function (data) {
        applyOnlineHighscorePayload(data, requestId);
      })
      .catch(function () {
        if (state.onlineHighscore.requestId !== requestId) {
          return;
        }
        resetOnlineHighscoreUi("Online leaderboard is currently unavailable.");
      });
  }

  function maybeShowWhatsNewNotice() {
    var versionInfo = APP_VERSION_INFO || {};
    var currentVersionCode = Number.isFinite(Number(versionInfo.versionCode)) ? Math.floor(Number(versionInfo.versionCode)) : 0;
    var items = Array.isArray(versionInfo.whatsNew) ? versionInfo.whatsNew.filter(function (item) {
      return typeof item === "string" && item.trim();
    }) : [];

    if (!currentVersionCode || !items.length) {
      return;
    }

    if (readWhatsNewSeenVersionCode() >= currentVersionCode) {
      return;
    }

    if (whatsNewTitleEl) {
      whatsNewTitleEl.textContent = "What's New";
    }
    if (whatsNewVersionEl) {
      whatsNewVersionEl.textContent = "Version " + (versionInfo.versionName || String(currentVersionCode));
    }
    if (whatsNewListEl) {
      whatsNewListEl.innerHTML = items.map(function (item) {
        return "<li>" + item.replace(/[&<>]/g, function (ch) {
          return ch === "&" ? "&amp;" : (ch === "<" ? "&lt;" : "&gt;");
        }) + "</li>";
      }).join("");
    }
    setWhatsNewNoticeOpen(true);
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

  function scheduleUpdateCheckRetry(delayMs) {
    if (!isNativeAndroidPlatform() || typeof window.setTimeout !== "function") {
      return;
    }
    if (updateCheckRetryTimer) {
      window.clearTimeout(updateCheckRetryTimer);
    }
    updateCheckRetryTimer = window.setTimeout(function () {
      updateCheckRetryTimer = null;
      checkForAvailableUpdate();
    }, Math.max(1000, Number(delayMs) || 7000));
  }

  function loadCurrentLevelConfig() {
    var persistedSelectedSkin = normalizeOwnedSkinName(C.selectedSkin);
    applyModeConfig(state.currentLevel, state.gameMode, state.gameDifficulty);
    loadGlobalAdminConfig();
    C.selectedSkin = normalizeOwnedSkinName(persistedSelectedSkin);
    syncModernVisualsWithSelectedSkin(C.selectedSkin);
    sessionMaxScore = readMaxScoreFromStorage(state.gameMode, state.gameDifficulty);
    warmCurrentSfxBuffers();
    refreshMusicPlayback();
  }

  function prepareRunSetup(mode, difficulty) {
    closeInGameSettings();
    state.preRunLaunchActive = false;
    state.preRunLaunchElapsed = 0;
    state.preRunLaunchPhase = "ready";
    state.gameMode = mode === 1 ? 1 : 2;
    state.gameDifficulty = difficulty === "hard" ? "hard" : "easy";
    normalizeUnlockedPreRunSelection();
    state.currentLevel = 1;
    state.skinDiscoveryPlan = buildSkinDiscoveryPlan(state.gameMode, state.gameDifficulty);
    state.scoreCarryOver = 0;
    state.runTimeSeconds = 0;
    state.collectedCoins = 0;
    state.pendingRunCoinSpend = 0;
    state.collectedBags = 0;
    resetRunBadgeStats();
    resetBadgeRewardQueue();
    state.runUnlockedBadgeKeysAtStart = getCollectedBadgeKeyMap();
    state.pendingFreshRunStart = true;
    state.badgeCursedSecondsAccumulator = 0;
    state.continueUsesThisRun = 0;
    state.continueAdUsesThisRun = 0;
    state.continueOfferActive = false;
    state.continuePurchaseOverlayActive = false;
    state.continuePurchaseSelectedLives = 0;
    state.continueAdWatchActive = false;
    state.continueAdWatchMode = "";
    state.continueAdWatchSecondsLeft = 0;
    clearContinueAdWatchTimer();
    clearMineTransferAdWatchTimer();
    state.mineTransferAdWatchActive = false;
    state.mineTransferAdWatchMode = "";
    state.mineTransferAdWatchSecondsLeft = 0;
    state.runFinalized = false;
    state.lifeLossInvulnerabilityTimeLeft = 0;
    state.levelXEndlessActive = false;
    loadCurrentLevelConfig();
    restartGame(true);
    state.preRunActive = true;
    applyResponsiveLayout();
    renderAdminForm();
    refreshPreRunBriefValues();
    applyGameModeToUi();
    renderPreRunScreen();
    refreshMusicPlayback();
  }

  function prepareLevelContinuation(level, levelXEndlessActive) {
    closeInGameSettings();
    var carryDoubleJumpTime = 0;
    var carryTripleJumpTime = 0;
    var carryStoredDoubleJumpTime = 0;

    if (state.tripleJumpTimeLeft > 0) {
      carryTripleJumpTime = state.tripleJumpTimeLeft;
      carryStoredDoubleJumpTime = state.storedDoubleJumpTimeLeft;
    } else if (state.doubleJumpTimeLeft > 0) {
      carryDoubleJumpTime = state.doubleJumpTimeLeft;
    }

    state.currentLevel = Math.max(1, Math.min(LEVEL_COUNT, level));
    state.levelXEndlessActive = Boolean(levelXEndlessActive) && state.currentLevel === 5 && isLevelXUnlocked();
    state.highestLevelReached = Math.max(state.highestLevelReached, state.currentLevel);
    if (isHardDifficultyUnlocked() && !state.lastHardUnlockShown) {
      state.lastHardUnlockShown = true;
      showModeRewardOverlay("hard");
    }
    writePlayerSkinProgress();
    updateSurvivorBadgeProgressForCurrentRun();
    updatePuristBadgeProgressForCurrentRun();
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
    setPreRunScreenHidden(false);
    renderAdminForm();
    refreshPreRunBriefValues();
    applyGameModeToUi();
    renderPreRunScreen();
    updateOverlayUiVisibility();
    refreshMusicPlayback();
  }

  function openPreRunScreen() {
    closeInGameSettings();
    resetPreRunGfx2SelectScene();
    state.preRunStep = "select";
    setAdminOpen(false);
    prepareRunSetup(state.gameMode, state.gameDifficulty);
    state.preRunActive = true;
    setPreRunScreenHidden(false);
    renderPreRunScreen();
    updateOverlayUiVisibility();
    unlockAudioIfNeeded();
    refreshMusicPlayback();
  }

  function openPreRunModeDetails(mode) {
    if (mode === 1 && !isFullModeUnlocked()) {
      renderPreRunScreen();
      return;
    }
    state.preRunStep = "details";
    prepareRunSetup(mode, state.gameDifficulty);
  }

  function clearPreRunDifficultyFlipAnimationSoon() {
    if (!preRunDifficultyToggleEl) {
      return;
    }
    if (state.preRunDifficultyFlipTimerId) {
      window.clearTimeout(state.preRunDifficultyFlipTimerId);
    }
    preRunDifficultyToggleEl.classList.add("is-flipping");
    state.preRunDifficultyFlipTimerId = window.setTimeout(function () {
      if (preRunDifficultyToggleEl) {
        preRunDifficultyToggleEl.classList.remove("is-flipping");
      }
      state.preRunDifficultyFlipTimerId = 0;
    }, 540);
  }

  function showPreRunDifficultyLockNotice() {
    state.preRunDifficultyLockNoticeActive = true;
    clearPreRunDifficultyFlipAnimationSoon();
    renderPreRunScreen();
    window.setTimeout(function () {
      state.preRunDifficultyLockNoticeActive = false;
      renderPreRunScreen();
    }, 2000);
  }

  function setPreRunDifficulty(difficulty) {
    if (state.currentLevel > 1) {
      renderPreRunScreen();
      return;
    }
    if (difficulty === "hard" && !isHardDifficultyUnlocked()) {
      showPreRunDifficultyLockNotice();
      return;
    }
    state.preRunDifficultyLockNoticeActive = false;
    state.gameDifficulty = difficulty === "hard" ? "hard" : "easy";
    clearPreRunDifficultyFlipAnimationSoon();
    if (state.preRunStep === "details") {
      prepareRunSetup(state.gameMode, state.gameDifficulty);
    } else {
      renderPreRunScreen();
    }
  }

  function closePreRunScreenAndStartRun() {
    closeInGameSettings();
    setAdminOpen(false);
    unlockAudioIfNeeded();
    recordFreshRunStartIfNeeded();
    state.preRunLaunchActive = false;
    state.preRunLaunchElapsed = 0;
    state.preRunLaunchPhase = "ready";
    state.preRunActive = false;
    stopBadgesPageMusicIfLeaving();
    setPreRunScreenHidden(true);
    updateOverlayUiVisibility();
    refreshMusicPlayback();
  }

  function startPreRunLaunchTransition() {
    if (!state.preRunActive || state.preRunLaunchActive) {
      return;
    }
    if (!state.playerName) {
      setPlayerNamePromptOpen(true);
      return;
    }
    setAdminOpen(false);
    unlockAudioIfNeeded();
    state.preRunLaunchActive = true;
    state.preRunLaunchElapsed = 0;
    state.preRunLaunchPhase = "ready";
    renderPreRunScreen();
  }

  function updatePreRunLaunchTransition(dt) {
    if (!state.preRunLaunchActive) {
      return;
    }
    state.preRunLaunchElapsed += dt;
    state.preRunLaunchPhase = state.preRunLaunchElapsed >= 1 ? "run" : "ready";
    applyCurrentMusicVolume();
    renderPreRunScreen();
    if (state.preRunLaunchElapsed >= state.preRunLaunchDuration) {
      closePreRunScreenAndStartRun();
    }
  }

  function updateGameOverSummary(skipOnlineReload) {
    var walletBalance = getCoinWalletBalance();
    var continuePrice = getContinueCoinPrice();
    var canBuyContinue = canBuyContinueForCurrentRun();
    var canUseAdContinue = canUseContinueAdForCurrentRun();
    var showFirstCoinContinue = hasFirstContinueOpportunityForCurrentRun();
    var easyAdRewardLives = 3;
    var hardAdRewardLives = 2;
    var isAdWatching = state.continueAdWatchActive;

    if (finalScoreEl) {
      finalScoreEl.textContent = "Score: " + state.score;
    }
    if (finalCoinsEarnedEl) {
      finalCoinsEarnedEl.textContent = "Coins Collected: " + state.collectedCoins.toLocaleString("en-US");
    }
    if (finalWalletBalanceEl) {
      finalWalletBalanceEl.textContent = state.runFinalized
        ? "Wallet Balance: " + walletBalance.toLocaleString("en-US")
        : "Wallet After Run: " + getWalletBalanceAfterRunPreview().toLocaleString("en-US");
    }
    if (finalContinueStatusEl) {
      if (isAdWatching) {
        if (state.continueAdWatchMode === "fake") {
          finalContinueStatusEl.textContent =
            "Watching ad... " + Math.max(0, state.continueAdWatchSecondsLeft).toLocaleString("en-US") + "s left.";
        } else {
          finalContinueStatusEl.textContent = "Loading rewarded ad...";
        }
      } else if (state.continueOfferActive) {
        if (showFirstCoinContinue && canUseAdContinue) {
          finalContinueStatusEl.textContent =
            "Each life costs " +
            continuePrice.toLocaleString("en-US") +
            " coins. Or watch an ad to continue for " +
            easyAdRewardLives.toLocaleString("en-US") +
            " lives on Easy or " +
            hardAdRewardLives.toLocaleString("en-US") +
            " lives on Hard.";
        } else if (showFirstCoinContinue) {
          finalContinueStatusEl.textContent =
            "Each life costs " + continuePrice.toLocaleString("en-US") + " coins.";
        } else if (canUseAdContinue) {
          finalContinueStatusEl.textContent =
            "Watch an ad to continue for " +
            easyAdRewardLives.toLocaleString("en-US") +
            " lives on Easy or " +
            hardAdRewardLives.toLocaleString("en-US") +
            " lives on Hard.";
        } else {
          finalContinueStatusEl.textContent = "";
        }
      } else if (canReturnToPreRunFromGameOver()) {
        finalContinueStatusEl.textContent = "Tap anywhere to return to the crossing page.";
      } else {
        finalContinueStatusEl.textContent = "";
      }
      finalContinueStatusEl.classList.toggle(
        "hidden",
        !(state.continueOfferActive || canReturnToPreRunFromGameOver() || isAdWatching)
      );
    }
    if (finalContinueActionsEl) {
      finalContinueActionsEl.classList.toggle("hidden", !(state.continueOfferActive || isAdWatching));
    }
    if (finalContinueBtn) {
      finalContinueBtn.classList.toggle("hidden", !showFirstCoinContinue || isAdWatching);
      finalContinueBtn.setAttribute(
        "aria-label",
        "Continue - " + continuePrice.toLocaleString("en-US") + " Coins"
      );
      finalContinueBtn.disabled = !canBuyContinue || isAdWatching;
    }
    if (finalWatchAdBtn) {
      finalWatchAdBtn.classList.toggle("hidden", !canUseAdContinue || isAdWatching);
      finalWatchAdBtn.setAttribute("aria-label", "Watch Ad to Continue");
      finalWatchAdBtn.disabled = !canUseAdContinue || isAdWatching;
    }
    if (finalEndRunBtn) {
      finalEndRunBtn.disabled = false;
    }
    if (state.continuePurchaseOverlayActive) {
      renderContinuePurchaseOverlay();
    }
    if (!skipOnlineReload) {
      loadOnlineHighscoreForCurrentBoard();
    }
  }

  function getPreRunGfx2ShopItems() {
    var scorePerCoin = sanitizeGlobalAdminNumber("shopScorePerCoin", C.shopScorePerCoin);
    var krobPrice = sanitizeGlobalAdminNumber("shopKrobPrice", C.shopKrobPrice);
    var skin05Price = sanitizeGlobalAdminNumber("shopSkin05Price", C.shopSkin05Price);
    var skin06Price = sanitizeGlobalAdminNumber("shopSkin06Price", C.shopSkin06Price);
    var cubePrice = sanitizeGlobalAdminNumber("shopCubePrice", C.shopCubePrice);
    var specialLevelPrice = sanitizeGlobalAdminNumber("shopSpecialLevelPrice", C.shopSpecialLevelPrice);
    var shortTimerPrice = sanitizeGlobalAdminNumber("shopMineShortTimerPrice", C.shopMineShortTimerPrice);
    var shortTimerMs = getMineShortTimerMs();
    var shortTimerSecondsLabel = formatMineShortTimerSecondsLabel(shortTimerMs);
    var mineStorageMeta = getMineStorageUpgradeMeta();
    var storageAdWatches = getMineStorageAdWatches();
    var levelXUnlocked = isLevelXUnlocked();
    var skin05Owned = isSkinUnlocked("Skin05");
    var skin06Owned = isSkinUnlocked("Skin06");
    var cubeOwned = isSkinUnlocked("Skin07");
    var shortTimerOwned = isMineShortTimerUnlocked();
    var shortTimerItem = {
      key: "short-timer",
      label: shortTimerOwned
        ? "Faster Coin Mining (" + shortTimerSecondsLabel + " s) (Owned)"
        : "Faster Coin Mining (" + shortTimerSecondsLabel + " s)",
      cost: shortTimerPrice,
      costUnit: "coins",
      type: "mine-short-timer",
      timerMs: shortTimerMs,
      timerLabel: shortTimerSecondsLabel + " s"
    };

    return {
      "short-timer": shortTimerItem,
      "coin-one": shortTimerItem,
      "coin-ten": {
        key: "coin-ten",
        label: "Buy 10 Coins",
        cost: scorePerCoin * 10,
        costUnit: "score",
        type: "score-exchange",
        amount: 10
      },
      "new-level": {
        key: "new-level",
        label: levelXUnlocked ? "New Level (Owned)" : "New Level",
        cost: specialLevelPrice,
        costUnit: "coins",
        type: "special-level"
      },
      "skin-05": {
        key: "skin-05",
        label: skin05Owned ? "Grey (Owned)" : "Grey",
        cost: skin05Price,
        costUnit: "coins",
        type: "skin-05"
      },
      "skin-06": {
        key: "skin-06",
        label: skin06Owned ? "Kaja (Owned)" : "Kaja",
        cost: skin06Price,
        costUnit: "coins",
        type: "skin-06"
      },
      "skin-07": {
        key: "skin-07",
        label: cubeOwned ? "Cube (Minimalistic OldSchool Visuals) (Owned)" : "Cube (Minimalistic OldSchool Visuals)",
        cost: cubePrice,
        costUnit: "coins",
        type: "skin-07"
      },
      "skin-cat": {
        key: "skin-cat",
        label: "Cat Character (Placeholder)",
        cost: krobPrice,
        costUnit: "coins",
        type: "placeholder"
      },
      "skin-wizard": {
        key: "skin-wizard",
        label: "Wizard Character (Placeholder)",
        cost: krobPrice + 100,
        costUnit: "coins",
        type: "placeholder"
      },
      chest: {
        key: "chest",
        label: mineStorageMeta.isMaxed
          ? "Storage Capacity Update (Sold)"
          : "Storage Capacity Update (Level " + mineStorageMeta.nextLevel + ")",
        cost: mineStorageMeta.nextAdWatchCount,
        costUnit: "ads",
        type: "storage-upgrade",
        storageLevel: mineStorageMeta.nextLevel,
        storageCapacity: mineStorageMeta.nextCapacity,
        adWatchProgress: storageAdWatches,
        adWatchRequired: mineStorageMeta.nextAdWatchCount,
        isSold: mineStorageMeta.isMaxed
      }
    };
  }

  function formatPreRunGfx2ShopCost(item) {
    if (!item) {
      return "-";
    }
    if (item.type === "special-level" && isLevelXUnlocked()) {
      return "Already purchased - enjoy new level 5 skin";
    }
    if (item.type === "skin-05" && isSkinUnlocked("Skin05")) {
      return "Already purchased - enjoy Grey";
    }
    if (item.type === "skin-07" && isSkinUnlocked("Skin07")) {
      return "Already purchased - enjoy Cube";
    }
    if (item.type === "skin-06" && isSkinUnlocked("Skin06")) {
      return "Already purchased - enjoy Kaja";
    }
    if (item.type === "mine-short-timer" && isMineShortTimerUnlocked()) {
      return "Already purchased - faster coin mining active";
    }
    if (item.type === "storage-upgrade" && item.isSold) {
      return "Sold";
    }
    if (item.type === "storage-upgrade") {
      var storageProgress = Math.max(0, Math.floor(Number(item.adWatchProgress) || 0));
      var storageRequired = Math.max(0, Math.floor(Number(item.adWatchRequired) || Number(item.cost) || 0));
      if (storageRequired <= 0) {
        return "Ready to buy";
      }
      if (storageProgress >= storageRequired) {
        return "Ready to buy";
      }
      return storageProgress.toLocaleString("en-US") + " / " + storageRequired.toLocaleString("en-US") + " ads watched";
    }
    var unitText = item.costUnit === "score" ? "score" : "coins";
    return Math.max(0, Math.floor(Number(item.cost) || 0)).toLocaleString("en-US") + " " + unitText;
  }

  function selectPreRunGfx2ShopItem(itemKey) {
    if (state.preRunGfx2ShopStorageAdWatchActive) {
      return;
    }
    var items = getPreRunGfx2ShopItems();
    if (!items[itemKey]) {
      return;
    }
    state.preRunGfx2ShopSelection = itemKey;
    if (state.preRunGfx2ShopVisitCoinTotal <= 0) {
      state.preRunGfx2ShopStatus = "";
      state.preRunGfx2ShopStatusTone = "info";
    }
    renderPreRunShopScreen();
  }

  function resetPreRunGfx2ShopVisitState() {
    clearShopStorageAdWatchTimer();
    state.preRunGfx2ShopStorageAdWatchActive = false;
    state.preRunGfx2ShopStorageAdWatchMode = "";
    state.preRunGfx2ShopStorageAdWatchSecondsLeft = 0;
    state.preRunGfx2ShopVisitCoinTotal = 0;
    state.preRunGfx2ShopSelection = null;
    state.preRunGfx2ShopStatus = "";
    state.preRunGfx2ShopStatusTone = "info";
  }

  function handlePreRunShopBackNavigation() {
    resetPreRunGfx2ShopVisitState();
    if (isGfx2StartScreenEnabled() && arePreRunGfx2FramesReady(PRE_RUN_GFX2_SHOP_BACK_FRAMES)) {
      startPreRunGfx2BackAnimation(PRE_RUN_GFX2_SHOP_BACK_FRAMES);
      return;
    }
    playUiPageOpenSound();
    state.preRunStep = "select";
    renderPreRunScreen();
  }

  function setMineMessage(text, tone, durationMs, messageKey) {
    state.mineMessageText = String(text || "");
    state.mineMessageTone = tone || "info";
    state.mineMessageKey = String(messageKey || "");
    state.mineMessageExpiresAt = Date.now() + Math.max(1200, Math.floor(Number(durationMs) || 0));
  }

  function queueMineMessageFollowUp(text, tone, durationMs, messageKey) {
    state.mineMessageFollowUpText = String(text || "");
    state.mineMessageFollowUpTone = tone || "info";
    state.mineMessageFollowUpKey = String(messageKey || "");
    state.mineMessageFollowUpDurationMs = Math.max(1200, Math.floor(Number(durationMs) || 0));
  }

  function clearMineMessageFollowUp() {
    state.mineMessageFollowUpText = "";
    state.mineMessageFollowUpTone = "info";
    state.mineMessageFollowUpKey = "";
    state.mineMessageFollowUpDurationMs = 0;
  }

  function clearMineTransferMessagePhase() {
    state.mineTransferMessagePhase = null;
  }

  function startMineTransferMessagePhase(transferAmount) {
    var safeTransferAmount = Math.max(0, Math.floor(Number(transferAmount) || 0));
    state.mineTransferMessagePhase = {
      firstText: "Transferred " + safeTransferAmount.toLocaleString("en-US") + " coin" + (safeTransferAmount === 1 ? "" : "s") + " to the wallet.",
      firstTone: "success",
      firstKey: "06",
      firstExpiresAt: Date.now() + 5000,
      secondText: "The mine is warming up. Your first coin is on the way.",
      secondTone: "info",
      secondKey: "03",
      secondExpiresAt: Date.now() + 10000
    };
  }

  function startMineEmptyTransferMessagePhase() {
    state.mineTransferMessagePhase = {
      firstText: "There are no stored coins to transfer yet.",
      firstTone: "info",
      firstKey: "05",
      firstExpiresAt: Date.now() + 5000,
      secondText: "",
      secondTone: "info",
      secondKey: "",
      secondExpiresAt: 0
    };
  }

  var MINE_IDLE_TIPS = [
    { key: "15", text: "Clicking transfer you will watch a short ad and then the coins will be transfered." },
    { key: "07", text: "Transfer coins whenever storage is ready." },
    { key: "08", text: "You can upgrade storage size in the Shop." }
  ];

  var MINE_MESSAGE_FACE_FALLBACK_SRC = "assets/gfx2/mine_scr/mine_face_00.png";

  function getMineMessageFaceSrc(messageKey) {
    var key = String(messageKey || "").trim();
    if (!key) {
      return MINE_MESSAGE_FACE_FALLBACK_SRC;
    }
    if (key === "15") {
      return "assets/gfx2/mine_scr/mine_face_15.png";
    }
    return "assets/gfx2/mine_scr/mine_face_" + key + ".png";
  }

  function getMineIdleTip(now) {
    var safeNow = Number.isFinite(now) ? Math.max(0, Math.floor(now)) : Date.now();
    var cycleStartAt = Math.max(0, Math.floor(Number(state.mineIdleTipStartedAt) || 0));
    var elapsedMs = cycleStartAt > 0 ? Math.max(0, safeNow - cycleStartAt) : 0;
    return MINE_IDLE_TIPS[Math.floor(elapsedMs / 30000) % MINE_IDLE_TIPS.length];
  }

  function renderPreRunMineScreen() {
    var now = Date.now();
    var mineState = ensureMineEconomyState(now);
    var walletBalance = getCoinWalletBalance();
    var storageCoins = getMineStorageCoins();
    var storageCapacity = getMineStorageCapacity();
    var intervalMs = getMineIntervalMs();
    var isFull = storageCoins >= storageCapacity;
    var messageText = state.mineMessageText;
    var messageTone = state.mineMessageTone || "info";
    var messageKey = state.mineMessageKey || "";
    var transferPhase = state.mineTransferMessagePhase;
    var transferPhaseActive = false;
    var transferAdActive = state.mineTransferAdWatchActive;

    if (transferAdActive) {
      if (state.mineTransferAdWatchMode === "fake") {
        messageText = "Watching ad... " + Math.max(0, state.mineTransferAdWatchSecondsLeft).toLocaleString("en-US") + "s left.";
      } else {
        messageText = "Loading rewarded ad...";
      }
      messageTone = "info";
      messageKey = "06";
    }

    if (transferPhase) {
      if (now < transferPhase.firstExpiresAt) {
        messageText = transferPhase.firstText;
        messageTone = transferPhase.firstTone;
        messageKey = transferPhase.firstKey;
        transferPhaseActive = true;
      } else if (transferPhase.secondText && now < transferPhase.secondExpiresAt) {
        messageText = transferPhase.secondText;
        messageTone = transferPhase.secondTone;
        messageKey = transferPhase.secondKey;
        transferPhaseActive = true;
      } else {
        clearMineTransferMessagePhase();
        transferPhase = null;
      }
    }

    if (!transferAdActive && !transferPhaseActive && isFull && (!state.mineMessageText || state.mineMessageTone !== "warning" || now > state.mineMessageExpiresAt)) {
      setMineMessage("Storage is full. Transfer the coins to your wallet.", "warning", 5200, "01");
      messageText = state.mineMessageText;
      messageTone = state.mineMessageTone;
      messageKey = state.mineMessageKey;
    } else if (!transferAdActive && !transferPhaseActive && mineState.minedCoins > 0) {
      setMineMessage(
        "Mined " + mineState.minedCoins.toLocaleString("en-US") + " coin" + (mineState.minedCoins === 1 ? "" : "s") + " into storage.",
        "success",
        3600,
        "02"
      );
      messageText = state.mineMessageText;
      messageTone = state.mineMessageTone;
      messageKey = state.mineMessageKey;
    } else if (!transferAdActive && !transferPhaseActive && !state.mineIntroShown && storageCoins === 0) {
      state.mineIntroShown = true;
      setMineMessage("The mine is warming up. Your first coin is on the way.", "info", 4200, "03");
      messageText = state.mineMessageText;
      messageTone = state.mineMessageTone;
      messageKey = state.mineMessageKey;
    } else if (!transferAdActive && !transferPhaseActive && !isFull && storageCoins >= Math.ceil(storageCapacity * 0.5) && !state.mineHalfFullAnnounced) {
      state.mineHalfFullAnnounced = true;
      setMineMessage("Storage is half full. Transfer soon if you want to keep the mine flowing.", "info", 4200, "04");
      messageText = state.mineMessageText;
      messageTone = state.mineMessageTone;
      messageKey = state.mineMessageKey;
    } else if (!transferAdActive && !transferPhaseActive && state.mineMessageText && now > state.mineMessageExpiresAt) {
      if (state.mineMessageFollowUpText) {
        setMineMessage(
          state.mineMessageFollowUpText,
          state.mineMessageFollowUpTone,
          state.mineMessageFollowUpDurationMs,
          state.mineMessageFollowUpKey
        );
        clearMineMessageFollowUp();
        messageText = state.mineMessageText;
        messageTone = state.mineMessageTone;
        messageKey = state.mineMessageKey;
      } else {
        state.mineMessageText = "";
        state.mineMessageTone = "info";
        state.mineMessageKey = "";
        state.mineMessageExpiresAt = 0;
        var idleTipAfterExpire = getMineIdleTip(now);
        messageText = idleTipAfterExpire.text;
        messageTone = "info";
        messageKey = idleTipAfterExpire.key;
        state.mineMessageKey = messageKey;
      }
    } else if (!transferAdActive && !transferPhaseActive && !state.mineMessageText) {
      var idleTip = getMineIdleTip(now);
      messageText = idleTip.text;
      messageTone = "info";
      messageKey = idleTip.key;
      state.mineMessageKey = messageKey;
    }

    if (preRunMineGfx2WalletValueEl) {
      preRunMineGfx2WalletValueEl.textContent = walletBalance.toLocaleString("en-US");
    }
    if (preRunMineGfx2StorageValueEl) {
      preRunMineGfx2StorageValueEl.textContent = storageCoins.toLocaleString("en-US") + " / " + storageCapacity.toLocaleString("en-US");
    }
    if (preRunMineGfx2CountdownEl) {
      preRunMineGfx2CountdownEl.textContent = isFull
        ? "FULL"
        : formatMineCountdown(mineState.nextCoinInMs > 0 ? mineState.nextCoinInMs : intervalMs);
      preRunMineGfx2CountdownEl.classList.toggle("is-full", isFull);
    }
    if (preRunMineGfx2TransferBtn) {
      var mineControlsDisabled = !!transferAdActive || !!state.preRunGfx2MineExitActive;
      preRunMineGfx2TransferBtn.disabled = mineControlsDisabled;
      preRunMineGfx2TransferBtn.setAttribute("aria-disabled", mineControlsDisabled ? "true" : "false");
      preRunMineGfx2TransferBtn.dataset.adLabel = transferAdActive
        ? (state.mineTransferAdWatchMode === "fake"
            ? "WATCH AD " + Math.max(0, state.mineTransferAdWatchSecondsLeft).toLocaleString("en-US") + "S"
            : "LOADING AD")
        : "";
    }
    if (preRunMineGfx2ExitBtn) {
      preRunMineGfx2ExitBtn.disabled = !!state.preRunGfx2MineExitActive;
      preRunMineGfx2ExitBtn.setAttribute("aria-disabled", state.preRunGfx2MineExitActive ? "true" : "false");
    }
    if (preRunMineGfx2MessageEl) {
      preRunMineGfx2MessageEl.classList.remove("is-info", "is-success", "is-warning");
      preRunMineGfx2MessageEl.classList.add(
        messageTone === "success" ? "is-success" : messageTone === "warning" ? "is-warning" : "is-info"
      );
    }
    if (preRunMineGfx2MessageFaceEl) {
      var nextMineMessageFaceSrc = getMineMessageFaceSrc(messageKey);
      var nextMineMessageFaceKey = String(messageKey || "");
      preRunMineGfx2MessageFaceEl.classList.toggle("is-mine-face-15", nextMineMessageFaceKey === "15");
      if (
        preRunMineGfx2MessageFaceEl.dataset.faceKey !== nextMineMessageFaceKey ||
        (
          preRunMineGfx2MessageFaceEl.dataset.faceSrc !== nextMineMessageFaceSrc &&
          preRunMineGfx2MessageFaceEl.dataset.fallbackApplied !== "1"
        )
      ) {
        preRunMineGfx2MessageFaceEl.dataset.faceKey = nextMineMessageFaceKey;
        preRunMineGfx2MessageFaceEl.dataset.faceSrc = nextMineMessageFaceSrc;
        preRunMineGfx2MessageFaceEl.dataset.fallbackApplied = "0";
        preRunMineGfx2MessageFaceEl.onerror = function () {
          if (!preRunMineGfx2MessageFaceEl || preRunMineGfx2MessageFaceEl.dataset.fallbackApplied === "1") {
            return;
          }
          preRunMineGfx2MessageFaceEl.dataset.fallbackApplied = "1";
          preRunMineGfx2MessageFaceEl.dataset.faceSrc = MINE_MESSAGE_FACE_FALLBACK_SRC;
          preRunMineGfx2MessageFaceEl.src = MINE_MESSAGE_FACE_FALLBACK_SRC;
        };
        preRunMineGfx2MessageFaceEl.src = nextMineMessageFaceSrc;
      }
    }
    if (preRunMineGfx2MessageTextEl) {
      preRunMineGfx2MessageTextEl.textContent = messageText;
      preRunMineGfx2MessageTextEl.classList.toggle("is-mine-face-15", String(messageKey || "") === "15");
    }
  }

  function openPreRunMineScreen() {
    unlockAudioIfNeeded();
    playUiPageOpenSound();
    state.preRunGfx2MineEntryActive = false;
    state.preRunGfx2MineEntryTime = 0;
    state.preRunGfx2MineExitActive = false;
    state.preRunGfx2MineExitTime = 0;
    clearMineTransferAdWatchTimer();
    state.mineTransferAdWatchActive = false;
    state.mineTransferAdWatchMode = "";
    state.mineTransferAdWatchSecondsLeft = 0;
    state.mineMessageText = "";
    state.mineMessageTone = "info";
    state.mineMessageKey = "";
    state.mineMessageExpiresAt = 0;
    clearMineMessageFollowUp();
    clearMineTransferMessagePhase();
    state.mineHalfFullAnnounced = false;
    state.mineIntroShown = false;
    state.mineIdleTipStartedAt = Date.now();
    state.preRunStep = "mine";
    renderPreRunScreen();
  }

  function handlePreRunMineBackNavigation() {
    if (state.preRunGfx2MineExitActive) {
      return;
    }
    startPreRunGfx2MineExitAnimation();
  }

  function handleMineTransfer(skipAdWatch) {
    ensureMineEconomyState(Date.now());
    if (state.mineTransferAdWatchActive) {
      return;
    }

    if (!skipAdWatch && getMineStorageCoins() > 0) {
      startMineTransferAdWatch();
      return;
    }

    var transferAmount = transferMineStorageToWallet();
    if (transferAmount <= 0) {
      clearMineMessageFollowUp();
      clearMineTransferMessagePhase();
      startMineEmptyTransferMessagePhase();
      setMineMessage("There are no stored coins to transfer yet.", "info", 5000, "05");
      renderPreRunScreen();
      return;
    }
    state.mineHalfFullAnnounced = false;
    clearMineMessageFollowUp();
    startMineTransferMessagePhase(transferAmount);
    setMineMessage(
      "Transferred " + transferAmount.toLocaleString("en-US") + " coin" + (transferAmount === 1 ? "" : "s") + " to the wallet.",
      "success",
      5000,
      "06"
    );
    renderPreRunScreen();
  }

  function handlePreRunGfx2ShopPurchase() {
    var items = getPreRunGfx2ShopItems();
    var selectedItem = items[state.preRunGfx2ShopSelection] || items["short-timer"];
    if (!selectedItem) {
      return;
    }

    if (selectedItem.type === "score-exchange") {
      if (exchangePersistentScoreForCoins(selectedItem.amount)) {
        state.preRunGfx2ShopVisitCoinTotal += selectedItem.amount;
        state.preRunGfx2ShopStatus =
          "Purchased a total of " +
          state.preRunGfx2ShopVisitCoinTotal +
          " coin" +
          (state.preRunGfx2ShopVisitCoinTotal === 1 ? "" : "s") +
          ".";
        state.preRunGfx2ShopStatusTone = "success";
        renderAdminForm();
      } else {
        state.preRunGfx2ShopStatus = "Not enough total points for this purchase.";
        state.preRunGfx2ShopStatusTone = "error";
      }
      renderPreRunShopScreen();
      return;
    }

    if (selectedItem.type === "mine-short-timer") {
      var shortTimerMs = getMineShortTimerMs();
      if (isMineShortTimerUnlocked()) {
        state.preRunGfx2ShopStatus =
          "Faster Coin Mining is already active. Mine coins now arrive every " + formatMineCountdown(shortTimerMs) + ".";
        state.preRunGfx2ShopStatusTone = "success";
      } else if (!spendCoinsFromWallet(selectedItem.cost)) {
        state.preRunGfx2ShopStatus = "Not enough coins for Faster Coin Mining.";
        state.preRunGfx2ShopStatusTone = "error";
      } else {
        economyStats.mineShortTimerUnlocked = true;
        economyStats.mineMineIntervalMs = shortTimerMs;
        writeEconomyStats();
        state.preRunGfx2ShopStatus =
          "Faster Coin Mining unlocked. Mine coins now arrive every " + formatMineCountdown(shortTimerMs) + ".";
        state.preRunGfx2ShopStatusTone = "success";
      }
      renderPreRunShopScreen();
      return;
    }

    if (selectedItem.type === "special-level") {
      if (isLevelXUnlocked()) {
        state.preRunGfx2ShopStatus = "Bonus level already unlocked. Level 5 now requires " + getLevel5ScoreGoal().toLocaleString("en-US") + " score before Level X begins.";
        state.preRunGfx2ShopStatusTone = "success";
      } else if (!spendCoinsFromWallet(selectedItem.cost)) {
        state.preRunGfx2ShopStatus = "Not enough coins for the bonus level.";
        state.preRunGfx2ShopStatusTone = "error";
      } else {
        state.levelXUnlocked = true;
        writePlayerSkinProgress();
        refreshPreRunBriefValues();
        state.preRunGfx2ShopStatus = "Bonus level unlocked. Level 5 now requires " + getLevel5ScoreGoal().toLocaleString("en-US") + " score before Level X begins.";
        state.preRunGfx2ShopStatusTone = "success";
      }
      renderPreRunShopScreen();
      return;
    }

    if (selectedItem.type === "skin-05") {
      if (isSkinUnlocked("Skin05")) {
        state.preRunGfx2ShopStatus = "Grey already unlocked.";
        state.preRunGfx2ShopStatusTone = "success";
      } else if (!spendCoinsFromWallet(selectedItem.cost)) {
        state.preRunGfx2ShopStatus = "Not enough coins for Grey.";
        state.preRunGfx2ShopStatusTone = "error";
      } else {
        unlockSkin("Skin05");
        state.preRunGfx2ShopStatus = "Grey unlocked. Use it from the skin select.";
        state.preRunGfx2ShopStatusTone = "success";
        refreshPreRunSkinSelection();
        renderAdminForm();
      }
      renderPreRunShopScreen();
      return;
    }

    if (selectedItem.type === "skin-07") {
      if (isSkinUnlocked("Skin07")) {
        state.preRunGfx2ShopStatus = "Cube already unlocked.";
        state.preRunGfx2ShopStatusTone = "success";
      } else if (!spendCoinsFromWallet(selectedItem.cost)) {
        state.preRunGfx2ShopStatus = "Not enough coins for Cube.";
        state.preRunGfx2ShopStatusTone = "error";
      } else {
        unlockSkin("Skin07");
        state.preRunGfx2ShopStatus = "Cube unlocked. Use it from the skin select.";
        state.preRunGfx2ShopStatusTone = "success";
        refreshPreRunSkinSelection();
        renderAdminForm();
      }
      renderPreRunShopScreen();
      return;
    }

    if (selectedItem.type === "skin-06") {
      if (isSkinUnlocked("Skin06")) {
        state.preRunGfx2ShopStatus = "Kaja already unlocked.";
        state.preRunGfx2ShopStatusTone = "success";
      } else if (!spendCoinsFromWallet(selectedItem.cost)) {
        state.preRunGfx2ShopStatus = "Not enough coins for Kaja.";
        state.preRunGfx2ShopStatusTone = "error";
      } else {
        unlockSkin("Skin06");
        state.preRunGfx2ShopStatus = "Kaja unlocked. Use it from the skin select.";
        state.preRunGfx2ShopStatusTone = "success";
        refreshPreRunSkinSelection();
        renderAdminForm();
      }
      renderPreRunShopScreen();
      return;
    }

    if (selectedItem.type === "storage-upgrade") {
      if (state.preRunGfx2ShopStorageAdWatchActive) {
        return;
      }
      var mineMeta = getMineStorageUpgradeMeta();
      if (mineMeta.isMaxed || selectedItem.isSold) {
        state.preRunGfx2ShopStatus = "Storage capacity is already fully upgraded.";
        state.preRunGfx2ShopStatusTone = "success";
      } else if (getMineStorageAdWatches() < selectedItem.adWatchRequired) {
        startShopStorageAdWatch();
        renderPreRunShopScreen();
        return;
      } else {
        economyStats.mineStorageUpgradeLevel = Math.min(4, mineMeta.nextLevel);
        economyStats.mineStorageCapacity = Math.max(1, Math.floor(Number(selectedItem.storageCapacity) || mineMeta.nextCapacity));
        economyStats.mineStorageAdWatches = 0;
        if (economyStats.mineStorageCoins > economyStats.mineStorageCapacity) {
          economyStats.mineStorageCoins = economyStats.mineStorageCapacity;
        }
        writeEconomyStats();
        syncMineStorageReminderFromCurrentState();
        state.preRunGfx2ShopStatus =
          "Storage capacity upgraded to Level " +
          mineMeta.nextLevel +
          ". Capacity is now " +
          economyStats.mineStorageCapacity.toLocaleString("en-US") +
          " coins.";
        state.preRunGfx2ShopStatusTone = "success";
      }
      renderPreRunShopScreen();
      return;
    }

    state.preRunGfx2ShopStatus = "This purchase is not available yet.";
    state.preRunGfx2ShopStatusTone = "info";
    renderPreRunShopScreen();
  }

  function renderPreRunShopScreen() {
    var scorePerCoin = sanitizeGlobalAdminNumber("shopScorePerCoin", C.shopScorePerCoin);
    var krobPrice = sanitizeGlobalAdminNumber("shopKrobPrice", C.shopKrobPrice);
    var skin05Price = sanitizeGlobalAdminNumber("shopSkin05Price", C.shopSkin05Price);
    var skin06Price = sanitizeGlobalAdminNumber("shopSkin06Price", C.shopSkin06Price);
    var cubePrice = sanitizeGlobalAdminNumber("shopCubePrice", C.shopCubePrice);
    var specialLevelPrice = sanitizeGlobalAdminNumber("shopSpecialLevelPrice", C.shopSpecialLevelPrice);
    var mineStorageMeta = getMineStorageUpgradeMeta();
    var persistentScore = getPersistentTotalScore();
    var walletBalance = getCoinWalletBalance();
    var canBuyOneCoin = persistentScore >= scorePerCoin;
    var canBuyTenCoins = persistentScore >= scorePerCoin * 10;
    var krobOwned = isSkinUnlocked("Skin04");
    var skin05Owned = isSkinUnlocked("Skin05");
    var cubeOwned = isSkinUnlocked("Skin07");
    var skin06Owned = isSkinUnlocked("Skin06");
    if (preRunShopGfx2El) {
      preRunShopGfx2El.classList.remove("hidden");
    }

    if (preRunShopWalletEl) {
      preRunShopWalletEl.textContent = walletBalance.toLocaleString("en-US");
    }
    if (preRunShopTotalScoreEl) {
      preRunShopTotalScoreEl.textContent = persistentScore.toLocaleString("en-US");
    }
    if (preRunShopRateEl) {
      preRunShopRateEl.textContent = scorePerCoin.toLocaleString("en-US") + " : 1";
    }
    if (preRunShopExchangeCopyEl) {
      preRunShopExchangeCopyEl.textContent =
        "Convert persistent total score into coins at " + scorePerCoin.toLocaleString("en-US") + " score per 1 coin.";
    }
    if (preRunShopExchangeOneBtn) {
      preRunShopExchangeOneBtn.disabled = !canBuyOneCoin;
    }
    if (preRunShopExchangeTenBtn) {
      preRunShopExchangeTenBtn.disabled = !canBuyTenCoins;
    }
    if (preRunShopExchangeStatusEl) {
      preRunShopExchangeStatusEl.textContent =
        "Available: " +
        persistentScore.toLocaleString("en-US") +
        " score. " +
        (canBuyOneCoin ? "Ready to exchange." : "Not enough score yet.");
    }
    if (preRunShopBuyKrobBtn) {
      preRunShopBuyKrobBtn.disabled = krobOwned || walletBalance < krobPrice;
      preRunShopBuyKrobBtn.textContent = krobOwned ? "Owned" : "Buy Krob";
    }
    if (preRunShopKrobStatusEl) {
      preRunShopKrobStatusEl.textContent = krobOwned
        ? "Krob is already unlocked."
        : "Price: " + krobPrice.toLocaleString("en-US") + " coins.";
    }
    if (preRunShopSpecialLevelStatusEl) {
      preRunShopSpecialLevelStatusEl.textContent = isLevelXUnlocked()
        ? "Already purchased - Level 5 is now a " + getLevel5ScoreGoal().toLocaleString("en-US") + " score challenge before Level X begins."
        : "Unlock the bonus Level 5 pack for " + specialLevelPrice.toLocaleString("en-US") + " coins. Level 5 will then require " + getLevel5ScoreGoal().toLocaleString("en-US") + " score before Level X begins.";
    }

    if (!isGfx2StartScreenEnabled()) {
      return;
    }

    var gfx2Items = getPreRunGfx2ShopItems();
    var selectedItem = state.preRunGfx2ShopSelection ? gfx2Items[state.preRunGfx2ShopSelection] || null : null;

    if (preRunShopGfx2TotalValueEl) {
      preRunShopGfx2TotalValueEl.textContent = persistentScore.toLocaleString("en-US");
    }
    if (preRunShopGfx2WalletValueEl) {
      preRunShopGfx2WalletValueEl.textContent = walletBalance.toLocaleString("en-US");
    }
    if (preRunShopGfx2BoardEl) {
      preRunShopGfx2BoardEl.classList.toggle("is-welcome", !selectedItem);
    }
    if (preRunShopGfx2SelectionLabelEl) {
      preRunShopGfx2SelectionLabelEl.textContent = selectedItem ? "Selected Item" : "Welcome to the Shop!";
    }
    if (preRunShopGfx2SelectionValueEl) {
      preRunShopGfx2SelectionValueEl.textContent = selectedItem ? selectedItem.label : "";
    }
    if (preRunShopGfx2CostValueEl) {
      preRunShopGfx2CostValueEl.textContent = selectedItem ? formatPreRunGfx2ShopCost(selectedItem) : "";
    }
    if (preRunShopGfx2StatusEl) {
      var statusText = state.preRunGfx2ShopStatus || "Welcome to the Shop! Select the desired item.";
      if (!selectedItem) {
        statusText = state.preRunGfx2ShopStatus || "Welcome to the Shop! Select the desired item.";
      } else if (!state.preRunGfx2ShopStatus && selectedItem && selectedItem.type === "mine-short-timer" && isMineShortTimerUnlocked()) {
        statusText = "Faster Coin Mining is already active. Mine coins arrive every " + formatMineCountdown(selectedItem.timerMs) + ".";
      } else if (!state.preRunGfx2ShopStatus && selectedItem && selectedItem.type === "mine-short-timer" && walletBalance < selectedItem.cost) {
        statusText = "You don´t have enough coins to buy it.";
      } else if (!state.preRunGfx2ShopStatus && selectedItem && selectedItem.type === "mine-short-timer") {
        statusText = "Unlock Faster Coin Mining. Mine coins will arrive every " + formatMineCountdown(selectedItem.timerMs) + " after purchase.";
      } else if (!state.preRunGfx2ShopStatus && selectedItem && selectedItem.type === "special-level" && !isLevelXUnlocked() && walletBalance < selectedItem.cost) {
        statusText = "You don´t have enough coins to buy it.";
      } else if (!state.preRunGfx2ShopStatus && selectedItem && selectedItem.type === "skin-05" && !skin05Owned && walletBalance < selectedItem.cost) {
        statusText = "You don´t have enough coins to buy it.";
      } else if (!state.preRunGfx2ShopStatus && selectedItem && selectedItem.type === "skin-05") {
        statusText = skin05Owned
          ? "Grey is already unlocked."
          : "Unlock Grey for " + skin05Price.toLocaleString("en-US") + " coins.";
      } else if (!state.preRunGfx2ShopStatus && selectedItem && selectedItem.type === "skin-06" && !skin06Owned && walletBalance < selectedItem.cost) {
        statusText = "You don´t have enough coins to buy it.";
      } else if (!state.preRunGfx2ShopStatus && selectedItem && selectedItem.type === "skin-06") {
        statusText = skin06Owned
          ? "Kaja is already unlocked."
          : "Unlock Kaja for " + skin06Price.toLocaleString("en-US") + " coins.";
      } else if (!state.preRunGfx2ShopStatus && selectedItem && selectedItem.type === "skin-07" && !cubeOwned && walletBalance < selectedItem.cost) {
        statusText = "You don´t have enough coins to buy it.";
      } else if (!state.preRunGfx2ShopStatus && selectedItem && selectedItem.type === "skin-07") {
        statusText = cubeOwned
          ? "Cube is already unlocked."
          : "Unlock Cube for " + cubePrice.toLocaleString("en-US") + " coins.";
      } else if (!state.preRunGfx2ShopStatus && selectedItem && selectedItem.type === "storage-upgrade") {
        var storageAdsRequired = Math.max(0, Math.floor(Number(selectedItem.adWatchRequired) || Number(selectedItem.cost) || 0));
        var storageAdsProgress = Math.max(0, Math.floor(Number(selectedItem.adWatchProgress) || getMineStorageAdWatches() || 0));
        statusText = mineStorageMeta.isMaxed
          ? "Storage capacity is fully upgraded."
          : storageAdsProgress >= storageAdsRequired
            ? "Storage upgrade unlocked. Press Buy to purchase it."
            : "Watch " + storageAdsRequired.toLocaleString("en-US") + " ads to unlock this upgrade. Progress: " + storageAdsProgress.toLocaleString("en-US") + " / " + storageAdsRequired.toLocaleString("en-US") + ".";
      }
      preRunShopGfx2StatusEl.textContent = statusText;
      preRunShopGfx2StatusEl.classList.toggle("is-error", state.preRunGfx2ShopStatusTone === "error");
      preRunShopGfx2StatusEl.classList.toggle("is-success", state.preRunGfx2ShopStatusTone === "success");
    }

    var shopButtons = [
      { button: preRunShopGfx2CoinOneBtn, key: "short-timer" },
      { button: preRunShopGfx2CoinTenBtn, key: "coin-ten" },
      { button: preRunShopGfx2NewLevelBtn, key: "new-level" },
      { button: preRunShopGfx2SkinCatBtn, key: "skin-05" },
      { button: preRunShopGfx2SkinCubeBtn, key: "skin-07" },
      { button: preRunShopGfx2Skin06Btn, key: "skin-06" },
      { button: preRunShopGfx2ChestBtn, key: "chest" }
    ];
    shopButtons.forEach(function (entry) {
      if (!entry.button) {
        return;
      }
      var isSelected = state.preRunGfx2ShopSelection === entry.key;
      entry.button.setAttribute("aria-pressed", isSelected ? "true" : "false");
    });
    if (preRunShopGfx2NewLevelBtn) {
      preRunShopGfx2NewLevelBtn.classList.toggle("is-sold", isLevelXUnlocked());
    }
    if (preRunShopGfx2SkinCatBtn) {
      preRunShopGfx2SkinCatBtn.classList.toggle("is-sold", skin05Owned);
    }
    if (preRunShopGfx2SkinCubeBtn) {
      preRunShopGfx2SkinCubeBtn.classList.toggle("is-sold", cubeOwned);
    }
    if (preRunShopGfx2Skin06Btn) {
      preRunShopGfx2Skin06Btn.classList.toggle("is-sold", skin06Owned);
    }
    if (preRunShopGfx2ChestBtn) {
      preRunShopGfx2ChestBtn.classList.toggle("is-sold", mineStorageMeta.isMaxed);
    }
    if (preRunShopGfx2BuyBtn) {
      var selectedIsSpecialLevel = selectedItem && selectedItem.type === "special-level";
      var selectedIsSkin05 = selectedItem && selectedItem.type === "skin-05";
      var selectedIsSkin07 = selectedItem && selectedItem.type === "skin-07";
      var selectedIsSkin06 = selectedItem && selectedItem.type === "skin-06";
      var selectedIsMineShortTimer = selectedItem && selectedItem.type === "mine-short-timer";
      var selectedIsStorageUpgrade = selectedItem && selectedItem.type === "storage-upgrade";
      var storageAdsRequired = selectedIsStorageUpgrade ? Math.max(0, Math.floor(Number(selectedItem.adWatchRequired) || Number(selectedItem.cost) || 0)) : 0;
      var storageAdsProgress = selectedIsStorageUpgrade ? Math.max(0, Math.floor(Number(selectedItem.adWatchProgress) || getMineStorageAdWatches() || 0)) : 0;
      var storageAdsReady = selectedIsStorageUpgrade && storageAdsProgress >= storageAdsRequired;
      var storageAdsLoading = selectedIsStorageUpgrade && state.preRunGfx2ShopStorageAdWatchActive;
      var storageAdsNeedsWatch = selectedIsStorageUpgrade && !storageAdsReady;
      preRunShopGfx2BuyBtn.disabled = Boolean(
        !selectedItem ||
        storageAdsLoading ||
        (selectedIsMineShortTimer && (isMineShortTimerUnlocked() || walletBalance < selectedItem.cost)) ||
        (selectedIsSpecialLevel && (isLevelXUnlocked() || walletBalance < selectedItem.cost)) ||
        (selectedIsSkin05 && (skin05Owned || walletBalance < selectedItem.cost)) ||
        (selectedIsSkin07 && (cubeOwned || walletBalance < selectedItem.cost)) ||
        (selectedIsSkin06 && (skin06Owned || walletBalance < selectedItem.cost)) ||
        (selectedIsStorageUpgrade && mineStorageMeta.isMaxed)
      );
      preRunShopGfx2BuyBtn.textContent =
        selectedItem && ((selectedIsMineShortTimer && isMineShortTimerUnlocked()) || (selectedIsSpecialLevel && isLevelXUnlocked()) || (selectedIsSkin05 && skin05Owned) || (selectedIsSkin07 && cubeOwned) || (selectedIsSkin06 && skin06Owned) || (selectedIsStorageUpgrade && mineStorageMeta.isMaxed))
          ? "Owned"
          : storageAdsLoading || storageAdsNeedsWatch
            ? "Watch Ad"
            : "Buy";
      if (selectedIsMineShortTimer && isMineShortTimerUnlocked()) {
        preRunShopGfx2BuyBtn.textContent = "Owned";
      } else if (selectedIsStorageUpgrade && mineStorageMeta.isMaxed) {
        preRunShopGfx2BuyBtn.textContent = "Sold";
      }
    }
  }

  function updateLevelFinishedSummary() {
    if (levelFinishedArtEl) {
      var finishedArtPath = getLevelFinishedArtPath(state.currentLevel);
      if (finishedArtPath) {
        levelFinishedArtEl.src = finishedArtPath;
        levelFinishedArtEl.classList.remove("hidden");
      } else {
        levelFinishedArtEl.removeAttribute("src");
        levelFinishedArtEl.classList.add("hidden");
      }
    }
  }

  function updateLevelFinishedContinueButtonLabel() {
    if (!levelFinishedContinueBtn) {
      return;
    }
    var isBonusLevelTransition = state.currentLevel === 5 && isLevelXUnlocked() && !state.levelXEndlessActive;
    levelFinishedContinueBtn.setAttribute(
      "aria-label",
      isBonusLevelTransition ? "Continue to Level X" : "Continue to the next level"
    );
  }

  function attachPreRunScreen() {
    if (updateNoticeLaterBtn) {
      updateNoticeLaterBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        setUpdateNoticeOpen(false, false);
      });
    }
    if (updateNoticeApplyBtn) {
      updateNoticeApplyBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        openStoreUpdatePage();
      });
    }
    if (whatsNewOkBtn) {
      whatsNewOkBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        writeWhatsNewSeenVersionCode(APP_VERSION_INFO.versionCode);
        setWhatsNewNoticeOpen(false);
      });
    }
    if (badgeResetOkBtn) {
      badgeResetOkBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        setBadgeResetNoticeOpen(false);
      });
    }
    if (preRunPlayerNameBtn) {
      preRunPlayerNameBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        setPlayerNamePromptOpen(true);
      });
    }
    if (playerNameSaveBtn) {
      playerNameSaveBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        var normalizedName = normalizePlayerName(playerNameInputEl ? playerNameInputEl.value : "");
        var rawPassword = String(playerPasswordInputEl ? playerPasswordInputEl.value : "").trim();
        if (!normalizedName) {
          if (playerNameErrorEl) {
            playerNameErrorEl.textContent = "Please enter a valid name.";
            playerNameErrorEl.classList.remove("hidden");
          }
          return;
        }
        if (!rawPassword) {
          if (playerNameErrorEl) {
            playerNameErrorEl.textContent = "Please enter a password.";
            playerNameErrorEl.classList.remove("hidden");
          }
          return;
        }
        if (rawPassword.length < 4) {
          if (playerNameErrorEl) {
            playerNameErrorEl.textContent = "Password must have at least 4 characters.";
            playerNameErrorEl.classList.remove("hidden");
          }
          return;
        }
        setPlayerAuthPending(true);
        authenticatePlayer(normalizedName, rawPassword)
          .then(function (payload) {
            var accountId = normalizePlayerId(payload && payload.playerId);
            if (!accountId) {
              throw new Error("Invalid authentication response.");
            }
            switchPlayerSession(normalizedName, accountId, true);
          })
          .catch(function (error) {
            if (playerNameErrorEl) {
              if (error && error.code === "WRONG_PASSWORD") {
                playerNameErrorEl.textContent = "This player name already exists, but the password does not match. If this name is not yours, create a new one.";
              } else {
                playerNameErrorEl.textContent = (error && error.message) ? String(error.message) : "Sign in failed.";
              }
              playerNameErrorEl.classList.remove("hidden");
            }
          })
          .finally(function () {
            setPlayerAuthPending(false);
          });
      });
    }
    if (playerNameGuestBtn) {
      playerNameGuestBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        continueAsGuest();
      });
    }
    if (playerNameInputEl) {
      playerNameInputEl.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && playerNameSaveBtn) {
          playerNameSaveBtn.click();
        }
      });
    }
    if (playerPasswordInputEl) {
      playerPasswordInputEl.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && playerNameSaveBtn) {
          playerNameSaveBtn.click();
        }
      });
    }
    if (preRunJumpBtn) {
      preRunJumpBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        playUiPageOpenSound();
        openPreRunModeDetails(2);
      });
    }
    if (preRunGfx2ClassicBtn) {
      preRunGfx2ClassicBtn.addEventListener("click", function () {
        if (isPreRunGfx2SceneTransitionActive()) {
          return;
        }
        unlockAudioIfNeeded();
        playUiButtonSound();
        state.preRunGfx2ClassicExitActive = true;
        state.preRunGfx2ClassicExitTime = 0;
        setPreRunGfx2ForegroundFrame(0, PRE_RUN_GFX2_CLASSIC_FRAMES);
      });
    }
    if (preRunGfx2ClassicCornerBtn) {
      preRunGfx2ClassicCornerBtn.addEventListener("click", function () {
        if (isPreRunGfx2SceneTransitionActive()) {
          return;
        }
        unlockAudioIfNeeded();
        playUiButtonSound();
        state.preRunGfx2ClassicExitActive = true;
        state.preRunGfx2ClassicExitTime = 0;
        setPreRunGfx2ForegroundFrame(0, PRE_RUN_GFX2_CLASSIC_FRAMES);
      });
    }
    if (preRunGfx2SettingsCornerBtn) {
      preRunGfx2SettingsCornerBtn.addEventListener("click", function () {
        if (isPreRunGfx2SceneTransitionActive()) {
          return;
        }
        unlockAudioIfNeeded();
        playUiButtonSound();
        if (isGfx2StartScreenEnabled() && state.preRunStep === "select") {
          state.preRunGfx2SettingsExitActive = true;
          state.preRunGfx2SettingsExitTime = 0;
          setPreRunGfx2ForegroundFrame(0, PRE_RUN_GFX2_SETTINGS_FRAMES);
          return;
        }
        playUiPageOpenSound();
        state.preRunStep = "settings";
        renderPreRunScreen();
      });
    }
    if (preRunGfx2HouseClassicBtn) {
      preRunGfx2HouseClassicBtn.addEventListener("click", function () {
        if (isPreRunGfx2SceneTransitionActive()) {
          return;
        }
        unlockAudioIfNeeded();
        playUiButtonSound();
        state.preRunGfx2ClassicExitActive = true;
        state.preRunGfx2ClassicExitTime = 0;
        setPreRunGfx2ForegroundFrame(0, PRE_RUN_GFX2_CLASSIC_FRAMES);
      });
    }
    if (preRunFullBtn) {
      preRunFullBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        playUiPageOpenSound();
        openPreRunModeDetails(1);
      });
    }
    if (preRunGfx2AdvancedBtn) {
      preRunGfx2AdvancedBtn.addEventListener("click", function () {
        if (isPreRunGfx2SceneTransitionActive()) {
          return;
        }
        unlockAudioIfNeeded();
        playUiButtonSound();
        if (!isFullModeUnlocked()) {
          showPreRunGfx2FullModeLockNotice();
          return;
        }
        state.preRunGfx2AdvanceExitActive = true;
        state.preRunGfx2AdvanceExitTime = 0;
        setPreRunGfx2ForegroundFrame(0, PRE_RUN_GFX2_ADVANCE_FRAMES);
      });
    }
    if (preRunDifficultyToggleEl) {
      preRunDifficultyToggleEl.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        setPreRunDifficulty(state.gameDifficulty === "hard" ? "easy" : "hard");
      });
    }
    if (preRunBadgesBtn) {
      preRunBadgesBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        state.preRunStep = "badges";
        renderPreRunScreen();
      });
    }
    if (preRunGfx2BadgesBtn) {
      preRunGfx2BadgesBtn.addEventListener("click", function () {
        if (isPreRunGfx2SceneTransitionActive()) {
          return;
        }
        unlockAudioIfNeeded();
        playUiButtonSound();
        state.preRunGfx2BadgesExitActive = true;
        state.preRunGfx2BadgesExitTime = 0;
        setPreRunGfx2ForegroundFrame(0, PRE_RUN_GFX2_BADGES_FRAMES);
      });
    }
    if (preRunRulesBtn) {
      preRunRulesBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        playUiPageOpenSound();
        openPreRunRulesScreen();
      });
    }
    if (preRunGfx2RulesBtn) {
      preRunGfx2RulesBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        playUiPageOpenSound();
        openPreRunRulesScreen();
      });
    }
    if (preRunRulesPrevBtn) {
      preRunRulesPrevBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        setCurrentRulesPageIndex(getCurrentRulesPageIndex() - 1);
      });
    }
    if (preRunRulesNextBtn) {
      preRunRulesNextBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        setCurrentRulesPageIndex(getCurrentRulesPageIndex() + 1);
      });
    }
    if (preRunGfx2MineBtn) {
      preRunGfx2MineBtn.addEventListener("click", function () {
        if (isPreRunGfx2SceneTransitionActive()) {
          return;
        }
        unlockAudioIfNeeded();
        playUiButtonSound();
        startPreRunGfx2MineEntryAnimation();
      });
    }
    function openPreRunShop() {
      unlockAudioIfNeeded();
      playUiButtonSound();
      resetPreRunGfx2ShopVisitState();
      state.preRunGfx2ShopSelection = null;
      if (isGfx2StartScreenEnabled() && state.preRunStep === "select") {
        if (isPreRunGfx2SceneTransitionActive()) {
          return;
        }
        state.preRunGfx2ShopExitActive = true;
        state.preRunGfx2ShopExitTime = 0;
        setPreRunGfx2ForegroundFrame(0, PRE_RUN_GFX2_SHOP_FRAMES);
        return;
      }
      playUiPageOpenSound();
      state.preRunStep = "shop";
      renderPreRunScreen();
    }
    if (preRunShopBtn) {
      preRunShopBtn.addEventListener("click", openPreRunShop);
    }
    if (preRunGfx2ShopBtn) {
      preRunGfx2ShopBtn.addEventListener("click", openPreRunShop);
    }
    if (preRunSettingsBtn) {
      preRunSettingsBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        playUiPageOpenSound();
        state.preRunStep = "settings";
        renderPreRunScreen();
      });
    }
    if (preRunGfx2SettingsBtn) {
      preRunGfx2SettingsBtn.addEventListener("click", function () {
        if (isPreRunGfx2SceneTransitionActive()) {
          return;
        }
        unlockAudioIfNeeded();
        playUiButtonSound();
        if (isGfx2StartScreenEnabled() && state.preRunStep === "select") {
          state.preRunGfx2SettingsExitActive = true;
          state.preRunGfx2SettingsExitTime = 0;
          setPreRunGfx2ForegroundFrame(0, PRE_RUN_GFX2_SETTINGS_FRAMES);
          return;
        }
        playUiPageOpenSound();
        state.preRunStep = "settings";
        renderPreRunScreen();
      });
    }
    if (preRunGfx2HouseSettingsBtn) {
      preRunGfx2HouseSettingsBtn.addEventListener("click", function () {
        if (isPreRunGfx2SceneTransitionActive()) {
          return;
        }
        unlockAudioIfNeeded();
        playUiButtonSound();
        if (isGfx2StartScreenEnabled() && state.preRunStep === "select") {
          state.preRunGfx2SettingsExitActive = true;
          state.preRunGfx2SettingsExitTime = 0;
          setPreRunGfx2ForegroundFrame(0, PRE_RUN_GFX2_SETTINGS_FRAMES);
          return;
        }
        playUiPageOpenSound();
        state.preRunStep = "settings";
        renderPreRunScreen();
      });
    }
    if (preRunCreditsBtn) {
      preRunCreditsBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        playUiPageOpenSound();
        state.preRunStep = "credits";
        renderPreRunScreen();
      });
    }
    if (preRunGfx2CreditsBtn) {
      preRunGfx2CreditsBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        playUiPageOpenSound();
        state.preRunStep = "credits";
        renderPreRunScreen();
      });
    }
    if (preRunScoresBtn) {
      preRunScoresBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        state.preRunStep = "scores";
        renderPreRunScreen();
        loadPreRunScoresBoards();
      });
    }
    if (preRunGfx2ScoresBtn) {
      preRunGfx2ScoresBtn.addEventListener("click", function () {
        if (isPreRunGfx2SceneTransitionActive()) {
          return;
        }
        unlockAudioIfNeeded();
        playUiButtonSound();
        state.preRunGfx2ScoresExitActive = true;
        state.preRunGfx2ScoresExitTime = 0;
        setPreRunGfx2ForegroundFrame(0, PRE_RUN_GFX2_SCORES_FRAMES);
      });
    }
    var handlePreRunBadgesExit = function () {
      unlockAudioIfNeeded();
      playUiButtonSound();
      if (isGfx2StartScreenEnabled()) {
        startPreRunGfx2BackAnimation(PRE_RUN_GFX2_BADGES_BACK_FRAMES);
        return;
      }
      state.preRunStep = "select";
      renderPreRunScreen();
    };
    if (preRunBadgesBackBtn) {
      preRunBadgesBackBtn.addEventListener("click", handlePreRunBadgesExit);
    }
    if (preRunBadgesExitBtn) {
      preRunBadgesExitBtn.addEventListener("click", handlePreRunBadgesExit);
    }
    if (preRunRulesBackBtn) {
      preRunRulesBackBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        playUiPageOpenSound();
        state.preRunStep = "select";
        renderPreRunScreen();
      });
    }
    if (preRunCreditsBackBtn) {
      preRunCreditsBackBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        playUiPageOpenSound();
        state.preRunStep = "select";
        renderPreRunScreen();
      });
    }
    if (preRunShopBackBtn) {
      preRunShopBackBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        handlePreRunShopBackNavigation();
      });
    }
    if (preRunSettingsBackBtn) {
      preRunSettingsBackBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        handlePreRunSettingsBackNavigation();
      });
    }
    if (preRunSettingsScreenEl) {
      preRunSettingsScreenEl.addEventListener("pointerdown", suppressInGameSettingsTapDuringCooldown, true);
      preRunSettingsScreenEl.addEventListener("click", suppressInGameSettingsTapDuringCooldown, true);
      preRunSettingsScreenEl.addEventListener("touchstart", suppressInGameSettingsTapDuringCooldown, true);
    }
    window.addEventListener("pointerdown", handleGamePauseHitboxCapture, true);
    if (gamePauseHitboxBtn) {
      gamePauseHitboxBtn.addEventListener("pointerdown", function (event) {
        event.preventDefault();
        event.stopPropagation();
        openInGameSettings();
      });
    }
    if (preRunSettingsGfx2BackBtn) {
      preRunSettingsGfx2BackBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        handlePreRunSettingsBackNavigation();
      });
    }
    if (preRunScoresBackBtn) {
      preRunScoresBackBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        if (isGfx2StartScreenEnabled()) {
          startPreRunGfx2BackAnimation(PRE_RUN_GFX2_SCORES_BACK_FRAMES);
          return;
        }
        state.preRunStep = "select";
        renderPreRunScreen();
      });
    }
    if (preRunToggleSfxBtn) {
      preRunToggleSfxBtn.addEventListener("click", function () {
        togglePreRunSfxSetting();
      });
    }
    if (preRunToggleMusicBtn) {
      preRunToggleMusicBtn.addEventListener("click", function () {
        togglePreRunMusicSetting();
      });
    }
    if (preRunSettingsGfx2MusicVolumeEl) {
      preRunSettingsGfx2MusicVolumeEl.addEventListener("click", function (event) {
        if (event.target === preRunSettingsGfx2MusicBtn) {
          return;
        }
        togglePreRunMusicSetting();
      });
    }
    if (preRunSettingsGfx2MusicGraphicBtn) {
      preRunSettingsGfx2MusicGraphicBtn.addEventListener("click", function () {
        togglePreRunMusicSetting();
      });
    }
    if (preRunSettingsGfx2DebugBoxMusicEl) {
      preRunSettingsGfx2DebugBoxMusicEl.addEventListener("click", function () {
        togglePreRunMusicSetting();
      });
    }
    if (preRunSettingsGfx2MusicBtn) {
      preRunSettingsGfx2MusicBtn.addEventListener("input", function (event) {
        var nextMusicVolume = sanitizeGlobalAdminNumber("audioMusicVolumePercent", event.currentTarget.value);
        applyGlobalVolumeSetting("audioMusicVolumePercent", nextMusicVolume);
        rememberMusicRestoreVolumePercent(nextMusicVolume);
        applyGlobalAudioSetting("audioMusicEnabled", nextMusicVolume > 0);
        renderPreRunSettingsScreen();
      });
      preRunSettingsGfx2MusicBtn.addEventListener("change", function (event) {
        var nextMusicVolume = sanitizeGlobalAdminNumber("audioMusicVolumePercent", event.currentTarget.value);
        applyGlobalVolumeSetting("audioMusicVolumePercent", nextMusicVolume);
        rememberMusicRestoreVolumePercent(nextMusicVolume);
        applyGlobalAudioSetting("audioMusicEnabled", nextMusicVolume > 0);
        renderPreRunSettingsScreen();
      });
    }
    if (preRunSettingsGfx2SfxVolumeEl) {
      preRunSettingsGfx2SfxVolumeEl.addEventListener("click", function (event) {
        if (event.target === preRunSettingsGfx2SfxBtn) {
          return;
        }
        togglePreRunSfxSetting();
      });
    }
    if (preRunSettingsGfx2SfxGraphicBtn) {
      preRunSettingsGfx2SfxGraphicBtn.addEventListener("click", function () {
        togglePreRunSfxSetting();
      });
    }
    if (preRunSettingsGfx2DebugBoxSfxEl) {
      preRunSettingsGfx2DebugBoxSfxEl.addEventListener("click", function () {
        togglePreRunSfxSetting();
      });
    }
    if (preRunSettingsGfx2SfxBtn) {
      preRunSettingsGfx2SfxBtn.addEventListener("input", function (event) {
        var nextSfxVolume = sanitizeGlobalAdminNumber("audioSfxVolumePercent", event.currentTarget.value);
        applyGlobalVolumeSetting("audioSfxVolumePercent", nextSfxVolume);
        rememberSfxRestoreVolumePercent(nextSfxVolume);
        applyGlobalAudioSetting("audioSfxEnabled", nextSfxVolume > 0);
        renderPreRunSettingsScreen();
      });
      preRunSettingsGfx2SfxBtn.addEventListener("change", function (event) {
        var nextSfxVolume = sanitizeGlobalAdminNumber("audioSfxVolumePercent", event.currentTarget.value);
        applyGlobalVolumeSetting("audioSfxVolumePercent", nextSfxVolume);
        rememberSfxRestoreVolumePercent(nextSfxVolume);
        applyGlobalAudioSetting("audioSfxEnabled", nextSfxVolume > 0);
        renderPreRunSettingsScreen();
      });
    }
    if (preRunSettingsGfx2GlobalVolumeBtn) {
      preRunSettingsGfx2GlobalVolumeBtn.addEventListener("input", function (event) {
        applyGlobalVolumeSetting("audioMasterVolumePercent", event.currentTarget.value);
        renderPreRunSettingsScreen();
      });
      preRunSettingsGfx2GlobalVolumeBtn.addEventListener("change", function (event) {
        applyGlobalVolumeSetting("audioMasterVolumePercent", event.currentTarget.value);
        renderPreRunSettingsScreen();
      });
    }
    if (preRunSettingsGfx2AccountBtn) {
      preRunSettingsGfx2AccountBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        openChangeUserConfirm();
      });
    }
    if (preRunAccountConfirmNoBtn) {
      preRunAccountConfirmNoBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        closeChangeUserConfirm();
      });
    }
    if (preRunAccountConfirmYesBtn) {
      preRunAccountConfirmYesBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        closeChangeUserConfirm();
        setPlayerNamePromptOpen(true);
      });
    }
    if (preRunShopExchangeOneBtn) {
      preRunShopExchangeOneBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        exchangePersistentScoreForCoins(1);
        renderPreRunShopScreen();
        renderAdminForm();
        if (state.preRunStep === "badges") {
          renderBadgesScreen();
        }
      });
    }
    if (preRunShopExchangeTenBtn) {
      preRunShopExchangeTenBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        exchangePersistentScoreForCoins(10);
        renderPreRunShopScreen();
        renderAdminForm();
        if (state.preRunStep === "badges") {
          renderBadgesScreen();
        }
      });
    }
    if (preRunShopBuyKrobBtn) {
      preRunShopBuyKrobBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        var krobPrice = sanitizeGlobalAdminNumber("shopKrobPrice", C.shopKrobPrice);
        if (!isSkinUnlocked("Skin04") && spendCoinsFromWallet(krobPrice)) {
          unlockSkin("Skin04");
          renderPreRunShopScreen();
          refreshPreRunSkinSelection();
          renderAdminForm();
        }
      });
    }
    if (preRunShopGfx2ExitBtn) {
      preRunShopGfx2ExitBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        handlePreRunShopBackNavigation();
      });
    }
    if (preRunMineGfx2ExitBtn) {
      preRunMineGfx2ExitBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        handlePreRunMineBackNavigation();
      });
    }
    if (preRunMineGfx2TransferBtn) {
      preRunMineGfx2TransferBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        handleMineTransfer();
      });
    }
    if (preRunShopGfx2CoinOneBtn) {
      preRunShopGfx2CoinOneBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        selectPreRunGfx2ShopItem("short-timer");
      });
    }
    if (preRunShopGfx2CoinTenBtn) {
      preRunShopGfx2CoinTenBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        selectPreRunGfx2ShopItem("coin-ten");
      });
    }
    if (preRunShopGfx2NewLevelBtn) {
      preRunShopGfx2NewLevelBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        selectPreRunGfx2ShopItem("new-level");
      });
    }
    if (preRunShopGfx2SkinCatBtn) {
      preRunShopGfx2SkinCatBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        selectPreRunGfx2ShopItem("skin-05");
      });
    }
    if (preRunShopGfx2SkinCubeBtn) {
      preRunShopGfx2SkinCubeBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        selectPreRunGfx2ShopItem("skin-07");
      });
    }
    if (preRunShopGfx2Skin06Btn) {
      preRunShopGfx2Skin06Btn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        selectPreRunGfx2ShopItem("skin-06");
      });
    }
    if (preRunShopGfx2ChestBtn) {
      preRunShopGfx2ChestBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        selectPreRunGfx2ShopItem("chest");
      });
    }
    if (preRunShopGfx2BuyBtn) {
      preRunShopGfx2BuyBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        handlePreRunGfx2ShopPurchase();
      });
    }
    if (finalContinueBtn) {
      finalContinueBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        unlockAudioIfNeeded();
        playUiButtonSound();
        if (!state.continueOfferActive) {
          return;
        }
        openContinuePurchaseOverlay();
      });
    }
    if (finalWatchAdBtn) {
      finalWatchAdBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        unlockAudioIfNeeded();
        playUiButtonSound();
        if (!state.continueOfferActive || !canUseContinueAdForCurrentRun()) {
          return;
        }
        startContinueAdWatch();
      });
    }
    if (finalEndRunBtn) {
      finalEndRunBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        unlockAudioIfNeeded();
        playUiButtonSound();
        if (!state.continueOfferActive) {
          return;
        }
        completeRunAndReturnToPreRun();
      });
    }
    if (continuePurchaseBuyBtn) {
      continuePurchaseBuyBtn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        unlockAudioIfNeeded();
        playUiButtonSound();
        if (!state.continuePurchaseOverlayActive) {
          return;
        }
        var selectedLives = Math.max(0, Math.floor(Number(state.continuePurchaseSelectedLives) || 0));
        var totalPrice = getSelectedContinueLifeTotalPrice();
        if (selectedLives <= 0 || totalPrice <= 0 || getWalletBalanceAfterRunPreview() < totalPrice) {
          renderContinuePurchaseOverlay();
          return;
        }
        if (!spendCoinsForContinueOffer(totalPrice)) {
          updateGameOverSummary();
          renderContinuePurchaseOverlay();
          renderAdminForm();
          return;
        }
        incrementBadgeLifetimeStat("continuesUsed", 1);
        renderAdminForm();
        revivePlayerAfterContinue(selectedLives, "coin");
      });
    }
    if (continuePurchaseBackBtn) {
      continuePurchaseBackBtn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        unlockAudioIfNeeded();
        playUiButtonSound();
        closeContinuePurchaseOverlay();
      });
    }
    if (continuePurchaseOverlayEl) {
      continuePurchaseOverlayEl.addEventListener("click", function (event) {
        event.stopPropagation();
      });
    }
    if (gameOverEl) {
      gameOverEl.addEventListener("pointerdown", function (event) {
        if (!canReturnToPreRunFromGameOver()) {
          return;
        }
        if (event.target && event.target.closest) {
          if (event.target.closest("#final-continue-actions") || event.target.closest("#continue-purchase-overlay")) {
            return;
          }
        }
        event.preventDefault();
        event.stopPropagation();
        tryForceFullscreen();
        unlockAudioIfNeeded();
        openPreRunScreen();
      });
    }
    if (preRunBackBtn) {
      preRunBackBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        if (state.currentLevel > 1) {
          playUiPageOpenSound();
          openPreRunScreen();
          return;
        }
        if (isGfx2StartScreenEnabled()) {
          startPreRunGfx2BackAnimation(
            state.gameMode === 1 ? PRE_RUN_GFX2_ADVANCE_BACK_FRAMES : PRE_RUN_GFX2_CLASSIC_BACK_FRAMES
          );
          return;
        }
        playUiPageOpenSound();
        state.preRunStep = "select";
        renderPreRunScreen();
      });
    }
    if (preRunClassicGfx2ExitBtn) {
      preRunClassicGfx2ExitBtn.addEventListener("click", function () {
        if (preRunBackBtn) {
          preRunBackBtn.click();
        }
      });
    }
    if (preRunAdvancedGfx2ExitBtn) {
      preRunAdvancedGfx2ExitBtn.addEventListener("click", function () {
        if (preRunBackBtn) {
          preRunBackBtn.click();
        }
      });
    }
    if (preRunCompactBackBtn) {
      preRunCompactBackBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        playUiPageOpenSound();
        openPreRunScreen();
      });
    }
    if (preRunCompactAdminBtn) {
      preRunCompactAdminBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        promptForAdminPasswordAndOpenAdmin();
      });
    }
    if (preRunClassicGfx2AdminBtn) {
      preRunClassicGfx2AdminBtn.addEventListener("click", function () {
        if (preRunDetailAdminBtn) {
          preRunDetailAdminBtn.click();
        }
      });
    }
    if (preRunAdvancedGfx2AdminBtn) {
      preRunAdvancedGfx2AdminBtn.addEventListener("click", function () {
        if (preRunDetailAdminBtn) {
          preRunDetailAdminBtn.click();
        }
      });
    }
    if (preRunTesterInfoBtn) {
      preRunTesterInfoBtn.addEventListener("click", function () {
        window.open(TESTER_INFO_URL, "_blank");
      });
    }

    if (preRunFutureReleaseBtn) {
      preRunFutureReleaseBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        window.open(FUTURE_RELEASE_URL, "_blank");
      });
    }
    if (preRunDetailAdminBtn) {
      preRunDetailAdminBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        promptForAdminPasswordAndOpenAdmin();
      });
    }
    if (preRunStartBtn) {
      preRunStartBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        startPreRunLaunchTransition();
      });
    }
    if (preRunClassicGfx2StartBtn) {
      preRunClassicGfx2StartBtn.addEventListener("click", function () {
        if (preRunStartBtn) {
          preRunStartBtn.click();
        }
      });
    }
    if (preRunAdvancedGfx2StartBtn) {
      preRunAdvancedGfx2StartBtn.addEventListener("click", function () {
        if (preRunStartBtn) {
          preRunStartBtn.click();
        }
      });
    }
    if (preRunCompactStartBtn) {
      preRunCompactStartBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        startPreRunLaunchTransition();
      });
    }
    if (preRunClassicGfx2EasyBtn) {
      preRunClassicGfx2EasyBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        setPreRunDifficulty("easy");
      });
    }
    if (preRunAdvancedGfx2EasyBtn) {
      preRunAdvancedGfx2EasyBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        setPreRunDifficulty("easy");
      });
    }
    if (preRunClassicGfx2HardBtn) {
      preRunClassicGfx2HardBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        setPreRunDifficulty("hard");
      });
    }
    if (preRunAdvancedGfx2HardBtn) {
      preRunAdvancedGfx2HardBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        setPreRunDifficulty("hard");
      });
    }
    if (preRunSkinGridEl) {
      preRunSkinGridEl.addEventListener("click", function (event) {
        var skinBtn = event.target && event.target.closest ? event.target.closest(".pre-run-skin-btn") : null;
        if (!skinBtn || !skinBtn.dataset.skin || skinBtn.disabled) {
          return;
        }
        unlockAudioIfNeeded();
        playUiButtonSound();
        setSelectedSkinFromUi(skinBtn.dataset.skin);
      });
    }
    getPreRunGfx2ClassicSkinButtons().forEach(function (entry) {
      if (!entry.button || !entry.skin) {
        return;
      }
      entry.button.addEventListener("click", function () {
        if (entry.button.disabled) {
          return;
        }
        unlockAudioIfNeeded();
        playUiButtonSound();
        setSelectedSkinFromUi(entry.skin);
      });
    });
    getPreRunGfx2AdvancedSkinButtons().forEach(function (entry) {
      if (!entry.button || !entry.skin) {
        return;
      }
      entry.button.addEventListener("click", function () {
        if (entry.button.disabled) {
          return;
        }
        unlockAudioIfNeeded();
        playUiButtonSound();
        setSelectedSkinFromUi(entry.skin);
      });
    });
    if (preRunClassicGfx2Skin7Btn) {
      preRunClassicGfx2Skin7Btn.addEventListener("click", function () {
        if (preRunClassicGfx2Skin7Btn.disabled) {
          return;
        }
        unlockAudioIfNeeded();
        playUiButtonSound();
        setSelectedSkinFromUi("Skin07");
      });
    }
    if (preRunAdvancedGfx2Skin7Btn) {
      preRunAdvancedGfx2Skin7Btn.addEventListener("click", function () {
        if (preRunAdvancedGfx2Skin7Btn.disabled) {
          return;
        }
        unlockAudioIfNeeded();
        playUiButtonSound();
        setSelectedSkinFromUi("Skin07");
      });
    }
  }

  function attachLevelFinishedScreen() {
    if (!levelFinishedContinueBtn) {
      return;
    }
    levelFinishedContinueBtn.addEventListener("click", function () {
      unlockAudioIfNeeded();
      playUiButtonSound();
      if (!state.levelFinishedActive) {
        return;
      }
      state.levelFinishedActive = false;
      if (levelFinishedEl) {
        levelFinishedEl.classList.add("hidden");
      }
      if (state.currentLevel < LEVEL_COUNT) {
        prepareLevelContinuation(state.currentLevel + 1, false);
      } else if (state.currentLevel === 5 && isLevelXUnlocked() && !state.levelXEndlessActive) {
        prepareLevelContinuation(5, true);
      }
      refreshMusicPlayback();
    });
  }

  function setAdminOpen(isOpen) {
    if (!adminPanel) {
      return;
    }

    if (isOpen) {
      unlockAudioIfNeeded();
      flushBadgeStatsStorage(true, 0);
      renderAdminForm();
      adminPanel.hidden = false;
      adminPanel.classList.remove("hidden");
      state.adminPaused = true;
      playUiPageOpenSound();
    } else {
      adminPanel.hidden = true;
      adminPanel.classList.add("hidden");
      setAdminResetConfirmOpen(false);
      state.adminPaused = false;
      if (state.preRunActive) {
        renderPreRunScreen();
      }
    }

    input.left = false;
    input.right = false;
    input.jumpDown = false;
    input.jumpPressed = false;
    refreshMusicPlayback();
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

  function sanitizeAdminPasswordValue(value) {
    var normalized = String(value || "").trim();
    return normalized || DEFAULT_ADMIN_PASSWORD;
  }

  function normalizeGlobalAdminStringValue(key, value) {
    if (key === "selectedSkin") {
      return normalizeSkinName(value);
    }
    if (key === "adminPassword") {
      return sanitizeAdminPasswordValue(value);
    }
    return isAudioGlobalPathKey(key) ? sanitizeAudioPathValue(value) : String(value || "");
  }

  function promptForAdminPasswordAndOpenAdmin() {
    if (!C.adminPasswordRequired) {
      setAdminOpen(true);
      return;
    }
    var enteredPassword = window.prompt("Enter admin password:");
    if (enteredPassword === null) {
      return;
    }
    if (sanitizeAdminPasswordValue(enteredPassword) !== sanitizeAdminPasswordValue(C.adminPassword)) {
      window.alert("Wrong password.");
      return;
    }
    setAdminOpen(true);
  }

  function updateOverlayUiVisibility() {
    if (adminToggle) {
      adminToggle.classList.toggle("hidden", !state.preRunActive || state.levelFinishedActive);
    }
    if (state.preRunActive || state.levelFinishedActive) {
      if (state.inGameSettingsActive) {
        closeInGameSettings();
      }
      setAdminOpen(false);
    }
    updateGamePauseUiVisibility();
  }

  function updateGamePauseUiVisibility() {
    var showPauseHitbox =
      Boolean(gamePauseHitboxBtn) &&
      state.running &&
      !state.adminPaused &&
      !state.preRunActive &&
      !state.levelFinishedActive &&
      !state.gamePauseActive &&
      !isGameOverScreenVisible() &&
      !state.questionCoinAnimActive &&
      !state.teleportFinishAnimActive &&
      !state.projectileDeathAnimActive &&
      !state.badgeRewardActive;

    if (gamePauseHitboxBtn) {
      gamePauseHitboxBtn.classList.toggle("hidden", !showPauseHitbox);
    }

    if (preRunSettingsScreenEl) {
      var showSettingsOverlay = (state.preRunActive && state.preRunStep === "settings") || state.inGameSettingsActive;
      preRunSettingsScreenEl.classList.toggle("hidden", !showSettingsOverlay);
      preRunSettingsScreenEl.classList.toggle("in-game-pause", state.inGameSettingsActive);
    }
    if (preRunScreenEl) {
      setPreRunScreenHidden(!state.preRunActive && !state.inGameSettingsActive);
    }
  }

  function handleGamePauseHitboxCapture(event) {
    if (
      !gamePauseHitboxBtn ||
      gamePauseHitboxBtn.classList.contains("hidden") ||
      state.gamePauseActive ||
      state.inGameSettingsActive ||
      state.preRunActive ||
      state.levelFinishedActive ||
      isGameOverScreenVisible() ||
      state.questionCoinAnimActive ||
      state.teleportFinishAnimActive ||
      state.projectileDeathAnimActive ||
      state.badgeRewardActive
    ) {
      return;
    }

    var rect = gamePauseHitboxBtn.getBoundingClientRect();
    var withinX = event.clientX >= rect.left && event.clientX <= rect.right;
    var withinY = event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!withinX || !withinY) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    if (event.stopImmediatePropagation) {
      event.stopImmediatePropagation();
    }
    openInGameSettings();
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
      var globalSectionTitleRow = document.createElement("div");
      globalSectionTitleRow.className = "admin-section-title-row";

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
      globalSectionTitleRow.appendChild(globalSectionTitle);
      if (globalSection.title === "Badges") {
        var resetBadgesBtn = document.createElement("button");
        resetBadgesBtn.type = "button";
        resetBadgesBtn.className = "admin-reset-max-btn admin-reset-badges-btn";
        resetBadgesBtn.textContent = "Reset Badges";
        resetBadgesBtn.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopPropagation();
          unlockAudioIfNeeded();
          playUiButtonSound();
          resetBadgeProgressOnly();
        });
        globalSectionTitleRow.appendChild(resetBadgesBtn);
      }
      globalSectionEl.appendChild(globalSectionTitleRow);

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
        } else if (globalField.type === "password") {
          if (typeof C[globalField.key] !== "string") {
            continue;
          }
          globalInput = document.createElement("input");
          globalInput.type = "password";
          globalInput.value = sanitizeAdminPasswordValue(C[globalField.key]);
        } else if (globalField.type === "text") {
          if (typeof C[globalField.key] !== "string") {
            continue;
          }
          globalInput = document.createElement("input");
          globalInput.type = "text";
          globalInput.value = String(C[globalField.key] || "");
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
          globalInput.value = normalizeGlobalAdminStringValue(globalField.key, C[globalField.key]);
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
        } else if (globalField.type === "shop-summary") {
          globalRow.classList.add("admin-field-stacked");
          globalRow.classList.add("admin-field-no-label");
          globalInput = document.createElement("div");
          globalInput.className = "admin-inline-checkbox-wrap";

          var shopSummaryList = document.createElement("div");
          shopSummaryList.className = "admin-inline-checkbox-list";

          function appendShopSummaryValue(label, value) {
            var item = document.createElement("div");
            item.className = "admin-inline-checkbox-caption";
            item.textContent = label + ": " + value;
            shopSummaryList.appendChild(item);
          }

          appendShopSummaryValue("Persistent Total Score", getPersistentTotalScore().toLocaleString("en-US"));
          appendShopSummaryValue("Coin Wallet Balance", getCoinWalletBalance().toLocaleString("en-US"));
          appendShopSummaryValue("Total Coins Earned", Math.max(0, Math.floor(Number(economyStats.totalCoinsEarned) || 0)).toLocaleString("en-US"));
          appendShopSummaryValue("Total Coins Spent", Math.max(0, Math.floor(Number(economyStats.totalCoinsSpent) || 0)).toLocaleString("en-US"));
          globalInput.appendChild(shopSummaryList);
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
        } else if (globalField.type === "badges-config") {
          globalRow.classList.add("admin-field-stacked");
          globalRow.classList.add("admin-field-no-label");
          globalInput = document.createElement("div");
          globalInput.className = "admin-badges-config";

          for (var badgeCategoryIndex = 0; badgeCategoryIndex < BADGE_CATEGORY_ORDER.length; badgeCategoryIndex += 1) {
            var badgeCategoryName = BADGE_CATEGORY_ORDER[badgeCategoryIndex];
            var badgeCategorySeries = BADGE_SERIES.filter(function (series) {
              return series.category === badgeCategoryName;
            });

            if (!badgeCategorySeries.length) {
              continue;
            }

            var badgeCategoryCard = document.createElement("section");
            badgeCategoryCard.className = "admin-badge-category";

            var badgeCategoryHeader = document.createElement("div");
            badgeCategoryHeader.className = "admin-badge-category-header";
            var badgeCategoryTitle = document.createElement("h4");
            badgeCategoryTitle.textContent = badgeCategoryName;
            var badgeCategoryCopy = document.createElement("p");
            badgeCategoryCopy.textContent = BADGE_CATEGORY_COPY[badgeCategoryName] || "";
            badgeCategoryHeader.appendChild(badgeCategoryTitle);
            badgeCategoryHeader.appendChild(badgeCategoryCopy);
            badgeCategoryCard.appendChild(badgeCategoryHeader);

            var badgeSeriesGrid = document.createElement("div");
            badgeSeriesGrid.className = "admin-badge-series-grid";

            for (var badgeSeriesIndex = 0; badgeSeriesIndex < badgeCategorySeries.length; badgeSeriesIndex += 1) {
              var badgeSeries = badgeCategorySeries[badgeSeriesIndex];
              var badgeSeriesCard = document.createElement("div");
              badgeSeriesCard.className = "admin-badge-series-card";

              var badgeNameField = document.createElement("div");
              badgeNameField.className = "admin-field";
              var badgeNameLabel = document.createElement("label");
              badgeNameLabel.textContent = "Badge name";
              var badgeNameInput = document.createElement("input");
              badgeNameInput.type = "text";
              badgeNameInput.value = getBadgeSeriesName(badgeSeries);
              badgeNameInput.dataset.key = getBadgeSeriesNameStorageKey(badgeSeries.id);
              badgeNameInput.addEventListener("change", function (event) {
                var target = event.target;
                var value = String(target.value || "").trim();
                var fallbackSeries = BADGE_SERIES.find(function (series) {
                  return getBadgeSeriesNameStorageKey(series.id) === target.dataset.key;
                });
                saveGlobalAdminField(target.dataset.key, value || (fallbackSeries ? fallbackSeries.name : ""));
                renderPreRunScreen();
              });
              badgeNameField.appendChild(badgeNameLabel);
              badgeNameField.appendChild(badgeNameInput);
              badgeSeriesCard.appendChild(badgeNameField);

              for (var badgeSeriesTierIndex = 0; badgeSeriesTierIndex < badgeSeries.tiers.length; badgeSeriesTierIndex += 1) {
                (function (series, tierIndex) {
                  var tier = series.tiers[tierIndex];
                  var badgeTierField = document.createElement("div");
                  badgeTierField.className = "admin-field admin-badge-goal-field";
                  var badgeTierLabel = document.createElement("label");
                  badgeTierLabel.textContent = tier.tier + " goal";
                  var badgeTierControl = document.createElement("div");
                  badgeTierControl.className = "admin-badge-goal-control";
                  var collectedValue = document.createElement("span");
                  collectedValue.className = "admin-badge-goal-collected";
                  collectedValue.textContent = formatBadgeCollectedNumber(series, tierIndex) + " (collected)";
                  var fromText = document.createElement("span");
                  fromText.className = "admin-badge-goal-from";
                  fromText.textContent = "from";
                  var badgeTierInput = document.createElement("input");
                  badgeTierInput.type = "number";
                  badgeTierInput.min = "0";
                  badgeTierInput.step = "1";
                  badgeTierInput.value = String(getBadgeTierTarget(series, tierIndex));
                  badgeTierInput.dataset.key = getBadgeSeriesTierTargetStorageKey(series.id, tierIndex);
                  var badgeTierUnit = document.createElement("span");
                  badgeTierUnit.className = "admin-badge-goal-unit";
                  badgeTierUnit.textContent = getBadgeAdminUnitText(series, tierIndex);
                  badgeTierInput.addEventListener("change", function (event) {
                    var target = event.target;
                    var value = sanitizeBadgeTarget(series, tierIndex, target.value);
                    target.value = String(value);
                    saveGlobalAdminField(target.dataset.key, value);
                    renderPreRunScreen();
                  });
                  badgeTierField.appendChild(badgeTierLabel);
                  badgeTierControl.appendChild(collectedValue);
                  badgeTierControl.appendChild(fromText);
                  badgeTierControl.appendChild(badgeTierInput);
                  badgeTierControl.appendChild(badgeTierUnit);
                  badgeTierField.appendChild(badgeTierControl);
                  badgeSeriesCard.appendChild(badgeTierField);
                })(badgeSeries, badgeSeriesTierIndex);
              }

              badgeSeriesGrid.appendChild(badgeSeriesCard);
            }

            badgeCategoryCard.appendChild(badgeSeriesGrid);
            globalInput.appendChild(badgeCategoryCard);
          }
        } else {
          continue;
        }

        if (globalField.type !== "skin-pickup-levels" && globalField.type !== "shop-summary") {
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
              } else if (key === "adminPassword") {
                nextValue = sanitizeAdminPasswordValue(nextValue);
                target.value = nextValue;
              } else if (isAudioGlobalPathKey(key)) {
                nextValue = sanitizeAudioPathValue(nextValue);
                target.value = nextValue;
              }
            }
            saveGlobalAdminField(key, nextValue);
            C[key] = nextValue;
            if (key === "modernVisualsEnabled") {
              applyVisualThemeToUi();
              updateLivesUi();
            } else if (key === "badgesV2Enabled") {
              renderPreRunScreen();
            } else if (key === "selectedSkin") {
              C.selectedSkin = normalizeSkinName(nextValue);
              syncModernVisualsWithSelectedSkin(C.selectedSkin);
              refreshPreRunSkinSelection();
              renderAdminForm();
            } else if (key === "hardModeUnlockLevel" || key === "fullModeUnlockJumpHardScore") {
              normalizeUnlockedPreRunSelection();
              refreshPreRunBriefValues();
              renderPreRunScreen();
            }
            if (
              key === "audioMusicEnabled" ||
              key === "audioSfxEnabled" ||
              key === "audioMasterVolumePercent" ||
              key === "audioMusicVolumePercent" ||
              key === "audioSfxVolumePercent" ||
              isAudioGlobalPathKey(key)
            ) {
              refreshSfxOutputGain();
              warmCurrentSfxBuffers();
              refreshMusicPlayback();
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
      { mode: 2, difficulty: "easy", label: "Reset Jump Classic Easy" },
      { mode: 1, difficulty: "easy", label: "Reset Jump Advanced Easy" },
      { mode: 2, difficulty: "hard", label: "Reset Jump Classic Hard" },
      { mode: 1, difficulty: "hard", label: "Reset Jump Advanced Hard" }
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
                if (!isFieldVisibleForLevel(field, targetLevel)) {
                  continue;
                }
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
                } else if (typeof value === "string") {
                  persisted[key] = isAudioLevelFieldKey(key) ? sanitizeAudioPathValue(value) : String(value);
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
              if (!isFieldVisibleForLevel(field, level)) {
                continue;
              }
              if (!isFieldVisibleForMode(mode, field.key)) {
                continue;
              }
              if (
                typeof modeConfig[field.key] !== "number" &&
                typeof modeConfig[field.key] !== "boolean" &&
                typeof modeConfig[field.key] !== "string"
              ) {
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
              input.type = field.type === "checkbox" ? "checkbox" : (field.type === "text" ? "text" : "number");
              if (field.type === "checkbox") {
                input.checked = Boolean(modeConfig[field.key]);
              } else if (field.type === "text") {
                input.value = String(modeConfig[field.key] || "");
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

                if (target.type === "text") {
                  nextValue = isAudioLevelFieldKey(key)
                    ? sanitizeAudioPathValue(target.value)
                    : String(target.value || "");
                  target.value = nextValue;
                  saveAdminFieldToStorage(targetLevel, targetMode, targetDifficulty, key, nextValue);
                  if (
                    state.currentLevel === targetLevel &&
                    state.gameMode === targetMode &&
                    state.gameDifficulty === targetDifficulty
                  ) {
                    C[key] = nextValue;
                    if (isAudioLevelFieldKey(key)) {
                      warmCurrentSfxBuffers();
                      refreshMusicPlayback();
                    }
                  }
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
      unlockAudioIfNeeded();
      playUiButtonSound();
      var shouldOpen = adminPanel.classList.contains("hidden");
      if (shouldOpen) {
        promptForAdminPasswordAndOpenAdmin();
      } else {
        setAdminOpen(false);
      }
    });

    adminClose.addEventListener("click", function () {
      unlockAudioIfNeeded();
      playUiButtonSound();
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
        unlockAudioIfNeeded();
        playUiButtonSound();
        triggerSettingsExportDownload();
      });
    }

    if (adminResetAllBtn) {
      adminResetAllBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        setAdminResetConfirmOpen(true);
      });
    }

    if (adminResetConfirmCancelBtn) {
      adminResetConfirmCancelBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        setAdminResetConfirmOpen(false);
      });
    }

    if (adminResetConfirmApplyBtn) {
      adminResetConfirmApplyBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        setAdminResetConfirmOpen(false);
        resetAllSettingsToDefaults();
      });
    }

    if (adminCopyJsonBtn) {
      adminCopyJsonBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
        copySettingsJsonToClipboard();
      });
    }

    if (adminImportFileBtn && adminImportFileInput) {
      adminImportFileBtn.addEventListener("click", function () {
        unlockAudioIfNeeded();
        playUiButtonSound();
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
        unlockAudioIfNeeded();
        playUiButtonSound();
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

  function setPreRunScreenHidden(isHidden) {
    if (!preRunScreenEl) {
      return;
    }
    if (isHidden) {
      clearShopStorageAdWatchTimer();
      state.preRunGfx2ShopStorageAdWatchActive = false;
      state.preRunGfx2ShopStorageAdWatchMode = "";
      state.preRunGfx2ShopStorageAdWatchSecondsLeft = 0;
      clearMineTransferAdWatchTimer();
      state.mineTransferAdWatchActive = false;
      state.mineTransferAdWatchMode = "";
      state.mineTransferAdWatchSecondsLeft = 0;
    }
    preRunScreenEl.hidden = !!isHidden;
    preRunScreenEl.classList.toggle("hidden", !!isHidden);
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
    if (mode2Wrap) {
      mode2Wrap.classList.toggle("active", state.gameMode === 2);
    }

    renderLivesInto(mode2LivesEl);

    if (mode2LivesEl) {
      mode2LivesEl.style.visibility = "visible";
    }
    if (mode1LivesEl) {
      mode1LivesEl.style.visibility = "hidden";
    }
  }

  function updateModeSwitchLayout() {
    if (!gameShell || !modeSwitchEl) {
      return;
    }

    var shellRect = gameShell.getBoundingClientRect ? gameShell.getBoundingClientRect() : null;
    var shellWidth = Math.max(1, shellRect ? shellRect.width : canvas.width || 1);
    var shellHeight = Math.max(1, shellRect ? shellRect.height : canvas.height || 1);
    var modeSwitchTop = Math.max(4, Math.round(shellHeight * 0.0115));
    var modeSwitchHeight = Math.max(24, Math.round(shellHeight * 0.045));
    var modeSlotGap = Math.max(4, Math.round(shellHeight * 0.008));
    var modeLivesTop = Math.max(8, Math.round(shellHeight * 0.0557));
    var modeLivesShift = Math.max(24, Math.round(shellWidth * 0.0475));
    var modeLivesGap = Math.max(3, Math.round(shellWidth * 0.005));
    var lifeSize = Math.max(12, Math.round(shellHeight * 0.0386));

    modeSwitchEl.style.setProperty("--mode-switch-top", modeSwitchTop + "px");
    modeSwitchEl.style.setProperty("--mode-switch-height", modeSwitchHeight + "px");
    modeSwitchEl.style.setProperty("--mode-slot-gap", modeSlotGap + "px");
    modeSwitchEl.style.setProperty("--mode-lives-top", modeLivesTop + "px");
    modeSwitchEl.style.setProperty("--mode-lives-shift", modeLivesShift + "px");
    modeSwitchEl.style.setProperty("--mode-lives-gap", modeLivesGap + "px");
    modeSwitchEl.style.setProperty("--life-square-size", lifeSize + "px");
  }

  function applyGameModeToUi() {
    if (mode1Btn && mode2Btn) {
      mode1Btn.classList.toggle("active", state.gameMode === 1);
      mode2Btn.classList.toggle("active", state.gameMode === 2);
    }
    if (mode1Wrap && mode2Wrap) {
      mode1Wrap.classList.add("hidden");
      mode2Wrap.classList.remove("hidden");
    }

    if (touchControls) {
      touchControls.classList.toggle("mode-full", state.gameMode === 1);
      touchControls.classList.toggle("mode-jump", state.gameMode === 2);
    }

    updateLivesUi();
    updateModeSwitchLayout();
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

    updatePreRunClassicGfx2BoardMetrics();
    updatePreRunGfx2InsideBoardMetrics(preRunAdvancedGfx2BoardEl);
    primePreRunGfx2CloudMotion(false);

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
      updatePreRunClassicGfx2BoardMetrics();
      updatePreRunGfx2InsideBoardMetrics(preRunAdvancedGfx2BoardEl);
      updateModeSwitchLayout();
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
    updatePreRunClassicGfx2BoardMetrics();
    updatePreRunGfx2InsideBoardMetrics(preRunAdvancedGfx2BoardEl);
    updateModeSwitchLayout();
  }

  function scheduleResponsiveLayoutRefresh() {
    if (responsiveLayoutRefreshFrameId) {
      window.cancelAnimationFrame(responsiveLayoutRefreshFrameId);
      responsiveLayoutRefreshFrameId = 0;
    }
    if (responsiveLayoutRefreshTimeoutId) {
      window.clearTimeout(responsiveLayoutRefreshTimeoutId);
      responsiveLayoutRefreshTimeoutId = 0;
    }

    applyResponsiveLayout();

    responsiveLayoutRefreshFrameId = window.requestAnimationFrame(function () {
      responsiveLayoutRefreshFrameId = 0;
      applyResponsiveLayout();
    });

    responsiveLayoutRefreshTimeoutId = window.setTimeout(function () {
      responsiveLayoutRefreshTimeoutId = 0;
      applyResponsiveLayout();
    }, 80);
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
    resetOnlineHighscoreUi("");
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
    if (resetLives || !state.runBadgeStats) {
      resetRunBadgeStats();
      state.continueUsesThisRun = 0;
      state.continueOfferActive = false;
      state.continuePurchaseOverlayActive = false;
      state.continuePurchaseSelectedLives = 0;
      state.runFinalized = false;
      state.pendingRunCoinSpend = 0;
      state.lifeLossInvulnerabilityTimeLeft = 0;
    } else {
      state.runBadgeStats.levelHadLifeLoss = false;
    }
    if (resetLives) {
      state.badgeCursedSecondsAccumulator = 0;
    }
    state.maxLives = sanitizeConfigValue("livesCount", C.livesCount);
    if (resetLives) {
      state.livesLeft = state.maxLives;
    } else {
    state.livesLeft = Math.max(1, Math.min(state.livesLeft, state.maxLives));
    }
    state.lifeLossFlashTimeLeft = 0;
    state.skinUnlockToastTimeLeft = 0;
    state.skinUnlockToastText = "";
    resetSkinRewardOverlay(resetLives);
    state.lastHardUnlockShown = false;
    state.lastFullUnlockShown = false;
    state.speedPercent = 0;
    state.scrollSpeed = C.worldAutoRunSpeed;
    state.speedSlowMultiplier = 1;
    state.slowTimeLeft = 0;
    state.startX = spawnX;
    state.cameraX = 0;
    world.generateAhead(state.cameraX, C.canvasWidth);
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
    state.continueShieldActive = false;
    state.continueShieldTimeLeft = 0;
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
    state.elevatorCoinsUnlocked = false;
    state.platformCoinTimer = C.platformCoinInitialDelaySeconds;
    state.lastPlatformCoinPlatformId = -1;
    state.platformCoinIcon.active = false;
    state.platformCoinIcon.x = 0;
    state.platformCoinIcon.y = 0;
    state.platformCoinIcon.platformId = -1;
    state.skinPickupIcon.active = false;
    state.skinPickupIcon.x = 0;
    state.skinPickupIcon.y = 0;
    state.skinPickupIcon.platformId = -1;
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

  function isLifeLossProtectedCause(cause) {
    return cause === "topDeathZone" || cause === "projectile" || cause === "blocker";
  }

  function isLifeLossInvulnerabilityActive() {
    return Number(state.lifeLossInvulnerabilityTimeLeft) > 0;
  }

  function applyLifeLossInvulnerabilityResponse(cause) {
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
    }
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

  function revivePlayerAfterContinue(grantedLivesOverride, continueSource) {
    var grantedLives = Math.max(
      1,
      Math.min(getContinueMaxPurchasableLives(), Math.floor(Number(grantedLivesOverride) || 0) || 1)
    );
    if (continueSource === "ad") {
      state.continueAdUsesThisRun = Math.min(2, Math.max(0, Math.floor(Number(state.continueAdUsesThisRun) || 0)) + 1);
    } else {
      state.continueUsesThisRun = 1;
    }
    state.continueOfferActive = false;
    state.continueAdWatchActive = false;
    state.continueAdWatchMode = "";
    state.continueAdWatchSecondsLeft = 0;
    clearContinueAdWatchTimer();
    closeContinuePurchaseOverlay();
    state.running = true;
    state.projectileDeathAnimActive = false;
    state.teleportFinishAnimActive = false;
    state.questionCoinAnimActive = false;
    state.lifeLossFlashTimeLeft = 0;
    state.lifeLossInvulnerabilityTimeLeft = 3;
    state.shieldBurstActive = false;
    state.continueShieldActive = true;
    state.continueShieldTimeLeft = 3;
    state.livesLeft = grantedLives;
    input.left = false;
    input.right = false;
    input.jumpDown = false;
    input.jumpPressed = false;

    if (!rescuePlayerFromBottomDeathZone()) {
      var fallback = resolveRespawnPoint();
      player.x = fallback.x;
      player.y = fallback.y;
      player.velocityX = 0;
      player.velocityY = 0;
      player.isGrounded = false;
      player.supportType = null;
      player.supportRef = null;
    }

    updateLivesUi();
    updateGameOverSummary();
    if (gameOverEl) {
      gameOverEl.classList.add("hidden");
    }
    refreshMusicPlayback();
  }

  function consumeShield(cause) {
    if (state.continueShieldActive && cause === "bottomDeathZone") {
      if (!rescuePlayerFromBottomDeathZone()) {
        return false;
      }
      state.lifeLossFlashTimeLeft = 0.25;
      playLevelSfx("levelShieldBreakSoundPath", 120);
      recordShieldSave();
      return true;
    }

    if (state.shieldCharges <= 0 || !isShieldProtectableCause(cause)) {
      return false;
    }

    state.shieldCharges = Math.max(0, state.shieldCharges - 1);
    state.lifeLossFlashTimeLeft = 0.25;
    playLevelSfx("levelShieldBreakSoundPath", 120);

    if (cause === "bottomDeathZone") {
      if (!rescuePlayerFromBottomDeathZone()) {
        return false;
      }
      recordShieldSave();
      return true;
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
      recordShieldSave();
      return true;
    }

    startShieldBurstEffect();
    recordShieldSave();
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

    if (isLifeLossProtectedCause(cause) && isLifeLossInvulnerabilityActive()) {
      applyLifeLossInvulnerabilityResponse(cause);
      return true;
    }

    if (!shouldUseLivesForCause(cause)) {
      return false;
    }

    state.livesLeft = Math.max(1, state.livesLeft - 1);
    state.lifeLossFlashTimeLeft = 0.25;
    state.lifeLossInvulnerabilityTimeLeft = LIFE_LOSS_INVULNERABILITY_SECONDS;
    recordLifeLost();
    playLevelSfx("levelLifeLossSoundPath", 100);

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
      unlockAudioIfNeeded();
      var key = event.key.toLowerCase();

      if (state.questionCoinAnimActive && !state.questionCoinAnimApplied && (event.key === " " || event.key === "Enter")) {
        confirmQuestionCoinAnimation();
        return;
      }

      if (state.badgeRewardActive) {
        if (event.key === " " || event.key === "Enter") {
          advanceBadgeRewardSequence();
        }
        return;
      }

      if ((event.key === " " || event.key === "Enter") && advanceSkinRewardOverlay()) {
        event.preventDefault();
        return;
      }

      if (state.preRunActive && state.preRunStep === "details" && (event.key === " " || event.key === "Enter")) {
        startPreRunLaunchTransition();
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
        if (state.continueOfferActive) {
          if (finalContinueBtn) {
            finalContinueBtn.click();
          }
          return;
        }
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

    if (badgeRewardOverlayEl) {
      badgeRewardOverlayEl.addEventListener("pointerdown", function (event) {
        event.preventDefault();
        event.stopPropagation();
        tryForceFullscreen();
        unlockAudioIfNeeded();
        advanceBadgeRewardSequence();
      });
    }
    if (skinRewardOverlayEl) {
      skinRewardOverlayEl.addEventListener("pointerdown", function (event) {
        event.preventDefault();
        event.stopPropagation();
        tryForceFullscreen();
        unlockAudioIfNeeded();
        advanceSkinRewardOverlay();
      });
    }
    if (modeRewardOverlayEl) {
      modeRewardOverlayEl.addEventListener("pointerdown", function (event) {
        event.preventDefault();
        event.stopPropagation();
        tryForceFullscreen();
        unlockAudioIfNeeded();
        modeRewardOverlayEl.classList.add("hidden");
        modeRewardOverlayEl.classList.remove("is-revealing", "is-ready");
      });
    }

    canvas.addEventListener("pointerdown", function () {
      tryForceFullscreen();
      unlockAudioIfNeeded();
      if (state.questionCoinAnimActive && !state.questionCoinAnimApplied) {
        confirmQuestionCoinAnimation();
      }
    });

    if (levelFinishedEl) {
      levelFinishedEl.addEventListener("pointerdown", function () {
        tryForceFullscreen();
        unlockAudioIfNeeded();
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
      unlockAudioIfNeeded();
      if (state.questionCoinAnimActive && !state.questionCoinAnimApplied) {
        confirmQuestionCoinAnimation();
        return;
      }
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

    if (state.preRunLaunchActive && !state.adminPaused) {
      updatePreRunLaunchTransition(dt);
    } else if (state.preRunActive && !state.adminPaused) {
      if (state.preRunGfx2BackActive) {
        updatePreRunGfx2BackAnimation(dt);
      } else if (state.preRunGfx2MineEntryActive) {
        updatePreRunGfx2MineEntryAnimation(dt);
      } else if (state.preRunGfx2MineExitActive) {
        updatePreRunMineExitAnimation(dt);
      } else if (state.preRunGfx2ClassicExitActive) {
        updatePreRunGfx2ClassicExitAnimation(dt);
      } else if (state.preRunGfx2AdvanceExitActive) {
        updatePreRunGfx2AdvanceExitAnimation(dt);
      } else if (state.preRunGfx2ScoresExitActive) {
        updatePreRunGfx2ScoresExitAnimation(dt);
      } else if (state.preRunGfx2BadgesExitActive) {
        updatePreRunGfx2BadgesExitAnimation(dt);
      } else if (state.preRunGfx2ShopExitActive) {
        updatePreRunGfx2ShopExitAnimation(dt);
      } else if (state.preRunGfx2SettingsExitActive) {
        updatePreRunGfx2SettingsExitAnimation(dt);
      } else {
        updatePreRunGfx2EntranceAnimation(dt);
      }
      updatePreRunGfx2WaitAnimation(dt);
    } else if (state.running && !state.adminPaused && !state.preRunActive && !state.gamePauseActive) {
      update(dt);
    } else if (state.questionCoinAnimActive && !state.adminPaused && !state.preRunActive) {
      updateQuestionCoinAnimation(dt);
    } else if (state.teleportFinishAnimActive && !state.adminPaused && !state.preRunActive) {
      updateTeleportFinishAnimation(dt);
    } else if (state.projectileDeathAnimActive && !state.adminPaused && !state.preRunActive) {
      updateProjectileDeathAnimation(dt);
    } else if (state.badgeRewardActive && !state.adminPaused && !state.preRunActive) {
      updateBadgeRewardSequence(dt);
    }
    updatePreRunGfx2CloudMotion(dt);
    if (state.preRunActive && state.preRunStep === "mine" && !state.adminPaused) {
      renderPreRunMineScreen();
    }
    flushBadgeStatsStorage(false, dt);
    render();

    input.jumpPressed = false;
    requestAnimationFrame(loop);
  }

  preloadPreRunGfx2EntranceFrames();

  function update(dt) {
    state.runTimeSeconds += dt;
    state.levelRunTimeSeconds += dt;
    if (state.lifeLossFlashTimeLeft > 0) {
      state.lifeLossFlashTimeLeft = Math.max(0, state.lifeLossFlashTimeLeft - dt);
    }
    if (state.lifeLossInvulnerabilityTimeLeft > 0) {
      state.lifeLossInvulnerabilityTimeLeft = Math.max(0, state.lifeLossInvulnerabilityTimeLeft - dt);
    }
    if (state.skinUnlockToastTimeLeft > 0) {
      state.skinUnlockToastTimeLeft = Math.max(0, state.skinUnlockToastTimeLeft - dt);
    }
    updateShieldBurstEffect(dt);
    updateContinueShieldEffect(dt);
    updateDoubleJumpEffect(dt);
    updateSlowEffect(dt);
    updateMagnetEffect(dt);
    updateCurseEffect(dt);

    world.updateElevators(dt);
    updateSkinPickupLifetime();
    var scoreMultiplier = getSpeedMultiplierFromScore(state.score);
    state.speedSlowMultiplier = getCurrentSlowMultiplier();
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
    if (jumpStarted) {
      incrementBadgeLifetimeStat("jumps", 1);
      playLevelSfx("levelJumpSoundPath", 45);
    }
    updatePlayerRotation(dt, jumpStartedInAir);
    updateHeroJumpAnimation(dt, jumpStarted, landedThisFrame);
    updateRespawnPoint();

    state.cameraX = Math.max(0, player.x - C.canvasWidth * C.cameraAnchorRatio);
    if (!state.teleport.active) {
      world.generateAhead(state.cameraX, C.canvasWidth);
    }
    world.cleanupBehind(state.cameraX);

    var rawDistanceScore = Math.max(0, Math.floor((player.x - state.startX) * C.distanceScoreMultiplier));
    if (isCurseActive()) {
      state.blockedDistanceScore += Math.max(0, rawDistanceScore - state.lastRawDistanceScore);
    }
    state.lastRawDistanceScore = rawDistanceScore;
    var distanceScore = Math.max(0, rawDistanceScore - state.blockedDistanceScore);
    state.score = state.scoreCarryOver + distanceScore + state.bonusScore;
    updateBadgeBestStat("singleRunScore", state.score);
    if (state.score > sessionMaxScore) {
      sessionMaxScore = state.score;
      writeMaxScoreToStorage(state.gameMode, state.gameDifficulty, sessionMaxScore);
      if (state.gameMode === 2 && state.gameDifficulty === "hard" && isFullModeUnlocked() && !state.lastFullUnlockShown) {
        state.lastFullUnlockShown = true;
        showModeRewardOverlay("full");
      }
    }
    state.speedPercent = Math.round((state.scrollSpeed / C.worldAutoRunSpeed - 1) * 100);
    updateBadgeBestStat("maxSpeedPercent", Math.max(0, state.speedPercent));
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

  function updateContinueShieldEffect(dt) {
    if (!state.continueShieldActive) {
      return;
    }

    state.continueShieldTimeLeft = Math.max(0, state.continueShieldTimeLeft - dt);
    if (state.continueShieldTimeLeft <= 0) {
      state.continueShieldActive = false;
    }
  }

  function finishRunAndShowGameOver() {
    closeInGameSettings();
    state.running = false;
    if (shouldShowContinueForCurrentRun()) {
      state.continueOfferActive = true;
      showGameOverScreen();
      return;
    }
    completeRunAndPresentGameOver(false);
  }

  function finishCurrentLevel() {
    closeInGameSettings();
    state.running = false;
    state.levelFinishedActive = true;
    state.teleport.active = false;
    state.scoreCarryOver = state.score;
    finalizeLevelBadgeProgress();
    flushBadgeStatsStorage(true, 0);
    updateLevelFinishedSummary();
    updateLevelFinishedContinueButtonLabel();
    if (levelFinishedEl) {
      levelFinishedEl.classList.remove("hidden");
    }
    updateOverlayUiVisibility();
    refreshMusicPlayback();
  }

  function startTeleportFinishAnimation() {
    if (state.teleportFinishAnimActive) {
      return;
    }

    closeInGameSettings();
    var heroRenderMetrics = getHeroRenderMetrics();
    playLevelSfx("levelTeleportSoundPath", 160);
    recordTeleportUse(state.shieldCharges > 0 || state.continueShieldActive);
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
    closeInGameSettings();
    playLevelSfx("levelDeathSoundPath", 200);
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
    refreshMusicPlayback();
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
    state.questionCoinAnimElapsed += dt;
    if (!state.questionCoinAnimApplied && state.questionCoinAnimElapsed >= QUESTION_COIN_AUTO_STOP_SECONDS) {
      confirmQuestionCoinAnimation();
    }
    if (state.questionCoinAnimApplied && state.questionCoinAnimElapsed >= state.questionCoinAnimDuration) {
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
    drawLevelBorderOverlay();
    drawHud();
    updateGamePauseUiVisibility();
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

  function getRightEdgePlatformSpawnPosition(size, padding, platformIdToAvoid) {
    var safeSize = Math.max(0, Number(size) || 0);
    var edgePadding = Number.isFinite(padding) ? padding : 8;
    var rightEdgeX = state.cameraX + C.canvasWidth - 1;
    var platform = findPlatformAtX(rightEdgeX);
    if (!platform) {
      return null;
    }
    if (Number.isFinite(platformIdToAvoid) && platform.id === platformIdToAvoid) {
      return null;
    }

    var preferredX = rightEdgeX - safeSize - edgePadding;
    var minSpawnX = platform.x;
    var maxSpawnX = platform.x + platform.width - safeSize;
    var spawnX = Math.min(Math.max(preferredX, minSpawnX), maxSpawnX);
    var spawnY = platform.y - safeSize;
    return {
      platform: platform,
      x: spawnX,
      y: spawnY
    };
  }

  function dropAlreadyVisibleElevatorCoins() {
    var unlockEdgeX = state.cameraX + C.canvasWidth - 1;
    for (var i = 0; i < world.elevators.length; i += 1) {
      var elevator = world.elevators[i];
      if (elevator.x + elevator.width < unlockEdgeX - 8) {
        elevator.coinActive = false;
      }
    }
  }

  function updateLevelGoalTeleport() {
    if (state.levelGoalReached) {
      return;
    }
    var targetScore = getCurrentLevelGoalTargetScore();
    if (!Number.isFinite(targetScore) || targetScore <= 0) {
      return;
    }
    if (state.score < targetScore) {
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
    if (state.skinPickupIcon.x >= teleportLeft) {
      state.skinPickupIcon.active = false;
      state.skinPickupIcon.skinName = "";
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

    var spawn = getRightEdgePlatformSpawnPosition(icon.size, 8);
    if (!spawn) {
      return false;
    }

    if (!canSpawnMechanicIcon(spawn.x, spawn.y, icon.size)) {
      return false;
    }

    icon.x = spawn.x;
    icon.y = spawn.y;
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

    playLevelSfx("levelQuestionCoinSoundPath", 120);
    state.running = false;
    state.questionCoinAnimActive = true;
    state.questionCoinAnimElapsed = 0;
    state.questionCoinAnimStakeScore = Math.max(0, Math.floor(stakeScore));
    state.questionCoinAnimResult = "";
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

  function getQuestionCoinSpinSymbol() {
    return Math.floor(state.questionCoinAnimElapsed * 14) % 2 === 0 ? "+" : "-";
  }

  function confirmQuestionCoinAnimation() {
    if (!state.questionCoinAnimActive || state.questionCoinAnimApplied) {
      return;
    }

    var stake = state.questionCoinAnimStakeScore;
    var winPercent = Math.max(0, Number(C.questionCoinWinPercent) || 0);
    var losePercent = Math.max(0, Number(C.questionCoinLosePercent) || 0);

    state.questionCoinAnimResult = getQuestionCoinSpinSymbol();
    if (state.questionCoinAnimResult === "+") {
      state.questionCoinAnimDelta = applyLevelScoreDelta(Math.floor(stake * (winPercent / 100)));
    } else {
      state.questionCoinAnimDelta = applyLevelScoreDelta(-Math.floor(stake * (losePercent / 100)));
    }
    state.questionCoinAnimApplied = true;
    state.questionCoinAnimElapsed = 0;
    recordQuestionCoinOutcome(state.questionCoinAnimResult);
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

    var spawn = getRightEdgePlatformSpawnPosition(icon.size, 8);
    if (!spawn) {
      return false;
    }

    if (!canSpawnMechanicIcon(spawn.x, spawn.y, icon.size)) {
      return false;
    }

    icon.x = spawn.x;
    icon.y = spawn.y;
    icon.active = true;
    return true;
  }

  function trySpawnCrackedCoin() {
    var icon = state.crackedCoinIcon;
    if (icon.active) {
      return false;
    }

    var spawn = getRightEdgePlatformSpawnPosition(icon.size, 8);
    if (!spawn) {
      return false;
    }

    if (!canSpawnMechanicIcon(spawn.x, spawn.y, icon.size)) {
      return false;
    }

    icon.x = spawn.x;
    icon.y = spawn.y;
    icon.active = true;
    return true;
  }

  function trySpawnQuestionCoin() {
    var icon = state.questionCoinIcon;
    var stakeScore = getLevelEarnedScore();
    if (icon.active || stakeScore <= 0) {
      return false;
    }

    var spawn = getRightEdgePlatformSpawnPosition(icon.size, 8);
    if (!spawn) {
      return false;
    }

    if (!canSpawnMechanicIcon(spawn.x, spawn.y, icon.size)) {
      return false;
    }

    icon.x = spawn.x;
    icon.y = spawn.y;
    icon.active = true;
    icon.stakeScore = Math.floor(stakeScore);
    return true;
  }

  function trySpawnLiveIcon() {
    var icon = state.liveIcon;
    if (icon.active || state.maxLives <= 1) {
      return false;
    }

    var spawn = getRightEdgePlatformSpawnPosition(icon.size, 8);
    if (!spawn) {
      return false;
    }

    if (!canSpawnMechanicIcon(spawn.x, spawn.y, icon.size)) {
      return false;
    }

    icon.x = spawn.x;
    icon.y = spawn.y;
    icon.active = true;
    return true;
  }

  function trySpawnShieldIcon() {
    var icon = state.shieldIcon;
    if (icon.active || state.shieldCharges > 0 || state.continueShieldActive) {
      return false;
    }

    var spawn = getRightEdgePlatformSpawnPosition(icon.size, 8);
    if (!spawn) {
      return false;
    }

    if (!canSpawnMechanicIcon(spawn.x, spawn.y, icon.size)) {
      return false;
    }

    icon.x = spawn.x;
    icon.y = spawn.y;
    icon.active = true;
    return true;
  }

  function trySpawnMagnetIcon() {
    var icon = state.magnetIcon;
    if (icon.active || state.magnetTimeLeft > 0) {
      return false;
    }

    var spawn = getRightEdgePlatformSpawnPosition(icon.size, 8);
    if (!spawn) {
      return false;
    }

    if (!canSpawnMechanicIcon(spawn.x, spawn.y, icon.size)) {
      return false;
    }

    icon.x = spawn.x;
    icon.y = spawn.y;
    icon.active = true;
    return true;
  }

  function trySpawnCurseIcon() {
    var icon = state.curseIcon;
    if (icon.active || state.curseTimeLeft > 0) {
      return false;
    }

    var spawn = getRightEdgePlatformSpawnPosition(icon.size, 8);
    if (!spawn) {
      return false;
    }

    if (!canSpawnMechanicIcon(spawn.x, spawn.y, icon.size)) {
      return false;
    }

    icon.x = spawn.x;
    icon.y = spawn.y;
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

    if (state.shieldCharges > 0 || state.continueShieldActive) {
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

    var spawn = getRightEdgePlatformSpawnPosition(coin.size, 6, state.lastPlatformCoinPlatformId);
    if (!spawn) {
      return false;
    }

    if (!canSpawnMechanicIcon(spawn.x, spawn.y, coin.size)) {
      return false;
    }

    coin.active = true;
    coin.x = spawn.x;
    coin.y = spawn.y;
    coin.platformId = spawn.platform.id;
    state.lastPlatformCoinPlatformId = spawn.platform.id;
    return true;
  }

  function updatePlatformCoinSpawner(dt) {
    var coin = state.platformCoinIcon;
    if (state.score < C.platformCoinUnlockScore) {
      state.elevatorCoinsUnlocked = false;
      coin.active = false;
      state.platformCoinTimer = 0;
      state.lastPlatformCoinPlatformId = -1;
      return;
    }

    if (!state.elevatorCoinsUnlocked) {
      state.elevatorCoinsUnlocked = true;
      dropAlreadyVisibleElevatorCoins();
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

    var spawn = getRightEdgePlatformSpawnPosition(icon.size, 8);
    if (!spawn) {
      return false;
    }

    if (!canSpawnMechanicIcon(spawn.x, spawn.y, icon.size)) {
      return false;
    }

    icon.active = true;
    icon.x = spawn.x;
    icon.y = spawn.y;
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
    pushIconRectIfActive(rects, state.skinPickupIcon);
    for (var blockerIndex = 0; blockerIndex < state.blockerIcons.length; blockerIndex += 1) {
      var blockerIcon = state.blockerIcons[blockerIndex];
      rects.push({
        x: blockerIcon.x,
        y: blockerIcon.y,
        w: blockerIcon.size,
        h: blockerIcon.size
      });
    }

    if (state.score >= C.platformCoinUnlockScore && state.elevatorCoinsUnlocked) {
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

  function trySpawnSkinPickupOnRightEdgePlatform() {
    var icon = state.skinPickupIcon;
    if (icon.active) {
      return false;
    }

    var spawn = getRightEdgePlatformSpawnPosition(icon.size, 8, icon.platformId);
    if (!spawn) {
      return false;
    }

    if (!canSpawnMechanicIcon(spawn.x, spawn.y, icon.size)) {
      return false;
    }

    icon.x = spawn.x;
    icon.y = spawn.y;
    icon.platformId = spawn.platform.id;
    icon.skinName = state.skinDiscoveryPlan.skinName;
    icon.active = true;
    return true;
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

    if (!trySpawnSkinPickupOnRightEdgePlatform()) {
      return false;
    }

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
    var iconRect = {
      x: state.skinPickupIcon.x,
      y: state.skinPickupIcon.y,
      w: state.skinPickupIcon.size,
      h: state.skinPickupIcon.size
    };
    if (!isRectIntersect(playerRect, iconRect)) {
      return;
    }

    unlockSkin(state.skinPickupIcon.skinName);
    state.skinPickupIcon.active = false;
    state.skinPickupIcon.skinName = "";
  }

  function updateSkinPickupLifetime() {
    if (!state.skinPickupIcon.active) {
      return;
    }
    if (state.skinPickupIcon.x + state.skinPickupIcon.size < state.cameraX - 40) {
      state.skinPickupIcon.active = false;
      state.skinPickupIcon.skinName = "";
    }
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

  function updateSlowEffect(dt) {
    if (state.slowTimeLeft > 0) {
      state.slowTimeLeft = Math.max(0, state.slowTimeLeft - dt);
    }
  }

  function getCurrentSlowMultiplier() {
    if (state.slowTimeLeft <= 0) {
      return 1;
    }
    var slowDownPercent = Math.max(0, Number(C.slowDownByPercent) || 0);
    return Math.max(0, 1 - (slowDownPercent / 100));
  }

  function getSlowEffectSeconds() {
    return Math.max(0, Number(C.slowEffectSeconds) || 0);
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
      state.slowTimeLeft = getSlowEffectSeconds();
      state.speedSlowMultiplier = getCurrentSlowMultiplier();
      state.scrollSpeed = C.worldAutoRunSpeed * getSpeedMultiplierFromScore(state.score) * state.speedSlowMultiplier;
      playLevelSfx("levelSlowSoundPath", 100);
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
      recordBagCollected(1);
      playLevelSfx("levelBagSoundPath", 70);
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
      recordNegativePickupTouch();
      playLevelSfx("levelCrackedCoinSoundPath", 110);
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
      recordNegativePickupTouch();
      playLevelSfx("levelCurseSoundPath", 110);
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
      recordLifeCollected(1);
      updateLivesUi();
      playLevelSfx("levelLifeSoundPath", 80);
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
      playLevelSfx("levelShieldSoundPath", 90);
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
      recordMagnetPickup();
      scheduleNextMagnetSpawn();
      convertVisiblePickupsToMagnetTargets();
      playLevelSfx("levelMagnetSoundPath", 100);
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
      recordLifeCollected(1);
      updateLivesUi();
      playLevelSfx("levelLifeSoundPath", 80);
      scheduleNextLiveSpawn();
      return;
    }

    if (!isCurseActive()) {
      state.bonusScore += C.coinScoreBonus;
    }
    recordCoinCollected(1);
    playLevelSfx("levelCoinSoundPath", 35);
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

    state.badgeCursedSecondsAccumulator += Math.min(dt, state.curseTimeLeft);
    if (state.badgeCursedSecondsAccumulator >= 1) {
      var wholeSeconds = Math.floor(state.badgeCursedSecondsAccumulator);
      state.badgeCursedSecondsAccumulator -= wholeSeconds;
      incrementBadgeLifetimeStat("cursedSeconds", wholeSeconds);
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
      recordCoinCollected(1);
      playLevelSfx("levelCoinSoundPath", 35);
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
    if (state.score < C.platformCoinUnlockScore || !state.elevatorCoinsUnlocked) {
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
        recordCoinCollected(1);
        playLevelSfx("levelCoinSoundPath", 35);
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
    var tileWidth = Math.max(1, Math.ceil(image.width * scale));
    if (tileWidth <= 0) {
      return false;
    }

    var offset = -((state.cameraX * speedFactor) % tileWidth);
    if (offset > 0) {
      offset -= tileWidth;
    }

    var drawStartX = Math.floor(offset) - 1;
    var drawStep = Math.max(1, tileWidth - 1);
    var drawWidth = tileWidth + 1;

    for (var drawX = drawStartX; drawX < canvas.width; drawX += drawStep) {
      ctx.drawImage(image, drawX, y, drawWidth, height);
    }
    return true;
  }

  function isFieldVisibleForLevel(field, level) {
    if (!field || !field.levels || !field.levels.length) {
      return true;
    }
    return field.levels.indexOf(level) !== -1;
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
      drawParallaxStrip(sceneArt.level2Level1, 0.06, C.topDeathLineY, playableHeight);
      drawParallaxStrip(sceneArt.level2Level2, 0.12, C.topDeathLineY, playableHeight);
      drawParallaxStrip(sceneArt.level2Level3, 0.2, C.topDeathLineY, playableHeight);
      drawParallaxStrip(sceneArt.level2Level4, 0.32, C.topDeathLineY, playableHeight);
    } else if (state.currentLevel === 3) {
      drawParallaxStrip(sceneArt.level3Layer1, 0.07, C.topDeathLineY, playableHeight);
      drawParallaxStrip(sceneArt.level3Layer2, 0.18, C.topDeathLineY, playableHeight);
      drawParallaxStrip(sceneArt.level3Layer3, 0.32, C.topDeathLineY, playableHeight);
    } else if (state.currentLevel === 4) {
      drawParallaxStrip(sceneArt.level4ForestBack, 0.06, C.topDeathLineY, playableHeight);
      drawParallaxStrip(sceneArt.level4ForestMid, 0.14, C.topDeathLineY, playableHeight);
      drawParallaxStrip(sceneArt.level4ForestFront, 0.24, C.topDeathLineY, playableHeight);
    } else if (state.currentLevel === 5) {
      var level5UsesLevelXArt = state.levelXEndlessActive && isLevelXUnlocked();
      var level5BackArt = level5UsesLevelXArt && sceneArt.levelxBack ? sceneArt.levelxBack : sceneArt.level5Layer1;
      var level5FrontArt = level5UsesLevelXArt && sceneArt.levelxFront ? sceneArt.levelxFront : sceneArt.level5Layer3;
      drawParallaxStrip(level5BackArt, 0.12, C.topDeathLineY, playableHeight);
      drawParallaxStrip(level5FrontArt, 0.32, C.topDeathLineY, playableHeight);
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

  function getLevelBorderArt(level) {
    if (level === 1) {
      return sceneArt.level1Border;
    }
    if (level === 2) {
      return sceneArt.level2Border;
    }
    if (level === 3) {
      return sceneArt.level3Border;
    }
    if (level === 4) {
      return sceneArt.level4Border;
    }
    if (level === 5) {
      return state.levelXEndlessActive && isLevelXUnlocked()
        ? (sceneArt.levelxBorder || sceneArt.level5Border)
        : sceneArt.level5Border || sceneArt.levelxBorder;
    }
    return null;
  }

  function drawLevelBorderOverlay() {
    if (state.currentLevel < 1 || state.currentLevel > 5) {
      return;
    }
    if (!useModernVisuals()) {
      return;
    }
    if (
      !state.preRunActive &&
      !state.running &&
      !state.questionCoinAnimActive &&
      !state.teleportFinishAnimActive &&
      !state.projectileDeathAnimActive &&
      !isGameOverScreenVisible()
    ) {
      return;
    }

    var borderArt = getLevelBorderArt(state.currentLevel);
    if (!borderArt || borderArt.width <= 0 || borderArt.height <= 0) {
      return;
    }

    if (state.currentLevel === 5 && state.levelXEndlessActive && borderArt === sceneArt.levelxBorder) {
      // levelX border art ends with a transparent tail, so crop it off to avoid a white seam at the bottom.
      ctx.drawImage(borderArt, 0, 0, borderArt.width, Math.max(1, borderArt.height - 4), 0, 0, canvas.width, canvas.height);
      return;
    }

    ctx.drawImage(borderArt, 0, 0, canvas.width, canvas.height);
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
    var continueShieldBlinkAlpha = state.continueShieldActive
      ? 0.42 + 0.58 * (0.5 + 0.5 * Math.sin(state.runTimeSeconds * 18))
      : null;

    ctx.save();
    ctx.translate(cx, cy);
    if (continueShieldBlinkAlpha !== null) {
      ctx.globalAlpha = continueShieldBlinkAlpha;
    }
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

    var selectedSkinName = getSelectedHeroSkinName();
    if (selectedSkinName === "Skin06" && loadedFrames.length >= 6) {
      if (state.heroJumpAnimStarted && player.velocityY < 0) {
        var skin06AscentFrameIndex = Math.min(2, Math.floor(state.heroJumpAnimTime / HERO_JUMP_FRAME_SECONDS));
        return {
          image: loadedFrames[skin06AscentFrameIndex] || loadedFrames[2] || loadedFrames[1] || loadedFrames[0] || null,
          index: skin06AscentFrameIndex,
          type: "jump"
        };
      }
      if (!player.isGrounded && player.velocityY <= 0) {
        return {
          image: loadedFrames[3] || loadedFrames[2] || loadedFrames[1] || loadedFrames[0] || null,
          index: 3,
          type: "jump"
        };
      }
      if (!player.isGrounded && player.velocityY > 0) {
        return {
          image: loadedFrames[4] || loadedFrames[3] || loadedFrames[2] || loadedFrames[1] || loadedFrames[0] || null,
          index: 4,
          type: "jump"
        };
      }
      return {
        image: loadedFrames[5] || loadedFrames[4] || loadedFrames[3] || loadedFrames[2] || loadedFrames[1] || loadedFrames[0] || null,
        index: 5,
        type: "jump"
      };
    }
    if (selectedSkinName === "Skin05" && loadedFrames.length >= 5) {
      if (state.heroJumpAnimStarted && state.heroJumpAnimTime < HERO_JUMP_FRAME_SECONDS) {
        return {
          image: loadedFrames[0] || null,
          index: 0,
          type: "jump"
        };
      }
      if (!player.isGrounded && player.velocityY < 0) {
        return {
          image: loadedFrames[1] || loadedFrames[0] || null,
          index: Math.min(1, loadedFrames.length - 1),
          type: "jump"
        };
      }
      return {
        image: loadedFrames[2] || loadedFrames[1] || loadedFrames[0] || null,
        index: Math.min(2, loadedFrames.length - 1),
        type: "jump"
      };
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

    var selectedSkinName = getSelectedHeroSkinName();
    if (selectedSkinName === "Skin05" && loadedFrames.length >= 5) {
      var landingFrameIndexSkin05 = 3 + Math.min(1, Math.floor(state.heroLandingAnimTime / HERO_JUMP_FRAME_SECONDS));
      return {
        image: loadedFrames[landingFrameIndexSkin05] || loadedFrames[loadedFrames.length - 1] || null,
        index: Math.min(landingFrameIndexSkin05, loadedFrames.length - 1),
        type: "jump"
      };
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

    if (getSelectedHeroSkinName() === "Skin05" && loadedFrames.length >= 5) {
      return 2;
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

    if (state.shieldCharges > 0 || state.continueShieldActive) {
      var shieldFrame = sceneArt.shieldIdleFrame || sceneArt.shieldBurstFrames[0] || null;
      var isContinueShield = state.continueShieldActive;
      var shieldAlpha = isContinueShield ? (0.7 + 0.3 * (0.5 + 0.5 * Math.sin(state.runTimeSeconds * 14))) : 0.5;
      if (shieldFrame) {
        var shieldSize = player.width * (isContinueShield ? 2.34 : 2.18);
        var shieldCenterY = centerY - player.height * 0.10;
        ctx.save();
        ctx.globalAlpha = shieldAlpha;
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
        ctx.strokeStyle = isContinueShield ? "rgba(141, 235, 255, 0.75)" : "rgba(79, 215, 255, 0.25)";
        ctx.lineWidth = Math.max(3, player.width * (isContinueShield ? 0.085 : 0.06));
        ctx.shadowColor = isContinueShield ? "rgba(141, 235, 255, 0.48)" : "rgba(79, 215, 255, 0.18)";
        ctx.shadowBlur = player.width * (isContinueShield ? 0.28 : 0.18);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        if (isContinueShield) {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
          ctx.lineWidth = Math.max(2, player.width * 0.035);
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius * 0.8, 0, Math.PI * 2);
          ctx.stroke();
        }
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
    if (!state.projectileDeathAnimActive && !(state.badgeRewardActive && state.badgeRewardShowRip)) {
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

    var w = Math.min(canvas.width * 0.46, 420);
    var h = Math.min(canvas.height * 0.28, 220);
    var x = canvas.width * 0.5 - w * 0.5;
    var y = canvas.height * 0.5 - h * 0.5;
    var stakeText = state.questionCoinAnimStakeScore.toLocaleString("en-US");
    var resultText = Math.abs(state.questionCoinAnimDelta).toLocaleString("en-US");
    var revealPhase = state.questionCoinAnimApplied;
    var displaySymbol = revealPhase
      ? state.questionCoinAnimResult
      : getQuestionCoinSpinSymbol();

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
    if (!revealPhase) {
      ctx.fillStyle = "#173d7a";
      ctx.font = "bold 18px Arial";
      ctx.fillText("Tap to stop", canvas.width * 0.5, y + 110);
    }
    ctx.font = "bold 92px Arial";
    ctx.fillStyle = displaySymbol === "+" ? "#1f9d55" : "#d64545";
    ctx.fillText(displaySymbol, canvas.width * 0.5, y + h * 0.84);
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

    drawSkinCoinSymbol(
      worldToScreenX(state.skinPickupIcon.x),
      state.skinPickupIcon.y,
      state.skinPickupIcon.size,
      state.skinPickupIcon.skinName
    );
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
    if (state.score < C.platformCoinUnlockScore || !state.elevatorCoinsUnlocked) {
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
    ctx.fillStyle = "#111";
    ctx.textAlign = "left";
    ctx.font = "22px Arial";
    var scoreLabel = "Score: " + state.score;
    ctx.fillText(scoreLabel, 54, 36);
    ctx.font = "15px Arial";
    var maxScoreLabel = "Max Score: " + sessionMaxScore;
    ctx.fillText(maxScoreLabel, 54, 64);
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    if (state.gameMode === 2) {
      var doubleJumpLabel = "Double Jump: ON";
      ctx.fillText(doubleJumpLabel, canvas.width * 0.5 - ctx.measureText(doubleJumpLabel).width * 0.1, 36);
    } else if (state.doubleJumpTimeLeft > 0) {
      var doubleJumpCountdownLabel = "Double Jump: " + state.doubleJumpTimeLeft.toFixed(1) + "s";
      ctx.fillText(
        doubleJumpCountdownLabel,
        canvas.width * 0.5 - ctx.measureText(doubleJumpCountdownLabel).width * 0.1,
        36
      );
    } else {
      var doubleJumpOffLabel = "Double Jump: OFF";
      ctx.fillText(doubleJumpOffLabel, canvas.width * 0.5 - ctx.measureText(doubleJumpOffLabel).width * 0.1, 36);
    }
    ctx.font = "20px Arial";
    if (state.tripleJumpTimeLeft > 0) {
      var tripleJumpLabel = "Tripple Jump: " + state.tripleJumpTimeLeft.toFixed(1) + "s";
      ctx.fillText(tripleJumpLabel, canvas.width * 0.5 - ctx.measureText(tripleJumpLabel).width * 0.1, 64);
    }
    if (state.curseTimeLeft > 0) {
      var curseLabel = "Curse: " + state.curseTimeLeft.toFixed(1) + "s";
      ctx.fillText(curseLabel, canvas.width * 0.5 - ctx.measureText(curseLabel).width * 0.1, 92);
    }
    ctx.textAlign = "right";
    ctx.font = "24px Arial";
    var levelLabel = getLevelDisplayName(state.currentLevel, state.currentLevel === 5 && state.levelXEndlessActive);
    var levelLabelWidth = ctx.measureText(levelLabel).width;
    ctx.fillText(levelLabel, canvas.width - 18 - levelLabelWidth * 0.83, 36);
    ctx.font = "20px Arial";
    var speedLabel = "Speed +" + state.speedPercent + "%";
    var speedLabelWidth = ctx.measureText(speedLabel).width;
    ctx.fillText(speedLabel, canvas.width - 18 - speedLabelWidth * 0.5, 64);
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
