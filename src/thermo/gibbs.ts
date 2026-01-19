import { CustomProp, Temperature } from '../types/models';

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

// TODO: Implement Gibbs free energy calculations
export function GiFrEn_IG(args: GiArgs): CustomProp | null {
  return null;
}

export function GiFrEn_IG_ranges(args: GiRangeArgs): CustomProp[] | null {
  return null;
}
