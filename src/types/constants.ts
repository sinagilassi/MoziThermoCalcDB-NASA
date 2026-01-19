export type NASAType = 'nasa7' | 'nasa9';
export type NASARangeType =
  | 'nasa7_200_1000_K'
  | 'nasa7_1000_6000_K'
  | 'nasa7_6000_20000_K'
  | 'nasa9_200_1000_K'
  | 'nasa9_1000_6000_K'
  | 'nasa9_6000_20000_K';

export type BasisType = 'molar' | 'mass';
export type ComponentKey = 'Name-State' | 'Formula-State' | 'Name-Formula';
export type StateType = 'g' | 'l' | 's' | 'cr';

// Universal constants (placeholders; update when data available)
export const R_CONST_J__molK = 8.314462618; // J/mol.K
export const TEMPERATURE_REF_K = 298.15;
export const PRESSURE_REF_Pa = 101325;

// Temperature break points (K)
export const TEMPERATURE_BREAK_NASA7_200_K = 200;
export const TEMPERATURE_BREAK_NASA7_1000_K = 1000;
export const TEMPERATURE_BREAK_NASA7_6000_K = 6000;
export const TEMPERATURE_BREAK_NASA9_200_K = 200;
export const TEMPERATURE_BREAK_NASA9_1000_K = 1000;
export const TEMPERATURE_BREAK_NASA9_6000_K = 6000;
export const TEMPERATURE_BREAK_NASA9_20000_K = 20000;
