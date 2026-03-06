(function () {
  var C = window.HrrraConfig;

  function Physics() {}

  Physics.prototype.startJump = function (player) {
    player.isGrounded = false;
    player.supportType = null;
    player.supportRef = null;
    player.velocityY = -C.jumpInitialVelocity;
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

  Physics.prototype.updatePlayer = function (player, world, input, dt, scrollSpeed) {
    var previousBottom = player.bottom();
    var previousTop = player.y;

    this.applySupportMotion(player);
    this.applyHorizontal(player, input, dt);
    this.applyJumpAndGravity(player, input, dt);

    player.x += (scrollSpeed + player.velocityX) * dt;
    player.y += player.velocityY * dt;

    this.resolveCeilingCollisions(player, world, previousTop);
    this.resolveLanding(player, world, previousBottom);
    this.enforceSupportRule(player);
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

  Physics.prototype.applyHorizontal = function (player, input, dt) {
    var moveSpeed = player.isGrounded ? C.moveSpeedGround : C.moveSpeedAir;
    var axis = 0;

    if (input.left) {
      axis -= 1;
    }
    if (input.right) {
      axis += 1;
    }

    player.velocityX = axis * moveSpeed;

    if (input.jumpPressed && player.isGrounded) {
      this.startJump(player);
    } else if (input.jumpPressed && !player.isGrounded && player.hasDoubleJump && player.jumpsUsed < 2) {
      this.startJump(player);
    }

    if (!input.jumpDown) {
      player.isJumpHolding = false;
    }
  };

  Physics.prototype.applyJumpAndGravity = function (player, input, dt) {
    if (player.isJumpHolding && input.jumpDown && player.jumpHoldTime < C.jumpHoldMaxTime) {
      player.velocityY -= C.jumpHoldAcceleration * dt;
      player.jumpHoldTime += dt;
    }

    player.velocityY += C.gravity * dt;

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

  Physics.prototype.enforceSupportRule = function (player) {
    if (!player.isGrounded || !player.supportRef) {
      return;
    }

    var support = player.supportRef;
    var supported = this.hasRequiredOverlap(player, support);

    if (!supported) {
      player.isGrounded = false;
      player.supportType = null;
      player.supportRef = null;
      if (player.jumpsUsed < 1) {
        player.jumpsUsed = 1;
      }
    }
  };

  Physics.prototype.isDead = function (player) {
    return player.y < C.topDeathLineY || player.bottom() > C.bottomDeathLineY;
  };

  window.HrrraPhysics = Physics;
})();
