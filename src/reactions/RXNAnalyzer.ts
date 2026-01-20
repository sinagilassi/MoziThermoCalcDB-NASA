import { Component } from '@/types/models';
import { Reaction } from '@/types/external';
import { PRESSURE_REF_Pa, R_CONST_J__molK, TEMPERATURE_REF_K } from '@/types/constants';

export type ReactionMode = '<=>' | '=>' | '=';
export type PhaseRule = 'gas' | 'liquid' | 'aqueous' | 'solid';

export interface ReactionArgs {
    name: string;
    reaction: string;
    components?: Component[] | null;
    reaction_mode_symbol?: ReactionMode;
    phase_rule?: string | null;
}

export interface Reactant {
    coefficient: number;
    molecule: string;
    state: string;
    molecule_state: string;
}

export interface Product {
    coefficient: number;
    molecule: string;
    state: string;
    molecule_state: string;
}

export interface ReactionAnalysis {
    name: string;
    reaction: string;
    component_ids: Record<string, number>;
    all_components: string[];
    symbolic_reaction: string;
    symbolic_unbalanced_reaction: string;
    reactants: Reactant[];
    reactants_names: string[];
    products: Product[];
    products_names: string[];
    reaction_coefficients: number;
    reaction_stoichiometry: Record<string, number>;
    reaction_stoichiometry_matrix: number[];
    carbon_count: Record<string, number>;
    reaction_state: Record<string, string>;
    reaction_phase: string;
    state_count: Record<string, number>;
    components: Component[];
    map_components: Record<string, Component>;
    component_checker: boolean;
}

/**
 * ! Main class to analyze chemical reactions.
 */
export class ChemReact {
    private _system_inputs: Record<string, unknown> | null = null;
    readonly R = R_CONST_J__molK;
    readonly T_Ref = TEMPERATURE_REF_K;
    readonly P_Ref = PRESSURE_REF_Pa / 1e5;
    private readonly available_phases: PhaseRule[] = ['gas', 'liquid', 'aqueous', 'solid'];
    private readonly _id_separator = '-';
    private _component_checker = false;

    readonly reaction_mode_symbol: ReactionMode;
    readonly components: Component[] | null | undefined;
    readonly component_ids: string[];

    // NOTE: constructor
    constructor(reaction_mode_symbol: ReactionMode, components?: Component[] | null) {
        this.reaction_mode_symbol = reaction_mode_symbol;
        this.components = components ?? null;
        this.component_ids = components
            ? components.map((comp) => `${comp.formula}${this._id_separator}${comp.state}`)
            : [];
    }

    get system_inputs(): Record<string, unknown> {
        if (this._system_inputs === null) {
            throw new Error('System inputs are not set.');
        }
        return this._system_inputs;
    }

    count_carbon(molecule: string, coefficient: number): number {
        if (typeof molecule !== 'string') {
            throw new Error('Molecule must be a string.');
        }
        if (typeof coefficient !== 'number') {
            throw new Error('Coefficient must be a number.');
        }

        if (/[C](?![a-z])/.test(molecule)) {
            const carbonCount = (molecule.match(/C(?![a-z])/g) ?? []).length;
            return carbonCount * coefficient;
        }
        return 0;
    }

    phase_rule_analysis(phase_rule?: string | null): string {
        if (phase_rule === null || phase_rule === undefined || phase_rule === 'None') {
            return 'empty';
        }
        if (!this.available_phases.includes(phase_rule as PhaseRule)) {
            throw new Error(`Phase rule must be ${this.available_phases.join(', ')}.`);
        }
        switch (phase_rule) {
            case 'gas':
                return 'g';
            case 'liquid':
                return 'l';
            case 'aqueous':
                return 'aq';
            case 'solid':
                return 's';
            default:
                return 'empty';
        }
    }

