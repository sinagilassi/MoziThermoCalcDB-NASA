import { describe, expect, it } from 'vitest';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

describe('node imports from built artifacts', () => {
  it('loads CJS bundle and exposes key APIs', () => {
    const cjs = require(path.resolve(__dirname, '..', 'dist', 'index.cjs'));
    expect(typeof cjs.H_T).toBe('function');
    expect(typeof cjs.Keq).toBe('function');
    expect(typeof cjs.dlnKeq_dT).toBe('function');
    expect(typeof cjs.equilibrium_temperature).toBe('function');
  });

  it('loads ESM bundle and exposes key APIs', async () => {
    const esm = await import(path.resolve(__dirname, '..', 'dist', 'index.mjs'));
    expect(typeof esm.H_T).toBe('function');
    expect(typeof esm.Keq).toBe('function');
    expect(typeof esm.dlnKeq_dT).toBe('function');
    expect(typeof esm.equilibrium_temperature).toBe('function');
  });
});
