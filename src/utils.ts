import * as assert from "assert";
import { ICurrent } from "./types";

/**
 * This function exists, because "@types/node"'s "assert" module dosnt have support for the new 3.7 syntax
 * @param cond Condition (evaluate to Boolean)
 * @param err Custom Error
 */
function assertN(cond: any, err?: Error | string): asserts cond {
	assert(cond, err);
}

/**
 * Increment curr.pos by 1 and return new char
 * @param curr The Object with the ICurrent Context
 */
export function incrementCurr(curr: ICurrent): string {
	curr.pos++; // increment current Position

	return curr.input[curr.pos]; // set new char
}

export { assertN as assert };
