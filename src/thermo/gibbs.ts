import { CustomProp, Temperature } from '../types/models';
import { toKelvin } from '../utils/unitConverter';
import { En_IG_NASA7_polynomial, En_IG_NASA9_polynomial } from './enthalpy';
import { S_IG_NASA7_polynomial, S_IG_NASA9_polynomial } from './entropy';

type NASA9Args = {
  method: 'NASA9';
  a1: number; a2: number; a3: number; a4: number; a5: number; a6: number; a7: number; b1: number; b2: number;
};

type NASA7Args = {
  method: 'NASA7';
  a1: number; a2: number; a3: number; a4: number; a5: number; a6: number; a7: number;
};

type GiArgs = (NASA9Args | NASA7Args) & { temperature: Temperature };
type GiRangeArgs = (NASA9Args | NASA7Args) & { temperatures: Temperature[] };

export function GiFrEn_IG(args: GiArgs): CustomProp | null {
  const T = toKelvin(args.temperature);
  const H =
    args.method === 'NASA9'
      ? En_IG_NASA9_polynomial({ ...args, temperature: args.temperature })?.value ?? null
      : En_IG_NASA7_polynomial({ ...args, temperature: args.temperature })?.value ?? null;
  const S =
    args.method === 'NASA9'
      ? S_IG_NASA9_polynomial({ ...args, temperature: args.temperature })?.value ?? null
      : S_IG_NASA7_polynomial({ ...args, temperature: args.temperature })?.value ?? null;
  if (H === null || S === null) return null;
  const value = H - T * S;
  return { value, unit: 'J/mol' };
}

export function GiFrEn_IG_ranges(args: GiRangeArgs): CustomProp[] | null {
  const results = args.temperatures.map((temperature) =>
    GiFrEn_IG({ ...(args as any), temperature })?.value ?? null
  );
  if (results.every((v) => v === null)) return null;
  return results.map((v) => ({ value: v ?? 0, unit: 'J/mol' }));
}
