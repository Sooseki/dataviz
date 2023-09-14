import { Browser } from "puppeteer";

const testMetrics = async (url: string, browser: Browser) => {
    const website = await browser.newPage();

    await website.goto(url, { waitUntil: "networkidle0" });

    // Inject the web vitals library into the page
    await website.addScriptTag({
        url: "https://unpkg.com/web-vitals@2/dist/web-vitals.umd.js",
    });

    // Define 'webVitals' as a global variable in the page's context
    await website.evaluateOnNewDocument(() => {
        (window as any).webVitals = {
            getCLS: (callback: any) => {
                window.addEventListener("web-vitals:getCLS", (e) => {
                    callback(e.detail);
                });
            },
            getFID: (callback: any) => {
                window.addEventListener("web-vitals:getFID", (e) => {
                    callback(e.detail);
                });
            },
            getLCP: (callback: any) => {
                window.addEventListener("web-vitals:getLCP", (e) => {
                    callback(e.detail);
                });
            },
            getTTFB: (callback: any) => {
                window.addEventListener("web-vitals:getTTFB", (e) => {
                    callback(e.detail);
                });
            },
            getFCP: (callback: any) => {
                window.addEventListener("web-vitals:getFCP", (e) => {
                    callback(e.detail);
                });
            },
        };
    });

    // Listen for web vitals metrics from the page
    website.exposeFunction("onReport", ({ name, value }: any) => {
        console.log(`${name}: ${value}`);
    });

    await website.evaluate(() => {
        webVitals.getCLS(console.log);
        webVitals.getFID(console.log);
        webVitals.getLCP(console.log);
        webVitals.getTTFB(console.log);
        webVitals.getFCP(console.log);
    });

    await browser.close();
};

export default testMetrics;
