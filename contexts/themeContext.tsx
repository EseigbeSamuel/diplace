import { ColorScheme, darkTheme, lightTheme } from "@/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect } from "react";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: ColorScheme;
}

const ThemeContext = createContext<undefined | ThemeContextType>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = (props: ThemeProviderProps) => {
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  useEffect(() => {
    AsyncStorage.getItem("isDarkMode").then((value) => {
      if (value) {
        setIsDarkMode(JSON.parse(value));
      }
    });
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    AsyncStorage.setItem("isDarkMode", JSON.stringify(!isDarkMode));
  };

  const colors: ColorScheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
