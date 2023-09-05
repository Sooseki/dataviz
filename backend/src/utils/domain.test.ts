import { isValidUrl } from "./domain";

describe("isValidUrl", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    const urls: {url?:string, expectedResult:boolean}[] = [
        {
            url: "https://example.com",
            expectedResult: true,
        },
        {
            url: "wrongUrl",
            expectedResult: false,
        },
        {
            expectedResult: false,
        },
    ];
    it.each(urls)("should return if url valid", async ({ url, expectedResult }) => {
        const res = isValidUrl(url);
        expect(res).toEqual(expectedResult);
    });
});
