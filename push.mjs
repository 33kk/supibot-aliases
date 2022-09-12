#!/usr/bin/node
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { build } from "esbuild";
import { Octokit } from "@octokit/rest";
import chalk from "chalk";
import config from "./config.mjs";

const octokit = new Octokit({
	auth: config.github
})

let lastRun = 0;

async function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitCooldown() {
	console.log(chalk.gray("Waiting for cooldown..."));
	while (!((+new Date() - lastRun) > 3 * 1000)) {
		await sleep(50);
	}
}

async function supibotCommand(query) {
	const res = await fetch("https://supinic.com/api/bot/command/run", {
		method: "POST",
		headers: {
			"Cookie": config.supibot,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ query: "$" + query })
	});
	const json = await res.json();
	return json.data.reply;
}

async function main() {
	let aliases = process.argv.slice(2);

	if (aliases.length === 0) {
		aliases = (await readdir("./src-aliases/")).map(a => a.split(".")[0]);
	}

	for (const alias of aliases) {
		console.log(`Updating alias: ${alias}`);
		try {
			await updateAlias(alias);
		} catch (e) {
			console.error(chalk.red(e));
		}
	}
}

async function updateAlias(name) {
	const sourcePath = join("./src-aliases", `${name}.ts`);
	const bundlePath = join("./dist", `${name}.js`);

	const source = await readFile(sourcePath, { encoding: "utf-8" });
	const gistIdMatch = source.match(/^(?:export )?const GIST_ID = ['"`](.*?)['"`];?/m);
	const aliasCommandMatch = source.match(/^\/\/\/ \$(.*?)$/m);

	if (!gistIdMatch) {
		throw "No gist id found";
	}

	await build({
		write: true,
		bundle: true,
		minify: true,
		treeShaking: true,
		entryPoints: [ sourcePath ],
		outfile: bundlePath
	});

	const gistId = gistIdMatch[1];

	const gist = await octokit.gists.get({
		gist_id: gistId
	});

	const gistFilename = Object.keys(gist.data.files)[0];
	const newContent = await readFile(bundlePath, { encoding: "utf-8" });

	if (gist.data.files[gistFilename].content === newContent) {
		console.log(chalk.green("Gist content is already up to date"));
	}
	else {
		await octokit.gists.update({
			gist_id: gistId,
			files: {
				[gistFilename]: {
					content: newContent
				}
			}
		});

		console.log(chalk.green(`Gist updated: https://gist.github.com/${gistId}`));
	}

	if (!aliasCommandMatch) {
		console.log(chalk.yellow("No alias command found"));
	}
	else {
		const aliasCommand = aliasCommandMatch[1];

		await waitCooldown();
		const response = await supibotCommand(`alias addedit ${name} ${aliasCommand}`);
		lastRun = +new Date();
		if (!response.includes("success")) {
			throw response;
		}
		console.log(chalk.green(response));
	}

}

main();
