"use strict";

const fs = require("fs");
const pkg = require("../package.json");

if (process.argv.length !== 3) {
    console.error("Expecting exactly one parameter: outputFile");
    process.exit(1);
}

const outputFile = process.argv[2];

fs.writeFileSync(outputFile, `export default ${JSON.stringify(pkg.version)};`);
