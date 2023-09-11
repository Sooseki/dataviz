import { Request } from "express";
import jwt from "jsonwebtoken";
import { getEnvVariable } from "./getEnvVariable";

export const getUserTokenIds = (
    req: Request
): { userId?: string; clientId?: string } => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return {};

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, getEnvVariable("JWT_SECRET") ?? "");

    if (typeof decoded === "string" || !decoded.userId || !decoded.clientId)
        return {};

    return {
        userId: decoded.userId,
        clientId: decoded.clientId,
    };
};
