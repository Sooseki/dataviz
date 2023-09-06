import {
    mClientFindOne,
    mClientUpdateOne,
    mDomainCreate,
    mDomainFind,
} from "../tests/test-utils";
import { Request, Response } from "express";
import { createDomain, getDomains } from "./domainController";

const mDomains = [
    {
        id: "domainId1",
        url: "domainUrl1",
    },
    {
        id: "domainId2",
        url: "domainUrl2",
    },
    {
        id: "domainId3",
        url: "https://domainUrl3.com",
    },
];

describe("createDomain", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    const mClient = {
        id: "clientIdTest",
        name: "clientNameTest",
        domains: mDomains,
    };

    it("should create a new domain", async () => {
        const url = "https://example.com";
        const req = {
            body: { url, clientId: "clientIdTest" },
        } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;
        const newDomain = {
            id: "newDomainId",
            url: "newDomainUrl",
        };
        const mPopulate = jest.fn();
        mClientFindOne.mockImplementationOnce(() => ({ populate: mPopulate }));
        mPopulate.mockResolvedValueOnce(mClient);
        mDomainCreate.mockResolvedValueOnce(newDomain);
        await createDomain(req, res);

        expect(mPopulate).toHaveBeenCalledTimes(1);
        expect(mPopulate).toHaveBeenCalledWith("domains");
        expect(mDomainCreate).toHaveBeenCalledTimes(1);
        expect(mDomainCreate).toHaveBeenCalledWith({ url });
        expect(mClientUpdateOne).toHaveBeenCalledTimes(1);
        expect(mClientUpdateOne).toHaveBeenCalledWith(
            { _id: "clientIdTest" },
            {
                domains: [...mDomains, "newDomainId"],
            }
        );
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(200);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ data: { domain: newDomain } });
    });

    it("should return an error if clientId param is missing", async () => {
        const url = "https://example.com";
        const req = { body: { url } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;
        await createDomain(req, res);

        expect(mDomainCreate).toHaveBeenCalledTimes(0);
        expect(mClientUpdateOne).toHaveBeenCalledTimes(0);
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({
            error: "Domain could not be created for this client.",
        });
    });

    it("should return an error if url param is missing", async () => {
        const req = {
            body: { clientId: "clientIdTest" },
        } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;
        await createDomain(req, res);

        expect(mDomainCreate).toHaveBeenCalledTimes(0);
        expect(mClientUpdateOne).toHaveBeenCalledTimes(0);
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({
            error: "Domain could not be created. Wrong url param",
        });
    });

    it("should return an error if client does not exist in DB", async () => {
        const url = "https://example.com";
        const req = {
            body: { url, clientId: "clientIdTest" },
        } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;
        const mPopulate = jest.fn();
        mClientFindOne.mockImplementationOnce(() => ({ populate: mPopulate }));
        mPopulate.mockResolvedValueOnce(undefined);
        await createDomain(req, res);

        expect(mPopulate).toHaveBeenCalledTimes(1);
        expect(mPopulate).toHaveBeenCalledWith("domains");
        expect(mDomainCreate).toHaveBeenCalledTimes(0);
        expect(mClientUpdateOne).toHaveBeenCalledTimes(0);
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({
            error: "Domain could not be created. Client not found.",
        });
    });

    it("should return an error if client domain already exists", async () => {
        const url = "https://domainUrl3.com";
        const req = {
            body: { url, clientId: "clientIdTest" },
        } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;
        const mPopulate = jest.fn();
        mClientFindOne.mockImplementationOnce(() => ({ populate: mPopulate }));
        mPopulate.mockResolvedValueOnce(mClient);
        await createDomain(req, res);

        expect(mPopulate).toHaveBeenCalledTimes(1);
        expect(mPopulate).toHaveBeenCalledWith("domains");
        expect(mDomainCreate).toHaveBeenCalledTimes(0);
        expect(mClientUpdateOne).toHaveBeenCalledTimes(0);
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ error: "Domain already exists" });
    });
});

describe("getDomains", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    const mClient = {
        id: "clientIdTest",
        name: "clientNameTest",
        domains: ["domainId1", "domainId2", "domainId3"],
    };

    it("should retrieve client's domains", async () => {
        const clientId = "clientIdTest";
        const req = { query: { clientId } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;

        mClientFindOne.mockResolvedValueOnce(mClient);
        mDomainFind.mockResolvedValueOnce(mDomains);

        await getDomains(req, res);

        expect(mClientFindOne).toHaveBeenCalledTimes(1);
        expect(mClientFindOne).toHaveBeenCalledWith({ _id: clientId });
        expect(mDomainFind).toHaveBeenCalledTimes(1);
        expect(mDomainFind).toHaveBeenCalledWith({
            _id: { $in: ["domainId1", "domainId2", "domainId3"] },
        });
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(200);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ data: { domains: mDomains } });
    });

    it("should return a 500 error status if no client found", async () => {
        const clientId = "clientIdTest";
        const req = { query: { clientId } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;

        mClientFindOne.mockResolvedValueOnce(undefined);

        await getDomains(req, res);

        expect(mClientFindOne).toHaveBeenCalledTimes(1);
        expect(mClientFindOne).toHaveBeenCalledWith({ _id: clientId });
        expect(mDomainFind).toHaveBeenCalledTimes(0);
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ error: "Client not found." });
    });
});
