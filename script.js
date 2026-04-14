const createGameBoard = (size) => {
  const nbreCellWin = 3;
  let board = Array(size)
    .fill()
    .map(() => Array(size).fill(0));

  setXO = (i, j, xo) => {
    board[i][j] = xo;
    if (detectWin(i, j, xo)) {
      console.log("player " + xo + " Win");
    } else {
      console.log("Draw");
    }
  };

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [-1, -1],
    [1, -1],
    [-1, 1],
  ];

  isValidRowCol = (i, j) => {
    return i >= 0 && i < size && j >= 0 && j < size;
  };

  detectWin = (i, j, xo) => {
    let count = 0;
    for (const direction of directions) {
      count = 0;
      let x = i;
      let y = j;
      while (isValidRowCol(x, y)) {
        if (board[x][y] === xo) {
          count++;
          if (count === nbreCellWin) {
            return true;
          }
        } else {
          break;
        }
        x += direction[0];
        y += direction[1];
      }
    }
    return false;
  };

  displayBoard = () => {
    console.log(board);
  };

  return { displayBoard, setXO };
};

const player = (name, mark) => {
  score = 0;
  name = name;
  mark = mark;

  increaseScore = () => {
    score++;
  };
  getScore = () => {
    return score;
  };

  return { name, mark, increaseScore, getScore };
};

const gameBoard = createGameBoard(3);
gameBoard.setXO(0, 2, "X");
gameBoard.setXO(0, 1, "X");
gameBoard.setXO(0, 0, "X");
// console.log(gameBoard.displayBoard());
