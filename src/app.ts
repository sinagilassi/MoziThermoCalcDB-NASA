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
