import express from "express";
import { register, login, updateUser } from "../controllers/userController";
import { authJwt } from "../middleware/authJwt";
import { AutoLogin } from "../utils/autoLogin";

export const userRoutes = () => {
    const router = express.Router();
    router.post('/register', register);
    router.post('/login', AutoLogin, login)
    router.post('/update',authJwt, updateUser)
    
    return router;
};