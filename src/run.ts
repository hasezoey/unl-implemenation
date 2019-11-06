import { compile, logger } from "./index";

process.on("unhandledRejection", (err) => {
	console.error(err);
});

logger.setLevel("DEBUG");
compile("./testCode/basic.unl");
// compile("./testCode/string.unl");
