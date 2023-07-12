import puppeteer from "puppeteer";

export const timeToLoad = async (url: string) => {
    const browser = await puppeteer.launch(); 
    
    const page = await browser.newPage();
    await page.goto(url);
    const {TaskDuration} = await page.metrics();
    await browser.close();
    return TaskDuration;
};