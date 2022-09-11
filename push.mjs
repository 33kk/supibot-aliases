#!/usr/bin/node

import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { build } from "esbuild";
import { Octokit } from "@octokit/rest";
import token from "./token.mjs";

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
			console.error(e);
		}
	}
}

async function updateAlias(alias) {
	const scriptPath = join("./src-aliases", `${alias}.ts`);
	const bundlePath = join("./dist", `${alias}.js`);

	const script = await readFile(scriptPath, { encoding: "utf-8" });
	const match = script.match(/^(?:export )?const GIST_ID = ['"`](.*?)['"`];?/m);

	if (!match) {
		throw "No gist id found";
	}

	await build({
		write: true,
		bundle: true,
		minify: true,
		treeShaking: true,
		entryPoints: [ scriptPath ],
		outfile: bundlePath
	});

	const gistId = match[1];

	const octokit = new Octokit({
		auth: token
	})

	console.log(gistId);

	const gist = await octokit.gists.get({
		gist_id: gistId
	});

	const gistFile = Object.keys(gist.data.files)[0];
	const newContent = await readFile(bundlePath, { encoding: "utf-8" });

	if (gist.data.files[gistFile].content === newContent) {
		return console.log("Gist content is already up to date");
	}

	await octokit.gists.update({
		gist_id: gistId,
		files: {
			[gistFile]: {
				content: newContent
			}
		}
	});

	console.log(`Gist updated: https://gist.github.com/${gistId}`);
}

main();
