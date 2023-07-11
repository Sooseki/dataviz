import { Request, Response } from "express";
import { simulationhub } from "../simulation-workers/simulationsHub";

export const createMetric = async (req: Request, res: Response): Promise<Response> => {
    console.log(res);
    const metrics = await simulationhub();
    return res.status(200).json({ msg: "register sucessfull", metrics });
};