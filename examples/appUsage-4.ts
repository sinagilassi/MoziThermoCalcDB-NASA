/**
 * Demonstrates equilibrium temperature solver helpers.
 *
 * Run with:
 *   npx ts-node --esm --experimental-specifier-resolution=node examples/appUsage-4.ts
 */
import path from 'node:path';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import type { Component, Temperature } from '../src/types/models.js';
import type { Reaction } from '../src/types/external.js';
import { equilibrium_temperature, equilibrium_temperature_K1 } from '../src/app.js';
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
const water: Component = { name: 'dihydrogen monoxide', formula: 'H2O', state: 'g' };
const carbon_monoxide: Component = { name: 'carbon monoxide', formula: 'CO', state: 'g' };
const carbon_dioxide: Component = { name: 'carbon dioxide', formula: 'CO2', state: 'g' };

const components: Component[] = [hydrogen, water, carbon_dioxide, carbon_monoxide];

// NOTE: component key
const componentKey = 'Name-Formula-State';

// --- Model source ---
const model_source = await loadExampleModelSource(__dirname);
const component_model_source = await buildComponentModelSource(components, model_source, componentKey);

// --- Reaction (WGSR) ---
const wgsr: Reaction = {
  name: 'water-gas-shift-reaction',
  reaction: 'CO(g) + H2O(g) => CO2(g) + H2(g)',
  components: [hydrogen, water, carbon_dioxide, carbon_monoxide]
};

const T_ref: Temperature = { value: 298.15, unit: 'K' };
const T_high: Temperature = { value: 2000, unit: 'K' };

logAndCapture('=== Equilibrium temperature solve (WGSR) ===');
logAndCapture(
  'equilibrium_temperature (Keq=10):',
  equilibrium_temperature({
    reaction: wgsr,
    Keq_target: { value: 10, unit: 'dimensionless' },
    temperature_bounds: { low: T_ref, high: T_high },
    model_source: component_model_source,
    component_key: componentKey
  })
);
logAndCapture(
  'equilibrium_temperature_K1:',
  equilibrium_temperature_K1({
    reaction: wgsr,
    temperature_bounds: { low: T_ref, high: T_high },
    model_source: component_model_source,
    component_key: componentKey
  })
);

const outputFile = path.join(__dirname, 'appUsage-4-results.txt');
await writeFile(outputFile, results.join('\n'), 'utf-8');
console.log(`\nResults written to ${outputFile}`);
