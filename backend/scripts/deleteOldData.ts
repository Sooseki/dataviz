// eslint-disable-next-line import/no-unresolved
import Client from "@/models/Client";
import mongoose, { ConnectOptions } from "mongoose";

const uri = "mongodb://127.0.0.1/guardian_db";

mongoose.connect(uri, {
    useUnifiedTopology: true,
} as ConnectOptions);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Erreur de connexion :"));
db.once("open", async () => {
    console.log("Connecté à la base de données.");
});

export async function deleteData(): Promise<void> {
    try {
        const deletedData = await Client.deleteMany({
            date: { $lt: new Date() },
        });

        console.log(`Supprimé ${deletedData.deletedCount} enregistrements.`);
    } catch (error) {
        console.error("Erreur lors de la suppression des données :", error);
    } finally {
        mongoose.connection.close();
    }
}
