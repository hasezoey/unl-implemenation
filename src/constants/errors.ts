import { format } from "util";

export class TokenError extends Error {
	constructor(msg: string, ...args: any[]) {
		super(format(msg, ...args));
	}
}

export class ASTParserError extends Error {
	constructor(msg: string, ...args: any[]) {
		super(format(msg, ...args));
	}
}
