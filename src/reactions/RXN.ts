import { CustomProp, Temperature } from '../types/models';
import { ReactionAnalysis } from './RXNAnalyzer';
import { ensureEnergy, ensureEntropy, ensureKelvin, toJPerMol } from '../utils/conversions';
import { _Keq as KeqThermo, _Keq_VH_Shortcut } from './reactions';
import { R_CONST_J__molK, TEMPERATURE_REF_K } from '../types/constants';

/**
 * RXN handles reaction-level thermodynamics: dH, dG, dS, Keq.
 */
export class RXN {
  private readonly R = R_CONST_J__molK;
  private readonly T_ref = TEMPERATURE_REF_K;

  constructor(private readonly reaction: ReactionAnalysis) {
    if (reaction.component_checker === false) {
      throw new Error('Some components in the reaction are not available in the provided components list.');
    }
  }

  dH_rxn_STD(H_i_IG: Record<string, CustomProp>): CustomProp | null {
    try {
      let reaction_enthalpy = 0;
      for (const [component_id, coeff] of Object.entries(this.reaction.reaction_stoichiometry)) {
        const prop = H_i_IG[component_id];
        if (!prop) throw new Error(`Component ID '${component_id}' not found in H_i_IG dictionary.`);
        const { value } = ensureEnergy(prop);
        reaction_enthalpy += coeff * value;
      }
      return { value: reaction_enthalpy, unit: 'J/mol' };
    } catch (err) {
      return null;
    }
  }

  dG_rxn_STD(G_i_IG: Record<string, CustomProp>): CustomProp | null {
    try {
      let reaction_gibbs = 0;
      for (const [component_id, coeff] of Object.entries(this.reaction.reaction_stoichiometry)) {
        const prop = G_i_IG[component_id];
        if (!prop) throw new Error(`Component ID '${component_id}' not found in G_i_IG dictionary.`);
        const { value } = ensureEnergy(prop);
        reaction_gibbs += coeff * value;
      }
      return { value: reaction_gibbs, unit: 'J/mol' };
    } catch (err) {
      return null;
    }
  }

  dS_rxn_STD(S_i_IG: Record<string, CustomProp>): CustomProp | null {
    try {
      let reaction_entropy = 0;
      for (const [component_id, coeff] of Object.entries(this.reaction.reaction_stoichiometry)) {
        const prop = S_i_IG[component_id];
        if (!prop) throw new Error(`Component ID '${component_id}' not found in S_i_IG dictionary.`);
        const { value } = ensureEntropy(prop);
        reaction_entropy += coeff * value;
      }
      return { value: reaction_entropy, unit: 'J/mol.K' };
    } catch (err) {
      return null;
    }
  }

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

  Keq_vh(
    Keq_STD: CustomProp,
    dH_rxn_STD_func: (temperature: Temperature) => CustomProp | null,
    temperature: Temperature
  ): CustomProp | null {
    try {
      const T_target = ensureKelvin(temperature);
      const K_ref = Keq_STD.unit === 'dimensionless' ? Keq_STD.value : (() => { throw new Error('Keq_STD must be dimensionless'); })();

      // numeric integration of dH(T)/T^2 from T_ref to T_target (simple trapezoidal)
      const steps = 200;
      const T0 = this.T_ref;
      const h = (T_target - T0) / steps;
      let integral = 0;
      for (let i = 0; i <= steps; i++) {
        const T = T0 + i * h;
        const weight = i === 0 || i === steps ? 0.5 : 1;
        const dH = dH_rxn_STD_func({ value: T, unit: 'K' });
        if (!dH) throw new Error(`Failed to get dH_rxn_STD at T=${T}`);
        const dH_value = ensureEnergy(dH).value;
        integral += weight * (dH_value / (T * T));
      }
      integral *= h;
      const ln_Keq_T = (1 / this.R) * integral + Math.log(K_ref);
      const Keq_T_value = Math.exp(ln_Keq_T);
      return { value: Keq_T_value, unit: 'dimensionless' };
    } catch {
      return null;
    }
  }

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
