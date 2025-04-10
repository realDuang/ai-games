import React from "react";
import { History, Trash2 } from "lucide-react";
import { View, ScrollView, Text } from "@tarojs/components";

import { GameRecord, Theme, THEMES } from "../types";

interface GameHistoryProps {
  records: GameRecord[];
  onClose: () => void;
  onClear: () => void;
  theme: Theme;
}

export function GameHistory({
  records,
  onClose,
  onClear,
  theme,
}: GameHistoryProps) {
  const themeColors = THEMES[theme];

  return (
    <View
      className={`fixed inset-0 ${themeColors.modalOverlay} flex items-center justify-center z-50 p-4`}
    >
      <View
        className={`${themeColors.modal} p-6 md:p-8 rounded-lg w-full max-w-md max-h-[80vh] flex flex-col transition-colors duration-300`}
      >
        <View className="flex items-center justify-between mb-6">
          <View className="flex items-center gap-3">
            <History className="w-5 h-5 md:w-6 md:h-6 opacity-80" />
            <Text className="text-xl md:text-2xl font-bold">历史记录</Text>
          </View>
          <View
            onClick={onClose}
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            ✕
          </View>
        </View>

        <ScrollView
          className="flex-1 space-y-3 min-h-[300px]"
          scrollY
          style={{ height: "300px" }}
        >
          {records.length === 0 ? (
            <Text className="opacity-60 text-center py-8 text-sm md:text-base">
              暂无游戏记录
            </Text>
          ) : (
            records.map((record, index) => (
              <View
                key={index}
                className={`${themeColors.button} p-4 rounded-lg mb-3`}
              >
                <View className="flex justify-between items-center mb-2">
                  <Text className="text-lg md:text-xl font-semibold">
                    得分: {record.score}
                  </Text>
                  <Text className="opacity-60 text-xs md:text-sm">
                    {record.date}
                  </Text>
                </View>
                <View className="opacity-80 text-sm md:text-base">
                  <Text>
                    设置: {record.settings.gridSize}x{record.settings.gridSize}{" "}
                    格子, 速度 {record.settings.speed},
                    {record.settings.appleCount} 个苹果
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {records.length > 0 && (
          <View className="mt-6 pt-4 border-t border-opacity-20">
            <View
              onClick={onClear}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition-colors text-sm md:text-base"
            >
              <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
              <Text>清除所有记录</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
