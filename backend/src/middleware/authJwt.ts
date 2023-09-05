import jwt from "jsonwebtoken";
import { getEnvVariable } from "../utils/getEnvVariable";
import { Request, Response, NextFunction } from "express";

export const authJwt = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        const jwtSecret = getEnvVariable("JWT_SECRET");
        if (!jwtSecret) {
            res.status(500).json({ msg: "Internal server error" });
            return;
        }

        jwt.verify(token, jwtSecret, (err) => {
            if (err) {
                res.status(403).json({ msg: "Invalid token" });
                console.log("Invalid token");
                return;
            }
            next();
        });
    } else {
        res.sendStatus(401);
        return;
    }
};
