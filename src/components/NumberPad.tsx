import React from 'react';
import clsx from 'clsx';
import { View, Text } from '@tarojs/components';

interface NumberPadProps {
  onNumberClick: (number: number) => void;
  onErase: () => void;
}

export const NumberPad: React.FC<NumberPadProps> = ({ onNumberClick, onErase }) => {
  return (
    <View className="grid grid-cols-5 gap-2 mt-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
        <View
          key={number}
          onClick={() => onNumberClick(number)}
          className={clsx(
            'aspect-square flex items-center justify-center',
            'text-lg font-semibold rounded-lg',
            'bg-gray-100 dark:bg-gray-700',
            'active:bg-gray-200 dark:active:bg-gray-600',
            'text-gray-900 dark:text-white',
            'transition-colors'
          )}
        >
          <Text>{number}</Text>
        </View>
      ))}
      <View
        onClick={onErase}
        className={clsx(
          'aspect-square flex items-center justify-center',
          'text-lg font-semibold rounded-lg',
          'bg-red-100 dark:bg-red-900/30',
          'active:bg-red-200 dark:active:bg-red-900/50',
          'text-red-600 dark:text-red-400',
          'transition-colors'
        )}
      >
        <Text>⌫</Text>
      </View>
    </View>
  );
};
