import React from 'react';
import { GameState } from '../types';

interface GameOverModalProps {
  gameState: GameState;
  time: number;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  gameState,
  time,
  onRestart
}) => {
  if (gameState !== 'won' && gameState !== 'lost') return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 transform animate-slide-up">
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-3 ${gameState === 'won' ? 'text-green-600' : 'text-red-600'}`}>
            {gameState === 'won' ? 'Congratulations!' : 'Game Over!'}
          </h2>
          
          {gameState === 'won' && (
            <p className="text-lg text-gray-600 mb-4">
              You completed the game in <span className="font-bold">{time}</span> seconds!
            </p>
          )}

          <button
            onClick={onRestart}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-base font-semibold"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}