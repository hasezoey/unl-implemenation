import { astParser } from "../src/astParser";
import { DeclarationNode, RootNode, StringNode, VariableNode } from "../src/constants/astTypes";
import { ASTParserError } from "../src/constants/errors";
import { KeyWords } from "../src/constants/keywords";
import { Token, TokenTypes } from "../src/constants/tokens";

describe("AST Parser", () => {
	describe("Expressions", () => {
		it("EMPTY", () => {
			// EMPTY
		});
	});

	describe("mapping declaration", () => {
		it("should map const statements", () => {
			const tokens = [
				new Token(TokenTypes.Name, "const"),
				new Token(TokenTypes.Name, "key"),
				new Token(TokenTypes.Operator, "="),
				new Token(TokenTypes.String, "Hello String"),
				new Token(TokenTypes.EOF, "")
			];

			const ast = astParser(tokens);

			const expected = new RootNode([
				new DeclarationNode(KeyWords.Const, [
					new VariableNode("key", new StringNode("Hello String"))
				])
			]);

			expect(ast).toBeObject();
			expect(ast).toStrictEqual(expected);
		});
	});
});

describe("AST Parser Error", () => {
	describe("declarations", () => {
		it("should fail when no key is given for declarations", () => {
			const tokens = [
				new Token(TokenTypes.Name, "const"),
				new Token(TokenTypes.Seperator, ";"),
				new Token(TokenTypes.EOF, "")
			];

			expect(astParser.bind(undefined, tokens)).toThrowWithMessage(ASTParserError, "Expected at least an name for variable declaration!");
		});
	});
});
