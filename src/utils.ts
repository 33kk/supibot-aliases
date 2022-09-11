export const def = (name: any, fn: any) => {
	(<any>global)[name] = fn;
};

export const pipe = (...commands: any[]) => {
	const char = utils.randomString(20);

	return `pipe _char:${char} -- ${commands.filter(Boolean).join(` ${char} `)}`;
}

export const pluralize = (count: number, singular: string, plural: string) => {
	return count === 1 || count === -1 ? singular : plural;
}

export const t = (strings: TemplateStringsArray, ...values: any[]) => {
	let out = "";

	for (let i = 0; i < strings.length; i++) {
		out += strings[i];
		if (typeof values[i] === "string" || typeof values[i] === "number" || Boolean(values[i]))
			out += values[i];
	}

	return out;
}

export const callback = (fn: string, gistId: string) => `js importGist:${gistId} function:${fn}() --`;
