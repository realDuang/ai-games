import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Board from "../modules/gomoku/components/Board";
import GameControls from "../modules/gomoku/components/GameControls";
import {
  GameState,
  Player,
  GameMode,
  Difficulty,
} from "../modules/gomoku/types/game";
import {
  createEmptyBoard,
  checkWinner,
  isDraw,
  getAIMove,
} from "../modules/gomoku/logics";

function Gomoku() {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPlayer: "black",
    gameMode: "pvp",
    difficulty: "medium",
    winner: null,
    history: [],
    playerColor: "black",
  });

  const handleCellClick = (row: number, col: number) => {
    if (gameState.winner || gameState.board[row][col]) return;

    const newBoard = gameState.board.map((r) => [...r]);
    newBoard[row][col] = gameState.currentPlayer;

    const newHistory = [...gameState.history, gameState.board];
    const hasWinner = checkWinner(newBoard, row, col, gameState.currentPlayer);
    const isDrawGame = !hasWinner && isDraw(newBoard);

    setGameState((prev) => ({
      ...prev,
      board: newBoard,
      currentPlayer: prev.currentPlayer === "black" ? "white" : "black",
      winner: hasWinner ? prev.currentPlayer : isDrawGame ? "draw" : null,
      history: newHistory,
    }));
  };

  useEffect(() => {
    if (
      gameState.gameMode === "ai" &&
      !gameState.winner &&
      gameState.currentPlayer !== gameState.playerColor
    ) {
      const timer = setTimeout(async () => {
        const [row, col] = await getAIMove(
          gameState.board,
          gameState.difficulty,
          gameState.currentPlayer
        );
        handleCellClick(row, col);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.gameMode]);

  const handleNewGame = () => {
    setGameState((prev) => ({
      ...prev,
      board: createEmptyBoard(),
      currentPlayer: "black",
      winner: null,
      history: [],
    }));
  };

  const handleUndo = () => {
    if (gameState.history.length === 0) return;

    const newHistory = [...gameState.history];
    const previousBoard = newHistory.pop()!;

    setGameState((prev) => ({
      ...prev,
      board: previousBoard,
      currentPlayer: prev.currentPlayer === "black" ? "white" : "black",
      winner: null,
      history: newHistory,
    }));
  };

  const handleModeChange = (mode: GameMode) => {
    setGameState((prev) => ({
      ...prev,
      gameMode: mode,
      board: createEmptyBoard(),
      currentPlayer: "black",
      winner: null,
      history: [],
    }));
  };

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setGameState((prev) => ({
      ...prev,
      difficulty,
      board: createEmptyBoard(),
      currentPlayer: "black",
      winner: null,
      history: [],
    }));
  };

  const handleColorChange = (color: Player) => {
    setGameState((prev) => ({
      ...prev,
      playerColor: color,
      board: createEmptyBoard(),
      currentPlayer: "black",
      winner: null,
      history: [],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>回到首页</span>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-center mb-8">五子棋 Gomoku</h1>

        <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
          <div className="order-2 md:order-1">
            <Board
              board={gameState.board}
              onCellClick={handleCellClick}
              currentPlayer={gameState.currentPlayer}
              disabled={
                !!gameState.winner ||
                (gameState.gameMode === "ai" &&
                  gameState.currentPlayer !== gameState.playerColor)
              }
            />
          </div>

          <div className="order-1 md:order-2">
            <GameControls
              onNewGame={handleNewGame}
              onUndo={handleUndo}
              onModeChange={handleModeChange}
              onDifficultyChange={handleDifficultyChange}
              onColorChange={handleColorChange}
              gameMode={gameState.gameMode}
              difficulty={gameState.difficulty}
              playerColor={gameState.playerColor}
              canUndo={gameState.history.length > 0}
            />

            <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">Game Status</h2>
              {gameState.winner ? (
                <p className="text-lg">
                  {gameState.winner === "draw"
                    ? "It's a draw!"
                    : `${
                        gameState.winner === "black" ? "Black" : "White"
                      } wins!`}
                </p>
              ) : (
                <p className="text-lg">
                  Current Player:{" "}
                  <span className="font-semibold">
                    {gameState.currentPlayer === "black" ? "Black" : "White"}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gomoku;
