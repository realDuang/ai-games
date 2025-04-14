// Function to check if a number can be placed in a given position
export function isValid(board: number[][], row: number, col: number, num: number): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxRow + i][boxCol + j] === num) return false;
    }
  }

  return true;
}

// Function to solve the Sudoku puzzle
function solveSudoku(board: number[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) {
              return true;
            }
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Function to generate a solved Sudoku board
function generateSolvedBoard(): number[][] {
  const board: number[][] = Array(9).fill(0).map(() => Array(9).fill(0));

  // Fill diagonal boxes first (they are independent)
  for (let box = 0; box < 9; box += 3) {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const randomIndex = Math.floor(Math.random() * nums.length);
        board[box + i][box + j] = nums[randomIndex];
        nums.splice(randomIndex, 1);
      }
    }
  }

  solveSudoku(board);
  return board;
}

// Function to generate a Sudoku puzzle with the specified difficulty
export function generatePuzzle(difficulty: 'easy' | 'medium' | 'hard'): number[][] {
  const solvedBoard = generateSolvedBoard();
  const puzzle = solvedBoard.map(row => [...row]);

  const cellsToRemove = {
    easy: 40,
    medium: 50,
    hard: 60
  }[difficulty];

  const positions = Array.from({ length: 81 }, (_, i) => ({
    row: Math.floor(i / 9),
    col: i % 9
  }));

  // Shuffle positions
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  // Remove numbers while ensuring unique solution
  let removed = 0;
  for (const pos of positions) {
    const { row, col } = pos;
    const temp = puzzle[row][col];
    puzzle[row][col] = 0;

    // Check if puzzle still has a unique solution
    const tempBoard = puzzle.map(currRow => [...currRow]);
    if (solveSudoku(tempBoard)) {
      removed++;
      if (removed === cellsToRemove) break;
    } else {
      puzzle[row][col] = temp;
    }
  }

  return puzzle;
}
