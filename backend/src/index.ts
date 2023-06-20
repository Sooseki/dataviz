import express from "express";
import bodyParser from "body-parser";
import { connectDB } from "./config/database"
import { getEnvVariable } from './utils/getEnvVariable';

const app = express();
const port = getEnvVariable('PORT');

connectDB()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.json({ limit: '100mb' }));

app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});