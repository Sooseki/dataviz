import express from "express";
import { createDomain, getDomains } from "../controllers/domainController";

export const domainRoutes = () => {
    const router = express.Router();
    router.post("/create", createDomain);
    router.get("", getDomains);

    return router;
};