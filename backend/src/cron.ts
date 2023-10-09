import cron from "node-cron";
import { runSimulationForAllDomains } from "./simulation-workers/simulationsHub";
import { deleteData } from "../scripts/deleteOldData";

const createMetricsForAllDomains = () => {
    cron.schedule("0 */6 * * *", () => {
        // runs every 6 hours
        const maxCronExecute = 9000;
        const cronTimeout = setTimeout(() => {
            console.log('Dépassement de la limite du temps');

        }, maxCronExecute);

        runSimulationForAllDomains()
        .then(() =>{
            clearTimeout(cronTimeout);
            console.log("Le cron est exécuté avec succées");
        })
        .catch((error) =>{
            clearTimeout(cronTimeout);
            console.error("Erreur lors de l'éxécution de la tçache cron :" ,error);
        })
    });
};
const deleteOldData = () => {
    cron.schedule("0 0 1 */3 *", () => {
        // runs every 3 months
        deleteData();
    });
};

export { createMetricsForAllDomains };
export { deleteOldData };
