import express from "express";
import { inscription, login } from "../controllers/userController";

export const userRoutes = () => {
    const router = express.Router();
    router.post('/inscription', inscription);
    router.post('/login', login)
    
    return router;
}