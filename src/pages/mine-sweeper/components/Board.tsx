import React, { useState } from "react";
import { Flag, Bomb } from "lucide-react";
import { View } from "@tarojs/components";

import { GameState, CellState } from "../types";

interface BoardProps {
  board: CellState[][];
  setBoard: React.Dispatch<React.SetStateAction<CellState[][]>>;
  settings: { width: number; height: number; mines: number };
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onWin: () => void;
  onLose: () => void;
}

export const Board: React.FC<BoardProps> = ({
  board,
  setBoard,
  settings,
  gameState,
  setGameState,
  onWin,
  onLose,
}) => {
  const initializeGame = (firstX: number, firstY: number) => {
    const newBoard = [...board];
    let minesPlaced = 0;

    // Place mines
    while (minesPlaced < settings.mines) {
      const x = Math.floor(Math.random() * settings.width);
      const y = Math.floor(Math.random() * settings.height);

      if (!newBoard[y][x].isMine && !(x === firstX && y === firstY)) {
        newBoard[y][x].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor mines
    for (let y = 0; y < settings.height; y++) {
      for (let x = 0; x < settings.width; x++) {
        if (!newBoard[y][x].isMine) {
          let count = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const ny = y + dy;
              const nx = x + dx;
              if (
                ny >= 0 &&
                ny < settings.height &&
                nx >= 0 &&
                nx < settings.width &&
                newBoard[ny][nx].isMine
              ) {
                count++;
              }
            }
          }
          newBoard[y][x].neighborMines = count;
        }
      }
    }

    setBoard(newBoard);
    revealCell(firstX, firstY);
  };

  const getNeighborCells = (x: number, y: number) => {
    const neighbors: { x: number; y: number }[] = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < settings.width && ny >= 0 && ny < settings.height) {
          neighbors.push({ x: nx, y: ny });
        }
      }
    }
    return neighbors;
  };

  const revealCell = (x: number, y: number) => {
    if (
      x < 0 ||
      x >= settings.width ||
      y < 0 ||
      y >= settings.height ||
      board[y][x].isRevealed ||
      board[y][x].isFlagged ||
      gameState === "won" ||
      gameState === "lost"
    ) {
      return;
    }

    const newBoard = [...board];
    newBoard[y][x] = { ...newBoard[y][x], isRevealed: true };

    if (newBoard[y][x].isMine) {
      revealAllMines();
      onLose();
      return;
    }

    if (newBoard[y][x].neighborMines === 0) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          revealCell(x + dx, y + dy);
        }
      }
    }

    setBoard(newBoard);
    checkWinCondition();
  };

  const chordReveal = (x: number, y: number) => {
    if (!board[y][x].isRevealed || gameState !== "playing") return;

    const neighbors = getNeighborCells(x, y);
    const flaggedCount = neighbors.reduce(
      (count, { x: nx, y: ny }) => count + (board[ny][nx].isFlagged ? 1 : 0),
      0
    );

    if (flaggedCount === board[y][x].neighborMines) {
      neighbors.forEach(({ x: nx, y: ny }) => {
        if (!board[ny][nx].isFlagged) {
          revealCell(nx, ny);
        }
      });
    }
  };

  const toggleFlag = (x: number, y: number) => {
    if (board[y][x].isRevealed || gameState === "won" || gameState === "lost") {
      if (board[y][x].isRevealed) {
        chordReveal(x, y);
      }
      return;
    }

    const newBoard = [...board];
    newBoard[y][x] = {
      ...newBoard[y][x],
      isFlagged: !newBoard[y][x].isFlagged,
    };
    setBoard(newBoard);
  };

  const revealAllMines = () => {
    const newBoard = board.map((row) =>
      row.map((cell) => (cell.isMine ? { ...cell, isRevealed: true } : cell))
    );
    setBoard(newBoard);
  };

  const checkWinCondition = () => {
    const allNonMinesRevealed = board.every((row) =>
      row.every((cell) => (cell.isMine ? !cell.isRevealed : cell.isRevealed))
    );

    if (allNonMinesRevealed) {
      onWin();
    }
  };

  const handleCellClick = (x: number, y: number) => {
    if (gameState === "waiting") {
      setGameState("playing");
      initializeGame(x, y);
    } else {
      revealCell(x, y);
    }
  };

  const getCellColor = (cell: CellState) => {
    if (gameState === "waiting" || !cell.isRevealed)
      return "bg-gray-200 hover:bg-gray-300";
    if (cell.isMine) return "bg-red-500";
    return "bg-white";
  };

  const getNumberColor = (count: number) => {
    const colors = [
      "text-transparent",
      "text-blue-600",
      "text-green-600",
      "text-red-600",
      "text-purple-600",
      "text-yellow-600",
      "text-pink-600",
      "text-gray-600",
      "text-gray-800",
    ];
    return colors[count];
  };

  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleTouchStart = (x, y) => {
    const timer = setTimeout(() => {
      toggleFlag(x, y);
    }, 500); // 500ms 长按触发标记

    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleTap = (x, y) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    handleCellClick(x, y);
  };

  return (
    <View
      className="grid gap-1"
      style={{
        gridTemplateColumns: `repeat(${settings.width}, minmax(0, 1fr))`,
      }}
    >
      {board.map((row, y) =>
        row.map((cell, x) => (
          <View
            key={`${x}-${y}`}
            className={`
              aspect-square flex items-center justify-center
              text-lg font-bold transition-colors duration-200
              ${getCellColor(cell)}
              ${cell.isRevealed ? "" : "hover:bg-gray-300"}
              border border-gray-300 rounded touch-target
            `}
            onClick={() => handleTap(x, y)}
            onTouchStart={() => handleTouchStart(x, y)}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
            {cell.isFlagged ? (
              <Flag className="w-4 h-4 text-red-500" />
            ) : cell.isRevealed ? (
              cell.isMine ? (
                <Bomb className="w-5 h-5 text-white" />
              ) : (
                <span className={getNumberColor(cell.neighborMines)}>
                  {cell.neighborMines || ""}
                </span>
              )
            ) : null}
          </View>
        ))
      )}
    </View>
  );
};
