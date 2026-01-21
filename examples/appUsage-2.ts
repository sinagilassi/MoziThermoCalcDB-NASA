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
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { H_T, S_T, G_T, Cp_T, dH_rxn_STD, dS_rxn_STD, dG_rxn_STD, Keq, Keq_vh_shortcut } from '../src/app.js';
import type { Component, Temperature } from '../src/types/models.js';
import type { Reaction } from '../src/types/external.js';
import { loadExampleModelSource, buildComponentModelSource } from './modelSource.js';

// --- Single-species examples (NASA9) ---
const hydrogen: Component = { name: 'dihydrogen', formula: 'H2', state: 'g' };
const oxygen: Component = { name: 'dioxygen', formula: 'O2', state: 'g' };
const water: Component = { name: 'dihydrogen monoxide', formula: 'H2O', state: 'g' };
const methane: Component = { name: 'methane', formula: 'CH4', state: 'g' };
const carbon_monoxide: Component = { name: 'carbon monoxide', formula: 'CO', state: 'g' };
const carbon_dioxide: Component = { name: 'carbon dioxide', formula: 'CO2', state: 'g' };
const ethanol: Component = { name: 'ethanol', formula: 'C2H6O', state: 'g' };
const methanol: Component = { name: 'methanol', formula: 'CH4O', state: 'g' };
// >> components
const components: Component[] = [
    hydrogen,
    oxygen,
    water,
    methane,
    carbon_monoxide,
    carbon_dioxide,
    ethanol,
    methanol
];

// SECTION: Create ModelSource from NASA9 CSVs
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dataDir = path.join(__dirname);
const model_source = await loadExampleModelSource(dataDir);

// NOTE: You can also build a ModelSource with only specific components if desired.
const component_model_source = await buildComponentModelSource(
    components,
    model_source
);

// --- Temperature definitions ---
const temperature1500: Temperature = { value: 1500, unit: 'K' };
const temperature298: Temperature = { value: 298.15, unit: 'K' };

const results: string[] = [];
const logAndCapture = (...args: unknown[]) => {
    const line = args
        .map((arg) => (typeof arg === 'string' ? arg : JSON.stringify(arg)))
        .join(' ');
    results.push(line);
    console.log(...args);
};

// NOTE: H2 example
console.log('=== Species properties for H2 (dihydrogen, gas) ===');
results.push('=== Species properties for H2 (dihydrogen, gas) ===');
const h_1500 = H_T({ component: hydrogen, temperature: temperature1500, model_source: component_model_source });
logAndCapture('H(T=1500 K):', h_1500);

const s_1500 = S_T({ component: hydrogen, temperature: temperature1500, model_source: component_model_source });
logAndCapture('S(T=1500 K):', s_1500);

const g_1500 = G_T({ component: hydrogen, temperature: temperature1500, model_source: component_model_source });
logAndCapture('G(T=1500 K):', g_1500);

const cp_298_molar = Cp_T({ component: hydrogen, temperature: temperature298, model_source: component_model_source, basis: 'molar' });
logAndCapture('Cp(T=298.15 K, molar):', cp_298_molar);

const cp_298_mass = Cp_T({ component: hydrogen, temperature: temperature298, model_source: component_model_source, basis: 'mass' });
logAndCapture('Cp(T=298.15 K, mass):', cp_298_mass);

// NOTE: H2O example
console.log('\n=== Species properties for H2O (dihydrogen monoxide, gas) ===');
results.push('=== Species properties for H2O (dihydrogen monoxide, gas) ===');
const h2o_1500 = H_T({ component: water, temperature: temperature1500, model_source: component_model_source });
logAndCapture('H(T=1500 K):', h2o_1500);

const s2o_1500 = S_T({ component: water, temperature: temperature1500, model_source: component_model_source });
logAndCapture('S(T=1500 K):', s2o_1500);

const g2o_1500 = G_T({ component: water, temperature: temperature1500, model_source: component_model_source });
logAndCapture('G(T=1500 K):', g2o_1500);

const cp2o_298_molar = Cp_T({ component: water, temperature: temperature298, model_source: component_model_source, basis: 'molar' });
logAndCapture('Cp(T=298.15 K, molar):', cp2o_298_molar);

const cp2o_298_mass = Cp_T({ component: water, temperature: temperature298, model_source: component_model_source, basis: 'mass' });
logAndCapture('Cp(T=298.15 K, mass):', cp2o_298_mass);


// NOTE: CH4 example
console.log('\n=== Species properties for CH4 (methane, gas) ===');
results.push('=== Species properties for CH4 (methane, gas) ===');
const ch4_1500 = H_T({ component: methane, temperature: temperature1500, model_source: component_model_source });
logAndCapture('H(T=1500 K):', ch4_1500);

const s_ch4_1500 = S_T({ component: methane, temperature: temperature1500, model_source: component_model_source });
logAndCapture('S(T=1500 K):', s_ch4_1500);

const g_ch4_1500 = G_T({ component: methane, temperature: temperature1500, model_source: component_model_source });
logAndCapture('G(T=1500 K):', g_ch4_1500);

const cp_ch4_298_molar = Cp_T({ component: methane, temperature: temperature298, model_source: component_model_source, basis: 'molar' });
logAndCapture('Cp(T=298.15 K, molar):', cp_ch4_298_molar);

const cp_ch4_298_mass = Cp_T({ component: methane, temperature: temperature298, model_source: component_model_source, basis: 'mass' });
logAndCapture('Cp(T=298.15 K, mass):', cp_ch4_298_mass);

// NOTE: CO2 example
console.log('\n=== Species properties for CO2 (carbon dioxide, gas) ===');
results.push('=== Species properties for CO2 (carbon dioxide, gas) ===');
const co2_1500 = H_T({
    component: carbon_dioxide, temperature: {
        value: 300, unit: 'K'
    }, model_source: component_model_source
});
logAndCapture('H(T=300 K):', co2_1500);

