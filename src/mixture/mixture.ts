// import libs
import { PRESSURE_REF_Pa, R_CONST_J__molK, TEMPERATURE_REF_K } from '@/types/constants';
import { Component, CustomProp, Temperature } from '@/types/models';
import { ensureEnergy, ensureEntropy, ensureKelvin } from '@/utils/conversions';
import { toMassBasis } from '@/utils/tools';

export class MIXTURE {
    private readonly R = R_CONST_J__molK;
    private readonly T_ref = TEMPERATURE_REF_K;

    // NOTE: mole fraction
    moleFractionComp: Record<string, number>;

    constructor(
        private readonly components: Component[],
    ) {
        // ! calculate mole fractions for components, normalizing if necessary
        this.calculateMoleFractions();
        // ! mole fractions
        this.moleFractionComp = this.getMoleFractionObj();
    }

    // SECTION: Private helper methods
    // NOTE: This method normalizes mole fractions if they are provided, or sets them to 0 if not provided.
    private calculateMoleFractions(): void {
        const totalMoles = this.components.reduce((sum, comp) => sum + (comp.moleFraction || 0), 0);
        this.components.forEach(comp => {
            if (comp.moleFraction === undefined) {
                comp.moleFraction = 0; // default to 0 if not provided
            } else if (totalMoles > 0) {
                comp.moleFraction /= totalMoles; // normalize to get mole fraction
            } else {
                comp.moleFraction = 0;
            }
        });
    }

    // NOTE: Get mole fraction of a component by name, returns 0 if not found or not defined
    private getMoleFraction(componentName: string): number {
        const component = this.components.find(comp => comp.name === componentName);
        return component?.moleFraction || 0;
    }

    private getMoleFractionObj(): Record<string, number> {
        const moleFractionObj: Record<string, number> = {};
        this.components.forEach(comp => {
            moleFractionObj[comp.name] = comp.moleFraction || 0;
        });
        return moleFractionObj;
    }

    private getComponentKeyCandidates(component: Component): string[] {
        const keys = [component.name, component.formula, component.formulaRaw].filter(
            (key): key is string => Boolean(key && key.trim())
        );
        return keys;
    }

    private getComponentProp<T>(props: Record<string, T>, component: Component): T | null {
        const keys = this.getComponentKeyCandidates(component);
        for (const key of keys) {
            if (key in props) {
                return props[key];
            }
        }
        return null;
    }

    private getComponentMW(component: Component, MW_i: Record<string, number>): number | null {
        const keys = this.getComponentKeyCandidates(component);
        for (const key of keys) {
            const mw = MW_i[key];
            if (typeof mw === 'number' && Number.isFinite(mw) && mw > 0) {
                return mw;
            }
        }
        if (typeof component.molecularWeight === 'number' && component.molecularWeight > 0) {
            return component.molecularWeight;
        }
        return null;
    }

    private calculateMixtureMolecularWeight(MW_i: Record<string, number>): number | null {
        let MW_mix = 0;
        for (const component of this.components) {
            const y = component.moleFraction || 0;
            if (y <= 0) continue;
            const mw = this.getComponentMW(component, MW_i);
            if (!mw) {
                return null;
            }
            MW_mix += y * mw;
        }
        return MW_mix > 0 ? MW_mix : null;
    }

    // SECTION: Calculate mixture properties
    calculateMixtureEnthalpy(
        H_i_IG: Record<string, CustomProp>,
        MW_i: Record<string, number>,
        basis: 'mole' | 'mass' = 'mole'
    ): CustomProp | null {
        try {
            let H_mix = 0;

            for (const component of this.components) {
                const y = component.moleFraction || 0;
                if (y === 0) continue;

                const prop = this.getComponentProp(H_i_IG, component);
                if (!prop) {
                    throw new Error(`Missing enthalpy for component '${component.name}'.`);
                }

                const { value } = ensureEnergy(prop);
                H_mix += y * value;
            }

            const result: CustomProp = { value: H_mix, unit: 'J/mol' };

            if (basis === 'mass') {
                const MW_mix = this.calculateMixtureMolecularWeight(MW_i);
                if (!MW_mix) return null;
                return toMassBasis(result, MW_mix);
            }

            return result;
        } catch {
            return null;
        }
    }

