import dotenv from 'dotenv';
import express from "express";
import bodyParser from "body-parser";
// import {connectDB} from "./config/database"
import test from './config/test';
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
console.log(test);
// connectDB()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '100mb' }));
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
