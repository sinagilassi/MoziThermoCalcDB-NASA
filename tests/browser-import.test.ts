import { describe, expect, it } from 'vitest';
import path from 'node:path';

describe('browser bundle import', () => {
  it('loads browser ESM build and exposes key APIs', async () => {
    const browser = await import(path.resolve(__dirname, '..', 'dist', 'index.browser.mjs'));
    expect(typeof browser.H_T).toBe('function');
    expect(typeof browser.dlnKeq_dT).toBe('function');
    expect(typeof browser.equilibrium_temperature).toBe('function');
  });
});
