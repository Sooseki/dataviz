import { Browser } from "puppeteer";

export const timeToLoad = async (url: string, browser: Browser) => {
    const page = await browser.newPage();
    await page.goto(url);
    const {TaskDuration} = await page.metrics();
    return TaskDuration;
};