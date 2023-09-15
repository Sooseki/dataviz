export const getValueColor = (
    thresholds: [number, number],
    value?: number
): string => {
    if (value === undefined) return ""; // Retourne une chaîne vide ou une classe par défaut pour undefined
    const individualPointValue = 255 / (thresholds[1] - thresholds[0]);
    const color = {
        green: 255 - individualPointValue * value,
        red: individualPointValue * value,
    };
    return `rgb(${color.red}, ${color.green}, 0)`;
};
