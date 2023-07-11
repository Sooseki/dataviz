import express from "express";
import { createMetric } from "../controllers/metricController";

export const metricRoutes = () => {
    const router = express.Router();
    router.post("/create", createMetric);

    return router;
};