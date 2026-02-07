/**
 * Demonstrates equilibrium temperature solver helpers.
 *
 * Run with:
 *   npx ts-node --esm --experimental-specifier-resolution=node examples/appUsage-4.ts
 */
import path from 'node:path';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import type { Component, Temperature } from 'mozithermocalcdb-nasa';
import {
  H_mix_T,
  S_mix_T,
  G_mix_T,
  Cp_mix_T,
  chemical_potential_mix_T,
  H_mix_T_series,
  S_mix_T_series,
  G_mix_T_series,
  Cp_mix_T_series,
  chemical_potential_mix_T_series
} from 'mozithermocalcdb-nasa';
import { loadExampleModelSource, buildComponentModelSource } from './modelSource';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const results: string[] = [];
const logAndCapture = (...args: unknown[]) => {
  const line = args.map((arg) => (typeof arg === 'string' ? arg : JSON.stringify(arg))).join(' ');
  results.push(line);
  console.log(...args);
};

// --- Components ---
const hydrogen: Component = { name: 'dihydrogen', formula: 'H2', state: 'g', moleFraction: 0.25 };
const water: Component = { name: 'dihydrogen monoxide', formula: 'H2O', state: 'g', moleFraction: 0.25 };
const carbon_monoxide: Component = { name: 'carbon monoxide', formula: 'CO', state: 'g', moleFraction: 0.25 };
const carbon_dioxide: Component = { name: 'carbon dioxide', formula: 'CO2', state: 'g', moleFraction: 0.25 };

const components: Component[] = [hydrogen, water, carbon_dioxide, carbon_monoxide];

async function main() {
  // --- Model source ---
  const model_source = await loadExampleModelSource(__dirname);
  const component_model_source = await buildComponentModelSource(components, model_source);

  // Mixture helper usage example

  const T_ref: Temperature = { value: 298.15, unit: 'K' };
  const T_high: Temperature = { value: 2000, unit: 'K' };
  const T_series = [
    { value: 300, unit: 'K' },
    { value: 500, unit: 'K' },
    { value: 1000, unit: 'K' },
    { value: 1500, unit: 'K' },
    { value: 2000, unit: 'K' }
  ] as Temperature[];

  // --- Mixture properties at reference temperature ---
  logAndCapture('--- Mixture properties at reference temperature ---');
  const H_mix_ref = H_mix_T({ components, temperature: T_ref, model_source: component_model_source });
  const S_mix_ref = S_mix_T({ components, temperature: T_ref, model_source: component_model_source });
  const G_mix_ref = G_mix_T({ components, temperature: T_ref, model_source: component_model_source });
  const Cp_mix_ref = Cp_mix_T({ components, temperature: T_ref, model_source: component_model_source });
  const mu_mix_ref = chemical_potential_mix_T({ components, temperature: T_ref, model_source: component_model_source });

  logAndCapture('H_mix at reference temperature:', H_mix_ref);
  logAndCapture('S_mix at reference temperature:', S_mix_ref);
  logAndCapture('G_mix at reference temperature:', G_mix_ref);
  logAndCapture('Cp_mix at reference temperature:', Cp_mix_ref);
  logAndCapture('Chemical potential of each component at reference temperature:', mu_mix_ref);

  // --- Mixture properties over a series of temperatures ---
  logAndCapture('\n--- Mixture properties over a series of temperatures ---');
  const H_mix_series = H_mix_T_series({ components, temperatures: T_series, model_source: component_model_source });
  const S_mix_series = S_mix_T_series({ components, temperatures: T_series, model_source: component_model_source });
  const G_mix_series = G_mix_T_series({ components, temperatures: T_series, model_source: component_model_source });
  const Cp_mix_series = Cp_mix_T_series({ components, temperatures: T_series, model_source: component_model_source });
  const mu_mix_series = chemical_potential_mix_T_series({ components, temperatures: T_series, model_source: component_model_source });

  logAndCapture('H_mix over temperature series:', H_mix_series);
  logAndCapture('S_mix over temperature series:', S_mix_series);
  logAndCapture('G_mix over temperature series:', G_mix_series);
  logAndCapture('Cp_mix over temperature series:', Cp_mix_series);
  logAndCapture('Chemical potential of each component over temperature series:', mu_mix_series);

  const outputFile = path.join(__dirname, 'appUsage-4-results.txt');
  await writeFile(outputFile, results.join('\n'), 'utf-8');
  console.log(`\nResults written to ${outputFile}`);
}

main().catch((error) => {
  console.error('An error occurred:', error);
  process.exit(1);
});
