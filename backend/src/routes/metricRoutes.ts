import express from "express";
import { authJwt } from "../middleware/authJwt";
import { createMetric, getMetrics } from "../controllers/metricController";

export const metricRoutes = () => {
    const router = express.Router();
    router.post("/create", authJwt, createMetric);
    router.get("", authJwt, getMetrics);

    return router;
};