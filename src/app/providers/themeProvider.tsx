import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDisplaySettings } from "@/modules/settings/api";

interface ThemeContextValue {
  theme: string;
  accent: string;
  changeTheme: (params: { theme: string; accent: string }) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  const displayQuery = useQuery({
    queryKey: ["display"],
    queryFn: getDisplaySettings,
  });

  const [theme, setTheme] = useState("light");
  const [accent, setAccent] = useState("blue");

  useEffect(() => {
    if (displayQuery.data) {
      setTheme(displayQuery.data.theme);
      setAccent(displayQuery.data.accent);
    }
  }, [displayQuery.data]);

  useEffect(() => {
    const flipTheme = (theme: string) => {
      const root = document.documentElement;
      const targetTheme = theme === "dim" ? "dark" : theme;

      if (targetTheme === "dark") root.classList.add("dark");
      else root.classList.remove("dark");

      root.style.setProperty("--main-background", `var(--${theme}-background)`);
      root.style.setProperty("--main-primary", `var(--${theme}-primary)`);
      root.style.setProperty("--main-secondary", `var(--${theme}-secondary)`);

      return undefined;
    };

    flipTheme(theme);
  }, [theme]);

  useEffect(() => {
    const flipAccent = (accent: string) => {
      const root = document.documentElement;

      root.style.setProperty("--main-accent", `var(--accent-${accent})`);

      return undefined;
    };

    flipAccent(accent);
  }, [accent]);

  const changeTheme = ({ theme, accent }: { theme: string; accent: string }) => {
    setTheme(theme);
    setAccent(accent);
  };

  const value = {
    theme,
    accent,
    changeTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context)
    throw new Error("useTheme must be used within an ThemeContextProvider");

  return context;
}
