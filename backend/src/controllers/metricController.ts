import { Request, Response } from "express";
import { simulationhub } from "../simulation-workers/simulationsHub";
import Dataset from "../models/Dataset";
import Domain from "../models/Domain";

export const createMetric = async (req: Request, res: Response): Promise<Response> => {
    try {
        const url = req.body.url;
        const metrics = await simulationhub(url);
    
        const dataset = await Dataset.create({
            date: new Date(),
            timeToLoad: metrics.timeToLoad,
        });

        let domain = await Domain.findOne({url});
        if (!domain) {
            domain = await Domain.create({
                url
            });
        }
        await Domain.updateOne({_id: domain.id},{
            datasets: [
                ...domain.datasets,
                dataset.id
            ],
        });

        return res.status(200).json({ msg: "metrics creation sucessfull", metrics });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "something went wrong in metrics creation" });
    }

};