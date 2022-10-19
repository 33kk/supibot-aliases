export const GIST_ID = "f1b77affd7e0ebd6b337965d0f52313a";
/// $pipe _char:| js importGist:${GIST_ID} function:main() -- ${0+} | $ eval

import { entrypoint, get, say, set } from "#";
import { App, Option } from "@kkx-org/args";

type Config = {
	wordle: boolean;
	ping: boolean;
	ago: boolean;
};

const configOptions: Option[] = [
	{
		id: "wordle",
		keys: [ "wordle" ],
	},
	{
		id: "ping",
		keys: [ "ping" ],
	},
	{
		id: "ago",
		keys: [ "ago" ],
	},
];

const app = new App({
	id: ALIAS_NAME,
	subcommands: [
		{
			id: "config",
			keys: ["config"],
			options: configOptions
		}
	]
});


entrypoint("main", () => {
	const cmd = app.parseArgs(args);

	return cmd.matchCommand({
		_default: (cmd) => {
			const config: Config = get("config", true);

			return say(JSON.stringify(config));
		},
		config: (cmd) => {
			set("config", Object.fromEntries(Object.entries(cmd.options).map(e => [e[0], e[1][0] === "true"])), true);

			return say("Config saved");
		}
	});
});
