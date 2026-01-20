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
import { loadExampleModelSource } from './modelSource.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main(): Promise<void> {
  const dataDir = path.join(__dirname);
  const model_source = await loadExampleModelSource(dataDir);

  // --- Single-species examples (NASA9) ---
  const hydrogen: Component = { name: 'dihydrogen', formula: 'H2', state: 'g' };
  const temperature1500: Temperature = { value: 1500, unit: 'K' };
  const temperature298: Temperature = { value: 298.15, unit: 'K' };

  console.log('=== Species properties for H2 (dihydrogen, gas) ===');
  console.log('H(T=1500 K):', H_T({ component: hydrogen, temperature: temperature1500, model_source }));
  console.log('S(T=1500 K):', S_T({ component: hydrogen, temperature: temperature1500, model_source }));
  console.log('G(T=1500 K):', G_T({ component: hydrogen, temperature: temperature1500, model_source }));
  console.log(
    'Cp(T=298.15 K, molar):',
    Cp_T({ component: hydrogen, temperature: temperature298, model_source, basis: 'molar' })
  );
  console.log(
    'Cp(T=298.15 K, mass):',
    Cp_T({ component: hydrogen, temperature: temperature298, model_source, basis: 'mass' })
  );

  // --- Reaction examples ---
  // Reaction: 2 H2(g) + O2(g) => 2 H2O(g)
  const oxygen: Component = { name: 'dioxygen', formula: 'O2', state: 'g' };
  const water: Component = { name: 'dihydrogen monoxide', formula: 'H2O', state: 'g' };

  // RXNAnalyzer derives stoichiometry; keys use "Formula-State" because app.ts requests reaction_ids=true.
  const reaction: Reaction = {
    name: 'water-formation-gas',
    reaction: '2 H2(g) + O2(g) => 2 H2O(g)',
    components: [hydrogen, oxygen, water]
  };

  const reactionTemperature: Temperature = { value: 1200, unit: 'K' };

  console.log('\n=== Reaction properties for 2H2 + O2 -> 2H2O (gas) at 1200 K ===');
  const dH = dH_rxn_STD({ reaction, temperature: reactionTemperature, model_source });
  const dS = dS_rxn_STD({ reaction, temperature: reactionTemperature, model_source });
  const dG = dG_rxn_STD({ reaction, temperature: reactionTemperature, model_source });
  const KeqVal = Keq({ reaction, temperature: reactionTemperature, model_source });
  const KeqVH = Keq_vh_shortcut({ reaction, temperature: reactionTemperature, model_source });

  console.log('dH_rxn_STD:', dH);
  console.log('dS_rxn_STD:', dS);
  console.log('dG_rxn_STD:', dG);
  console.log('Keq:', KeqVal);
  console.log("Keq (van't Hoff shortcut):", KeqVH);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
