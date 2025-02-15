const gameContainer = document.querySelector('.game-container');
const playerPaddle = document.getElementById('player-paddle');
const aiPaddle = document.getElementById('ai-paddle');
const ball = document.getElementById('ball');

let ballX = 400, ballY = 200;
let ballSpeedX = 4, ballSpeedY = 4;
const paddleSpeed = 6;
const aiSpeed = 4;

// Mover la paleta del jugador
document.addEventListener('mousemove', (e) => {
  const rect = gameContainer.getBoundingClientRect();
  const mouseY = e.clientY - rect.top - playerPaddle.offsetHeight / 2;
  playerPaddle.style.top = Math.min(Math.max(mouseY, 0), gameContainer.offsetHeight - playerPaddle.offsetHeight) + 'px';
});

// Actualizar la posición de la pelota
function updateBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Rebotar en los bordes superior e inferior
  if (ballY <= 0 || ballY >= gameContainer.offsetHeight - ball.offsetHeight) {
    ballSpeedY *= -1;
  }

  // Rebotar en las paletas
  if (
    ballX <= playerPaddle.offsetWidth &&
    ballY + ball.offsetHeight >= playerPaddle.offsetTop &&
    ballY <= playerPaddle.offsetTop + playerPaddle.offsetHeight
  ) {
    ballSpeedX *= -1;
  }

  if (
    ballX >= gameContainer.offsetWidth - aiPaddle.offsetWidth - ball.offsetWidth &&
    ballY + ball.offsetHeight >= aiPaddle.offsetTop &&
    ballY <= aiPaddle.offsetTop + aiPaddle.offsetHeight
  ) {
    ballSpeedX *= -1;
  }

  // Reiniciar la pelota si sale del área de juego
  if (ballX <= 0 || ballX >= gameContainer.offsetWidth) {
    ballX = gameContainer.offsetWidth / 2;
    ballY = gameContainer.offsetHeight / 2;
  }

  ball.style.left = ballX + 'px';
  ball.style.top = ballY + 'px';
}

// IA para mover la paleta
function updateAI() {
  const aiPaddleCenter = aiPaddle.offsetTop + aiPaddle.offsetHeight / 2;
  if (aiPaddleCenter < ballY - 10) {
    aiPaddle.style.top = Math.min(aiPaddle.offsetTop + aiSpeed, gameContainer.offsetHeight - aiPaddle.offsetHeight) + 'px';
  } else if (aiPaddleCenter > ballY + 10) {
    aiPaddle.style.top = Math.max(aiPaddle.offsetTop - aiSpeed, 0) + 'px';
  }
}

// Bucle del juego
function gameLoop() {
  updateBall();
  updateAI();
  requestAnimationFrame(gameLoop);
}

gameLoop();