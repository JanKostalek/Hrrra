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
- Movement/jump: moveSpeedGround, moveSpeedAir, jumpInitialVelocity, jumpHoldAcceleration, jumpHoldMaxTime
- Shaft/elevators: shaftWidthMin/Max, widthExpandMaxMultiplier, elevatorMinCount/MaxCount, elevatorSpeed, elevatorWidth, elevatorWidthMaxMultiplier, elevatorMaxStepX
- Speed scaling: worldAutoRunSpeed, speedStepScore, speedStepMultiplier
- Double jump unlock: doubleJumpUnlockScore, doubleJumpIconSizeRatio, doubleJumpEffectSeconds, doubleJumpRespawnMinSeconds, doubleJumpRespawnMaxSeconds
- Slow icon: slowUnlockSpeedPercent, slowIconSizeRatio, slowRespawnMinSeconds, slowRespawnMaxSeconds
- Score bag: scoreBagBonus, scoreBagIconSizeRatio, scoreBagRespawnMinSeconds, scoreBagRespawnMaxSeconds
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
  var btnJump = document.getElementById("btn-jump");
  var btnLeft = document.getElementById("btn-left");
  var btnRight = document.getElementById("btn-right");

  var state = {
    running: true,
    score: 0,
    bonusScore: 0,
    speedPercent: 0,
    scrollSpeed: C.worldAutoRunSpeed,
    speedSlowMultiplier: 1,
    cameraX: 0,
    startX: 0,
    doubleJumpTimeLeft: 0,
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
    platformCoinTimer: C.platformCoinInitialDelaySeconds,
    lastPlatformCoinPlatformId: -1,
    platformCoinIcon: {
      active: false,
      x: 0,
      y: 0,
      size: C.playerSize * C.coinIconSizeRatio,
      platformId: -1
    }
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

  function init() {
    canvas.width = baseCanvasWidth;
    canvas.height = baseCanvasHeight;
    applyResponsiveLayout();
    window.addEventListener("resize", applyResponsiveLayout);
    document.addEventListener("fullscreenchange", function () {
      fullscreenRequested = Boolean(document.fullscreenElement);
    });
    restartGame();
    attachInput();
    attachTouchControls();
    requestAnimationFrame(loop);
  }

  function detectMobileDevice() {
    var ua = navigator.userAgent || "";
    var coarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    return coarsePointer || /android|iphone|ipad|ipod|mobile/i.test(ua);
  }

  function applyResponsiveLayout() {
    var isMobile = detectMobileDevice();

    if (!isMobile) {
      gameShell.style.width = "";
      gameShell.style.height = "";
      canvas.style.width = "";
      canvas.style.height = "";
      if (touchControls) {
        touchControls.style.display = "none";
      }
      return;
    }

    var viewportW = Math.max(320, window.innerWidth || 320);
    var viewportH = Math.max(320, window.innerHeight || 320);
    var padding = 10;
    var availW = Math.max(200, viewportW - padding * 2);
    var availH = Math.max(200, viewportH - padding * 2);
    var aspect = baseCanvasWidth / baseCanvasHeight;
    var targetW = availW;
    var targetH = targetW / aspect;

    if (targetH > availH) {
      targetH = availH;
      targetW = targetH * aspect;
    }

    gameShell.style.width = Math.floor(targetW) + "px";
    gameShell.style.height = Math.floor(targetH) + "px";
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    if (touchControls) {
      touchControls.style.display = "flex";
    }
  }

  function tryForceFullscreen() {
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
    world.reset();
    var spawnX = 80;
    var spawnY = C.platformY - C.playerSize;
    player = new Player(spawnX, spawnY);
    player.isGrounded = true;
    state.running = true;
    state.score = 0;
    state.bonusScore = 0;
    state.speedPercent = 0;
    state.scrollSpeed = C.worldAutoRunSpeed;
    state.speedSlowMultiplier = 1;
    state.startX = spawnX;
    state.cameraX = 0;
    state.doubleJumpTimeLeft = 0;
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
    state.platformCoinTimer = C.platformCoinInitialDelaySeconds;
    state.lastPlatformCoinPlatformId = -1;
    state.platformCoinIcon.active = false;
    state.platformCoinIcon.x = 0;
    state.platformCoinIcon.y = 0;
    state.platformCoinIcon.platformId = -1;
    player.hasDoubleJump = false;
    gameOverEl.classList.add("hidden");
  }

  function getSpeedMultiplierFromScore(score) {
    var steps = Math.floor(score / C.speedStepScore);
    return Math.pow(C.speedStepMultiplier, steps);
  }

  function randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function attachInput() {
    window.addEventListener("keydown", function (event) {
      tryForceFullscreen();
      var key = event.key.toLowerCase();

      if ((event.key === " " || event.key === "Enter") && !state.running) {
        restartGame();
        return;
      }

      if (key === "arrowleft" || key === "a") {
        input.left = true;
      }
      if (key === "arrowright" || key === "d") {
        input.right = true;
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
      if (!state.running) {
        restartGame();
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
    if (!detectMobileDevice()) {
      return;
    }

    bindHoldButton(btnLeft, function () {
      input.left = true;
    }, function () {
      input.left = false;
    });

    bindHoldButton(btnRight, function () {
      input.right = true;
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

    if (state.running) {
      update(dt);
    }
    render();

    input.jumpPressed = false;
    requestAnimationFrame(loop);
  }

  function update(dt) {
    updateDoubleJumpEffect(dt);

    world.updateElevators(dt);
    var scoreMultiplier = getSpeedMultiplierFromScore(state.score);
    state.scrollSpeed = C.worldAutoRunSpeed * scoreMultiplier * state.speedSlowMultiplier;
    physics.updatePlayer(player, world, input, dt, state.scrollSpeed);

    state.cameraX = Math.max(0, player.x - C.canvasWidth * C.cameraAnchorRatio);
    world.generateAhead(state.cameraX, C.canvasWidth);
    world.cleanupBehind(state.cameraX);

    var distanceScore = Math.max(0, Math.floor(player.x - state.startX));
    state.score = distanceScore + state.bonusScore;
    state.speedPercent = Math.round((state.scrollSpeed / C.worldAutoRunSpeed - 1) * 100);
    updateDoubleJumpSpawner(dt);
    checkDoubleJumpIconPickup();
    updateSlowSpawner(dt);
    checkSlowIconPickup();
    updateScoreBagSpawner(dt);
    checkScoreBagPickup();
    updatePlatformCoinSpawner(dt);
    checkPlatformCoinPickup();
    checkElevatorCoinPickup();

    if (physics.isDead(player)) {
      state.running = false;
      finalScoreEl.textContent = "Score: " + state.score;
      gameOverEl.classList.remove("hidden");
    }
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawDeathLines();
    drawPlatforms();
    drawElevators();
    drawDoubleJumpIcon();
    drawSlowIcon();
    drawScoreBagIcon();
    drawPlatformCoinIcon();
    drawElevatorCoins();
    drawPlayer();
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
    if (state.doubleJumpTimeLeft > 0) {
      state.doubleJumpTimeLeft = Math.max(0, state.doubleJumpTimeLeft - dt);
    }
    player.hasDoubleJump = state.doubleJumpTimeLeft > 0;
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

    icon.x = platform.x + platform.width * 0.25 - icon.size * 0.5;
    icon.y = platform.y - icon.size;
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

    icon.x = spawnX;
    icon.y = platform.y - icon.size;
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

    coin.active = true;
    coin.x = spawnX;
    coin.y = platform.y - coin.size;
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
    icon.active = true;
    icon.x = spawnX;
    icon.y = platform.y - icon.size;
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

  function checkDoubleJumpIconPickup() {
    var icon = state.doubleJumpIcon;
    if (!icon.active) {
      return;
    }

    var playerRect = { x: player.x, y: player.y, w: player.width, h: player.height };
    var iconRect = { x: icon.x, y: icon.y, w: icon.size, h: icon.size };

    if (isRectIntersect(playerRect, iconRect)) {
      icon.active = false;
      state.doubleJumpTimeLeft += C.doubleJumpEffectSeconds;
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
      scheduleNextScoreBagSpawn();
    }
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
      scheduleNextPlatformCoinSpawn();
    }
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
      }
    }
  }

  function worldToScreenX(x) {
    return x - state.cameraX;
  }

  function drawBackground() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#e8f4ff";
    ctx.fillRect(0, C.topDeathLineY, canvas.width, C.bottomDeathLineY - C.topDeathLineY);
  }

  function drawDeathLines() {
    ctx.strokeStyle = "#d70000";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(0, C.topDeathLineY);
    ctx.lineTo(canvas.width, C.topDeathLineY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, C.bottomDeathLineY);
    ctx.lineTo(canvas.width, C.bottomDeathLineY);
    ctx.stroke();
  }

  function drawPlatforms() {
    ctx.fillStyle = "#111";
    for (var i = 0; i < world.platforms.length; i += 1) {
      var p = world.platforms[i];
      var x = worldToScreenX(p.x);
      ctx.fillRect(x, p.y, p.width, p.height);
    }
  }

  function drawElevators() {
    ctx.fillStyle = "#222";
    for (var i = 0; i < world.elevators.length; i += 1) {
      var e = world.elevators[i];
      var x = worldToScreenX(e.x);
      ctx.fillRect(x, e.y, e.width, e.height);
    }
  }

  function drawPlayer() {
    ctx.fillStyle = "#0077ff";
    ctx.fillRect(worldToScreenX(player.x), player.y, player.width, player.height);
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

  function drawCoinSymbol(screenX, screenY, size) {
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
    ctx.textAlign = "center";
    if (state.doubleJumpTimeLeft > 0) {
      ctx.fillText("Double Jump: " + state.doubleJumpTimeLeft.toFixed(1) + "s", canvas.width * 0.5, 36);
    } else {
      ctx.fillText("Double Jump: OFF", canvas.width * 0.5, 36);
    }
    ctx.textAlign = "right";
    ctx.fillText("Speed +" + state.speedPercent + "%", canvas.width - 18, 36);
    ctx.textAlign = "left";
  }

  init();
})();
