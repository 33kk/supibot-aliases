export const GIST_ID = "bd158d0338d8e24efec397740bf68927";
/// $js importGist:${GIST_ID} function:main() -- ${0+}

import { entrypoint } from "#";

const LANGUAGES = [
	"ASSEMBLY",
	"BASH",
	"C",
	"C#",
	"C++",
	"DART",
	"DELPHI",
	"F#",
	"GO",
	"HARE",
	"HASKELL",
	"JAKT",
	"JAVA",
	"JS",
	"JULIA",
	"KOTLIN",
	"LISP",
	"LUA",
	"OCAML",
	"PASCAL",
	"PHP",
	"POSIX SHELL",
	"PYTHON",
	"RUBY",
	"RUST",
	"TYPESCRIPT",
	"VALA",
	"VISUAL BASIC",
	"ZIG",
];

entrypoint("main", () => {
	const target = args.length > 0 ? args.join(" ").toUpperCase() : "IT";

	return `REWRITE ${target} IN ${utils.randArray(LANGUAGES)} BatChest BatChest BatChest 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀`;
});
