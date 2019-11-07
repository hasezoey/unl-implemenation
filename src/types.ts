import { Token } from "./constants/tokens";

export interface ICurrent {
	pos: number;
	tokens: Token[];
	input: string;
}
