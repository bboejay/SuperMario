class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.width = 800;
    this.height = 600;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.lastTime = 0;
    this.accumulator = 0;
    this.timestep = 1000/60;
    this.entities = [];
    this.player = null;
    this.map = null;
  }

  start() {
    this.loadLevel(level1);
    this.gameLoop(0);
  }

  loadLevel(level) {
    this.map = new Map(level);
    this.player = new Player(50, this.height - 100);
    this.entities = [this.player, ...this.map.platforms, ...this.map.enemies];
  }

  gameLoop(timestamp) {
    let deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;
    this.accumulator += deltaTime;

    while (this.accumulator >= this.timestep) {
      this.update(this.timestep);
      this.accumulator -= this.timestep;
    }

    this.render();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  update(deltaTime) {
    this.entities.forEach(entity => entity.update(deltaTime));
    this.checkCollisions();
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.entities.forEach(entity => entity.render(this.ctx));
  }

  checkCollisions() {
    // Collision detection logic
  }
}