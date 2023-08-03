import express from "express";
import { register, login, updateUser, updatePassword } from "../controllers/userController";
import { authJwt } from "../middleware/authJwt";
// import { AutoLogin } from "../middleware/autoLogin";
import { register, login, create, get } from "../controllers/userController";

export const userRoutes = () => {
    const router = express.Router();
    router.post("/register", register);
    router.post("/login", login);
    router.post("/create", create);
    router.get("", get);
    
    router.put("/update",authJwt, updateUser);
    router.put("/password", authJwt, updatePassword);

    return router;
};