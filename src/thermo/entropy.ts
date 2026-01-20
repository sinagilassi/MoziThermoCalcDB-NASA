import { CustomProp, Temperature } from '../types/models';
import { toKelvin } from '../utils/unitConverter';

type NASA9Args = {
  a1: number; a2: number; a3: number; a4: number; a5: number; a6: number; a7: number; b1: number; b2: number;
};

type NASA7Args = {
  a1: number; a2: number; a3: number; a4: number; a5: number; a6: number; a7: number;
};

const R = 8.31446261815324; // J/mol.K

// SECTION: NASA 9 Coefficients
// NOTE: Entropy of Ideal Gas Calculations using NASA 9 Coefficients
export function S_IG_NASA9_polynomial(args: NASA9Args & { temperature: Temperature }): CustomProp | null {
  const T = toKelvin(args.temperature);
  if (!Number.isFinite(T) || T <= 0) return null;
  const { a1, a2, a3, a4, a5, a6, a7, b2 } = args;
  const value =
    R *
    (-a1 / (2 * T ** 2) -
      a2 / T +
      a3 * Math.log(T) +
      a4 * T +
      (a5 / 2) * T ** 2 +
      (a6 / 3) * T ** 3 +
      (a7 / 4) * T ** 4 +
      b2);
  return { value, unit: 'J/mol.K' };
}

// NOTE: Entropy of Ideal Gas Calculations for Temperature Ranges
export function S_IG_NASA9_polynomial_range(args: NASA9Args & { temperatures: Temperature[] }): CustomProp[] | null {
  const results = args.temperatures.map((temperature) =>
    S_IG_NASA9_polynomial({ ...args, temperature })?.value ?? null
  );
  if (results.every((v) => v === null)) return null;
  return results.map((v) => ({ value: v ?? 0, unit: 'J/mol.K' }));
}

export function S_IG_NASA9_polynomial_ranges(args: NASA9Args & { temperatures: Temperature[] }): CustomProp[] | null {
  return S_IG_NASA9_polynomial_range(args);
}

// SECTION: NASA 7 Coefficients
// NOTE: Entropy of Ideal Gas Calculations using NASA 7 Coefficients
export function S_IG_NASA7_polynomial(args: NASA7Args & { temperature: Temperature }): CustomProp | null {
  const T = toKelvin(args.temperature);
  if (!Number.isFinite(T) || T <= 0) return null;
  const { a1, a2, a3, a4, a5, a7 } = args;
  const value =
    R *
    (a1 * Math.log(T) +
      a2 * T +
      (a3 / 2) * T ** 2 +
      (a4 / 3) * T ** 3 +
      (a5 / 4) * T ** 4 +
      a7);
  return { value, unit: 'J/mol.K' };
}

// NOTE: Entropy of Ideal Gas Calculations for Temperature Ranges
export function S_IG_NASA7_polynomial_range(args: NASA7Args & { temperatures: Temperature[] }): CustomProp[] | null {
  const results = args.temperatures.map((temperature) =>
    S_IG_NASA7_polynomial({ ...args, temperature })?.value ?? null
  );
  if (results.every((v) => v === null)) return null;
  return results.map((v) => ({ value: v ?? 0, unit: 'J/mol.K' }));
}

export function S_IG_NASA7_polynomial_ranges(args: NASA7Args & { temperatures: Temperature[] }): CustomProp[] | null {
  return S_IG_NASA7_polynomial_range(args);
}
