export const GIST_ID = "c605e919445029e6368c994b4043bf21";
/// $pipe -- alias code ${0} | js importGist:${GIST_ID} function:main() -- | alias edit ${0}

import { entrypoint } from "#";

entrypoint("main", () => {
	let code = (args as string[]).join(" ");

	const matches = Array.from(code.matchAll(/_char:([^\s]+)/g)).map(e => e[1]);

	for (const match of matches) {
		code = code.replaceAll(match, utils.randomString(25));
	}

	return code;
});
