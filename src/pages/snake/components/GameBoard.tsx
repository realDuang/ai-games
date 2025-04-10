import React from "react";
import { View } from "@tarojs/components";
import { GameState, GameSettings, Theme, THEMES } from "../types";

interface GameBoardProps {
  gameState: GameState;
  settings: GameSettings;
  theme: Theme;
}

export function GameBoard({ gameState, settings, theme }: GameBoardProps) {
  const { snake, apples } = gameState;
  const themeColors = THEMES[theme];
  const boardSize = settings.gridSize * 20; // CELL_SIZE

  // 计算响应式尺寸
  const scaleFactor = 1; // 小程序环境下的缩放可能需要调整
  const responsiveBoardSize = boardSize * scaleFactor;

  return (
    <View
      className={`relative ${themeColors.board} border-2 ${themeColors.boardBorder} touch-none transition-colors duration-300`}
      style={{
        width: `${responsiveBoardSize}px`,
        height: `${responsiveBoardSize}px`,
      }}
    >
      {snake.map((segment, index) => (
        <View
          key={`snake-${index}`}
          className={`absolute ${
            themeColors.snake[index === 0 ? 0 : 1]
          } rounded-sm transition-colors duration-300`}
          style={{
            width: '20px',
            height: '20px',
            left: `${segment.x * 20}px`,
            top: `${segment.y * 20}px`,
          }}
        />
      ))}
      {apples.map((apple, index) => (
        <View
          key={`apple-${index}`}
          className={`absolute ${themeColors.apple} rounded-full transition-colors duration-300`}
          style={{
            width: '20px',
            height: '20px',
            left: `${apple.x * 20}px`,
            top: `${apple.y * 20}px`,
          }}
        />
      ))}
    </View>
  );
}
