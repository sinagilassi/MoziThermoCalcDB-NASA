import { Component, CustomProp, Temperature } from '@/types/models';
import { Reaction } from '@/types/external';
import { analyzeReactionFromReaction, ReactionAnalysis } from './RXNAnalyzer';
import { RXN } from './RXN';


/**
 * ! Adapter class to interface with RXN calculations based on a given reaction.
 */
export class RXNAdapter {
  private readonly analysis: ReactionAnalysis;
  private readonly rxn: RXN;

  // NOTE: constructor
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

  // SECTION: Calculate reaction enthalpy
  dH_rxn_std({ H_i_IG }: { H_i_IG: Record<string, CustomProp> }): CustomProp | null {
    return this.rxn.dH_rxn_STD(H_i_IG);
  }

  // SECTION: Calculate reaction entropy
  dS_rxn_std({ S_i_IG }: { S_i_IG: Record<string, CustomProp> }): CustomProp | null {
    return this.rxn.dS_rxn_STD(S_i_IG);
  }

  // SECTION: Calculate reaction heat capacity
  dCp_rxn_std({ Cp_i_IG }: { Cp_i_IG: Record<string, CustomProp> }): CustomProp | null {
    return this.rxn.dCp_rxn_STD(Cp_i_IG);
  }

  // SECTION: Species contribution to reaction enthalpy
  species_contribution_enthalpy({ H_i_IG }: { H_i_IG: Record<string, CustomProp> }): Record<string, CustomProp> | null {
    return this.rxn.species_contribution_enthalpy(H_i_IG);
  }

  // SECTION: Species contribution to reaction Gibbs energy
  species_contribution_gibbs({ G_i_IG }: { G_i_IG: Record<string, CustomProp> }): Record<string, CustomProp> | null {
    return this.rxn.species_contribution_gibbs(G_i_IG);
  }

  // SECTION: Calculate reaction Gibbs free energy
  dG_rxn_std({ G_i_IG }: { G_i_IG: Record<string, CustomProp> }): CustomProp | null {
    return this.rxn.dG_rxn_STD(G_i_IG);
  }

  // SECTION: Calculate equilibrium constant
  Keq({ dG_rxn_STD, temperature }: { dG_rxn_STD: CustomProp; temperature: Temperature }): CustomProp | null {
    return this.rxn.Keq(dG_rxn_STD, temperature);
  }

  // SECTION: Calculate van't Hoff equilibrium constant
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

  // SECTION: Calculate van't Hoff equilibrium constant (shortcut)
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

  // SECTION: Temperature sensitivity of equilibrium constant
  dlnKeq_dT({
    dH_rxn_STD,
    temperature
  }: {
    dH_rxn_STD: CustomProp;
    temperature: Temperature;
  }): CustomProp | null {
    return this.rxn.dlnKeq_dT(dH_rxn_STD, temperature);
  }

  // SECTION: Sensitivity of Gibbs free energy to temperature
  dG_rxn_dT({ dS_rxn_STD }: { dS_rxn_STD: CustomProp }): CustomProp | null {
    return this.rxn.dG_rxn_dT(dS_rxn_STD);
  }

  // SECTION: van't Hoff slope (lnK vs 1/T)
  dlnK_dInvT({ dH_rxn_STD }: { dH_rxn_STD: CustomProp }): CustomProp | null {
    return this.rxn.dlnK_dInvT(dH_rxn_STD);
  }

  // SECTION: Solve for equilibrium temperature given target Keq
  equilibrium_temperature({
    Keq_target,
    dG_rxn_STD_func,
    temperature_bounds,
    options
  }: {
    Keq_target: CustomProp;
    dG_rxn_STD_func: (temperature: Temperature) => CustomProp | null;
    temperature_bounds: { low: Temperature; high: Temperature };
    options?: { maxIterations?: number; tolerance?: number };
  }): Temperature | null {
    return this.rxn.equilibrium_temperature(Keq_target, dG_rxn_STD_func, temperature_bounds, options);
  }

  // SECTION: Convenience equilibrium temperature solver for Keq = 1
  equilibrium_temperature_K1({
    dG_rxn_STD_func,
    temperature_bounds,
    options
  }: {
    dG_rxn_STD_func: (temperature: Temperature) => CustomProp | null;
    temperature_bounds: { low: Temperature; high: Temperature };
    options?: { maxIterations?: number; tolerance?: number };
  }): Temperature | null {
    return this.rxn.equilibrium_temperature_K1(dG_rxn_STD_func, temperature_bounds, options);
  }
}
