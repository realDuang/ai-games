import React, { useEffect, useState } from 'react';
import { GameBoard } from './components/GameBoard';
import { GameControls } from './components/GameControls';
import { GameHistory } from './components/GameHistory';
import { GameOverModal } from './components/GameOverModal';
import { useGameLogic } from './hooks/useGameLogic';
import { GameSettings, GameRecord, Direction } from './types';

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

  const { gameState, changeDirection, resetGame } = useGameLogic(settings);

  useEffect(() => {
    if (gameState.isGameOver) {
      const newRecord: GameRecord = {
        date: new Date().toLocaleString(),
        score: gameState.score,
        settings: settings
      };
      const updatedRecords = [newRecord, ...records].slice(0, 10); // Keep only top 10 records
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">贪吃蛇</h1>
          <p className="text-gray-400">当前得分: {gameState.score}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex justify-center">
              <GameBoard gameState={gameState} settings={settings} />
            </div>
          </div>

          <div>
            <GameControls
              settings={settings}
              onSettingsChange={handleSettingsChange}
              onRestart={resetGame}
            />
            <GameHistory records={records} />
          </div>
        </div>

        {gameState.isGameOver && (
          <GameOverModal score={gameState.score} onRestart={resetGame} />
        )}
      </div>
    </div>
  );
}

export default App;