import React, { useState } from "react";
import { X } from "lucide-react";
import { View } from "@tarojs/components";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    difficulty?: "easy" | "medium" | "hard";
    width?: number;
    height?: number;
    mines?: number;
  };
  gameType: "minesweeper" | "sudoku";
  onSave: (settings: any) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  gameType,
  onSave,
}) => {
  const [newSettings, setNewSettings] = useState(settings);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameType === "minesweeper") {
      const maxMines = 10 * 10 - 1;
      const validatedSettings = {
        width: 10,
        height: 10,
        mines: Math.min(newSettings.mines || 0, maxMines),
      };
      onSave(validatedSettings);
    } else {
      onSave({ difficulty: newSettings.difficulty });
    }
  };

  return (
    <View className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <View className="bg-white dark:bg-gray-800 rounded-lg p-5 w-full max-w-sm mx-4">
        <View className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Game Settings
          </h2>
          <View
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </View>
        </View>

        <form onSubmit={handleSubmit}>
          {gameType === "minesweeper" ? (
            <View>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mines (1-99)
              </label>
              <input
                type="number"
                min="1"
                max="99"
                value={newSettings.mines}
                onChange={(e) =>
                  setNewSettings({
                    ...newSettings,
                    mines: Math.max(
                      1,
                      Math.min(99, parseInt(e.target.value) || 1)
                    ),
                  })
                }
                className="w-full px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
              />
            </View>
          ) : (
            <View>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Difficulty
              </label>
              <select
                value={newSettings.difficulty}
                onChange={(e) =>
                  setNewSettings({
                    ...newSettings,
                    difficulty: e.target.value as "easy" | "medium" | "hard",
                  })
                }
                className="w-full px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </View>
          )}

          <View className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Save Changes
            </button>
          </View>
        </form>
      </View>
    </View>
  );
};
