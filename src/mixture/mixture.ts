// import libs
import { R_CONST_J__molK, TEMPERATURE_REF_K } from '@/types/constants';
import { Component, CustomProp } from '@/types/models';

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
            } else {
                comp.moleFraction /= totalMoles; // normalize to get mole fraction
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

    // SECTION: Calculate mixture properties
    calculateMixtureEnthalpy(
        H_i_IG: Record<string, CustomProp>,
        MW_i: Record<string, number>,
        basis: 'mole' | 'mass' = 'mole'
    ): CustomProp | null {
        // Placeholder for mixture enthalpy calculation logic
        return null;
    }

    calculateMixtureEntropy(
        S_i_IG: Record<string, CustomProp>,
        MW_i: Record<string, number>,
        basis: 'mole' | 'mass' = 'mole'
    ): CustomProp | null {
        // Placeholder for mixture entropy calculation logic
        return null;
    }

    calculateMixtureHeatCapacity(
        Cp_i_IG: Record<string, CustomProp>,
        MW_i: Record<string, number>,
        basis: 'mole' | 'mass' = 'mole'
    ): CustomProp | null {
        // Placeholder for mixture heat capacity calculation logic
        return null;
    }

    // SECTION: Calculate mixture Gibbs free energy
    calculateMixtureGibbsEnergy(
        G_i_IG: Record<string, CustomProp>,
        MW_i: Record<string, number>,
        basis: 'mole' | 'mass' = 'mole'
    ): CustomProp | null {
        // Placeholder for mixture Gibbs free energy calculation logic
        return null;
    }

    // SECTION: Chemical potential calculations
    calculateChemicalPotential(
        G_i_IG: Record<string, CustomProp>,
        MW_i: Record<string, number>,
        basis: 'mole' | 'mass' = 'mole'
    ): Record<string, CustomProp> | null {
        // Placeholder for chemical potential calculation logic
        return null;
    }
}