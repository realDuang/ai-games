import React from "react";
import { Text, View } from "@tarojs/components";

import { Difficulty, GameMode, Player } from "../types/game";

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
    <View className="flex flex-col gap-3 p-3 bg-white rounded-lg shadow-md w-full">
      <View className="grid grid-cols-2 gap-2">
        <View
          onClick={() => onModeChange("pvp")}
          className={`flex items-center justify-center gap-1 py-2 rounded-lg ${
            gameMode === "pvp" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          <Text className="text-sm">对战模式</Text>
        </View>
        <View
          onClick={() => onModeChange("ai")}
          className={`flex items-center justify-center gap-1 py-2 rounded-lg ${
            gameMode === "ai" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          <Text className="text-sm">AI 对战</Text>
        </View>
      </View>

      {gameMode === "ai" && (
        <View className="space-y-2">
          <Text className="text-sm font-medium">AI 难度:</Text>
          <View className="grid grid-cols-3 gap-1">
            {(["easy", "medium", "hard"] as Difficulty[]).map((level) => (
              <View
                key={level}
                onClick={() => onDifficultyChange(level)}
                className={`py-1 rounded-lg text-center text-sm ${
                  difficulty === level
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {level === "easy"
                  ? "简单"
                  : level === "medium"
                  ? "中等"
                  : "困难"}
              </View>
            ))}
          </View>

          <Text className="text-sm font-medium mt-2">选择颜色:</Text>
          <View className="grid grid-cols-2 gap-1">
            {(["black", "white"] as Player[]).map((color) => (
              <View
                key={color}
                onClick={() => onColorChange(color)}
                className={`
                  py-1 rounded-lg text-center text-sm
                  ${
                    playerColor === color
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100"
                  }
                `}
              >
                {color === "black" ? "黑棋" : "白棋"}
              </View>
            ))}
          </View>
        </View>
      )}

      <View className="grid grid-cols-2 gap-2 mt-2">
        <View
          onClick={onNewGame}
          className="flex items-center justify-center py-2 bg-green-600 text-white rounded-lg"
        >
          <Text className="text-sm">新游戏</Text>
        </View>
        <View
          onClick={onUndo}
          className={`
            flex items-center justify-center py-2 rounded-lg
            ${
              canUndo ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-400"
            }
          `}
        >
          <Text className="text-sm">悔棋</Text>
        </View>
      </View>
    </View>
  );
};

export default GameControls;
