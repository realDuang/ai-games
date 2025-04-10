import { useState, useEffect, useCallback } from "react";
import {
  GameState,
  GameSettings,
  Direction,
  Point,
  INITIAL_SNAKE_LENGTH,
  SCORE_PER_APPLE,
} from "../types";

export function useGameLogic(settings: GameSettings) {
  const [gameState, setGameState] = useState<GameState>(() =>
    initializeGame(settings)
  );

  const moveSnake = useCallback(() => {
    if (gameState.isGameOver) return;

    setGameState((prevState) => {
      const newHead = getNextHead(
        prevState.snake[0],
        prevState.direction,
        settings.gridSize
      );

      // Validate new head position
      if (
        newHead.x < 0 ||
        newHead.x >= settings.gridSize ||
        newHead.y < 0 ||
        newHead.y >= settings.gridSize
      ) {
        return { ...prevState, isGameOver: true };
      }

      const newSnake = [newHead, ...prevState.snake.slice(0, -1)];

      // Check if snake ate an apple
      const appleEaten = prevState.apples.findIndex(
        (apple) => apple.x === newHead.x && apple.y === newHead.y
      );

      if (appleEaten !== -1) {
        // Snake grows
        newSnake.push(prevState.snake[prevState.snake.length - 1]);
        const newApples = [...prevState.apples];
        newApples[appleEaten] = generateApple(
          settings.gridSize,
          newSnake,
          prevState.apples
        );

        return {
          ...prevState,
          snake: newSnake,
          apples: newApples,
          score: prevState.score + SCORE_PER_APPLE,
        };
      }

      // Check for collision with self
      const collision = newSnake
        .slice(1)
        .some((segment) => segment.x === newHead.x && segment.y === newHead.y);

      if (collision) {
        return { ...prevState, isGameOver: true };
      }

      return { ...prevState, snake: newSnake };
    });
  }, [gameState.isGameOver, settings.gridSize]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 1000 / settings.speed);
    return () => clearInterval(interval);
  }, [moveSnake, settings.speed]);

  const changeDirection = useCallback((newDirection: Direction) => {
    setGameState((prevState) => {
      // Prevent 180-degree turns
      const opposites = {
        UP: "DOWN",
        DOWN: "UP",
        LEFT: "RIGHT",
        RIGHT: "LEFT",
      };

      if (opposites[newDirection] === prevState.direction) {
        return prevState;
      }

      return { ...prevState, direction: newDirection };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initializeGame(settings));
  }, [settings]);

  return {
    gameState,
    changeDirection,
    resetGame,
  };
}

function initializeGame(settings: GameSettings): GameState {
  const initialSnake = Array.from({ length: INITIAL_SNAKE_LENGTH }, (_, i) => ({
    x: Math.floor(settings.gridSize / 2),
    y: Math.floor(settings.gridSize / 2) + i,
  }));

  const initialApples = Array.from({ length: settings.appleCount }, () =>
    generateApple(settings.gridSize, initialSnake, [])
  );

  return {
    snake: initialSnake,
    apples: initialApples,
    direction: "UP",
    score: 0,
    isGameOver: false,
  };
}

function generateApple(
  gridSize: number,
  snake: Point[],
  existingApples: Point[]
): Point {
  let apple: Point;
  do {
    apple = {
      x: Math.floor(Math.random() * (gridSize - 1)),
      y: Math.floor(Math.random() * (gridSize - 1)),
    };
  } while (
    snake.some((segment) => segment.x === apple.x && segment.y === apple.y) ||
    existingApples.some(
      (existing) => existing.x === apple.x && existing.y === apple.y
    )
  );
  return apple;
}

function getNextHead(
  head: Point,
  direction: Direction,
  gridSize: number
): Point {
  const movements = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
  };

  const movement = movements[direction];
  const newX = head.x + movement.x;
  const newY = head.y + movement.y;

  // Return raw coordinates for boundary checking in moveSnake
  return { x: newX, y: newY };
}
