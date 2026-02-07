/**
 * Demonstrates sensitivity analysis helpers and series utilities.
 *
 * Run with:
 *   npx ts-node --esm --experimental-specifier-resolution=node examples/appUsage-3.ts
 */
import path from 'node:path';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import type { Component, Temperature } from '../src/types/models.js';
import type { Reaction } from '../src/types/external.js';
import {
  dlnKeq_dT,
  dG_rxn_dT,
  dlnK_dInvT,
  dlnK_dH,
  dH_rxn_dT,
  dS_rxn_dT,
  d2lnK_dT2,
  H_T_series,
  S_T_series,
  G_T_series,
  Cp_T_series,
  dG_rxn_STD_series,
  dS_rxn_STD_series,
  dH_rxn_STD_series,
  dCp_rxn_STD_series,
  Keq_series,
  species_contribution_enthalpy,
  species_contribution_gibbs,
  dlnK_dH_series,
  dlnKeq_dT_series,
  dlnK_dInvT_series,
  dG_rxn_dT_series,
  dH_rxn_dT_series,
  dS_rxn_dT_series,
  d2lnK_dT2_series,
} from '../src/app.js';
import { loadExampleModelSource, buildComponentModelSource } from './modelSource.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const results: string[] = [];
const logAndCapture = (...args: unknown[]) => {
  const line = args.map((arg) => (typeof arg === 'string' ? arg : JSON.stringify(arg))).join(' ');
  results.push(line);
  console.log(...args);
};

// --- Components ---
const hydrogen: Component = { name: 'dihydrogen', formula: 'H2', state: 'g' };
const oxygen: Component = { name: 'dioxygen', formula: 'O2', state: 'g' };
const water: Component = { name: 'dihydrogen monoxide', formula: 'H2O', state: 'g' };
const carbon_monoxide: Component = { name: 'carbon monoxide', formula: 'CO', state: 'g' };
const carbon_dioxide: Component = { name: 'carbon dioxide', formula: 'CO2', state: 'g' };

const components: Component[] = [hydrogen, oxygen, water, carbon_monoxide, carbon_dioxide];

// --- Model source ---
const model_source = await loadExampleModelSource(__dirname);
const component_model_source = await buildComponentModelSource(components, model_source);

// --- Reactions ---
const water_formation: Reaction = {
  name: 'water-formation-gas',
  reaction: '2 H2(g) + O2(g) => 2 H2O(g)',
  components: [hydrogen, oxygen, water]
};

const wgsr: Reaction = {
  name: 'water-gas-shift-reaction',
  reaction: 'CO(g) + H2O(g) => CO2(g) + H2(g)',
  components: [hydrogen, water, carbon_dioxide, carbon_monoxide]
};

// --- Temperature setup ---
const T_ref: Temperature = { value: 298.15, unit: 'K' };
const T_mid: Temperature = { value: 1000, unit: 'K' };
const T_high: Temperature = { value: 2000, unit: 'K' };
const temperature_list: Temperature[] = [
  { value: 400, unit: 'K' },
  { value: 800, unit: 'K' },
  { value: 1200, unit: 'K' },
  { value: 1600, unit: 'K' },
  { value: 2000, unit: 'K' }
];

const summarizeSeries = (
  label: string,
  series: Array<{ temperature: Temperature; result: unknown }>
) => {
  const first = series[0];
  const last = series[series.length - 1];
  logAndCapture(label);
  logAndCapture('  first:', first);
  logAndCapture('  last:', last);
};

// =============================================
// SECTION: Single-species property series
// =============================================
logAndCapture('=== Species series: H2 (gas) ===');
summarizeSeries(
  'H_T_series:',
  H_T_series({ component: hydrogen, temperature_list, model_source: component_model_source })
);
summarizeSeries(
  'S_T_series:',
  S_T_series({ component: hydrogen, temperature_list, model_source: component_model_source })
);
summarizeSeries(
  'G_T_series:',
  G_T_series({ component: hydrogen, temperature_list, model_source: component_model_source })
);
summarizeSeries(
  'Cp_T_series:',
  Cp_T_series({ component: hydrogen, temperature_list, model_source: component_model_source })
);

