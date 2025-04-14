import { useState, useEffect } from "react";
import {
  Settings,
  Timer,
  Bomb,
  RefreshCw,
  ArrowLeft,
  History,
} from "lucide-react";
import { Navigator, View } from "@tarojs/components";

import { Board } from "../../components/Board";
import { SettingsModal } from "../../components/SettingsModal";
import { GameOverModal } from "../../components/GameOverModal";
import { HistoryModal } from "../../components/HistoryModal";
import { GameState, CellState, GameHistory } from "../../types";

export default function Minesweeper() {
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
  const [history, setHistory] = useState<GameHistory[]>(() => {
    const saved = localStorage.getItem("minesweeper_history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("minesweeper_history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    let timer: number;
    if (gameState === "playing") {
      timer = window.setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const resetGame = () => {
    setGameState("waiting");
    setTime(0);
    initializeBoard();
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
    addToHistory("won");
  };

  const handleGameLose = () => {
    setGameState("lost");
    addToHistory("lost");
  };

  const addToHistory = (result: "won" | "lost") => {
    const newEntry: GameHistory = {
      date: new Date().toISOString(),
      duration: time,
      result,
      boardSize: settings,
    };
    setHistory((prev) => [newEntry, ...prev].slice(0, 10)); // Keep only last 10 games
  };

  return (
    <View className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors">
      <View className="max-w-2xl mx-auto">
        <View className="mb-4 flex justify-between items-center">
          <Navigator
            url="/pages/home/index"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>回到首页</span>
          </Navigator>
          <View
            onClick={() => setShowHistory(true)}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </View>
        </View>

        <View className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <View className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Bomb className="w-6 h-6" />
              Minesweeper
            </span>
            <View
              onClick={() => setShowSettings(true)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </View>
          </View>

          <View className="flex justify-between items-center mb-4 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
            <View className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <Timer className="w-4 h-4" />
              <span className="font-mono text-lg">{time}s</span>
            </View>
            <View
              onClick={resetGame}
              className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </View>
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
        gameType="minesweeper"
        onSave={(newSettings) => {
          setSettings(newSettings);
          setShowSettings(false);
          resetGame();
        }}
      />

      <GameOverModal gameState={gameState} time={time} onRestart={resetGame} />

      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        gameType="minesweeper"
        history={history}
      />
    </View>
  );
}
