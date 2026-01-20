// Example of loading a model source from a specified directory
/**
 * Run with: `npx ts-node --esm --experimental-specifier-resolution=node examples/buildModelSource.ts`
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadExampleModelSource } from './modelSource.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname);
const model_source = await loadExampleModelSource(dataDir);
