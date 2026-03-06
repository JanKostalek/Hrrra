(function () {
  var C = window.HrrraConfig;
  var Platform = window.HrrraPlatform;
  var Elevator = window.HrrraElevator;

  function randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function randomInt(min, max) {
    return Math.floor(randomRange(min, max + 1));
  }

  function World() {
    this.platforms = [];
    this.elevators = [];
    this.cursorX = 0;
    this.currentPlatformY = C.platformY;
    this.platformsSinceStacked = 0;
    this.nextStackedAt = C.stackedPlatformMinInterval;
    this.nextPlatformId = 1;
  }

  World.prototype.createPlatform = function (x, y, width, height, solidFromBelow) {
    var p = new Platform(x, y, width, height, solidFromBelow);
    p.id = this.nextPlatformId;
    this.nextPlatformId += 1;
    return p;
  };

  World.prototype.estimateMaxJumpRise = function () {
    var holdTime = C.jumpHoldMaxTime;
    var accelDuringHold = C.gravity - C.jumpHoldAcceleration;
    var riseHold = C.jumpInitialVelocity * holdTime - 0.5 * accelDuringHold * holdTime * holdTime;
    var velocityAfterHold = C.jumpInitialVelocity - accelDuringHold * holdTime;
    var riseAfterHold = (velocityAfterHold * velocityAfterHold) / (2 * C.gravity);
    return Math.max(0, riseHold + riseAfterHold);
  };

  World.prototype.getPlatformYBounds = function () {
    var maxJumpRise = this.estimateMaxJumpRise();
    var minY =
      C.topDeathLineY + C.playerSize + maxJumpRise + C.platformTopSafetyMargin;
    var maxY = C.bottomDeathLineY - C.platformBottomSafetyMargin;

    return {
      min: minY,
      max: Math.max(minY, maxY)
    };
  };

  World.prototype.pickNextPlatformY = function () {
    var bounds = this.getPlatformYBounds();
    var playableHeight = C.bottomDeathLineY - C.topDeathLineY;
    var maxDelta = playableHeight * C.platformVerticalDeltaRatio;
    var from = Math.max(bounds.min, this.currentPlatformY - maxDelta);
    var to = Math.min(bounds.max, this.currentPlatformY + maxDelta);
    return randomRange(from, to);
  };

  World.prototype.pickNextStackInterval = function () {
    return randomInt(C.stackedPlatformMinInterval, C.stackedPlatformMaxInterval);
  };

  World.prototype.tryGenerateStackedUpperPlatform = function (x, y, width) {
    var singleJumpRise = this.estimateMaxJumpRise();
    var minGap = C.playerSize * C.stackedGapMinPlayerHeightMultiplier;
    var maxGap = singleJumpRise * C.stackedGapMaxJumpMultiplier;
    var topLimitY = this.getPlatformYBounds().min;
    var feasibleMaxGap = y - topLimitY;

    if (feasibleMaxGap <= 0) {
      return;
    }

    var clampedMinGap = Math.min(minGap, feasibleMaxGap);
    var clampedMaxGap = Math.min(maxGap, feasibleMaxGap);
    if (clampedMaxGap < clampedMinGap) {
      return;
    }

    var gap = randomRange(clampedMinGap, clampedMaxGap);
    var upperY = y - gap;
    this.platforms.push(
      this.createPlatform(x, upperY, width, C.platformHeight, true)
    );
  };

  World.prototype.reset = function () {
    this.platforms = [];
    this.elevators = [];
    this.cursorX = -220;
    this.nextPlatformId = 1;
    this.platformsSinceStacked = 0;
    this.nextStackedAt = this.pickNextStackInterval();
    var bounds = this.getPlatformYBounds();
    this.currentPlatformY = Math.min(Math.max(C.platformY, bounds.min), bounds.max);
    this.generateInitial();
  };

  World.prototype.generateInitial = function () {
    this.platforms.push(
      this.createPlatform(this.cursorX, this.currentPlatformY, 900, C.platformHeight)
    );
    this.cursorX += 900;
  };

  World.prototype.generateAhead = function (cameraX, viewWidth) {
    var targetX = cameraX + viewWidth + C.generateAheadDistance;

    while (this.cursorX < targetX) {
      this.generateSegment();
    }
  };

  World.prototype.generateSegment = function () {
    var safeMin = C.safeSectionMin * C.platformLengthMultiplier;
    var safeMax = C.safeSectionMax * C.platformLengthMultiplier;
    var shaftMax = C.shaftWidthMax * C.widthExpandMaxMultiplier;
    var safeLen = randomRange(safeMin, safeMax);
    var shaftWidth = randomRange(C.shaftWidthMin, shaftMax);

    var segmentX = this.cursorX;
    var segmentY = this.currentPlatformY;
    this.platforms.push(
      this.createPlatform(segmentX, segmentY, safeLen, C.platformHeight)
    );
    this.platformsSinceStacked += 1;
    if (this.platformsSinceStacked >= this.nextStackedAt) {
      this.tryGenerateStackedUpperPlatform(segmentX, segmentY, safeLen);
      this.platformsSinceStacked = 0;
      this.nextStackedAt = this.pickNextStackInterval();
    }
    this.cursorX += safeLen;

    this.generateShaftElevators(this.cursorX, shaftWidth);
    this.cursorX += shaftWidth;
    this.currentPlatformY = this.pickNextPlatformY();
  };

  World.prototype.generateShaftElevators = function (shaftX, shaftWidth) {
    var elevatorWidth = randomRange(
      C.elevatorWidth,
      C.elevatorWidth * C.elevatorWidthMaxMultiplier
    );
    var requiredCount = Math.ceil(shaftWidth / C.elevatorMaxStepX);
    var minCount = Math.max(C.elevatorMinCount, requiredCount);
    var maxCount = Math.max(minCount, C.elevatorMaxCount);
    var count = randomInt(minCount, maxCount);
    var coinCarrierCount = randomInt(
      C.elevatorCoinMinPerShaft,
      Math.min(C.elevatorCoinMaxPerShaft, count)
    );
    var coinCarrierMap = {};
    while (Object.keys(coinCarrierMap).length < coinCarrierCount) {
      var idx = randomInt(0, count - 1);
      coinCarrierMap[idx] = true;
    }
    var minY = C.topDeathLineY + C.elevatorTopOffset;
    var maxY = C.bottomDeathLineY - C.elevatorBottomOffset;
    var spanY = maxY - minY;
    var spacing = spanY / count;

    for (var i = 0; i < count; i += 1) {
      var centerT = (i + 1) / (count + 1);
      var centerX = shaftX + centerT * shaftWidth;
      var x = centerX - elevatorWidth / 2;
      var y = maxY - i * spacing;

      this.elevators.push(
        new Elevator(
          x,
          y,
          elevatorWidth,
          C.elevatorHeight,
          C.elevatorSpeed,
          minY,
          maxY,
          Boolean(coinCarrierMap[i])
        )
      );
    }
  };

  World.prototype.updateElevators = function (dt) {
    for (var i = 0; i < this.elevators.length; i += 1) {
      this.elevators[i].update(dt);
    }
  };

  World.prototype.cleanupBehind = function (cameraX) {
    var minX = cameraX - C.cleanupBehindDistance;

    this.platforms = this.platforms.filter(function (p) {
      return p.x + p.width >= minX;
    });

    this.elevators = this.elevators.filter(function (e) {
      return e.x + e.width >= minX;
    });
  };

  window.HrrraWorld = World;
})();
