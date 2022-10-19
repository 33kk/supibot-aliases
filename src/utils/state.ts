export const getStore = (isChannel?: boolean) => {
	return isChannel ? channelCustomData : customData;
};

export const get = (key: string, isChannel?: boolean) => {
	return JSON.parse(getStore(isChannel).get(`${ALIAS_NAME}__` + key) as string);
};

export const set = (key: string, value: unknown, isChannel?: boolean) => {
	getStore(isChannel).set(`${ALIAS_NAME}__` + key, JSON.stringify(value));
};

export const getKeys = (isChannel?: boolean) => {
	return getStore(isChannel).getKeys().filter(e => e.startsWith(`${ALIAS_NAME}__`));
};
