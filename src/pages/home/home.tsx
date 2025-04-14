import { View, Text } from "@tarojs/components";
import {
  Gamepad2,
  Bomb,
  Grid3x3,
  Moon,
  Sun,
  Cake as Snake,
  LucideChartNoAxesColumnDecreasing,
} from "lucide-react";
import { Game } from "../../types";
import { useTheme } from "../../context/ThemeContext";

const games: Game[] = [
  {
    id: "gomoku",
    title: "Gomoku",
    description:
      "Classic puzzle game where you clear a minefield using logic and careful planning. Reveal cells while avoiding hidden mines!",
    icon: LucideChartNoAxesColumnDecreasing,
    difficulty: "Medium",
    categories: ["Puzzle", "Strategy"],
  },
  {
    id: "mine-sweeper",
    title: "Minesweeper",
    description:
      "Classic puzzle game where you clear a minefield using logic and careful planning. Reveal cells while avoiding hidden mines!",
    icon: Bomb,
    difficulty: "Medium",
    categories: ["Puzzle", "Strategy"],
  },
  {
    id: "sudoku",
    title: "Sudoku",
    description:
      "Fill the grid with numbers 1-9, ensuring each number appears once in every row, column, and 3x3 box.",
    icon: Grid3x3,
    difficulty: "Variable",
    categories: ["Puzzle", "Logic"],
  },
  {
    id: "snake",
    title: "Snake",
    description:
      "Guide the snake to eat apples and grow longer, but avoid colliding with yourself! A classic arcade game.",
    icon: Snake,
    difficulty: "Variable",
    categories: ["Arcade", "Reflex"],
  },
];

interface HomeProps {
  setSelectedGame: (game: Game) => void;
}

export default function Home({ setSelectedGame }: HomeProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <View className="max-w-4xl mx-auto px-4 py-8">
      <View className="flex justify-between items-center mb-12">
        <View className="flex items-center gap-3">
          <Gamepad2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            Duang Game
          </Text>
        </View>
        <View
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </View>
      </View>

      <View className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <View
              key={game.id}
              onClick={() => setSelectedGame(game)}
              className="aspect-square bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:-translate-y-1 group"
            >
              <Icon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
              <Text className="text-lg font-medium text-gray-900 dark:text-white text-center">
                {game.title}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
