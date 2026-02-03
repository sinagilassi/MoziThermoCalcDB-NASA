// import libs
import { HSG } from './core/HSG';
import { HSGs } from './core/HSGs';
import { RXNAdapter } from './reactions/RXNAdapter';
import {
  NASAType,
  NASARangeType,
  ComponentKey,
  BasisType,
  TEMPERATURE_BREAK_NASA7_1000_K,
  TEMPERATURE_BREAK_NASA7_6000_K,
  TEMPERATURE_BREAK_NASA9_1000_K,
  TEMPERATURE_BREAK_NASA9_6000_K
} from './types/constants';
import { Component, CustomProp, Temperature } from './types/models';
import { ModelSource, Reaction } from './types/external';
import { selectNasaType } from './utils/tools';
import { Source } from './core/Source';


// NOTE: helper to build reaction context
function buildReactionContext(opts: {
  reaction: Reaction;
  model_source: ModelSource;
  component_key: ComponentKey;
  nasa_type: NASAType;
}): { rxn_adapter: RXNAdapter; hsgs: HSGs } {
  const { reaction, model_source, component_key, nasa_type } = opts;
  const Source_ = new Source(model_source, component_key);
  const rxn_adapter = new RXNAdapter(reaction);
  const hsgs = new HSGs(Source_, rxn_adapter.components, component_key, nasa_type);
  return { rxn_adapter, hsgs };
}

/**
 * SECTION: Calculate enthalpy at given temperature for a component
 * @param opts - Options object
 * @param opts.component - The component to calculate enthalpy for
 * @param opts.temperature - The temperature at which to calculate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @param opts.basis - Calculation basis, 'molar' or 'mass' (default: 'molar')
 * @returns CustomProp | null - The calculated absolute enthalpy value or null if calculation fails
 */
export function H_T(opts: {
  component: Component;
  temperature: Temperature;
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
  basis?: BasisType;
}): CustomProp | null {
  const {
    component,
    temperature,
    model_source,
    component_key = 'Name-Formula',
    nasa_type = 'nasa9',
    basis = 'molar'
  } = opts;

  const Source_ = new Source(model_source, component_key);
  const hsg = new HSG({
    source: Source_,
    component,
    component_key,
    nasa_type,
    basis
  });

  const nasa_temperature_break_min_value =
    nasa_type === 'nasa7' ? TEMPERATURE_BREAK_NASA7_1000_K : TEMPERATURE_BREAK_NASA9_1000_K;
  const nasa_temperature_break_max_value =
    nasa_type === 'nasa7' ? TEMPERATURE_BREAK_NASA7_6000_K : TEMPERATURE_BREAK_NASA9_6000_K;

  const nasa_type_selected = selectNasaType(
    temperature,
    { value: nasa_temperature_break_min_value, unit: 'K' },
    { value: nasa_temperature_break_max_value, unit: 'K' },
    nasa_type
  ) as NASARangeType;

  return hsg.calc_absolute_enthalpy(temperature, nasa_type_selected);
}

/**
 * SECTION: Calculate enthalpy over a temperature list for a component
 * @param opts - Options object
 * @param opts.component - The component to calculate enthalpy for
 * @param opts.temperature_list - Temperatures to evaluate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @param opts.basis - Calculation basis, 'molar' or 'mass' (default: 'molar')
 * @returns Array<{ temperature: Temperature; result: CustomProp | null }>
 */
export function H_T_series(opts: {
  component: Component;
  temperature_list: Temperature[];
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
  basis?: BasisType;
}): Array<{ temperature: Temperature; result: CustomProp | null }> {
  const { component, temperature_list, model_source, component_key, nasa_type, basis } = opts;

  return temperature_list.map((temperature) => ({
    temperature,
    result: H_T({ component, temperature, model_source, component_key, nasa_type, basis })
  }));
}

/**
 * SECTION: Calculate absolute entropy at given temperature for a component
 * @param opts - Options object
 * @param opts.component - The component to calculate entropy for
 * @param opts.temperature - The temperature at which to calculate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @param opts.basis - Calculation basis, 'molar' or 'mass' (default: 'molar')
 * @returns CustomProp | null - The calculated absolute entropy value or null if calculation fails
 */
