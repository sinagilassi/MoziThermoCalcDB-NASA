import { CustomProp, Temperature } from '../types/models';
import { Reaction } from '../types/external';
import { dH_rxn_STD, dS_rxn_STD, dG_rxn_STD, Keq, Keq_vh_shortcut, Keq_vh } from './source';

export class RXNAdapter {
  constructor(private readonly reaction: Reaction) {}

  dH_rxn_std({ H_i_IG, ...kwargs }: { H_i_IG: Record<string, CustomProp> }): CustomProp | null {
    return dH_rxn_STD({ reaction: this.reaction, H_i_IG, ...kwargs });
  }

  dS_rxn_std({ S_i_IG, ...kwargs }: { S_i_IG: Record<string, CustomProp> }): CustomProp | null {
    return dS_rxn_STD({ reaction: this.reaction, S_i_IG, ...kwargs });
  }

  dG_rxn_std({ G_i_IG, ...kwargs }: { G_i_IG: Record<string, CustomProp> }): CustomProp | null {
    return dG_rxn_STD({ reaction: this.reaction, G_i_IG, ...kwargs });
  }

  Keq({ dG_rxn_STD, temperature, ...kwargs }: { dG_rxn_STD: CustomProp; temperature: Temperature }): CustomProp | null {
    return Keq({ reaction: this.reaction, dG_rxn_STD, temperature, ...kwargs });
  }

  Keq_vh({
    Keq_STD,
    dH_rxn_STD_func,
    temperature,
    ...kwargs
  }: {
    Keq_STD: CustomProp;
    dH_rxn_STD_func: (temperature: Temperature) => CustomProp | null;
    temperature: Temperature;
  }): CustomProp | null {
    return Keq_vh({ reaction: this.reaction, Keq_STD, dH_rxn_STD_func, temperature, ...kwargs });
  }

  Keq_vh_shortcut({
    Keq_STD,
    dH_rxn_STD,
    temperature,
    ...kwargs
  }: {
    Keq_STD: CustomProp;
    dH_rxn_STD: CustomProp;
    temperature: Temperature;
  }): CustomProp | null {
    return Keq_vh_shortcut({ reaction: this.reaction, Keq_STD, dH_rxn_STD, temperature, ...kwargs });
  }
}
