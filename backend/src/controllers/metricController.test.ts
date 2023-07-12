const mSimulationHub = jest.fn();
const mDatasetCreate = jest.fn();
const mDomainCreate = jest.fn();
const mDomainFindOne = jest.fn();
const mDomainUpdateOne = jest.fn();
jest.mock("../simulation-workers/simulationsHub", () => ({
    simulationhub: mSimulationHub,
}));
jest.mock("../models/Dataset", () => ({
    create: mDatasetCreate,
}));
jest.mock("../models/Domain", () => ({
    create: mDomainCreate, findOne: mDomainFindOne, updateOne: mDomainUpdateOne,
}));

import { IDataset } from "../types";
import { createMetric } from "./metricController";
import { Request, Response } from "express";

describe("createMetric", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
    });
    afterEach(() => {
        jest.useRealTimers();
    });

    it("should return the metrics to the user", async () => {
        const url = "urlTest";
        const req = { body: { url } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus} as unknown as Response;
        const simulationhubResponse: IDataset = {
            timeToLoad: 0.760524,
        };
        mSimulationHub.mockResolvedValueOnce(simulationhubResponse);
        mDomainFindOne.mockResolvedValueOnce({
            id: "domainId",
            datasets: ["datasetId1", "datasetId2"]
        });
        mDatasetCreate.mockResolvedValueOnce({id: "newDatasetId"});

        await createMetric(req, res);

        expect(mSimulationHub).toHaveBeenCalledTimes(1);
        expect(mSimulationHub).toHaveBeenCalledWith(url);

        expect(mDatasetCreate).toHaveBeenCalledTimes(1);
        expect(mDatasetCreate).toHaveBeenCalledWith({
            date: new Date("2020-01-01"),
            timeToLoad: 0.760524,
        });
        expect(mDomainFindOne).toHaveBeenCalledTimes(1);
        expect(mDomainFindOne).toHaveBeenCalledWith({url});
        expect(mDomainCreate).toHaveBeenCalledTimes(0);
        expect(mDomainUpdateOne).toHaveBeenCalledWith({ _id: "domainId" }, { datasets: ["datasetId1", "datasetId2", "newDatasetId"]});
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(200);
        expect(mJson).toHaveBeenCalledWith({ msg: "metrics creation sucessfull", metrics: simulationhubResponse});
    });

    it("should return the metrics to the user if domain doesn't exist", async () => {
        const url = "urlTest";
        const req = { body: { url } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;
        const simulationhubResponse: IDataset = {
            timeToLoad: 0.760524,
        };
        mSimulationHub.mockResolvedValueOnce(simulationhubResponse);
        mDomainFindOne.mockResolvedValueOnce(undefined);
        mDatasetCreate.mockResolvedValueOnce({ id: "newDatasetId" });
        mDomainCreate.mockResolvedValueOnce({ id: "newDomainId", datasets: ["datasetId1", "datasetId2"]});

        await createMetric(req, res);

        expect(mSimulationHub).toHaveBeenCalledTimes(1);
        expect(mSimulationHub).toHaveBeenCalledWith(url);

        expect(mDatasetCreate).toHaveBeenCalledTimes(1);
        expect(mDatasetCreate).toHaveBeenCalledWith({
            date: new Date("2020-01-01"),
            timeToLoad: 0.760524,
        });
        expect(mDomainFindOne).toHaveBeenCalledTimes(1);
        expect(mDomainFindOne).toHaveBeenCalledWith({ url });
        expect(mDomainCreate).toHaveBeenCalledTimes(1);
        expect(mDomainCreate).toHaveBeenCalledWith({ url });
        
        expect(mDomainUpdateOne).toHaveBeenCalledWith({ _id: "newDomainId" }, { datasets: ["datasetId1", "datasetId2", "newDatasetId"] });
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(200);
        expect(mJson).toHaveBeenCalledWith({ msg: "metrics creation sucessfull", metrics: simulationhubResponse });
    });

    it("should return 500 error status if simulationhub fails", async () => {
        const url = "urlTest";
        const req = { body: { url } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;
        const error = "error: couldn't get simulationhub";
        mSimulationHub.mockRejectedValueOnce(error);
        
        await createMetric(req, res);

        expect(mSimulationHub).toHaveBeenCalledTimes(1);
        expect(mSimulationHub).toHaveBeenCalledWith(url);

        expect(mDatasetCreate).toHaveBeenCalledTimes(0);
        expect(mDomainFindOne).toHaveBeenCalledTimes(0);
        expect(mDomainCreate).toHaveBeenCalledTimes(0);

        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);
        expect(mJson).toHaveBeenCalledWith({ msg: "something went wrong in metrics creation"});
    });
});