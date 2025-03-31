class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.velocityX = 2;
  }

  update(deltaTime) {
    this.x += this.velocityX;
    // Simple AI: turn around when hitting walls
    if (this.x < 0 || this.x + this.width > 800) {
      this.velocityX *= -1;
    }
  }

  render(ctx) {
    ctx.fillStyle = 'brown';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}