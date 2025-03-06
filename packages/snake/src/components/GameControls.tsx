import React from 'react';
import { GameSettings } from '../types';
import { Settings } from 'lucide-react';

interface GameControlsProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onRestart: () => void;
  onClose: () => void;
}

export function GameControls({ settings, onSettingsChange, onRestart, onClose }: GameControlsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg w-96 max-w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-gray-300" />
            <h2 className="text-2xl font-bold text-white">游戏设置</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">移动速度</label>
            <input
              type="range"
              min="1"
              max="15"
              value={settings.speed}
              onChange={(e) => onSettingsChange({
                ...settings,
                speed: Number(e.target.value)
              })}
              className="w-full"
            />
            <div className="text-gray-400 text-sm mt-1">当前速度: {settings.speed}</div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">地图大小</label>
            <input
              type="range"
              min="10"
              max="30"
              value={settings.gridSize}
              onChange={(e) => onSettingsChange({
                ...settings,
                gridSize: Number(e.target.value)
              })}
              className="w-full"
            />
            <div className="text-gray-400 text-sm mt-1">当前大小: {settings.gridSize}x{settings.gridSize}</div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">苹果数量</label>
            <input
              type="range"
              min="1"
              max="5"
              value={settings.appleCount}
              onChange={(e) => onSettingsChange({
                ...settings,
                appleCount: Number(e.target.value)
              })}
              className="w-full"
            />
            <div className="text-gray-400 text-sm mt-1">当前数量: {settings.appleCount}</div>
          </div>

          <button
            onClick={() => {
              onRestart();
              onClose();
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            应用设置并重新开始
          </button>
        </div>
      </div>
    </div>
  );
}