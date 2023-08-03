import { isValidUrl } from "./domain";

describe("isValidUrl", () => {
  beforeEach(() => {
    jest.resetAllMocks();
});

  const urls: any[] = [
    {
      url: "https://example.com",
      expectedResult: true
    },
    {
      url: "wrongUrl",
      expectedResult: false
    },
    {
      url: undefined,
      expectedResult: false
    },
  ];
  it.each(urls)("should return if url valid", async ({url, expectedResult}) => {
    const res = isValidUrl(url);
    expect(res).toEqual(expectedResult);
  })
})