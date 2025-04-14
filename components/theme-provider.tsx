"use client";

import type * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
type FontSize = "small" | "medium" | "large";

interface ThemeProviderProps {
  children: React.ReactNode;
}

interface ThemeProviderState {
  theme: Theme;
  fontSize: FontSize;
  compactMode: boolean;
  animations: boolean;
  setTheme: (theme: Theme) => void;
  setFontSize: (size: FontSize) => void;
  setCompactMode: (compact: boolean) => void;
  setAnimations: (enabled: boolean) => void;
}

const initialState: ThemeProviderState = {
  theme: "system",
  fontSize: "medium",
  compactMode: false,
  animations: true,
  setTheme: () => null,
  setFontSize: () => null,
  setCompactMode: () => null,
  setAnimations: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("system");
  const [fontSize, setFontSize] = useState<FontSize>("medium");
  const [compactMode, setCompactMode] = useState<boolean>(false);
  const [animations, setAnimations] = useState<boolean>(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const savedFontSize = localStorage.getItem("fontSize") as FontSize | null;
    const savedCompactMode = localStorage.getItem("compactMode");
    const savedAnimations = localStorage.getItem("animations");

    if (savedTheme) setTheme(savedTheme);
    if (savedFontSize) setFontSize(savedFontSize);
    if (savedCompactMode !== null) setCompactMode(savedCompactMode === "true");
    if (savedAnimations !== null) setAnimations(savedAnimations === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("fontSize", fontSize);
    localStorage.setItem("compactMode", compactMode.toString());
    localStorage.setItem("animations", animations.toString());

    const root = window.document.documentElement;

    // Remove all theme classes
    root.classList.remove("light", "dark");

    // Remove all font size classes
    root.classList.remove("text-sm", "text-base", "text-lg");

    // Remove compact mode class
    root.classList.remove("compact-mode");

    // Remove animations class
    root.classList.remove("no-animations");

    // Apply theme
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      root.style.colorScheme = systemTheme;
    } else {
      root.classList.add(theme);
      root.style.colorScheme = theme;
    }

    // Apply font size
    if (fontSize === "small") {
      root.classList.add("text-sm");
    } else if (fontSize === "large") {
      root.classList.add("text-lg");
    }

    // Apply compact mode
    if (compactMode) {
      root.classList.add("compact-mode");
    }

    // Apply animations setting
    if (!animations) {
      root.classList.add("no-animations");
    }
  }, [theme, fontSize, compactMode, animations]);

  const value = {
    theme,
    fontSize,
    compactMode,
    animations,
    setTheme,
    setFontSize,
    setCompactMode,
    setAnimations,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
