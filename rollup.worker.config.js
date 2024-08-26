import resolve from "@rollup/plugin-node-resolve";
import { dts } from "rollup-plugin-dts";
import externals from "rollup-plugin-node-externals";
import swc from "rollup-plugin-swc3";

/**
 * @type {import("rollup").RollupOptions[]}
 */
export const config = [
  {
    input: "./src/mods/worker/index.ts",
    output: [{
      file: "./dist/worker/index.js",
      format: "esm",
      exports: "named",
      preserveModules: false,
      sourcemap: false,
      entryFileNames: "[name].mjs",
    },],
    plugins: [resolve(), swc({ minify: true })]
  },
  {
    input: "./src/mods/worker/index.ts",
    output: [{
      file: "./dist/worker/index.d.ts",
      format: "esm",
      exports: "named",
      preserveModules: false,
      sourcemap: false,
      entryFileNames: "[name].d.ts",
    }],
    plugins: [externals(), dts({ tsconfig: "tsconfig.json" })]
  }
]

export default config