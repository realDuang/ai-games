import React, { useEffect, useState } from 'react';
import { GameBoard } from './components/GameBoard';
import { GameControls } from './components/GameControls';
import { GameHistory } from './components/GameHistory';
import { GameOverModal } from './components/GameOverModal';
import { useGameLogic } from './hooks/useGameLogic';
import { GameSettings, GameRecord, Direction } from './types';
import { Settings, History } from 'lucide-react';

function App() {
  const [settings, setSettings] = useState<GameSettings>({
    speed: 5,
    gridSize: 20,
    appleCount: 3
  });

  const [records, setRecords] = useState<GameRecord[]>(() => {
    const saved = localStorage.getItem('snakeGameRecords');
    return saved ? JSON.parse(saved) : [];
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const { gameState, changeDirection, resetGame } = useGameLogic(settings);

  useEffect(() => {
    if (gameState.isGameOver) {
      const newRecord: GameRecord = {
        date: new Date().toLocaleString(),
        score: gameState.score,
        settings: settings
      };
      const updatedRecords = [newRecord, ...records].slice(0, 10);
      setRecords(updatedRecords);
      localStorage.setItem('snakeGameRecords', JSON.stringify(updatedRecords));
    }
  }, [gameState.isGameOver]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const keyDirections: { [key: string]: Direction } = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
        w: 'UP',
        s: 'DOWN',
        a: 'LEFT',
        d: 'RIGHT'
      };

      const direction = keyDirections[e.key.toLowerCase()];
      if (direction) {
        changeDirection(direction);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [changeDirection]);

  const handleSettingsChange = (newSettings: GameSettings) => {
    setSettings(newSettings);
    resetGame();
  };

  const clearHistory = () => {
    setRecords([]);
    localStorage.removeItem('snakeGameRecords');
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">贪吃蛇</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>设置</span>
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <History className="w-5 h-5" />
              <span>历史记录</span>
            </button>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-2xl text-gray-300">得分: <span className="font-bold text-white">{gameState.score}</span></p>
        </div>

        <div className="flex justify-center">
          <GameBoard gameState={gameState} settings={settings} />
        </div>

        {showSettings && (
          <GameControls
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onRestart={resetGame}
            onClose={() => setShowSettings(false)}
          />
        )}

        {showHistory && (
          <GameHistory
            records={records}
            onClose={() => setShowHistory(false)}
            onClear={clearHistory}
          />
        )}

        {gameState.isGameOver && (
          <GameOverModal score={gameState.score} onRestart={resetGame} />
        )}
      </div>
    </div>
  );
}

export default App;