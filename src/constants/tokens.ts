import { assignOperator, fullLineComment, namesStartWith, newLineOrSemi, numbers, strings, whiteSpace, inLineCommentStart, inLineCommentEnd } from "./regex";

class TokenType<T extends string | RegExp | any> {
	constructor(
		public readonly identifier: T,
		public readonly type: TokenTypes,
		public readonly variants?: RegExp[]
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
	Comment
}

export const Blocks = {
	OpenParentheses: new TokenType("(", TokenTypes.Enclosure),
	CloseParentheses: new TokenType(")", TokenTypes.Enclosure),
	OpenBracket: new TokenType("[", TokenTypes.Enclosure),
	CloseBracket: new TokenType("]", TokenTypes.Enclosure),
	OpenBrace: new TokenType("{", TokenTypes.Enclosure),
	CloseBrace: new TokenType("}", TokenTypes.Enclosure)
};

export const Misc = {
	String: new TokenType(strings, TokenTypes.String, [/"/i, /`/i]),
	Number: new TokenType(numbers, TokenTypes.Number),
	Name: new TokenType(namesStartWith, TokenTypes.Name),
	WhiteSpace: new TokenType(whiteSpace, TokenTypes.Empty),
	EndOfFile: new TokenType(undefined, TokenTypes.EOF),
	EndOfLine: new TokenType(newLineOrSemi, TokenTypes.EOL)
};

export const Comments = {
	FullLineComment: new TokenType(fullLineComment, TokenTypes.Comment),
	InLineCommentOpen: new TokenType(inLineCommentStart, TokenTypes.Comment),
	InlineCommentClose: new TokenType(inLineCommentEnd, TokenTypes.Comment)
};

export const Operators = {
	Assign: new TokenType(assignOperator, TokenTypes.Operator)
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
