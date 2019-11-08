// this file is used to transpile code from specified .unl files
import { logger, transpile } from "../src/index";

process.on("unhandledRejection", (err) => {
	console.error(err);
});

logger.setLevel("DEBUG");
transpile("./testCode/basic.unl");
// transpile("./testCode/string.unl");
