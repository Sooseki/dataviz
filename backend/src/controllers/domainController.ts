import { Request, Response } from "express";
import Client from "../models/Client";
import Domain from "../models/Domain";
import { clientDomainExists } from "../utils/client";

export const createDomain = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { url, clientId } = req.body as { url: string | undefined, clientId: string | undefined };
        if(!url) throw new Error("missing url param");
        if(!clientId) throw new Error("missing clientId param");

        const client = await Client.findOne({_id: clientId }).populate("domains");
        if (!client) throw new Error("no client found");

        if (clientDomainExists(client, url)) throw new Error("domain already exists");

        const newDomain = await Domain.create({ url });
        if (!newDomain) throw new Error("new domain cound not be created");

        await Client.updateOne({_id: clientId }, {
            domains: [ ...client.domains, newDomain.id ]
        })
        return res.status(200).json(
            { 
                msg: "domain created successfully",
                client,
            });
    } catch (err) {
        if (err instanceof Error)
            return res.status(500).json({ msg: err.message });
        return res.status(500).json({ msg: "metrics could not be retrieved"});
    }
};
