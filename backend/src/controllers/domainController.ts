import { Request, Response } from "express";
import Client from "../models/Client";
import Domain from "../models/Domain";
import { clientDomainExists } from "../utils/client";
import { handleControllerErrors } from "../utils/handleControllerErrors";
import { IClientPopulated } from "../types";

export const createDomain = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { url, clientId } = req.body as { url: string | undefined, clientId: string | undefined };
        if(!url || typeof url !== "string") throw new Error("wrong url param");
        if(!clientId || typeof clientId !== "string") throw new Error("wrong clientId param");

        const client: IClientPopulated | null = await Client.findOne({_id: clientId }).populate("domains");
        if (!client) throw new Error("no client found");

        if (clientDomainExists(client, url)) throw new Error("domain already exists");

        const newDomain = await Domain.create({ url });

        await Client.updateOne({_id: clientId }, {
            domains: [ ...client.domains, newDomain.id ]
        });
        return res.status(200).json({ domain: newDomain });
    } catch (err) { return handleControllerErrors(err, res, "domain could not be created") };
};

export const getDomains = async (req: Request, res: Response): Promise<Response> => {
    try {
        // TODO : get clientId from token
        const { clientId } = req.query as { clientId: string | undefined };
        if(!clientId || typeof clientId !== "string") throw new Error("wrong clientId param");

        const client = await Client.findOne({ _id: clientId });
        if(!client) throw new Error("no client found");

        const domains = await Domain.find({
            "_id": { "$in": client.domains }
        });

        return res.status(200).json({ domains });
    } catch (err) { return handleControllerErrors(err, res, "could not get domains"); }
};
