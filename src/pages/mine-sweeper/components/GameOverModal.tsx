import { Button, Text, View } from "@tarojs/components";
import { GameState } from "../types";

interface GameOverModalProps {
  state: GameState;
  onRestart: () => void;
}

export function GameOverModal({ state, onRestart }: GameOverModalProps) {
  // 只有在游戏结束状态(won或lost)才显示模态框
  if (state !== "won" && state !== "lost") return null;

  // 处理重新开始按钮点击
  const handleRestart = () => {
    onRestart();
  };

  return (
    <View className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <View className="bg-gray-800 p-6 rounded-lg text-center w-5/6 max-w-xs mx-auto">
        <Text className="text-xl font-bold text-white mb-3">游戏结束</Text>
        <Text className="text-lg text-gray-300 mb-5">
          {state === "won" ? "恭喜胜利！" : "游戏失败！"}
        </Text>
        <Button
          onClick={handleRestart}
          className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg w-full"
        >
          重新开始
        </Button>
      </View>
    </View>
  );
}
