export const GIST_ID = "af8853c4fda707489b6bcb01234c2932";
/// $pipe _force:true _char:| -- js importGist:af8853c4fda707489b6bcb01234c2932 function:main() -- ${0+} | $ eval | js importGist:af8853c4fda707489b6bcb01234c2932 function:post() -- 

import { entrypoint, pipe, t } from "#";

// Google: console.log('[ "' + Array.from(new Set(Array.from(document.querySelectorAll("[data-language-code]")).map(e => e.attributes["data-language-code"].value).filter(e => e != "auto" && !e.includes("-")))).join('", "') + '" ]') 

const LAST_USED = "tr_lastUsed";
const SAY = "abb say ";
const LANGUAGE_CODE_NOT_SUPPORTED = "⚠️ Some of the language codes specified are not supported.";
const INVALID_INPUT = "⚠️ No language code and/or text was specified.";

const LANGUAGE_CODES: Record<string, string[]> = {
	g: [ "en", "de", "uk", "af", "sq", "am", "ar", "hy", "as", "ay", "az", "bm", "eu", "be", "bn", "bho", "bs", "bg", "ca", "ceb", "ny", "co", "hr", "cs", "da", "dv", "doi", "nl", "eo", "et", "ee", "tl", "fi", "fr", "fy", "gl", "ka", "el", "gn", "gu", "ht", "ha", "haw", "iw", "hi", "hmn", "hu", "is", "ig", "ilo", "id", "ga", "it", "ja", "jw", "kn", "kk", "km", "rw", "gom", "ko", "kri", "ku", "ckb", "ky", "lo", "la", "lv", "ln", "lt", "lg", "lb", "mk", "mai", "mg", "ms", "ml", "mt", "mi", "mr", "lus", "mn", "my", "ne", "no", "or", "om", "ps", "fa", "pl", "pt", "pa", "qu", "ro", "ru", "sm", "sa", "gd", "nso", "sr", "st", "sn", "sd", "si", "sk", "sl", "so", "es", "su", "sw", "sv", "tg", "ta", "tt", "te", "th", "ti", "ts", "tr", "tk", "ak", "ur", "ug", "uz", "vi", "cy", "xh", "yi", "yo", "zu" ],
	d: [ "bg", "cs", "da", "de", "el", "en", "es", "et", "fi", "fr", "hu", "id", "it", "ja", "lt", "lv", "nl", "pl", "pt", "ro", "ru", "sk", "sl", "sv", "tr", "uk", "zh" ]
};

const ENGINES: Record<string, string> = {
	g: "google",
	d: "deepl"
};

const ENGINE_ICONS: Record<string, string> = {
	g: "[G]",
	d: "[D]"
};

function checkLanguage(engine: string, code: string) {
	return !code || (code && LANGUAGE_CODES[engine].includes(code));
}

function checkEngine(engine: string, from: string, to: string) {
	return checkLanguage(engine, from) && checkLanguage(engine, to);
}

const _args = args as string[];

entrypoint("main", () => {

	const m = /^(?:(?<engine>[gd])-?)?(?:(?<from_>\w{2})?-|(?<from>\w{2})?-?(?<to>\w{2})) (?<text>.+)$/.exec(_args.join(" "));

	if (!m) {
		return SAY + INVALID_INPUT;
	}

	let { engine, from_, from = from_, to, text } = m.groups as Record<string, string>;

	if (!engine) {
		if (checkEngine("d", from, to))
			engine = "d";
		else if (checkEngine("g", from, to))
			engine = "g";
		else
			return SAY + LANGUAGE_CODE_NOT_SUPPORTED;
	}
	else if (!checkEngine(engine, from, to))
		return SAY +LANGUAGE_CODE_NOT_SUPPORTED;

	const ocr = _args.length === 2 && _args[1].startsWith("https://");

	return pipe(
		ocr && t`ocr ${from && `lang:${from}`} -- ${text}`,
		t`translate textOnly:false ${engine && "engine:" + ENGINES[engine]} ${from && "from:" + from} ${to && "to:" + to} -- ${ocr ? "" : text}`,
		`abb say ${ENGINE_ICONS[engine]}`
	);
});

entrypoint("post", () => {
	if (_args.join(" ") === 'Your pipe failed because the "pipe" command is currently on cooldown!') {
		const lastUsed = customData.get(LAST_USED);
		let timeLeft = -1;
		if (lastUsed)
			timeLeft = 15 - Math.round((+new Date() - +lastUsed) / 1000);

		return t`⚠ Please wait ${timeLeft > 0 && `for ${timeLeft}s`} before using $$tr again.`;
	}

	customData.set(LAST_USED, +new Date());
	return _args.join(" ");
});
