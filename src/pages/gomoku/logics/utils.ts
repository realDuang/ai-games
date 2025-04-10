import { Board, Player } from "../types/game";

export const BOARD_SIZE = 15;

export const createEmptyBoard = (): Board =>
  Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));

export const isValidPosition = (row: number, col: number): boolean =>
  row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;

export const isDraw = (board: Board): boolean =>
  board.every((row) => row.every((cell) => cell !== null));

export const checkWinner = (
  board: Board,
  row: number,
  col: number,
  player: Player
): boolean => {
  const directions = [
    [1, 0], // horizontal
    [0, 1], // vertical
    [1, 1], // diagonal
    [1, -1], // anti-diagonal
  ];

  return directions.some(([dx, dy]) => {
    let count = 1;

    // Check forward direction
    for (let i = 1; i < 5; i++) {
      const newRow = row + dx * i;
      const newCol = col + dy * i;
      if (!isValidPosition(newRow, newCol) || board[newRow][newCol] !== player)
        break;
      count++;
    }

    // Check backward direction
    for (let i = 1; i < 5; i++) {
      const newRow = row - dx * i;
      const newCol = col - dy * i;
      if (!isValidPosition(newRow, newCol) || board[newRow][newCol] !== player)
        break;
      count++;
    }

    return count >= 5;
  });
};

// 检查棋盘是否为空
export const isEmptyBoard = (board: Board): boolean => {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j]) return false;
    }
  }
  return true;
};

// 获取候选移动位置（已有棋子周围的空位）
export const getCandidateMoves = (board: Board): [number, number][] => {
  const candidates: [number, number][] = [];
  const visited = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(false));

  // 定义搜索范围（周围2格内）
  const searchRadius = 2;

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j]) {
        // 找到已有棋子，搜索其周围的空位
        for (let di = -searchRadius; di <= searchRadius; di++) {
          for (let dj = -searchRadius; dj <= searchRadius; dj++) {
            const ni = i + di;
            const nj = j + dj;

            if (isValidPosition(ni, nj) && !board[ni][nj] && !visited[ni][nj]) {
              candidates.push([ni, nj]);
              visited[ni][nj] = true;
            }
          }
        }
      }
    }
  }

  return candidates;
};