    calculateMixtureEntropy(
        S_i_IG: Record<string, CustomProp>,
        MW_i: Record<string, number>,
        basis: 'mole' | 'mass' = 'mole',
        pressure_Pa: number = PRESSURE_REF_Pa
    ): CustomProp | null {
        try {
            let S_mix = 0;
            let mixingTerm = 0;

            for (const component of this.components) {
                const y = component.moleFraction || 0;
                if (y === 0) continue;

                const prop = this.getComponentProp(S_i_IG, component);
                if (!prop) {
                    throw new Error(`Missing entropy for component '${component.name}'.`);
                }

                const { value } = ensureEntropy(prop);
                S_mix += y * value;

                if (y > 0) {
                    mixingTerm += y * Math.log(y);
                }
            }

            S_mix -= this.R * mixingTerm;
            if (pressure_Pa > 0) {
                S_mix -= this.R * Math.log(pressure_Pa / PRESSURE_REF_Pa);
            }

            const result: CustomProp = { value: S_mix, unit: 'J/mol.K' };

            if (basis === 'mass') {
                const MW_mix = this.calculateMixtureMolecularWeight(MW_i);
                if (!MW_mix) return null;
                return toMassBasis(result, MW_mix);
            }

            return result;
        } catch {
            return null;
        }
    }

    calculateMixtureHeatCapacity(
        Cp_i_IG: Record<string, CustomProp>,
        MW_i: Record<string, number>,
        basis: 'mole' | 'mass' = 'mole'
    ): CustomProp | null {
        try {
            let Cp_mix = 0;

            for (const component of this.components) {
                const y = component.moleFraction || 0;
                if (y === 0) continue;

                const prop = this.getComponentProp(Cp_i_IG, component);
                if (!prop) {
                    throw new Error(`Missing heat capacity for component '${component.name}'.`);
                }

                const { value } = ensureEntropy(prop);
                Cp_mix += y * value;
            }

            const result: CustomProp = { value: Cp_mix, unit: 'J/mol.K' };

            if (basis === 'mass') {
                const MW_mix = this.calculateMixtureMolecularWeight(MW_i);
                if (!MW_mix) return null;
                return toMassBasis(result, MW_mix);
            }

            return result;
        } catch {
            return null;
        }
    }

    // SECTION: Calculate mixture Gibbs free energy
    calculateMixtureGibbsEnergy(
        G_i_IG: Record<string, CustomProp>,
        MW_i: Record<string, number>,
        basis: 'mole' | 'mass' = 'mole',
        temperature: Temperature = { value: this.T_ref, unit: 'K' },
        pressure_Pa: number = PRESSURE_REF_Pa
    ): CustomProp | null {
        try {
            let G_mix = 0;
            let mixingTerm = 0;
            const T = ensureKelvin(temperature);

            for (const component of this.components) {
                const y = component.moleFraction || 0;
                if (y === 0) continue;

                const prop = this.getComponentProp(G_i_IG, component);
                if (!prop) {
                    throw new Error(`Missing Gibbs energy for component '${component.name}'.`);
                }

                const { value } = ensureEnergy(prop);
                G_mix += y * value;

                if (y > 0) {
                    mixingTerm += y * Math.log(y);
                }
            }

            const lnP = pressure_Pa > 0 ? Math.log(pressure_Pa / PRESSURE_REF_Pa) : 0;
            G_mix += this.R * T * (mixingTerm + lnP);

            const result: CustomProp = { value: G_mix, unit: 'J/mol' };

            if (basis === 'mass') {
                const MW_mix = this.calculateMixtureMolecularWeight(MW_i);
                if (!MW_mix) return null;
                return toMassBasis(result, MW_mix);
            }

            return result;
        } catch {
            return null;
        }
    }

    // SECTION: Chemical potential calculations
    calculateChemicalPotential(
        G_i_IG: Record<string, CustomProp>,
        MW_i: Record<string, number>,
        basis: 'mole' | 'mass' = 'mole',
        temperature: Temperature = { value: this.T_ref, unit: 'K' },
        pressure_Pa: number = PRESSURE_REF_Pa
    ): Record<string, CustomProp> | null {
        try {
            const potentials: Record<string, CustomProp> = {};
            const T = ensureKelvin(temperature);
            const lnP = pressure_Pa > 0 ? Math.log(pressure_Pa / PRESSURE_REF_Pa) : 0;

            for (const component of this.components) {
                const y = component.moleFraction || 0;
                const prop = this.getComponentProp(G_i_IG, component);
                if (!prop) {
                    throw new Error(`Missing Gibbs energy for component '${component.name}'.`);
                }

                const { value } = ensureEnergy(prop);
                const lnY = y > 0 ? Math.log(y) : 0;
                const mu_value = value + this.R * T * (lnY + lnP);
                let mu: CustomProp = { value: mu_value, unit: 'J/mol' };

                if (basis === 'mass') {
                    const mw = this.getComponentMW(component, MW_i);
                    if (!mw) {
                        throw new Error(`Missing molecular weight for component '${component.name}'.`);
                    }
                    mu = toMassBasis(mu, mw);
                }

                potentials[component.name] = mu;
            }

            return Object.keys(potentials).length ? potentials : null;
        } catch {
            return null;
        }
    }
}
