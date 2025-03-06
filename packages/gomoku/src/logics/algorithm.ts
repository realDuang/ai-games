import { Board, Player } from "../types/game";
import { BOARD_SIZE, checkWinner, getCandidateMoves, isDraw, isEmptyBoard, isValidPosition } from "./utils";

/**
 * 评估指定位置的分数
 * @param board - 当前棋盘状态
 * @param row - 要评估的行坐标
 * @param col - 要评估的列坐标
 * @param aiColor - AI的棋子颜色
 * @returns 该位置的评估分数
 *
 * 评估逻辑：
 * 1. 检查四个方向：水平、垂直、主对角线、副对角线
 * 2. 对每个方向计算分数并累加
 * 3. 分数越高表示该位置越有价值
 */
export const evaluatePosition = (
  board: Board,
  row: number,
  col: number,
  aiColor: Player
): number => {
  const directions = [
    [1, 0], // 垂直方向
    [0, 1], // 水平方向
    [1, 1], // 主对角线
    [1, -1], // 副对角线
  ];
  let score = 0;

  directions.forEach(([dx, dy]) => {
    score += evaluateDirection(board, row, col, dx, dy, aiColor);
  });

  return score;
};

/**
 * 使用极小化极大算法(Minimax)获取AI的最佳落子位置
 *
 * @param board - 当前棋盘状态
 * @param aiColor - AI的棋子颜色
 * @param depth - 搜索深度，可以根据性能需求调整
 * @returns 返回最佳落子位置的坐标 [行, 列]
 *
 * 算法说明：
 * 1. 遍历棋盘上所有空位置
 * 2. 对每个位置进行以下评估：
 *    - 如果该位置可以直接获胜，立即返回该位置
 *    - 使用启发式评估计算该位置的初始分数
 *    - 对高分位置(分数>100)进行深度搜索
 * 3. 使用Alpha-Beta剪枝的极小化极大算法进行深度搜索
 * 4. 返回评分最高的位置
 */
export const getBestMoveWithMinimax = (
  board: Board,
  aiColor: Player,
  depth: number
): [number, number] => {
  const humanColor = aiColor === "black" ? "white" : "black";
  let bestScore = -Infinity;
  let bestMove: [number, number] = [-1, -1];

  // 优化1: 如果是空棋盘，直接下在中心位置
  if (isEmptyBoard(board)) {
    const center = Math.floor(BOARD_SIZE / 2);
    return [center, center];
  }

  // 优化2: 只考虑已有棋子周围的空位
  const candidateMoves = getCandidateMoves(board);

  if (candidateMoves.length === 0) {
    // 如果没有候选位置（不应该发生），回退到遍历所有位置
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (!board[i][j]) {
          candidateMoves.push([i, j]);
        }
      }
    }
  }

  // 遍历候选位置
  for (const [i, j] of candidateMoves) {
    // 尝试这个移动
    board[i][j] = aiColor;

    // 如果这个移动能直接获胜，立即返回
    if (checkWinner(board, i, j, aiColor)) {
      board[i][j] = null;
      return [i, j];
    }

    // 使用启发式评估来减少搜索空间
    const positionScore = evaluatePosition(board, i, j, aiColor);

    // 优化3: 根据位置分数动态调整搜索深度
    let score;
    if (positionScore > 500) {
      // 高价值位置用更深的搜索
      score = minimax(
        board,
        depth + 1,
        false,
        -Infinity,
        Infinity,
        aiColor,
        humanColor,
        i,
        j // 传入最后一步的位置
      );
    } else if (positionScore > 100) {
      // 中等价值位置用正常深度
      score = minimax(
        board,
        depth,
        false,
        -Infinity,
        Infinity,
        aiColor,
        humanColor,
        i,
        j
      );
    } else {
      // 低价值位置直接使用评估分数
      score = positionScore;
    }

    // 撤销这个移动
    board[i][j] = null;

    // 更新最佳移动
    if (score > bestScore) {
      bestScore = score;
      bestMove = [i, j];
    }
  }

  return bestMove;
};

