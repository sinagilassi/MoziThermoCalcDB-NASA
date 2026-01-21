import { Component, NASA7Coefficients, NASA9Coefficients } from './models';
import { ComponentKey, NASARangeType } from './constants';

interface NASABaseData {
  Name: string;
  Formula: string;
  State: string;
  formula_raw: string;
  phase_flag: number;
  MW: number;
  EnFo_IG: number;
  dEnFo_IG_298: number;
  Tmin: number;
  Tmax: number;
}

export interface NASA9TemperatureRangeData extends NASABaseData, NASA9Coefficients {
  nasa9_200_1000_K?: 1;
  nasa9_1000_6000_K?: 1;
  nasa9_6000_20000_K?: 1;
}

export interface NASA7TemperatureRangeData extends NASABaseData, NASA7Coefficients {
  nasa7_200_1000_K?: 1;
  nasa7_1000_6000_K?: 1;
  nasa7_6000_20000_K?: 1;
}

export type TemperatureRangeData = NASA7TemperatureRangeData | NASA9TemperatureRangeData;

export type CompoundTemperatureRanges = Partial<Record<NASARangeType, TemperatureRangeData>>;

export interface ComponentEquationSource {
  component: Component;
  temperatureRange: NASARangeType;
  source: TemperatureRangeData;
}

export interface Source {
  getDataSource: (args: {
    component: Component;
    componentKey: ComponentKey | string;
    propName: NASARangeType;
  }) => ComponentEquationSource | null | undefined;
}

export type ModelSource = Record<string, CompoundTemperatureRanges>;

export interface Reaction {
  name: string;
  reaction: string;
  components?: Component[];
  reaction_mode_symbol?: '<=>' | '=>' | '=';
  /**
   * Optional phase rule to enforce consistent state across reactants/products.
   * If omitted, per-species state markers in the reaction string are used.
   */
  phase_rule?: 'gas' | 'liquid' | 'aqueous' | 'solid' | null;
}
