(function () {
  var C = window.HrrraConfig;

  function Player(spawnX, spawnY) {
    this.x = spawnX;
    this.y = spawnY;
    this.width = C.playerSize;
    this.height = C.playerSize;

    this.velocityX = 0;
    this.velocityY = 0;

    this.isGrounded = false;
    this.supportType = null;
    this.supportRef = null;

    this.isJumpHolding = false;
    this.jumpHoldTime = 0;
    this.hasDoubleJump = false;
    this.jumpsUsed = 0;
  }

  Player.prototype.centerX = function () {
    return this.x + this.width / 2;
  };

  Player.prototype.bottom = function () {
    return this.y + this.height;
  };

  Player.prototype.reset = function (spawnX, spawnY) {
    this.x = spawnX;
    this.y = spawnY;
    this.velocityX = 0;
    this.velocityY = 0;
    this.isGrounded = false;
    this.supportType = null;
    this.supportRef = null;
    this.isJumpHolding = false;
    this.jumpHoldTime = 0;
    this.hasDoubleJump = false;
    this.jumpsUsed = 0;
  };

  window.HrrraPlayer = Player;
})();
