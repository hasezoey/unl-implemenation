import { RootNode } from "./constants/astTypes";
import { Token } from "./constants/tokens";

export interface ICurrentToken {
	pos: number;
	tokens: Token[];
	input: string;
}

export interface ICurrentASTParser {
	pos: number;
	ast: RootNode;
	tokens: Token[];
}
