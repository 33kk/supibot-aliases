export const entrypoint = (name: string, fn: any) => {
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

export const joinCustomLastSep = (item: string[], sep: string = ", ", lastSep: string = " and ") => {
    item = Array.from(new Set(item));

    if (item.length > 1) {
        return `${item.slice(0, -1).join(sep)}${lastSep}${item.at(-1)}`;
    }
    return item[0];
}

export const trimPings = (pings: string[]) => {
    return pings.map(e => e.replace(/^@|,$/g, ""));
}

export const isEmote = async (emote: string) => {
    return (await utils.fetchEmotes()).find(e => e.name === emote);
}

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
}

export const say = (text: string) => `abb say -- ${text}`;
