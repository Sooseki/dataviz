"use client";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { ThemeContextType } from "@/types";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext<ThemeContextType>({});
export const useTheme = () => useContext(ThemeContext);
export const ThemeContextProvider = ({ children }: PropsWithChildren) => {
    const { getItem, setItem } = useLocalStorage();
    const [theme, setTheme] = useState<string | undefined>("light");
    const allThemes = [{
        label: "Dark",
        name: "dark"
    }, {
        label: "Light",
        name: "light"
    }];

    const setNewTheme = (theme: string) => {
        setTheme(theme);
        setItem("theme", theme);
        
        for(const theme of allThemes) {
            document.body.classList.remove(theme.name); 
        }
        document.body.classList.add(theme);
    };

    useEffect(() => {
        const usedTheme = getItem("theme");
        if (usedTheme) setNewTheme(usedTheme);
    });

    const value: ThemeContextType = { 
        theme,
        setNewTheme,
        allThemes,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
