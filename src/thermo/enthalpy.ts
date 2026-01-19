import { CustomProp, Temperature } from '../types/models';

type NASA9Args = {
  a1: number; a2: number; a3: number; a4: number; a5: number; a6: number; a7: number; b1: number; b2: number;
};

type NASA7Args = {
  a1: number; a2: number; a3: number; a4: number; a5: number; a6: number; a7: number;
};

// TODO: Implement NASA polynomial enthalpy calculations
export function En_IG_NASA9_polynomial(args: NASA9Args & { temperature: Temperature }): CustomProp | null {
  return null;
}

export function En_IG_NASA9_polynomial_range(args: NASA9Args & { temperatures: Temperature[] }): CustomProp[] | null {
  return null;
}

export function En_IG_NASA9_polynomial_ranges(args: NASA9Args & { temperatures: Temperature[] }): CustomProp[] | null {
  return null;
}

export function En_IG_NASA7_polynomial(args: NASA7Args & { temperature: Temperature }): CustomProp | null {
  return null;
}

export function En_IG_NASA7_polynomial_range(args: NASA7Args & { temperatures: Temperature[] }): CustomProp[] | null {
  return null;
}

export function En_IG_NASA7_polynomial_ranges(args: NASA7Args & { temperatures: Temperature[] }): CustomProp[] | null {
  return null;
}
