import { tokenizer } from "../src";
import { TokenError } from "../src/constants/errors";
import { Token, TokenTypes } from "../src/constants/tokens";

describe("Tokenizer", () => {
	describe("numbers", () => {
		it("should correctly map normal numbers", () => {
			const output = tokenizer("const key = 123456789");

			expect(output).toBeArray();
			expect(output).toStrictEqual([
				new Token(TokenTypes.Name, "const"),
				new Token(TokenTypes.Name, "key"),
				new Token(TokenTypes.Operator, "="),
				new Token(TokenTypes.Number, "123456789"),
				new Token(TokenTypes.EOF, "")
			]);
		});

		it("should correctly map hex numbers", () => {
			const output = tokenizer("const key = 0x0fF");

			expect(output).toBeArray();
			expect(output).toStrictEqual([
				new Token(TokenTypes.Name, "const"),
				new Token(TokenTypes.Name, "key"),
				new Token(TokenTypes.Operator, "="),
				new Token(TokenTypes.Number, "0x0fF"),
				new Token(TokenTypes.EOF, "")
			]);
		});

		it("should correctly map decimal/float numbers", () => {
			const output = tokenizer("const key = 1.10");

			expect(output).toBeArray();
			expect(output).toStrictEqual([
				new Token(TokenTypes.Name, "const"),
				new Token(TokenTypes.Name, "key"),
				new Token(TokenTypes.Operator, "="),
				new Token(TokenTypes.Number, "1.10"),
				new Token(TokenTypes.EOF, "")
			]);
		});
	});

	describe("strings", () => {
		it("should correctly map one-line strings", () => {
			const output = tokenizer("const key = \"Hello World\"");

			expect(output).toBeArray();
			expect(output).toStrictEqual([
				new Token(TokenTypes.Name, "const"),
				new Token(TokenTypes.Name, "key"),
				new Token(TokenTypes.Operator, "="),
				new Token(TokenTypes.String, "Hello World"),
				new Token(TokenTypes.EOF, "")
			]);
		});

		it("should correctly map multi-line strings", () => {
			const output = tokenizer("const key1 = \n\t\"\"\"\n\tLineOne\\n\n\tLineTwo\n\t\"\"\"");

			expect(output).toBeArray();
			expect(output).toStrictEqual([
				new Token(TokenTypes.Name, "const"),
				new Token(TokenTypes.Name, "key1"),
				new Token(TokenTypes.Operator, "="),
				new Token(TokenTypes.String, "LineOne\\nLineTwo"),
				new Token(TokenTypes.EOF, "")
			]);
		});

		it("should correctly map multi-line strings (newline immediatly)", () => {
			const output = tokenizer("const key2 = \n\"\"\"\nLineOne\\n\nLineTwo\n\"\"\"");

			expect(output).toBeArray();
			expect(output).toStrictEqual([
				new Token(TokenTypes.Name, "const"),
				new Token(TokenTypes.Name, "key2"),
				new Token(TokenTypes.Operator, "="),
				new Token(TokenTypes.String, "LineOne\\nLineTwo"),
				new Token(TokenTypes.EOF, "")
			]);
		});

		it("should correctly map multi-line strings (multiple newlines)", () => {
			const output = tokenizer("const key2 = \n\n\"\"\"\nLineOne\\n\nLineTwo\n\"\"\"");

			expect(output).toBeArray();
			expect(output).toStrictEqual([
				new Token(TokenTypes.Name, "const"),
				new Token(TokenTypes.Name, "key2"),
				new Token(TokenTypes.Operator, "="),
				new Token(TokenTypes.EOL, ""),
				new Token(TokenTypes.String, "LineOne\\nLineTwo"),
				new Token(TokenTypes.EOF, "")
			]);
		});
	});

	describe("comments", () => {
		it("should correctly map full-line comments", () => {
			const output = tokenizer("const hello // this is a full line comment\nconst another");

			expect(output).toBeArray();
			expect(output).toStrictEqual([
				new Token(TokenTypes.Name, "const"),
				new Token(TokenTypes.Name, "hello"),
				new Token(TokenTypes.Comment, " this is a full line comment"),
				new Token(TokenTypes.EOL, ""),
				new Token(TokenTypes.Name, "const"),
				new Token(TokenTypes.Name, "another"),
				new Token(TokenTypes.EOF, "")
			]);
		});

		it("should correctly map inline-line comments", () => {
			const output = tokenizer("const hello /* This is an InlineComment */ = \"hello\"");

			expect(output).toBeArray();
			expect(output).toStrictEqual([
				new Token(TokenTypes.Name, "const"),
				new Token(TokenTypes.Name, "hello"),
				new Token(TokenTypes.Comment, " This is an InlineComment "),
				new Token(TokenTypes.Operator, "="),
				new Token(TokenTypes.String, "hello"),
				new Token(TokenTypes.EOF, "")
			]);
		});

		it("should correctly map multi-line comments", () => {
			const output = tokenizer("const hello /*\n This is\n an InlineComment\n */ = \"hello\"");

			expect(output).toBeArray();
			expect(output).toStrictEqual([
				new Token(TokenTypes.Name, "const"),
				new Token(TokenTypes.Name, "hello"),
				new Token(TokenTypes.Comment, "\n This is\n an InlineComment\n "),
				new Token(TokenTypes.Operator, "="),
				new Token(TokenTypes.String, "hello"),
				new Token(TokenTypes.EOF, "")
			]);
		});

		it("should correctly map multi-line comments (encountering EOF)", () => {
			const output = tokenizer("const hello /*\n This is\n an InlineComment\n");

			expect(output).toBeArray();
			expect(output).toStrictEqual([
				new Token(TokenTypes.Name, "const"),
				new Token(TokenTypes.Name, "hello"),
				new Token(TokenTypes.Comment, "\n This is\n an InlineComment\n"),
				new Token(TokenTypes.EOF, "")
			]);
		});
	});

	describe("blocks", () => {
		describe("Parentheses", () => {
			const output = tokenizer("const hello = (true)");

			expect(output).toBeArray();
			expect(output).toStrictEqual([
				new Token(TokenTypes.Name, "const"),
				new Token(TokenTypes.Name, "hello"),
				new Token(TokenTypes.Operator, "="),
				new Token(TokenTypes.Enclosure, "("),
				new Token(TokenTypes.Name, "true"),
				new Token(TokenTypes.Enclosure, ")"),
				new Token(TokenTypes.EOF, "")
			]);
		});

		describe("Bracket", () => {
			const output = tokenizer("const hello = [1, 2]");

			expect(output).toBeArray();
			expect(output).toStrictEqual([
				new Token(TokenTypes.Name, "const"),
				new Token(TokenTypes.Name, "hello"),
				new Token(TokenTypes.Operator, "="),
				new Token(TokenTypes.Enclosure, "["),
				new Token(TokenTypes.Number, "1"),
				new Token(TokenTypes.Seperator, ","),
				new Token(TokenTypes.Number, "2"),
				new Token(TokenTypes.Enclosure, "]"),
				new Token(TokenTypes.EOF, "")
			]);
		});

		describe("Brace", () => {
			const output = tokenizer("{ const h }");

			expect(output).toBeArray();
			expect(output).toStrictEqual([
				new Token(TokenTypes.Enclosure, "{"),
				new Token(TokenTypes.Name, "const"),
				new Token(TokenTypes.Name, "h"),
				new Token(TokenTypes.Enclosure, "}"),
				new Token(TokenTypes.EOF, "")
			]);
		});
	});

	describe("math", () => {
		it("should map plus operator", () => {
			const output = tokenizer("const key = 1 + 1");

			expect(output).toBeArray();
			expect(output).toStrictEqual([
				new Token(TokenTypes.Name, "const"),
				new Token(TokenTypes.Name, "key"),
				new Token(TokenTypes.Operator, "="),
				new Token(TokenTypes.Number, "1"),
				new Token(TokenTypes.Operator, "+"),
				new Token(TokenTypes.Number, "1"),
				new Token(TokenTypes.EOF, "")
			]);
		});

		it("should map minus operator", () => {
			const output = tokenizer("const key = 1 - 1");

			expect(output).toBeArray();
			expect(output).toStrictEqual([
				new Token(TokenTypes.Name, "const"),
				new Token(TokenTypes.Name, "key"),
				new Token(TokenTypes.Operator, "="),
				new Token(TokenTypes.Number, "1"),
				new Token(TokenTypes.Operator, "-"),
				new Token(TokenTypes.Number, "1"),
				new Token(TokenTypes.EOF, "")
			]);
		});

		it("should map multiply operator", () => {
			const output = tokenizer("const key = 1 * 1");

			expect(output).toBeArray();
			expect(output).toStrictEqual([
				new Token(TokenTypes.Name, "const"),
				new Token(TokenTypes.Name, "key"),
				new Token(TokenTypes.Operator, "="),
				new Token(TokenTypes.Number, "1"),
				new Token(TokenTypes.Operator, "*"),
				new Token(TokenTypes.Number, "1"),
				new Token(TokenTypes.EOF, "")
			]);
		});

		it("should map devide operator", () => {
			const output = tokenizer("const key = 1 / 1");

			expect(output).toBeArray();
			expect(output).toStrictEqual([
				new Token(TokenTypes.Name, "const"),
				new Token(TokenTypes.Name, "key"),
				new Token(TokenTypes.Operator, "="),
				new Token(TokenTypes.Number, "1"),
				new Token(TokenTypes.Operator, "/"),
				new Token(TokenTypes.Number, "1"),
				new Token(TokenTypes.EOF, "")
			]);
		});

		it("should map percent operator", () => {
			const output = tokenizer("const key = 1 % 1");

			expect(output).toBeArray();
			expect(output).toStrictEqual([
				new Token(TokenTypes.Name, "const"),
				new Token(TokenTypes.Name, "key"),
				new Token(TokenTypes.Operator, "="),
				new Token(TokenTypes.Number, "1"),
				new Token(TokenTypes.Operator, "%"),
				new Token(TokenTypes.Number, "1"),
				new Token(TokenTypes.EOF, "")
			]);
		});
	});

	describe("operators", () => {
		it("should correctly map equals", () => {
			const output = tokenizer("const hello = \"Hello World\"");

			expect(output).toBeArray();
			expect(output).toStrictEqual([
				new Token(TokenTypes.Name, "const"),
				new Token(TokenTypes.Name, "hello"),
				new Token(TokenTypes.Operator, "="),
				new Token(TokenTypes.String, "Hello World"),
				new Token(TokenTypes.EOF, "")
			]);
		});

		it("should correctly map GreaterThan", () => {
			const output = tokenizer("1 > 1");

			expect(output).toBeArray();
			expect(output).toStrictEqual([
				new Token(TokenTypes.Number, "1"),
				new Token(TokenTypes.Operator, ">"),
				new Token(TokenTypes.Number, "1"),
				new Token(TokenTypes.EOF, "")
			]);
		});

		it("should correctly map LowerThan", () => {
			const output = tokenizer("1 < 1");

			expect(output).toBeArray();
			expect(output).toStrictEqual([
				new Token(TokenTypes.Number, "1"),
				new Token(TokenTypes.Operator, "<"),
				new Token(TokenTypes.Number, "1"),
				new Token(TokenTypes.EOF, "")
			]);
		});

		it("should correctly map ExclamationMark", () => {
			const output = tokenizer("!true");

			expect(output).toBeArray();
			expect(output).toStrictEqual([
				new Token(TokenTypes.Operator, "!"),
				new Token(TokenTypes.Name, "true"),
				new Token(TokenTypes.EOF, "")
			]);
		});

		it("should correctly map VerticalLine", () => {
			const output = tokenizer("true || true");

			expect(output).toBeArray();
			expect(output).toStrictEqual([
				new Token(TokenTypes.Name, "true"),
				new Token(TokenTypes.Operator, "|"),
				new Token(TokenTypes.Operator, "|"),
				new Token(TokenTypes.Name, "true"),
				new Token(TokenTypes.EOF, "")
			]);
		});

		it("should correctly map Ampersand", () => {
			const output = tokenizer("true && true");

			expect(output).toBeArray();
			expect(output).toStrictEqual([
				new Token(TokenTypes.Name, "true"),
				new Token(TokenTypes.Operator, "&"),
				new Token(TokenTypes.Operator, "&"),
				new Token(TokenTypes.Name, "true"),
				new Token(TokenTypes.EOF, "")
			]);
		});
	});
});

describe("Tokenizer Errors", () => {
	// Because it is just one Error class, it is checked with the message
	// Please dont be afraid of changing the message, if the message gets updated
	it("should error if \".\" is used multiple times for a number", () => {
		expect(tokenizer.bind(undefined, "const key = 1.1.0")).toThrowWithMessage(TokenError, "\".\" was unexpected to be seen again!");
	});

	it("should error if no string-ender is found", () => {
		expect(tokenizer.bind(undefined, "\"This not a terminated string")).toThrowWithMessage(TokenError, "Expected String to end before a EOL / EOF!");
	});

	it("should error if unkown token is encountered", () => {
		expect(tokenizer.bind(undefined, "€")).toThrowWithMessage(TokenError, "Unkown Token Encountered: \"€\"");
	});
});
