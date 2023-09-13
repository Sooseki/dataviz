import cron from "node-cron";
import { runSimulationForAllDomains } from "./simulation-workers/simulationsHub";

const createMetricsForAllDomains = () => {
    cron.schedule("*/5 * * * *", () => {
        // runs every 6 hours
        runSimulationForAllDomains();
    });
};

export { createMetricsForAllDomains };
