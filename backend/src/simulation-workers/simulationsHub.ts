import { IDataset } from "../types";
import { timeToLoad } from "./workers/timeToLoad";
import { jsUseRate } from "./workers/jsUseRate";
import { lighthouseFromPuppeteer } from "./workers/lighthouse";
//TO-DO : queue-system


export const simulationhub = async (url: string): Promise<IDataset> => {
    const timeToLoadData = await timeToLoad(url);
    const jsUseRateData = await jsUseRate(url);
    const lighthouseFromPuppeteerData = await lighthouseFromPuppeteer(url);
    return { 
        timeToLoad: timeToLoadData,
        jsUseRate: jsUseRateData,
        ...lighthouseFromPuppeteerData
    };
};