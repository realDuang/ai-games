import { useState, useEffect } from "react";
import { View, Text, Navigator } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { ArrowLeft, History, RefreshCw, Timer, Settings } from "lucide-react";

import { SudokuDifficulty, SudokuCell, SudokuHistory } from "../../types";
import { SudokuBoard } from "../../components/SudokuBoard";
import { NumberPad } from "../../components/NumberPad";
import { generatePuzzle, isValid } from "../../utils/sudoku";
import { SettingsModal } from "../../components/SettingsModal";
import { HistoryModal } from "../../components/HistoryModal";
import { GameOverModal } from "../../components/GameOverModal";

export default function Sudoku() {
  const [settings, setSettings] = useState<{ difficulty: SudokuDifficulty }>({
    difficulty: "medium",
  });
  const [showSettings, setShowSettings] = useState(false);
  const [time, setTime] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [board, setBoard] = useState<SudokuCell[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [gameState, setGameState] = useState<"playing" | "won">("playing");
  const [history, setHistory] = useState<SudokuHistory[]>(() => {
    const saved = Taro.getStorageSync("sudoku_history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    Taro.setStorageSync("sudoku_history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (gameState === "playing") {
      timer = setTimeout(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [gameState, time]);

  const initializeGame = () => {
    const puzzle = generatePuzzle(settings.difficulty);
    const newBoard: SudokuCell[][] = puzzle.map((row) =>
      row.map((value) => ({
        value,
        fixed: value !== 0,
        notes: [],
        error: false,
      }))
    );
    setBoard(newBoard);
    setTime(0);
    setGameState("playing");
    setSelectedCell(null);
  };

  useEffect(() => {
    initializeGame();
  }, [settings.difficulty]);

  const handleCellClick = (row: number, col: number) => {
    if (board[row][col].fixed || gameState === "won") return;
    setSelectedCell({ row, col });
  };

  const handleNumberClick = (number: number) => {
    if (!selectedCell || gameState === "won") return;
    const { row, col } = selectedCell;

    if (board[row][col].fixed) return;

    const newBoard = [...board];
    const currentValue = board[row][col].value;

    if (currentValue === number) {
      newBoard[row][col] = {
        ...newBoard[row][col],
        value: 0,
        error: false,
      };
    } else {
      const isValidMove = isValid(
        board.map((currRow) => currRow.map((cell) => cell.value)),
        row,
        col,
        number
      );

      newBoard[row][col] = {
        ...newBoard[row][col],
        value: number,
        error: !isValidMove,
      };
    }

    setBoard(newBoard);
    checkWinCondition(newBoard);
  };

  const handleErase = () => {
    if (!selectedCell || gameState === "won") return;
    const { row, col } = selectedCell;

    if (board[row][col].fixed) return;

    const newBoard = [...board];
    newBoard[row][col] = {
      ...newBoard[row][col],
      value: 0,
      error: false,
    };
    setBoard(newBoard);
  };

  const checkWinCondition = (currentBoard: SudokuCell[][]) => {
    const isComplete = currentBoard.every((row) =>
      row.every((cell) => cell.value !== 0 && !cell.error)
    );

    if (isComplete) {
      setGameState("won");
      const newHistory: SudokuHistory = {
        date: new Date().toISOString(),
        duration: time,
        difficulty: settings.difficulty,
      };
      setHistory((prev) => [newHistory, ...prev].slice(0, 10));
    }
  };

  return (
    <View className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors">
      <View className="max-w-md mx-auto">
        <View className="mb-4 flex justify-between items-center">
          <Navigator
            url="/pages/home/index"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <Text>回到首页</Text>
          </Navigator>
          <View
            onClick={() => setShowHistory(true)}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 active:text-gray-800 dark:active:text-gray-100"
          >
            <History className="w-4 h-4" />
            <Text className="hidden sm:inline">历史</Text>
          </View>
        </View>

        <View className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <View className="flex justify-between items-center mb-4">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              数独
            </Text>
            <View className="flex items-center gap-2">
              <View
                onClick={() => setShowSettings(true)}
                className="p-1.5 rounded-lg active:bg-gray-100 dark:active:bg-gray-700 transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </View>
              <View
                onClick={initializeGame}
                className="p-1.5 rounded-lg active:bg-gray-100 dark:active:bg-gray-700 transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </View>
            </View>
          </View>

          <View className="flex justify-between items-center mb-4 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
            <View className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <Timer className="w-4 h-4" />
              <Text className="font-mono text-lg">{time}秒</Text>
            </View>
          </View>

          <SudokuBoard
            board={board}
            onCellClick={handleCellClick}
            selectedCell={selectedCell}
          />

          <NumberPad onNumberClick={handleNumberClick} onErase={handleErase} />
        </View>
      </View>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        gameType="sudoku"
        onSave={(newSettings) => {
          setSettings(newSettings);
          setShowSettings(false);
          initializeGame();
        }}
      />

      <GameOverModal
        gameState={gameState}
        time={time}
        onRestart={initializeGame}
      />

      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        gameType="sudoku"
      />
    </View>
  );
}
