import { Request, Response } from "express";
import { simulationhub } from "../simulation-workers/simulationsHub";
import Dataset from "../models/Dataset";
import Domain from "../models/Domain";
import Client from "../models/Client";

export const createMetric = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { url } = req.body as { url: string | undefined };
        if (!url) throw new Error("url required to retrieve data");
        const metrics = await simulationhub(url);
        const dataset = await Dataset.create({
            date: new Date(),
            ...metrics,
        });
        const domain = await Domain.findOne({ url }) ?? await Domain.create({ url });

        await Domain.updateOne({_id: domain.id},{
            datasets: [
                ...domain.datasets,
                dataset.id
            ],
        });

        return res.status(200).json({ msg: "metrics creation sucessfull", metrics });
    } catch (err) {
        /**REMOVE CLG AFTER TESTING */
        console.error(err);
        return res.status(500).json({ msg: "something went wrong in metrics creation" });
    }
};

export const getMetrics = async (req: Request, res: Response): Promise<Response> => {
    try {
        // TODO : use token instead to get clientId to make sure user has only access to his own resources
        const { domainId, clientId } = req.body as { domainId: string | undefined, clientId: string | undefined };
        if(!domainId) throw new Error("missing domainId param");
        if(!clientId) throw new Error("missing clientId param");

        const domain = await Domain.findOne({_id: domainId }).populate("datasets");
        if(!domain) throw new Error(`could not find domain ${domainId} for client ${clientId}`);

        const client = await Client.findOne({_id: clientId });
        if (!client?.domains.find((domain) => domain.toString() === domainId))
            throw new Error("cannot access this resource");

        return res.status(200).json(
            { 
                msg: "metrics retrieved successfully",
                metrics: domain.datasets,
            }
        );
    } catch (err) {
        if (err instanceof Error)
            return res.status(500).json({ msg: err.message });
        return res.status(500).json({ msg: "metrics could not be retrieved"});
    }
};
