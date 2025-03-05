import React, { useState, useEffect } from 'react';
import { Settings, Timer, Bomb, RefreshCw } from 'lucide-react';
import { Board } from './components/Board';
import { SettingsModal } from './components/SettingsModal';
import { GameOverModal } from './components/GameOverModal';
import { GameState, CellState } from './types';

function App() {
  const [settings, setSettings] = useState({
    width: 10,
    height: 10,
    mines: 15
  });
  const [showSettings, setShowSettings] = useState(false);
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [time, setTime] = useState(0);
  const [board, setBoard] = useState<CellState[][]>([]);

  useEffect(() => {
    let timer: number;
    if (gameState === 'playing') {
      timer = window.setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Bomb className="w-6 h-6" />
              Minesweeper
            </h1>
            <button
              onClick={() => setShowSettings(true)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex justify-between items-center mb-4 bg-gray-50 p-2 rounded-lg">
            <div className="flex items-center gap-1.5 text-gray-700">
              <Timer className="w-4 h-4" />
              <span className="font-mono text-lg">{time}s</span>
            </div>
            <button
              onClick={resetGame}
              className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
              title="Reset Game"
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

      <GameOverModal
        gameState={gameState}
        time={time}
        onRestart={resetGame}
      />
    </div>
  );
}

export default App;