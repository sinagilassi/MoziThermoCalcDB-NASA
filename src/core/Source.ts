import { ComponentKey, NASARangeType } from '../types/constants';
import { Component } from '../types/models';
import {
  ComponentEquationSource,
  CompoundTemperatureRanges,
  ModelSource,
  TemperatureRangeData,
  Source as SourceType
} from '../types/external';
import { setComponentId } from '../utils/component';

type RangeLookup = { range: NASARangeType; data: TemperatureRangeData };

export class Source implements SourceType {
  constructor(public readonly model_source: ModelSource, public readonly component_key: ComponentKey) {}

  getEquationSource(args: {
    component: Component;
    componentKey: ComponentKey | string;
    propName: NASARangeType;
  }): ComponentEquationSource | null {
    const componentKey = (args.componentKey as ComponentKey | undefined) ?? this.component_key;
    const componentId = setComponentId({ component: args.component, componentKey });

    const compoundData = this.model_source[componentId];
    if (!compoundData) {
      return null;
    }

    const rangeMatch = this.pickRange(compoundData, args.propName);
    if (!rangeMatch) {
      return null;
    }

    const parms_values = this.buildParmsValues(rangeMatch.data);
    if (!parms_values) {
      return null;
    }

    return {
      component: args.component,
      temperatureRange: rangeMatch.range,
      source: { parms_values }
    };
  }

  private pickRange(
    compoundData: CompoundTemperatureRanges,
    preferredRange: NASARangeType
  ): RangeLookup | null {
    const order = this.buildRangePreference(preferredRange);
    for (const range of order) {
      const data = compoundData[range];
      if (data) {
        return { range, data };
      }
    }
    return null;
  }

  private buildRangePreference(preferredRange: NASARangeType): NASARangeType[] {
    const nasa9Order: NASARangeType[] = ['nasa9_6000_20000_K', 'nasa9_1000_6000_K', 'nasa9_200_1000_K'];
    const nasa7Order: NASARangeType[] = ['nasa7_6000_20000_K', 'nasa7_1000_6000_K', 'nasa7_200_1000_K'];
    const baseOrder = preferredRange.startsWith('nasa9') ? nasa9Order : nasa7Order;
    return [preferredRange, ...baseOrder.filter((range) => range !== preferredRange)];
  }

  private buildParmsValues(rangeData: TemperatureRangeData): Record<string, number> | null {
    const coefficients: Record<string, number> = {
      a1: rangeData.a1,
      a2: rangeData.a2,
      a3: rangeData.a3,
      a4: rangeData.a4,
      a5: rangeData.a5,
      a6: rangeData.a6,
      a7: rangeData.a7
    };

    if ('b1' in rangeData && 'b2' in rangeData && rangeData.b1 !== undefined && rangeData.b2 !== undefined) {
      coefficients.b1 = rangeData.b1;
      coefficients.b2 = rangeData.b2;
    }

    const metadata: Record<string, number> = {
      MW: rangeData.MW,
      EnFo_IG: rangeData.EnFo_IG,
      dEnFo_IG_298: rangeData.dEnFo_IG_298,
      Tmin: rangeData.Tmin,
      Tmax: rangeData.Tmax,
      phase_flag: rangeData.phase_flag
    };

    const missing = Object.values(coefficients).some(
      (value) => value === undefined || Number.isNaN(Number(value))
    );
    if (missing) {
      return null;
    }

    return { ...metadata, ...coefficients };
  }
}
