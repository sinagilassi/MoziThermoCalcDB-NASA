import { Component, Temperature } from './models';
import { NASARangeType } from './constants';

export interface TableEquation {
  parms_values: Record<string, number>;
}

export interface ComponentEquationSource {
  component: Component;
  temperatureRange: NASARangeType;
  source: TableEquation;
}

export interface Source {
  getEquationSource?: (args: {
    component: Component;
    componentKey: string;
    propName: NASARangeType;
  }) => ComponentEquationSource | null | undefined;
}

export interface ModelSource {
  // Placeholder for future concrete shape
  [key: string]: unknown;
}

export interface Reaction {
  available_components: Component[];
  reaction: string;
  reaction_stoichiometry: Record<string, number>;
  component_checker?: boolean;
  map_components?: Record<string, Component>;
  all_components?: string[];
}
