// Quick sanity check that the locally installed mozithermocalcdb-nasa.tgz works.
// Uses a tiny in-memory ModelSource with made-up NASA9 coefficients.
const { H_T, S_T, G_T, Cp_T } = require('mozithermocalcdb-nasa');

// Component metadata and polynomial coefficients (values are illustrative only).
const demoComponent = { name: 'DemoGas', formula: 'DG', state: 'g' };
const demoCoeffs = {
    Name: 'DemoGas',
    Formula: 'DG',
    State: 'g',
    formula_raw: 'DG',
    phase_flag: 1,
    MW: 28.97,
    EnFo_IG: 0,
    dEnFo_IG_298: 0,
    Tmin: 200,
    Tmax: 1000,
    a1: 3.5,
    a2: 0.001,
    a3: -5e-7,
    a4: 2e-10,
    a5: -1e-13,
    a6: -1,
    a7: 0.5,
    b1: 120,
    b2: 0
};

// ModelSource uses the "Name-Formula" key by default in the library.
const model_source = {
    [`${demoComponent.name}-${demoComponent.formula}`]: {
        nasa9_200_1000_K: demoCoeffs
    }
};

const T = { value: 500, unit: 'K' };

console.log('H(T=500K):', H_T({ component: demoComponent, temperature: T, model_source }));
console.log('S(T=500K):', S_T({ component: demoComponent, temperature: T, model_source }));
console.log('G(T=500K):', G_T({ component: demoComponent, temperature: T, model_source }));
console.log('Cp(T=500K):', Cp_T({ component: demoComponent, temperature: T, model_source }));
