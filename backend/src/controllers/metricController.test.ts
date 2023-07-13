const mSimulationHub = jest.fn();
jest.mock("../simulation-workers/simulationsHub", () => ({
    simulationhub: mSimulationHub,
}));

import { mClientFindOne, mDatasetCreate, mDomainCreate, mDomainFindOne, mDomainUpdateOne } from "../tests/test-utils";
import { IDataset } from "../types";
import { createMetric, getMetrics } from "./metricController";
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
        expect(mJson).toHaveBeenCalledWith({ error: "something went wrong in metrics creation"});
    });

    it("should return 500 error status if url param undefined", async () => {
        const req = { body: {} } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;
        const error = "error: couldn't get simulationhub";
        mSimulationHub.mockRejectedValueOnce(error);
        
        await createMetric(req, res);

        expect(mSimulationHub).toHaveBeenCalledTimes(0);
        expect(mDatasetCreate).toHaveBeenCalledTimes(0);
        expect(mDomainFindOne).toHaveBeenCalledTimes(0);
        expect(mDomainCreate).toHaveBeenCalledTimes(0);
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);
        expect(mJson).toHaveBeenCalledWith({ error: "wrong url param"});
    });
});

describe("getMetrics", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should retrieve all the metrics", async () => {
        const domainId = "domainIdTest";
        const clientId = "clientIdTest";
        const req = { body: { domainId, clientId } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus} as unknown as Response;
        const mDomain = {
            id: domainId,
            url: "domainUrl1",
            datasets: "datasetsTest",
        };
        const mClient = {
            id: "clientIdTest",
            name: "clientNameTest",
            domains: [domainId],
        };
        
        const mPopulate = jest.fn();
        mDomainFindOne.mockImplementationOnce(() => ({ populate: mPopulate }));
        mPopulate.mockResolvedValueOnce(mDomain);
        mClientFindOne.mockResolvedValueOnce(mClient);
        await getMetrics(req, res);

        expect(mDomainFindOne).toHaveBeenCalledTimes(1);
        expect(mDomainFindOne).toHaveBeenCalledWith({_id: domainId });
        expect(mClientFindOne).toHaveBeenCalledTimes(1);
        expect(mClientFindOne).toHaveBeenCalledWith({_id: clientId });
        expect(mPopulate).toHaveBeenCalledTimes(1);
        expect(mPopulate).toHaveBeenCalledWith("datasets");
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(200);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ metrics: "datasetsTest"});
    });

    it("should return an error if wrong domainId param", async () => {
        const domainId = 1234;
        const clientId = "clientIdTest";
        const req = { body: { domainId, clientId } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus} as unknown as Response;
        
        await getMetrics(req, res);

        expect(mDomainFindOne).toHaveBeenCalledTimes(0);
        expect(mClientFindOne).toHaveBeenCalledTimes(0);
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ error: "domainId must be a string"});
    });

    it("should return an error if wrong clientId param", async () => {
        const domainId = "domainIdTest";
        const clientId = "";
        const req = { body: { domainId, clientId } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus} as unknown as Response;
        
        await getMetrics(req, res);

        expect(mDomainFindOne).toHaveBeenCalledTimes(0);
        expect(mClientFindOne).toHaveBeenCalledTimes(0);
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ error: "clientId must be a string"});
    });

    
    it("should return an error if no domain found", async () => {
        const domainId = "domainIdTest";
        const clientId = "clientIdTest";
        const req = { body: { domainId, clientId } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus} as unknown as Response;
        
        const mPopulate = jest.fn();
        mDomainFindOne.mockImplementationOnce(() => ({ populate: mPopulate }));
        mPopulate.mockResolvedValueOnce(undefined);
        await getMetrics(req, res);

        expect(mDomainFindOne).toHaveBeenCalledTimes(1);
        expect(mDomainFindOne).toHaveBeenCalledWith({_id: domainId });
        expect(mPopulate).toHaveBeenCalledTimes(1);
        expect(mPopulate).toHaveBeenCalledWith("datasets");
        expect(mClientFindOne).toHaveBeenCalledTimes(0);
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ error: "could not find domain domainIdTest for client clientIdTest"});
    });

    it("should return an error if domain is not cient's", async () => {
        const domainId = "domainIdTest";
        const clientId = "clientIdTest";
        const req = { body: { domainId, clientId } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus} as unknown as Response;
        const mDomain = {
            id: domainId,
            url: "domainUrl1",
            datasets: "datasetsTest",
        };
        const mClient = {
            id: "clientIdTest",
            name: "clientNameTest",
            domains: ["otherDomainId"],
        };

        const mPopulate = jest.fn();
        mDomainFindOne.mockImplementationOnce(() => ({ populate: mPopulate }));
        mPopulate.mockResolvedValueOnce(mDomain);
        mClientFindOne.mockResolvedValueOnce(mClient);
        await getMetrics(req, res);

        expect(mDomainFindOne).toHaveBeenCalledTimes(1);
        expect(mPopulate).toHaveBeenCalledTimes(1);
        expect(mClientFindOne).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ error: "cannot access this resource"});
    });
});
