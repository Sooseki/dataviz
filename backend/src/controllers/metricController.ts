import { Request, Response } from "express";
import { runSimulation } from "../simulation-workers/simulationsHub";
import Dataset from "../models/Dataset";
import Domain from "../models/Domain";
import Client from "../models/Client";
import { handleControllerErrors } from "../utils/handleControllerErrors";
import { getUserTokenIds } from "../utils/user";

export const createMetric = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { clientId } = getUserTokenIds(req);
        const { id: domainId } = req.body as { id: string | undefined };

        if (!domainId || typeof domainId !== "string")
            throw new Error("wrong id param");

        const client = await Client.findById(clientId);
        if (!client) throw new Error(`Client not found`);

        const domain = await Domain.findById(domainId);
        if (!domain) throw new Error(`Domain not found`);

        if (!client.domains.includes(domain.id))
            throw new Error(`Cannot access this resource`);

        const metrics = await runSimulation([domain]);
        const dataset = await Dataset.create({
            date: new Date(),
            ...metrics[0].data,
        });

        await Domain.updateOne(
            { _id: domain.id },
            {
                datasets: [...domain.datasets, dataset.id],
            }
        );

        return res
            .status(200)
            .json({ data: { msg: "metrics creation sucessfull", metrics } });
    } catch (err) {
        return handleControllerErrors(
            err,
            res,
            "something went wrong in metrics creation"
        );
    }
};

export const getMetrics = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { clientId } = getUserTokenIds(req);
        const { domainId } = req.query as { domainId: string | undefined };

        if (!domainId || typeof domainId !== "string")
            throw new Error("Wrong domain id.");

        if (!clientId) throw new Error("Cannot get metrics for this client.");

        const domain = await Domain.findOne({ _id: domainId }).populate(
            "datasets"
        );
        if (!domain)
            throw new Error(
                `Could not find domain ${domainId} for this client`
            );

        const client = await Client.findOne({ _id: clientId });
        if (!client?.domains.find((domain) => domain.toString() === domainId))
            throw new Error("cannot access this resource");

        return res.status(200).json({ data: { metrics: domain.datasets } });
    } catch (err) {
        return handleControllerErrors(
            err,
            res,
            "metrics could not be retrieved"
        );
    }
};
