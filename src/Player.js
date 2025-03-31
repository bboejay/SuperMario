class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 60;
    this.velocityX = 0;
    this.velocityY = 0;
    this.grounded = false;
    this.speed = 5;
    this.jumpForce = -12;
  }

  update(deltaTime) {
    // Apply gravity
    if (!this.grounded) {
      this.velocityY += 0.5;
    }

    // Update position
    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  render(ctx) {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  moveLeft() {
    this.velocityX = -this.speed;
  }

  moveRight() {
    this.velocityX = this.speed;
  }

  stop() {
    this.velocityX = 0;
  }

  jump() {
    if (this.grounded) {
      this.velocityY = this.jumpForce;
      this.grounded = false;
    }
  }
}