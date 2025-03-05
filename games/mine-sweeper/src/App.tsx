import React, { useState, useEffect } from 'react';
import { Settings, Timer, Bomb, RefreshCw, History } from 'lucide-react';
import { Board } from './components/Board';
import { SettingsModal } from './components/SettingsModal';
import { GameOverModal } from './components/GameOverModal';
import { HistoryModal } from './components/HistoryModal';
import { GameState, CellState, GameHistory } from './types';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [settings, setSettings] = useState({
    width: 10,
    height: 10,
    mines: 15
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [time, setTime] = useState(0);
  const [board, setBoard] = useState<CellState[][]>([]);
  const [history, setHistory] = useState<GameHistory[]>(() => {
    const savedHistory = localStorage.getItem('minesweeper-history');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // 保存历史记录到本地存储
  useEffect(() => {
    localStorage.setItem('minesweeper-history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    let timer: number;
    if (gameState === 'playing') {
      timer = window.setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  // 记录游戏结果
  useEffect(() => {
    if (gameState === 'won' || gameState === 'lost') {
      const newGameRecord: GameHistory = {
        id: uuidv4(),
        date: new Date().toLocaleString(),
        result: gameState,
        settings: { ...settings },
        time
      };
      setHistory(prev => [newGameRecord, ...prev]);
    }
  }, [gameState]);

  const resetGame = () => {
    setGameState('waiting');
    setTime(0);
    initializeBoard();
  };

  const initializeBoard = () => {
    const newBoard: CellState[][] = Array(settings.height).fill(null).map(() =>
      Array(settings.width).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );
    setBoard(newBoard);
  };

  useEffect(() => {
    initializeBoard();
  }, [settings]);

  const handleGameWin = () => {
    setGameState('won');
  };

  const handleGameLose = () => {
    setGameState('lost');
  };

  const clearHistory = () => {
    if (confirm('确定要清空所有历史记录吗？')) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Bomb className="w-6 h-6" />
              扫雷
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHistory(true)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                title="历史记录"
              >
                <History className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                title="设置"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4 bg-gray-50 p-2 rounded-lg">
            <div className="flex items-center gap-1.5 text-gray-700">
              <Timer className="w-4 h-4" />
              <span className="font-mono text-lg">{time}秒</span>
            </div>
            <button
              onClick={resetGame}
              className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
              title="重新开始"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <Board
            board={board}
            setBoard={setBoard}
            settings={settings}
            gameState={gameState}
            setGameState={setGameState}
            onWin={handleGameWin}
            onLose={handleGameLose}
          />
        </div>
      </div>

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

      <GameOverModal
        gameState={gameState}
        time={time}
        onRestart={resetGame}
      />
    </div>
  );
}

export default App;