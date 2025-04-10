import { View, Navigator, Text, Image } from "@tarojs/components";
import { Gamepad2, Bomb, ChevronsLeftRight, Apple } from "lucide-react";

const games = [
  {
    id: "mine-sweeper",
    title: "Minesweeper",
    description:
      "Classic puzzle game where you clear a minefield using logic and careful planning. Reveal cells while avoiding hidden mines!",
    icon: Bomb,
    image:
      "https://images.unsplash.com/photo-1614107151491-6876eecbff89?auto=format&fit=crop&q=80&w=1200&h=800",
    difficulty: "Medium",
    categories: ["Puzzle", "Strategy"],
  },

  {
    id: "gomoku",
    title: "Gomoku",
    description:
      "Strategic board game where two players compete to connect five stones in a row. Plan your moves tactically while blocking your opponent's advances!",
    icon: ChevronsLeftRight,
    image:
      "https://images.unsplash.com/photo-1614107151491-6876eecbff89?auto=format&fit=crop&q=80&w=1200&h=800",
    difficulty: "Easy",
    categories: ["PvP", "PvE"],
  },

  {
    id: "snake",
    title: "Snake",
    description:
      "Classic arcade game where you control a growing serpent, devouring dots to lengthen your body. Master swift maneuvers to avoid collisions and outlast opponents in thrilling multiplayer battles!",
    icon: Apple,
    image:
      "https://images.unsplash.com/photo-1614107151491-6876eecbff89?auto=format&fit=crop&q=80&w=1200&h=800",
    difficulty: "Easy",
    categories: ["Reactive", "Stimulate"],
  },
];

export default function Home() {
  return (
    <View className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <View className="px-4 py-5">
        <View className="text-center mb-6">
          <View className="flex items-center justify-center gap-2 mb-2">
            <Gamepad2 className="w-5 h-5 text-indigo-600" />
            <Text className="text-xl font-bold text-gray-900">趣味游戏集</Text>
          </View>
          <Text className="text-sm text-gray-600">经典游戏合集，触手可及</Text>
        </View>

        <View className="grid gap-3 grid-cols-1">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <Navigator
                key={game.id}
                url={`/pages/${game.id}/index`}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <View className="aspect-[2/1] overflow-hidden relative">
                  <Image
                    src={game.image}
                    mode="aspectFill"
                    className="w-full h-full"
                  />
                  <View className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
                  <View className="absolute bottom-2 left-3 flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-white" />
                    <Text className="text-lg font-bold text-white">
                      {game.title}
                    </Text>
                  </View>
                </View>
                <View className="p-3">
                  <Text className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {game.description}
                  </Text>
                  <View className="flex items-center justify-between">
                    <View className="flex flex-wrap gap-1">
                      {game.categories.map((category) => (
                        <Text
                          key={category}
                          className="px-1.5 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full"
                        >
                          {category}
                        </Text>
                      ))}
                    </View>
                  </View>
                </View>
              </Navigator>
            );
          })}
        </View>
      </View>
    </View>
  );
}
