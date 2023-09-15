import { getEnvVariable } from "./getEnvVariable";
import jwt from "jsonwebtoken";

export const getToken = async (
    payload: string | object | Buffer
): Promise<string> => {
    const jwtSecret = getEnvVariable("JWT_SECRET");
    if (!jwtSecret)
        throw new Error(
            "JWT_SECRET is not defined in the environment variables."
        );
    return await new Promise<string>((resolve) => {
        jwt.sign(payload, jwtSecret, { expiresIn: "1m" }, (err, token) => {
            if (err) throw err;
            if (!token) throw new Error("miss token");
            resolve(token);
        });
    });
};
