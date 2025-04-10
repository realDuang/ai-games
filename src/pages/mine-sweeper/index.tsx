import { useState, useEffect } from "react";
import {
  Settings,
  Timer,
  Bomb,
  RefreshCw,
  History,
  ArrowLeft,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { showModal, setStorage, getStorage } from "@tarojs/taro";
import { Navigator, View } from "@tarojs/components";

import { Board } from "./components/Board";
import { SettingsModal } from "./components/SettingsModal";
import { GameOverModal } from "./components/GameOverModal";
import { HistoryModal } from "./components/HistoryModal";
import { GameState, CellState, GameHistory } from "./types";

function MineSweeper() {
  const [settings, setSettings] = useState({
    width: 10,
    height: 10,
    mines: 15,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [time, setTime] = useState(0);
  const [board, setBoard] = useState<CellState[][]>([]);
  const [history, setHistory] = useState<GameHistory[]>([]);

  useEffect(() => {
    getStorage({
      key: "minesweeper-history",
      success: (res) => {
        if (res.data) {
          try {
            const parsedData = JSON.parse(res.data);
            setHistory(parsedData);
          } catch (e) {
            console.error("解析历史记录失败", e);
          }
        }
      },
      fail: () => {
        // 获取失败时保持空数组
        console.log("未找到历史记录，使用空数组");
      },
    });
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      setStorage({
        key: "minesweeper-history",
        data: JSON.stringify(history),
      });
    }
  }, [history]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>; // 修改类型定义
    if (gameState === "playing") {
      timer = setTimeout(function tick() {
        setTime((prev) => prev + 1);
        timer = setTimeout(tick, 1000);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [gameState]);

  useEffect(() => {
    if (gameState === "won" || gameState === "lost") {
      const newGameRecord: GameHistory = {
        id: uuidv4(),
        date: new Date().toLocaleString(),
        result: gameState,
        settings: { ...settings },
        time,
      };
      setHistory((prev) => [newGameRecord, ...prev]);
    }
  }, [gameState]);

  const resetGame = () => {
    setGameState("waiting");
    setTime(0);
    // 确保完全重新初始化棋盘，清除所有状态
    const newBoard: CellState[][] = Array(settings.height)
      .fill(null)
      .map(() =>
        Array(settings.width)
          .fill(null)
          .map(() => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            neighborMines: 0,
          }))
      );
    setBoard(newBoard);
  };

  const initializeBoard = () => {
    const newBoard: CellState[][] = Array(settings.height)
      .fill(null)
      .map(() =>
        Array(settings.width)
          .fill(null)
          .map(() => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            neighborMines: 0,
          }))
      );
    setBoard(newBoard);
  };

  useEffect(() => {
    initializeBoard();
  }, [settings]);

  const handleGameWin = () => {
    setGameState("won");
  };

  const handleGameLose = () => {
    setGameState("lost");
  };

  const clearHistory = () => {
    showModal({
      title: "确认清空",
      content: "确定要清空所有历史记录吗？",
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          setHistory([]);
        }
      },
    });
  };

  return (
    <View className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <View className="max-w-2xl mx-auto">
        <View className="mb-4">
          <Navigator
            url="/pages/home/index"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>回到首页</span>
          </Navigator>
        </View>
        <View className="bg-white rounded-xl shadow-lg p-4">
          <View className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Bomb className="w-6 h-6" />
              扫雷
            </h1>
            <View className="flex gap-2">
              <button
                onClick={() => setShowHistory(true)}
                className="p-1.5 rounded-lg .active:bg-gray-100 transition-colors"
                title="历史记录"
              >
                <History className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-1.5 rounded-lg .active:bg-gray-100 transition-colors"
                title="设置"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </View>
          </View>

          <View className="flex justify-between items-center mb-4 bg-gray-50 p-2 rounded-lg">
            <View className="flex items-center gap-1.5 text-gray-700">
              <Timer className="w-4 h-4" />
              <span className="font-mono text-lg">{time}秒</span>
            </View>
            <button
              onClick={() => resetGame()}
              className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
              title="重新开始"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
          </View>

          <Board
            board={board}
            setBoard={setBoard}
            settings={settings}
            gameState={gameState}
            setGameState={setGameState}
            onWin={handleGameWin}
            onLose={handleGameLose}
          />
        </View>
      </View>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSave={(newSettings) => {
          setSettings(newSettings);
          setShowSettings(false);
          resetGame();
        }}
      />

      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        onClearHistory={clearHistory}
      />

      <GameOverModal state={gameState} onRestart={resetGame} />
    </View>
  );
}

export default MineSweeper;
