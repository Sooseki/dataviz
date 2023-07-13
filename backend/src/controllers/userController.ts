import User from "../models/User";
import Client from "../models/Client";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { getToken } from "../utils/handleToken";
import { benchJWT } from "../utils/benchJwt";

export const register = async (req: Request, res: Response): Promise<Response> => {
    const { name, email, password, company } = req.body;
    const role = "admin";
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "Email already used, take another one" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            role,
            email,
            password: hashedPassword,
        });

        await Client.create({
            name: company,
            users: [user.id]
        });

        const payload = { user: { email, role, name, id: user.id, }, client: { name } };
        const token = await getToken(payload);
        benchJWT(token);
        return res.status(200).json({ msg: "register sucessfull", token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "something went wrong" });
    }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && user.password) {
            const isMatch = await bcrypt.compare(password, user?.password);
            if (!isMatch) {
                return res.status(400).json({ msg: "Incorrect password" });
            }
            
            const payload = {
                user: {
                    email, role: user.role, name: user.name, id: user.id,
                },
            };
            const token = await getToken(payload);
            benchJWT(token);
            console.log("its sounds good");
            return res.status(200).json({ msg: "Loged in", token });
        }

        return res.status(400).json({ msg: "User do not exist" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "something went wrong" });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { name: newName, email: newEmail, id } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        } else {
            if (newEmail) {
                const existingUser = await User.findOne({ email : newEmail });
                if (existingUser) {
                    return res.status(400).json({ msg: "Email already used, take another one" });
                } else {
                    user.email = newEmail;
                }
            }

            if (newName) {
                user.name = newName;
            }
            await user.save();

            return res.status(200).json({ msg: "User updated successfully" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "An error occurred while updating the user" });
    }
};