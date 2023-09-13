export const chunkArray = <T>(array: T[], size: number): T[][] => {
    const chunkArray = [];
    for (let i = 0; i < array.length; i += size) {
        chunkArray.push(array.slice(i, i + size));
    }
    return chunkArray;
};
