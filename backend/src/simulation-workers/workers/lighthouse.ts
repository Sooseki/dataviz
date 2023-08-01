/* eslint-disable @typescript-eslint/no-var-requires */
const lighthouse = require("lighthouse");
const ReportGenerator = require("lighthouse/report/generator/report-generator");
import puppeteer, { Browser } from "puppeteer";
import { LighthouseMetrics } from "../../types";
import { Options } from "chrome-launcher";
const chromeLauncher = require("chrome-launcher");
import request from "request-promise-native";

export const lighthouseFromPuppeteer = async (
    url: string
): Promise<LighthouseMetrics> => {
    console.log(url)
    const results: LighthouseMetrics = {
        firstContentfulPaint: "",
        cumulativeLayoutShift: "",
        totalBlockingTime: "",
        timeToInteractive: ""
    };

    const { lighthouseBrowser, chrome, options } = await getLightHouseBrowser();

    // Run Lighthouse
    const { lhr } = await lighthouse(url, options);
    const json = ReportGenerator.generateReport(lhr, "json");

    const audits = JSON.parse(json).audits;
    results.firstContentfulPaint = audits["first-contentful-paint"].displayValue;
    results.cumulativeLayoutShift = audits["cumulative-layout-shift"].displayValue;
    results.totalBlockingTime = audits["total-blocking-time"].displayValue;
    results.timeToInteractive = audits["interactive"].displayValue;

    lighthouseBrowser.disconnect();
    await chrome.kill();

    return results;
};

const getLightHouseBrowser = async (): Promise<{lighthouseBrowser: Browser, chrome: any, options: Options}> => {
    
    const options: Options = {
        logLevel: "info",
        chromeFlags: ["--disable-mobile-emulation"]
    };

    // Launch chrome using chrome-launcher
    const chrome = await chromeLauncher.launch(options);
    options.port = chrome.port;

    // Connect chrome-launcher to puppeteer
    const resp = await request(`http://localhost:${options.port}/json/version`);
    const { webSocketDebuggerUrl } = JSON.parse(resp);
    const lighthouseBrowser = await puppeteer.connect({ browserWSEndpoint: webSocketDebuggerUrl });
    return {lighthouseBrowser, chrome, options};
}
