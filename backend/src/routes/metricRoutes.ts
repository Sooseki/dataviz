import express from "express";
import { createMetric, getMetrics } from "../controllers/metricController";

export const metricRoutes = () => {
    const router = express.Router();
    router.post("/create", createMetric);
    router.get("", getMetrics);

    return router;
};