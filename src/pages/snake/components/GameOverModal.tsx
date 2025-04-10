import React from "react";
import { View, Text } from "@tarojs/components";
import { RefreshCw } from "lucide-react";
import { Theme, THEMES } from "../types";

interface GameOverModalProps {
  score: number;
  onRestart: () => void;
  theme: Theme;
}

export function GameOverModal({ score, onRestart, theme }: GameOverModalProps) {
  const themeColors = THEMES[theme];

  return (
    <View
      className={`fixed inset-0 ${themeColors.modalOverlay} flex items-center justify-center z-50 p-4`}
    >
      <View
        className={`${themeColors.modal} p-6 md:p-8 rounded-lg w-full max-w-md text-center transition-colors duration-300`}
      >
        <Text className="text-2xl md:text-3xl font-bold mb-4">游戏结束</Text>
        <Text className="text-xl md:text-2xl mb-6">
          你的分数: <Text className="font-bold">{score}</Text>
        </Text>

        <View
          onClick={onRestart}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-sm md:text-base"
        >
          <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
          <Text>重新开始</Text>
        </View>
      </View>
    </View>
  );
}
