import { CustomProp, Temperature } from '../types/models';
import { Reaction } from '../types/external';
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

export function dG_rxn_STD(opts: { reaction: Reaction; G_i_IG: Record<string, CustomProp> }): CustomProp | null {
  const rxnObj = rxn(opts.reaction);
  return rxnObj.dG_rxn_STD(opts.G_i_IG);
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
