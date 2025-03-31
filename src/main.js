const game = new Game();
game.start();

// Handle keyboard input
document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'ArrowLeft':
      game.player.moveLeft();
      break;
    case 'ArrowRight':
      game.player.moveRight();
      break;
    case 'ArrowUp':
      game.player.jump();
      break;
  }
});

document.addEventListener('keyup', (e) => {
  if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
    game.player.stop();
  }
});