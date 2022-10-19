export const GIST_ID = "bd158d0338d8e24efec397740bf68927";
/// $js importGist:${GIST_ID} function:main() -- ${0+}

import { entrypoint } from "#";

const LANGUAGES = [
	"Assembly",
	"Bash",
	"C",
	"C#",
	"C++",
	"Dart",
	"Delphi",
	"F#",
	"Go",
	"Hare",
	"Haskell",
	"Jakt",
	"Java",
	"JavaScript",
	"Julia",
	"Kotlin",
	"Lisp",
	"Lua",
	"OCaml",
	"PHP",
	"POSIX Shell",
	"Pascal",
	"Python",
	"Ruby",
	"Rust",
	"TypeScript",
	"Vala",
	"Visual Basic",
	"Zig",
];

entrypoint("main", () => {
	const target = args.length > 0 ? args.join(" ") : "IT";
	const language = utils.randArray(LANGUAGES)!;

	return `REWRITE ${target.toUpperCase()} IN ${language.toUpperCase()} ${"BatChest ".repeat(utils.random(1, 3))} ${"🚀".repeat(utils.random(5, 10))}`;
});
