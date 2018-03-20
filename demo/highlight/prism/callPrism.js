"use strict";

const Prism = require("prismjs");
const fs = require("fs");
const path = require("path");

if (process.argv.length !== 4) {
    console.error("Expecting exactly 2 arguments (input and output files).");
    process.exit(1);
}

const fileName = process.argv[2];
const outputFile = process.argv[3];

const extension = path.extname(fileName).toLowerCase();

let prismLanguage;

if (extension === ".ts") {
    require("prismjs/components/prism-typescript");
    prismLanguage = Prism.languages.typescript;
} else if (extension === ".html") {
    prismLanguage = Prism.languages.markup;
} else {
    console.error(`Unknown extension: ${extension}`);
    process.exit(1);
}

const code = fs.readFileSync(fileName, "utf8");
const html = Prism.highlight(code, prismLanguage);

fs.writeFileSync(outputFile, `export default ${JSON.stringify(html)};`);
