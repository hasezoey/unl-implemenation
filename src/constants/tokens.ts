import {
	ampersandOperator, EqualsOperator, exclamationMarkOperator, fullLineComment, greaterThanOperator, inLineCommentEnd, inLineCommentStart, lowerThanOperator, namesStartWith, newLineOrSemi, numbers, seperator, strings, stringVariants, verticalLineOperator, whiteSpace
} from "./regex";

class TokenType<T extends string | RegExp | undefined> {
	constructor(
		public readonly identifier: T,
		public readonly type: TokenTypes,
		public readonly variants: RegExp[] = []
	) { }
}

// class KeywordTokenType extends TokenType { }

// export enum TokenTypes {
// 	Parentheses,
// 	Bracket,
// 	Brace,
// 	FullLineComment,
// 	InlineComment,
// 	Operator,
// 	VariablePrefix,
// 	Variable,
// 	Name
// }

export enum TokenTypes {
	Enclosure,
	Name,
	String,
	Number,
	Operator,
	Empty,
	EOF,
	EOL,
	Comment,
	Seperator
}

/**
 * Includes all Block Characters
 */
export const Blocks = {
	OpenParentheses: new TokenType("(", TokenTypes.Enclosure),
	CloseParentheses: new TokenType(")", TokenTypes.Enclosure),
	OpenBracket: new TokenType("[", TokenTypes.Enclosure),
	CloseBracket: new TokenType("]", TokenTypes.Enclosure),
	OpenBrace: new TokenType("{", TokenTypes.Enclosure),
	CloseBrace: new TokenType("}", TokenTypes.Enclosure)
};

/**
 * Includes Miscellaneous things
 */
export const Misc = {
	String: new TokenType(strings, TokenTypes.String, stringVariants),
	MultiLineString: new TokenType(strings, TokenTypes.String, stringVariants),
	Number: new TokenType(numbers, TokenTypes.Number),
	Name: new TokenType(namesStartWith, TokenTypes.Name), // includes "const", "let", "true", "false" - and everything else that is matching the pattern
	WhiteSpace: new TokenType(whiteSpace, TokenTypes.Empty),
	EndOfFile: new TokenType(undefined, TokenTypes.EOF),
	EndOfLine: new TokenType(newLineOrSemi, TokenTypes.EOL),
	Seperator: new TokenType(seperator, TokenTypes.Seperator)
};

/**
 * Includes All Comment character tests
 */
export const Comments = {
	FullLineComment: new TokenType(fullLineComment, TokenTypes.Comment),
	InLineCommentOpen: new TokenType(inLineCommentStart, TokenTypes.Comment),
	InlineCommentClose: new TokenType(inLineCommentEnd, TokenTypes.Comment)
};

/**
 * Includes all Operators
 */
export const Operators = {
	Equals: new TokenType(EqualsOperator, TokenTypes.Operator),
	GreaterThan: new TokenType(greaterThanOperator, TokenTypes.Operator),
	LowerThan: new TokenType(lowerThanOperator, TokenTypes.Operator),
	ExclamationMark: new TokenType(exclamationMarkOperator, TokenTypes.Operator),
	VerticalLine: new TokenType(verticalLineOperator, TokenTypes.Operator),
	Ampersand: new TokenType(ampersandOperator, TokenTypes.Operator)
};

/**
 * Includes all Math-Operators
 */
export const MathOperators = {
	Plus: new TokenType("+", TokenTypes.Operator),
	Minus: new TokenType("-", TokenTypes.Operator),
	Multiply: new TokenType("*", TokenTypes.Operator),
	Devide: new TokenType("/", TokenTypes.Operator),
	Percent: new TokenType("%", TokenTypes.Operator)
};

// export const Keywords = {
// 	ConstantVariable: new KeywordTokenType("const", TokenTypes.VariablePrefix),
// 	ScopedVariable: new KeywordTokenType("let", TokenTypes.VariablePrefix)
// };

// export const Comments = {
// 	FullLineComment: new TokenType("//", TokenTypes.FullLineComment),
// 	InlineCommentStart: new TokenType("/*", TokenTypes.InlineComment),
// 	InlineCommentEnd: new TokenType("*/", TokenTypes.InlineComment)
// };

export class Token {
	constructor(
		public readonly type: TokenTypes,
		public readonly value: TokenTypes | string
	) { }
}
