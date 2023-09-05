const mGet = jest.fn();
const mPost = jest.fn();
const mPut = jest.fn();
jest.mock("axios", () => ({
    get: mGet,
    post: mPost,
    put: mPut,
}));

import { handleGet, handlePost, handlePut } from "./handleCall";

describe("handleGet", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should make a get request", async () => {
        const url = "urlTest";
        const axiosRequestResponse = { data: {} };
        mGet.mockResolvedValueOnce(axiosRequestResponse);
        const res = await handleGet(url);

        expect(mGet).toHaveBeenCalledTimes(1);
        expect(mGet).toHaveBeenCalledWith(url, config);
        expect(res).toEqual(axiosRequestResponse);
    });

    it("should return undefined if request failed", async () => {
        const url = "urlTest";
        const axiosRequestResponse = "";
        mGet.mockResolvedValueOnce(axiosRequestResponse);
        const res = await handleGet(url);

        expect(mGet).toHaveBeenCalledTimes(1);
        expect(mGet).toHaveBeenCalledWith(url, config);
        expect(res).toEqual(undefined);
    });
});

describe("handlePost", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should make a post request", async () => {
        const url = "urlTest";
        const data = { email: "testEmail", name: "testName" };
        const axiosRequestResponse = { data: {} };
        mPost.mockResolvedValueOnce(axiosRequestResponse);
        const res = await handlePost(url, data);

        expect(mPost).toHaveBeenCalledTimes(1);
        expect(mPost).toHaveBeenCalledWith(url, data, config);
        expect(res).toEqual(axiosRequestResponse);
    });

    it("should return undefined if request failed", async () => {
        const url = "urlTest";
        const data = { email: "testEmail", name: "testName" };
        const axiosRequestResponse = "";
        mPost.mockResolvedValueOnce(axiosRequestResponse);
        const res = await handlePost(url, data);

        expect(mPost).toHaveBeenCalledTimes(1);
        expect(mPost).toHaveBeenCalledWith(url, data, config);
        expect(res).toEqual(undefined);
    });
});

describe("handlePut", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should make a put request", async () => {
        const url = "urlTest";
        const data = { email: "testEmail", name: "testName" };
        const axiosRequestResponse = { data: {} };
        mPut.mockResolvedValueOnce(axiosRequestResponse);
        const res = await handlePut(url, data);

        expect(mPut).toHaveBeenCalledTimes(1);
        expect(mPut).toHaveBeenCalledWith(url, data, config);
        expect(res).toEqual(axiosRequestResponse);
    });

    it("should return undefined if request failed", async () => {
        const url = "urlTest";
        const data = { email: "testEmail", name: "testName" };
        const axiosRequestResponse = "";
        mPut.mockResolvedValueOnce(axiosRequestResponse);
        const res = await handlePut(url, data);

        expect(mPut).toHaveBeenCalledTimes(1);
        expect(mPut).toHaveBeenCalledWith(url, data, config);
        expect(res).toEqual(undefined);
    });
});

const config = {
    headers: {
        "Content-Type": "application/json",
    },
};
