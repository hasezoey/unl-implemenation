import { readFile } from "fs";

export async function parser(filename: string): Promise<string> {
	return new Promise((res, rej) => {
		readFile(filename, (err, buffer) => {
			if (err) rej(err);
			else res(buffer.toString());
		});
	});
}
