const mRunSimulation = jest.fn();
jest.mock("../simulation-workers/simulationsHub", () => ({
    runSimulation: mRunSimulation,
}));

import {
    mClientFindById,
    mClientFindOne,
    mDatasetCreate,
    mDomainCreate,
    mDomainFindById,
    mDomainFindOne,
    mDomainUpdateOne,
    mGetUserTokenIds,
} from "../tests/test-utils";
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
        const id = "domainIdTest";
        const req = { body: { id } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;
        const simulationhubResponse = [{ data: { timeToLoad: 0.760524 } }];
        const mDomain = {
            id,
            datasets: ["datasetId1", "datasetId2"],
        };
        const mClient = {
            id: "clientIdTest",
            domains: [id],
        };
        mGetUserTokenIds.mockReturnValueOnce({ clientId: "clientIdTest" });
        mClientFindById.mockResolvedValueOnce(mClient);
        mRunSimulation.mockResolvedValueOnce(simulationhubResponse);
        mDomainFindById.mockResolvedValueOnce(mDomain);
        mDatasetCreate.mockResolvedValueOnce({ id: "newDatasetId" });

        await createMetric(req, res);

        expect(mRunSimulation).toHaveBeenCalledTimes(1);
        expect(mRunSimulation).toHaveBeenCalledWith([mDomain]);

        expect(mDatasetCreate).toHaveBeenCalledTimes(1);
        expect(mDatasetCreate).toHaveBeenCalledWith({
            date: new Date("2020-01-01"),
            timeToLoad: 0.760524,
        });
        expect(mDomainFindById).toHaveBeenCalledTimes(1);
        expect(mDomainFindById).toHaveBeenCalledWith(id);
        expect(mDomainUpdateOne).toHaveBeenCalledWith(
            { _id: id },
            { datasets: ["datasetId1", "datasetId2", "newDatasetId"] }
        );
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(200);
        expect(mJson).toHaveBeenCalledWith({
            data: {
                msg: "metrics creation sucessfull",
                metrics: simulationhubResponse,
            },
        });
    });

    it("should return 500 error status if domain doesn't exist", async () => {
        const id = "domainIdTest";
        const req = { body: { id } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;
        const simulationhubResponse = [{ data: { timeToLoad: 0.760524 } }];
        mClientFindById.mockResolvedValueOnce({ id: "clientIdTest" });
        mGetUserTokenIds.mockReturnValueOnce({ clientId: "clientIdTest" });
        mRunSimulation.mockResolvedValueOnce(simulationhubResponse);
        mDomainFindById.mockResolvedValueOnce(undefined);

        await createMetric(req, res);

        expect(mDomainFindById).toHaveBeenCalledTimes(1);
        expect(mDomainFindById).toHaveBeenCalledWith(id);
        expect(mRunSimulation).toHaveBeenCalledTimes(0);
        expect(mDatasetCreate).toHaveBeenCalledTimes(0);
        expect(mDomainUpdateOne).toHaveBeenCalledTimes(0);
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);
        expect(mJson).toHaveBeenCalledWith({
            error: "Domain not found",
        });
    });

    it("should return 500 error status if simulationhub fails", async () => {
        const id = "domainIdTest";
        const req = { body: { id } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;
        const error = "error: couldn't get simulationhub";
        const mDomain = {
            id,
            datasets: ["datasetId1", "datasetId2"],
        };
        const mClient = {
            id: "clientIdTest",
            domains: [id],
        };

        mGetUserTokenIds.mockReturnValueOnce({ clientId: "clientIdTest" });
        mClientFindById.mockResolvedValueOnce(mClient);
        mDomainFindById.mockResolvedValueOnce(mDomain);
        mRunSimulation.mockRejectedValueOnce(error);

        await createMetric(req, res);

        expect(mDomainFindById).toHaveBeenCalledTimes(1);
        expect(mRunSimulation).toHaveBeenCalledTimes(1);
        expect(mRunSimulation).toHaveBeenCalledWith([mDomain]);
        expect(mDomainCreate).toHaveBeenCalledTimes(0);

        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);
        expect(mJson).toHaveBeenCalledWith({
            error: "something went wrong in metrics creation",
        });
    });

    it("should return 500 error status if id param undefined", async () => {
        const req = { body: {} } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;
        const error = "error: couldn't get simulationhub";

        mGetUserTokenIds.mockReturnValueOnce({ clientId: "clientIdTest" });
        mRunSimulation.mockRejectedValueOnce(error);

        await createMetric(req, res);

        expect(mRunSimulation).toHaveBeenCalledTimes(0);
        expect(mDatasetCreate).toHaveBeenCalledTimes(0);
        expect(mDomainFindById).toHaveBeenCalledTimes(0);
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);
        expect(mJson).toHaveBeenCalledWith({ error: "wrong id param" });
    });
});

