import { connect } from "mongoose";
import { getEnvVariable } from "../utils/getEnvVariable";

export const connectDB = async (): Promise<void> => {
    try {
        const uri = getEnvVariable("MONGODB_URI");
        if(!uri) throw new Error("MONGODB_URI not provided");
        connect(uri);

    } catch (error) {
        process.exit(1);
    }
};