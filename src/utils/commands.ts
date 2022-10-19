export const callback = (fn: string, gistId: string) => `js importGist:${gistId} function:${fn}() --`;

export const pipe = (...commands: any[]) => {
	const char = utils.randomString(20);

	return `pipe _char:${char} -- ${commands.filter(Boolean).join(` ${char} `)}`;
};

export const cmd = (command: string, params: null | undefined | Record<string, string | number | boolean>, text: string) => {
	let out = command;
	if (params) {
		for (const key in params) {
			if (["string", "number"].includes(typeof params[key]) || params[key] === true) {
				out += ` ${key}:${params[key]}`;
			}
		}
		out += " --";
	}
	out += ` ${text}`;
	return out;
};

export const say = (text: string) => `abb say -- ${text}`;