const evaluateDirection = (
  board: Board,
  row: number,
  col: number,
  dx: number,
  dy: number,
  aiColor: Player
): number => {
  const humanColor = aiColor === "black" ? "white" : "black";
  let aiCount = 0;
  let humanCount = 0;
  let openEnds = 0;

  //  检查四个方向
  for (let dir = -1; dir <= 1; dir += 2) {
    for (let i = 1; i <= 4; i++) {
      const newRow = row + dx * i * dir;
      const newCol = col + dy * i * dir;

      if (!isValidPosition(newRow, newCol)) break;

      const cell = board[newRow][newCol];
      if (cell === aiColor) aiCount++;
      else if (cell === humanColor) humanCount++;
      else {
        openEnds++;
        break;
      }
    }
  }

  // Scoring logic
  if (aiCount >= 4) return 10000; // Winning move
  if (humanCount >= 4) return 5000; // Block opponent's win
  if (aiCount === 3 && openEnds === 2) return 1000; // Open four
  if (humanCount === 3 && openEnds === 2) return 800; // Block open four
  if (aiCount === 2 && openEnds === 2) return 400; // Open three
  if (humanCount === 2 && openEnds === 2) return 300; // Block open three

  return aiCount * 10 + openEnds * 5;
};

const minimax = (
  board: Board,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
  aiColor: Player,
  humanColor: Player,
  lastMoveRow?: number,
  lastMoveCol?: number
): number => {
  // 优化4: 如果有最后一步的位置，先检查这一步是否导致游戏结束
  if (lastMoveRow !== undefined && lastMoveCol !== undefined) {
    const lastPlayer = isMaximizing ? humanColor : aiColor;
    if (checkWinner(board, lastMoveRow, lastMoveCol, lastPlayer)) {
      return lastPlayer === aiColor ? 10000 : -10000;
    }
  }

  // 基本情况：达到搜索深度或游戏结束
  if (depth === 0) {
    return evaluateBoardState(board, aiColor);
  }

  // 检查是否平局
  if (isDraw(board)) {
    return 0;
  }

  // 优化5: 只考虑已有棋子周围的空位
  const candidateMoves = getCandidateMoves(board);

  if (isMaximizing) {
    let maxEval = -Infinity;
    // 遍历候选位置
    for (const [i, j] of candidateMoves) {
      if (!board[i][j]) {
        board[i][j] = aiColor;
        const currEval = minimax(
          board,
          depth - 1,
          false,
          alpha,
          beta,
          aiColor,
          humanColor,
          i,
          j
        );
        board[i][j] = null;
        maxEval = Math.max(maxEval, currEval);
        alpha = Math.max(alpha, currEval);
        if (beta <= alpha) break; // Alpha-Beta 剪枝
      }
    }
    return maxEval === -Infinity ? evaluateBoardState(board, aiColor) : maxEval;
  } else {
    let minEval = Infinity;
    // 遍历候选位置
    for (const [i, j] of candidateMoves) {
      if (!board[i][j]) {
        board[i][j] = humanColor;
        const currEval = minimax(
          board,
          depth - 1,
          true,
          alpha,
          beta,
          aiColor,
          humanColor,
          i,
          j
        );
        board[i][j] = null;
        minEval = Math.min(minEval, currEval);
        beta = Math.min(beta, currEval);
        if (beta <= alpha) break; // Alpha-Beta 剪枝
      }
    }
    return minEval === Infinity ? evaluateBoardState(board, aiColor) : minEval;
  }
};

// 评估整个棋盘状态
const evaluateBoardState = (board: Board, aiColor: Player): number => {
  let score = 0;
  const humanColor = aiColor === "black" ? "white" : "black";

  // 遍历所有空位置并评估
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (!board[i][j]) {
        // 评估 AI 在此位置的潜力
        board[i][j] = aiColor;
        score += evaluatePosition(board, i, j, aiColor) * 0.5;
        board[i][j] = null;

        // 评估人类玩家在此位置的潜力（防守价值）
        board[i][j] = humanColor;
        score -= evaluatePosition(board, i, j, humanColor) * 0.3;
        board[i][j] = null;
      }
    }
  }

  return score;
};
