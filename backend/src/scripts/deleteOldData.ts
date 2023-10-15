// eslint-disable-next-line import/no-unresolved
import { connectDB } from "../config/database";
import Client from "../models/Client";

connectDB();

export async function deleteData(): Promise<void> {
    try {
        const deletedData = await Client.deleteMany({
            date: { $lt: new Date() },
        });

        console.log(`Supprimé ${deletedData.deletedCount} enregistrements.`);
    } catch (error) {
        console.error("Erreur lors de la suppression des données :", error);
    }
}
