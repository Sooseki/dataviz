import cron from "node-cron";
import { runSimulationForAllDomains } from "./simulation-workers/simulationsHub";

const createMetricsForAllDomains = () => {
    cron.schedule("0 2 * * *", () => {
        // runs every day at 2am
        runSimulationForAllDomains();
    });
};

export { createMetricsForAllDomains };
