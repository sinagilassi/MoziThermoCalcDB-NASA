import { StateType } from './constants';

export interface Temperature {
  value: number;
  unit: 'K' | 'C' | 'F' | 'R';
}

export interface Component {
  name: string;
  formula: string;
  state: StateType;
  molecularWeight?: number;
  formulaRaw?: string;
}

export interface CustomProp {
  value: number;
  unit: string;
  description?: string;
}

export interface NASA7Coefficients {
  a1: number;
  a2: number;
  a3: number;
  a4: number;
  a5: number;
  a6: number;
  a7: number;
}

export interface NASA9Coefficients {
  a1: number;
  a2: number;
  a3: number;
  a4: number;
  a5: number;
  a6: number;
  a7: number;
  b1: number;
  b2: number;
}
