import dts from "rollup-plugin-dts";
import externals from "rollup-plugin-node-externals";
import swc from "rollup-plugin-swc3";

/**
 * @type {import("rollup").RollupOptions[]}
 */
export const config = [
  {
    input: "./src/mods/library/index.ts",
    output: [{
      dir: "./dist/esm",
      format: "esm",
      exports: "named",
      preserveModules: true,
      sourcemap: true,
      entryFileNames: "[name].mjs",
    }, {
      dir: "./dist/cjs",
      format: "cjs",
      exports: "named",
      preserveModules: true,
      sourcemap: true,
      entryFileNames: "[name].cjs",
    }],
    plugins: [externals(), swc({ sourceMaps: true })]
  },
  {
    input: "./src/mods/library/index.ts",
    output: [{
      dir: "./dist/types",
      format: "esm",
      exports: "named",
      preserveModules: true,
      sourcemap: false,
      entryFileNames: "[name].d.ts",
    }],
    plugins: [externals(), dts({ tsconfig: "tsconfig.json" })]
  },
  {
    input: "./src/mods/library/index.test.ts",
    output: [{
      dir: "./dist/test",
      format: "esm",
      exports: "named",
      preserveModules: true,
      sourcemap: false,
      entryFileNames: "[name].mjs"
    }],
    plugins: [externals({ devDeps: true }), swc()],
  },
]

export default config