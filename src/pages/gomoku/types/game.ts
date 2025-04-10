export type Player = 'black' | 'white';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameMode = 'ai' | 'pvp';
export type CellState = Player | null;
export type Board = CellState[][];

export interface GameState {
  board: Board;
  currentPlayer: Player;
  gameMode: GameMode;
  difficulty: Difficulty;
  winner: Player | 'draw' | null;
  history: Board[];
  playerColor: Player;
}