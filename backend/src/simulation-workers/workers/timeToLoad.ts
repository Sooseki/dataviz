/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
//import puppeteer from "puppeteer";
const puppeteer = require("puppeteer");

const timeToLoad = async () => {
    const browser = await puppeteer.launch({ headless: "new" });

    const page = await browser.newPage();
    await page.goto("https://www.hetic.net/?gge_source=google&gge_medium=cpc&gge_term=hetic&gge_campaign=Search-MarquePure&gclid=Cj0KCQjwnrmlBhDHARIsADJ5b_kcYsjIFCG9t9mFJ1-3qSinhwgxrr984mnvDXI9r_XzL5FKmX9DZOcaAh75EALw_wcB");
    const test = await page.metrics();
    console.log(test);
    await browser.close();
};

timeToLoad();