export const GIST_ID = "44de2e5479bee84e5433f46b7726400c";
/// $pipe _char:| -- js importGist:44de2e5479bee84e5433f46b7726400c function:main() -- ${0+} | $ eval 

import { callback, entrypoint, IMPORT_GIST_REGEX, pipe, pluralize } from "#";

const SAY_CMD = "abb say --";
const RELOAD_CMD = "js errorInfo:true force:true";

entrypoint("main", () => {
	const arg = (args as string[])[0];

	if (/^[0-9a-z]{32}$/.test(arg))
		return `${RELOAD_CMD} importGist:${arg} "Reloaded!"`;
	else
		return pipe(`alias code ${arg}`, callback("parse", GIST_ID), "$ eval");
});

entrypoint("parse", () => {
	const code = (args as string[]).join(" ");

	let gists: string[] = [];
	for (const match of code.matchAll(IMPORT_GIST_REGEX)) {
		if (!gists.includes(match[1]))
			gists.push(match[1]);
	}

	if (gists.length === 0) {
		return `abb say No imported gists found.`;
	}

	return pipe(
		...gists.map(gist => `${RELOAD_CMD} importGist:${gist} "//"`),
		"null",
		`${SAY_CMD} Reloaded ${gists.length} imported ${pluralize(gists.length, "gist", "gists")}!`
	);
});
