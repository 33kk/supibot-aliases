export const GIST_ID = "07ccac445ff5b056b40e5cba8ed913be";
/// $pipe _char:| -- alias code ${0+} | js importGist:${GIST_ID} function:main() -- 

import { entrypoint, IMPORT_GIST_REGEX } from "#";

entrypoint("main", () => {
	const code = args.join(" ");

	const matches: string[] = [];
	for (const match of code.matchAll(IMPORT_GIST_REGEX)) {
		if (!matches.includes(match[1]))
			matches.push(match[1]);
	}
	
	return matches.map(m => `https://gist.github.com/${m}`).join(" ");
});
