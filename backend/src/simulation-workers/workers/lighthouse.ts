/* eslint-disable @typescript-eslint/no-var-requires */
const lighthouse = require("lighthouse");
import puppeteer from "puppeteer";
const chromeLauncher = require("chrome-launcher");
const ReportGenerator = require("lighthouse/report/generator/report-generator");
import request from "request-promise-native";
import { LighthouseMetrics } from "../../types";
import { Options } from "chrome-launcher";

const options: Options = {
    logLevel: "info",
    chromeFlags: ["--disable-mobile-emulation"]
};

export const lighthouseFromPuppeteer = async (
    url: string,
): Promise<LighthouseMetrics> => {
    const results: LighthouseMetrics = {
        firstContentfulPaint: "",
        cumulativeLayoutShift: "",
        totalBlockingTime: "",
        timeToInteractive: ""
    };

    // Launch chrome using chrome-launcher
    const chrome = await chromeLauncher.launch(options);
    options.port = chrome.port;

    // Connect chrome-launcher to puppeteer
    const resp = await request(`http://localhost:${options.port}/json/version`);
    const { webSocketDebuggerUrl } = JSON.parse(resp);
    const browser = await puppeteer.connect({ browserWSEndpoint: webSocketDebuggerUrl });

    // Run Lighthouse
    const { lhr } = await lighthouse(url, options);
    await browser.disconnect();
    await chrome.kill();

    const json = ReportGenerator.generateReport(lhr, "json");

    const audits = JSON.parse(json).audits;
    results.firstContentfulPaint = audits["first-contentful-paint"].displayValue;
    results.cumulativeLayoutShift = audits["cumulative-layout-shift"].displayValue;
    results.totalBlockingTime = audits["total-blocking-time"].displayValue;
    results.timeToInteractive = audits["interactive"].displayValue;

    return results;
};
