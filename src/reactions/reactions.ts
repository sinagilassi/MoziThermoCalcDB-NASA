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
