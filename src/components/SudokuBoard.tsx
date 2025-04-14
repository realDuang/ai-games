import React from 'react';
import clsx from 'clsx';
import { View } from '@tarojs/components';

import { SudokuCell } from '../types';

interface SudokuBoardProps {
  board: SudokuCell[][];
  onCellClick: (row: number, col: number) => void;
  selectedCell: { row: number; col: number } | null;
}

export const SudokuBoard: React.FC<SudokuBoardProps> = ({
  board,
  onCellClick,
  selectedCell,
}) => {
  return (
    <View className="grid grid-cols-9 gap-[1px] bg-gray-300 dark:bg-gray-600 p-[1px] rounded-lg">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <View
            key={`${rowIndex}-${colIndex}`}
            onClick={() => onCellClick(rowIndex, colIndex)}
            className={clsx(
              'aspect-square flex items-center justify-center text-lg sm:text-xl font-semibold transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset',
              selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                ? 'bg-indigo-100 dark:bg-indigo-900'
                : 'bg-white dark:bg-gray-800',
              cell.fixed
                ? 'text-gray-900 dark:text-white'
                : 'text-indigo-600 dark:text-indigo-400',
              cell.error && 'text-red-600 dark:text-red-400',
              // Add borders for 3x3 grid sections
              rowIndex % 3 === 0 && 'border-t-2 border-gray-400 dark:border-gray-500',
              colIndex % 3 === 0 && 'border-l-2 border-gray-400 dark:border-gray-500',
              rowIndex === 8 && 'border-b-2 border-gray-400 dark:border-gray-500',
              colIndex === 8 && 'border-r-2 border-gray-400 dark:border-gray-500'
            )}
          >
            {cell.value !== 0 ? cell.value : ''}
          </View>
        ))
      )}
    </View>
  );
};
