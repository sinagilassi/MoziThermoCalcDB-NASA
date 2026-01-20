import { Component, CustomProp, Temperature } from '../types/models';
import { Reaction } from '../types/external';
import { analyzeReactionFromReaction, ReactionAnalysis } from './RXNAnalyzer';
import { RXN } from './RXN';

export class RXNAdapter {
  private readonly analysis: ReactionAnalysis;
  private readonly rxn: RXN;

  constructor(private readonly reaction: Reaction) {
    this.analysis = analyzeReactionFromReaction(reaction);
    this.rxn = new RXN(this.analysis);
  }

  get components(): Component[] {
    return this.analysis.components;
  }

  get reactionAnalysis(): ReactionAnalysis {
    return this.analysis;
  }

  dH_rxn_std({ H_i_IG }: { H_i_IG: Record<string, CustomProp> }): CustomProp | null {
    return this.rxn.dH_rxn_STD(H_i_IG);
  }

  dS_rxn_std({ S_i_IG }: { S_i_IG: Record<string, CustomProp> }): CustomProp | null {
    return this.rxn.dS_rxn_STD(S_i_IG);
  }

  dG_rxn_std({ G_i_IG }: { G_i_IG: Record<string, CustomProp> }): CustomProp | null {
    return this.rxn.dG_rxn_STD(G_i_IG);
  }

  Keq({ dG_rxn_STD, temperature }: { dG_rxn_STD: CustomProp; temperature: Temperature }): CustomProp | null {
    return this.rxn.Keq(dG_rxn_STD, temperature);
  }

  Keq_vh({
    Keq_STD,
    dH_rxn_STD_func,
    temperature
  }: {
    Keq_STD: CustomProp;
    dH_rxn_STD_func: (temperature: Temperature) => CustomProp | null;
    temperature: Temperature;
  }): CustomProp | null {
    return this.rxn.Keq_vh(Keq_STD, dH_rxn_STD_func, temperature);
  }

  Keq_vh_shortcut({
    Keq_STD,
    dH_rxn_STD,
    temperature
  }: {
    Keq_STD: CustomProp;
    dH_rxn_STD: CustomProp;
    temperature: Temperature;
  }): CustomProp | null {
    return this.rxn.Keq_vh_shortcut(Keq_STD, dH_rxn_STD, temperature);
  }
}