export function S_T(opts: {
  component: Component;
  temperature: Temperature;
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
  basis?: BasisType;
}): CustomProp | null {
  const {
    component,
    temperature,
    model_source,
    component_key = 'Name-Formula',
    nasa_type = 'nasa9',
    basis = 'molar'
  } = opts;

  const Source_ = new Source(model_source, component_key);
  const hsg = new HSG({
    source: Source_,
    component,
    component_key,
    nasa_type,
    basis
  });

  const nasa_temperature_break_min_value =
    nasa_type === 'nasa7' ? TEMPERATURE_BREAK_NASA7_1000_K : TEMPERATURE_BREAK_NASA9_1000_K;
  const nasa_temperature_break_max_value =
    nasa_type === 'nasa7' ? TEMPERATURE_BREAK_NASA7_6000_K : TEMPERATURE_BREAK_NASA9_6000_K;

  const nasa_type_selected = selectNasaType(
    temperature,
    { value: nasa_temperature_break_min_value, unit: 'K' },
    { value: nasa_temperature_break_max_value, unit: 'K' },
    nasa_type
  ) as NASARangeType;

  return hsg.calc_absolute_entropy(temperature, nasa_type_selected);
}

/**
 * SECTION: Calculate entropy over a temperature list for a component
 * @param opts - Options object
 * @param opts.component - The component to calculate entropy for
 * @param opts.temperature_list - Temperatures to evaluate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @param opts.basis - Calculation basis, 'molar' or 'mass' (default: 'molar')
 * @returns Array<{ temperature: Temperature; result: CustomProp | null }>
 */
export function S_T_series(opts: {
  component: Component;
  temperature_list: Temperature[];
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
  basis?: BasisType;
}): Array<{ temperature: Temperature; result: CustomProp | null }> {
  const { component, temperature_list, model_source, component_key, nasa_type, basis } = opts;

  return temperature_list.map((temperature) => ({
    temperature,
    result: S_T({ component, temperature, model_source, component_key, nasa_type, basis })
  }));
}

/**
 * SECTION: Calculate Gibbs free energy at given temperature for a component
 * @param opts - Options object
 * @param opts.component - The component to calculate Gibbs free energy for
 * @param opts.temperature - The temperature at which to calculate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @param opts.basis - Calculation basis, 'molar' or 'mass' (default: 'molar')
 * @returns CustomProp | null - The calculated Gibbs free energy value or null if calculation fails
 */
export function G_T(opts: {
  component: Component;
  temperature: Temperature;
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
  basis?: BasisType;
}): CustomProp | null {
  const {
    component,
    temperature,
    model_source,
    component_key = 'Name-Formula',
    nasa_type = 'nasa9',
    basis = 'molar'
  } = opts;

  const Source_ = new Source(model_source, component_key);
  const hsg = new HSG({
    source: Source_,
    component,
    component_key,
    nasa_type,
    basis
  });

  const nasa_temperature_break_min_value =
    nasa_type === 'nasa7' ? TEMPERATURE_BREAK_NASA7_1000_K : TEMPERATURE_BREAK_NASA9_1000_K;
  const nasa_temperature_break_max_value =
    nasa_type === 'nasa7' ? TEMPERATURE_BREAK_NASA7_6000_K : TEMPERATURE_BREAK_NASA9_6000_K;

  const nasa_type_selected = selectNasaType(
    temperature,
    { value: nasa_temperature_break_min_value, unit: 'K' },
    { value: nasa_temperature_break_max_value, unit: 'K' },
    nasa_type
  ) as NASARangeType;

  return hsg.calc_gibbs_free_energy(temperature, nasa_type_selected);
}

/**
 * SECTION: Calculate Gibbs free energy over a temperature list for a component
 * @param opts - Options object
 * @param opts.component - The component to calculate Gibbs free energy for
 * @param opts.temperature_list - Temperatures to evaluate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @param opts.basis - Calculation basis, 'molar' or 'mass' (default: 'molar')
 * @returns Array<{ temperature: Temperature; result: CustomProp | null }>
 */
export function G_T_series(opts: {
  component: Component;
  temperature_list: Temperature[];
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
  basis?: BasisType;
}): Array<{ temperature: Temperature; result: CustomProp | null }> {
  const { component, temperature_list, model_source, component_key, nasa_type, basis } = opts;

  return temperature_list.map((temperature) => ({
    temperature,
    result: G_T({ component, temperature, model_source, component_key, nasa_type, basis })
  }));
}

/**
 * SECTION: Calculate heat capacity at constant pressure at given temperature for a component
 * @param opts - Options object
 * @param opts.component - The component to calculate heat capacity for
 * @param opts.temperature - The temperature at which to calculate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @param opts.basis - Calculation basis, 'molar' or 'mass' (default: 'molar')
 * @returns CustomProp | null - The calculated heat capacity value or null if calculation fails
 */
