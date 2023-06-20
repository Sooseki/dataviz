import { connect, connection } from "mongoose";
import { getEnvVariable } from '../utils/getEnvVariable';
import { loadSchemas } from "../models";
import User from "../models/User";
import Client from "../models/Client";
import Domain from "../models/Domain";

export const connectDB = async (): Promise<void> => {
    try {
        const uri = getEnvVariable('MONGODB_URI');
        if(!uri) throw new Error("MONGODB_URI not provided");
        connect(uri);
        loadSchemas();

        connection.on('connected', async () => {
            const clientDocuments = await connection.db.collection('clients').countDocuments();
            if(getEnvVariable('NODE_ENV') === "dev" && clientDocuments === 0) loadTestDatas();
        })

        // TODO : remove log
        console.log("Connexion à la base de données réussie");
    } catch (error) {
        // TODO : remove log
        console.error(error);
        process.exit(1);
    }
};

const loadTestDatas = async () => {
    const user = await User.create({
        name: "Manon Bonnet",
        role: "admin",
        email: "manon.bonnet.30@gmail.com",
        password: "manon",
    });

    const domain = await Domain.create({
        url: "https://test.com",
    });

    await Client.create({
        name: "company name",
        users: [user.id],
        domains: [domain.id],
    });
}