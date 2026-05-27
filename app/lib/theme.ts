import { create } from "zustand";

interface ThemeStore {
    theme: "light" | "dark";
    toggleTheme: () => void;
    setTheme: (theme: "light" | "dark") => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
    theme: (typeof window !== "undefined" && localStorage.getItem("resumify-theme") === "dark") ? "dark" : "light",
    toggleTheme: () => {
        const next = get().theme === "light" ? "dark" : "light";
        set({ theme: next });
        if (typeof window !== "undefined") {
            localStorage.setItem("resumify-theme", next);
            document.documentElement.classList.toggle("dark", next === "dark");
        }
    },
    setTheme: (theme) => {
        set({ theme });
        if (typeof window !== "undefined") {
            localStorage.setItem("resumify-theme", theme);
            document.documentElement.classList.toggle("dark", theme === "dark");
        }
    },
}));
