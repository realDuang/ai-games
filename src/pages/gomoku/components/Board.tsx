import React, { useState, useEffect } from "react";
import { getSystemInfo } from "@tarojs/taro";
import { View } from "@tarojs/components";

import { Board as BoardType, Player } from "../types/game";

interface BoardProps {
  board: BoardType;
  onCellClick: (row: number, col: number) => void;
  currentPlayer: Player;
  disabled: boolean;
}

const Board: React.FC<BoardProps> = ({ board, onCellClick, disabled }) => {
  const [cellSize, setCellSize] = useState(30);

  // 动态计算棋盘格子大小
  useEffect(() => {
    const calcCellSize = async () => {
      try {
        const systemInfo = await getSystemInfo();
        const screenWidth = systemInfo.windowWidth;
        // 计算合适的格子尺寸，预留边距
        const availableWidth = screenWidth - 32; // 减去边距
        const idealCellSize = Math.floor(availableWidth / 15); // 15x15 棋盘

        setCellSize(idealCellSize);
      } catch (e) {
        console.error("获取屏幕信息失败", e);
      }
    };

    calcCellSize();
  }, []);

  return (
    <View className="inline-block bg-amber-100 p-2 rounded-lg shadow-lg">
      <View className="grid grid-cols-15 gap-0">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <View
              key={`${i}-${j}`}
              className={`
                relative border border-amber-700
                ${!cell && !disabled ? "active:bg-amber-200" : ""}
                ${i === 0 ? "border-t-2" : ""}
                ${i === board.length - 1 ? "border-b-2" : ""}
                ${j === 0 ? "border-l-2" : ""}
                ${j === row.length - 1 ? "border-r-2" : ""}
              `}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
              }}
              onClick={() => onCellClick(i, j)}
            >
              {cell && (
                <View
                  className={`
                    absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    rounded-full
                    ${
                      cell === "black"
                        ? "bg-black"
                        : "bg-white border border-black"
                    }
                  `}
                  style={{
                    width: `${cellSize * 0.8}px`,
                    height: `${cellSize * 0.8}px`,
                  }}
                />
              )}
            </View>
          ))
        )}
      </View>
    </View>
  );
};

export default Board;
