class Map {
  constructor(level) {
    this.platforms = level.platforms;
    this.enemies = level.enemies.map(e => new Enemy(e.x, e.y));
  }
}