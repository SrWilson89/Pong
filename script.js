const gameContainer = document.querySelector('.game-container');
const playerPaddle = document.getElementById('player-paddle');
const aiPaddle = document.getElementById('ai-paddle');
const ball = document.getElementById('ball');
const playerScoreDisplay = document.getElementById('player-score');
const aiScoreDisplay = document.getElementById('ai-score');
const gameOverMessage = document.getElementById('game-over-message');
const winnerText = document.getElementById('winner-text');
const restartButton = document.getElementById('restart-button');
const scoreSound = document.getElementById('score-sound');

let ballX = 400, ballY = 200;
let ballSpeedX = 4, ballSpeedY = 4;
const paddleSpeed = 6;
const aiSpeed = 4;
let playerScore = 0, aiScore = 0;
const maxScore = 10; // Límite de puntos

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

  // Reiniciar la pelota si sale del área de juego y actualizar el marcador
  if (ballX <= 0) {
    aiScore++;
    aiScoreDisplay.textContent = aiScore;
    playScoreSound();
    checkGameOver();
    resetBall();
  }

  if (ballX >= gameContainer.offsetWidth) {
    playerScore++;
    playerScoreDisplay.textContent = playerScore;
    playScoreSound();
    checkGameOver();
    resetBall();
  }

  ball.style.left = ballX + 'px';
  ball.style.top = ballY + 'px';
}

// Reiniciar la pelota al centro
function resetBall() {
  ballX = gameContainer.offsetWidth / 2;
  ballY = gameContainer.offsetHeight / 2;
  ballSpeedX = Math.random() > 0.5 ? 4 : -4; // Dirección aleatoria
  ballSpeedY = Math.random() * 4 - 2; // Ángulo aleatorio
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

// Verificar si el juego ha terminado
function checkGameOver() {
  if (playerScore >= maxScore || aiScore >= maxScore) {
    gameOver();
  }
}

// Mostrar mensaje de victoria/derrota
function gameOver() {
  if (playerScore >= maxScore) {
    winnerText.textContent = "¡Ganaste!";
  } else {
    winnerText.textContent = "¡Perdiste!";
  }
  gameOverMessage.classList.remove('hidden');
}

// Reproducir sonido al anotar un punto
function playScoreSound() {
  scoreSound.currentTime = 0; // Reiniciar el sonido si ya estaba reproduciéndose
  scoreSound.play();
}

// Reiniciar el juego
restartButton.addEventListener('click', () => {
  playerScore = 0;
  aiScore = 0;
  playerScoreDisplay.textContent = playerScore;
  aiScoreDisplay.textContent = aiScore;
  gameOverMessage.classList.add('hidden');
  resetBall();
});

// Bucle del juego
function gameLoop() {
  updateBall();
  updateAI();
  requestAnimationFrame(gameLoop);
}

gameLoop();
function updateScoreDisplay(scoreElement) {
    scoreElement.textContent = scoreElement === playerScoreDisplay ? playerScore : aiScore;
    scoreElement.classList.add('score-pop');
    setTimeout(() => scoreElement.classList.remove('score-pop'), 300); // Eliminar la clase después de la animación
  }
  
  // Dentro de las condiciones donde se anota un punto:
  if (ballX <= 0) {
    aiScore++;
    updateScoreDisplay(aiScoreDisplay);
    playScoreSound();
    checkGameOver();
    resetBall();
  }
  
  if (ballX >= gameContainer.offsetWidth) {
    playerScore++;
    updateScoreDisplay(playerScoreDisplay);
    playScoreSound();
    checkGameOver();
    resetBall();
  }