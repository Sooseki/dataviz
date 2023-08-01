import User from "../models/User";
import Client from "../models/Client";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { getToken } from "../utils/handleToken";
import { handleControllerErrors } from "../utils/handleControllerErrors";

export const register = async (req: Request, res: Response): Promise<Response> => {
    const { name, email, password, company } = req.body;
    const role = "administrator";
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
        
        const payload = {           
            user: {
                email, role: user.role, name: user.name, id: user.id,
                client: { name: client.name, id: client._id.toString() }
            },
        };
        const token = await getToken(payload);

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

        if (!user) {
            return res.status(400).json({ msg: "User does not exist" });
        }

        const client = await Client.findOne({ users: user._id});

        if (!client) {
            return res.status(400).json({ msg: "Client does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Incorrect password" });
        }

        const payload = {
            user: {
                email, role: user.role, name: user.name, id: user.id,
                client: { name: client.name, id: client._id.toString()}
            },
        };

        const token = await getToken(payload);
        return res.status(200).json({ msg: "Logged in", token });
    } catch (err) {
        // TODO : remove this log
        console.error(err);
        return res.status(500).json({ msg: "something went wrong" });
    }
};

export const create = async (req: Request, res: Response): Promise<Response> => {
    const { email, password, name, clientId, role } = req.body;
    try {
        if (!clientId) {
            throw new Error("ClientId is missing");
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("Email already used, user already created");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            role,
            email,
            password: hashedPassword,
        });
        //TODO Setup cette requete dans tout le code
        const client = await Client.findByIdAndUpdate(
            clientId,
            { $push: { users: user._id } },
            { new: true }
        );
        if (!client) {
            throw new Error("Client not found");
        }

        return res.status(200).json({ msg: "User creation sucessfull", user });
    } catch (err) { return handleControllerErrors(err, res, "Something went wrong in user creation");}
};

export const get = async (req: Request, res: Response): Promise<Response> => {
    const { clientId } = req.query as { clientId: string | undefined };

    try {
        const client = await Client.findById(clientId).populate("users");
        
        if (!client) {
            throw new Error("Client not found");
        }

        return res.status(200).json({ msg: "User recuperation is a sucess", users: client.users });
    } catch (err) { return handleControllerErrors(err, res, "Something went wrong while fetching users");}
};