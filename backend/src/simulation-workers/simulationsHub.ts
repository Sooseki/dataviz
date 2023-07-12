import { IDataset } from "../types";
import { timeToLoad } from "./workers/timeToLoad";

export const simulationhub = async (url: string): Promise<IDataset> => {
    const timeToLoadData = await timeToLoad(url);
    return { timeToLoad: timeToLoadData };
};