let board = Array(9).fill(null);
let isXNext = true;
let winner = null;
let winningLine = [];
let scores = { X: 0, O: 0, draws: 0 };
let gameMode = "pvp";
let difficulty = "medium";
let moveHistory = [];
let timeOfDay = "day";
let hoverIndex = null;
const app = document.getElementById("app");
const gameBoard = document.getElementById("gameBoard");
const statusText = document.getElementById("statusText");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const scoreDraws = document.getElementById("scoreDraws");
const undoBtn = document.getElementById("undoBtn");
const historyBtn = document.getElementById("historyBtn");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");
const pvpBtn = document.getElementById("pvpBtn");
const aiBtn = document.getElementById("aiBtn");
const difficultyPanel = document.getElementById("difficultyPanel");
const newGameBtn = document.getElementById("newGameBtn");
const resetScoresBtn = document.getElementById("resetScoresBtn");
const footerText = document.getElementById("footerText");
const particles = document.getElementById("particles");
init();

function init() {
  createBoard();
  createParticles();
  updateDisplay();
  setupEvents();
}
function setupEvents() {
  undoBtn.onclick = undoMove;
  historyBtn.onclick = toggleHistory;
  newGameBtn.onclick = resetGame;
  resetScoresBtn.onclick = resetScores;

  pvpBtn.onclick = () => setGameMode("pvp");
  aiBtn.onclick = () => setGameMode("ai");

  document.querySelectorAll(".difficulty-btn").forEach(btn => {
    btn.onclick = () => setDifficulty(btn.dataset.difficulty);
  });
}
function createBoard() {
  gameBoard.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("button");
    cell.className = "game-cell";
    cell.onclick = () => handleClick(i);
    cell.onmouseenter = () => handleHover(i);
    cell.onmouseleave = () => handleHoverLeave();
    gameBoard.appendChild(cell);
  }
}
function handleClick(index, aiMove = false) {
  if (board[index] || winner) return;
  if (gameMode === "ai" && !isXNext && !aiMove) return;

  const player = isXNext ? "X" : "O";
  board[index] = player;
  moveHistory.push({ index, player });
  isXNext = !isXNext;

  checkWinner();
  updateDisplay();

  if (gameMode === "ai" && !winner && !isXNext) {
    setTimeout(makeAIMove, 500);
  }
}

function makeAIMove() {
  const empty = board
    .map((v, i) => (v === null ? i : null))
    .filter(v => v !== null);

  if (!empty.length) return;

  let move = empty[Math.floor(Math.random() * empty.length)];
  handleClick(move, true);
}

function checkWinner() {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let line of lines) {
    const [a,b,c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      winner = board[a];
      winningLine = line;
      scores[winner]++;
      return;
    }
  }
  if (board.every(v => v)) {
    winner = "Draw";
    scores.draws++;
  }
}
function updateDisplay() {
  const cells = document.querySelectorAll(".game-cell");
  cells.forEach((cell, i) => {
    cell.classList.remove("winning");
    cell.innerHTML = "";

    if (board[i]) {
      cell.innerHTML = `<div class="symbol">${board[i]}</div>`;
      if (winningLine.includes(i)) cell.classList.add("winning");
    } 
    else if (hoverIndex === i && !winner) {
      cell.innerHTML = `<div class="preview">${isXNext ? "X" : "O"}</div>`;
    }
  });
  if (winner === "Draw") {
    statusText.textContent = "It's a Draw 🍃";
  } else if (winner) {
    statusText.textContent = `Winner: ${winner === "X" ? "🌿 Twigs" : "🪨 Stones"}`;
  } else {
    statusText.textContent = `Current Turn: ${isXNext ? "🌿 Twigs (X)" : "🪨 Stones (O)"}`;
  }
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
  scoreDraws.textContent = scores.draws;
  footerText.textContent =
    `Handcrafted with nature • ${gameMode === "ai" ? "Player vs AI" : "Player vs Player"} • Total Moves: ${moveHistory.length}`;
}
function handleHover(i) {
  if (!board[i] && !winner) {
    hoverIndex = i;
    updateDisplay();
  }
}
function handleHoverLeave() {
  hoverIndex = null;
  updateDisplay();
}
function undoMove() {
  if (!moveHistory.length || winner) return;
  const last = moveHistory.pop();
  board[last.index] = null;
  isXNext = last.player === "X";
  winner = null;
  winningLine = [];
  updateDisplay();
}
function resetGame() {
  board = Array(9).fill(null);
  winner = null;
  winningLine = [];
  moveHistory = [];
  isXNext = true;
  updateDisplay();
}
function resetScores() {
  scores = { X: 0, O: 0, draws: 0 };
  resetGame();
}
function toggleHistory() {
  historyPanel.classList.toggle("hidden");
  historyList.innerHTML = moveHistory
    .map((m, i) => `<div>${i+1}. ${m.player} → ${m.index}</div>`)
    .join("");
}
function setGameMode(mode) {
  gameMode = mode;
  pvpBtn.classList.toggle("active", mode === "pvp");
  aiBtn.classList.toggle("active", mode === "ai");
  difficultyPanel.classList.toggle("hidden", mode !== "ai");
  resetGame();
}
function setDifficulty(level) {
  difficulty = level;
  document.querySelectorAll(".difficulty-btn")
    .forEach(b => b.classList.toggle("active", b.dataset.difficulty === level));
}
function createParticles() {
  particles.innerHTML = "";
  for (let i = 0; i < 20; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random() * 100 + "%";
    p.style.top = Math.random() * 100 + "%";
    p.style.width = p.style.height = "4px";
    particles.appendChild(p);
  }
}
