import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { connectDB } from "./config/database";
import { getEnvVariable } from "./utils/getEnvVariable";
import { userRoutes } from "./routes/userRoutes";

const app = express();
const port = getEnvVariable("PORT");

connectDB();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    origin: getEnvVariable("ALLOWED_ORIGIN"),
    optionsSuccessStatus: 200,
    methods: ["GET","POST","DELETE","UPDATE","PUT","PATCH"]
}));

app.use("/users", userRoutes());
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});