import { logger, transpile } from "./index";

process.on("unhandledRejection", (err) => {
	console.error(err);
});

logger.setLevel("DEBUG");
transpile("./testCode/basic.unl");
// compile("./testCode/string.unl");
