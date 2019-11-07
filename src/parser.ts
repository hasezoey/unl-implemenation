import { readFile } from "fs";
import { newLine } from "./constants/regex";

export async function parser(filename: string): Promise<string> {
	return new Promise((res, rej) => {
		readFile(filename, (err, buffer) => {
			if (err) rej(err);
			else {
				res(
					buffer.toString() // convert buffer to string
						.replace(newLine, "\n") // ensure LF (replace CRLF with LF)
				);
			}
		});
	});
}
