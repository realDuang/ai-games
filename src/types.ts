export type GameState = "waiting" | "playing" | "won" | "lost";

export interface CellState {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

export interface GameHistory {
  date: string;
  duration: number;
  result: "won" | "lost";
  boardSize: {
    width: number;
    height: number;
    mines: number;
  };
}

export interface Game {
  id: string;
  title: string;
  description: string;
  icon: any;
  difficulty: string;
  categories: string[];
}

export interface SudokuHistory {
  date: string;
  duration: number;
  difficulty: SudokuDifficulty;
}

export type SudokuDifficulty = "easy" | "medium" | "hard";

export interface SudokuCell {
  value: number;
  fixed: boolean;
  notes: number[];
  error: boolean;
}

export type Direction = "up" | "down" | "left" | "right";

export interface Position {
  x: number;
  y: number;
}

export interface SnakeState {
  direction: Direction;
  body: Position[];
  apples: Position[];
  score: number;
  gameStatus: GameState;
}

export interface SnakeSettings {
  speed: "slow" | "medium" | "fast";
  appleCount: number;
}

export interface SnakeHistory {
  date: string;
  duration: number;
  score: number;
  speed: string;
  appleCount: number;
}
