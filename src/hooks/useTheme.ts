"use client";
import { useState, useEffect } from "react";

export type Theme = "light" | "dark";

const LIGHT_BG = "linear-gradient(165deg, #fdfaf5 0%, #f5edd8 45%, #ede1c8 100%)";
const DARK_BG  = "linear-gradient(165deg, #141210 0%, #1c1208 55%, #120e06 100%)";

function applyTheme(t: Theme) {
  document.documentElement.classList.toggle("dark", t === "dark");
  document.body.style.background = t === "light" ? LIGHT_BG : DARK_BG;
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = localStorage.getItem("dan-aaah-theme") as Theme | null;
    const initial: Theme = saved ?? "light";
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: Theme = prev === "light" ? "dark" : "light";
      localStorage.setItem("dan-aaah-theme", next);
      applyTheme(next);
      return next;
    });
  };

  return { theme, toggleTheme };
}
