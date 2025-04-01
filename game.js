// Game constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const GRAVITY = 0.5;
const PLAYER_SPEED = 5;
const JUMP_FORCE = -12;
const GRID_SIZE = 100;
const SCORE_INCREMENT = 10;

// Game classes
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 60;
    this.velocityX = 0;
    this.velocityY = 0;
    this.grounded = false;
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;

    if (!this.grounded) {
      this.velocityY += GRAVITY;
    }
  }

  render(ctx) {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  get gridX() {
    return Math.floor(this.x / GRID_SIZE);
  }

  get gridY() {
    return Math.floor(this.y / GRID_SIZE);
  }
}

class Platform {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  render(ctx) {
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  get gridX() {
    return Math.floor(this.x / GRID_SIZE);
  }

  get gridY() {
    return Math.floor(this.y / GRID_SIZE);
  }
}

class Enemy {
  constructor(x, y, velocityX) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.velocityX = velocityX;
  }

  update() {
    this.x += this.velocityX;
  }

  render(ctx) {
    ctx.fillStyle = 'brown';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  get gridX() {
    return Math.floor(this.x / GRID_SIZE);
  }

  get gridY() {
    return Math.floor(this.y / GRID_SIZE);
  }
}

// Spatial grid and game state
let canvas, ctx;
let player, platforms, enemies;
let gameOver = false;
let score = 0;
const spatialGrid = new SpatialGrid();

// Initialize game
function init() {
  canvas = document.getElementById('gameCanvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  ctx = canvas.getContext('2d');

  // Initialize game objects
  player = new Player(50, CANVAS_HEIGHT - 100);
  platforms = [
    new Platform(0, CANVAS_HEIGHT - 40, CANVAS_WIDTH, 40),
    new Platform(200, 400, 200, 20),
    new Platform(500, 300, 200, 20)
  ];
  enemies = [new Enemy(300, CANVAS_HEIGHT - 80, 2)];

  // Start game loop
  gameLoop();
}

// Game loop
function gameLoop() {
  if (gameOver) return;

  update();
  render();

  requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
  player.update();

  // Update spatial grid
  spatialGrid.clear();
  platforms.forEach(platform => spatialGrid.add(platform));
  enemies.forEach(enemy => spatialGrid.add(enemy));

  // Collision detection
  const nearbyObjects = spatialGrid.getNearby(player);
  player.grounded = false;
  nearbyObjects.forEach(obj => {
    if (obj instanceof Platform && collision(player, obj)) {
      player.y = obj.y - player.height;
      player.velocityY = 0;
      player.grounded = true;
    }
    if (obj instanceof Enemy && collision(player, obj)) {
      if (player.y + player.height < obj.y + 20) {
        // Player jumps on enemy
        enemies.splice(enemies.indexOf(obj), 1);
        player.velocityY = JUMP_FORCE;
        score += SCORE_INCREMENT;
        playSound('jumpSound');
      } else {
        // Player dies
        gameOver = true;
        playSound('gameOverSound');
      }
    }
  });

  // Check if player falls off screen
  if (player.y > CANVAS_HEIGHT) {
    gameOver = true;
    playSound('gameOverSound');
  }
}

// Render game
function render() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Draw platforms
  platforms.forEach(platform => platform.render(ctx));

  // Draw player
  player.render(ctx);

  // Draw enemies
  enemies.forEach(enemy => enemy.render(ctx));

  // Draw score
  ctx.fillStyle = 'black';
  ctx.font = '24px Arial';
  ctx.fillText(`Score: ${score}`, 20, 30);

  // Game over screen
  if (gameOver) {
    ctx.fillStyle = 'black';
    ctx.font = '48px Arial';
    ctx.fillText('Game Over', CANVAS_WIDTH/2 - 100, CANVAS_HEIGHT/2);
  }
}

// Play sound effect
function playSound(id) {
  const sound = document.getElementById(id);
  sound.currentTime = 0;
  sound.play();
}

// Check collision between two rectangles
function collision(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
  if (gameOver) return;

  switch(e.key) {
    case 'ArrowLeft':
      player.velocityX = -PLAYER_SPEED;
      break;
    case 'ArrowRight':
      player.velocityX = PLAYER_SPEED;
      break;
    case 'ArrowUp':
      if (player.grounded) {
        player.velocityY = JUMP_FORCE;
        player.grounded = false;
        playSound('jumpSound');
      }
      break;
  }
});

document.addEventListener('keyup', (e) => {
  if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
    player.velocityX = 0;
  }
});

// Start game
init();