export function Cp_T(opts: {
  component: Component;
  temperature: Temperature;
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
  basis?: BasisType;
}): CustomProp | null {
  const {
    component,
    temperature,
    model_source,
    component_key = 'Name-Formula',
    nasa_type = 'nasa9',
    basis = 'molar'
  } = opts;

  const Source_ = new Source(model_source, component_key);
  const hsg = new HSG({
    source: Source_,
    component,
    component_key,
    nasa_type,
    basis
  });

  const nasa_temperature_break_min_value =
    nasa_type === 'nasa7' ? TEMPERATURE_BREAK_NASA7_1000_K : TEMPERATURE_BREAK_NASA9_1000_K;
  const nasa_temperature_break_max_value =
    nasa_type === 'nasa7' ? TEMPERATURE_BREAK_NASA7_6000_K : TEMPERATURE_BREAK_NASA9_6000_K;

  const nasa_type_selected = selectNasaType(
    temperature,
    { value: nasa_temperature_break_min_value, unit: 'K' },
    { value: nasa_temperature_break_max_value, unit: 'K' },
    nasa_type
  ) as NASARangeType;

  return hsg.calc_heat_capacity(temperature, nasa_type_selected);
}

/**
 * SECTION: Calculate heat capacity over a temperature list for a component
 * @param opts - Options object
 * @param opts.component - The component to calculate heat capacity for
 * @param opts.temperature_list - Temperatures to evaluate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @param opts.basis - Calculation basis, 'molar' or 'mass' (default: 'molar')
 * @returns Array<{ temperature: Temperature; result: CustomProp | null }>
 */
export function Cp_T_series(opts: {
  component: Component;
  temperature_list: Temperature[];
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
  basis?: BasisType;
}): Array<{ temperature: Temperature; result: CustomProp | null }> {
  const { component, temperature_list, model_source, component_key, nasa_type, basis } = opts;

  return temperature_list.map((temperature) => ({
    temperature,
    result: Cp_T({ component, temperature, model_source, component_key, nasa_type, basis })
  }));
}

/**
 * SECTION: Calculate standard Gibbs free energy of reaction at given temperature
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.temperature - The temperature at which to calculate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @returns CustomProp | null - The calculated standard Gibbs free energy of reaction or null if calculation fails
 */
export function dG_rxn_STD(opts: {
  reaction: Reaction;
  temperature: Temperature;
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
}): CustomProp | null {
  const { reaction, temperature, model_source, component_key = 'Name-Formula', nasa_type = 'nasa9' } = opts;

  const { rxn_adapter, hsgs } = buildReactionContext({ reaction, model_source, component_key, nasa_type });
  const G_i_IG = hsgs.calc_components_hsg(temperature, 'gibbs', { reaction_ids: true });
  if (!G_i_IG) return null;

  return rxn_adapter.dG_rxn_std({ G_i_IG });
}

/**
 * SECTION: Calculate standard Gibbs free energy of reaction over a temperature list
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.temperature_list - Temperatures to evaluate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @returns Array<{ temperature: Temperature; result: CustomProp | null }>
 */
export function dG_rxn_STD_series(opts: {
  reaction: Reaction;
  temperature_list: Temperature[];
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
}): Array<{ temperature: Temperature; result: CustomProp | null }> {
  const { reaction, temperature_list, model_source, component_key = 'Name-Formula', nasa_type = 'nasa9' } = opts;

  return temperature_list.map((temperature) => ({
    temperature,
    result: dG_rxn_STD({ reaction, temperature, model_source, component_key, nasa_type })
  }));
}

/**
 * SECTION: Calculate standard entropy of reaction at given temperature
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.temperature - The temperature at which to calculate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @returns CustomProp | null - The calculated standard entropy of reaction or null if calculation fails
 */
export function dS_rxn_STD(opts: {
  reaction: Reaction;
  temperature: Temperature;
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
}): CustomProp | null {
  const { reaction, temperature, model_source, component_key = 'Name-Formula', nasa_type = 'nasa9' } = opts;

  const { rxn_adapter, hsgs } = buildReactionContext({ reaction, model_source, component_key, nasa_type });
  const S_i_IG = hsgs.calc_components_hsg(temperature, 'entropy', { reaction_ids: true });
  if (!S_i_IG) return null;

  return rxn_adapter.dS_rxn_std({ S_i_IG });
}

/**
 * SECTION: Calculate standard entropy of reaction over a temperature list
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.temperature_list - Temperatures to evaluate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @returns Array<{ temperature: Temperature; result: CustomProp | null }>
 */
