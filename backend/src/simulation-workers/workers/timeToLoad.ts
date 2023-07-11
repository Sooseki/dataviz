import puppeteer from "puppeteer";

export const timeToLoad = async () => {
    const browser = await puppeteer.launch(); 
    
    const page = await browser.newPage();
    await page.goto("https://www.hetic.net/?gge_source=google&gge_medium=cpc&gge_term=hetic&gge_campaign=Search-MarquePure&gclid=CjwKCAjw2K6lBhBXEiwA5RjtCdB0ll4Cx0_aoFtLqrD7PrJ44VV4db8byNMSzpftBjr9Mz_wfvFydRoCPZQQAvD_BwE");
    const {TaskDuration} = await page.metrics();
    await browser.close();
    return TaskDuration;
};