const mGetEnvVariable = jest.fn();
jest.mock("../utils/getEnvVariable", () => ({
    getEnvVariable: mGetEnvVariable,
}))

const mConnect = jest.fn();
jest.mock("mongoose", () => ({
    connect: mConnect,
}));

import { connectDB } from "./database";

const mockProcessExit = jest.spyOn(process, 'exit').mockImplementation();

describe("connectDB", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        mockProcessExit.mockImplementation((number) => { throw new Error('process.exit: ' + number); });
    });

    it("should connect to DB", async () => {
        const mongoDbUri = "mongoDBuriTest";
        mGetEnvVariable.mockReturnValueOnce(mongoDbUri);
        await connectDB();

        expect(mGetEnvVariable).toHaveBeenCalledTimes(1);
        expect(mGetEnvVariable).toHaveBeenCalledWith('MONGODB_URI');
        expect(mConnect).toHaveBeenCalledTimes(1);
        expect(mConnect).toHaveBeenCalledWith(mongoDbUri);
    });

    it("should throw if no uri found", async () => {
        mGetEnvVariable.mockReturnValueOnce("");
        await expect(() => connectDB()).rejects.toThrowError();

        expect(mGetEnvVariable).toHaveBeenCalledTimes(1);
        expect(mGetEnvVariable).toHaveBeenCalledWith('MONGODB_URI');
        expect(mConnect).toHaveBeenCalledTimes(0);
        expect(mockProcessExit).toHaveBeenCalledTimes(1);
    });
})