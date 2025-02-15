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
const maxScore = 10;

document.addEventListener('mousemove', (e) => {
  const rect = gameContainer.getBoundingClientRect();
  const mouseY = e.clientY - rect.top - playerPaddle.offsetHeight / 2;
  playerPaddle.style.top = Math.min(Math.max(mouseY, 0), gameContainer.offsetHeight - playerPaddle.offsetHeight) + 'px';
});

function updateBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY <= 0 || ballY >= gameContainer.offsetHeight - ball.offsetHeight) {
    ballSpeedY *= -1;
  }

  if (
    ballX <= playerPaddle.offsetWidth &&
    ballY + ball.offsetHeight >= playerPaddle.offsetTop &&
    ballY <= playerPaddle.offsetTop + playerPaddle.offsetHeight
  ) {
    ballSpeedX *= -1;
    addHitEffect(playerPaddle);
  }

  if (
    ballX >= gameContainer.offsetWidth - aiPaddle.offsetWidth - ball.offsetWidth &&
    ballY + ball.offsetHeight >= aiPaddle.offsetTop &&
    ballY <= aiPaddle.offsetTop + aiPaddle.offsetHeight
  ) {
    ballSpeedX *= -1;
    addHitEffect(aiPaddle);
  }

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

  ball.style.left = ballX + 'px';
  ball.style.top = ballY + 'px';
}

function updateScoreDisplay(scoreElement) {
  scoreElement.textContent = scoreElement === playerScoreDisplay ? playerScore : aiScore;
  const scoreBox = scoreElement.parentElement;
  scoreBox.classList.add('score-pop');
  scoreBox.classList.add('glow');
  setTimeout(() => {
    scoreBox.classList.remove('score-pop');
    scoreBox.classList.remove('glow');
  }, 500);
}

function addHitEffect(paddle) {
  paddle.classList.add('hit');
  setTimeout(() => paddle.classList.remove('hit'), 200);
}

function resetBall() {
  ballX = gameContainer.offsetWidth / 2;
  ballY = gameContainer.offsetHeight / 2;
  ballSpeedX = Math.random() > 0.5 ? 4 : -4;
  ballSpeedY = Math.random() * 4 - 2;
}

function updateAI() {
  const aiPaddleCenter = aiPaddle.offsetTop + aiPaddle.offsetHeight / 2;
  if (aiPaddleCenter < ballY - 10) {
    aiPaddle.style.top = Math.min(aiPaddle.offsetTop + aiSpeed, gameContainer.offsetHeight - aiPaddle.offsetHeight) + 'px';
  } else if (aiPaddleCenter > ballY + 10) {
    aiPaddle.style.top = Math.max(aiPaddle.offsetTop - aiSpeed, 0) + 'px';
  }
}

function checkGameOver() {
  if (playerScore >= maxScore || aiScore >= maxScore) {
    gameOver();
  }
}

function gameOver() {
  winnerText.textContent = playerScore >= maxScore ? "¡Ganaste! 🏆" : "¡Perdiste! 😢";
  gameOverMessage.classList.remove('hidden');
}

function playScoreSound() {
  scoreSound.currentTime = 0;
  scoreSound.play().catch(error => console.log("Audio playback failed:", error));
}

restartButton.addEventListener('click', () => {
  playerScore = 0;
  aiScore = 0;
  playerScoreDisplay.textContent = playerScore;
  aiScoreDisplay.textContent = aiScore;
  gameOverMessage.classList.add('hidden');
  resetBall();
});

function gameLoop() {
  updateBall();
  updateAI();
  requestAnimationFrame(gameLoop);
}

resetBall();
gameLoop();