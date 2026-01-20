import { CustomProp, Temperature } from '@/types/models';
import { toKelvin } from './unitConverter';

type EnergyUnit = 'J/mol' | 'kJ/mol' | 'cal/mol' | 'kcal/mol';
type EntropyUnit = 'J/mol.K' | 'kJ/mol.K' | 'cal/mol.K' | 'kcal/mol.K';

function normalize(unit: string): string {
  return unit.trim().toLowerCase();
}

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

export function ensureEnergy(prop: CustomProp, expect: EnergyUnit = 'J/mol'): CustomProp {
  if (normalize(prop.unit) === normalize(expect)) {
    return prop;
  }
  return { ...prop, value: toJPerMol(prop.value, prop.unit), unit: 'J/mol' };
}

export function ensureEntropy(prop: CustomProp, expect: EntropyUnit = 'J/mol.K'): CustomProp {
  if (normalize(prop.unit) === normalize(expect)) {
    return prop;
  }
  return { ...prop, value: toJPerMolK(prop.value, prop.unit), unit: 'J/mol.K' };
}

export function ensureKelvin(temp: Temperature): number {
  return toKelvin(temp);
}
