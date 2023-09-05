import express from "express";
import { authJwt } from "../middleware/authJwt";
import { createDomain, getDomains } from "../controllers/domainController";

export const domainRoutes = () => {
    const router = express.Router();
    router.post("/create", authJwt, createDomain);
    router.get("", authJwt, getDomains);

    return router;
};
