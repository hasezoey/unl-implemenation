import { format, isNullOrUndefined } from "util";
import { logger } from ".";
import { namesUntilEnd, newLine } from "./constants/regex";
import { Blocks, Comments, Misc, Operators, TokenTypes } from "./constants/tokens";
import { assert } from "./utils";

class Token {
	constructor(
		public readonly type: TokenTypes,
		public readonly value: TokenTypes | string
	) { }
}

interface ICurrent {
	pos: number;
	tokens: Token[];
	input: string;
}

/**
 * Convert input string to a Token Array
 * @param input Input of a file or REPL
 */
export async function tokenizer(input: string): Promise<Token[]> {
	assert(typeof input === "string", "Input must be a string!");
	assert(input.length > 0, "Input length must be higher than 0!");

	logger.warn("Input string:", JSON.stringify(input));

	const curr: ICurrent = { // this is needed, because otherwise the functions would just take a copy of the primitive
		pos: 0,
		tokens: [],
		input
	};

	tokenLoop: while (curr.pos < input.length + 1) {
		logger.debug("Loop Start, Current Position %d", curr.pos);
		const pre = curr.pos;

		const newToken = getNextToken(curr);
		if (!isNullOrUndefined(newToken)) {
			logger.info("Got Token \"%s\" with value \"%s\"", TokenTypes[newToken.type], newToken.value);
			curr.tokens.push(newToken);
		}
		logger.debug("Loop End, Current Position %d, Loop Start Position %d \n", curr.pos, pre);
		if (curr.pos === pre) {
			throw new Error("Previous Position is the same as Current Position!");
		}
		// break;
	}

	return curr.tokens;
}

/**
 * The Function that gets executes in each loop
 * @param curr The Object with the ICurrent Context
 */
function getNextToken(curr: ICurrent): Token | undefined {
	const char = curr.input[curr.pos];
	logger.debug("getNextToken Current Character: \"%s\"", (char + "").replace(newLine, "\\n"));
	if (isNullOrUndefined(char)) {
		curr.pos++;

		return new Token(TokenTypes.EOF, "");
	}
	if (Misc.EndOfLine.identifier.test(char)) {
		curr.pos++;

		return new Token(TokenTypes.EOL, "");
	}

	switch (char) {
		case Blocks.OpenBrace.identifier:
			curr.pos++;

			return new Token(TokenTypes.Enclosure, char);
		case Blocks.OpenBracket.identifier:
			curr.pos++;

			return new Token(TokenTypes.Enclosure, char);
		case Blocks.OpenParentheses.identifier:
			curr.pos++;

			return new Token(TokenTypes.Enclosure, char);
	}

	if (Misc.WhiteSpace.identifier.test(char)) {
		curr.pos++;

		return undefined;
	}
	if (Misc.String.identifier.test(char)) {
		return new Token(TokenTypes.String, getStringUntilEnd(curr));
	}
	if (Misc.Name.identifier.test(char)) {
		return new Token(TokenTypes.Name, getNameUntilEnd(curr));
	}

	if (Operators.Assign.identifier.test(char)) {
		curr.pos++;

		return new Token(TokenTypes.Operator, char);
	}

	{
		const commentChar = char + curr.input[curr.pos + 1];
		logger.debug("Checking for Comments", JSON.stringify(commentChar));
		if (Comments.FullLineComment.identifier.test(commentChar)) {
			return new Token(TokenTypes.Comment, getFullLineComment(curr));
		}

		if (Comments.InLineCommentOpen.identifier.test(commentChar)) {
			return new Token(TokenTypes.Comment, getInlineComment(curr));
		}
	}

	throw new Error(format("Unkown Token Encountered: \"%s\"", char));
}

/**
 * Get the current Full-Line-Comment
 * @param curr The Object with the ICurrent Context
 */
function getFullLineComment(curr: ICurrent): string {
	curr.pos += 2; // increment by 2, to remove the "//"

	/** The String that will get returned */
	let out = "";
	/** Current Char to work on */
	let char = curr.input[curr.pos];

	// execute while "char" is a string AND while "char" is NOT a newline
	while (typeof char === "string" && !newLine.test(char)) {
		out += char; // append current char to out
		curr.pos++; // increment current Position
		char = curr.input[curr.pos]; // set new char
	}
	// Do NOT increment if there is a new line - for the new-line token

	return out;
}

/**
 * Get the current In-Line-Comment
 * @param curr The Object with the ICurrent Context
 */
function getInlineComment(curr: ICurrent): string {
	curr.pos += 2; // increment by 2, to remove "/*"

	/** The String that will get returned */
	let out = "";
	/** Current Char to work on */
	let char = curr.input[curr.pos];
	let preChar = "";

	// execute while ADD DOCUMENTATION
	while (typeof char === "string" && !Comments.InlineCommentClose.identifier.test(preChar + char)) {
		out += char; // append current char to out
		curr.pos++; // increment current Position

		preChar = char;
		char = curr.input[curr.pos]; // set new char
	}

	if (Comments.InlineCommentClose.identifier.test(preChar + char)) {
		curr.pos++; // increment to move past "/" of "*/"
		out = out.replace(/\*$/i, ""); // remove the "*" of "*/" - it is there, because in that run, the regexp didnt fire
	}

	return out;
}

/**
 * Search until next the current name ends (like a whitespace, or operator)
 * @param curr The Object with the ICurrent Context
 */
function getNameUntilEnd(curr: ICurrent): string {
	/** The String that will get returned */
	let out = "";
	/** Current Char to work on */
	let char = curr.input[curr.pos];

	// execute while "char" is not a whitespace AND is not a newline / semicolon AND while "char" is a string
	while (typeof char === "string" && namesUntilEnd.test(char)) {
		out += char; // append current char to out
		curr.pos++; // increment current Position
		char = curr.input[curr.pos]; // set new char
	}
	logger.debug("GNUE \"%s\"", out);

	return out;
}

/**
 * Search until the closing of the current string
 * @param curr The Object with the ICurrent Context
 */
function getStringUntilEnd(curr: ICurrent): string {
	/** The String that will get returned */
	let out = "";
	/** Current Char to work on */
	let char = curr.input[curr.pos];
	const stringEndTest = Misc.String.variants?.find((v) => v.test(char));
	assert(!isNullOrUndefined(stringEndTest), "Expected \"charToTest\" to be defined");

	curr.pos++; // increment initally to skip the inital quotation mark
	char = curr.input[curr.pos]; // set the current char to the increment above

	// execute while "char" is not a whitespace AND is not a newline / semicolon AND while "char" is a string
	while (typeof char === "string" && !(stringEndTest.test(char) || newLine.test(char))) {
		out += char; // append current char to out
		curr.pos++; // increment current Position
		char = curr.input[curr.pos]; // set new char
	}
	logger.debug("GSUE", out);

	// increment current position again, because of the closing string token
	if (stringEndTest.test(char)) {
		curr.pos++;
	}

	return out;
}
