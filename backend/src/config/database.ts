import { connect } from "mongoose";
import { getEnvVariable } from "../utils/getEnvVariable";

export const connectDB = async (): Promise<void> => {
    try {
        const uri = getEnvVariable("MONGODB_URI");
        if(!uri) throw new Error("MONGODB_URI not provided");
        connect(uri);

        // TODO : remove log
        console.log("Connexion à la base de données réussie");
    } catch (error) {
        // TODO : remove log
        console.error(error);
        process.exit(1);
    }
};