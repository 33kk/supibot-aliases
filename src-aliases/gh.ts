export const GIST_ID = "8c518a418d5eac3df8a564d6692e1ec2";
/// $js importGist:${GIST_ID} function:main() -- ${0+}

import { entrypoint, GIST_REGEX } from "#";

const _args = args as string[];

entrypoint("main", () => {
	if (GIST_REGEX.test(_args[0]))
		return `https://gist.github.com/${_args[0]}`;

	return `https://github.com/${_args.join("/")}`;
});
