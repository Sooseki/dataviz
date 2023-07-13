import express from "express";
import { createDomain } from "../controllers/domainController";

export const domainRoutes = () => {
    const router = express.Router();
    router.post("/create", createDomain);

    return router;
};