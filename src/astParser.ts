import { isNullOrUndefined } from "util";
import { logger } from ".";
import { ASTNode, CommentNode, DeclarationNode, Expression, NumberNode, RootNode, StringNode, VariableNode } from "./constants/astTypes";
import { ASTParserError } from "./constants/errors";
import { KeyWords } from "./constants/keywords";
import { Misc, Operators, Token, TokenTypes } from "./constants/tokens";
import { ICurrentASTParser } from "./types";
import { assert } from "./utils";

/**
 * Convert Tokens to Abstract-Syntax-Tree
 * @param tokens The Collection of Tokens
 */
export function astParser(tokens: Token[]): RootNode {
	const curr: ICurrentASTParser = {
		ast: new RootNode(),
		tokens: tokens.slice() // copy array
	};

	// ensure to have an EOF Token
	if (tokens.findIndex((v) => v.type === TokenTypes.EOF) <= -1) {
		curr.tokens.push(new Token(TokenTypes.EOF, ""));
	}

	while (curr.tokens.length > 0) {
		logger.debug("ast first while start, with %d to go", curr.tokens.length);

		const nextToken = curr.tokens[0];
		if (isNullOrUndefined(nextToken) || nextToken.type === TokenTypes.EOF) {
			break;
		}

		const node = walk(curr);

		if (!isNullOrUndefined(node)) {
			curr.ast.body.push(node);
		}

		logger.debug("ast first while end\n");
	}

	return curr.ast;
}

/**
 * Get Current Node
 * @param curr Current AST Parser context
 * @returns undefined if EOL
 * @returns never if Unexpected Token
 * @returns ASTNode if successful
 */
function walk(curr: ICurrentASTParser): ASTNode | never | undefined {
	const token = curr.tokens.shift();

	assert(!isNullOrUndefined(token), "Expected \"token\" to be defined!");

	switch (token.type) {
		case TokenTypes.Number:
			return new NumberNode(token.value);
		case TokenTypes.String:
			return new StringNode(token.value);
		case TokenTypes.Comment:
			return new CommentNode(token.value);
		case TokenTypes.EOF:
			throw new ASTParserError("Unexpect EOF! (EndOfFile)");
		case TokenTypes.EOL:
			logger.debug("Skipping an EOL");

			return undefined;
		case TokenTypes.Name:
			switch (token.value) {
				case KeyWords.Const:
				case KeyWords.Let:
					logger.debug("token dec");
					/** The node to be returned */
					const node = new DeclarationNode(token.value);

					/** Current Token To work on */
					let nextToken = curr.tokens.shift();
					/** Had an ","? */
					let hadSeperator = false;

					loop: while (curr.tokens.length > 0 || !isNullOrUndefined(nextToken)) {
						assert(!isNullOrUndefined(nextToken), new ASTParserError("Unexpected undefined Token!"));
						logger.debug("walk dec next token", nextToken);

						testSwitch:
						switch (nextToken.type) {
							case TokenTypes.EOF:
								break loop;
							case TokenTypes.Seperator:
								logger.debug("dec Seperator");
								switch (nextToken.value) {
									case Misc.Semicolon.identifier:
										break loop; // break out of the loop, because a semicolon was found
									case Misc.Comma.identifier:
										if (hadSeperator) {
											throw new ASTParserError("Unexpected to see \",\" again!");
										}
										hadSeperator = true;
										nextToken = curr.tokens.shift();

										continue loop;
								}

								return unexpectedToken(token);
							case TokenTypes.EOL:
								logger.debug("dec EOL");
								if (hadSeperator) {
									nextToken = curr.tokens.shift();

									continue loop; // ignore EOL if seperator was encountered
								}

								break loop; // break out of the loop if EOL is encounterd AND NOT an Seperator first
							case TokenTypes.Name:
								logger.debug("dec Name");
								node.declarations.push(walkDeclaration(curr, nextToken));
								nextToken = curr.tokens.shift();

								continue loop;
							default:
								throw new ASTParserError("Unexpected %s for Declarations!", nextToken);
						}
					}

					if (node.declarations.length <= 0) {
						throw new ASTParserError("Expected at least an name for variable declaration!");
					}

					// throw new Error("\"let|const\" is currently not implemented!");
					return node;
				case KeyWords.Func:
					throw new Error("\"func\" is currently not implemented!");
			}
			throw new ASTParserError("Unexpected keyword %s", JSON.stringify(token.value));
		default:
			throw new ASTParserError("Unexpected Token %s with value %s!", TokenTypes[token.type], JSON.stringify(token.value));
	}
}

/**
 * Check if the Token given is a name, when not throw error
 * @param token The Token to check
 * @returns never if not a name
 * @returns string - the name of the token (ease-of-use)
 */
function expectToBeName(token?: Token): string | never {
	assert(!isNullOrUndefined(token), new ASTParserError("Expected \"token\" to be defined!"));
	assert(token.type === TokenTypes.Name, new ASTParserError("Expected %s to be a name!", JSON.stringify(token.value)));

	return token.value;
}

/**
 * Walk function for Declarations
 * @param curr Current AST Parser context
 * @param givenToken Current token at time of function call
 * @return Finished Variable node
 */
function walkDeclaration(curr: ICurrentASTParser, givenToken: Token): VariableNode {
	logger.debug("walk dec", givenToken);
	const id = expectToBeName(givenToken);
	// the two block statements below are to group checks & to not "leak" variables / discarded tokens
	// test if current token is a keyword
	{
		const found = Object.keys(KeyWords).find((key) => key === id);
		if (!isNullOrUndefined(found)) {
			throw new ASTParserError("Unexpected keyword found in current context! (%s)", JSON.stringify(found));
		}
	}
	// expect next token to be an "=", and discard it
	{
		const opToken = curr.tokens.shift();
		expectDefined(opToken);
		if (opToken.value !== Operators.Equals.identifier) {
			throw new ASTParserError("Expected \"=\", got %s", JSON.stringify(opToken));
		}
	}
	const nextToken = curr.tokens[0]; // This is to not remove it
	expectDefined(nextToken);
	switch (nextToken.type) { // test if there is no assignment
		case TokenTypes.EOL:
		case TokenTypes.Seperator:
			curr.tokens.shift(); // actually remove the token

			return new VariableNode(id, undefined);
	}

	let childNode: ASTNode | undefined;

	while (isNullOrUndefined(childNode)) {
		childNode = walk(curr);
	}

	logger.debug("childNode", childNode);
	assert(childNode instanceof Expression, new ASTParserError("Expected an Expression!"));

	return new VariableNode(id, childNode);
}

/**
 * Test if token given is an EOF
 * @param token Token to be tested
 */
function isEOF(token: Token): boolean {
	return token.type === TokenTypes.EOF;
}

/**
 * Throw if token is an EOF
 * @param token Token to be tested
 */
function errorEOF(token: Token): void | never {
	assert(!isEOF(token), new ASTParserError("Unexpect EOF! (EndOfFile)"));
}

/**
 * QoL function
 * @param token The Unexpected Token
 */
function unexpectedToken(token: Token): never {
	throw new ASTParserError("Unexpected %s!", JSON.stringify(token));
}

/**
 * Assert that token is a Token
 * -> QoL function
 * @param token Variable to test
 */
function expectDefined(token?: Token): asserts token is Token {
	assert(!isNullOrUndefined(token), new ASTParserError("Expected Token to be defined!"));
	assert(token instanceof Token, new ASTParserError("Expected %s to be an instance of Token!", JSON.stringify(token)));
}
