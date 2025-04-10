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

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type Theme = 'light' | 'dark';

export const CELL_SIZE = 20; // pixels
export const INITIAL_SNAKE_LENGTH = 3;
export const SCORE_PER_APPLE = 10;

export const THEMES = {
  light: {
    background: 'bg-gray-100',
    text: 'text-gray-900',
    board: 'bg-white',
    boardBorder: 'border-gray-300',
    snake: ['bg-green-500', 'bg-green-400'],
    apple: 'bg-red-500',
    button: 'bg-gray-200 hover:bg-gray-300',
    modal: 'bg-white',
    modalOverlay: 'bg-black bg-opacity-50',
  },
  dark: {
    background: 'bg-gray-900',
    text: 'text-white',
    board: 'bg-gray-800',
    boardBorder: 'border-gray-600',
    snake: ['bg-green-500', 'bg-green-400'],
    apple: 'bg-red-500',
    button: 'bg-gray-800 hover:bg-gray-700',
    modal: 'bg-gray-800',
    modalOverlay: 'bg-black bg-opacity-50',
  },
} as const;