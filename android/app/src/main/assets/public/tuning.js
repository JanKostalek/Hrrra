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
    fullscreenAutoEnabled: true,
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
    slowDownByPercent: 50,
    slowEffectSeconds: 10,
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
    moveSpeedGroundPercentR: 75,

    // Audio
    audioMusicEnabled: true,
    audioSfxEnabled: true,
    audioMasterVolumePercent: 75,
    audioMusicVolumePercent: 10,
    audioSfxVolumePercent: 85,
    audioMusicRestoreVolumePercent: 10,
    audioSfxRestoreVolumePercent: 85,
    uiSoundButtonPath: "assets/ui-sound/ui-button-tap.wav",
    uiSoundPageOpenPath: "assets/ui-sound/ui-page-open.wav",
    uiSoundBadgesPagePath: "assets/ui-sound/ui-badges-page.wav",
    uiSoundBadgeRevealPath: "assets/ui-sound/ui-badge-reveal.wav",
    uiCrossingMusicPath: "assets/gfx2/crossing_page/crossing-music-loop.mp3",
    uiPreRunMusicPath: "assets/ui-sound/ui-prerun-loop.wav",
    uiLevelFinishedMusicPath: "assets/ui-sound/ui-level-finished-loop.wav",
    uiGameOverMusicPath: "assets/ui-sound/ui-game-over-loop.wav"
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
          finishScore: 15000,
          moveSpeedGroundPercentL: 75,
          moveSpeedGroundPercentR: 75,
          moveSpeedAir: 70,
          livesCount: 5,
          livesApplyTopDeathZone: true,
          livesApplyProjectiles: true,
          livesApplyBlocker: true,
          speedStepScore: 1000,
          speedStepMultiplier: 1.1,
          speedStepScoreMultiplier: 2,
          distanceScoreMultiplier: 0.5,
          platformCoinUnlockScore: 3000,
          coinScoreBonus: 200,
          platformCoinInitialDelaySeconds: 3,
          platformCoinRespawnMinSeconds: 4,
          platformCoinRespawnMaxSeconds: 10,
          scoreBagUnlockScore: 100000,
          scoreBagBonus: 2000,
          scoreBagRespawnMinSeconds: 5,
          scoreBagRespawnMaxSeconds: 10,
          blockerUnlockScore: 5000,
          blockerRespawnMinSeconds: 2,
          blockerRespawnMaxSeconds: 6,
          projectileUnlockScore: 100000,
          projectileRespawnMinSeconds: 2,
          projectileRespawnMaxSeconds: 10,
          projectileSpeedMultiplier: 1.5,
          projectile2UnlockScore: 100000,
          projectile2RespawnMinSeconds: 3,
          projectile2RespawnMaxSeconds: 8,
          projectile2SpeedMultiplier: 1.8,
          singleJumpGravity: 1900,
          singleJumpInitialVelocity: 580,
          singleJumpHoldAcceleration: 1200,
          singleJumpHoldMaxTime: 0.12,
          doubleJumpUnlockScore: 0,
          doubleJumpGravity: 1900,
          doubleJumpInitialVelocity: 580,
          doubleJumpHoldAcceleration: 1200,
          doubleJumpHoldMaxTime: 0.25,
          doubleJumpEffectSeconds: 10,
          doubleJumpRespawnMinSeconds: 5,
          doubleJumpRespawnMaxSeconds: 15,
          tripleJumpUnlockScore: 2500,
          tripleJumpGravity: 1900,
          tripleJumpInitialVelocity: 580,
          tripleJumpHoldAcceleration: 1200,
          tripleJumpHoldMaxTime: 0.12,
          tripleJumpEffectSeconds: 10,
          liveUnlockScore: 100000,
          liveRespawnMinSeconds: 10,
          liveRespawnMaxSeconds: 20,
          slowUnlockSpeedPercent: 50,
          slowRespawnMinSeconds: 10,
          slowRespawnMaxSeconds: 20,
          elevatorSpeed: 95,
          crackedCoinUnlockScore: 100000,
          questionCoinRespawnMinSeconds: 15,
          questionCoinRespawnMaxSeconds: 30,
          curseUnlockScore: 100000,
          magnetUnlockScore: 0,
          magnetRespawnMinSeconds: 20,
          magnetRespawnMaxSeconds: 30,
          shieldUnlockScore: 1000,
          shieldRespawnMinSeconds: 1,
          shieldRespawnMaxSeconds: 2,
          levelMusicLoopPath: "assets/level1/sound/l1-music-loop.mp3",
          levelJumpSoundPath: "assets/level1/sound/l1-sfx-jump.wav",
          levelCoinSoundPath: "assets/level1/sound/l1-sfx-coin.wav",
          levelBagSoundPath: "assets/level1/sound/l1-sfx-bag.wav",
          levelQuestionCoinSoundPath: "assets/level1/sound/l1-sfx-question-coin.wav",
          levelCrackedCoinSoundPath: "assets/level1/sound/l1-sfx-cracked-coin.wav",
          levelCurseSoundPath: "assets/level1/sound/l1-sfx-curse.wav",
          levelLifeSoundPath: "assets/level1/sound/l1-sfx-life.wav",
          levelLifeLossSoundPath: "assets/level1/sound/l1-sfx-life-loss.wav",
          levelShieldSoundPath: "assets/level1/sound/l1-sfx-shield.wav",
          levelShieldBreakSoundPath: "assets/level1/sound/l1-sfx-shield-break.wav",
          levelMagnetSoundPath: "assets/level1/sound/l1-sfx-magnet.wav",
          levelSlowSoundPath: "assets/level1/sound/l1-sfx-slow.wav",
          levelTeleportSoundPath: "assets/level1/sound/l1-sfx-teleport.wav",
          levelDeathSoundPath: "assets/level1/sound/l1-sfx-death.wav"
        }
      },
      hard: {
        2: {
          finishScore: 15000,
          livesCount: 3,
          distanceScoreMultiplier: 0.5,
          platformCoinUnlockScore: 3000,
          platformCoinRespawnMinSeconds: 4,
          platformCoinRespawnMaxSeconds: 10,
          scoreBagUnlockScore: 100000,
          crackedCoinUnlockScore: 100000,
          questionCoinRespawnMinSeconds: 20,
          questionCoinRespawnMaxSeconds: 40,
          curseUnlockScore: 100000,
          blockerRespawnMinSeconds: 4,
          blockerRespawnMaxSeconds: 8,
          projectileUnlockScore: 100000,
          projectile2UnlockScore: 100000,
          doubleJumpUnlockScore: 5000,
          doubleJumpRespawnMinSeconds: 10,
          doubleJumpRespawnMaxSeconds: 20,
          tripleJumpUnlockScore: 3000,
          liveRespawnMinSeconds: 20,
          liveRespawnMaxSeconds: 40,
          shieldUnlockScore: 10000,
          shieldRespawnMinSeconds: 15,
          shieldRespawnMaxSeconds: 30,
          magnetUnlockScore: 10000,
          slowUnlockSpeedPercent: 200,
          levelMusicLoopPath: "assets/level1/sound/l1-music-loop.mp3",
          levelJumpSoundPath: "assets/level1/sound/l1-sfx-jump.wav",
          levelCoinSoundPath: "assets/level1/sound/l1-sfx-coin.wav",
          levelBagSoundPath: "assets/level1/sound/l1-sfx-bag.wav",
          levelQuestionCoinSoundPath: "assets/level1/sound/l1-sfx-question-coin.wav",
          levelCrackedCoinSoundPath: "assets/level1/sound/l1-sfx-cracked-coin.wav",
          levelCurseSoundPath: "assets/level1/sound/l1-sfx-curse.wav",
          levelLifeSoundPath: "assets/level1/sound/l1-sfx-life.wav",
          levelLifeLossSoundPath: "assets/level1/sound/l1-sfx-life-loss.wav",
          levelShieldSoundPath: "assets/level1/sound/l1-sfx-shield.wav",
          levelShieldBreakSoundPath: "assets/level1/sound/l1-sfx-shield-break.wav",
          levelMagnetSoundPath: "assets/level1/sound/l1-sfx-magnet.wav",
          levelSlowSoundPath: "assets/level1/sound/l1-sfx-slow.wav",
          levelTeleportSoundPath: "assets/level1/sound/l1-sfx-teleport.wav",
          levelDeathSoundPath: "assets/level1/sound/l1-sfx-death.wav"
        }
      }
    },
    2: {
      easy: {
        2: {
          finishScore: 25000,
          projectileUnlockScore: 20000,
          projectile2UnlockScore: 100000,
          scoreBagBonus: 2000,
          liveUnlockScore: 0,
          blockerUnlockScore: 0,
          platformCoinUnlockScore: 0,
          scoreBagUnlockScore: 20000,
          platformCoinRespawnMinSeconds: 4,
          platformCoinRespawnMaxSeconds: 8,
          crackedCoinUnlockScore: 15000,
          crackedCoinRespawnMinSeconds: 10,
          crackedCoinRespawnMaxSeconds: 25,
          questionCoinRespawnMinSeconds: 20,
          questionCoinRespawnMaxSeconds: 30,
          curseRespawnMinSeconds: 25,
          curseRespawnMaxSeconds: 35,
          blockerRespawnMinSeconds: 4,
          blockerRespawnMaxSeconds: 8,
          doubleJumpUnlockScore: 0,
          shieldUnlockScore: 0,
          magnetUnlockScore: 0,
          slowUnlockSpeedPercent: 200,
          projectileRespawnMinSeconds: 4
        }
      },
      hard: {
        2: {
          finishScore: 35000,
          livesCount: 3,
          platformCoinRespawnMinSeconds: 4,
          platformCoinRespawnMaxSeconds: 10,
          scoreBagRespawnMinSeconds: 10,
          crackedCoinRespawnMinSeconds: 10,
          crackedCoinRespawnMaxSeconds: 20,
          questionCoinRespawnMinSeconds: 20,
          questionCoinRespawnMaxSeconds: 30,
          curseRespawnMinSeconds: 20,
          curseRespawnMaxSeconds: 33,
          blockerUnlockScore: 0,
          blockerRespawnMinSeconds: 4,
          blockerRespawnMaxSeconds: 6,
          projectileUnlockScore: 20000,
          projectileRespawnMinSeconds: 4,
          projectileRespawnMaxSeconds: 10,
          projectile2UnlockScore: 100000,
          doubleJumpUnlockScore: 0,
          doubleJumpRespawnMinSeconds: 10,
          liveUnlockScore: 0,
          liveRespawnMinSeconds: 20,
          liveRespawnMaxSeconds: 40,
          shieldUnlockScore: 0,
          shieldRespawnMinSeconds: 20,
          shieldRespawnMaxSeconds: 35,
          magnetUnlockScore: 0,
          magnetEffectSeconds: 10,
          magnetRespawnMinSeconds: 20,
          magnetRespawnMaxSeconds: 30,
          slowUnlockSpeedPercent: 200
        }
      }
    },
    3: {
      easy: {
        2: {
          finishScore: 45000,
          projectileUnlockScore: 0,
          projectile2UnlockScore: 35000,
          scoreBagUnlockScore: 0,
          blockerUnlockScore: 0,
          platformCoinUnlockScore: 0,
          scoreBagBonus: 2000,
          platformCoinRespawnMinSeconds: 4,
          platformCoinRespawnMaxSeconds: 8,
          liveUnlockScore: 0,
          scoreBagRespawnMaxSeconds: 15,
          scoreBagRespawnMinSeconds: 7,
          questionCoinRespawnMinSeconds: 20,
          questionCoinRespawnMaxSeconds: 30,
          curseRespawnMinSeconds: 15,
          curseRespawnMaxSeconds: 30,
          doubleJumpUnlockScore: 0,
          liveRespawnMinSeconds: 20,
          liveRespawnMaxSeconds: 40,
          shieldUnlockScore: 0,
          shieldRespawnMinSeconds: 20,
          shieldRespawnMaxSeconds: 30,
          magnetUnlockScore: 0,
          magnetRespawnMinSeconds: 20,
          magnetRespawnMaxSeconds: 35
        }
      },
      hard: {
        2: {
          finishScore: 80000,
          livesCount: 3,
          crackedCoinRespawnMinSeconds: 15,
          crackedCoinRespawnMaxSeconds: 25,
          curseRespawnMinSeconds: 30,
          curseRespawnMaxSeconds: 40,
          blockerRespawnMinSeconds: 5,
          blockerRespawnMaxSeconds: 10,
          projectileUnlockScore: 0,
          projectileRespawnMinSeconds: 4,
          projectileRespawnMaxSeconds: 10,
          projectile2UnlockScore: 0,
          projectile2RespawnMinSeconds: 6,
          projectile2RespawnMaxSeconds: 12,
          doubleJumpUnlockScore: 0,
          liveUnlockScore: 0,
          liveRespawnMinSeconds: 20,
          liveRespawnMaxSeconds: 40,
          shieldUnlockScore: 0,
          shieldRespawnMinSeconds: 15,
          shieldRespawnMaxSeconds: 25,
          magnetUnlockScore: 0,
          magnetEffectSeconds: 10,
          slowUnlockSpeedPercent: 200,
          slowRespawnMinSeconds: 20,
          slowRespawnMaxSeconds: 60
        }
      }
    },
    4: {
      easy: {
        2: {
          finishScore: 70000,
          projectileUnlockScore: 0,
          projectile2UnlockScore: 0,
          blockerUnlockScore: 0,
          scoreBagBonus: 2000,
          platformCoinRespawnMinSeconds: 4,
          platformCoinRespawnMaxSeconds: 8,
          liveRespawnMinSeconds: 10,
          liveRespawnMaxSeconds: 25,
          crackedCoinRespawnMinSeconds: 15,
          crackedCoinRespawnMaxSeconds: 30,
          questionCoinRespawnMinSeconds: 20,
          questionCoinRespawnMaxSeconds: 35,
          curseRespawnMinSeconds: 30,
          curseRespawnMaxSeconds: 45,
          blockerRespawnMinSeconds: 4,
          blockerRespawnMaxSeconds: 10,
          projectileRespawnMinSeconds: 4,
          projectileRespawnMaxSeconds: 20,
          projectile2RespawnMinSeconds: 5,
          projectile2RespawnMaxSeconds: 10,
          doubleJumpUnlockScore: 0,
          liveUnlockScore: 0,
          shieldUnlockScore: 0,
          magnetUnlockScore: 0
        }
      },
      hard: {
        2: {
          finishScore: 110000,
          livesCount: 3,
          questionCoinRespawnMinSeconds: 20,
          questionCoinRespawnMaxSeconds: 35,
          curseRespawnMinSeconds: 30,
          curseRespawnMaxSeconds: 45,
          blockerRespawnMaxSeconds: 10,
          projectileUnlockScore: 0,
          projectile2UnlockScore: 0,
          projectileRespawnMinSeconds: 4,
          projectileRespawnMaxSeconds: 10,
          projectile2RespawnMinSeconds: 6,
          projectile2RespawnMaxSeconds: 15,
          doubleJumpUnlockScore: 0,
          doubleJumpRespawnMaxSeconds: 20,
          liveUnlockScore: 0,
          liveRespawnMinSeconds: 30,
          liveRespawnMaxSeconds: 40,
          shieldUnlockScore: 0,
          shieldRespawnMinSeconds: 20,
          shieldRespawnMaxSeconds: 30,
          magnetUnlockScore: 0,
          magnetEffectSeconds: 10,
          magnetRespawnMinSeconds: 15,
          magnetRespawnMaxSeconds: 35,
          slowUnlockSpeedPercent: 200,
          slowRespawnMinSeconds: 20,
          slowRespawnMaxSeconds: 60
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
          projectileRespawnMinSeconds: 7,
          projectile2UnlockScore: 0,
          projectile2RespawnMinSeconds: 10,
          projectile2RespawnMaxSeconds: 12,
          doubleJumpUnlockScore: 0,
          liveUnlockScore: 0,
          questionCoinRespawnMinSeconds: 20,
          questionCoinRespawnMaxSeconds: 30,
          curseRespawnMinSeconds: 20,
          curseRespawnMaxSeconds: 40,
          blockerRespawnMinSeconds: 10,
          blockerRespawnMaxSeconds: 15,
          projectileRespawnMaxSeconds: 20,
          liveRespawnMinSeconds: 20,
          liveRespawnMaxSeconds: 40
        }
      }
    }
  };
})();
