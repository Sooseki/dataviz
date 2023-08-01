import { IDataset } from "../types";
import { timeToLoad } from "./workers/timeToLoad";
import { jsUseRate } from "./workers/jsUseRate";
import { lighthouseFromPuppeteer } from "./workers/lighthouse";
import Domain from "../models/Domain";
import puppeteer, { Browser } from "puppeteer";
import Dataset from "../models/Dataset";

const simulationhub = async (url: string, browser: Browser): Promise<IDataset> => {
    const timeToLoadData = await timeToLoad(url, browser);
    const jsUseRateData = await jsUseRate(url, browser);
    const lighthouseFromPuppeteerData = await lighthouseFromPuppeteer(url);
    return { 
        timeToLoad: timeToLoadData,
        jsUseRate: jsUseRateData,
        ...lighthouseFromPuppeteerData
    };
};

// TODO : change any[] by a type to describe domains
export const runSimulationForDomains = async (domains: any[]) => {
    const browser = await puppeteer.launch({ headless: "new" });

    const metrics = [];
    for(const domain of domains) {
        const data = await simulationhub(domain.url, browser)
        metrics.push({ domain, data });
    }

    await browser.close();
    return metrics;
}

export const runSimulationForAllDomains = async () => {
    const domains = await Domain.find();
    if(!domains) return;

    const metrics = await runSimulationForDomains(domains);
    Promise.all(metrics.map(async (metric) => {
        const dataset = await Dataset.create({
            date: new Date(),
            ...metric.data,
        });
    
        await Domain.updateOne({_id: metric.domain.id}, {
            datasets: [...metric.domain.datasets, dataset.id],
        });
    }));

}
