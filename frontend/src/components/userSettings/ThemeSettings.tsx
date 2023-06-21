import { useState } from "react";
import Button from "../button/Button";

const ThemeSettings = () => {
    const [selectedTheme, setSelectedTheme] = useState("light");
    
    return (
        <>
            <Button content="Dark" onClick={() => setSelectedTheme("dark")} />
            <Button content="Light" onClick={() => setSelectedTheme("light")} />
        </>
    )
}

export default ThemeSettings;