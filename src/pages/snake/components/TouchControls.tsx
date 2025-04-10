import React from "react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { View } from "@tarojs/components";

import { Direction, Theme, THEMES } from "../types";

interface TouchControlsProps {
  onDirectionChange: (direction: Direction) => void;
  theme: Theme;
}

export function TouchControls({
  onDirectionChange,
  theme,
}: TouchControlsProps) {
  const themeColors = THEMES[theme];

  return (
    <View className="grid grid-cols-3 gap-2 w-48 mx-auto mt-6 md:hidden">
      <View className="col-start-2">
        <View
          onClick={() => onDirectionChange("UP")}
          className={`w-full h-12 ${themeColors.button} rounded-lg flex items-center justify-center transition-colors duration-300`}
        >
          <ArrowUp className="w-6 h-6" />
        </View>
      </View>
      <View className="col-start-1 col-span-3 grid grid-cols-3 gap-2">
        <View
          onClick={() => onDirectionChange("LEFT")}
          className={`w-full h-12 ${themeColors.button} rounded-lg flex items-center justify-center transition-colors duration-300`}
        >
          <ArrowLeft className="w-6 h-6" />
        </View>
        <View
          onClick={() => onDirectionChange("DOWN")}
          className={`w-full h-12 ${themeColors.button} rounded-lg flex items-center justify-center transition-colors duration-300`}
        >
          <ArrowDown className="w-6 h-6" />
        </View>
        <View
          onClick={() => onDirectionChange("RIGHT")}
          className={`w-full h-12 ${themeColors.button} rounded-lg flex items-center justify-center transition-colors duration-300`}
        >
          <ArrowRight className="w-6 h-6" />
        </View>
      </View>
    </View>
  );
}
