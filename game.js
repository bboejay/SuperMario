// Game constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const GRAVITY = 0.5;
const PLAYER_SPEED = 5;
const JUMP_FORCE = -12;

// Game state
let canvas, ctx;
let player, platforms, enemies;
let gameOver = false;

// Initialize game
function init() {
  canvas = document.getElementById('gameCanvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  ctx = canvas.getContext('2d');

  // Initialize player
  player = {
    x: 50,
    y: CANVAS_HEIGHT - 100,
    width: 40,
    height: 60,
    velocityX: 0,
    velocityY: 0,
    grounded: false
  };

  // Initialize platforms
  platforms = [
    {x: 0, y: CANVAS_HEIGHT - 40, width: CANVAS_WIDTH, height: 40},
    {x: 200, y: 400, width: 200, height: 20},
    {x: 500, y: 300, width: 200, height: 20}
  ];

  // Initialize enemy
  enemies = [
    {x: 300, y: CANVAS_HEIGHT - 80, width: 40, height: 40, velocityX: 2}
  ];

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
  // Player movement
  player.x += player.velocityX;
  player.y += player.velocityY;

  // Apply gravity
  if (!player.grounded) {
    player.velocityY += GRAVITY;
  }

  // Collision detection
  player.grounded = false;
  platforms.forEach(platform => {
    if (collision(player, platform)) {
      player.y = platform.y - player.height;
      player.velocityY = 0;
      player.grounded = true;
    }
  });

  // Enemy movement and collision
  enemies.forEach(enemy => {
    enemy.x += enemy.velocityX;
    if (collision(player, enemy)) {
      if (player.y + player.height < enemy.y + 20) {
        // Player jumps on enemy
        enemies.splice(enemies.indexOf(enemy), 1);
        player.velocityY = JUMP_FORCE;
      } else {
        // Player dies
        gameOver = true;
      }
    }
  });

  // Check if player falls off screen
  if (player.y > CANVAS_HEIGHT) {
    gameOver = true;
  }
}

// Render game
function render() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Draw platforms
  ctx.fillStyle = 'green';
  platforms.forEach(platform => {
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });

  // Draw player
  ctx.fillStyle = 'red';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw enemies
  ctx.fillStyle = 'brown';
  enemies.forEach(enemy => {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });

  // Game over screen
  if (gameOver) {
    ctx.fillStyle = 'black';
    ctx.font = '48px Arial';
    ctx.fillText('Game Over', CANVAS_WIDTH/2 - 100, CANVAS_HEIGHT/2);
  }
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