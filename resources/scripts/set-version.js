const fs = require("node:fs");
const path = require("node:path");

const packageJson = require("../../package.json");

fs.writeFileSync(
    path.resolve(__dirname, "../../source/main/library/build.ts"),
    `// This file updated automatically: changes made here will be overwritten!

export const VERSION = "${packageJson.version}";
`
);
