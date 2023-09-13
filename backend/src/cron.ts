import cron from "node-cron";
import { runSimulationForAllDomains } from "./simulation-workers/simulationsHub";

const createMetricsForAllDomains = () => {
    cron.schedule("0 */6 * * *", () => {
        // runs every 6 hours
        runSimulationForAllDomains();
    });
};

export { createMetricsForAllDomains };
