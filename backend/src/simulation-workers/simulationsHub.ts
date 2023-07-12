//TO-DO : gather all workers data
//TO-DO : single push to DB when all workers gathered
import { IDataset } from "../types";
import { timeToLoad } from "./workers/timeToLoad";
import { jsUseRate } from "./workers/jsUseRate";
//TO-DO : queue-system

export const simulationhub = async (url: string): Promise<IDataset> => {
    const timeToLoadData = await timeToLoad(url);
    const jsUseRateData = await jsUseRate(url);
    return { timeToLoad: timeToLoadData,
        jsUseRate: jsUseRateData,
    };
};