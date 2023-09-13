import { chunkArray } from "./helpers";

describe("chunkArray", () => {
    it("should", () => {
        const arrayToChunk = ["a", "b", "c", "d", "e"];
        const expectedArray = [["a", "b"], ["c", "d"], ["e"]];
        const chunkedArray = chunkArray(arrayToChunk, 2);

        expect(chunkedArray).toEqual(expectedArray);
    });
});
