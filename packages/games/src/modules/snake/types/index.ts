export interface GameSettings {
  speed: number;
  gridSize: number;
  appleCount: number;
}

export interface GameState {
  snake: Point[];
  apples: Point[];
  direction: Direction;
  score: number;
  isGameOver: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export interface GameRecord {
  date: string;
  score: number;
  settings: GameSettings;
}

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export const CELL_SIZE = 20; // pixels
export const INITIAL_SNAKE_LENGTH = 3;
export const SCORE_PER_APPLE = 10;
