import React, { useEffect, useState } from "react";
import { Settings, History, Sun, Moon, ArrowLeft } from "lucide-react";
import { View, Navigator } from "@tarojs/components";
import { showModal, setStorage, getStorage } from "@tarojs/taro";

import { GameBoard } from "./components/GameBoard";
import { GameControls } from "./components/GameControls";
import { GameHistory } from "./components/GameHistory";
import { GameOverModal } from "./components/GameOverModal";
import { TouchControls } from "./components/TouchControls";
import { useGameLogic } from "./hooks/useGameLogic";
import { useTheme } from "./hooks/useTheme";
import { GameSettings, GameRecord, Direction, THEMES } from "./types";

function App() {
  const { theme, toggleTheme } = useTheme();
  const themeColors = THEMES[theme];

  const [settings, setSettings] = useState<GameSettings>({
    speed: 5,
    gridSize: 20,
    appleCount: 3,
  });

  const [records, setRecords] = useState<GameRecord[]>(() => {
    // 初始状态会在 useEffect 中加载，这里返回空数组
    return [];
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const { gameState, changeDirection, resetGame } = useGameLogic(settings);

  // 使用 Taro 的存储 API 加载历史记录
  useEffect(() => {
    getStorage({
      key: "snakeGameRecords",
      success: (res) => {
        if (res.data) {
          try {
            const parsedData = JSON.parse(res.data);
            setRecords(parsedData);
          } catch (e) {
            console.error("解析历史记录失败", e);
          }
        }
      },
      fail: () => {
        console.log("未找到历史记录，使用空数组");
      },
    });
  }, []);

  useEffect(() => {
    if (gameState.isGameOver) {
      const newRecord: GameRecord = {
        date: new Date().toLocaleString(),
        score: gameState.score,
        settings: settings,
      };
      const updatedRecords = [newRecord, ...records].slice(0, 10);
      setRecords(updatedRecords);

      // 使用 Taro 的存储 API 保存历史记录
      setStorage({
        key: "snakeGameRecords",
        data: JSON.stringify(updatedRecords),
      });
    }
  }, [gameState.isGameOver]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const keyDirections: { [key: string]: Direction } = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
        w: "UP",
        s: "DOWN",
        a: "LEFT",
        d: "RIGHT",
      };

      const direction = keyDirections[e.key.toLowerCase()];
      if (direction) {
        changeDirection(direction);
      }
    };

    // 小程序环境下，键盘事件可能不适用，但保留此代码以便在 H5 模式下使用
    if (typeof window !== 'undefined') {
      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
    return undefined;
  }, [changeDirection]);

  const handleSettingsChange = (newSettings: GameSettings) => {
    setSettings(newSettings);
    resetGame();
  };

  const clearHistory = () => {
    // 使用 Taro 的弹窗确认
    showModal({
      title: "确认清空",
      content: "确定要清空所有历史记录吗？",
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          setRecords([]);
          setStorage({
            key: "snakeGameRecords",
            data: "[]",
          });
          setShowHistory(false);
        }
      },
    });
  };

  return (
    <View
      className={`min-h-screen ${themeColors.background} ${themeColors.text} p-4 md:p-8 transition-colors duration-300`}
    >
      <View className="max-w-4xl mx-auto">
        <View className="mb-4">
          <Navigator
            url="/pages/home/index"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>回到首页</span>
          </Navigator>
        </View>

        <View className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
          <View className="text-3xl md:text-4xl font-bold text-center md:text-left">
            贪吃蛇
          </View>
          <View className="flex items-center justify-center md:justify-end gap-3">
            <View
              onClick={toggleTheme}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 ${themeColors.button} rounded-lg transition-colors text-sm md:text-base`}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <Moon className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </View>
            <View
              onClick={() => setShowSettings(true)}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 ${themeColors.button} rounded-lg transition-colors text-sm md:text-base`}
            >
              <Settings className="w-4 h-4 md:w-5 md:h-5" />
              <View>设置</View>
            </View>
            <View
              onClick={() => setShowHistory(true)}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 ${themeColors.button} rounded-lg transition-colors text-sm md:text-base`}
            >
              <History className="w-4 h-4 md:w-5 md:h-5" />
              <View>历史记录</View>
            </View>
          </View>
        </View>

        <View className="text-center mb-4">
          <View className="text-xl md:text-2xl text-opacity-80">
            得分: <View className="font-bold" style={{ display: 'inline' }}>{gameState.score}</View>
          </View>
        </View>

        <View className="flex justify-center">
          <GameBoard gameState={gameState} settings={settings} theme={theme} />
        </View>

        <TouchControls onDirectionChange={changeDirection} theme={theme} />

        {showSettings && (
          <GameControls
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onRestart={resetGame}
            onClose={() => setShowSettings(false)}
            theme={theme}
          />
        )}

        {showHistory && (
          <GameHistory
            records={records}
            onClose={() => setShowHistory(false)}
            onClear={clearHistory}
            theme={theme}
          />
        )}

        {gameState.isGameOver && (
          <GameOverModal
            score={gameState.score}
            onRestart={resetGame}
            theme={theme}
          />
        )}
      </View>
    </View>
  );
}

export default App;