export function dS_rxn_STD_series(opts: {
  reaction: Reaction;
  temperature_list: Temperature[];
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
}): Array<{ temperature: Temperature; result: CustomProp | null }> {
  const { reaction, temperature_list, model_source, component_key = 'Name-Formula', nasa_type = 'nasa9' } = opts;

  return temperature_list.map((temperature) => ({
    temperature,
    result: dS_rxn_STD({ reaction, temperature, model_source, component_key, nasa_type })
  }));
}

/**
 * SECTION: Calculate standard enthalpy of reaction at given temperature
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.temperature - The temperature at which to calculate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @returns CustomProp | null - The calculated standard enthalpy of reaction or null if calculation fails
 */
export function dH_rxn_STD(opts: {
  reaction: Reaction;
  temperature: Temperature;
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
}): CustomProp | null {
  const { reaction, temperature, model_source, component_key = 'Name-Formula', nasa_type = 'nasa9' } = opts;

  const { rxn_adapter, hsgs } = buildReactionContext({ reaction, model_source, component_key, nasa_type });
  const H_i_IG = hsgs.calc_components_hsg(temperature, 'enthalpy', { reaction_ids: true });
  if (!H_i_IG) return null;

  return rxn_adapter.dH_rxn_std({ H_i_IG });
}

/**
 * SECTION: Calculate standard enthalpy of reaction over a temperature list
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.temperature_list - Temperatures to evaluate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @returns Array<{ temperature: Temperature; result: CustomProp | null }>
 */
export function dH_rxn_STD_series(opts: {
  reaction: Reaction;
  temperature_list: Temperature[];
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
}): Array<{ temperature: Temperature; result: CustomProp | null }> {
  const { reaction, temperature_list, model_source, component_key = 'Name-Formula', nasa_type = 'nasa9' } = opts;

  return temperature_list.map((temperature) => ({
    temperature,
    result: dH_rxn_STD({ reaction, temperature, model_source, component_key, nasa_type })
  }));
}

/**
 * SECTION: Calculate standard heat capacity of reaction at given temperature
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.temperature - The temperature at which to calculate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @returns CustomProp | null - The calculated standard heat capacity of reaction or null if calculation fails
 */
export function dCp_rxn_STD(opts: {
  reaction: Reaction;
  temperature: Temperature;
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
}): CustomProp | null {
  const { reaction, temperature, model_source, component_key = 'Name-Formula', nasa_type = 'nasa9' } = opts;

  const { rxn_adapter, hsgs } = buildReactionContext({ reaction, model_source, component_key, nasa_type });
  const Cp_i_IG = hsgs.calc_components_hsg(temperature, 'heat_capacity', { reaction_ids: true });
  if (!Cp_i_IG) return null;

  return rxn_adapter.dCp_rxn_std({ Cp_i_IG });
}

/**
 * SECTION: Calculate standard heat capacity of reaction over a temperature list
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.temperature_list - Temperatures to evaluate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @returns Array<{ temperature: Temperature; result: CustomProp | null }>
 */
export function dCp_rxn_STD_series(opts: {
  reaction: Reaction;
  temperature_list: Temperature[];
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
}): Array<{ temperature: Temperature; result: CustomProp | null }> {
  const { reaction, temperature_list, model_source, component_key = 'Name-Formula', nasa_type = 'nasa9' } = opts;

  return temperature_list.map((temperature) => ({
    temperature,
    result: dCp_rxn_STD({ reaction, temperature, model_source, component_key, nasa_type })
  }));
}

/**
 * SECTION: Species contribution to reaction enthalpy (per-species H_i)
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.temperature - The temperature at which to calculate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @returns Record<string, CustomProp> | null - Per-species enthalpy contributions or null if calculation fails
 */
export function species_contribution_enthalpy(opts: {
  reaction: Reaction;
  temperature: Temperature;
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
}): Record<string, CustomProp> | null {
  const { reaction, temperature, model_source, component_key = 'Name-Formula', nasa_type = 'nasa9' } = opts;

  const { rxn_adapter, hsgs } = buildReactionContext({ reaction, model_source, component_key, nasa_type });
  const H_i_IG = hsgs.calc_components_hsg(temperature, 'enthalpy', { reaction_ids: true });
  if (!H_i_IG) return null;

  return rxn_adapter.species_contribution_enthalpy({ H_i_IG });
}

/**
 * SECTION: Species contribution to reaction Gibbs energy (per-species G_i)
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.temperature - The temperature at which to calculate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @returns Record<string, CustomProp> | null - Per-species Gibbs contributions or null if calculation fails
 */
