import puppeteer, { CoverageEntry } from "puppeteer";
import { JsUseRateResult } from "../../types";

const calculateUsedBytes = (coverage: CoverageEntry[]): JsUseRateResult[] =>
    coverage.map(({ url, ranges, text }) => {
        let usedBytes = 0;

        ranges.forEach((range) => {
            usedBytes += range.end - range.start - 1;
        });

        return {
            url,
            usedBytes,
            totalBytes: text.length,
            percentUsed: `${((usedBytes / text.length) * 100).toFixed(2)}%`,
        };
    });
export const jsUseRate = async (url: string): Promise<JsUseRateResult[]> => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await Promise.all([page.coverage.startJSCoverage()]);

    await page.goto(url);

    const [jsCoverage] = await Promise.all([
        page.coverage.stopJSCoverage(),
    ]);

    await browser.close();
    return calculateUsedBytes(jsCoverage);
};
