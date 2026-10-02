// ===== 1. GAME STATE =====
// The board is an array of 9 items (index 0-8). "" means the cell is empty.
//  0 | 1 | 2
//  3 | 4 | 5
//  6 | 7 | 8
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";   // X always starts
let gameActive = true;     // false after a win or a draw

// All 8 ways to win: 3 rows, 3 columns, 2 diagonals
const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],   // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8],   // columns
  [0, 4, 8], [2, 4, 6]               // diagonals
];

// ===== 2. GET HTML ELEMENTS =====
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartButton = document.getElementById("restart");

// ===== 3. START THE GAME =====
function initGame() {
  cells.forEach(function (cell) {
    cell.addEventListener("click", handleCellClick);
  });
  restartButton.addEventListener("click", restartGame);
  updateStatus("Player " + currentPlayer + "'s turn");
}

// ===== 4. HANDLE A CELL CLICK =====
function handleCellClick(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.index);

  // Ignore the click if the game is over or the cell is already used
  if (!gameActive || board[index] !== "") {
    return;
  }

  // Save the move in the array and show it on screen
  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());   // "x" or "o" (for color)
  cell.setAttribute("aria-disabled", "true");        // marks the cell as used (keeps keyboard focus)
  cell.setAttribute("aria-label", cell.getAttribute("aria-label").replace("empty", currentPlayer));

  // Check the result of this move
  const winningCombo = checkWinner();
  if (winningCombo) {
    endGame("Player " + currentPlayer + " wins!", winningCombo);
  } else if (checkDraw()) {
    endGame("It's a draw!", null);
  } else {
    switchPlayer();
  }
}

// ===== 5. CHECK FOR A WINNER =====
// Returns the winning combination (e.g. [0,1,2]) or null if nobody won
function checkWinner() {
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
      return winningCombinations[i];
    }
  }
  return null;
}

// ===== 6. CHECK FOR A DRAW =====
// Draw = every cell is filled (we only call this when there is no winner)
function checkDraw() {
  return board.every(function (value) {
    return value !== "";
  });
}

// ===== 7. SWITCH PLAYER =====
function switchPlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus("Player " + currentPlayer + "'s turn");
}

// ===== 8. END THE GAME =====
function endGame(message, winningCombo) {
  gameActive = false;
  updateStatus(message);

  if (winningCombo) {
    winningCombo.forEach(function (index) {
      cells[index].classList.add("win");   // highlight winning cells
    });
  }
  // Mark all cells as unavailable (clicks are also ignored because gameActive is false)
  cells.forEach(function (cell) {
    cell.setAttribute("aria-disabled", "true");
  });
}

// ===== 9. RESTART THE GAME =====
function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;

  cells.forEach(function (cell, i) {
    cell.textContent = "";
    cell.className = "cell";   // removes x, o and win classes
    cell.removeAttribute("aria-disabled");
    cell.setAttribute("aria-label", "Row " + (Math.floor(i / 3) + 1) + ", column " + ((i % 3) + 1) + ", empty");
  });
  updateStatus("Player X's turn");
}

// ===== 10. HELPER: UPDATE STATUS MESSAGE =====
function updateStatus(message) {
  statusText.textContent = message;
}

initGame();
