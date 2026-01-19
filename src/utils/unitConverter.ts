import { CustomProp, Temperature } from '../types';

export type SupportedTempUnit = Temperature['unit'];

const toKelvinMap: Record<SupportedTempUnit, (value: number) => number> = {
  K: (v) => v,
  C: (v) => v + 273.15,
  F: (v) => ((v - 32) * 5) / 9 + 273.15,
  R: (v) => (v * 5) / 9
};

/**
 * Convert a temperature to Kelvin.
 */
export function toKelvin(temp: Temperature): number {
  const converter = toKelvinMap[temp.unit];
  if (!converter) {
    throw new Error(`Unsupported temperature unit: ${temp.unit}`);
  }
  return converter(temp.value);
}

/**
 * Convert energy or entropy to a mass basis while preserving energy unit casing.
 * Accepts J/mol, kJ/kmol, J/mol.K, kJ/kmol.K (dot before K is required).
 */
export function energyOrEntropyToMassBasis(
  value: CustomProp,
  mw_g_per_mol: number
): CustomProp {
  if (mw_g_per_mol <= 0) {
    throw new Error(`mw must be > 0 (got ${mw_g_per_mol})`);
  }

  const unitRaw = value.unit.trim();
  const unitNorm = unitRaw.toLowerCase().replace(/\s+/g, '');

  const match = unitNorm.match(
    /^\s*(j|kj|cal|kcal)\/(mol|kmol)(?:\.(k))?\s*$/
  );
  if (!match) {
    throw new Error(
      `Unsupported or invalid unit format: '${value.unit}'. ` +
        "Use 'J/mol', 'kJ/kmol', 'J/mol.K', or 'kJ/kmol.K'"
    );
  }

  const amount = match[2]; // mol or kmol
  const hasK = Boolean(match[3]);

  let massValue: number;
  if (amount === 'mol') {
    const mw_kg_per_mol = mw_g_per_mol / 1000;
    massValue = value.value / mw_kg_per_mol;
  } else {
    const mw_kg_per_kmol = mw_g_per_mol; // g/mol == kg/kmol numerically
    massValue = value.value / mw_kg_per_kmol;
  }

  const massUnit = hasK ? `${unitRaw.split('/')[0].trim()}/kg.K` : `${unitRaw.split('/')[0].trim()}/kg`;

  return { ...value, value: massValue, unit: massUnit };
}