const s_co2_1500 = S_T({
    component: carbon_dioxide, temperature: {
        value: 400, unit: 'K'
    }, model_source: component_model_source
});
logAndCapture('S(T=400 K):', s_co2_1500);

const g_co2_1500 = G_T({
    component: carbon_dioxide, temperature: {
        value: 500, unit: 'K'
    }, model_source: component_model_source
});
logAndCapture('G(T=500 K):', g_co2_1500);

const cp_co2_298_molar = Cp_T({
    component: carbon_dioxide, temperature: {
        value: 600, unit: 'K'
    }, model_source: component_model_source, basis: 'molar'
});
logAndCapture('Cp(T=600 K, molar):', cp_co2_298_molar);

const cp_co2_298_mass = Cp_T({ component: carbon_dioxide, temperature: temperature298, model_source: component_model_source, basis: 'mass' });
logAndCapture('Cp(T=298.15 K, mass):', cp_co2_298_mass);

// NOTE: C2H6O example
console.log('\n=== Species properties for C2H6O (ethanol, gas) ===');
results.push('=== Species properties for C2H6O (ethanol, gas) ===');
const c2h6o_1500 = H_T({ component: ethanol, temperature: temperature1500, model_source: component_model_source });
logAndCapture('H(T=1500 K):', c2h6o_1500);

const s_c2h6o_1500 = S_T({ component: ethanol, temperature: temperature1500, model_source: component_model_source });
logAndCapture('S(T=1500 K):', s_c2h6o_1500);

const g_c2h6o_1500 = G_T({ component: ethanol, temperature: temperature1500, model_source: component_model_source });
logAndCapture('G(T=1500 K):', g_c2h6o_1500);

const cp_c2h6o_298_molar = Cp_T({ component: ethanol, temperature: temperature298, model_source: component_model_source, basis: 'molar' });
logAndCapture('Cp(T=298.15 K, molar):', cp_c2h6o_298_molar);

const cp_c2h6o_298_mass = Cp_T({ component: ethanol, temperature: temperature298, model_source: component_model_source, basis: 'mass' });
logAndCapture('Cp(T=298.15 K, mass):', cp_c2h6o_298_mass);

// =============================================
// SECTION: --- Reaction examples ---
// =============================================
// NOTE: Reaction: 2 H2(g) + O2(g) => 2 H2O(g)

// RXNAnalyzer derives stoichiometry; keys use "Formula-State" because app.ts requests reaction_ids=true.
const reaction: Reaction = {
    name: 'water-formation-gas',
    reaction: '2 H2(g) + O2(g) => 2 H2O(g)',
    components: [hydrogen, oxygen, water]
};

const reactionTemperature: Temperature = { value: 1200, unit: 'K' };

console.log('\n=== Reaction properties for 2H2 + O2 -> 2H2O (gas) at 1200 K ===');
results.push('=== Reaction properties for 2H2 + O2 -> 2H2O (gas) at 1200 K ===');
const dH = dH_rxn_STD({ reaction, temperature: reactionTemperature, model_source: component_model_source });
logAndCapture('dH_rxn_STD:', dH);

const dS = dS_rxn_STD({ reaction, temperature: reactionTemperature, model_source: component_model_source });
logAndCapture('dS_rxn_STD:', dS);

const dG = dG_rxn_STD({ reaction, temperature: reactionTemperature, model_source: component_model_source });
logAndCapture('dG_rxn_STD:', dG);

const KeqVal = Keq({ reaction, temperature: reactionTemperature, model_source: component_model_source });
logAndCapture('Keq:', KeqVal);

const KeqVH = Keq_vh_shortcut({ reaction, temperature: reactionTemperature, model_source: component_model_source });
logAndCapture("Keq (van't Hoff shortcut):", KeqVH);


// NOTE: Reaction WGSR
const reaction_2: Reaction = {
    name: 'water-gas-shift-reaction',
    reaction: 'CO(g) + H2O(g) => CO2(g) + H2(g)',
    components: [hydrogen, water, carbon_dioxide, carbon_monoxide]
}

const reactionTemperature_2: Temperature = { value: 398.15, unit: 'K' };
console.log('\n=== Reaction properties for CO + H2O -> CO2 + H2 (gas) at 398.15 K ===');
results.push('=== Reaction properties for CO + H2O -> CO2 + H2 (gas) at 398.15 K ===');
const dH_2 = dH_rxn_STD({ reaction: reaction_2, temperature: reactionTemperature_2, model_source: component_model_source });
logAndCapture('dH_rxn_STD:', dH_2);

const dS_2 = dS_rxn_STD({ reaction: reaction_2, temperature: reactionTemperature_2, model_source: component_model_source });
logAndCapture('dS_rxn_STD:', dS_2);

const dG_2 = dG_rxn_STD({ reaction: reaction_2, temperature: reactionTemperature_2, model_source: component_model_source });
logAndCapture('dG_rxn_STD:', dG_2);

const KeqVal_2 = Keq({ reaction: reaction_2, temperature: reactionTemperature_2, model_source: component_model_source });
logAndCapture('Keq:', KeqVal_2);

const KeqVH_2 = Keq_vh_shortcut({ reaction: reaction_2, temperature: reactionTemperature_2, model_source: component_model_source });
logAndCapture("Keq (van't Hoff shortcut):", KeqVH_2);

const outputFile_2 = path.join(__dirname, 'appUsage-2-results-2.txt');
await writeFile(outputFile_2, results.join('\n'), 'utf-8');
console.log(`\nResults written to ${outputFile_2}`);