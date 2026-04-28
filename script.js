let resetController = null;
let gridController = null;
const createGameBoard = (size, nbreCellWin, player1, player2) => {
  // const nbreCellWin = nbreCellWi || 3;
  let cellsLeft = size * size;

  let board = Array(size)
    .fill()
    .map(() => Array(size).fill(""));

  const setXO = (i, j, xo) => {
    if (cellsLeft === 0) {
      // alert("Game Over ...!!!");
      const winner = document.createElement("div");
      winner.classList.add("winner");
      const winnerName = xo === "✖️" ? player1.name : player2.name;
      winner.textContent = `Winner is ${winnerName}`;
      const grid = document.querySelector(".grid");
      grid.replaceChildren();
      grid.append(winner);
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
      const winner = document.createElement("div");
      winner.classList.add("winner");
      const winnerName =
        player1.getScore() === player2.getScore()
          ? "Draw"
          : player1.getScore() > player2.getScore()
            ? "player 1 : " + player1.name
            : "player 2 : " + player2.name;
      winner.innerHTML = ` the Winner Player is : <br><br>
      -- ${winnerName} --`;
      const grid = document.querySelector(".grid");
      grid.style.width = "90%";
      grid.append(winner);
      return;
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
    let winCells = [];
    const getCount = (dx, dy) => {
      let count = 0;
      for (let step = 1; step < nbreCellWin; step++) {
        let x = i + dx * step;
        let y = j + dy * step;
        const cell = document.getElementById(`${x}, ${y}`);

        if (
          !isValidRowCol(x, y) ||
          board[x][y] !== xo ||
          cell.classList.contains("win")
        )
          break;
        count++;
        winCells.push([x, y]);
      }

      return count;
    };

    for (const direction of directions) {
      winCells = [[i, j]];
      let [dx, dy] = direction;
      let count1 = 1 + getCount(dx, dy);
      let totalCount =
        count1 >= nbreCellWin ? count1 : count1 + getCount(-dx, -dy);

      if (totalCount >= nbreCellWin) {
        for (let [x, y] of winCells) {
          const cell = document.getElementById(`${x}, ${y}`);
          cell.classList.add("win");
          cell.style.backgroundColor =
            xo === player1.mark ? "var(--bgwincolor1)" : "var(--bgwincolor2)";
        }
        return true;
      }
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
    cellsLeft = size * size;
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
  const resetScore = () => {
    score = 0;
  };

  const play = (i, j) => {
    getgameBoard().setXO(i, j, mark);
  };

  return { name, play, increaseScore, getScore, resetScore, mark };
};

function createMatrix(board) {
  let matrix = [];

  const grid = document.querySelector(".grid");
  grid.replaceChildren();
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

function startGame() {
  // const start = document.querySelector(".start");
  // start.style.display = "none";
  // const restart = document.querySelector(".restart");
  // restart.style.display = "grid";
  const player1Name = document.querySelector("#player1Name").value;
  const player2Name = document.querySelector("#player2Name").value;
  const gridSize = parseInt(document.querySelector("#gridSize").value);
  const nbreCellWin = parseInt(document.querySelector("#nbreCellsWin").value);
  if (!player1Name || !player2Name) {
    showError("❌ Please enter both player names!");
    return;
  }

  if (isNaN(gridSize) || gridSize < 3 || gridSize > 20) {
    showError("❌ Grid size must be between 3 and 20!");
    return;
  }

  if (isNaN(nbreCellWin) || nbreCellWin < 3 || nbreCellWin > gridSize) {
    showError("❌ Number of cells to win must be between 3 and grid size!");
    return;
  }

  if (player1Name === player2Name) {
    showError("❌ Player names must be different!");
    return;
  }

  let gameBoard;
  const grid = document.querySelector(".grid");
  grid.replaceChildren();
  grid.style.width = "fit-content";

  const player1 = createPlayer(player1Name, "✖️", () => gameBoard);
  const player2 = createPlayer(player2Name, "⭕", () => gameBoard);
  gameBoard = createGameBoard(gridSize, nbreCellWin, player1, player2);

  // CRÉER UN NOUVEAU CONTROLLER

  if (resetController) resetController.abort();
  if (gridController) gridController.abort();
  resetController = new AbortController();
  gridController = new AbortController();

  const resetButton = document.querySelector(".resetGame");
  resetButton.addEventListener(
    "click",
    () => {
      grid.style.width = "fit-content";
      reset(gameBoard);
    },
    { signal: resetController.signal },
  );
  createMatrix(gameBoard.getBoard());
  reset(gameBoard);

  let currentPlayer = player1;

  function reset(gameBoard) {
    gameBoard.resetBoard();
    createMatrix(gameBoard.getBoard());
    player1.resetScore();
    player2.resetScore();
    document.querySelector(".score1").textContent = "SCORE = 0";
    document.querySelector(".score2").textContent = "SCORE = 0";
    const existingWinner = document.querySelector(".winner");
    if (existingWinner) existingWinner.remove();
  }

  grid.addEventListener(
    "click",
    (e) => {
      if (e.target.classList.contains("cell")) {
        let [i, j] = e.target.id.split(",");
        i = parseInt(i);
        j = parseInt(j);
        if (gameBoard.getBoard()[i][j] !== "") return;
        currentPlayer.play(i, j);
        currentPlayer = currentPlayer === player1 ? player2 : player1;
      }
    },
    { signal: gridController.signal },
  );
  // restart.addEventListener("click", () => {
  //   start.style.display = "grid";
  //   restart.style.display = "none";
  //   document.querySelector("#player1Name").value = "";
  //   document.querySelector("#player2Name").value = "";
  //   document.querySelector("#gridSize").value = "";
  //   document.querySelector("#nbreCellsWin").value = "";

  //   reset(gameBoard);
  // });
}

const start = document.querySelector(".start");
start.addEventListener("click", startGame);
