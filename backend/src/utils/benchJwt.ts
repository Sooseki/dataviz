// import jwt from 'jsonwebtoken'
import { getEnvVariable } from "./getEnvVariable";
export const benchJWT = async (token: string) => {
    const jwtSecret = getEnvVariable('JWT_SECRET')
    if (!jwtSecret) throw new Error('JWT_SECRET is not defined in the environment variables.');
    try {
        // const decodedJWT = jwt.verify(token, jwtSecret);
        console.log(token)
    } catch (err) {
        console.error(err);
    }
}
