import React from 'react';
import { Difficulty, GameMode, Player } from '../types/game';
import { RotateCcw, Users, Notebook as Robot, Settings } from 'lucide-react';

interface GameControlsProps {
  onNewGame: () => void;
  onUndo: () => void;
  onModeChange: (mode: GameMode) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onColorChange: (color: Player) => void;
  gameMode: GameMode;
  difficulty: Difficulty;
  playerColor: Player;
  canUndo: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onNewGame,
  onUndo,
  onModeChange,
  onDifficultyChange,
  onColorChange,
  gameMode,
  difficulty,
  playerColor,
  canUndo,
}) => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-4">
        <button
          onClick={() => onModeChange('pvp')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            gameMode === 'pvp'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <Users size={20} /> PvP
        </button>
        <button
          onClick={() => onModeChange('ai')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            gameMode === 'ai'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <Robot size={20} /> vs AI
        </button>
      </div>

      {gameMode === 'ai' && (
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <Settings size={16} className="text-gray-600" />
            <span className="text-sm font-medium">AI Difficulty:</span>
          </div>
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
              <button
                key={level}
                onClick={() => onDifficultyChange(level)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  difficulty === level
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4">
            <Settings size={16} className="text-gray-600" />
            <span className="text-sm font-medium">Your Color:</span>
          </div>
          <div className="flex gap-2">
            {(['black', 'white'] as Player[]).map((color) => (
              <button
                key={color}
                onClick={() => onColorChange(color)}
                className={`
                  px-3 py-1 rounded-lg text-sm
                  ${playerColor === color
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                  }
                `}
              >
                {color.charAt(0).toUpperCase() + color.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-2">
        <button
          onClick={onNewGame}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          New Game
        </button>
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg
            ${canUndo
              ? 'bg-yellow-600 text-white hover:bg-yellow-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <RotateCcw size={16} /> Undo
        </button>
      </div>
    </div>
  );
};

export default GameControls