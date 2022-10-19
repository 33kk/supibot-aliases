export const entrypoint = (name: string, fn: any) => {
	(<any>global)[name] = fn;
};

export const isEmote = async (emote: string) => {
	return (await utils.fetchEmotes()).find(e => e.name === emote);
};

export const trimUnpings = (text: string) => {
	return text.replaceAll("\u{e0000}", "");
};

export const trimMentions = (pings: string[]) => {
	return pings.map(e => e.replace(/^@|,$/g, ""));
};
