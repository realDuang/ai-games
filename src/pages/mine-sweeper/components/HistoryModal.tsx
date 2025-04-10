import React from 'react';
import { X, Trophy, Skull, Clock, Grid3X3, Bomb } from 'lucide-react';
import { GameHistory } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: GameHistory[];
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-5 w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">游戏历史</h2>
          <button
            onClick={() => onClose()}
            className="p-1 .active:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="overflow-auto flex-grow">
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              暂无游戏历史记录
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((game) => (
                <div
                  key={game.id}
                  className={`border rounded-lg p-3 ${
                    game.result === 'won' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      {game.result === 'won' ? (
                        <Trophy className="w-5 h-5 text-green-600" />
                      ) : (
                        <Skull className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-medium">
                        {game.result === 'won' ? '胜利' : '失败'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{game.date}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Grid3X3 className="w-4 h-4 text-gray-600" />
                      <span>{game.settings.width}×{game.settings.height}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bomb className="w-4 h-4 text-gray-600" />
                      <span>{game.settings.mines} 个地雷</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span>{game.time} 秒</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={() => onClearHistory()}
            className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            清空历史
          </button>
          <button
            onClick={() => onClose()}
            className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
