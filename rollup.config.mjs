import path from 'node:path';
import { builtinModules, createRequire } from 'node:module';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import tsconfigPaths from 'rollup-plugin-tsconfig-paths';
import dts from 'rollup-plugin-dts';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const entry = './src/index.ts';
const entryResolved = path.resolve(entry);
const externalDeps = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {})
];
const external = (id) => {
  const resolved = path.isAbsolute(id) ? id : path.resolve(id);
  if (resolved === entryResolved) return false;
  if (builtinModules.includes(id) || builtinModules.some((b) => id.startsWith(`node:${b}`))) return true;
  return externalDeps.some((dep) => id === dep || id.startsWith(`${dep}/`));
};

export default [
  {
    input: entry,
    output: [
      { file: 'dist/index.mjs', format: 'esm', sourcemap: true },
      { file: 'dist/index.cjs', format: 'cjs', sourcemap: true, exports: 'named' }
    ],
    plugins: [
      tsconfigPaths(),
      nodeResolve({ exportConditions: ['node', 'import', 'default'] }),
      typescript({ tsconfig: './tsconfig.json' })
    ],
    external
  },
  {
    input: entry,
    output: [{ file: 'dist/index.browser.mjs', format: 'esm', sourcemap: true }],
    plugins: [
      tsconfigPaths(),
      nodeResolve({ browser: true, exportConditions: ['browser', 'import', 'default'] }),
      typescript({ tsconfig: './tsconfig.json' })
    ],
    external
  },
  {
    input: entry,
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [tsconfigPaths(), dts({ tsconfigPath: './tsconfig.json' })]
  }
];
