import { timeToLoad } from "./workers/timeToLoad";
import { jsUseRate } from "./workers/jsUseRate";
import { lighthouseFromPuppeteer } from "./workers/lighthouse";
import Domain from "../models/Domain";
import puppeteer, { Browser, PuppeteerLaunchOptions } from "puppeteer";
import Dataset from "../models/Dataset";
import { IDomain, IDataset } from "@perfguardian/common/src/types";
import { getEnvVariable } from "../utils/getEnvVariable";
import { chunkArray } from "../utils/helpers";

const simulationhub = async (
    url: string,
    browser: Browser
): Promise<IDataset | null> => {
    try {
        const timeToLoadData = await timeToLoad(url, browser);
        const jsUseRateData = await jsUseRate(url, browser);
        const lighthouseFromPuppeteerData = await lighthouseFromPuppeteer(url);
        return {
            timeToLoad: timeToLoadData,
            jsUseRate: jsUseRateData,
            ...lighthouseFromPuppeteerData,
        };
    } catch (e) {
        // TODO virer les console.error en prod

        if (e instanceof Error) {
            console.error(
                `Erreur lors de la simulation pour ${url}: ${e.message}`
            );
        } else {
            console.error(`Erreur lors de la simulation pour ${url}: ${e}`);
        }
        return null;
    }
};

export const runSimulation = async (domains: IDomain[]) => {
    const puppeteerConfig: PuppeteerLaunchOptions = {
        headless: "new",
    };

    try {
        const executablePath = getEnvVariable("EXECUTABLE_PATH");
        if (executablePath) puppeteerConfig.executablePath = executablePath;
    } catch {
        console.error("executablePath env not defined");
    }

    const browser = await puppeteer.launch(puppeteerConfig);

    const metrics = [];
    for (const domain of domains) {
        const data = await simulationhub(domain.url, browser);
        if (data) metrics.push({ domain, data });
    }

    await browser.close();
    return metrics;
};

export const runSimulationForAllDomains = async () => {
    const domains = await Domain.find();
    runSimulationForDomains(domains);
};

export const runSimulationForDomains = async (domains: IDomain[]) => {
    if (!domains) return;

    // Run domains data analysing 10 by 10 to prevent timeout or losing all datas
    const chunkDomains = chunkArray(domains, 10);

    for (const chunkDomain of chunkDomains) {
        const metrics = await runSimulation(chunkDomain);
        Promise.all(
            metrics.map(async (metric) => {
                const dataset = await Dataset.create({
                    date: new Date(),
                    ...metric.data,
                });

                await Domain.updateOne(
                    { _id: metric.domain.id },
                    {
                        datasets: [
                            ...(metric.domain.datasets ?? []),
                            dataset.id,
                        ],
                    }
                );
            })
        );
    }
};
