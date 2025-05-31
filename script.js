// script.js

// Element references
const splashScreen = document.getElementById("splash-screen");
const gameScreen = document.getElementById("game-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const startButton = document.getElementById("start-button");
const submitButton = document.getElementById("submit-button");
const playAgainButton = document.getElementById("play-again-button");
const questionEl = document.getElementById("question");
const answerInput = document.getElementById("answer-input");
const currentScoreEl = document.getElementById("current-score");
const finalScoreEl = document.getElementById("final-score");
const highScoreEl = document.getElementById("high-score");
const timerEl = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let timeLimit = 10;
let level = 1;
let timerInterval;
let currentQuestion = {};

function showScreen(screen) {
  splashScreen.classList.add("hidden");
  gameScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  screen.classList.remove("hidden");
  screen.classList.add("active");
}

function generateQuestion() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  currentQuestion = {
    num1,
    num2,
    answer: num1 * num2
  };
  questionEl.textContent = `${num1} x ${num2} = ?`;
  questionEl.classList.add("fade-question");
  setTimeout(() => questionEl.classList.remove("fade-question"), 300);
  answerInput.value = "";
  answerInput.focus();
}

function startTimer() {
  let timeLeft = timeLimit;
  timerEl.textContent = timeLeft;
  progressBar.style.transition = "none";
  progressBar.style.width = "100%";

  // Allow transition after reset
  setTimeout(() => {
    progressBar.style.transition = `width ${timeLimit}s linear`;
    progressBar.style.width = "0%";
  }, 50);

  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      gameOver();
    }
  }, 1000);
}

function updateScore() {
  score++;
  currentScoreEl.textContent = score;
  if (score % 5 === 0 && level < 7) {
    level++;
    timeLimit = Math.max(4, 10 - (level - 1));
  }
}

function submitAnswer() {
  const userAnswer = parseInt(answerInput.value.trim());
  if (isNaN(userAnswer)) return;

  if (userAnswer === currentQuestion.answer) {
    showFeedback(true); // Tampilkan animasi hijau (benar)
    clearInterval(timerInterval);
    updateScore();
    generateQuestion();
    startTimer();
  } else {
    showFeedback(false); // Tampilkan animasi merah (salah)
    clearInterval(timerInterval);
    gameOver();
  }
}

function gameOver() {
  showScreen(gameOverScreen);
  finalScoreEl.textContent = score;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
  highScoreEl.textContent = highScore;
}

function resetGame() {
  score = 0;
  level = 1;
  timeLimit = 10;
  currentScoreEl.textContent = score;
  highScoreEl.textContent = localStorage.getItem("highScore") || 0;
}

// Event Listeners
startButton.addEventListener("click", () => {
  resetGame();
  showScreen(gameScreen);
  generateQuestion();
  startTimer();
});

submitButton.addEventListener("click", submitAnswer);

answerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitAnswer();
});

playAgainButton.addEventListener("click", () => {
  resetGame();
  showScreen(gameScreen);
  generateQuestion();
  startTimer();
});

// Initial load
window.addEventListener("load", () => {
  highScoreEl.textContent = highScore;
});

function showFeedback(isCorrect) {
  const className = isCorrect ? "correct" : "incorrect";
  questionEl.classList.add(className);
  setTimeout(() => questionEl.classList.remove(className), 400);
}