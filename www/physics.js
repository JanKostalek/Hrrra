(function () {
  var C = window.HrrraConfig;

  function Physics() {}

  Physics.prototype.getJumpProfileForAttempt = function (player) {
    var nextJumpIndex = player.jumpsUsed + 1;

    if (nextJumpIndex <= 1) {
      return {
        gravity: C.singleJumpGravity,
        initialVelocity: C.singleJumpInitialVelocity,
        holdAcceleration: C.singleJumpHoldAcceleration,
        holdMaxTime: C.singleJumpHoldMaxTime
      };
    }

    if (nextJumpIndex === 2) {
      return {
        gravity: C.doubleJumpGravity,
        initialVelocity: C.doubleJumpInitialVelocity,
        holdAcceleration: C.doubleJumpHoldAcceleration,
        holdMaxTime: C.doubleJumpHoldMaxTime
      };
    }

    return {
      gravity: C.tripleJumpGravity,
      initialVelocity: C.tripleJumpInitialVelocity,
      holdAcceleration: C.tripleJumpHoldAcceleration,
      holdMaxTime: C.tripleJumpHoldMaxTime
    };
  };

  Physics.prototype.startJump = function (player) {
    var profile = this.getJumpProfileForAttempt(player);
    player.isGrounded = false;
    player.supportType = null;
    player.supportRef = null;
    player.currentJumpGravity = profile.gravity;
    player.currentJumpInitialVelocity = profile.initialVelocity;
    player.currentJumpHoldAcceleration = profile.holdAcceleration;
    player.currentJumpHoldMaxTime = profile.holdMaxTime;
    player.velocityY = -profile.initialVelocity;
    player.isJumpHolding = true;
    player.jumpHoldTime = 0;
    player.jumpsUsed += 1;
  };

  Physics.prototype.hasRequiredOverlap = function (player, support) {
    var playerLeft = player.x;
    var playerRight = player.x + player.width;
    var supportLeft = support.x;
    var supportRight = support.x + support.width;

    var overlap = Math.max(0, Math.min(playerRight, supportRight) - Math.max(playerLeft, supportLeft));
    return overlap >= player.width * 0.25;
  };

  Physics.prototype.hasLandingOverlap = function (player, support) {
    var playerLeft = player.x;
    var playerRight = player.x + player.width;
    var supportLeft = support.x;
    var supportRight = support.x + support.width;

    var overlap = Math.max(0, Math.min(playerRight, supportRight) - Math.max(playerLeft, supportLeft));
    return overlap >= player.width * 0.1;
  };

  Physics.prototype.findContinuousSupport = function (player, world) {
    var epsilonY = 2;
    var playerBottom = player.bottom();

    for (var i = 0; i < world.platforms.length; i += 1) {
      var platform = world.platforms[i];
      if (!this.hasLandingOverlap(player, platform)) {
        continue;
      }
      if (Math.abs(platform.y - playerBottom) <= epsilonY) {
        return {
          type: "platform",
          ref: platform
        };
      }
    }

    for (var j = 0; j < world.elevators.length; j += 1) {
      var elevator = world.elevators[j];
      if (!this.hasLandingOverlap(player, elevator)) {
        continue;
      }
      if (Math.abs(elevator.y - playerBottom) <= epsilonY) {
        return {
          type: "elevator",
          ref: elevator
        };
      }
    }

    return null;
  };

  Physics.prototype.updatePlayer = function (player, world, input, dt, scrollSpeed) {
    var previousBottom = player.bottom();
    var previousTop = player.y;

    this.applySupportMotion(player);
    this.applyHorizontal(player, input, dt, scrollSpeed);
    this.applyJumpAndGravity(player, input, dt);

    player.x += (scrollSpeed + player.velocityX) * dt;
    player.y += player.velocityY * dt;

    this.resolveCeilingCollisions(player, world, previousTop);
    this.resolveLanding(player, world, previousBottom);
    this.enforceSupportRule(player, world);
  };

  Physics.prototype.resolveCeilingCollisions = function (player, world, previousTop) {
    if (player.velocityY >= 0) {
      return;
    }

    var epsilon = 1.5;
    var playerTop = player.y;
    var hitBottomY = -Infinity;
    var hasHit = false;

    for (var i = 0; i < world.platforms.length; i += 1) {
      var p = world.platforms[i];
      if (!p.solidFromBelow) {
        continue;
      }

      var hasOverlapX = this.hasRequiredOverlap(player, p);
      var platformBottom = p.bottom();
      var crossedFromBelow =
        previousTop >= platformBottom - epsilon &&
        playerTop <= platformBottom + epsilon;

      if (hasOverlapX && crossedFromBelow && platformBottom > hitBottomY) {
        hitBottomY = platformBottom;
        hasHit = true;
      }
    }

    if (hasHit) {
      player.y = hitBottomY;
      player.velocityY = 0;
      player.isJumpHolding = false;
      player.jumpHoldTime = 0;
    }
  };

  Physics.prototype.applySupportMotion = function (player) {
    if (player.isGrounded && player.supportType === "elevator" && player.supportRef) {
      player.y += player.supportRef.deltaY;
    }
  };

  Physics.prototype.applyHorizontal = function (player, input, dt, scrollSpeed) {
    var axis = 0;

    if (input.left) {
      axis -= 1;
    }
    if (input.right) {
      axis += 1;
    }

    if (player.isGrounded) {
      if (axis < 0) {
        player.velocityX = -scrollSpeed * (C.moveSpeedGroundPercentL / 100);
      } else if (axis > 0) {
        player.velocityX = scrollSpeed * (C.moveSpeedGroundPercentR / 100);
      } else {
        player.velocityX = 0;
      }
    } else {
      player.velocityX = axis * C.moveSpeedAir;
    }

    if (input.jumpPressed && player.isGrounded) {
      this.startJump(player);
    } else if (input.jumpPressed && !player.isGrounded && player.jumpsUsed < player.maxJumps) {
      this.startJump(player);
    }

    if (!input.jumpDown) {
      player.isJumpHolding = false;
    }
  };

  Physics.prototype.applyJumpAndGravity = function (player, input, dt) {
    if (
      player.isJumpHolding &&
      input.jumpDown &&
      player.jumpHoldTime < player.currentJumpHoldMaxTime
    ) {
      player.velocityY -= player.currentJumpHoldAcceleration * dt;
      player.jumpHoldTime += dt;
    }

    player.velocityY += player.currentJumpGravity * dt;

    if (player.velocityY > C.maxFallSpeed) {
      player.velocityY = C.maxFallSpeed;
    }
  };

  Physics.prototype.resolveLanding = function (player, world, previousBottom) {
    player.isGrounded = false;
    player.supportType = null;
    player.supportRef = null;

    if (player.velocityY < 0) {
      return;
    }

    var landingY = Infinity;
    var landingType = null;
    var landingRef = null;

    var epsilon = 1.5;

    for (var i = 0; i < world.platforms.length; i += 1) {
      var p = world.platforms[i];
      var surfaceY = p.y;
      var withinX = this.hasLandingOverlap(player, p);
      var crossed = previousBottom <= surfaceY + epsilon && player.bottom() >= surfaceY - epsilon;

      if (withinX && crossed && surfaceY < landingY) {
        landingY = surfaceY;
        landingType = "platform";
        landingRef = p;
      }
    }

    for (var j = 0; j < world.elevators.length; j += 1) {
      var e = world.elevators[j];
      var eSurfaceY = e.y;
      var ePrevSurfaceY = e.y - e.deltaY;
      var eWithinX = this.hasLandingOverlap(player, e);
      var eCrossed = previousBottom <= ePrevSurfaceY + epsilon && player.bottom() >= eSurfaceY - epsilon;

      if (eWithinX && eCrossed && eSurfaceY < landingY) {
        landingY = eSurfaceY;
        landingType = "elevator";
        landingRef = e;
      }
    }

    if (landingRef) {
      player.y = landingY - player.height;
      player.velocityY = 0;
      player.isGrounded = true;
      player.supportType = landingType;
      player.supportRef = landingRef;
      player.isJumpHolding = false;
      player.jumpHoldTime = 0;
      player.jumpsUsed = 0;
    }
  };

  Physics.prototype.enforceSupportRule = function (player, world) {
    if (!player.isGrounded || !player.supportRef) {
      return;
    }

    var support = player.supportRef;
    var supported = this.hasRequiredOverlap(player, support);

    if (!supported) {
      var continuousSupport = this.findContinuousSupport(player, world);
      if (continuousSupport) {
        player.isGrounded = true;
        player.supportType = continuousSupport.type;
        player.supportRef = continuousSupport.ref;
        player.y = continuousSupport.ref.y - player.height;
        player.velocityY = 0;
        return;
      }

      player.isGrounded = false;
      player.supportType = null;
      player.supportRef = null;
      if (player.jumpsUsed < 1) {
        player.jumpsUsed = 1;
      }
    }
  };

  Physics.prototype.isPastTopDeathLine = function (player) {
    return player.y < C.topDeathLineY;
  };

  Physics.prototype.isPastBottomDeathLine = function (player) {
    return player.bottom() > C.bottomDeathLineY;
  };

  Physics.prototype.isDead = function (player) {
    return this.isPastTopDeathLine(player) || this.isPastBottomDeathLine(player);
  };

  window.HrrraPhysics = Physics;
})();
