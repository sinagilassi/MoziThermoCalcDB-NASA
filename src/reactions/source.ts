import { CustomProp, Temperature } from '@/types/models';
import { Reaction } from '@/types/external';
import { analyzeReactionFromReaction } from './RXNAnalyzer';
import { RXN } from './RXN';

function buildReactionAnalysis(reaction: Reaction) {
  return analyzeReactionFromReaction(reaction);
}

export function rxn(reaction: Reaction): RXN {
  const reactionAnalysis = buildReactionAnalysis(reaction);
  return new RXN(reactionAnalysis);
}

export function dH_rxn_STD(opts: { reaction: Reaction; H_i_IG: Record<string, CustomProp> }): CustomProp | null {
  const rxnObj = rxn(opts.reaction);
  return rxnObj.dH_rxn_STD(opts.H_i_IG);
}

export function dS_rxn_STD(opts: { reaction: Reaction; S_i_IG: Record<string, CustomProp> }): CustomProp | null {
  const rxnObj = rxn(opts.reaction);
  return rxnObj.dS_rxn_STD(opts.S_i_IG);
}

export function dCp_rxn_STD(opts: { reaction: Reaction; Cp_i_IG: Record<string, CustomProp> }): CustomProp | null {
  const rxnObj = rxn(opts.reaction);
  return rxnObj.dCp_rxn_STD(opts.Cp_i_IG);
}

export function dG_rxn_STD(opts: { reaction: Reaction; G_i_IG: Record<string, CustomProp> }): CustomProp | null {
  const rxnObj = rxn(opts.reaction);
  return rxnObj.dG_rxn_STD(opts.G_i_IG);
}

export function species_contribution_enthalpy(opts: {
  reaction: Reaction;
  H_i_IG: Record<string, CustomProp>;
}): Record<string, CustomProp> | null {
  const rxnObj = rxn(opts.reaction);
  return rxnObj.species_contribution_enthalpy(opts.H_i_IG);
}

export function species_contribution_gibbs(opts: {
  reaction: Reaction;
  G_i_IG: Record<string, CustomProp>;
}): Record<string, CustomProp> | null {
  const rxnObj = rxn(opts.reaction);
  return rxnObj.species_contribution_gibbs(opts.G_i_IG);
}

export function Keq(opts: { reaction: Reaction; dG_rxn_STD: CustomProp; temperature: Temperature }): CustomProp | null {
  const rxnObj = rxn(opts.reaction);
  return rxnObj.Keq(opts.dG_rxn_STD, opts.temperature);
}

export function Keq_vh(opts: {
  reaction: Reaction;
  Keq_STD: CustomProp;
  dH_rxn_STD_func: (temperature: Temperature) => CustomProp | null;
  temperature: Temperature;
}): CustomProp | null {
  const rxnObj = rxn(opts.reaction);
  return rxnObj.Keq_vh(opts.Keq_STD, opts.dH_rxn_STD_func, opts.temperature);
}

export function Keq_vh_shortcut(opts: {
  reaction: Reaction;
  Keq_STD: CustomProp;
  dH_rxn_STD: CustomProp;
  temperature: Temperature;
}): CustomProp | null {
  const rxnObj = rxn(opts.reaction);
  return rxnObj.Keq_vh_shortcut(opts.Keq_STD, opts.dH_rxn_STD, opts.temperature);
}

export function dG_rxn_dT(opts: { reaction: Reaction; dS_rxn_STD: CustomProp }): CustomProp | null {
  const rxnObj = rxn(opts.reaction);
  return rxnObj.dG_rxn_dT(opts.dS_rxn_STD);
}

export function dlnK_dInvT(opts: { reaction: Reaction; dH_rxn_STD: CustomProp }): CustomProp | null {
  const rxnObj = rxn(opts.reaction);
  return rxnObj.dlnK_dInvT(opts.dH_rxn_STD);
}

export function equilibrium_temperature_K1(opts: {
  reaction: Reaction;
  dG_rxn_STD_func: (temperature: Temperature) => CustomProp | null;
  temperature_bounds: { low: Temperature; high: Temperature };
  options?: { maxIterations?: number; tolerance?: number };
}): Temperature | null {
  const rxnObj = rxn(opts.reaction);
  return rxnObj.equilibrium_temperature_K1(opts.dG_rxn_STD_func, opts.temperature_bounds, opts.options);
}
