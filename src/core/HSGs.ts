import { HSG } from './HSG';
import {
  NASARangeType,
  NASAType,
  ComponentKey,
  TEMPERATURE_BREAK_NASA7_1000_K,
  TEMPERATURE_BREAK_NASA7_6000_K,
  TEMPERATURE_BREAK_NASA9_1000_K,
  TEMPERATURE_BREAK_NASA9_6000_K
} from '../types/constants';
import { Component, CustomProp, Temperature } from '../types/models';
import { Source } from '../types/external';
import { selectNasaType } from '../utils/tools';
import { setComponentId } from '../utils/component';

type PropName = 'enthalpy' | 'entropy' | 'gibbs' | 'heat_capacity';

export class HSGs {
  private readonly component_ids: string[];
  private readonly reaction_component_ids: Record<string, string>;
  private readonly nasa_temperature_break_min: Temperature;
  private readonly nasa_temperature_break_max: Temperature;

  components_hsg: Record<string, HSG>;

  constructor(
    private readonly source: Source,
    private readonly components: Component[],
    private readonly component_key: ComponentKey,
    private readonly nasa_type: NASAType
  ) {
    this.component_ids = components.map((component) =>
      setComponentId({ component, componentKey: component_key })
    );

    this.reaction_component_ids = {};
    for (const [compId, component] of this.component_ids.map((id, idx) => [id, components[idx]] as const)) {
      this.reaction_component_ids[compId] = `${component.formula}-${component.state}`;
    }

    const nasa_temperature_break_min_value =
      this.nasa_type === 'nasa7'
        ? TEMPERATURE_BREAK_NASA7_1000_K
        : TEMPERATURE_BREAK_NASA9_1000_K;
    this.nasa_temperature_break_min = { value: nasa_temperature_break_min_value, unit: 'K' };

    const nasa_temperature_break_max_value =
      this.nasa_type === 'nasa7'
        ? TEMPERATURE_BREAK_NASA7_6000_K
        : TEMPERATURE_BREAK_NASA9_6000_K;
    this.nasa_temperature_break_max = { value: nasa_temperature_break_max_value, unit: 'K' };

    this.components_hsg = this.build_components_hsg();
  }

  build_components_hsg(): Record<string, HSG> {
    const hsgs: Record<string, HSG> = {};
    for (const [id, component] of this.component_ids.map((id, idx) => [id, this.components[idx]] as const)) {
      hsgs[id] = new HSG({
        source: this.source,
        component,
        component_key: this.component_key,
        nasa_type: this.nasa_type
      });
    }
    return hsgs;
  }

  calc_components_hsg(
    temperature: Temperature,
    prop_name: PropName,
    opts?: { reaction_ids?: boolean }
  ): Record<string, CustomProp> | null {
    const nasa_type_selected = selectNasaType(
      temperature,
      this.nasa_temperature_break_min,
      this.nasa_temperature_break_max,
      this.nasa_type
    ) as NASARangeType;

    const hsgs_data: Record<string, CustomProp> = {};
    for (const [id, hsg] of Object.entries(this.components_hsg)) {
      let res: CustomProp | null = null;
      switch (prop_name) {
        case 'enthalpy':
          res = hsg.calc_absolute_enthalpy(temperature, nasa_type_selected);
          break;
        case 'entropy':
          res = hsg.calc_absolute_entropy(temperature, nasa_type_selected);
          break;
        case 'gibbs':
          res = hsg.calc_gibbs_free_energy(temperature, nasa_type_selected);
          break;
        case 'heat_capacity':
          res = hsg.calc_heat_capacity(temperature, nasa_type_selected);
          break;
      }

      if (!res) {
        continue;
      }

      if (opts?.reaction_ids) {
        hsgs_data[this.reaction_component_ids[id]] = res;
      } else {
        hsgs_data[id] = res;
      }
    }

    return Object.keys(hsgs_data).length ? hsgs_data : null;
  }
}
