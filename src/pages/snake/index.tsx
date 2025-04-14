import { useState, useEffect, useCallback, useRef } from "react";
import {
  ArrowLeft,
  History,
  Settings,
  RefreshCcw,
  Timer,
  Trophy,
} from "lucide-react";
import { Navigator, Text, View } from "@tarojs/components";

import { SettingsModal } from "../../components/SnakeSettings";
import { HistoryModal } from "../../components/HistoryModal";
import { GameOverModal } from "../../components/GameOverModal";
import { Position, SnakeState, SnakeSettings, SnakeHistory } from "../../types";

const GRID_SIZE = 20;
const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

const SPEED_MAP = {
  slow: 200,
  medium: 120,
  fast: 80,
};

export default function Snake() {
  const [gameState, setGameState] = useState<SnakeState>({
    direction: "right",
    body: INITIAL_SNAKE,
    apples: [],
    score: 0,
    gameStatus: "waiting",
  });

  const [settings, setSettings] = useState<SnakeSettings>({
    speed: "medium",
    appleCount: 3,
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [time, setTime] = useState(0);
  const [history, setHistory] = useState<SnakeHistory[]>(() => {
    const saved = localStorage.getItem("snake_history");
    return saved ? JSON.parse(saved) : [];
  });

  const gameLoopRef = useRef<number>();
  const directionRef = useRef(gameState.direction);

  useEffect(() => {
    localStorage.setItem("snake_history", JSON.stringify(history));
  }, [history]);

  const generateApples = useCallback((count: number, snake: Position[]) => {
    const apples: Position[] = [];
    while (apples.length < count) {
      const apple = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };

      const isOnSnake = snake.some(
        (segment) => segment.x === apple.x && segment.y === apple.y
      );
      const isOnApple = apples.some((a) => a.x === apple.x && a.y === apple.y);

      if (!isOnSnake && !isOnApple) {
        apples.push(apple);
      }
    }
    return apples;
  }, []);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    const direction = directionRef.current;
    const newDirection = (() => {
      switch (e.key) {
        case "ArrowUp":
          return direction !== "down" ? "up" : direction;
        case "ArrowDown":
          return direction !== "up" ? "down" : direction;
        case "ArrowLeft":
          return direction !== "right" ? "left" : direction;
        case "ArrowRight":
          return direction !== "left" ? "right" : direction;
        default:
          return direction;
      }
    })();
    directionRef.current = newDirection;
  }, []);

  const moveSnake = useCallback(() => {
    setGameState((prev) => {
      if (prev.gameStatus !== "playing") return prev;

      const newHead = { ...prev.body[0] };
      switch (directionRef.current) {
        case "up":
          newHead.y = (newHead.y - 1 + GRID_SIZE) % GRID_SIZE;
          break;
        case "down":
          newHead.y = (newHead.y + 1) % GRID_SIZE;
          break;
        case "left":
          newHead.x = (newHead.x - 1 + GRID_SIZE) % GRID_SIZE;
          break;
        case "right":
          newHead.x = (newHead.x + 1) % GRID_SIZE;
          break;
      }

      // Check collision with self
      const collision = prev.body.some(
        (segment) => segment.x === newHead.x && segment.y === newHead.y
      );

      if (collision) {
        return { ...prev, gameStatus: "lost" as const };
      }

      const newBody = [newHead, ...prev.body];
      const appleEaten = prev.apples.findIndex(
        (apple) => apple.x === newHead.x && apple.y === newHead.y
      );

      if (appleEaten >= 0) {
        const newApples = [...prev.apples];
        newApples.splice(appleEaten, 1);
        newApples.push(...generateApples(1, newBody));

        return {
          ...prev,
          body: newBody,
          apples: newApples,
          score: prev.score + 10,
        };
      }

      newBody.pop();
      return { ...prev, body: newBody };
    });
  }, [generateApples]);

  useEffect(() => {
    if (gameState.gameStatus === "playing") {
      window.addEventListener("keydown", handleKeyPress);
      gameLoopRef.current = window.setInterval(
        moveSnake,
        SPEED_MAP[settings.speed]
      );
    }

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.gameStatus, handleKeyPress, moveSnake, settings.speed]);

  useEffect(() => {
    let timer: number;
    if (gameState.gameStatus === "playing") {
      timer = window.setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState.gameStatus]);

  useEffect(() => {
    if (gameState.gameStatus === "lost") {
      const newHistory: SnakeHistory = {
        date: new Date().toISOString(),
        duration: time,
        score: gameState.score,
        speed: settings.speed,
        appleCount: settings.appleCount,
      };
      setHistory((prev) => [newHistory, ...prev.slice(0, 9)]);
    }
  }, [
    gameState.gameStatus,
    gameState.score,
    settings.appleCount,
    settings.speed,
    time,
  ]);

  const startGame = useCallback(() => {
    setGameState({
      direction: "right",
      body: INITIAL_SNAKE,
      apples: generateApples(settings.appleCount, INITIAL_SNAKE),
      score: 0,
      gameStatus: "playing",
    });
    setTime(0);
    directionRef.current = "right";
  }, [generateApples, settings.appleCount]);

  return (
    <View className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors">
      <View className="max-w-2xl mx-auto">
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
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
          >
            <History className="w-4 h-4" />
            <Text className="hidden sm:inline">History</Text>
          </View>
        </View>

        <View className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <View className="flex justify-between items-center mb-4">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              Snake
            </Text>
            <View className="flex items-center gap-2">
              <View
                onClick={() => setShowSettings(true)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </View>
              <View
                onClick={startGame}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <RefreshCcw className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </View>
            </View>
          </View>

          <View className="flex justify-between items-center mb-4 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
            <View className="flex items-center gap-4">
              <View className="flex items-center gap-1.5">
                <Timer className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                <span className="font-mono text-lg text-gray-700 dark:text-gray-300">
                  {time}s
                </span>
              </View>
              <View className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="font-mono text-lg text-gray-700 dark:text-gray-300">
                  {gameState.score}
                </span>
              </View>
            </View>
          </View>

          <View
            className="grid gap-[2px] bg-gray-200 dark:bg-gray-700 p-[2px] rounded-lg aspect-square"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
              const x = i % GRID_SIZE;
              const y = Math.floor(i / GRID_SIZE);
              const isSnake = gameState.body.some(
                (segment) => segment.x === x && segment.y === y
              );
              const isApple = gameState.apples.some(
                (apple) => apple.x === x && apple.y === y
              );
              const isHead =
                gameState.body[0]?.x === x && gameState.body[0]?.y === y;

              return (
                <View
                  key={i}
                  className={`aspect-square rounded-sm ${
                    isSnake
                      ? `${
                          isHead
                            ? "bg-green-600 dark:bg-green-500"
                            : "bg-green-500 dark:bg-green-600"
                        }`
                      : isApple
                      ? "bg-red-500 dark:bg-red-600"
                      : "bg-white dark:bg-gray-800"
                  }`}
                />
              );
            })}
          </View>

          {gameState.gameStatus === "waiting" && (
            <View className="mt-4 text-center">
              <button
                onClick={startGame}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Start Game
              </button>
            </View>
          )}
        </View>
      </View>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSave={(newSettings) => {
          setSettings(newSettings);
          setShowSettings(false);
          if (gameState.gameStatus === "playing") {
            startGame();
          }
        }}
      />

      <GameOverModal
        gameState={gameState.gameStatus}
        time={time}
        onRestart={startGame}
      />

      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        gameType="snake"
      />
    </View>
  );
}
