import { CustomProp } from '@/types/models';
import { R_CONST_J__molK, TEMPERATURE_REF_K } from '@/types/constants';

/**
 * ! Keq = exp(-dG / (R * T))
 * Universal gas constant R in J/mol.K
 * @returns equilibrium constant (dimensionless)
 * @param gibbs_energy_of_reaction_std Standard Gibbs energy of reaction (J/mol)
 * @param temperature Temperature (K)
 */
export function _Keq(opts: { gibbs_energy_of_reaction_std: number; temperature: number }): CustomProp {
  // NOTE: extract inputs
  const { gibbs_energy_of_reaction_std, temperature } = opts;

  // NOTE: calculate Keq
  const value = Math.exp(-gibbs_energy_of_reaction_std / (R_CONST_J__molK * temperature));

  // res
  return { value, unit: 'dimensionless' };
}

/**
 * Van't Hoff shortcut:
 * ! Keq = Keq_std * exp( (-dH_std / R) * (1/T - 1/T_ref) )
 * Universal gas constant R in J/mol.K
 * @returns equilibrium constant (dimensionless)
 * @param equilibrium_constant_std Standard equilibrium constant (dimensionless)
 * @param enthalpy_of_reaction_std Standard enthalpy of reaction (J/mol)
 * @param temperature Temperature (K)
 */
export function _Keq_VH_Shortcut(opts: {
  equilibrium_constant_std: number;
  enthalpy_of_reaction_std: number;
  temperature: number;
}): CustomProp {
  // NOTE: extract inputs
  const { equilibrium_constant_std, enthalpy_of_reaction_std, temperature } = opts;

  // NOTE: calculate Keq
  const exponent = (-enthalpy_of_reaction_std / R_CONST_J__molK) * (1 / temperature - 1 / TEMPERATURE_REF_K);
  const value = equilibrium_constant_std * Math.exp(exponent);

  // res
  return { value, unit: 'dimensionless' };
}

/**
 * Temperature sensitivity of the equilibrium constant:
 * ! d(lnKeq)/dT = dH_rxn / (R * T^2)
 * Universal gas constant R in J/mol.K
 * @returns d(lnKeq)/dT (1/K)
 * @param enthalpy_of_reaction_std Enthalpy of reaction (J/mol)
 * @param temperature Temperature (K)
 */
export function _dlnKeq_dT(opts: { enthalpy_of_reaction_std: number; temperature: number }): CustomProp {
  const { enthalpy_of_reaction_std, temperature } = opts;
  const value = enthalpy_of_reaction_std / (R_CONST_J__molK * temperature * temperature);
  return { value, unit: '1/K' };
}

/**
 * van't Hoff slope:
 * ! d(lnK)/d(1/T) = -dH_rxn / R
 * Universal gas constant R in J/mol.K
 * @returns d(lnK)/d(1/T) (K)
 * @param enthalpy_of_reaction_std Enthalpy of reaction (J/mol)
 */
export function _dlnK_dInvT(opts: { enthalpy_of_reaction_std: number }): CustomProp {
  const { enthalpy_of_reaction_std } = opts;
  const value = -enthalpy_of_reaction_std / R_CONST_J__molK;
  return { value, unit: 'K' };
}

/**
 * Sensitivity of lnK to reaction enthalpy:
 * ! ∂(lnK)/∂(ΔH_rxn) = 1 / (R * T)
 * Universal gas constant R in J/mol.K
 * @returns ∂(lnK)/∂(ΔH_rxn) (mol/J)
 * @param temperature Temperature (K)
 */
export function _dlnK_dH(opts: { temperature: number }): CustomProp {
  const { temperature } = opts;
  const value = 1 / (R_CONST_J__molK * temperature);
  return { value, unit: 'mol/J' };
}

/**
 * Sensitivity of reaction enthalpy to temperature:
 * ! d(ΔH_rxn)/dT = ΔCp_rxn(T)
 * @returns d(ΔH_rxn)/dT (J/mol.K)
 * @param heat_capacity_of_reaction Std heat capacity of reaction (J/mol.K)
 */
export function _dH_rxn_dT(opts: { heat_capacity_of_reaction: number }): CustomProp {
  const { heat_capacity_of_reaction } = opts;
  return { value: heat_capacity_of_reaction, unit: 'J/mol.K' };
}

/**
 * Sensitivity of reaction entropy to temperature:
 * ! d(ΔS_rxn)/dT = ΔCp_rxn(T) / T
 * @returns d(ΔS_rxn)/dT (J/mol.K^2)
 * @param heat_capacity_of_reaction Std heat capacity of reaction (J/mol.K)
 * @param temperature Temperature (K)
 */
export function _dS_rxn_dT(opts: { heat_capacity_of_reaction: number; temperature: number }): CustomProp {
  const { heat_capacity_of_reaction, temperature } = opts;
  const value = heat_capacity_of_reaction / temperature;
  return { value, unit: 'J/mol.K^2' };
}

/**
 * Curvature of equilibrium constant with temperature:
 * ! d^2(lnK)/dT^2 = (ΔCp_rxn / (R T^2)) - (2 ΔH_rxn / (R T^3))
 * Universal gas constant R in J/mol.K
 * @returns d^2(lnK)/dT^2 (1/K^2)
 * @param enthalpy_of_reaction_std Enthalpy of reaction (J/mol)
 * @param heat_capacity_of_reaction Std heat capacity of reaction (J/mol.K)
 * @param temperature Temperature (K)
 */
export function _d2lnK_dT2(opts: {
  enthalpy_of_reaction_std: number;
  heat_capacity_of_reaction: number;
  temperature: number;
}): CustomProp {
  const { enthalpy_of_reaction_std, heat_capacity_of_reaction, temperature } = opts;
  const term_cp = heat_capacity_of_reaction / (R_CONST_J__molK * temperature * temperature);
  const term_h = (2 * enthalpy_of_reaction_std) / (R_CONST_J__molK * temperature * temperature * temperature);
  const value = term_cp - term_h;
  return { value, unit: '1/K^2' };
}
