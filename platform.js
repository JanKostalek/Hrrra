(function () {
  function Platform(x, y, width, height, solidFromBelow) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.solidFromBelow = Boolean(solidFromBelow);
  }

  Platform.prototype.right = function () {
    return this.x + this.width;
  };

  Platform.prototype.bottom = function () {
    return this.y + this.height;
  };

  window.HrrraPlatform = Platform;
})();