export function species_contribution_gibbs(opts: {
  reaction: Reaction;
  temperature: Temperature;
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
}): Record<string, CustomProp> | null {
  const { reaction, temperature, model_source, component_key = 'Name-Formula', nasa_type = 'nasa9' } = opts;

  const { rxn_adapter, hsgs } = buildReactionContext({ reaction, model_source, component_key, nasa_type });
  const G_i_IG = hsgs.calc_components_hsg(temperature, 'gibbs', { reaction_ids: true });
  if (!G_i_IG) return null;

  return rxn_adapter.species_contribution_gibbs({ G_i_IG });
}

/**
 * SECTION: Calculate equilibrium constant at given temperature
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.temperature - The temperature at which to calculate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @returns CustomProp | null - The calculated equilibrium constant or null if calculation fails
 */
export function Keq(opts: {
  reaction: Reaction;
  temperature: Temperature;
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
}): CustomProp | null {
  const { reaction, temperature, model_source, component_key = 'Name-Formula', nasa_type = 'nasa9' } = opts;

  const { rxn_adapter, hsgs } = buildReactionContext({ reaction, model_source, component_key, nasa_type });
  const G_i_IG = hsgs.calc_components_hsg(temperature, 'gibbs', { reaction_ids: true });
  if (!G_i_IG) return null;

  const dG = rxn_adapter.dG_rxn_std({ G_i_IG });
  if (!dG) return null;

  return rxn_adapter.Keq({ dG_rxn_STD: dG, temperature });
}

/**
 * SECTION: Calculate equilibrium constant over a temperature list
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.temperature_list - Temperatures to evaluate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @returns Array<{ temperature: Temperature; result: CustomProp | null }>
 */
export function Keq_series(opts: {
  reaction: Reaction;
  temperature_list: Temperature[];
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
}): Array<{ temperature: Temperature; result: CustomProp | null }> {
  const { reaction, temperature_list, model_source, component_key = 'Name-Formula', nasa_type = 'nasa9' } = opts;

  return temperature_list.map((temperature) => ({
    temperature,
    result: Keq({ reaction, temperature, model_source, component_key, nasa_type })
  }));
}

/**
 * SECTION: Calculate equilibrium constant at given temperature using Van't Hoff shortcut method
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.temperature - The temperature at which to calculate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @returns CustomProp | null - The calculated equilibrium constant using Van't Hoff approximation or null if calculation fails
 */
export function Keq_vh_shortcut(opts: {
  reaction: Reaction;
  temperature: Temperature;
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
}): CustomProp | null {
  const { reaction, temperature, model_source, component_key = 'Name-Formula', nasa_type = 'nasa9' } = opts;

  const { rxn_adapter, hsgs } = buildReactionContext({ reaction, model_source, component_key, nasa_type });
  const standard_temperature: Temperature = { value: 298.15, unit: 'K' };

  const H_i_STD = hsgs.calc_components_hsg(standard_temperature, 'enthalpy', { reaction_ids: true });
  if (!H_i_STD) return null;
  const dH_std = rxn_adapter.dH_rxn_std({ H_i_IG: H_i_STD });
  if (!dH_std) return null;

  const G_i_STD = hsgs.calc_components_hsg(standard_temperature, 'gibbs', { reaction_ids: true });
  if (!G_i_STD) return null;
  const dG_std = rxn_adapter.dG_rxn_std({ G_i_IG: G_i_STD });
  if (!dG_std) return null;

  const Keq_STD = rxn_adapter.Keq({ dG_rxn_STD: dG_std, temperature: standard_temperature });
  if (!Keq_STD) return null;

  return rxn_adapter.Keq_vh_shortcut({
    Keq_STD,
    dH_rxn_STD: dH_std,
    temperature
  });
}

/**
 * SECTION: Temperature sensitivity of equilibrium constant at given temperature
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.temperature - The temperature at which to calculate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @returns CustomProp | null - The calculated d(lnKeq)/dT or null if calculation fails
 */
export function dlnKeq_dT(opts: {
  reaction: Reaction;
  temperature: Temperature;
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
}): CustomProp | null {
  const { reaction, temperature, model_source, component_key = 'Name-Formula', nasa_type = 'nasa9' } = opts;

  const { rxn_adapter, hsgs } = buildReactionContext({ reaction, model_source, component_key, nasa_type });
  const H_i_IG = hsgs.calc_components_hsg(temperature, 'enthalpy', { reaction_ids: true });
  if (!H_i_IG) return null;

  const dH = rxn_adapter.dH_rxn_std({ H_i_IG });
  if (!dH) return null;

  return rxn_adapter.dlnKeq_dT({ dH_rxn_STD: dH, temperature });
}

