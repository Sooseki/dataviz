import { Request, Response } from "express";
import Client from "../models/Client";
import Domain from "../models/Domain";
import { clientDomainExists } from "../utils/client";
import { handleControllerErrors } from "../utils/handleControllerErrors";
import { runSimulationForDomains } from "../simulation-workers/simulationsHub";
import { IDomain, IClientPopulated, isValidUrl } from "@perfguardian/common";
import { getUserTokenIds } from "../utils/user";

export const createDomain = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { clientId } = getUserTokenIds(req);
        const { url } = req.body as {
            url: string | undefined;
            clientId: string | undefined;
        };

        const urlIsValid = isValidUrl(url);
        if (!urlIsValid)
            throw new Error("Domain could not be created. Wrong url param");
        if (!clientId || typeof clientId !== "string")
            throw new Error("Domain could not be created for this client.");

        const client: IClientPopulated | null = await Client.findOne({
            _id: clientId,
        }).populate("domains");
        if (!client)
            throw new Error("Domain could not be created. Client not found.");

        if (clientDomainExists(client, url))
            throw new Error("Domain already exists");

        const newDomain: IDomain = await Domain.create({ url });
        await Client.updateOne(
            { _id: clientId },
            {
                domains: [...client.domains, newDomain.id],
            }
        );
        const newDomainForSimulation = [newDomain];
        runSimulationForDomains(newDomainForSimulation);

        return res.status(200).json({ data: { domain: newDomain } });
    } catch (err) {
        return handleControllerErrors(err, res, "domain could not be created");
    }
};

export const getDomains = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { clientId } = getUserTokenIds(req);
        if (!clientId) throw new Error("Cannot get domains for this client.");

        const client = await Client.findOne({ _id: clientId });
        if (!client) throw new Error("Client not found.");

        const domains = await Domain.find({
            _id: { $in: client.domains },
        });

        return res.status(200).json({ data: { domains } });
    } catch (err) {
        return handleControllerErrors(err, res, "could not get domains");
    }
};

export const deleteDomain = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { id } = req.query as { id: string | undefined };

        await Domain.findByIdAndRemove(id);

        return res.status(200).json({ data: { deleted: true } });
    } catch (err) {
        return handleControllerErrors(err, res, "domain could not be created");
    }
};
