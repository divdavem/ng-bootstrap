"use strict";

const fs = require("fs");

if (process.argv.length < 5) {
    console.error(`Expecting at least 3 parameters: outputFile widgetName demo1 [demo2] [...]`);
    process.exit(1);
}

const outputFile = process.argv[2];
const widgetName = process.argv[3];
const demos = process.argv.slice(4);

const capitalize = identifier => `${identifier[0].toUpperCase()}${identifier.slice(1)}`;
const capitalizedWidgetName = capitalize(widgetName);

const imports = [];
const snippets = [];

demos.forEach(demo => {
    imports.push(`import ${demo}Code from './${demo}/${widgetName}-${demo}.ts.prismjs';`);
    imports.push(`import ${demo}Markup from './${demo}/${widgetName}-${demo}.html.prismjs';`);
    snippets.push(`'${demo}': {
        code: ${demo}Code,
        markup: ${demo}Markup
    }`);
});

const fileContent = `${imports.join('\n')}

export const DEMO_SNIPPETS = {
    ${snippets.join(',\n    ')}
};
`;

fs.writeFileSync(outputFile, fileContent);
