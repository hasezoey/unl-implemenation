import { tokenizer } from "../src";
import { Token, TokenTypes } from "../src/constants/tokens";

describe("Tokenizer", () => {
	it("should correctly map variable assignment", () => {
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
			const output = tokenizer("const key = \n\t\"\"\"\n\tLineOne\\n\n\tLineTwo\n\t\"\"\"");

			expect(output).toBeArray();
			expect(output).toStrictEqual([
				new Token(TokenTypes.Name, "const"),
				new Token(TokenTypes.Name, "key"),
				new Token(TokenTypes.Operator, "="),
				new Token(TokenTypes.EOL, ""),
				new Token(TokenTypes.String, "LineOne\\nLineTwo"),
				new Token(TokenTypes.EOF, "")
			]);
		});
	});
});
