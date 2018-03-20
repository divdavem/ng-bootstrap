"use strict";

const fs = require('fs');
const doc = require('./api-doc');

const outputFile = process.argv[2];
const inputFiles = process.argv.slice(3);

const api = doc(inputFiles);

fs.writeFileSync(outputFile, `export default ${JSON.stringify(api)};`);
