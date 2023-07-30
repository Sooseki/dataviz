import User from "../models/User";
import Client from "../models/Client";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { getToken } from "../utils/handleToken";

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
        const client = await Client.create({
            name: company,
            users: [user.id]
        });
        
        const payload = { user: { email, role, name, }, client: { name, users: [user.id] }};
        console.log("register user",payload);
        const token = await getToken(payload);

        return res.status(200).json({ msg: "register sucessfull", token, user, client});
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "something went wrong" });
    }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        const client = await Client.findOne({ _id: user?._id});
        console.log("backend user", user?._id);
        //console.log("backend client", client);

        if (user && user.password) {
            const isMatch = await bcrypt.compare(password, user?.password);
            if (!isMatch) {
                return res.status(400).json({ msg: "Incorrect password" });
            }

            const payload = {
                user: {
                    email, role: user.role, name: user.name
                },
                client: { name: client?.name, id: client?.id }
            };
            const token = await getToken(payload);
            return res.status(200).json({ msg: "Logged in", token, user, client });
        }

        return res.status(400).json({ msg: "User do not exist" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "something went wrong" });
    }
};