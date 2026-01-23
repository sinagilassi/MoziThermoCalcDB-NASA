# MoziThermoCalcDB-NASA

[![npm version](https://badge.fury.io/js/mozithermocalcdb-nasa.svg)](https://badge.fury.io/js/mozithermocalcdb-nasa)
[![npm downloads](https://img.shields.io/npm/dm/mozithermocalcdb-nasa?color=brightgreen)](https://www.npmjs.com/package/mozithermocalcdb-nasa)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Performance-oriented notes for working with the NASA polynomial toolchain in `src/`.

## 📥 Data ingestion

- Use the standalone `DataLoader`/`loadModelSource` script in `scripts/` to parse CSVs once into an in-memory `ModelSource`; invalid or incomplete rows are skipped early via `transformRow` validation.
- Each row is indexed under multiple ids (`Name-State`, `Formula-State`, `Name-Formula`) so lookups avoid string recomputation in hot paths.
- CSV parsing is synchronous and per-file; feed an array of `{ path, range }` objects to batch all ranges in a single pass.

## 🔎 Lookup pipeline

- `Source` resolves a component's equation set by id and validates required coefficients before returning data.
- Range selection prefers the requested NASA window but falls back to adjacent ranges (`buildRangePreference`) to keep calculations moving when partial data exists.
- `validateRangeData` filters out records with missing or non-finite coefficients to prevent downstream math errors.

## ♻️ Coefficient access and reuse

- `HSG` lazily extracts and caches NASA7/NASA9 coefficients on construction, avoiding repeated `Source` lookups per call.
- Required coefficients are asserted once (`requireCoeffs`); failures return `null` instead of throwing inside the compute path to keep execution cheap.
- Molecular weight is cached (`props`) so mass-basis conversions reuse the same value instead of re-reading coefficient blobs.

## 🚀 Batch computation path

- `HSGs` builds and caches per-component `HSG` instances up front and reuses them for all property calculations.
- A single NASA range decision (`selectNasaType`) is shared across the batch in `calc_components_hsg`, reducing branching inside per-component loops.
- Reaction helpers (`RXNAdapter`) consume these batch results directly, so reaction properties reuse the already-computed component thermodynamics.

## 🧮 Thermo kernels

- Polynomial evaluators in `src/thermo` are pure functions: they convert to Kelvin once, operate on numbers, and return `CustomProp` structs with units intact.
- Mass-basis conversions (`toMassBasis`) are applied only when explicitly requested via `basis: 'mass'`; default is molar to avoid extra work.

## ⚙️ Usage tips for better throughput

- Load all CSVs once into a `modelSource`, then reuse a single `Source`/`HSG` or `HSGs` instance for repeated queries.
- Prefer the batch API when possible:
  - Component: `H_T`, `S_T`, `G_T`, `Cp_T` for single values.
  - Reaction: `dH_rxn_STD`, `dS_rxn_STD`, `dG_rxn_STD`, `Keq`, `Keq_vh_shortcut` for multi-component calculations in one pass.
- Stick to `'nasa9'` unless you need NASA7 data; NASA9 has fuller validation (b1/b2) and better range coverage in the fallback order.

## 🧪 Examples

- Run `examples/appUsage.ts` end-to-end with `npx ts-node --esm --experimental-specifier-resolution=node examples/appUsage.ts` to load the bundled NASA9 CSVs and print species/reaction properties.
- If you adjust CSV paths or ranges, tweak the `loadExampleModelSource` call inside `examples/appUsage.ts` to match your files.

## 📘 Minimal snippet

```ts
import { loadModelSource } from './scripts/DataLoader';
import { H_T, dG_rxn_STD } from './src/app';

const modelSource = await loadModelSource([
  { path: 'data/nasa9_range1.csv', range: 'nasa9_200_1000_K' },
  { path: 'data/nasa9_range2.csv', range: 'nasa9_1000_6000_K' }
]);

const water = { name: 'Water', formula: 'H2O', state: 'g' } as const;
const H = H_T({ component: water, temperature: { value: 900, unit: 'K' }, model_source: modelSource });

const reaction = {
  name: 'water-formation-gas',
  reaction: '2 H2(g) + O2(g) => 2 H2O(g)',
  components: [
    { name: 'Hydrogen', formula: 'H2', state: 'g' },
    { name: 'Oxygen', formula: 'O2', state: 'g' },
    water
  ]
} as const;

const dG = dG_rxn_STD({ reaction, temperature: { value: 900, unit: 'K' }, model_source: modelSource });
```
