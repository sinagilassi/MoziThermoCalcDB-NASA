import { CustomProp, Temperature } from '../types/models';
import { toKelvin } from '../utils/unitConverter';

type NASA9Args = {
  a1: number; a2: number; a3: number; a4: number; a5: number; a6: number; a7: number; b1: number; b2: number;
};

type NASA7Args = {
  a1: number; a2: number; a3: number; a4: number; a5: number; a6: number; a7: number;
};

const R = 8.31446261815324; // J/mol.K

export function En_IG_NASA9_polynomial(args: NASA9Args & { temperature: Temperature }): CustomProp | null {
  const T = toKelvin(args.temperature);
  if (!Number.isFinite(T) || T <= 0) return null;
  const { a1, a2, a3, a4, a5, a6, a7, b1 } = args;
  const value =
    R *
    (-a1 / T +
      a2 * Math.log(T) +
      a3 * T +
      (a4 / 2) * T ** 2 +
      (a5 / 3) * T ** 3 +
      (a6 / 4) * T ** 4 +
      (a7 / 5) * T ** 5 +
      b1);
  return { value, unit: 'J/mol' };
}

export function En_IG_NASA9_polynomial_range(args: NASA9Args & { temperatures: Temperature[] }): CustomProp[] | null {
  const results = args.temperatures.map((temperature) =>
    En_IG_NASA9_polynomial({ ...args, temperature })?.value ?? null
  );
  if (results.every((v) => v === null)) return null;
  return results.map((v) => ({ value: v ?? 0, unit: 'J/mol' }));
}

export function En_IG_NASA9_polynomial_ranges(args: NASA9Args & { temperatures: Temperature[] }): CustomProp[] | null {
  return En_IG_NASA9_polynomial_range(args);
}

export function En_IG_NASA7_polynomial(args: NASA7Args & { temperature: Temperature }): CustomProp | null {
  const T = toKelvin(args.temperature);
  if (!Number.isFinite(T) || T <= 0) return null;
  const { a1, a2, a3, a4, a5, a6 } = args;
  const value =
    R *
    T *
    (a1 + (a2 * T) / 2 + (a3 * T ** 2) / 3 + (a4 * T ** 3) / 4 + (a5 * T ** 4) / 5 + a6 / T);
  return { value, unit: 'J/mol' };
}

export function En_IG_NASA7_polynomial_range(args: NASA7Args & { temperatures: Temperature[] }): CustomProp[] | null {
  const results = args.temperatures.map((temperature) =>
    En_IG_NASA7_polynomial({ ...args, temperature })?.value ?? null
  );
  if (results.every((v) => v === null)) return null;
  return results.map((v) => ({ value: v ?? 0, unit: 'J/mol' }));
}

export function En_IG_NASA7_polynomial_ranges(args: NASA7Args & { temperatures: Temperature[] }): CustomProp[] | null {
  return En_IG_NASA7_polynomial_range(args);
}
