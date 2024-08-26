import fs, { writeFileSync } from "fs"

const script = fs.readFileSync("./dist/worker/index.js").toString("base64")

writeFileSync("./src/mods/library/mods/data/index.ts", `export const data = "data:application/javascript;base64,${script}"`)