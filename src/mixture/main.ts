// import libs
import { MIXTURE } from '@/mixture/MIXTURE';
import { Component, CustomProp } from '@/types';

// SECTION: Mixture Enthalpy
export function calculateMixtureEnthalpy(
    components: Component[],
    H_i_IG: Record<string, CustomProp>,
    MW_i: Record<string, number>,
    basis: 'mole' | 'mass' = 'mole'
): CustomProp | null {
    try {
        // NOTE: init mixture
        const mixture = new MIXTURE(components);

        // NOTE: calculate mixture enthalpy
        return mixture.calculateMixtureEnthalpy(
            H_i_IG,
            MW_i,
            basis
        );
    } catch (error) {
        console.error('Error calculating mixture enthalpy:', error);
        return null;
    }
}

// SECTION: Mixture Entropy
export function calculateMixtureEntropy(
    components: Component[],
    S_i_IG: Record<string, CustomProp>,
    MW_i: Record<string, number>,
    basis: 'mole' | 'mass' = 'mole'
): CustomProp | null {
    try {
        // NOTE: init mixture
        const mixture = new MIXTURE(components);

        // NOTE: calculate mixture entropy
        return mixture.calculateMixtureEntropy(
            S_i_IG,
            MW_i,
            basis
        );
    } catch (error) {
        console.error('Error calculating mixture entropy:', error);
        return null;
    }
}

// SECTION: Mixture Gibbs Free Energy
export function calculateMixtureGibbsFreeEnergy(
    components: Component[],
    G_i_IG: Record<string, CustomProp>,
    MW_i: Record<string, number>,
    basis: 'mole' | 'mass' = 'mole'
): CustomProp | null {
    try {
        // NOTE: init mixture
        const mixture = new MIXTURE(components);

        // NOTE: calculate mixture Gibbs free energy
        return mixture.calculateMixtureGibbsEnergy(
            G_i_IG,
            MW_i,
            basis
        );
    } catch (error) {
        console.error('Error calculating mixture Gibbs free energy:', error);
        return null;
    }
}

// SECTION: Mixture Heat Capacity
export function calculateMixtureHeatCapacity(
    components: Component[],
    Cp_i_IG: Record<string, CustomProp>,
    MW_i: Record<string, number>,
    basis: 'mole' | 'mass' = 'mole'
): CustomProp | null {
    try {
        // NOTE: init mixture
        const mixture = new MIXTURE(components);

        // NOTE: calculate mixture heat capacity
        return mixture.calculateMixtureHeatCapacity(
            Cp_i_IG,
            MW_i,
            basis
        );
    } catch (error) {
        console.error('Error calculating mixture heat capacity:', error);
        return null;
    }
}

// SECTION: Chemical Potential
export function calculateChemicalPotential(
    components: Component[],
    G_i_IG: Record<string, CustomProp>,
    MW_i: Record<string, number>,
    basis: 'mole' | 'mass' = 'mole'
): Record<string, CustomProp> | null {
    try {
        // NOTE: init mixture
        const mixture = new MIXTURE(components);

        // NOTE: calculate chemical potential
        return mixture.calculateChemicalPotential(
            G_i_IG,
            MW_i,
            basis
        );
    } catch (error) {
        console.error('Error calculating chemical potential:', error);
        return null;
    }
}

// SECTION: All mixture properties at once
export function calculateAllMixtureProperties(
    components: Component[],
    H_i_IG: Record<string, CustomProp>,
    S_i_IG: Record<string, CustomProp>,
    G_i_IG: Record<string, CustomProp>,
    Cp_i_IG: Record<string, CustomProp>,
    MW_i: Record<string, number>,
    basis: 'mole' | 'mass' = 'mole'
): {
    enthalpy: CustomProp | null;
    entropy: CustomProp | null;
    gibbsEnergy: CustomProp | null;
    heatCapacity: CustomProp | null;
    chemicalPotential: Record<string, CustomProp> | null;
} {
    try {
        // NOTE: init mixture
        const mixture = new MIXTURE(components);

        // NOTE: calculate all mixture properties
        return {
            enthalpy: mixture.calculateMixtureEnthalpy(H_i_IG, MW_i, basis),
            entropy: mixture.calculateMixtureEntropy(S_i_IG, MW_i, basis),
            gibbsEnergy: mixture.calculateMixtureGibbsEnergy(G_i_IG, MW_i, basis),
            heatCapacity: mixture.calculateMixtureHeatCapacity(Cp_i_IG, MW_i, basis),
            chemicalPotential: mixture.calculateChemicalPotential(G_i_IG, MW_i, basis)
        };
    } catch (error) {
        console.error('Error calculating all mixture properties:', error);
        return {
            enthalpy: null,
            entropy: null,
            gibbsEnergy: null,
            heatCapacity: null,
            chemicalPotential: null
        };
    }
}
