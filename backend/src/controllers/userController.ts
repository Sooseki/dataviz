import User from "../models/User";
import Client from "../models/Client";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { getToken } from "../utils/handleToken";
import { handleControllerErrors } from "../utils/handleControllerErrors";
import { getUserTokenIds } from "../utils/user";

export const register = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const { name, email, password, company } = req.body;
    const role = "administrator";
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("Email already used, take another one");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            role,
            email,
            password: hashedPassword,
        });

        const existingClient = await Client.findOne({ name: company });
        if (existingClient) {
            throw new Error("Company already registered !");
        }

        const client = await Client.create({
            name: company,
            users: [user.id],
        });

        const payload = {
            user: {
                email,
                role: user.role,
                name: user.name,
                id: user.id,
                client: { name: client.name, id: client._id.toString() },
            },
        };

        const token = await getToken(payload);

        return res
            .status(200)
            .json({ data: { msg: "register sucessfull", token } });
    } catch (err) {
        return handleControllerErrors(
            err,
            res,
            "Something went wrong in registration"
        );
    }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User does not exist");
        }

        const client = await Client.findOne({ users: user._id });
        if (!client) {
            throw new Error("Client does not exist");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Incorrect password");
        }

        const payload = {
            user: {
                email,
                role: user.role,
                name: user.name,
                id: user.id,
                client: { name: client.name, id: client._id.toString() },
            },
        };

        const token = await getToken(payload);
        return res.status(200).json({ data: { msg: "Logged in", token } });
    } catch (err) {
        return handleControllerErrors(err, res, "something went wrong");
    }
};

export const updatePassword = async (req: Request, res: Response) => {
    const { userId } = getUserTokenIds(req);
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("user not found");

        const salt = await bcrypt.genSalt(10);
        const isCurrentPasswordValid = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isCurrentPasswordValid)
            throw new Error("current password is not valid");
        const newHashedPassword = await bcrypt.hash(newPassword, salt);

        await User.updateOne(
            { _id: user.id },
            {
                password: newHashedPassword,
            }
        );

        return res.status(200).json({ data: { msg: "register new password" } });
    } catch (err) {
        return handleControllerErrors(
            err,
            res,
            "An error occurred while updating the password"
        );
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { userId } = getUserTokenIds(req);
    const { name: newName, email: newEmail } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("user not found");
        }
        const propertiesToUpdate: { email?: string; name?: string } = {};
        if (newEmail) {
            const existingUser = await User.findOne({ email: newEmail });
            if (existingUser) {
                throw new Error("Email already used, take another one");
            }
            propertiesToUpdate.email = newEmail;
        }

        if (newName) {
            propertiesToUpdate.name = newName;
        }

        await User.updateOne(
            { _id: user.id },
            {
                ...propertiesToUpdate,
            }
        );

        return res.status(200).json({
            data: {
                msg: "register new user info sucessfull",
                userUpdated: { name: newName, email: newEmail },
            },
        });
    } catch (err) {
        return handleControllerErrors(
            err,
            res,
            "An error occurred while updating the user"
        );
    }
};

export const create = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const { clientId } = getUserTokenIds(req);
    const { email, password, name, role } = req.body;

    try {
        if (!clientId) throw new Error("Cannot create user for this client");

        const existingUser = await User.findOne({ email });
        if (existingUser)
            throw new Error("Email already used, user already created");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            role,
            email,
            password: hashedPassword,
        });

        const client = await Client.findByIdAndUpdate(
            clientId,
            { $push: { users: user._id } },
            { new: true }
        );

        if (!client) {
            throw new Error("Client not found");
        }

        return res
            .status(200)
            .json({ data: { msg: "User creation sucessfull", user } });
    } catch (err) {
        return handleControllerErrors(
            err,
            res,
            "Something went wrong in user creation"
        );
    }
};

export const get = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { clientId } = getUserTokenIds(req);
        const client = await Client.findById(clientId).populate("users");

        if (!client) {
            throw new Error("Client not found");
        }

        return res.status(200).json({
            data: {
                msg: "User recuperation is a sucess",
                users: client.users,
            },
        });
    } catch (err) {
        return handleControllerErrors(
            err,
            res,
            "Something went wrong while fetching users"
        );
    }
};
