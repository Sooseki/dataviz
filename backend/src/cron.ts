import cron from "node-cron";
import { runSimulationForAllDomains } from "./simulation-workers/simulationsHub";
import { deleteData } from "../scripts/deleteOldData";

const createMetricsForAllDomains = () => {
    cron.schedule("0 */6 * * *", () => {
        // runs every 6 hours
        runSimulationForAllDomains();
    });
};
const deleteOldData = () => {
    cron.schedule("0 0 1 */3 *", () => {
        // runs every 6 hours
        deleteData();
    });
};

export { createMetricsForAllDomains };
export { deleteOldData };
