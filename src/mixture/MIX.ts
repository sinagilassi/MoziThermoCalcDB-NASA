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
    /**
     * Calculates the enthalpy of the mixture based on ideal gas properties of the components and their mole fractions.
     * The formula used is: H_mix = sum(y_i * H_i)
     * @param H_i_IG - ideal gas enthalpy of each component, keyed by componentKey
     * @param MW_i - molecular weight of each component, keyed by componentKey
     * @param basis - whether to return the result on a 'mole' or 'mass' basis (default is 'mole')
     * @returns the enthalpy of the mixture as a CustomProp, or null if there was an error (e.g., missing data)
     */
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

    // SECTION: Calculate mixture entropy
    /**
     * Calculates the entropy of the mixture based on ideal gas properties of the components, their mole fractions, and the mixing entropy.
     * The formula used is: S_mix = sum(y_i * S_i) - R * sum(y_i * ln(y_i)) - R * ln(P/P_ref)
     * @param S_i_IG - ideal gas entropy of each component, keyed by componentKey
     * @param MW_i - molecular weight of each component, keyed by componentKey
     * @param basis - whether to return the result on a 'mole' or 'mass' basis (default is 'mole')
     * @param pressure_Pa - pressure in Pascals for the pressure correction term (default is standard pressure, 101325 Pa)
     * @returns the entropy of the mixture as a CustomProp, or null if there was an error (e.g., missing data)
     */
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

    // SECTION: Calculate mixture heat capacity
    /**
     * Calculates the heat capacity of the mixture based on ideal gas properties of the components and their mole fractions.
     * The formula used is: Cp_mix = sum(y_i * Cp_i)
     * @param Cp_i_IG - ideal gas heat capacity of each component, keyed by componentKey
     * @param MW_i - molecular weight of each component, keyed by componentKey
     * @param basis - whether to return the result on a 'mole' or 'mass' basis (default is 'mole')
     * @returns the heat capacity of the mixture as a CustomProp, or null if there was an error (e.g., missing data)
     */
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
    /**
     * Calculates the Gibbs free energy of the mixture based on ideal gas properties of the components, their mole fractions, and the mixing entropy.
     * The formula used is: G_mix = sum(y_i * G_i) + R * T * (sum(y_i * ln(y_i)) + ln(P/P_ref))
     * @param G_i_IG - ideal gas Gibbs energy of each component, keyed by componentKey
     * @param MW_i - molecular weight of each component, keyed by componentKey
     * @param basis - whether to return the result on a 'mole' or 'mass' basis (default is 'mole')
     * @param temperature - temperature for the calculation (default is standard temperature, 298.15 K)
     * @param pressure_Pa - pressure in Pascals for the pressure correction term (default is standard pressure, 101325 Pa)
     * @returns
     */
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
    /**
     * Calculates the chemical potential of each component in the mixture based on ideal gas properties, mole fractions, and pressure.
     * The formula used is: mu_i = G_i + RT ln(y_i) + RT ln(P/P_ref)
     * @param G_i_IG - ideal gas Gibbs energy of each component, keyed by componentKey
     * @param MW_i - molecular weight of each component, keyed by componentKey
     * @param basis - whether to return the result on a 'mole' or 'mass' basis (default is 'mole')
     * @param temperature - temperature for the calculation (default is standard temperature, 298.15 K)
     * @param pressure_Pa - pressure in Pascals for the pressure correction term (default is standard pressure, 101325 Pa)
     * @returns
     */
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

                // SECTION: chemical potential calculation: mu_i = G_i + RT ln(y_i) + RT ln(P/P_ref)
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
