#!/usr/bin/node
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { build as esbuild } from "esbuild";
import { Octokit } from "@octokit/rest";
import chalk from "chalk";
import config from "./config.mjs";
import supiUtils from "supi-core/singletons/utils.js";

const utils = supiUtils.singleton();

const octokit = new Octokit({
	auth: config.github
});

let lastRun = 0;

async function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitCooldown(s) {
	console.log(chalk.gray("Waiting for cooldown..."));
	while (!((+new Date() - lastRun) > s * 1000)) {
		await sleep(50);
	}
}

async function supibotCommand(query, cooldown = 3) {
	await waitCooldown(cooldown);

	const res = await fetch("https://supinic.com/api/bot/command/run", {
		method: "POST",
		headers: {
			"User-Agent": `supibot-aliases (${config.repo})`,
			"Authorization": `Basic ${config.supibot}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ query: "$" + query })
	});

	lastRun = +new Date();

	const json = await res.json();
	return json.data.reply;
}

function chunkify(array, maxSize) {
	if (maxSize < 1) return [];
	let out = [];
	const chunks = Math.ceil(array.length / maxSize);
	for (let i = 0; i < chunks; i++) {
		out.push(array.slice(i * maxSize, i * maxSize + maxSize));
	}
	return out;
}

let updatedGists = [];

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

	const gistChunks = chunkify(updatedGists, 8);

	for (const chunk of gistChunks) {
		console.log(`Reloading ${chunk.join(", ")}`);

		const response = await supibotCommand(`pipe ${chunk.map(gistId => `js force:true errorInfo:true importGist:${gistId} "//"`).join(" | ")} | null | abb say Gists successfully reloaded!`, 7.5);

		if (!response.includes("success")) {
			throw response;
		}
		console.log(chalk.green(response));
	}
}

async function updateAlias(name) {
	const bundlePath = join("./dist", `${name}.js`);
	const sourcePath = join("./src-aliases", `${name}.ts`);
	const source = await readFile(sourcePath, { encoding: "utf-8" });

	const aliasCommandMatch = source.match(/^\/\/\/ \$(.*?)$/m);
	const gistIdMatch = source.match(/^(?:export )?const GIST_ID = ['"`](.*?)['"`];?/m);

	await esbuild({
		write: true,
		bundle: true,
		minify: true,
		treeShaking: true,
		entryPoints: [ sourcePath ],
		outfile: bundlePath,
		define: {
			ALIAS_NAME: `"${name}"`
		}
	});

	if (!gistIdMatch) {
		throw "No gist id found";
	}

	const gistId = gistIdMatch[1];

	const gist = await octokit.gists.get({
		gist_id: gistId
	});

	const gistFilename = Object.keys(gist.data.files)[0];

	const bundle = await readFile(bundlePath, { encoding: "utf-8" });

	if (gist.data.files[gistFilename].content === bundle) {
		console.log(chalk.green("Gist content is already up to date"));
	}
	else {
		await octokit.gists.update({
			gist_id: gistId,
			description: config.repo,
			files: {
				[gistFilename]: {
					filename: `supibot-${name}.js`,
					content: bundle
				}
			}
		});

		if (!updatedGists.includes(gistId))
			updatedGists.push(gistId);

		console.log(chalk.green(`Gist updated! https://gist.github.com/${gistId}`));
	}

	if (!aliasCommandMatch) {
		console.log(chalk.yellow("No alias command found"));
	}
	else {
		let aliasCommand = aliasCommandMatch[1].replaceAll("${GIST_ID}", gistId);

		const matches = Array.from(aliasCommand.matchAll(/_char:([^\s]+)/g)).map(e => e[1]);

		for (const match of matches) {
			aliasCommand = aliasCommand.replaceAll(match, utils.randomString(25));
		}

		const response = await supibotCommand(`alias addedit ${name} ${aliasCommand}`);

		if (!response.includes("success")) {
			throw response;
		}
		console.log(chalk.green(response));
	}
}

main();
