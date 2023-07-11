//TO-DO : gather all workers data
//TO-DO : single push to DB when all workers gathered
import { IDataset } from "../types";
import { timeToLoad } from "./workers/timeToLoad";
//TO-DO : queue-system

export const simulationhub = async (url: string): Promise<IDataset> => {
    const timeToLoadData = await timeToLoad(url);
    return { timeToLoad: timeToLoadData };
};