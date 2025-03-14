export type GameState = 'waiting' | 'playing' | 'won' | 'lost';

export interface CellState {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

// 新增历史记录类型
export interface GameHistory {
  id: string;
  date: string;
  result: 'won' | 'lost';
  settings: {
    width: number;
    height: number;
    mines: number;
  };
  time: number;
}