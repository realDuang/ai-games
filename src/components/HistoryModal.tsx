import React from 'react';
import { X, Trophy, Skull } from 'lucide-react';
import { View } from "@tarojs/components";
import { GameHistory, SudokuHistory, SnakeHistory } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: (GameHistory | SudokuHistory | SnakeHistory)[];
  gameType: 'minesweeper' | 'sudoku' | 'snake';
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  gameType
}) => {
  if (!isOpen) return null;

  return (
    <View className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <View className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg">
        <View className="p-6">
          <View className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Game History</h2>
            <View
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </View>
          </View>

          <View className="space-y-3">
            {history.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No games played yet
              </p>
            ) : (
              history.map((game, index) => {
                if (gameType === 'snake') {
                  const snakeGame = game as SnakeHistory;
                  return (
                    <View
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <View className="flex items-center gap-3">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <View>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {new Date(snakeGame.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Speed: {snakeGame.speed}, Apples: {snakeGame.appleCount}
                          </p>
                        </View>
                      </View>
                      <View className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Score: {snakeGame.score}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {snakeGame.duration}s
                        </p>
                      </View>
                    </View>
                  );
                } else if (gameType === 'sudoku') {
                  const sudokuGame = game as SudokuHistory;
                  return (
                    <View
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <View className="flex items-center gap-3">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <View>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {new Date(sudokuGame.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Difficulty: {sudokuGame.difficulty}
                          </p>
                        </View>
                      </View>
                      <span className="text-sm font-mono text-gray-600 dark:text-gray-300">
                        {sudokuGame.duration}s
                      </span>
                    </View>
                  );
                } else {
                  const minesweeperGame = game as GameHistory;
                  return (
                    <View
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <View className="flex items-center gap-3">
                        {minesweeperGame.result === 'won' ? (
                          <Trophy className="w-5 h-5 text-yellow-500" />
                        ) : (
                          <Skull className="w-5 h-5 text-red-500" />
                        )}
                        <View>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {new Date(minesweeperGame.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {minesweeperGame.boardSize.width}x{minesweeperGame.boardSize.height} ({minesweeperGame.boardSize.mines} mines)
                          </p>
                        </View>
                      </View>
                      <span className="text-sm font-mono text-gray-600 dark:text-gray-300">
                        {minesweeperGame.duration}s
                      </span>
                    </View>
                  );
                }
              })
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
