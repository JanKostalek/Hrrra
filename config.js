(function () {
  var defaults = {
    canvasWidth: 1200,
    canvasHeight: 700,

    topDeathLineY: 90,
    bottomDeathLineY: 650,

    worldAutoRunSpeed: 200,
    speedStepScore: 1000,
    speedStepMultiplier: 1.1,
    speedStepScoreMultiplier: 2,
    distanceScoreMultiplier: 1,
    projectileUnlockScore: 5000,
    projectileRespawnMinSeconds: 2,
    projectileRespawnMaxSeconds: 10,
    projectileSpeedMultiplier: 1.5,
    projectile2UnlockScore: 5000,
    projectile2RespawnMinSeconds: 3,
    projectile2RespawnMaxSeconds: 8,
    projectile2SpeedMultiplier: 2,
    fullscreenAutoEnabled: true,
    modernVisualsEnabled: true,
    livesCount: 3,
    livesApplyTopDeathZone: true,
    livesApplyProjectiles: true,
    livesApplyBlocker: true,
    cameraAnchorRatio: 0.25,

    playerSize: 60,
    singleJumpGravity: 1900,
    singleJumpInitialVelocity: 580,
    singleJumpHoldAcceleration: 1200,
    singleJumpHoldMaxTime: 0.12,
    doubleJumpUnlockScore: 2500,
    doubleJumpGravity: 1900,
    doubleJumpInitialVelocity: 580,
    doubleJumpHoldAcceleration: 1200,
    doubleJumpHoldMaxTime: 0.25,
    doubleJumpIconSizeRatio: 0.75,
    doubleJumpEffectSeconds: 10,
    tripleJumpEffectSeconds: 10,
    tripleJumpGravity: 1900,
    tripleJumpInitialVelocity: 580,
    tripleJumpHoldAcceleration: 1200,
    tripleJumpHoldMaxTime: 0.12,
    doubleJumpRespawnMinSeconds: 5,
    doubleJumpRespawnMaxSeconds: 15,
    slowUnlockSpeedPercent: 200,
    slowIconSizeRatio: 1.2,
    slowRespawnMinSeconds: 10,
    slowRespawnMaxSeconds: 20,
    scoreBagBonus: 2000,
    scoreBagIconSizeRatio: 1.05,
    scoreBagRespawnMinSeconds: 5,
    scoreBagRespawnMaxSeconds: 20,
    liveUnlockScore: 5000,
    liveIconSizeRatio: 0.82,
    liveRespawnMinSeconds: 10,
    liveRespawnMaxSeconds: 20,
    blockerUnlockScore: 3000,
    blockerRespawnMinSeconds: 6,
    blockerRespawnMaxSeconds: 16,
    blockerIconSizeRatio: 0.9,
    coinScoreBonus: 200,
    coinIconSizeRatio: 0.78,
    platformCoinInitialDelaySeconds: 3,
    platformCoinRespawnMinSeconds: 0.5,
    platformCoinRespawnMaxSeconds: 2,
    elevatorCoinMinPerShaft: 1,
    elevatorCoinMaxPerShaft: 3,
    moveSpeedGroundPercentL: 75,
    moveSpeedGroundPercentR: 75,
    moveSpeedAir: 70,
    maxFallSpeed: 1300,

    platformHeight: 12,
    platformY: 520,
    platformLengthMultiplier: 1.5,
    platformVerticalDeltaRatio: 0.2,
    platformTopSafetyMargin: 12,
    platformBottomSafetyMargin: 24,
    stackedPlatformMinInterval: 3,
    stackedPlatformMaxInterval: 6,
    stackedGapMinPlayerHeightMultiplier: 4,
    stackedGapMaxJumpMultiplier: 2,
    widthExpandMaxMultiplier: 1.5,
    safeSectionMin: 280,
    safeSectionMax: 420,
    shaftWidthMin: 280,
    shaftWidthMax: 360,

    elevatorWidth: 88,
    elevatorWidthMaxMultiplier: 1.5,
    elevatorHeight: 36,
    elevatorSpeed: 95,
    elevatorMinCount: 2,
    elevatorMaxCount: 4,
    elevatorMaxStepX: 226,
    elevatorPlatformEdgeGap: 24,
    elevatorBottomOffset: 18,
    elevatorTopOffset: 40,

    generateAheadDistance: 2600,
    cleanupBehindDistance: 500
  };

  var overrides = window.HrrraTuning || {};
  var merged = {};
  var key;

  for (key in defaults) {
    if (Object.prototype.hasOwnProperty.call(defaults, key)) {
      merged[key] = defaults[key];
    }
  }

  for (key in overrides) {
    if (Object.prototype.hasOwnProperty.call(overrides, key)) {
      merged[key] = overrides[key];
    }
  }

  window.HrrraConfig = merged;
})();
