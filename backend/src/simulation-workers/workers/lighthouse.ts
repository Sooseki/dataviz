/* eslint-disable @typescript-eslint/no-var-requires */
const lighthouse = require("lighthouse");
const ReportGenerator = require("lighthouse/report/generator/report-generator");
import { LaunchedChrome, Options } from "chrome-launcher";
const chromeLauncher = require("chrome-launcher");

export const lighthouseFromPuppeteer = async (url: string) => {
    const options: Options = {
        logLevel: "info",
        chromeFlags: ["--disable-mobile-emulation"],
    };

    // Launch chrome using chrome-launcher
    const chrome: LaunchedChrome = await chromeLauncher.launch(options);
    options.port = chrome.port;

    const { lhr } = await lighthouse(url, options);
    const json = ReportGenerator.generateReport(lhr, "json");
    chrome.kill();

    const audits = JSON.parse(json).audits;

    return {
        firstContentfulPaint: convertValueToMsNumber(
            audits["first-contentful-paint"].displayValue
        ),
        cumulativeLayoutShift: convertValueToMsNumber(
            audits["cumulative-layout-shift"].displayValue
        ),
        totalBlockingTime: convertValueToMsNumber(
            audits["total-blocking-time"].displayValue
        ),
        timeToInteractive: convertValueToMsNumber(
            audits["interactive"].displayValue
        ),
    };
};

const convertValueToMsNumber = (value: string): number => {
    const formatedValue = value.replace(/,/g, ""); // retrieve thousand separator ,
    const [count, unit] = formatedValue.split(/\s/);

    if (!unit || unit === "s") return parseFloat(count);
    if (unit === "ms") return parseFloat(count) * 1000;

    return 0;
};
