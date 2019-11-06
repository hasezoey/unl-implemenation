import * as assert from "assert";

/**
 * This function exists, because "@types/node"'s "assert" module dosnt have support for the new 3.7 syntax
 * @param cond Condition (evaluate to Boolean)
 * @param err Custom Error
 */
function assertN(cond: any, err?: Error | string): asserts cond {
	assert(cond, err);
}

export { assertN as assert };
