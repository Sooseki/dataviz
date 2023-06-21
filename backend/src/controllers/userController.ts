import User from '../models/User'
import bcrypt from 'bcryptjs'
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import { getEnvVariable } from '../utils/getEnvVariable';


export const register = async (req: Request, res: Response): Promise<Response> => {
    const { name, role, email, password } = req.body
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ msg: "Email already use, take another one" })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user =  await User.create({
            name,
            role,
            email,
            password: hashedPassword,
        });
       
        const payload = {
            user: {
                id: user.id,
            },
        }
        const jwtSecret = getEnvVariable('JWT_SECRET')
        if (!jwtSecret) throw new Error('JWT_SECRET is not defined in the environment variables.');
        jwt.sign(payload, jwtSecret, { expiresIn: "1h" }, (err, token) => {
            if (err) throw err
        })

        return res.status(200).json({ msg: "inscription done !" })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "something went wrong :(" });
    }
}

export const login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (user && user.password) {
            const isMatch = await bcrypt.compare(password, user?.password)
            if (!isMatch) {
                return res.status(400).json({ msg: "Mot de passe incorrect" })
            }

            const payload = {
                user: {
                    id: user.id,
                },
            }
            const jwtSecret = getEnvVariable('JWT_SECRET')
            if (!jwtSecret) throw new Error('JWT_SECRET is not defined in the environment variables.');
            jwt.sign(payload, jwtSecret, { expiresIn: "1h" }, (err, token) => {
                if (err) throw err
            })
            return res.status(200).json({ msg: "Connexion réussie" })
        }

        return res.status(400).json({ msg: "L'utilisateur n'existe pas" })

    } catch (err) {
        console.error(err)
        return res.status(500).json({ msg: "something went wrong :" })
    }
}