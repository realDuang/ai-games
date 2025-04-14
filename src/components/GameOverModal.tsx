import React from "react";
import { View, Text } from "@tarojs/components";
import { GameState } from "@/types";

interface GameOverModalProps {
  gameState: GameState;
  time: number;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  gameState,
  time,
  onRestart,
}) => {
  if (gameState !== "won" && gameState !== "lost") return null;

  return (
    <View className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <View className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 transform animate-slide-up">
        <View className="text-center">
          <Text
            className={`text-2xl font-bold mb-3 ${
              gameState === "won" ? "text-green-600" : "text-red-600"
            }`}
          >
            {gameState === "won" ? "Congratulations!" : "Game Over!"}
          </Text>

          {gameState === "won" && (
            <Text className="text-lg text-gray-600 mb-4">
              You completed the game in{" "}
              <Text className="font-bold">{time}</Text> seconds!
            </Text>
          )}

          <View
            onClick={onRestart}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-base font-semibold"
          >
            <Text>再玩一次</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
