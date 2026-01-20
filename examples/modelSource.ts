/**
 * Convenience helper to build a `ModelSource` from the NASA9 CSVs that ship in
 * `agents/assets`. This is the same structure expected by the functions in
 * `src/app.ts`.
 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { NASARangeType } from '../src/types/constants.js';
import type { ModelSource } from '../src/types/external.js';
import type { RangeFile } from '../src/data/DataLoader.js';
import { loadModelSource } from '../src/data/DataLoader.js';

const DEFAULT_RANGE_FILE_NAMES: Array<{ filename: string; range: NASARangeType }> = [
  { filename: 'gas_nasa9_coeffs_min_0_max_1000.csv', range: 'nasa9_200_1000_K' },
  { filename: 'gas_nasa9_coeffs_min_1000_max_6000.csv', range: 'nasa9_1000_6000_K' },
  { filename: 'gas_nasa9_coeffs_min_6000_max_20000.csv', range: 'nasa9_6000_20000_K' }
];

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function buildRangeFilesFromDir(dataDir: string): RangeFile[] {
  if (!dataDir) {
    throw new Error('buildRangeFilesFromDir requires a directory path; NASA9 CSVs are not bundled with the package.');
  }

  return DEFAULT_RANGE_FILE_NAMES.map(({ filename, range }) => ({
    path: path.join(dataDir, filename),
    range
  }));
}

/**
 * Load the NASA9 CSVs from the local assets folder and return the in-memory
 * `ModelSource` object.
 *
 * Example:
 * ```ts
 * const modelSource = await loadExampleModelSource('/absolute/path/to/nasa9/csvs');
 * ```
 */
export async function loadExampleModelSource(dataDir: string): Promise<ModelSource> {
  const rangeFiles = buildRangeFilesFromDir(dataDir);
  return loadModelSource(rangeFiles);
}

const isDirectRun = import.meta.url === pathToFileURL(process.argv[1] ?? '').href;

if (isDirectRun) {
  const dataDir = path.join(__dirname);
  loadExampleModelSource(dataDir)
    .then((modelSource) => {
      const keys = Object.keys(modelSource);
      console.log(`ModelSource loaded: ${keys.length} components found.`);
      console.log('Sample component IDs:', keys.slice(0, 5));
    })
    .catch((err) => {
      console.error('Failed to load ModelSource:', err);
      process.exitCode = 1;
    });
}
