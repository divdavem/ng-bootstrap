"use strict";

const fs = require('fs');

const outputFile = process.argv[2];
const inputFiles = process.argv.slice(3);

const newLine = Buffer.from("\n");
const buffers = [];
for (const file of inputFiles) {
    if (buffers.length > 0) {
        buffers.push(newLine);
    }
    buffers.push(fs.readFileSync(file));
}

fs.writeFileSync(outputFile, Buffer.concat(buffers));
