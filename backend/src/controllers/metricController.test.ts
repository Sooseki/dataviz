const mRunSimulationForDomains = jest.fn();
jest.mock("../simulation-workers/simulationsHub", () => ({
    runSimulationForDomains: mRunSimulationForDomains,
}));

import { mClientFindOne, mDatasetCreate, mDomainCreate, mDomainFindOne, mDomainUpdateOne } from "../tests/test-utils";
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
        const simulationhubResponse = [{ data: { timeToLoad: 0.760524 } }];
        const mDomain = {
            id: "domainId",
            datasets: ["datasetId1", "datasetId2"]
        }
        mRunSimulationForDomains.mockResolvedValueOnce(simulationhubResponse);
        mDomainFindOne.mockResolvedValueOnce(mDomain);
        mDatasetCreate.mockResolvedValueOnce({id: "newDatasetId"});

        await createMetric(req, res);

        expect(mRunSimulationForDomains).toHaveBeenCalledTimes(1);
        expect(mRunSimulationForDomains).toHaveBeenCalledWith([mDomain]);

        expect(mDatasetCreate).toHaveBeenCalledTimes(1);
        expect(mDatasetCreate).toHaveBeenCalledWith({
            date: new Date("2020-01-01"),
            timeToLoad: 0.760524,
        });
        expect(mDomainFindOne).toHaveBeenCalledTimes(1);
        expect(mDomainFindOne).toHaveBeenCalledWith({url});
        expect(mDomainUpdateOne).toHaveBeenCalledWith({ _id: "domainId" }, { datasets: ["datasetId1", "datasetId2", "newDatasetId"]});
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(200);
        expect(mJson).toHaveBeenCalledWith({ msg: "metrics creation sucessfull", metrics: simulationhubResponse});
    });

    it("should return 500 error status if domain doesn't exist", async () => {
        const url = "urlTest";
        const req = { body: { url } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;
        const simulationhubResponse = [{ data: { timeToLoad: 0.760524 } }];
        mRunSimulationForDomains.mockResolvedValueOnce(simulationhubResponse);
        mDomainFindOne.mockResolvedValueOnce(undefined);

        await createMetric(req, res);

        expect(mDomainFindOne).toHaveBeenCalledTimes(1);
        expect(mDomainFindOne).toHaveBeenCalledWith({ url });
        expect(mRunSimulationForDomains).toHaveBeenCalledTimes(0);
        expect(mDatasetCreate).toHaveBeenCalledTimes(0);
        expect(mDomainUpdateOne).toHaveBeenCalledTimes(0);
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);
        expect(mJson).toHaveBeenCalledWith({ error: "Domain urlTest not found"});
    });

    it("should return 500 error status if simulationhub fails", async () => {
        const url = "urlTest";
        const req = { body: { url } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;
        const error = "error: couldn't get simulationhub";
        const mDomain = {
            id: "domainId",
            datasets: ["datasetId1", "datasetId2"]
        }

        mDomainFindOne.mockResolvedValueOnce(mDomain)
        mRunSimulationForDomains.mockRejectedValueOnce(error);
        
        await createMetric(req, res);

        expect(mDomainFindOne).toHaveBeenCalledTimes(1);
        expect(mRunSimulationForDomains).toHaveBeenCalledTimes(1);
        expect(mRunSimulationForDomains).toHaveBeenCalledWith([mDomain]);
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
        mRunSimulationForDomains.mockRejectedValueOnce(error);
        
        await createMetric(req, res);

        expect(mRunSimulationForDomains).toHaveBeenCalledTimes(0);
        expect(mDatasetCreate).toHaveBeenCalledTimes(0);
        expect(mDomainFindOne).toHaveBeenCalledTimes(0);
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
        const req = { query: { domainId, clientId } } as unknown as Request;
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
        const req = { query: { domainId, clientId } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus} as unknown as Response;
        
        await getMetrics(req, res);

        expect(mDomainFindOne).toHaveBeenCalledTimes(0);
        expect(mClientFindOne).toHaveBeenCalledTimes(0);
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ error: "Wrong domain id."});
    });

    it("should return an error if wrong clientId param", async () => {
        const domainId = "domainIdTest";
        const clientId = "";
        const req = { query: { domainId, clientId } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus} as unknown as Response;
        
        await getMetrics(req, res);

        expect(mDomainFindOne).toHaveBeenCalledTimes(0);
        expect(mClientFindOne).toHaveBeenCalledTimes(0);
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ error: "Cannot get metrics for this client."});
    });
 
    it("should return an error if no domain found", async () => {
        const domainId = "domainIdTest";
        const clientId = "clientIdTest";
        const req = { query: { domainId, clientId } } as unknown as Request;
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
        expect(mJson).toHaveBeenCalledWith({ error: "Could not find domain domainIdTest for this client"});
    });

    it("should return an error if domain is not cient's", async () => {
        const domainId = "domainIdTest";
        const clientId = "clientIdTest";
        const req = { query: { domainId, clientId } } as unknown as Request;
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
