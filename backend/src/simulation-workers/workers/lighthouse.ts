// const fs = require("fs");
// const lighthouse = require("lighthouse");
// const puppeteer = require("puppeteer");

// const chromeLauncher = require("chrome-launcher");
// const ReportGenerator = require("lighthouse/report/generator/report-generator");
// const desktopConfig = require("lighthouse/lighthouse-core/config/desktop-config.js");
// const request = require("request");
// const util = require("util");

// const options = {
//     logLevel: "info",
//     disableDeviceEmulation: true,
//     chromeFlags: ["--disable-mobile-emulation"]
// };

// async function lighthouseFromPuppeteer(url, options, config = null) {
//   // Launch chrome using chrome-launcher
//     const chrome = await chromeLauncher.launch(options);
//     options.port = chrome.port;

//   // Connect chrome-launcher to puppeteer
//     const resp = await util.promisify(request)(`http://localhost:${options.port}/json/version`);
//     const { webSocketDebuggerUrl } = JSON.parse(resp.body);
//     const browser = await puppeteer.connect({ browserWSEndpoint: webSocketDebuggerUrl });

//   // Run Lighthouse
//     const { lhr } = await lighthouse(url, options, desktopConfig);
//     await browser.disconnect();
//     await chrome.kill();

//     const json = ReportGenerator.generateReport(lhr, "json");

//     const audits = JSON.parse(json).audits; // Lighthouse audits
//     const first_contentful_paint = audits["first-contentful-paint"].displayValue;
//     const cumulative_layout_shift = audits["cumulative-layout-shift"].displayValue;
//     const total_blocking_time = audits["total-blocking-time"].displayValue;
//     const time_to_interactive = audits["interactive"].displayValue;

//     console.log(`\n
//         Lighthouse metrics: 
//         First Contentful Paint: ${first_contentful_paint}, 
//         Total Blocking Time: ${total_blocking_time},
//         CLS: ${cumulative_layout_shift},
//         Time To Interactive: ${time_to_interactive}`);
// }

// lighthouseFromPuppeteer("https://www.hetic.net/?gge_source=google&gge_medium=cpc&gge_term=hetic&gge_campaign=Search-MarquePure&gclid=Cj0KCQjwnrmlBhDHARIsADJ5b_kcYsjIFCG9t9mFJ1-3qSinhwgxrr984mnvDXI9r_XzL5FKmX9DZOcaAh75EALw_wcB", options);