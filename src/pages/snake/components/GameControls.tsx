import React from "react";
import { Settings } from "lucide-react";
import { View, Text, Slider } from "@tarojs/components";

import { GameSettings, Theme, THEMES } from "../types";

interface GameControlsProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onRestart: () => void;
  onClose: () => void;
  theme: Theme;
}

export function GameControls({
  settings,
  onSettingsChange,
  onRestart,
  onClose,
  theme,
}: GameControlsProps) {
  const themeColors = THEMES[theme];

  return (
    <View
      className={`fixed inset-0 ${themeColors.modalOverlay} flex items-center justify-center z-50 p-4`}
    >
      <View
        className={`${themeColors.modal} p-6 md:p-8 rounded-lg w-full max-w-sm transition-colors duration-300`}
      >
        <View className="flex items-center justify-between mb-6">
          <View className="flex items-center gap-3">
            <Settings className="w-5 h-5 md:w-6 md:h-6 opacity-80" />
            <Text className="text-xl md:text-2xl font-bold">游戏设置</Text>
          </View>
          <View
            onClick={onClose}
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            ✕
          </View>
        </View>

        <View className="space-y-6">
          <View>
            <Text className="block opacity-80 mb-2 text-sm md:text-base">
              移动速度
            </Text>
            <Slider
              min={1}
              max={15}
              value={settings.speed}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  speed: Number(e.detail.value),
                })
              }
              className="w-full"
              activeColor="#34D399"
              backgroundColor="#D1D5DB"
              blockSize={20}
              blockColor="#10B981"
            />
            <Text className="opacity-60 text-xs md:text-sm mt-1">
              当前速度: {settings.speed}
            </Text>
          </View>

          <View>
            <Text className="block opacity-80 mb-2 text-sm md:text-base">
              地图大小
            </Text>
            <Slider
              min={10}
              max={30}
              value={settings.gridSize}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  gridSize: Number(e.detail.value),
                })
              }
              className="w-full"
              activeColor="#34D399"
              backgroundColor="#D1D5DB"
              blockSize={20}
              blockColor="#10B981"
            />
            <Text className="opacity-60 text-xs md:text-sm mt-1">
              当前大小: {settings.gridSize}x{settings.gridSize}
            </Text>
          </View>

          <View>
            <Text className="block opacity-80 mb-2 text-sm md:text-base">
              苹果数量
            </Text>
            <Slider
              min={1}
              max={5}
              value={settings.appleCount}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  appleCount: Number(e.detail.value),
                })
              }
              className="w-full"
              activeColor="#34D399"
              backgroundColor="#D1D5DB"
              blockSize={20}
              blockColor="#10B981"
            />
            <Text className="opacity-60 text-xs md:text-sm mt-1">
              当前数量: {settings.appleCount}
            </Text>
          </View>

          <View
            onClick={() => {
              onRestart();
              onClose();
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition-colors text-sm md:text-base text-center"
          >
            应用设置并重新开始
          </View>
        </View>
      </View>
    </View>
  );
}
