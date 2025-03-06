import React from 'react';

interface GameOverModalProps {
  score: number;
  onRestart: () => void;
}

export function GameOverModal({ score, onRestart }: GameOverModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold text-white mb-4">游戏结束</h2>
        <p className="text-xl text-gray-300 mb-6">最终得分: {score}</p>
        <button
          onClick={onRestart}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition-colors"
        >
          重新开始
        </button>
      </div>
    </div>
  );
}