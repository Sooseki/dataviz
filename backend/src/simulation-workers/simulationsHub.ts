//TO-DO : gather all workers data
//TO-DO : single push to DB when all workers gathered
import { timeToLoad } from "./workers/timeToLoad";
//TO-DO : queue-system

export const simulationhub = async (url: string) => {
    const timeToLoadData = await timeToLoad(url);
    return { timeToLoad: timeToLoadData };
};