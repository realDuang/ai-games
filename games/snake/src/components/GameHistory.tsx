import React from 'react';
import { GameRecord } from '../types';
import { History } from 'lucide-react';

interface GameHistoryProps {
  records: GameRecord[];
}

export function GameHistory({ records }: GameHistoryProps) {
  return (
    <div className="mt-4 p-4 bg-gray-700 rounded-lg">
      <div className="flex items-center gap-4 mb-4">
        <History className="w-6 h-6 text-gray-300" />
        <h2 className="text-xl font-bold text-gray-300">历史记录</h2>
      </div>
      
      <div className="space-y-2">
        {records.length === 0 ? (
          <p className="text-gray-400">暂无游戏记录</p>
        ) : (
          records.map((record, index) => (
            <div
              key={index}
              className="bg-gray-800 p-3 rounded-lg"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">得分: {record.score}</span>
                <span className="text-gray-400 text-sm">{record.date}</span>
              </div>
              <div className="text-gray-400 text-sm">
                设置: {record.settings.gridSize}x{record.settings.gridSize} 格子,
                速度 {record.settings.speed},
                {record.settings.appleCount} 个苹果
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}