const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("statusText");
const restartBtn = document.getElementById("restartBtn");

let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

const HUMAN = "X";
const AI = "O";

const winningConditions = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function checkWinner(board) {
  for (let [a,b,c] of winningConditions) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.includes("") ? null : "draw";
}

/* Minimax */
function minimax(board, depth, isMax) {
  const result = checkWinner(board);
  if (result === AI) return 10 - depth;
  if (result === HUMAN) return depth - 10;
  if (result === "draw") return 0;

  if (isMax) {
    let best = -Infinity;
    board.forEach((cell, i) => {
      if (!cell) {
        board[i] = AI;
        best = Math.max(best, minimax(board, depth + 1, false));
        board[i] = "";
      }
    });
    return best;
  } else {
    let best = Infinity;
    board.forEach((cell, i) => {
      if (!cell) {
        board[i] = HUMAN;
        best = Math.min(best, minimax(board, depth + 1, true));
        board[i] = "";
      }
    });
    return best;
  }
}

/* AI Move */
function bestMove() {
  let bestScore = -Infinity;
  let move;

  gameState.forEach((cell, i) => {
    if (!cell) {
      gameState[i] = AI;
      let score = minimax(gameState, 0, false);
      gameState[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  });

  playMove(move, AI);
}

/* Play Move */
function playMove(index, player) {
  gameState[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add(player.toLowerCase());
  cells[index].disabled = true;

  updateStatus();
}

/* Status */
function updateStatus() {
  const result = checkWinner(gameState);

  if (result === HUMAN) {
    statusText.textContent = "YOU WIN!";
    gameActive = false;
  } else if (result === AI) {
    statusText.textContent = "AI WINS!";
    document.body.classList.add("shake");
    setTimeout(() => document.body.classList.remove("shake"), 300);
    gameActive = false;
  } else if (result === "draw") {
    statusText.textContent = "DRAW!";
    gameActive = false;
  } else {
    statusText.textContent = "YOUR TURN";
  }
}

/* Human Click */
function handleClick() {
  const index = this.dataset.index;
  if (!gameActive || gameState[index]) return;

  playMove(index, HUMAN);

  if (gameActive) {
    setTimeout(bestMove, 400);
  }
}

/* Restart */
function restartGame() {
  gameState = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  statusText.textContent = "YOUR TURN";

  cells.forEach(cell => {
    cell.textContent = "";
    cell.disabled = false;
    cell.classList.remove("x", "o");
  });
}

/* Events */
cells.forEach(cell => cell.addEventListener("click", handleClick));
restartBtn.addEventListener("click", restartGame);
