import { useState } from "react";
import { View } from "@tarojs/components";

import { Game } from "../../types";
import { GameModal } from "../../components/GameModal";
import { ThemeProvider } from "../../context/ThemeContext";
import Home from "./home";

export default function HomePage() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  return (
    <ThemeProvider>
      <View className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Home setSelectedGame={setSelectedGame}></Home>

        <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
      </View>
    </ThemeProvider>
  );
}
