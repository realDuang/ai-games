export type GameState = 'waiting' | 'playing' | 'won' | 'lost';

export interface CellState {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}