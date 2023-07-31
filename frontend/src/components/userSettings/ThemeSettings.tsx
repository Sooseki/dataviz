import { useEffect, useState } from "react";
import Button from "../button/Button";
import { useTheme } from "@/context/ThemeContext";

const ThemeSettings = () => {
    const { theme, allThemes, setNewTheme } = useTheme();
    const [selectedTheme, setSelectedTheme] = useState(theme);

    useEffect(() => {
        if (!selectedTheme || !setNewTheme) return;
        setNewTheme(selectedTheme);
    }, [selectedTheme]);

    return (
        <div className="tabs-content">
            {allThemes?.map((theme) => {
                return (
                    <Button 
                        key={theme.name}
                        content={theme.label} 
                        onClick={() => setSelectedTheme(theme.name)} 
                        classes={selectedTheme === theme.name ? "main-button hidden" : "main-button"}
                    />
                );
            })}
        </div>
    );
};

export default ThemeSettings;