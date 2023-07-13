const mGetEnvVariable = jest.fn();
jest.mock("./getEnvVariable", () => ({
    getEnvVariable: mGetEnvVariable,
}))

import { getToken } from "./handleToken";

describe("getToken", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should get token", async () => {
        const mJwtSecret = "jwtSecretTest";
        mGetEnvVariable.mockReturnValueOnce(mJwtSecret);

        const token = await getToken(mPayload);

        expect(mGetEnvVariable).toHaveBeenCalledTimes(1);
        expect(mGetEnvVariable).toHaveBeenCalledWith("JWT_SECRET");
        expect(typeof token).toBe("string");
    });

    it("should throw if no env variable found", async () => {
        mGetEnvVariable.mockReturnValueOnce("");

        await expect(() => getToken(mPayload)).rejects.toThrowError("JWT_SECRET is not defined in the environment variables.");

        expect(mGetEnvVariable).toHaveBeenCalledTimes(1);
        expect(mGetEnvVariable).toHaveBeenCalledWith("JWT_SECRET");
    });
});

const mPayload = {
    id: "userIdTest",
    email: "user@email.com",
};
