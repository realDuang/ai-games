import { Board } from "../types/game";
import { getBestMoveWithMinimax } from "./algorithm";

// 监听主线程消息
self.onmessage = (e) => {
  const { board, aiColor, depth } = e.data;
  
  try {
    // 计算最佳移动
    const bestMove = getBestMoveWithMinimax(board, aiColor, depth);
    
    // 将结果发送回主线程
    self.postMessage(bestMove);
  } catch (error) {
    console.error('AI Worker 内部错误:', error);
    // 发生错误时发送一个默认移动
    self.postMessage(getRandomMove(board));
  }
};

// 获取随机移动作为后备方案
const getRandomMove = (board: Board): [number, number] => {
  const emptyPositions: [number, number][] = [];
  const BOARD_SIZE = board.length;

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (!board[i][j]) {
        emptyPositions.push([i, j]);
      }
    }
  }

  return emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
};

// 确保 TypeScript 将此文件视为模块
export {};