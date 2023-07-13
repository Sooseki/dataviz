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
            process.exit(1);
        }

        jwt.verify(token, jwtSecret, (err) => {
            if (err) {
                console.log("err =>");
                console.error(err);
                res.status(403).json({ msg: "Invalid token" });
                process.exit(1);
            }
            next();
        });
    } else {
        res.sendStatus(401);
        process.exit(1);
    }
};
