import { astParser } from "../src/astParser";
import { DeclarationNode, RootNode, StringNode, VariableNode, ArrayExpressionNode, NumberNode, BooleanNode } from "../src/constants/astTypes";
import { ASTParserError } from "../src/constants/errors";
import { KeyWords } from "../src/constants/keywords";
import { Token, TokenTypes } from "../src/constants/tokens";
import { assert } from "../src/utils";

describe("AST Parser", () => {
	describe("Expressions", () => {
		it("EMPTY", () => {
			// EMPTY
		});
	});

	describe("mapping declaration", () => {
		it("should map const statements (const)", () => {
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

		it("should map const statements (let)", () => {
			const tokens = [
				new Token(TokenTypes.Name, "let"),
				new Token(TokenTypes.Name, "key"),
				new Token(TokenTypes.Operator, "="),
				new Token(TokenTypes.String, "Hello String"),
				new Token(TokenTypes.EOF, "")
			];

			const ast = astParser(tokens);

			const expected = new RootNode([
				new DeclarationNode(KeyWords.Let, [
					new VariableNode("key", new StringNode("Hello String"))
				])
			]);

			expect(ast).toBeObject();
			expect(ast).toStrictEqual(expected);
		});
	});

	describe("mapping arrays", () => {
		it("should map array statements (without array)", () => {
			const tokens = [
				new Token(TokenTypes.Enclosure, "["),
				new Token(TokenTypes.Number, "1"),
				new Token(TokenTypes.Seperator, ","),
				new Token(TokenTypes.Number, "2"),
				new Token(TokenTypes.Enclosure, "]")
			];

			const ast = astParser(tokens);

			const expected = new RootNode([
				new ArrayExpressionNode([
					new NumberNode("1"),
					new NumberNode("2")
				])
			]);

			expect(ast).toBeObject();
			expect(ast).toStrictEqual(expected);
		});

		it("should map array statements (with array)", () => {
			const tokens = [
				new Token(TokenTypes.Name, "array"),
				new Token(TokenTypes.Enclosure, "["),
				new Token(TokenTypes.Number, "1"),
				new Token(TokenTypes.Seperator, ","),
				new Token(TokenTypes.Number, "2"),
				new Token(TokenTypes.Enclosure, "]")
			];

			const ast = astParser(tokens);

			const expected = new RootNode([
				new ArrayExpressionNode([
					new NumberNode("1"),
					new NumberNode("2")
				])
			]);

			expect(ast).toBeObject();
			expect(ast).toStrictEqual(expected);
		});
	});

	describe("mapping booleans", () => {
		it("should map boolean statements (true)", () => {
			const tokens = [
				new Token(TokenTypes.Name, "true")
			];

			const ast = astParser(tokens);

			const expected = new RootNode([
				new BooleanNode("true")
			]);

			expect(ast).toBeObject();
			expect(ast).toStrictEqual(expected);
		});

		it("should map boolean statements (false)", () => {
			const tokens = [
				new Token(TokenTypes.Name, "false")
			];

			const ast = astParser(tokens);

			const expected = new RootNode([
				new BooleanNode("false")
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

	// Disabled because of https://github.com/facebook/jest/issues/7547
	// it("should error with EOF, if unexpected", () => {
	// 	const tokens = [
	// 		new Token(TokenTypes.Enclosure, "[")
	// 	];

	// 	expect(astParser.bind(undefined, tokens)).toThrowWithMessage(ASTParserError, "Unexpect EOF! (EndOfFile)");
	// });
});
