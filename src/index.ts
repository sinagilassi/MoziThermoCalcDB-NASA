// Types (avoid name collision with core Source)
export * from './types/constants';
export * from './types/models';
export type {
    ComponentEquationSource,
    CompoundTemperatureRanges,
    ModelSource,
    TemperatureRangeData,
    Reaction,
    Source as SourceSpec
} from './types/external';

// Utils
export * from './utils';

// Core classes
export * from './core/HSG';
export * from './core/HSGs';
export * from './core/DataExtractor';
export { Source } from './core/Source';

// Thermo
export * from './thermo';

// Reactions (avoid Keq conflict with app helper)
export * from './reactions/RXNAdapter';
export * from './reactions/RXNAnalyzer';
export * from './reactions/RXN';
export { Keq, Keq_vh, Keq_vh_shortcut } from './reactions/source';
export { _Keq, _Keq_VH_Shortcut } from './reactions/reactions';

// App-level helpers (alias Keq to avoid clash)
export {
    H_T,
    S_T,
    G_T,
    Cp_T,
    dG_rxn_STD,
    dS_rxn_STD,
    dH_rxn_STD,
    Keq as Keq_app,
    Keq_vh_shortcut as Keq_vh_shortcut_app
} from './app';
