import { CustomProp, Temperature } from '@/types/models';
import { ReactionAnalysis } from './RXNAnalyzer';
import { ensureEnergy, ensureEntropy, ensureKelvin, toJPerMol } from '@/utils/conversions';
import { _Keq as KeqThermo, _Keq_VH_Shortcut } from './reactions';
import { R_CONST_J__molK, TEMPERATURE_REF_K } from '@/types/constants';
import { integrateTrapezoidal } from '@/utils/mathMethods';

/**
 * ! RXN handles reaction-level thermodynamics: dH, dG, dS, Keq.
 */
export class RXN {
  private readonly R = R_CONST_J__molK;
  private readonly T_ref = TEMPERATURE_REF_K;

  // NOTE: Constructor
  constructor(private readonly reaction: ReactionAnalysis) {
    if (reaction.component_checker === false) {
      throw new Error('Some components in the reaction are not available in the provided components list.');
    }
  }

  // SECTION: Calculate enthalpy of reaction
  dH_rxn_STD(H_i_IG: Record<string, CustomProp>): CustomProp | null {
    try {
      let reaction_enthalpy = 0;

      // iterate over reaction stoichiometry
      for (const [component_id, coeff] of Object.entries(this.reaction.reaction_stoichiometry)) {
        const prop = H_i_IG[component_id];
        if (!prop) throw new Error(`Component ID '${component_id}' not found in H_i_IG dictionary.`);
        const { value } = ensureEnergy(prop);
        reaction_enthalpy += coeff * value;
      }

      // res
      return { value: reaction_enthalpy, unit: 'J/mol' };
    } catch (err) {
      return null;
    }
  }

  // SECTION: Calculate Gibbs energy of reaction
  dG_rxn_STD(G_i_IG: Record<string, CustomProp>): CustomProp | null {
    try {
      let reaction_gibbs = 0;

      // iterate over reaction stoichiometry
      for (const [component_id, coeff] of Object.entries(this.reaction.reaction_stoichiometry)) {
        const prop = G_i_IG[component_id];
        if (!prop) throw new Error(`Component ID '${component_id}' not found in G_i_IG dictionary.`);
        const { value } = ensureEnergy(prop);
        reaction_gibbs += coeff * value;
      }

      // res
      return { value: reaction_gibbs, unit: 'J/mol' };
    } catch (err) {
      return null;
    }
  }

  // SECTION: Calculate Entropy of reaction
  dS_rxn_STD(S_i_IG: Record<string, CustomProp>): CustomProp | null {
    try {
      let reaction_entropy = 0;

      // iterate over reaction stoichiometry
      for (const [component_id, coeff] of Object.entries(this.reaction.reaction_stoichiometry)) {
        const prop = S_i_IG[component_id];
        if (!prop) throw new Error(`Component ID '${component_id}' not found in S_i_IG dictionary.`);
        const { value } = ensureEntropy(prop);
        reaction_entropy += coeff * value;
      }

      // res
      return { value: reaction_entropy, unit: 'J/mol.K' };
    } catch (err) {
      return null;
    }
  }

  // SECTION: Calculate Equilibrium constant from Gibbs energy of reaction
  Keq(dG_rxn_STD: CustomProp, temperature: Temperature): CustomProp | null {
    try {
      return KeqThermo({
        gibbs_energy_of_reaction_std: ensureEnergy(dG_rxn_STD).value,
        temperature: ensureKelvin(temperature)
      });
    } catch {
      return null;
    }
  }

  // SECTION: Calculate Equilibrium constant using Van't Hoff equation
  Keq_vh(
    Keq_STD: CustomProp,
    dH_rxn_STD_func: (temperature: Temperature) => CustomProp | null,
    temperature: Temperature
  ): CustomProp | null {
    try {
      const T_target = ensureKelvin(temperature);
      const K_ref = Keq_STD.unit === 'dimensionless' ? Keq_STD.value : (() => { throw new Error('Keq_STD must be dimensionless'); })();

      // reference temperature
      const T0 = this.T_ref;

      // NOTE: numeric integration of dH(T)/T^2 from T_ref to T_target (simple trapezoidal)
      const integral = integrateTrapezoidal(
        (temp: number) => {
          const dH = dH_rxn_STD_func({ value: temp, unit: 'K' });
          if (!dH) throw new Error(`ΔH missing at T=${temp}`);
          return ensureEnergy(dH).value / (temp * temp);
        },
        T0,
        T_target
      );

      // NOTE: equilibrium constant at reference temperature
      const lnK_ref = Math.log(K_ref);

      // NOTE: equilibrium constant at target temperature
      const ln_Keq_T = (1 / this.R) * integral + lnK_ref;
      const Keq_T_value = Math.exp(ln_Keq_T);

      // res
      return { value: Keq_T_value, unit: 'dimensionless' };
    } catch {
      return null;
    }
  }

  // SECTION: Calculate Equilibrium constant using Van't Hoff shortcut
  Keq_vh_shortcut(Keq_STD: CustomProp, dH_rxn_STD: CustomProp, temperature: Temperature): CustomProp | null {
    try {
      return _Keq_VH_Shortcut({
        equilibrium_constant_std: Keq_STD.value,
        enthalpy_of_reaction_std: toJPerMol(dH_rxn_STD.value, dH_rxn_STD.unit),
        temperature: ensureKelvin(temperature)
      });
    } catch {
      return null;
    }
  }
}
