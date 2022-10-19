export const GIST_ID = "44de2e5479bee84e5433f46b7726400c";
/// $pipe _char:| -- js importGist:${GIST_ID} function:main() -- ${0+} | $ eval 

import { callback, cmd, entrypoint, IMPORT_GIST_REGEX, pipe, pluralize, say } from "#";

const reload = (gistId: string, text: string) => cmd("js", { errorInfo: true, force: true, importGist: gistId }, text);

entrypoint("main", () => {
	const arg = args[0];

	if (/^[0-9a-z]{32}$/.test(arg))
		return reload(arg, "Reloaded!");
	else
		return pipe(`alias code ${arg}`, callback("parse", GIST_ID), "$ eval");
});

entrypoint("parse", () => {
	const code = args.join(" ");

	let gists: string[] = [];
	for (const match of code.matchAll(IMPORT_GIST_REGEX)) {
		if (!gists.includes(match[1]))
			gists.push(match[1]);
	}

	if (gists.length === 0) {
		return say("No imported gists found.");
	}

	return pipe(
		...gists.map(gist => reload(gist, "//")),
		"null",
		say(`Reloaded ${gists.length} imported ${pluralize(gists.length, "gist", "gists")}!`)
	);
});
