/*
  Hrrra Tuning Overrides
  Edit only values you want to change.
  This file is loaded before config.js and overrides default config values.
*/
(function () {
  window.HrrraTuning = {
    // Speed scaling
    speedStepScore: 1000,
    speedStepMultiplier: 1.1,
    speedStepScoreMultiplier: 2,
    distanceScoreMultiplier: 1,
    finishScore: 50000,
    projectileUnlockScore: 5000,
    projectileRespawnMinSeconds: 2,
    projectileRespawnMaxSeconds: 10,
    projectileSpeedMultiplier: 1.5,
    projectile2UnlockScore: 5000,
    projectile2RespawnMinSeconds: 3,
    projectile2RespawnMaxSeconds: 8,
    projectile2SpeedMultiplier: 2,
    fullscreenAutoEnabled: false,
    modernVisualsEnabled: true,
    livesCount: 3,
    livesApplyTopDeathZone: true,
    livesApplyProjectiles: true,
    livesApplyBlocker: true,

    // Double jump
    doubleJumpUnlockScore: 2500,
    singleJumpGravity: 1900,
    singleJumpInitialVelocity: 580,
    singleJumpHoldAcceleration: 1200,
    singleJumpHoldMaxTime: 0.12,
    doubleJumpGravity: 1900,
    doubleJumpInitialVelocity: 580,
    doubleJumpHoldAcceleration: 1200,
    doubleJumpHoldMaxTime: 0.25,
    doubleJumpEffectSeconds: 10,
    tripleJumpEffectSeconds: 10,
    tripleJumpGravity: 1900,
    tripleJumpInitialVelocity: 580,
    tripleJumpHoldAcceleration: 1200,
    tripleJumpHoldMaxTime: 0.12,
    doubleJumpRespawnMinSeconds: 5,
    doubleJumpRespawnMaxSeconds: 15,

    // Slow icon
    slowUnlockSpeedPercent: 150,
    slowRespawnMinSeconds: 10,
    slowRespawnMaxSeconds: 20,

    // Score bag
    scoreBagBonus: 2000,
    scoreBagRespawnMinSeconds: 5,
    scoreBagRespawnMaxSeconds: 20,

    // Live
    liveUnlockScore: 5000,
    liveRespawnMinSeconds: 10,
    liveRespawnMaxSeconds: 20,

    // Blocker
    blockerUnlockScore: 3000,
    blockerRespawnMinSeconds: 6,
    blockerRespawnMaxSeconds: 16,

    // Coins
    coinScoreBonus: 200,
    platformCoinInitialDelaySeconds: 3,
    platformCoinRespawnMinSeconds: 0.5,
    platformCoinRespawnMaxSeconds: 2,

    // Movement / Physics
    moveSpeedGroundPercentL: 75,
    moveSpeedGroundPercentR: 75
  };

  // Optional per-mode overrides.
  // Values here are applied on top of defaults for the selected mode.
  window.HrrraModeTuning = {
    1: {
      // Example:
      // moveSpeedGroundPercentL: 75
      // moveSpeedGroundPercentR: 75
    },
    2: {
      blockerUnlockScore: 3000,
      blockerRespawnMinSeconds: 2,
      blockerRespawnMaxSeconds: 5
    }
  };

  // Optional difficulty overrides applied after mode defaults and before admin storage.
  window.HrrraDifficultyTuning = {
    easy: {
      1: {
        livesCount: 3,
        projectileRespawnMinSeconds: 3,
        projectile2SpeedMultiplier: 1.7
      },
      2: {
        livesCount: 5,
        distanceScoreMultiplier: 0.5,
        speedStepScoreMultiplier: 2,
        projectileUnlockScore: 10000,
        projectile2SpeedMultiplier: 1.8,
        scoreBagBonus: 1000,
        scoreBagRespawnMaxSeconds: 10,
        blockerRespawnMaxSeconds: 6
      }
    },
    hard: {
      1: {
        livesCount: 2,
        livesApplyProjectiles: false,
        livesApplyBlocker: false,
        speedStepMultiplier: 1.2,
        speedStepScoreMultiplier: 3,
        distanceScoreMultiplier: 1.5,
        projectileRespawnMaxSeconds: 8,
        scoreBagBonus: 3000,
        blockerRespawnMinSeconds: 5,
        blockerRespawnMaxSeconds: 14
      },
      2: {
        livesCount: 1,
        distanceScoreMultiplier: 1.5,
        speedStepMultiplier: 1.1,
        speedStepScoreMultiplier: 2.5,
        projectileUnlockScore: 5000,
        projectileRespawnMaxSeconds: 5,
        projectile2RespawnMaxSeconds: 6,
        projectile2SpeedMultiplier: 2.2,
        scoreBagBonus: 4000,
        blockerUnlockScore: 1000,
        blockerRespawnMaxSeconds: 4,
        coinScoreBonus: 100,
        platformCoinRespawnMinSeconds: 1,
        platformCoinRespawnMaxSeconds: 3
      }
    }
  };

  // Optional per-level overrides applied after mode and difficulty defaults,
  // before local admin storage.
  window.HrrraLevelTuning = {
    1: {
      easy: {
        2: {
          finishScore: 10000,
          projectile2UnlockScore: 10000,
          scoreBagBonus: 2000,
          blockerUnlockScore: 5000,
          liveUnlockScore: 10000,
          scoreBagUnlockScore: 10000,
          platformCoinUnlockScore: 2000,
          platformCoinRespawnMaxSeconds: 10,
          platformCoinRespawnMinSeconds: 4,
          tripleJumpUnlockScore: 2500,
          doubleJumpUnlockScore: 0
        }
      }
    },
    2: {
      easy: {
        2: {
          finishScore: 20000,
          projectileUnlockScore: 20000,
          projectile2UnlockScore: 20000,
          scoreBagBonus: 2000,
          liveUnlockScore: 15000,
          blockerUnlockScore: 12000,
          platformCoinUnlockScore: 0,
          scoreBagUnlockScore: 20000,
          platformCoinRespawnMinSeconds: 4,
          platformCoinRespawnMaxSeconds: 8
        }
      }
    },
    3: {
      easy: {
        2: {
          finishScore: 30000,
          projectileUnlockScore: 0,
          projectile2UnlockScore: 30000,
          scoreBagUnlockScore: 0,
          blockerUnlockScore: 0,
          platformCoinUnlockScore: 0,
          scoreBagBonus: 2000,
          platformCoinRespawnMinSeconds: 4,
          platformCoinRespawnMaxSeconds: 8,
          liveUnlockScore: 0,
          scoreBagRespawnMaxSeconds: 15,
          scoreBagRespawnMinSeconds: 7
        }
      }
    },
    4: {
      easy: {
        2: {
          finishScore: 40000,
          projectileUnlockScore: 0,
          projectile2UnlockScore: 35000,
          blockerUnlockScore: 0,
          scoreBagBonus: 2000,
          platformCoinRespawnMinSeconds: 4,
          platformCoinRespawnMaxSeconds: 8,
          liveRespawnMinSeconds: 15,
          liveRespawnMaxSeconds: 30
        }
      }
    },
    5: {
      easy: {
        2: {
          finishScore: 0,
          platformCoinRespawnMinSeconds: 5,
          platformCoinRespawnMaxSeconds: 10,
          blockerUnlockScore: 0,
          projectileUnlockScore: 0,
          projectileRespawnMinSeconds: 4,
          projectile2UnlockScore: 0,
          projectile2RespawnMinSeconds: 5,
          projectile2RespawnMaxSeconds: 12,
          doubleJumpUnlockScore: 0,
          liveUnlockScore: 0
        }
      }
    }
  };
})();