/**
 * SECTION: Temperature sensitivity of equilibrium constant over a temperature list
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.temperature_list - Temperatures to evaluate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @returns Array<{ temperature: Temperature; result: CustomProp | null }>
 */
export function dlnKeq_dT_series(opts: {
  reaction: Reaction;
  temperature_list: Temperature[];
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
}): Array<{ temperature: Temperature; result: CustomProp | null }> {
  const { reaction, temperature_list, model_source, component_key = 'Name-Formula', nasa_type = 'nasa9' } = opts;

  return temperature_list.map((temperature) => ({
    temperature,
    result: dlnKeq_dT({ reaction, temperature, model_source, component_key, nasa_type })
  }));
}

/**
 * SECTION: Sensitivity of Gibbs free energy to temperature
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.temperature - The temperature at which to calculate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @returns CustomProp | null - The calculated d(ΔG°rxn)/dT or null if calculation fails
 */
export function dG_rxn_dT(opts: {
  reaction: Reaction;
  temperature: Temperature;
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
}): CustomProp | null {
  const { reaction, temperature, model_source, component_key = 'Name-Formula', nasa_type = 'nasa9' } = opts;

  const { rxn_adapter, hsgs } = buildReactionContext({ reaction, model_source, component_key, nasa_type });
  const S_i_IG = hsgs.calc_components_hsg(temperature, 'entropy', { reaction_ids: true });
  if (!S_i_IG) return null;

  const dS = rxn_adapter.dS_rxn_std({ S_i_IG });
  if (!dS) return null;

  return rxn_adapter.dG_rxn_dT({ dS_rxn_STD: dS });
}

/**
 * SECTION: Sensitivity of Gibbs free energy to temperature over a temperature list
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.temperature_list - Temperatures to evaluate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @returns Array<{ temperature: Temperature; result: CustomProp | null }>
 */
export function dG_rxn_dT_series(opts: {
  reaction: Reaction;
  temperature_list: Temperature[];
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
}): Array<{ temperature: Temperature; result: CustomProp | null }> {
  const { reaction, temperature_list, model_source, component_key = 'Name-Formula', nasa_type = 'nasa9' } = opts;

  return temperature_list.map((temperature) => ({
    temperature,
    result: dG_rxn_dT({ reaction, temperature, model_source, component_key, nasa_type })
  }));
}

/**
 * SECTION: van't Hoff slope (lnK vs 1/T)
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.temperature - The temperature at which to calculate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @returns CustomProp | null - The calculated d(lnK)/d(1/T) or null if calculation fails
 */
export function dlnK_dInvT(opts: {
  reaction: Reaction;
  temperature: Temperature;
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
}): CustomProp | null {
  const { reaction, temperature, model_source, component_key = 'Name-Formula', nasa_type = 'nasa9' } = opts;

  const { rxn_adapter, hsgs } = buildReactionContext({ reaction, model_source, component_key, nasa_type });
  const H_i_IG = hsgs.calc_components_hsg(temperature, 'enthalpy', { reaction_ids: true });
  if (!H_i_IG) return null;

  const dH = rxn_adapter.dH_rxn_std({ H_i_IG });
  if (!dH) return null;

  return rxn_adapter.dlnK_dInvT({ dH_rxn_STD: dH });
}

/**
 * SECTION: van't Hoff slope (lnK vs 1/T) over a temperature list
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.temperature_list - Temperatures to evaluate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @returns Array<{ temperature: Temperature; result: CustomProp | null }>
 */
export function dlnK_dInvT_series(opts: {
  reaction: Reaction;
  temperature_list: Temperature[];
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
}): Array<{ temperature: Temperature; result: CustomProp | null }> {
  const { reaction, temperature_list, model_source, component_key = 'Name-Formula', nasa_type = 'nasa9' } = opts;

  return temperature_list.map((temperature) => ({
    temperature,
    result: dlnK_dInvT({ reaction, temperature, model_source, component_key, nasa_type })
  }));
}

/**
 * SECTION: Sensitivity of lnK to reaction enthalpy
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.temperature - The temperature at which to calculate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @returns CustomProp | null - The calculated ∂(lnK)/∂(ΔH_rxn) or null if calculation fails
 */
export function dlnK_dH(opts: {
  reaction: Reaction;
  temperature: Temperature;
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
}): CustomProp | null {
  const { reaction, temperature, model_source, component_key = 'Name-Formula', nasa_type = 'nasa9' } = opts;

  const { rxn_adapter } = buildReactionContext({ reaction, model_source, component_key, nasa_type });
  return rxn_adapter.dlnK_dH({ temperature });
}