// =============================================
// SECTION: Reaction property series (water formation)
// =============================================
logAndCapture('\n=== Reaction series: 2 H2 + O2 -> 2 H2O (gas) ===');
summarizeSeries(
  'dH_rxn_STD_series:',
  dH_rxn_STD_series({ reaction: water_formation, temperature_list, model_source: component_model_source })
);
summarizeSeries(
  'dS_rxn_STD_series:',
  dS_rxn_STD_series({ reaction: water_formation, temperature_list, model_source: component_model_source })
);
summarizeSeries(
  'dG_rxn_STD_series:',
  dG_rxn_STD_series({ reaction: water_formation, temperature_list, model_source: component_model_source })
);
summarizeSeries(
  'Keq_series:',
  Keq_series({ reaction: water_formation, temperature_list, model_source: component_model_source })
);
summarizeSeries(
  'dCp_rxn_STD_series:',
  dCp_rxn_STD_series({ reaction: water_formation, temperature_list, model_source: component_model_source })
);

// =============================================
// SECTION: Sensitivity at single temperature (water formation)
// =============================================
logAndCapture('\n=== Sensitivities at T=1000 K (water formation) ===');
logAndCapture(
  'dlnKeq_dT:',
  dlnKeq_dT({ reaction: water_formation, temperature: T_mid, model_source: component_model_source })
);
logAndCapture(
  'dG_rxn_dT:',
  dG_rxn_dT({ reaction: water_formation, temperature: T_mid, model_source: component_model_source })
);
logAndCapture(
  "dlnK_dInvT:",
  dlnK_dInvT({ reaction: water_formation, temperature: T_mid, model_source: component_model_source })
);
logAndCapture(
  'dlnK_dH:',
  dlnK_dH({ reaction: water_formation, temperature: T_mid, model_source: component_model_source })
);
logAndCapture(
  'dH_rxn_dT:',
  dH_rxn_dT({ reaction: water_formation, temperature: T_mid, model_source: component_model_source })
);
logAndCapture(
  'dS_rxn_dT:',
  dS_rxn_dT({ reaction: water_formation, temperature: T_mid, model_source: component_model_source })
);
logAndCapture(
  'd2lnK_dT2:',
  d2lnK_dT2({ reaction: water_formation, temperature: T_mid, model_source: component_model_source })
);

// =============================================
// SECTION: Sensitivity series (water formation)
// =============================================
logAndCapture('\n=== Sensitivity series (water formation) ===');
summarizeSeries(
  'dlnKeq_dT_series:',
  dlnKeq_dT_series({ reaction: water_formation, temperature_list, model_source: component_model_source })
);
summarizeSeries(
  'dG_rxn_dT_series:',
  dG_rxn_dT_series({ reaction: water_formation, temperature_list, model_source: component_model_source })
);
summarizeSeries(
  'dlnK_dInvT_series:',
  dlnK_dInvT_series({ reaction: water_formation, temperature_list, model_source: component_model_source })
);
summarizeSeries(
  'dlnK_dH_series:',
  dlnK_dH_series({ reaction: water_formation, temperature_list, model_source: component_model_source })
);
summarizeSeries(
  'dH_rxn_dT_series:',
  dH_rxn_dT_series({ reaction: water_formation, temperature_list, model_source: component_model_source })
);
summarizeSeries(
  'dS_rxn_dT_series:',
  dS_rxn_dT_series({ reaction: water_formation, temperature_list, model_source: component_model_source })
);
summarizeSeries(
  'd2lnK_dT2_series:',
  d2lnK_dT2_series({ reaction: water_formation, temperature_list, model_source: component_model_source })
);

// =============================================
// SECTION: Species contribution breakdowns (WGSR at 1000 K)
// =============================================
logAndCapture('\n=== Species contributions at 1000 K (WGSR) ===');
logAndCapture(
  'species_contribution_enthalpy:',
  species_contribution_enthalpy({
    reaction: wgsr,
    temperature: T_mid,
    model_source: component_model_source
  })
);
logAndCapture(
  'species_contribution_gibbs:',
  species_contribution_gibbs({
    reaction: wgsr,
    temperature: T_mid,
    model_source: component_model_source
  })
);

const outputFile = path.join(__dirname, 'appUsage-3-results.txt');
await writeFile(outputFile, results.join('\n'), 'utf-8');
console.log(`\nResults written to ${outputFile}`);
