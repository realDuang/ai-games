import React, { useState } from "react";
import { View, Text, Input, Button } from "@tarojs/components";
import { X } from "lucide-react";

interface Settings {
  width: number;
  height: number;
  mines: number;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [newSettings, setNewSettings] = useState(settings);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const maxMines = newSettings.width * newSettings.height - 1;
    const validatedSettings = {
      ...newSettings,
      mines: Math.min(newSettings.mines, maxMines),
    };
    onSave(validatedSettings);
  };

  return (
    <View className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <View className="bg-white rounded-lg p-4 w-5/6 max-w-sm mx-auto max-h-90vh overflow-y-auto">
        <View className="flex justify-between items-center mb-3">
          <Text className="text-lg font-bold text-gray-800">游戏设置</Text>
          <View
            onClick={onClose}
            className="p-2 touch-target rounded-lg"
          >
            <X className="w-5 h-5 text-gray-600" />
          </View>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="block text-sm font-medium text-gray-700 mb-1">
              宽度 (5-20)
            </Text>
            <Input
              type="number"
              value={newSettings.width.toString()}
              onInput={(e) =>
                setNewSettings({
                  ...newSettings,
                  width: Math.max(
                    5,
                    Math.min(20, parseInt(e.detail.value) || 5)
                  ),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </View>

          <View>
            <Text className="block text-sm font-medium text-gray-700 mb-1">
              高度 (5-20)
            </Text>
            <Input
              type="number"
              value={newSettings.height.toString()}
              onInput={(e) =>
                setNewSettings({
                  ...newSettings,
                  height: Math.max(
                    5,
                    Math.min(20, parseInt(e.detail.value) || 5)
                  ),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </View>

          <View>
            <Text className="block text-sm font-medium text-gray-700 mb-1">
              地雷数量 (最大值：宽度×高度-1)
            </Text>
            <Input
              type="number"
              value={newSettings.mines.toString()}
              onInput={(e) => {
                const value = parseInt(e.detail.value) || 1;
                const maxMines = newSettings.width * newSettings.height - 1;
                setNewSettings({
                  ...newSettings,
                  mines: Math.max(1, Math.min(maxMines, value)),
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </View>

          <View className="mt-6 flex justify-end gap-2">
            <Button
              onClick={onClose}
              className="px-3 py-2 text-gray-700 border border-gray-300 rounded-lg"
            >
              取消
            </Button>
            <Button
              onClick={handleSubmit}
              className="px-3 py-2 bg-indigo-600 text-white rounded-lg"
            >
              保存
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};
