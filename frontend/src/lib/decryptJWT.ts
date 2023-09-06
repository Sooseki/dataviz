import { User } from "@perfguardian/common/src/types";
export const decryptJWT = (token: string): User => {
    const parts = token.split(".");
    if (parts.length !== 3) {
        throw new Error("JWT must have 3 parts");
    }
    const payload = parts[1];
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload.user;
};
