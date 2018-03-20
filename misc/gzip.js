const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

if (process.argv.length !== 4) {
    console.error("Expecting exactly 2 arguments (input and output files).");
    process.exit(1);
}

const inputFile = process.argv[2];
const outputFile = process.argv[3];

const gzip = zlib.createGzip({
    level: 9,
    memLevel: 9
})
const inputStream = fs.createReadStream(inputFile);
const outputStream = fs.createWriteStream(outputFile);

inputStream.pipe(gzip).pipe(outputStream);
