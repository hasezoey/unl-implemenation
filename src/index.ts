import * as logger from "loglevel";
import "source-map-support/register";

import { astParser } from "./astParser";
import { parseFile } from "./fileParser";
import { generate } from "./generate";
import { tokenizer } from "./tokenizer";
import { transform } from "./transformer";

export { logger };
export { tokenizer, transform, generate, parseFile as parser };

export async function transpile(filename: string): Promise<string> {
	const rawInput = await parseFile(filename);
	const tokens = tokenizer(rawInput);
	console.log("Final Tokens:", tokens);
	const parsedAST = astParser(tokens);
	console.log("Final AST", parsedAST);
	// const transformed = await transform(parsedAST);
	// const output = await generate(transformed);

	// return output;
	return "";

	// will be used later, for now the verbose-ones above are used
	// return await generate(
	// 	await transform(
	// 		await tokenizer(
	// 			await parser(filename)
	// 		)
	// 	)
	// );
}

export async function interpret(input: string): Promise<string> {
	const tokens = await tokenizer(input);
	console.log("Final Tokens:", tokens);
	const transformed = await transform(tokens);
	const output = await generate(transformed);

	return output;
}
