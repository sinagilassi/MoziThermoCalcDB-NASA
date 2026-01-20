import { CustomProp, Temperature } from '../types/models';
import { toKelvin } from '../utils/unitConverter';

type NASA9Args = {
  a1: number; a2: number; a3: number; a4: number; a5: number; a6: number; a7: number; b1: number; b2: number;
};

type NASA7Args = {
  a1: number; a2: number; a3: number; a4: number; a5: number; a6: number; a7: number;
};

const R = 8.31446261815324; // J/mol.K

export function Cp_IG_NASA9_polynomial(args: NASA9Args & { temperature: Temperature }): CustomProp | null {
  const T = toKelvin(args.temperature);
  if (!Number.isFinite(T) || T <= 0) return null;
  const { a1, a2, a3, a4, a5, a6, a7 } = args;
  const cpOverR = a1 / T ** 2 + a2 / T + a3 + a4 * T + a5 * T ** 2 + a6 * T ** 3 + a7 * T ** 4;
  const value = R * cpOverR;
  return { value, unit: 'J/mol.K' };
}

export function Cp_IG_NASA7_polynomial(args: NASA7Args & { temperature: Temperature }): CustomProp | null {
  const T = toKelvin(args.temperature);
  if (!Number.isFinite(T) || T <= 0) return null;
  const { a1, a2, a3, a4, a5 } = args;
  const cpOverR = a1 + a2 * T + a3 * T ** 2 + a4 * T ** 3 + a5 * T ** 4;
  const value = R * cpOverR;
  return { value, unit: 'J/mol.K' };
}