    analyze_reaction(reaction_pack: { reaction: string; name: string }, phase_rule?: string | null): ReactionAnalysis {
        if (typeof reaction_pack !== 'object' || reaction_pack === null) {
            throw new Error('reaction_pack must be a dictionary.');
        }
        if (!('reaction' in reaction_pack) || !('name' in reaction_pack)) {
            throw new Error("reaction_pack must contain 'reaction' and 'name' keys.");
        }

        const phase_set = this.phase_rule_analysis(phase_rule);

        const reactionStr = reaction_pack.reaction;
        const name = reaction_pack.name;
        const sides = reactionStr.split(this.reaction_mode_symbol.trim());

        const pattern =
            /(?:(\d*\.?\d+)\s*)?(e(?:\{-?1?\}|[+-])?|\[[^\]\s]+\](?:\d+)?(?:\{[^{}\s]+\})?|(?:(?:\((?!(?:g|l|s|aq)\))[A-Za-z0-9]+\)\d*)*[A-Z][A-Za-z0-9]*(?:\((?!(?:g|l|s|aq)\))[A-Za-z0-9]+\)\d*)*)(?:[Aú*](?:\d+)?(?:(?:\((?!(?:g|l|s|aq)\))[A-Za-z0-9]+\)\d*)*[A-Z][A-Za-z0-9]*(?:\((?!(?:g|l|s|aq)\))[A-Za-z0-9]+\)\d*)*))*(?:\{[^{}\s]+\})?)\s*(?:\((g|l|s|aq)\))?/g;

        const reactants_raw = Array.from(sides[0].matchAll(pattern));
        const reactants: Reactant[] = reactants_raw.map((r) => ({
            coefficient: r[1] ? parseFloat(r[1]) : 1,
            molecule: r[2],
            state: r[3] ? r[3] : phase_set,
            molecule_state: ''
        }));

        const reactants_names: string[] = [];
        reactants.forEach((item, idx) => {
            if (phase_rule === undefined || phase_rule === null) {
                if (item.state === 'empty') {
                    throw new Error(`Phase rule is empty but reactant '${item.molecule}' has state '${item.state}'.`);
                }
            } else if (item.state !== phase_set) {
                throw new Error(`Phase rule is '${phase_set}' but reactant '${item.molecule}' has state '${item.state}'.`);
            }
            const full_name = `${item.molecule}-${item.state}`;
            reactants_names.push(full_name);
            reactants[idx].molecule_state = full_name;
        });

        const products_raw = Array.from(sides[1].matchAll(pattern));
        const products: Product[] = products_raw.map((p) => ({
            coefficient: p[1] ? parseFloat(p[1]) : 1,
            molecule: p[2],
            state: p[3] ? p[3] : phase_set,
            molecule_state: ''
        }));

        const products_names: string[] = [];
        products.forEach((item, idx) => {
            if (phase_rule === undefined || phase_rule === null) {
                if (item.state === 'empty') {
                    throw new Error(`Phase rule is empty but product '${item.molecule}' has state '${item.state}'.`);
                }
            } else if (item.state !== phase_set) {
                throw new Error(`Phase rule is '${phase_set}' but product '${item.molecule}' has state '${item.state}'.`);
            }
            const full_name = `${item.molecule}-${item.state}`;
            products_names.push(full_name);
            products[idx].molecule_state = full_name;
        });

        const all_components = Array.from(new Set([...reactants_names, ...products_names]));

        let reaction_coefficients = 0;
        const reaction_stoichiometry: Record<string, number> = {};
        const reaction_stoichiometry_matrix: number[] = [];

        for (const item of reactants) {
            reaction_coefficients += item.coefficient;
            reaction_stoichiometry[item.molecule_state] = -1 * item.coefficient;
            reaction_stoichiometry_matrix.push(-1 * item.coefficient);
        }
        for (const item of products) {
            reaction_coefficients -= item.coefficient;
            reaction_stoichiometry[item.molecule_state] = item.coefficient;
            reaction_stoichiometry_matrix.push(item.coefficient);
        }

        const carbon_count: Record<string, number> = {};
        for (const r of reactants) {
            carbon_count[r.molecule_state] = this.count_carbon(r.molecule, r.coefficient);
        }
        for (const p of products) {
            carbon_count[p.molecule_state] = this.count_carbon(p.molecule, p.coefficient);
        }

        const reaction_state: Record<string, string> = {};
        for (const r of reactants) {
            reaction_state[r.molecule_state] = r.state;
        }
        for (const p of products) {
            reaction_state[p.molecule_state] = p.state;
        }

        const reaction_phase = this.determine_reaction_phase(reaction_state);
        const state_count = this.count_reaction_states(reaction_state);

        let symbolic_reaction = '';
        let symbolic_unbalanced_reaction = '';

        reactants.forEach((r, idx) => {
            if (idx === 0) {
                symbolic_reaction += r.coefficient === 1 ? `${r.molecule}` : `${r.coefficient}${r.molecule}`;
                symbolic_unbalanced_reaction += `${r.molecule}`;
            } else {
                symbolic_reaction += r.coefficient === 1 ? ` + ${r.molecule}` : ` + ${r.coefficient}${r.molecule}`;
                symbolic_unbalanced_reaction += ` + ${r.molecule}`;
            }
        });
        symbolic_reaction += ` ${this.reaction_mode_symbol} `;
        symbolic_unbalanced_reaction += ` ${this.reaction_mode_symbol} `;

        products.forEach((p, idx) => {
            if (idx === 0) {
                symbolic_reaction += p.coefficient === 1 ? `${p.molecule}` : `${p.coefficient}${p.molecule}`;
                symbolic_unbalanced_reaction += `${p.molecule}`;
            } else {
                symbolic_reaction += p.coefficient === 1 ? ` + ${p.molecule}` : ` + ${p.coefficient}${p.molecule}`;
                symbolic_unbalanced_reaction += ` + ${p.molecule}`;
            }
        });

        const component_ids: Record<string, number> = {};
        reactants.forEach((r, idx) => {
            component_ids[r.molecule_state] = idx + 1;
        });
        const offset = reactants.length;
        products.forEach((p, idx) => {
            component_ids[p.molecule_state] = offset + idx + 1;
        });

        const components = this.collect_components(reactants, products);
        const map_components = this.map_components(reactants, products);

        return {
            name,
            reaction: reactionStr,
            component_ids,
            all_components,
            symbolic_reaction,
            symbolic_unbalanced_reaction,
            reactants,
            reactants_names,
            products,
            products_names,
            reaction_coefficients,
            reaction_stoichiometry,
            reaction_stoichiometry_matrix,
            carbon_count,
            reaction_state,
            reaction_phase,
            state_count,
            components,
            map_components,
            component_checker: this._component_checker
        };
    }

    analyze_overall_reactions(reactions: Array<{ reaction: string; name: string }>): {
        consumed: string[];
        produced: string[];
        intermediate: string[];
    } {
        const all_reactants = new Set<string>();
        const all_products = new Set<string>();

        const pattern = /(?:(\d*\.?\d+)\s*)?([A-Z][a-zA-Z0-9]*)\s*(?:\((\w)\))?/g;

        for (const reaction of reactions) {
            const sides = reaction.reaction.split(this.reaction_mode_symbol.trim());
            const reactants = Array.from(sides[0].matchAll(pattern)).map((r) => r[2]);
            const products = Array.from(sides[1].matchAll(pattern)).map((p) => p[2]);
            reactants.forEach((r) => all_reactants.add(r));
            products.forEach((p) => all_products.add(p));
        }

        const consumed = [...all_reactants].filter((r) => !all_products.has(r));
        const produced = [...all_products].filter((p) => !all_reactants.has(p));
        const intermediate = [...all_reactants].filter((r) => all_products.has(r));

        return { consumed, produced, intermediate };
    }

    analyze_overall_reactions_v2(reactions: Record<string, ReactionAnalysis>): {
        consumed: string[];
        produced: string[];
        intermediate: string[];
    } {
        const all_reactants = new Set<string>();
        const all_products = new Set<string>();

        for (const reaction_name in reactions) {
            const value = reactions[reaction_name];
            value.reactants_names.forEach((r) => all_reactants.add(r));
            value.products_names.forEach((p) => all_products.add(p));
        }

        const consumed = [...all_reactants].filter((r) => !all_products.has(r));
        const produced = [...all_products].filter((p) => !all_reactants.has(p));
        const intermediate = [...all_reactants].filter((r) => all_products.has(r));

        return { consumed, produced, intermediate };
    }

    define_component_id(reaction_res: Record<string, ReactionAnalysis>) {
        const component_list: string[] = [];

        for (const item in reaction_res) {
            reaction_res[item].reactants.forEach((r) => component_list.push(r.molecule));
            reaction_res[item].products.forEach((p) => component_list.push(p.molecule));
        }

        const unique_components = Array.from(new Set(component_list));

        const component_dict: Record<string, number> = {};
        unique_components.forEach((item, idx) => {
            component_dict[item] = idx;
        });

        const comp_list = Array.from({ length: Object.keys(reaction_res).length }, () =>
            Object.fromEntries(unique_components.map((c) => [c, 0])) as Record<string, number>
        );

        const reactionNames = Object.keys(reaction_res);
        reactionNames.forEach((reactionName, j) => {
            const reaction = reaction_res[reactionName];
            unique_components.forEach((item) => {
                reaction.reactants.forEach((reactant) => {
                    if (reactant.molecule === item) {
                        comp_list[j][item] = -1 * reactant.coefficient;
                    }
                });
                reaction.products.forEach((product) => {
                    if (product.molecule === item) {
                        comp_list[j][item] = product.coefficient;
                    }
                });
            });
        });

        const comp_coeff = comp_list.map((row) => unique_components.map((item) => row[item]));

        return { component_list: unique_components, component_dict, comp_list, comp_coeff };
    }

    define_component_id_v2(reaction_res: Record<string, ReactionAnalysis>) {
        const component_list: string[] = [];
        const component_state_list: Array<[string, string, string]> = [];

        for (const item in reaction_res) {
            reaction_res[item].reactants.forEach((r) => {
                component_list.push(r.molecule_state);
                component_state_list.push([r.molecule, r.state, r.molecule_state]);
            });
            reaction_res[item].products.forEach((p) => {
                component_list.push(p.molecule_state);
                component_state_list.push([p.molecule, p.state, p.molecule_state]);
            });
        }

        const unique_components = Array.from(new Set(component_list));
        const unique_component_states = Array.from(new Set(component_state_list.map((t) => t.join('|')))).map((s) => {
            const [molecule, state, molecule_state] = s.split('|');
            return [molecule, state, molecule_state] as [string, string, string];
        });

        const component_dict: Record<string, number> = {};
        unique_components.forEach((item, idx) => {
            component_dict[item] = idx;
        });

        const comp_list = Array.from({ length: Object.keys(reaction_res).length }, () =>
            Object.fromEntries(unique_components.map((c) => [c, 0])) as Record<string, number>
        );

        const reactionNames = Object.keys(reaction_res);
        reactionNames.forEach((reactionName, j) => {
            const reaction = reaction_res[reactionName];
            unique_components.forEach((item) => {
                reaction.reactants.forEach((reactant) => {
                    if (reactant.molecule_state === item) {
                        comp_list[j][item] = -1 * reactant.coefficient;
                    }
                });
                reaction.products.forEach((product) => {
                    if (product.molecule_state === item) {
                        comp_list[j][item] = product.coefficient;
                    }
                });
            });
        });

        const comp_coeff = comp_list.map((row) => unique_components.map((item) => row[item]));

        return {
            component_list: unique_components,
            component_dict,
            comp_list,
            comp_coeff,
            component_state_list: unique_component_states
        };
    }

    state_name_set(state_set: Set<string>): string[] {
        const state_dict: Record<string, string> = {
            g: 'gas',
            l: 'liquid',
            aq: 'aqueous',
            s: 'solid'
        };
        return Array.from(state_set).map((state) => state_dict[state]);
    }

    determine_reaction_phase(reaction_dict: Record<string, string>): string {
        const available_states = new Set(Object.values(reaction_dict));
        const state_names = this.state_name_set(available_states);
        if (state_names.length === 1) {
            return state_names[0];
        }
        return state_names.join('-');
    }

    count_reaction_states(reaction_dict: Record<string, string>): Record<string, number> {
        const state_count: Record<string, number> = { g: 0, l: 0, aq: 0, s: 0 };
        Object.values(reaction_dict).forEach((state) => {
            if (state in state_count) {
                state_count[state] += 1;
            }
        });
        return state_count;
    }

    reaction_phase_analysis(reaction_res: Record<string, ReactionAnalysis>) {
        const phase_dict: Record<'g' | 'l' | 'aq' | 's', string[]> = {
            g: [],
            l: [],
            aq: [],
            s: []
        };

        for (const reaction_name in reaction_res) {
            const reaction_data = reaction_res[reaction_name];
            reaction_data.reactants.forEach((r) => {
                const phase = r.state as keyof typeof phase_dict;
                if (!phase_dict[phase]) throw new Error(`Unknown phase '${phase}' for reactant '${r.molecule}'.`);
                phase_dict[phase].push(r.molecule_state);
            });
            reaction_data.products.forEach((p) => {
                const phase = p.state as keyof typeof phase_dict;
                if (!phase_dict[phase]) throw new Error(`Unknown phase '${phase}' for product '${p.molecule}'.`);
                phase_dict[phase].push(p.molecule_state);
            });
        }

        (Object.keys(phase_dict) as Array<keyof typeof phase_dict>).forEach((phase) => {
            phase_dict[phase] = Array.from(new Set(phase_dict[phase]));
        });

        return phase_dict;
    }

    collect_components(reactants: Reactant[], products: Product[]): Component[] {
        const components: Component[] = [];
        const components_ids_: string[] = [];

        if (!this.components) {
            return components;
        }

        const reaction_participants = [...reactants, ...products];
        const reaction_participants_num = reaction_participants.length;

        for (const item of reaction_participants) {
            const component_id_ = item.molecule_state;
            if (this.component_ids.includes(component_id_) && !components_ids_.includes(component_id_)) {
                components_ids_.push(component_id_);
                const index = this.component_ids.indexOf(component_id_);
                const component = this.components[index];
                components.push(component);
            }
        }

        this._component_checker = components.length === reaction_participants_num;
        return components;
    }

    map_components(reactants: Reactant[], products: Product[]): Record<string, Component> {
        const component_map: Record<string, Component> = {};
        if (!this.components) {
            return component_map;
        }
        const reaction_participants = [...reactants, ...products];
        for (const item of reaction_participants) {
            const component_id_ = item.molecule_state;
            if (this.component_ids.includes(component_id_) && !(component_id_ in component_map)) {
                const index = this.component_ids.indexOf(component_id_);
                const component = this.components[index];
                component_map[component_id_] = component;
            }
        }
        return component_map;
    }
}

export function analyzeReaction(opts: ReactionArgs): ReactionAnalysis {
    const { name, reaction, components = null, phase_rule = null } = opts;
    let reaction_mode_symbol = opts.reaction_mode_symbol;

    if (!reaction_mode_symbol) {
        if (reaction.includes('<=>')) {
            reaction_mode_symbol = '<=>';
        } else if (reaction.includes('=>')) {
            reaction_mode_symbol = '=>';
        } else if (reaction.includes('=')) {
            reaction_mode_symbol = '=';
        } else {
            throw new Error(`Invalid reaction format in reaction: ${reaction}`);
        }
    }

    const util = new ChemReact(reaction_mode_symbol, components ?? undefined);
    return util.analyze_reaction({ name, reaction }, phase_rule);
}

/**
 * Convenience helper to analyze a Reaction spec directly.
 */
export function analyzeReactionFromReaction(reaction: Reaction): ReactionAnalysis {
    return analyzeReaction({
        name: reaction.name,
        reaction: reaction.reaction,
        components: reaction.components ?? null,
        reaction_mode_symbol: reaction.reaction_mode_symbol,
        phase_rule: reaction.phase_rule ?? null
    });
}
