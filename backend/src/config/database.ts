import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        if(!process.env.MONGODB_URI) throw new Error("MONGODB_URI not provided");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connexion à la base de données réussie");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
