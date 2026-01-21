// .tmp/pkg-test/reactions.js
// Run with: node reactions.js
const { dH_rxn_STD, dS_rxn_STD, dG_rxn_STD, Keq_app, Keq_vh_shortcut_app } = require('mozithermocalcdb-nasa');

// Component definitions
const hydrogen = { name: 'dihydrogen', formula: 'H2', state: 'g' };
const oxygen = { name: 'dioxygen', formula: 'O2', state: 'g' };
const water = { name: 'dihydrogen monoxide', formula: 'H2O', state: 'g' };
const methane = { name: 'methane', formula: 'CH4', state: 'g' };
const carbon_dioxide = { name: 'carbon dioxide', formula: 'CO2', state: 'g' };

// Helper to build range entries
const nasaRange = (base, overrides) => ({ ...base, ...overrides });

// Base metadata (Name-Formula keys are used below)
const baseData = {
    H2: { Name: 'dihydrogen', Formula: 'H2', State: 'g', formula_raw: 'H   2.00    0.00    0.00    0.00    0.00', phase_flag: 0, MW: 2.01588, EnFo_IG: 0 },
    O2: { Name: 'dioxygen', Formula: 'O2', State: 'g', formula_raw: 'O   2.00    0.00    0.00    0.00    0.00', phase_flag: 0, MW: 31.9988, EnFo_IG: 0 },
    H2O: { Name: 'dihydrogen monoxide', Formula: 'H2O', State: 'g', formula_raw: 'H   2.00O   1.00    0.00    0.00    0.00', phase_flag: 0, MW: 18.01528, EnFo_IG: -241826 },
    CH4: { Name: 'methane', Formula: 'CH4', State: 'g', formula_raw: 'C   1.00H   4.00    0.00    0.00    0.00', phase_flag: 0, MW: 16.04246, EnFo_IG: -74600 },
    CO2: { Name: 'carbon dioxide', Formula: 'CO2', State: 'g', formula_raw: 'C   1.00O   2.00    0.00    0.00    0.00', phase_flag: 0, MW: 44.0095, EnFo_IG: -393510 }
};

// Minimal in-memory ModelSource (Name-Formula keys)
const model_source = {
    'dihydrogen-H2': {
        nasa9_200_1000_K: nasaRange(baseData.H2, { Tmin: 200, Tmax: 1000, dEnFo_IG_298: 8468.102, a1: 40783.2281, a2: -800.918545, a3: 8.21470167, a4: -0.012697144, a5: 1.75e-5, a6: -1.2e-8, a7: 3.37e-12, b1: 2682.48438, b2: -30.4378866 }),
        nasa9_1000_6000_K: nasaRange(baseData.H2, { Tmin: 1000, Tmax: 6000, dEnFo_IG_298: 8468.102, a1: 560812.338, a2: -837.149134, a3: 2.97536304, a4: 0.00125225, a5: -3.74e-7, a6: 5.94e-11, a7: -3.61e-15, b1: 5339.81585, b2: -2.20276405 })
    },
    'dioxygen-O2': {
        nasa9_200_1000_K: nasaRange(baseData.O2, { Tmin: 200, Tmax: 1000, dEnFo_IG_298: 8680.104, a1: -34255.6342, a2: 484.700097, a3: 1.119010961, a4: 0.004293889, a5: -6.84e-7, a6: -2.02e-9, a7: 1.04e-12, b1: -3391.45487, b2: 18.4969947 }),
        nasa9_1000_6000_K: nasaRange(baseData.O2, { Tmin: 1000, Tmax: 6000, dEnFo_IG_298: 8680.104, a1: -1037939.022, a2: 2344.830282, a3: 1.819732036, a4: 0.001267848, a5: -2.19e-7, a6: 2.05e-11, a7: -8.19e-16, b1: -16890.10929, b2: 17.38716506 })
    },
    'dihydrogen monoxide-H2O': {
        nasa9_200_1000_K: nasaRange(baseData.H2O, { Tmin: 200, Tmax: 1000, dEnFo_IG_298: 9904.092, a1: -39479.6083, a2: 575.573102, a3: 0.931782653, a4: 0.007222713, a5: -7.34e-6, a6: 4.96e-9, a7: -1.34e-12, b1: -33039.7431, b2: 17.24205775 }),
        nasa9_1000_6000_K: nasaRange(baseData.H2O, { Tmin: 1000, Tmax: 6000, dEnFo_IG_298: 9904.092, a1: 1034972.096, a2: -2412.698562, a3: 4.64611078, a4: 0.002291998, a5: -6.84e-7, a6: 9.43e-11, a7: -4.82e-15, b1: -13842.86509, b2: -7.97814851 })
    },
    'methane-CH4': {
        nasa9_200_1000_K: nasaRange(baseData.CH4, { Tmin: 200, Tmax: 1000, dEnFo_IG_298: 10016.198, a1: -176654.573, a2: 2785.47782, a3: -12.0193547, a4: 0.039146259, a5: -3.61e-5, a6: 2.02e-8, a7: -4.96e-12, b1: -23310.1156, b2: 89.0107539 }),
        nasa9_1000_6000_K: nasaRange(baseData.CH4, { Tmin: 1000, Tmax: 6000, dEnFo_IG_298: 10016.198, a1: 3746265.7, a2: -13888.5134, a3: 20.5402982, a4: -0.001944197, a5: 4.32e-7, a6: -4.06e-11, a7: 1.64e-15, b1: 75659.8868, b2: -122.2977672 })
    },
    'carbon dioxide-CO2': {
        nasa9_200_1000_K: nasaRange(baseData.CO2, { Tmin: 200, Tmax: 1000, dEnFo_IG_298: 9365.469, a1: 49437.8364, a2: -626.429208, a3: 5.30181336, a4: 0.002503601, a5: -2.12e-7, a6: -7.69e-10, a7: 2.85e-13, b1: -45281.8986, b2: -7.0487901 }),
        nasa9_1000_6000_K: nasaRange(baseData.CO2, { Tmin: 1000, Tmax: 6000, dEnFo_IG_298: 9365.469, a1: 117696.9434, a2: -1788.801467, a3: 8.29154353, a4: -9.22e-5, a5: 4.87e-9, a6: -1.89e-12, a7: 6.33e-16, b1: -39083.4501, b2: -26.52683962 })
    }
};

// Reaction definition (same shape as the TS example)
const combustion = {
    name: 'methane-combustion',
    reaction: 'CH4(g) + 2 O2(g) => CO2(g) + 2 H2O(g)',
    components: [methane, oxygen, carbon_dioxide, water]
};

const T = { value: 1500, unit: 'K' };

console.log('\n=== Methane combustion @ 1500 K ===');
console.log('dH_rxn_STD:', dH_rxn_STD({ reaction: combustion, temperature: T, model_source, component_key: 'Name-Formula' }));
console.log('dS_rxn_STD:', dS_rxn_STD({ reaction: combustion, temperature: T, model_source, component_key: 'Name-Formula' }));
console.log('dG_rxn_STD:', dG_rxn_STD({ reaction: combustion, temperature: T, model_source, component_key: 'Name-Formula' }));
console.log('Keq:', Keq_app({ reaction: combustion, temperature: T, model_source, component_key: 'Name-Formula' }));
console.log("Keq (van't Hoff shortcut):", Keq_vh_shortcut_app({ reaction: combustion, temperature: T, model_source, component_key: 'Name-Formula' }));
