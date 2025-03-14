import {
  Gamepad2,
  Bomb,
  ArrowRight,
  ChevronsLeftRight,
  Apple,
} from "lucide-react";
import { Link } from "react-router-dom";

const games = [
  {
    id: "minesweeper",
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gamepad2 className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Game Collection
            </h1>
          </div>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Enjoy our collection of classic browser games reimagined with modern
            design
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <Link
                key={game.id}
                to={`/games/${game.id}`}
                className="group relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-xl font-bold text-gray-900">
                      {game.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">{game.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {game.categories.map((category) => (
                        <span
                          key={category}
                          className="px-2.5 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      {game.difficulty}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowRight className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
