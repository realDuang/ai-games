import { GameState, GameSettings, CELL_SIZE } from '../types';

interface GameBoardProps {
  gameState: GameState;
  settings: GameSettings;
}

export function GameBoard({ gameState, settings }: GameBoardProps) {
  const { snake, apples } = gameState;
  const boardSize = settings.gridSize * CELL_SIZE;

  return (
    <div 
      className="relative bg-gray-800 border-2 border-gray-600"
      style={{ width: boardSize, height: boardSize }}
    >
      {snake.map((segment, index) => (
        <div
          key={`snake-${index}`}
          className={`absolute ${index === 0 ? 'bg-green-500' : 'bg-green-400'} rounded-sm`}
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            left: segment.x * CELL_SIZE,
            top: segment.y * CELL_SIZE,
          }}
        />
      ))}
      {apples.map((apple, index) => (
        <div
          key={`apple-${index}`}
          className="absolute bg-red-500 rounded-full"
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            left: apple.x * CELL_SIZE,
            top: apple.y * CELL_SIZE,
          }}
        />
      ))}
    </div>
  );
}