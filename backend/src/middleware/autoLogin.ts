/// AUTO LOGIN WITHOUT PUT EMAIL AND PASSWORD EVEN WITHOUT FORM 
import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { getToken } from "../utils/handleToken";
import jwt from "jsonwebtoken";
import { getEnvVariable } from "../utils/getEnvVariable";

export const AutoLogin = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        const jwtSecret = getEnvVariable("JWT_SECRET");

        if (!jwtSecret) {
            res.status(500).json({ msg: "Internal server error" });
            process.exit(1);
        }

        jwt.verify(token, jwtSecret, async (err, userDecoded): Promise<any> => {
            if (err) {
                next();
            } else {
                if(!userDecoded){
                    next();   
                }
                const user = await User.findOne({ email: userDecoded.user.email });

                if (!user) {
                    return res.status(401).json({ msg: "User not found" });
                } else {
                    const payload = {
                        user: {
                            email: user.email,
                            role: user.role,
                            name: user.name,
                            id: user.id,
                        },
                    };
                    const newToken = await getToken(payload);
                    return res.status(200).json({ msg: "Loged in auto mod", newToken });
                }
            }
        });
    } else {
        next();
    }
};