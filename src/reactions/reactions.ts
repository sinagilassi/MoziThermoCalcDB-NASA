import { CustomProp } from '../types/models';
import { R_CONST_J__molK, TEMPERATURE_REF_K } from '../types/constants';

/**
 * Keq = exp(-dG / (R * T))
 */
export function _Keq(opts: { gibbs_energy_of_reaction_std: number; temperature: number }): CustomProp {
  const { gibbs_energy_of_reaction_std, temperature } = opts;
  const value = Math.exp(-gibbs_energy_of_reaction_std / (R_CONST_J__molK * temperature));
  return { value, unit: 'dimensionless' };
}

/**
 * Van't Hoff shortcut:
 * Keq = Keq_std * exp( (-dH_std / R) * (1/T - 1/T_ref) )
 */
export function _Keq_VH_Shortcut(opts: {
  equilibrium_constant_std: number;
  enthalpy_of_reaction_std: number;
  temperature: number;
}): CustomProp {
  const { equilibrium_constant_std, enthalpy_of_reaction_std, temperature } = opts;
  const exponent = (-enthalpy_of_reaction_std / R_CONST_J__molK) * (1 / temperature - 1 / TEMPERATURE_REF_K);
  const value = equilibrium_constant_std * Math.exp(exponent);
  return { value, unit: 'dimensionless' };
}
