import express from "express";
import { register, login, create, get } from "../controllers/userController";

export const userRoutes = () => {
    const router = express.Router();
    router.post("/register", register);
    router.post("/login", login);
    router.post("/create", create);
    router.get("", get);
    
    return router;
};