describe("getMetrics", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should retrieve all the metrics", async () => {
        const domainId = "domainIdTest";
        const clientId = "clientIdTest";
        const req = { query: { domainId } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;
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
        mGetUserTokenIds.mockReturnValueOnce({ clientId });
        mDomainFindOne.mockImplementationOnce(() => ({ populate: mPopulate }));
        mPopulate.mockResolvedValueOnce(mDomain);
        mClientFindOne.mockResolvedValueOnce(mClient);
        await getMetrics(req, res);

        expect(mDomainFindOne).toHaveBeenCalledTimes(1);
        expect(mDomainFindOne).toHaveBeenCalledWith({ _id: domainId });
        expect(mClientFindOne).toHaveBeenCalledTimes(1);
        expect(mClientFindOne).toHaveBeenCalledWith({ _id: clientId });
        expect(mPopulate).toHaveBeenCalledTimes(1);
        expect(mPopulate).toHaveBeenCalledWith("datasets");
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(200);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({
            data: { metrics: "datasetsTest" },
        });
    });

    it("should return an error if wrong domainId param", async () => {
        const domainId = 1234;
        const clientId = "clientIdTest";
        const req = { query: { domainId } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;

        mGetUserTokenIds.mockReturnValueOnce({ clientId });

        await getMetrics(req, res);

        expect(mDomainFindOne).toHaveBeenCalledTimes(0);
        expect(mClientFindOne).toHaveBeenCalledTimes(0);
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ error: "Wrong domain id." });
    });

    it("should return an error if wrong clientId param", async () => {
        const domainId = "domainIdTest";
        const clientId = undefined;
        const req = { query: { domainId } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;

        mGetUserTokenIds.mockReturnValueOnce({ clientId });

        await getMetrics(req, res);

        expect(mDomainFindOne).toHaveBeenCalledTimes(0);
        expect(mClientFindOne).toHaveBeenCalledTimes(0);
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({
            error: "Cannot get metrics for this client.",
        });
    });

    it("should return an error if no domain found", async () => {
        const domainId = "domainIdTest";
        const clientId = "clientIdTest";
        const req = { query: { domainId } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;

        const mPopulate = jest.fn();
        mGetUserTokenIds.mockReturnValueOnce({ clientId });
        mDomainFindOne.mockImplementationOnce(() => ({ populate: mPopulate }));
        mPopulate.mockResolvedValueOnce(undefined);
        await getMetrics(req, res);

        expect(mDomainFindOne).toHaveBeenCalledTimes(1);
        expect(mDomainFindOne).toHaveBeenCalledWith({ _id: domainId });
        expect(mPopulate).toHaveBeenCalledTimes(1);
        expect(mPopulate).toHaveBeenCalledWith("datasets");
        expect(mClientFindOne).toHaveBeenCalledTimes(0);
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({
            error: "Could not find domain domainIdTest for this client",
        });
    });

    it("should return an error if domain is not cient's", async () => {
        const domainId = "domainIdTest";
        const clientId = "clientIdTest";
        const req = { query: { domainId } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;
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
        mGetUserTokenIds.mockReturnValueOnce({ clientId });
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
        expect(mJson).toHaveBeenCalledWith({
            error: "cannot access this resource",
        });
    });
});
