"use client"
import { ThemeContextType } from "@/types";
import { PropsWithChildren, createContext, useContext, useState } from "react";

const ThemeContext = createContext<ThemeContextType>({})
export const useTheme = () => useContext(ThemeContext);

// TODO : store selectedTheme in local storage for future uses ?
export const ThemeContextProvider = ({ children }: PropsWithChildren) => {
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
        for(const theme of allThemes) {
            document.body.classList.remove(theme.name) 
        }
        document.body.classList.add(theme)
    }

    const value: ThemeContextType = { 
        theme,
        setNewTheme,
        allThemes,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
};
