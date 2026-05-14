(function () {
  function Elevator(x, y, width, height, speed, minY, maxY, carriesCoin) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.minY = minY;
    this.maxY = maxY;
    this.deltaY = 0;
    this.carriesCoin = Boolean(carriesCoin);
    this.coinActive = this.carriesCoin;
    this.wrappedThisFrame = false;
  }

  Elevator.prototype.update = function (dt) {
    var previousY = this.y;
    this.wrappedThisFrame = false;
    this.y -= this.speed * dt;

    if (this.y + this.height < this.minY) {
      this.y = this.maxY;
      this.wrappedThisFrame = true;
      if (this.carriesCoin) {
        this.coinActive = true;
      }
    }

    this.deltaY = this.y - previousY;
  };

  Elevator.prototype.right = function () {
    return this.x + this.width;
  };

  Elevator.prototype.consumeCoin = function () {
    this.coinActive = false;
  };

  window.HrrraElevator = Elevator;
})();
