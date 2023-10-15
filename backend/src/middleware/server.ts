import express, { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { userRoutes } from "../routes/userRoutes";
import { JwtPayload } from "jsonwebtoken";

dotenv.config();

const app = express();
const port = 3003;

app.use(express.json());

const accessTokenSecret: jwt.Secret =
    process.env.ACCESS_TOKEN_SECRET || "secret_access_token";
const refreshTokenSecret: jwt.Secret =
    process.env.REFRESH_TOKEN_SECRET || "secret_refresh_token";

// Middleware pour vérifier le token de rafraîchissement
declare module "express-serve-static-core" {
    interface Request {
        user: jwt.JwtPayload;
    }
}
async function verifyRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: "Token de rafraîchissement manquant" });
        return;
    }

    const token = authHeader.split(" ")[1] as string;

    try {
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, refreshTokenSecret, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });

        req.user = decoded as JwtPayload;
        next();
    } catch (err) {
        next(err);
    }
}

// Route pour le rafraîchissement du token d'accès
app.post("/refresh", verifyRefreshToken, (req, res) => {
    const user = req.user as JwtPayload;
    const accessToken = jwt.sign(user, accessTokenSecret, {
        expiresIn: "1h",
    });
    res.json({ access_token: accessToken });
});

// Utilisez les routes utilisateur sans préfixe "/user"
app.use("/", userRoutes());

app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
