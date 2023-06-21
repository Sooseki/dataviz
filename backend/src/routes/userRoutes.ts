import express from "express";
import { register, login } from "../controllers/userController";

export const userRoutes = () => {
    const router = express.Router();
    router.post('/register', register);
    router.post('/login', login)
    
    return router;
}