#!/usr/bin/node
import { writeFile } from "fs/promises";
import { join } from "path";
import { Octokit } from "@octokit/rest";
import chalk from "chalk";
import config from "./config.mjs";
import { existsSync } from "fs";

const octokit = new Octokit({
	auth: config.github
})

async function main() {
	const name = process.argv[2];
	const sourcePath = join("./src-aliases", `${name}.ts`);

	if (existsSync(sourcePath)) {
		console.error(chalk.red("Alias already exists"));
		process.exit(1);
	}

	if (!name) {
		console.error(chalk.red("No alias name specified"));
		process.exit(1);
	}

	const gist = await octokit.gists.create({
		files: {
			[`supibot-${name}.js`]: {
				content: "/* placeholder */"
			}
		}
	});

	const content = `export const GIST_ID = "${gist.data.id}";
/// $js importGist:${gist.data.id} function:main() -- \${0+}

import { entrypoint } from "#";

entrypoint("main", () => {
	return "FeelsDankMan " + (args as string[]).join(" ");
});`;

	await writeFile(sourcePath, content);

	console.log(chalk.green(`Gist ${gist.data.html_url} and file ${sourcePath} successfully created!`));
}

main();
