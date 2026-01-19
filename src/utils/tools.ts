import { NASARangeType, NASAType } from '../types/constants';
import { CustomProp, NASA7Coefficients, NASA9Coefficients, Temperature } from '../types/models';
import { energyOrEntropyToMassBasis, toKelvin } from './unitConverter';

const ENERGY_UNITS = new Set(['j', 'kj', 'cal', 'kcal']);

type Coefficients = NASA7Coefficients | NASA9Coefficients;

/**
 * Ensures required coefficient keys exist; returns a narrowed subset.
 */
export function requireCoeffs<T extends Record<string, unknown>, K extends keyof T>(
  coeffs: T,
  required: readonly K[]
): Pick<T, K> {
  const missing = required.filter((k) => coeffs[k] === undefined);
  if (missing.length) {
    throw new Error(
      `Missing coefficients: ${missing.join(', ')}. Required: ${required.join(', ')}`
    );
  }
  const subset: Partial<T> = {};
  required.forEach((k) => {
    subset[k] = coeffs[k];
  });
  return subset as Pick<T, K>;
}

/**
 * Select NASA range based on temperature and nasa type.
 */
export function selectNasaType(
  temperature: Temperature,
  breakTempMin: Temperature,
  breakTempMax: Temperature,
  nasaType: NASAType
): NASARangeType {
  const T = toKelvin(temperature);
  const Tmin = toKelvin(breakTempMin);
  const Tmax = toKelvin(breakTempMax);

  if (T <= Tmin) {
    return nasaType === 'nasa7' ? 'nasa7_200_1000_K' : 'nasa9_200_1000_K';
  }
  if (T > Tmin && T <= Tmax) {
    return nasaType === 'nasa7' ? 'nasa7_1000_6000_K' : 'nasa9_1000_6000_K';
  }
  if (T > Tmax) {
    return nasaType === 'nasa7' ? 'nasa7_6000_20000_K' : 'nasa9_6000_20000_K';
  }
  throw new Error(`Temperature ${T} K is out of expected range.`);
}

export function isNASA9(coeffs: Coefficients): coeffs is NASA9Coefficients {
  return (coeffs as NASA9Coefficients).b1 !== undefined && (coeffs as NASA9Coefficients).b2 !== undefined;
}

/**
 * Normalize energy/entropy units to mass basis (J/kg or J/kg.K).
 */
export function toMassBasis(value: CustomProp, mw_g_per_mol: number): CustomProp {
  return energyOrEntropyToMassBasis(value, mw_g_per_mol);
}

/**
 * Quick check for supported energy unit strings.
 */
export function isSupportedEnergyUnit(unit: string): boolean {
  const normalized = unit.trim().toLowerCase().split('/')[0];
  return ENERGY_UNITS.has(normalized);
}
