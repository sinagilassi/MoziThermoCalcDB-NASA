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
    expect(typeof cjs.dG_rxn_dT).toBe('function');
    expect(typeof cjs.dlnK_dInvT).toBe('function');
    expect(typeof cjs.equilibrium_temperature_K1).toBe('function');
    expect(typeof cjs.dCp_rxn_STD).toBe('function');
    expect(typeof cjs.species_contribution_enthalpy).toBe('function');
    expect(typeof cjs.species_contribution_gibbs).toBe('function');
  });

  it('loads ESM bundle and exposes key APIs', async () => {
    const esm = await import(path.resolve(__dirname, '..', 'dist', 'index.mjs'));
    expect(typeof esm.H_T).toBe('function');
    expect(typeof esm.Keq).toBe('function');
    expect(typeof esm.dlnKeq_dT).toBe('function');
    expect(typeof esm.equilibrium_temperature).toBe('function');
    expect(typeof esm.dG_rxn_dT).toBe('function');
    expect(typeof esm.dlnK_dInvT).toBe('function');
    expect(typeof esm.equilibrium_temperature_K1).toBe('function');
    expect(typeof esm.dCp_rxn_STD).toBe('function');
    expect(typeof esm.species_contribution_enthalpy).toBe('function');
    expect(typeof esm.species_contribution_gibbs).toBe('function');
  });
});
