import { CustomProp, Temperature } from '@/types/models';
import { toKelvin } from './unitConverter';

type EnergyUnit = 'J/mol' | 'kJ/mol' | 'cal/mol' | 'kcal/mol';
type EntropyUnit = 'J/mol.K' | 'kJ/mol.K' | 'cal/mol.K' | 'kcal/mol.K';

/**
 * Normalize the unit string by trimming whitespace and converting to lowercase.
 * @param unit - The unit string to normalize.
 * @returns The normalized unit string.
 */
function normalize(unit: string): string {
  return unit.trim().toLowerCase();
}

/**
 * Convert energy value to J/mol based on the provided unit.
 * @param value - The energy value to convert.
 * @param unit - The unit of the energy value (e.g., 'J/mol', 'kJ/mol', 'cal/mol', 'kcal/mol').
 * @returns The energy value converted to J/mol.
 * @throws Error if the provided unit is unsupported.
 */
export function toJPerMol(value: number, unit: string): number {
  const u = normalize(unit);
  switch (u) {
    case 'j/mol':
      return value;
    case 'kj/mol':
      return value * 1_000;
    case 'cal/mol':
      return value * 4.184;
    case 'kcal/mol':
      return value * 4_184;
    default:
      throw new Error(`Unsupported energy unit: ${unit}`);
  }
}

/**
 * Convert entropy value to J/mol.K based on the provided unit.
 * @param value - The entropy value to convert.
 * @param unit - The unit of the entropy value (e.g., 'J/mol.K', 'kJ/mol.K', 'cal/mol.K', 'kcal/mol.K').
 * @returns The entropy value converted to J/mol.K.
 * @throws Error if the provided unit is unsupported.
 */
export function toJPerMolK(value: number, unit: string): number {
  const u = normalize(unit);
  switch (u) {
    case 'j/mol.k':
      return value;
    case 'kj/mol.k':
      return value * 1_000;
    case 'cal/mol.k':
      return value * 4.184;
    case 'kcal/mol.k':
      return value * 4_184;
    default:
      throw new Error(`Unsupported entropy unit: ${unit}`);
  }
}

/**
 * Ensure the energy property is in the expected unit, converting if necessary.
 * @param prop - The custom property containing value and unit.
 * @param expect - The expected energy unit (default is 'J/mol').
 * @returns - The custom property with value converted to the expected unit if necessary.
 */
export function ensureEnergy(prop: CustomProp, expect: EnergyUnit = 'J/mol'): CustomProp {
  if (normalize(prop.unit) === normalize(expect)) {
    return prop;
  }
  return { ...prop, value: toJPerMol(prop.value, prop.unit), unit: 'J/mol' };
}

/**
 * Ensure the entropy property is in the expected unit, converting if necessary.
 * @param prop - The custom property containing value and unit.
 * @param expect - The expected entropy unit (default is 'J/mol.K').
 * @returns The custom property with value converted to the expected unit if necessary.
 */
export function ensureEntropy(prop: CustomProp, expect: EntropyUnit = 'J/mol.K'): CustomProp {
  if (normalize(prop.unit) === normalize(expect)) {
    return prop;
  }
  return { ...prop, value: toJPerMolK(prop.value, prop.unit), unit: 'J/mol.K' };
}

export function ensureKelvin(temp: Temperature): number {
  return toKelvin(temp);
}
