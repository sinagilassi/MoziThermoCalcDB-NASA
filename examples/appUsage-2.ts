/**
 * Demonstrates how to use the exported helpers from `src/app.ts`.
 *
 * Steps:
 * 1) Build a `ModelSource` from the provided NASA9 CSVs.
 * 2) Compute single-species properties (H, S, G, Cp).
 * 3) Compute reaction properties (dH, dS, dG, Keq, Keq via van't Hoff).
 *
 * Run with: `npx ts-node --esm --experimental-specifier-resolution=node examples/appUsage.ts`
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { H_T, S_T, G_T, Cp_T, dH_rxn_STD, dS_rxn_STD, dG_rxn_STD, Keq, Keq_vh_shortcut } from '../src/app.js';
import type { Component, Temperature } from '../src/types/models.js';
import type { Reaction } from '../src/types/external.js';
import { loadExampleModelSource, buildComponentModelSource } from './modelSource.js';

// --- Single-species examples (NASA9) ---
const hydrogen: Component = { name: 'dihydrogen', formula: 'H2', state: 'g' };
const oxygen: Component = { name: 'dioxygen', formula: 'O2', state: 'g' };
const water: Component = { name: 'dihydrogen monoxide', formula: 'H2O', state: 'g' };
// >> components
const components: Component[] = [hydrogen, oxygen, water];

// SECTION: Create ModelSource from NASA9 CSVs
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dataDir = path.join(__dirname, '..', 'private');
const model_source = await loadExampleModelSource(dataDir);

// NOTE: You can also build a ModelSource with only specific components if desired.
const component_model_source = await buildComponentModelSource(
    components,
    model_source
);

// --- Temperature definitions ---
const temperature1500: Temperature = { value: 1500, unit: 'K' };
const temperature298: Temperature = { value: 298.15, unit: 'K' };

console.log('=== Species properties for H2 (dihydrogen, gas) ===');
const h_1500 = H_T({ component: hydrogen, temperature: temperature1500, model_source: component_model_source });
console.log('H(T=1500 K):', h_1500);

const s_1500 = S_T({ component: hydrogen, temperature: temperature1500, model_source: component_model_source });
console.log('S(T=1500 K):', s_1500);

const g_1500 = G_T({ component: hydrogen, temperature: temperature1500, model_source: component_model_source });
console.log('G(T=1500 K):', g_1500);

const cp_298_molar = Cp_T({ component: hydrogen, temperature: temperature298, model_source: component_model_source, basis: 'molar' });
console.log('Cp(T=298.15 K, molar):', cp_298_molar);

const cp_298_mass = Cp_T({ component: hydrogen, temperature: temperature298, model_source: component_model_source, basis: 'mass' });
console.log('Cp(T=298.15 K, mass):', cp_298_mass);

// --- Reaction examples ---
// Reaction: 2 H2(g) + O2(g) => 2 H2O(g)


// RXNAnalyzer derives stoichiometry; keys use "Formula-State" because app.ts requests reaction_ids=true.
const reaction: Reaction = {
    name: 'water-formation-gas',
    reaction: '2 H2(g) + O2(g) => 2 H2O(g)',
    components: [hydrogen, oxygen, water]
};

const reactionTemperature: Temperature = { value: 1200, unit: 'K' };

console.log('\n=== Reaction properties for 2H2 + O2 -> 2H2O (gas) at 1200 K ===');
const dH = dH_rxn_STD({ reaction, temperature: reactionTemperature, model_source: component_model_source });
console.log('dH_rxn_STD:', dH);

const dS = dS_rxn_STD({ reaction, temperature: reactionTemperature, model_source: component_model_source });
console.log('dS_rxn_STD:', dS);

const dG = dG_rxn_STD({ reaction, temperature: reactionTemperature, model_source: component_model_source });
console.log('dG_rxn_STD:', dG);

const KeqVal = Keq({ reaction, temperature: reactionTemperature, model_source: component_model_source });
console.log('Keq:', KeqVal);

const KeqVH = Keq_vh_shortcut({ reaction, temperature: reactionTemperature, model_source: component_model_source });
console.log("Keq (van't Hoff shortcut):", KeqVH);
