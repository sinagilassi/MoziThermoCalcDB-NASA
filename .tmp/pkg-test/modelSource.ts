/**
 * Convenience helper to build a `ModelSource` from the NASA9 CSVs that ship in
 * `agents/assets`. This is the same structure expected by the functions in
 * `src/app.ts`.
*/
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
// NOTE: Import from mozithermocalcdb-nasa
import { setComponentId } from 'mozithermocalcdb-nasa';
import { ComponentKey, NASARangeType } from 'mozithermocalcdb-nasa';
import type { ModelSource } from 'mozithermocalcdb-nasa';
import { Component } from 'mozithermocalcdb-nasa';
// NOTE: Import DataLoader from local file
import type { RangeFile } from './DataLoader';
import { loadModelSource } from './DataLoader';

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

/**
 * Build component data from NASA9 CSVs and build a ModelSource object.
 * @returns ModelSource object containing only the specified components.
 * @param components Array of component IDs to include in the ModelSource.
 * @param model_source Full ModelSource object to extract components from.
 */
export async function buildComponentModelSource(
  components: Component[],
  model_source: ModelSource,
  component_key: ComponentKey = 'Name-Formula'
): Promise<ModelSource> {
  const extractedModelSource: ModelSource = {};

  for (const componentId of components) {
    // create component id
    const id = setComponentId({ component: componentId, componentKey: component_key },);

    const componentData = model_source[id];
    if (componentData) {
      extractedModelSource[id] = componentData;
    }

  } return extractedModelSource;
}
