import React from "react";
import { X } from "lucide-react";
import { View, Text, Navigator } from "@tarojs/components";

import { Game } from "../types";

interface GameModalProps {
  game: Game | null;
  onClose: () => void;
}

export const GameModal: React.FC<GameModalProps> = ({ game, onClose }) => {
  if (!game) return null;

  return (
    <View className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <View className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg">
        <View className="p-6">
          <View className="flex justify-between items-start mb-4">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              {game.title}
            </Text>
            <View
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </View>
          </View>

          <Text className="text-gray-600 dark:text-gray-300 mb-6">
            {game.description}
          </Text>

          <View className="space-y-4">
            <View className="flex flex-wrap gap-2">
              {game.categories.map((category) => (
                <Text
                  key={category}
                  className="px-3 py-1 text-sm bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full"
                >
                  {category}
                </Text>
              ))}
            </View>

            <View className="flex items-center justify-between">
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Difficulty: {game.difficulty}
              </Text>

              <Navigator
                url={`/pages/${game.id}/index`}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                <Text>Play Now</Text>
              </Navigator>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
