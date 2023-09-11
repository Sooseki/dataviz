import express from "express";
import { authJwt } from "../middleware/authJwt";
import {
    createDomain,
    deleteDomain,
    getDomains,
} from "../controllers/domainController";

export const domainRoutes = () => {
    const router = express.Router();
    router.post("/create", authJwt, createDomain);
    router.delete("", authJwt, deleteDomain);
    router.get("", authJwt, getDomains);

    return router;
};
