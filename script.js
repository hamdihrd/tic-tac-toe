const createGameBoard = (size, nbreCellWin, player1, player2) => {
  // const nbreCellWin = nbreCellWi || 3;
  let cellsLeft = size * size;

  let board = Array(size)
    .fill()
    .map(() => Array(size).fill(""));

  const setXO = (i, j, xo) => {
    if (cellsLeft === 0) {
      alert("Game Over ...!!!");
      return;
    }
    if (board[i][j] !== "") {
      console.log("Cell is not empty");
      return;
    }
    const cell = document.getElementById(`${i}, ${j}`);
    cell.textContent = xo;

    board[i][j] = xo;
    cellsLeft--;

    if (detectWin(i, j, xo)) {
      if (xo === player1.mark) {
        player1.increaseScore();
        document.querySelector(".score1").textContent =
          `SCORE = ${player1.getScore()}`;
      } else {
        player2.increaseScore();
        document.querySelector(".score2").textContent =
          `SCORE = ${player2.getScore()}`;
      }
    } else if (cellsLeft === 0) {
      alert("Game Over ...!!!");
    }
  };

  const directions = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ];

  const isValidRowCol = (i, j) => {
    return i >= 0 && i < size && j >= 0 && j < size;
  };

  const detectWin = (i, j, xo) => {
    const getCount = (dx, dy) => {
      let count = 0;
      for (let step = 1; step < nbreCellWin; step++) {
        let x = i + dx * step;
        let y = j + dy * step;
        if (!isValidRowCol(x, y) || board[x][y] !== xo) break;
        count++;
      }

      return count;
    };

    for (const direction of directions) {
      let [dx, dy] = direction;
      let totalCount = 1 + getCount(dx, dy) + getCount(-dx, -dy);
      if (totalCount >= nbreCellWin) return true;
    }
    return false;
  };

  const displayBoard = () => {
    console.log(board);
  };
  const getBoard = () => {
    return board;
  };
  const resetBoard = () => {
    board = Array(size)
      .fill()
      .map(() => Array(size).fill(""));
  };

  return { displayBoard, setXO, resetBoard, getBoard };
};

const createPlayer = (name, mark, getgameBoard) => {
  let score = 0;

  const increaseScore = () => {
    score++;
  };
  const getScore = () => {
    return score;
  };

  const play = (i, j) => {
    getgameBoard().setXO(i, j, mark);
  };

  return { name, play, increaseScore, getScore, mark };
};

function createMatrix(board) {
  let matrix = [];

  const grid = document.querySelector(".grid");
  grid.style.gridTemplateColumns = `repeat(${board.length}, minmax(calc((min(100vh,calc( 100vw - 150px)) - 40px) / ${board.length}), 1fr))`;
  grid.style.gridTemplateRows = `repeat(${board.length}, minmax(calc((min(100vh,calc( 100vw - 150px)) - 40px) / ${board.length}), 1fr))`;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      cell.id = `${i}, ${j}`;
      cell.textContent = board[i][j];
      matrix.push(cell);
    }
  }
  grid.append(...matrix);
}
function reset(gameBoard) {
  gameBoard.resetBoard();
  createMatrix(gameBoard.getBoard());
  player1.score = 0;
  player2.score = 0;
  document.querySelector(".score1").textContent = "SCORE = 0";
  document.querySelector(".score2").textContent = "SCORE = 0";
}

function startGame() {
  const player1Name = document.querySelector("#player1Name").value;
  const player2Name = document.querySelector("#player2Name").value;
  const gridSize = parseInt(document.querySelector("#gridSize").value);
  const nbreCellWin = parseInt(document.querySelector("#nbreCellsWin").value);

  let gameBoard;
  const grid = document.querySelector(".grid");

  const player1 = createPlayer(player1Name, "✖️", () => gameBoard);
  const player2 = createPlayer(player2Name, "⭕", () => gameBoard);
  gameBoard = createGameBoard(gridSize, nbreCellWin, player1, player2);
  const resetButton = document.querySelector(".resetGame");
  resetButton.addEventListener("click", () => reset(gameBoard));

  let currentPlayer = player1;

  grid.addEventListener("click", (e) => {
    if (e.target.classList.contains("cell")) {
      let [i, j] = e.target.id.split(",");
      i = parseInt(i);
      j = parseInt(j);
      currentPlayer.play(i, j);
      currentPlayer = currentPlayer === player1 ? player2 : player1;
    }
  });
  grid.innerHTML = "";
  createMatrix(gameBoard.getBoard());
}
const start = document.querySelector(".start");
start.addEventListener("click", startGame);
