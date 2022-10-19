export const pluralize = (count: number, singular: string, plural: string) => {
	return count === 1 || count === -1 ? singular : plural;
};

export const t = (strings: TemplateStringsArray, ...values: any[]) => {
	let out = "";

	for (let i = 0; i < strings.length; i++) {
		out += strings[i];
		if (["string", "number"].includes(typeof values[i]) || Boolean(values[i]))
			out += values[i];
	}

	return out;
};
