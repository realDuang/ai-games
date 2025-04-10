import { useState, useEffect } from "react";
import { setStorage, getStorageSync } from "@tarojs/taro";
import { Theme } from "../types";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = getStorageSync("snakeGameTheme");
      return (saved as Theme) || "dark";
    } catch (e) {
      return "dark";
    }
  });

  useEffect(() => {
    setStorage({
      key: "snakeGameTheme",
      data: theme,
    });
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
}
