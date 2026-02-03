import { describe, expect, it } from 'vitest';
import path from 'node:path';

describe('browser bundle import', () => {
  it('loads browser ESM build and exposes key APIs', async () => {
    const browser = await import(path.resolve(__dirname, '..', 'dist', 'index.browser.mjs'));
    expect(typeof browser.H_T).toBe('function');
    expect(typeof browser.dlnKeq_dT).toBe('function');
    expect(typeof browser.equilibrium_temperature).toBe('function');
    expect(typeof browser.dG_rxn_dT).toBe('function');
    expect(typeof browser.dlnK_dInvT).toBe('function');
    expect(typeof browser.equilibrium_temperature_K1).toBe('function');
    expect(typeof browser.dCp_rxn_STD).toBe('function');
    expect(typeof browser.species_contribution_enthalpy).toBe('function');
    expect(typeof browser.species_contribution_gibbs).toBe('function');
    expect(typeof browser.dlnK_dH).toBe('function');
    expect(typeof browser.dH_rxn_dT).toBe('function');
    expect(typeof browser.dS_rxn_dT).toBe('function');
    expect(typeof browser.d2lnK_dT2).toBe('function');
    expect(typeof browser.dlnKeq_dT_series).toBe('function');
    expect(typeof browser.dG_rxn_dT_series).toBe('function');
    expect(typeof browser.dlnK_dInvT_series).toBe('function');
    expect(typeof browser.dlnK_dH_series).toBe('function');
    expect(typeof browser.dH_rxn_dT_series).toBe('function');
    expect(typeof browser.dS_rxn_dT_series).toBe('function');
    expect(typeof browser.d2lnK_dT2_series).toBe('function');
    expect(typeof browser.dCp_rxn_STD_series).toBe('function');
    expect(typeof browser.H_T_series).toBe('function');
    expect(typeof browser.S_T_series).toBe('function');
    expect(typeof browser.G_T_series).toBe('function');
    expect(typeof browser.Cp_T_series).toBe('function');
    expect(typeof browser.dG_rxn_STD_series).toBe('function');
    expect(typeof browser.dS_rxn_STD_series).toBe('function');
    expect(typeof browser.dH_rxn_STD_series).toBe('function');
    expect(typeof browser.Keq_series).toBe('function');
  });
});