/**
 * SECTION: Sensitivity of reaction enthalpy to temperature
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.temperature - The temperature at which to calculate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @returns CustomProp | null - The calculated d(ΔH°rxn)/dT or null if calculation fails
 */
export function dH_rxn_dT(opts: {
  reaction: Reaction;
  temperature: Temperature;
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
}): CustomProp | null {
  const { reaction, temperature, model_source, component_key = 'Name-Formula', nasa_type = 'nasa9' } = opts;

  const { rxn_adapter, hsgs } = buildReactionContext({ reaction, model_source, component_key, nasa_type });
  const Cp_i_IG = hsgs.calc_components_hsg(temperature, 'heat_capacity', { reaction_ids: true });
  if (!Cp_i_IG) return null;

  const dCp = rxn_adapter.dCp_rxn_std({ Cp_i_IG });
  if (!dCp) return null;

  return rxn_adapter.dH_rxn_dT({ dCp_rxn_STD: dCp });
}

/**
 * SECTION: Sensitivity of reaction entropy to temperature
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.temperature - The temperature at which to calculate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @returns CustomProp | null - The calculated d(ΔS°rxn)/dT or null if calculation fails
 */
export function dS_rxn_dT(opts: {
  reaction: Reaction;
  temperature: Temperature;
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
}): CustomProp | null {
  const { reaction, temperature, model_source, component_key = 'Name-Formula', nasa_type = 'nasa9' } = opts;

  const { rxn_adapter, hsgs } = buildReactionContext({ reaction, model_source, component_key, nasa_type });
  const Cp_i_IG = hsgs.calc_components_hsg(temperature, 'heat_capacity', { reaction_ids: true });
  if (!Cp_i_IG) return null;

  const dCp = rxn_adapter.dCp_rxn_std({ Cp_i_IG });
  if (!dCp) return null;

  return rxn_adapter.dS_rxn_dT({ dCp_rxn_STD: dCp, temperature });
}

/**
 * SECTION: Curvature of equilibrium constant with temperature
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.temperature - The temperature at which to calculate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @returns CustomProp | null - The calculated d²(lnK)/dT² or null if calculation fails
 */
export function d2lnK_dT2(opts: {
  reaction: Reaction;
  temperature: Temperature;
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
}): CustomProp | null {
  const { reaction, temperature, model_source, component_key = 'Name-Formula', nasa_type = 'nasa9' } = opts;

  const { rxn_adapter, hsgs } = buildReactionContext({ reaction, model_source, component_key, nasa_type });

  const H_i_IG = hsgs.calc_components_hsg(temperature, 'enthalpy', { reaction_ids: true });
  if (!H_i_IG) return null;
  const dH = rxn_adapter.dH_rxn_std({ H_i_IG });
  if (!dH) return null;

  const Cp_i_IG = hsgs.calc_components_hsg(temperature, 'heat_capacity', { reaction_ids: true });
  if (!Cp_i_IG) return null;
  const dCp = rxn_adapter.dCp_rxn_std({ Cp_i_IG });
  if (!dCp) return null;

  return rxn_adapter.d2lnK_dT2({ dH_rxn_STD: dH, dCp_rxn_STD: dCp, temperature });
}

/**
 * SECTION: Sensitivity of lnK to reaction enthalpy over a temperature list
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.temperature_list - Temperatures to evaluate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @returns Array<{ temperature: Temperature; result: CustomProp | null }>
 */
export function dlnK_dH_series(opts: {
  reaction: Reaction;
  temperature_list: Temperature[];
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
}): Array<{ temperature: Temperature; result: CustomProp | null }> {
  const { reaction, temperature_list, model_source, component_key = 'Name-Formula', nasa_type = 'nasa9' } = opts;

  return temperature_list.map((temperature) => ({
    temperature,
    result: dlnK_dH({ reaction, temperature, model_source, component_key, nasa_type })
  }));
}

/**
 * SECTION: Sensitivity of reaction enthalpy to temperature over a temperature list
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.temperature_list - Temperatures to evaluate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @returns Array<{ temperature: Temperature; result: CustomProp | null }>
 */
export function dH_rxn_dT_series(opts: {
  reaction: Reaction;
  temperature_list: Temperature[];
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
}): Array<{ temperature: Temperature; result: CustomProp | null }> {
  const { reaction, temperature_list, model_source, component_key = 'Name-Formula', nasa_type = 'nasa9' } = opts;

  return temperature_list.map((temperature) => ({
    temperature,
    result: dH_rxn_dT({ reaction, temperature, model_source, component_key, nasa_type })
  }));
}

