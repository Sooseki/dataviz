import User from '../models/User'
import bcrypt from 'bcryptjs'
import { Request, Response } from 'express';
import { getToken } from '../utils/handleToken';

export const register = async (req: Request, res: Response): Promise<Response> => {
    const { name, role, email, password } = req.body

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ msg: "Email already used, take another one" })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            name,
            role,
            email,
            password: hashedPassword,
        });

        const payload = {
            user: {
                email, role, name
            },
        }

        const token = await getToken(payload)

        return res.status(200).json({ msg: "register sucessfull", token })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "something went wrong" });
    }
}

export const login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (user && user.password) {
            const isMatch = await bcrypt.compare(password, user?.password)
            if (!isMatch) {
                return res.status(400).json({ msg: "Incorrect password" })
            }

            const payload = {
                user: {
                    email, role: user.role, name: user.name
                },
            }
            const token = await getToken(payload)
            return res.status(200).json({ msg: "Loged in", token })
        }

        return res.status(400).json({ msg: "User do not exist" })

    } catch (err) {
        console.error(err)
        return res.status(500).json({ msg: "something went wrong" })
    }
}