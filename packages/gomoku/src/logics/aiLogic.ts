import { Board, Player } from "../types/game";
import { evaluatePosition, getBestMoveWithMinimax } from "./algorithm";
import { BOARD_SIZE } from "./utils";

export async function getAIMove(
  board: Board,
  difficulty: "easy" | "medium" | "hard",
  aiColor: Player
): Promise<[number, number]> {
  // 简单模式不需要 Web Worker，直接计算
  if (difficulty === "easy") {
    return getEasyModeMove(board);
  } else if (difficulty === "medium") {
    return getMediumModeMove(board);
  } else {
    // 困难模式使用 Web Worker 和 minimax 算法
    return getAIMoveWithWorker(board, aiColor, 3);
  }
}

// 使用 Web Worker 获取 AI 移动
async function getAIMoveWithWorker(
  board: Board,
  aiColor: Player,
  depth: number
): Promise<[number, number]> {
  return new Promise((resolve) => {
    // 创建 Worker
    const worker = new Worker(new URL("./aiWorker.ts", import.meta.url), {
      type: "module",
    });

    // 监听 Worker 消息
    worker.onmessage = (e) => {
      resolve(e.data as [number, number]);
      worker.terminate(); // 任务完成后终止 Worker
    };

    // 监听 Worker 错误
    worker.onerror = (error) => {
      console.error("AI Worker 错误:", error);
      // 发生错误时回退到主线程计算
      resolve(getBestMoveWithMinimax(board, aiColor, depth));
      worker.terminate();
    };

    // 发送数据到 Worker
    worker.postMessage({ board, aiColor, depth });
  });
}

const getEasyModeMove = (board: Board): [number, number] => {
  const emptyPositions: [number, number][] = [];

  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (!cell) emptyPositions.push([i, j]);
    });
  });

  return emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
};

const getMediumModeMove = (board: Board): [number, number] => {
  const scores = evaluateAllPositions(board, "black");
  const maxScore = Math.max(...scores.map((move) => move.score));
  const bestMoves = scores.filter((move) => move.score === maxScore);
  const selectedMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
  return [selectedMove.row, selectedMove.col];
};

const evaluateAllPositions = (board: Board, aiColor: Player) => {
  const moves: { row: number; col: number; score: number }[] = [];

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (!board[i][j]) {
        const score = evaluatePosition(board, i, j, aiColor);
        moves.push({ row: i, col: j, score });
      }
    }
  }

  return moves;
};
