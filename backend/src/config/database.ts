import mongoose from "mongoose";
import { getEnvVariable } from '../utils/getEnvVariable';
export const connectDB = async () => {
    const uri = getEnvVariable('MONGODB_URI');
    try {
        if(!uri) throw new Error("MONGODB_URI not provided");
        await mongoose.connect(uri);
        console.log("Connexion à la base de données réussie");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
