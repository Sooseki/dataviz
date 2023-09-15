import jwt from "jsonwebtoken";
import { getEnvVariable } from "../utils/getEnvVariable";
import { Request, Response, NextFunction } from "express";

export const authJwt = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.sendStatus(401);
        return;
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = getEnvVariable("JWT_SECRET");
    if (!jwtSecret) {
        res.status(500).json({ msg: "Internal server error" });
        return;
    }

    jwt.verify(token, jwtSecret, (err) => {
        if (err && err.name === "TokenExpiredError" && authHeader) {
            console.log("TokenExpiredError");
            jwt.verify(authHeader, jwtSecret, (refreshErr, refreshUser) => {
                if (refreshErr) {
                    res.status(403).json({ msg: "Invalid refresh token" });
                    return;
                }
                const newToken = jwt.sign({ user: refreshUser }, jwtSecret, {
                    expiresIn: "1m",
                });
                console.log("token refreshed");
                console.log(newToken)
                // res.setHeader("x-new-token", newToken);
                next();
            });
        } else if (err) {
            res.redirect('/login');
            return;
        }
        next();
    });
};