/**
 * SECTION: Sensitivity of reaction entropy to temperature over a temperature list
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.temperature_list - Temperatures to evaluate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @returns Array<{ temperature: Temperature; result: CustomProp | null }>
 */
export function dS_rxn_dT_series(opts: {
  reaction: Reaction;
  temperature_list: Temperature[];
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
}): Array<{ temperature: Temperature; result: CustomProp | null }> {
  const { reaction, temperature_list, model_source, component_key = 'Name-Formula', nasa_type = 'nasa9' } = opts;

  return temperature_list.map((temperature) => ({
    temperature,
    result: dS_rxn_dT({ reaction, temperature, model_source, component_key, nasa_type })
  }));
}

/**
 * SECTION: Curvature of equilibrium constant over a temperature list
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.temperature_list - Temperatures to evaluate
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @returns Array<{ temperature: Temperature; result: CustomProp | null }>
 */
export function d2lnK_dT2_series(opts: {
  reaction: Reaction;
  temperature_list: Temperature[];
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
}): Array<{ temperature: Temperature; result: CustomProp | null }> {
  const { reaction, temperature_list, model_source, component_key = 'Name-Formula', nasa_type = 'nasa9' } = opts;

  return temperature_list.map((temperature) => ({
    temperature,
    result: d2lnK_dT2({ reaction, temperature, model_source, component_key, nasa_type })
  }));
}

/**
 * SECTION: Solve temperature for target equilibrium constant
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.Keq_target - Target equilibrium constant (dimensionless)
 * @param opts.temperature_bounds - Bracket for root finding
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @param opts.options - Solver options
 * @returns Temperature | null - Temperature where Keq(T)=Keq_target or null if not found
 */
export function equilibrium_temperature(opts: {
  reaction: Reaction;
  Keq_target: CustomProp;
  temperature_bounds: { low: Temperature; high: Temperature };
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
  options?: { maxIterations?: number; tolerance?: number };
}): Temperature | null {
  const {
    reaction,
    Keq_target,
    temperature_bounds,
    model_source,
    component_key = 'Name-Formula',
    nasa_type = 'nasa9',
    options
  } = opts;

  const { rxn_adapter, hsgs } = buildReactionContext({ reaction, model_source, component_key, nasa_type });

  const dG_rxn_STD_func = (temperature: Temperature): CustomProp | null => {
    const G_i_IG = hsgs.calc_components_hsg(temperature, 'gibbs', { reaction_ids: true });
    if (!G_i_IG) return null;
    return rxn_adapter.dG_rxn_std({ G_i_IG });
  };

  return rxn_adapter.equilibrium_temperature({
    Keq_target,
    dG_rxn_STD_func,
    temperature_bounds,
    options
  });
}

/**
 * SECTION: Solve temperature for Keq = 1 (ΔG° = 0)
 * @param opts - Options object
 * @param opts.reaction - The reaction to calculate for
 * @param opts.temperature_bounds - Bracket for root finding
 * @param opts.model_source - The NASA model source data
 * @param opts.component_key - Component identifier key (default: 'Name-Formula')
 * @param opts.nasa_type - NASA data type to use, 'nasa7' or 'nasa9' (default: 'nasa9')
 * @param opts.options - Solver options
 * @returns Temperature | null - Temperature where Keq = 1 or null if not found
 */
export function equilibrium_temperature_K1(opts: {
  reaction: Reaction;
  temperature_bounds: { low: Temperature; high: Temperature };
  model_source: ModelSource;
  component_key?: ComponentKey;
  nasa_type?: NASAType;
  options?: { maxIterations?: number; tolerance?: number };
}): Temperature | null {
  const {
    reaction,
    temperature_bounds,
    model_source,
    component_key = 'Name-Formula',
    nasa_type = 'nasa9',
    options
  } = opts;

  const { rxn_adapter, hsgs } = buildReactionContext({ reaction, model_source, component_key, nasa_type });

  const dG_rxn_STD_func = (temperature: Temperature): CustomProp | null => {
    const G_i_IG = hsgs.calc_components_hsg(temperature, 'gibbs', { reaction_ids: true });
    if (!G_i_IG) return null;
    return rxn_adapter.dG_rxn_std({ G_i_IG });
  };

  return rxn_adapter.equilibrium_temperature_K1({
    dG_rxn_STD_func,
    temperature_bounds,
    options
  });
}
