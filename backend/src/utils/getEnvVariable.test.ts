const mConfig = jest.fn();
jest.mock("dotenv", () => ({
    config: mConfig
}));

import path from "path";
import { getEnvVariable } from "./getEnvVariable";

describe("getEnvVariable", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should get env variable", () => {
        const envVariable = "NODE_ENV";
        const env = getEnvVariable(envVariable);

        expect(mConfig).toHaveBeenCalledTimes(1);
        expect(mConfig).toHaveBeenCalledWith({ path: path.resolve(__dirname, "../../.env") });
        expect(env).toEqual("test");
    });

    it("should return undefined for non existing env variables", () => {
        const envVariable = "NODE_ENV_TEST";
        const env = getEnvVariable(envVariable);

        expect(mConfig).toHaveBeenCalledTimes(1);
        expect(mConfig).toHaveBeenCalledWith({ path: path.resolve(__dirname, "../../.env") });
        expect(env).toEqual(undefined);
    });

    it("should throw if no env variable provided", () => {
        expect (() => getEnvVariable("")).toThrow("env not found");
    });
});