import { ComponentKey, NASARangeType } from '@/types/constants';
import { Component } from '@/types/models';
import {
  ComponentEquationSource,
  CompoundTemperatureRanges,
  ModelSource,
  TemperatureRangeData,
  Source as SourceType
} from '@/types/external';
import { setComponentId } from '@/utils/component';

type RangeLookup = { range: NASARangeType; data: TemperatureRangeData };

// LINK: Source class to retrieve NASA polynomial data for components
export class Source implements SourceType {
  // NOTE: Constructor
  constructor(public readonly model_source: ModelSource, public readonly component_key: ComponentKey) { }

  // NOTE: Method to get data source for a component and property
  getDataSource(args: {
    component: Component;
    componentKey: ComponentKey | string;
    propName: NASARangeType;
  }): ComponentEquationSource | null {
    // ! component key
    const componentKey = (args.componentKey as ComponentKey | undefined) ?? this.component_key;

    // ! component id
    const componentId = setComponentId({ component: args.component, componentKey });

    // ! compound data
    const compoundData = this.model_source[componentId];
    if (!compoundData) {
      return null;
    }

    // ! range match
    const rangeMatch = this.pickRange(compoundData, args.propName);
    if (!rangeMatch) {
      return null;
    }

    // ! validated range
    const validatedRange = this.validateRangeData(rangeMatch.data, rangeMatch.range);
    if (!validatedRange) {
      return null;
    }

    return {
      component: args.component,
      temperatureRange: rangeMatch.range,
      source: validatedRange
    };
  }

  // NOTE: Private method to select the best matching temperature range
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

  // NOTE: Private method to build preference order for temperature ranges
  private buildRangePreference(preferredRange: NASARangeType): NASARangeType[] {
    const nasa9Order: NASARangeType[] = ['nasa9_6000_20000_K', 'nasa9_1000_6000_K', 'nasa9_200_1000_K'];
    const nasa7Order: NASARangeType[] = ['nasa7_6000_20000_K', 'nasa7_1000_6000_K', 'nasa7_200_1000_K'];
    const baseOrder = preferredRange.startsWith('nasa9') ? nasa9Order : nasa7Order;
    return [preferredRange, ...baseOrder.filter((range) => range !== preferredRange)];
  }

  // NOTE: Private method to validate the completeness of range data
  private validateRangeData(
    rangeData: TemperatureRangeData,
    range: NASARangeType
  ): TemperatureRangeData | null {
    const baseKeys = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'MW'] as const;
    const nasa9Keys = ['b1', 'b2'] as const;
    const metadataKeys = [
      'EnFo_IG',
      'dEnFo_IG_298',
      'Tmin',
      'Tmax',
      'phase_flag'
    ] as const;

    const required = range.startsWith('nasa9')
      ? [...baseKeys, ...nasa9Keys, ...metadataKeys]
      : [...baseKeys, ...metadataKeys];

    const hasMissing = required.some((key) => {
      const value = (rangeData as any)[key];
      return value === undefined || Number.isNaN(Number(value));
    });

    return hasMissing ? null : rangeData;
  }
}
