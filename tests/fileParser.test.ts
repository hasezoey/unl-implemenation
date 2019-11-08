import { parser } from "../src";

describe("Parser", () => {
	it("should read a file", async () => {
		const output = await parser("./package.json");

		expect(output).toBeString();
	});
});
