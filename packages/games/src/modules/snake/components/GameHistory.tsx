import React from 'react';
import { GameRecord } from '../types';
import { History, Trash2 } from 'lucide-react';

interface GameHistoryProps {
  records: GameRecord[];
  onClose: () => void;
  onClear: () => void;
}

export function GameHistory({ records, onClose, onClear }: GameHistoryProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg w-[480px] max-w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <History className="w-6 h-6 text-gray-300" />
            <h2 className="text-2xl font-bold text-white">历史记录</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-3 min-h-[300px]">
          {records.length === 0 ? (
            <p className="text-gray-400 text-center py-8">暂无游戏记录</p>
          ) : (
            records.map((record, index) => (
              <div
                key={index}
                className="bg-gray-700 p-4 rounded-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl font-semibold text-white">得分: {record.score}</span>
                  <span className="text-gray-400">{record.date}</span>
                </div>
                <div className="text-gray-300">
                  设置: {record.settings.gridSize}x{record.settings.gridSize} 格子,
                  速度 {record.settings.speed},
                  {record.settings.appleCount} 个苹果
                </div>
              </div>
            ))
          )}
        </div>

        {records.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-700">
            <button
              onClick={onClear}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              清除所有记录
            </button>
          </div>
        )}
      </div>
    </div>
  );
}