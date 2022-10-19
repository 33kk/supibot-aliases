export const GIST_ID = "bd158d0338d8e24efec397740bf68927";
/// $js importGist:${GIST_ID} function:main() -- ${0+}

import { entrypoint } from "#";

const LANGUAGES = [
	"Assembly",
	"Awk",
	"Bash",
	"C",
	"C#",
	"C++",
	"Carbon",
	"Clojure",
	"Cobol",
	"Crystal",
	"D",
	"Dart",
	"Delphi",
	"Elixir",
	"Erlang",
	"F#",
	"Fennel",
	"Go",
	"Hare",
	"Haskell",
	"Haxe",
	"HolyC",
	"Jai",
	"Jakt",
	"Java",
	"JavaScript",
	"Julia",
	"Kotlin",
	"Lisp",
	"Lua",
	"Nim",
	"OCaml",
	"Odin",
	"PHP",
	"POSIX Shell",
	"Pascal",
	"Perl",
	"Porth",
	"PowerShell",
	"Prolog",
	"Python",
	"R",
	"Ruby",
	"Rust",
	"Scala",
	"Swift",
	"TypeScript",
	"V",
	"Vala",
	"Visual Basic",
	"Zig",
];

entrypoint("main", () => {
	const target = args.length > 0 ? args.join(" ") : "IT";
	const language = utils.randArray(LANGUAGES)!;

	return `REWRITE ${target.toUpperCase()} IN ${language.toUpperCase()} ${"BatChest ".repeat(utils.random(1, 3))} ${"🚀".repeat(utils.random(5, 10))}`;
});
