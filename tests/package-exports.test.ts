import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const pkgPath = path.resolve(__dirname, '..', 'package.json');
const distDir = path.resolve(__dirname, '..', 'dist');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

describe('package metadata and dist outputs', () => {
  it('exposes main/module/browser/types entries', () => {
    expect(pkg.main).toBe('./dist/index.cjs');
    expect(pkg.module).toBe('./dist/index.mjs');
    expect(pkg.browser).toBe('./dist/index.browser.mjs');
    expect(pkg.types).toBe('./dist/index.d.ts');
  });

  it('has matching export map', () => {
    const exp = pkg.exports?.['.'];
    expect(exp).toMatchObject({
      types: './dist/index.d.ts',
      browser: './dist/index.browser.mjs',
      import: './dist/index.mjs',
      require: './dist/index.cjs'
    });
  });

  it('includes built artifacts in dist/', () => {
    ['index.cjs', 'index.mjs', 'index.browser.mjs', 'index.d.ts'].forEach((file) => {
      expect(existsSync(path.join(distDir, file))).toBe(true);
    });
  });
});
