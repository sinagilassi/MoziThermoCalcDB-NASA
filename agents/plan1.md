# Python to TypeScript Conversion Plan
## ThermoCalcDB-NASA Package

---

## 1. Project Overview

### 1.1 Current State
- **Language**: Python
- **Purpose**: NASA polynomial coefficient management and thermodynamic calculations
- **Key Features**:
  - NASA7 and NASA9 polynomial support
  - Three temperature ranges: 200-1000K, 1000-6000K, 6000-20000K
  - Enthalpy, entropy, Gibbs free energy, and heat capacity calculations
  - Reaction thermodynamics (ΔH, ΔS, ΔG, Keq)

### 1.2 Target State
- **Language**: TypeScript
- **Target**: Modern ES2020+ with strict type safety
- **Package Manager**: npm/pnpm
- **Build Tool**: TypeScript compiler (tsc) or Vite

---

## 2. Data Structure Analysis

### 2.1 Input Data Schema
Each compound record contains:
```typescript
interface NASA9CoefficientsRaw {
  name: string;
  formula: string;
  state: string;              // 'g' for gas, 'l' for liquid, 's' for solid
  formula_raw: string;
  phase_flag: number;
  mw: number;                 // Molecular weight (g/mol)
  hf298: number;              // Enthalpy of formation at 298K (J/mol)
  T_low: number;              // Minimum temperature (K)
  T_high: number;             // Maximum temperature (K)
  dh298_0: number;            // ΔH(298-0) (J/mol)
  a1: number;
  a2: number;
  a3: number;
  a4: number;
  a5: number;
  a6: number;
  a7: number;
  b1: number;
  b2: number;
  eq: number;                 // Equation type identifier
}
```

### 2.2 Temperature Range Structure
```typescript
type TemperatureRangeKey =
  | 'nasa9_200_1000_K'
  | 'nasa9_1000_6000_K'
  | 'nasa9_6000_20000_K'
  | 'nasa7_200_1000_K'
  | 'nasa7_1000_6000_K'
  | 'nasa7_6000_20000_K';

interface CompoundData {
  [compoundKey: string]: {
    nasa9_200_1000_K?: NASA9Coefficients;
    nasa9_1000_6000_K?: NASA9Coefficients;
    nasa9_6000_20000_K?: NASA9Coefficients;
  };
}

// Example:
// 'carbon dioxide-g': {
//   nasa9_200_1000_K: { ... },
//   nasa9_1000_6000_K: { ... },
//   nasa9_6000_20000_K: { ... }
// }
```

---

## 3. Core Type Definitions

### 3.1 Create `types/` Directory

#### File: `types/constants.ts`
```typescript
export type NASAType = 'nasa7' | 'nasa9';
export type NASARangeType =
  | 'nasa7_200_1000_K'
  | 'nasa7_1000_6000_K'
  | 'nasa7_6000_20000_K'
  | 'nasa9_200_1000_K'
  | 'nasa9_1000_6000_K'
  | 'nasa9_6000_20000_K';

export type BasisType = 'molar' | 'mass';
export type ComponentKey = 'Name-Formula' | 'Formula-State' | 'Name';
export type StateType = 'g' | 'l' | 's' | 'cr';

// Temperature break points (K)
export const TEMPERATURE_BREAK_NASA7_200_K = 200;
export const TEMPERATURE_BREAK_NASA7_1000_K = 1000;
export const TEMPERATURE_BREAK_NASA7_6000_K = 6000;
export const TEMPERATURE_BREAK_NASA9_200_K = 200;
export const TEMPERATURE_BREAK_NASA9_1000_K = 1000;
export const TEMPERATURE_BREAK_NASA9_6000_K = 6000;
export const TEMPERATURE_BREAK_NASA9_20000_K = 20000;
```

#### File: `types/models.ts`
```typescript
export interface Temperature {
  value: number;
  unit: 'K' | 'C' | 'F' | 'R';
}

export interface Component {
  name: string;
  formula: string;
  state: StateType;
  molecularWeight?: number;
  formulaRaw?: string;
}

export interface CustomProp {
  value: number;
  unit: string;
  description?: string;
}

export interface NASA7Coefficients {
  a1: number;
  a2: number;
  a3: number;
  a4: number;
  a5: number;
  a6: number;
  a7: number;
}

export interface NASA9Coefficients {
  a1: number;
  a2: number;
  a3: number;
  a4: number;
  a5: number;
  a6: number;
  a7: number;
  b1: number;
  b2: number;
}

export interface ComponentEquationSource {
  component: Component;
  temperatureRange: NASARangeType;
  coefficients: NASA7Coefficients | NASA9Coefficients;
  Tmin: number;
  Tmax: number;
  hf298: number;
  mw: number;
}
```

---

## 4. Module Structure

### 4.1 Directory Layout
```
src/
├── index.ts                    # Main entry point
├── types/
│   ├── constants.ts            # Constants and type literals
│   ├── models.ts               # Core interfaces
│   └── index.ts                # Type exports
├── core/
│   ├── HSG.ts                  # Heat, entropy, Gibbs calculator
│   ├── HSGs.ts                 # Multiple component handler
│   └── DataExtractor.ts        # Base data extraction class
├── thermo/
│   ├── enthalpy.ts             # Enthalpy calculations
│   ├── entropy.ts              # Entropy calculations
│   ├── gibbs.ts                # Gibbs free energy
│   └── heatCapacity.ts         # Heat capacity calculations
├── utils/
│   ├── tools.ts                # Utility functions
│   ├── unitConverter.ts        # Unit conversion utilities
│   └── validation.ts           # Input validation
├── data/
│   ├── DataLoader.ts           # CSV/JSON data loading
│   └── DataCache.ts            # In-memory caching
├── reactions/
│   └── RXNAdapter.ts           # Reaction thermodynamics
└── app.ts                      # High-level API functions
```

---

## 5. Conversion Priority & Steps

### Phase 1: Foundation (Week 1)
**Priority: HIGH**

1. **Setup Project Structure**
   - [ ] Initialize TypeScript project
   - [ ] Configure `tsconfig.json` (strict mode, ES2020+)
   - [ ] Setup package.json with dependencies
   - [ ] Configure build tools (tsc or Vite)
   - [ ] Setup testing framework (Jest/Vitest)

2. **Create Type Definitions**
   - [ ] Convert `constants.py` → `constants.ts`
   - [ ] Define all TypeScript interfaces
   - [ ] Create enum types where applicable
   - [ ] Add JSDoc comments for documentation

3. **Implement Utility Functions**
   - [ ] Convert `tools.py` → `tools.ts`
   - [ ] Implement `_require_coeffs()` with type guards
   - [ ] Implement `_select_nasa_type()`
   - [ ] Create unit conversion utilities
   - [ ] Add `_energy_or_entropy_to_mass_basis()`

### Phase 2: Data Management (Week 2)
**Priority: HIGH**

4. **Data Loading System**
   - [ ] Create CSV parser for NASA coefficient files
   - [ ] Implement data validation layer
   - [ ] Build in-memory data cache
   - [ ] Create data access interface
   - [ ] Handle three temperature range files:
     - `gas_nasa9_coeffs_min_0_max_1000.csv`
     - `gas_nasa9_coeffs_min_1000_max_6000.csv`
     - `gas_nasa9_coeffs_min_6000_max_20000.csv`

5. **Data Structure Builder**
   - [ ] Transform flat CSV to nested structure
   - [ ] Group by compound (name-formula-state)
   - [ ] Organize by temperature ranges
   - [ ] Validate completeness of data

### Phase 3: Core Thermodynamic Calculations (Week 3)
**Priority: HIGH**

6. **HSG Class (Single Component)**
   - [ ] Convert `hsg.py` → `HSG.ts`
   - [ ] Implement coefficient extraction
   - [ ] Add temperature range selection logic
   - [ ] Create enthalpy calculation methods
   - [ ] Create entropy calculation methods
   - [ ] Create Gibbs free energy methods
   - [ ] Add heat capacity calculations

7. **Thermodynamic Functions**
   - [ ] Implement NASA9 polynomial functions:
     - `En_IG_NASA9_polynomial()`
     - `S_IG_NASA9_polynomial()`
     - `Cp_IG_NASA9_polynomial()`
   - [ ] Implement NASA7 polynomial functions:
     - `En_IG_NASA7_polynomial()`
     - `S_IG_NASA7_polynomial()`
     - `Cp_IG_NASA7_polynomial()`
   - [ ] Add range-based calculation functions
   - [ ] Implement `GiFrEn_IG()` for Gibbs

### Phase 4: Multi-Component Support (Week 4)
**Priority: MEDIUM**

8. **HSGs Class (Multiple Components)**
   - [ ] Convert `hsgs.py` → `HSGs.ts`
   - [ ] Implement component list handling
   - [ ] Create bulk HSG object builder
   - [ ] Add batch calculation methods
   - [ ] Optimize for performance

9. **Reaction Calculations**
   - [ ] Convert `rxn_adapter.py` → `RXNAdapter.ts`
   - [ ] Implement `dH_rxn_std()` - Standard enthalpy change
   - [ ] Implement `dS_rxn_std()` - Standard entropy change
   - [ ] Implement `dG_rxn_std()` - Standard Gibbs change
   - [ ] Implement `Keq()` - Equilibrium constant
   - [ ] Implement `Keq_vh_shortcut()` - Van't Hoff approximation

### Phase 5: High-Level API (Week 5)
**Priority: MEDIUM**

10. **Main Application Functions**
    - [ ] Convert `app.py` → `app.ts`
    - [ ] Implement `H_T()` - Enthalpy at temperature
    - [ ] Implement `S_T()` - Entropy at temperature
    - [ ] Implement `G_T()` - Gibbs at temperature
    - [ ] Implement `Cp_T()` - Heat capacity at temperature
    - [ ] Add performance measurement decorators
    - [ ] Implement error handling and logging

### Phase 6: Testing & Documentation (Week 6)
**Priority: HIGH**

11. **Unit Tests**
    - [ ] Test utility functions
    - [ ] Test data loading and parsing
    - [ ] Test polynomial calculations
    - [ ] Test HSG class methods
    - [ ] Test reaction calculations
    - [ ] Add integration tests
    - [ ] Achieve >80% code coverage

12. **Documentation**
    - [ ] Generate API documentation (TypeDoc)
    - [ ] Write README.md with examples
    - [ ] Create usage guide
    - [ ] Add inline code comments
    - [ ] Document known limitations

### Phase 7: Optimization & Polish (Week 7)
**Priority: LOW**

13. **Performance Optimization**
    - [ ] Profile calculation performance
    - [ ] Implement memoization where beneficial
    - [ ] Optimize data structure access
    - [ ] Consider WebAssembly for hot paths

14. **Publishing**
    - [ ] Setup npm package configuration
    - [ ] Create distribution bundles (ESM, CJS, UMD)
    - [ ] Add TypeScript declaration files
    - [ ] Test package installation
    - [ ] Publish to npm (if public)

---

## 6. Key Dependencies

### 6.1 Runtime Dependencies
```json
{
  "dependencies": {
    "csv-parse": "^5.5.0",      // CSV parsing
    "zod": "^3.22.0"            // Runtime validation
  }
}
```

### 6.2 Development Dependencies
```json
{
  "devDependencies": {
    "typescript": "^5.3.0",
    "vitest": "^1.0.0",          // Testing framework
    "tsup": "^8.0.0",            // Build tool
    "typedoc": "^0.25.0",        // Documentation
    "@types/node": "^20.0.0",
    "eslint": "^8.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0"
  }
}
```

---

## 7. Implementation Guidelines

### 7.1 Code Style
- Use **strict TypeScript** configuration
- Prefer **interfaces** over types for object shapes
- Use **const assertions** for literal types
- Implement **discriminated unions** for NASA types
- Add **JSDoc comments** for public APIs

### 7.2 Error Handling
```typescript
// Use Result type or custom error classes
class ThermoCalcError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ThermoCalcError';
  }
}

// Or use a Result type
type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };
```

### 7.3 Async/Await Pattern
```typescript
// For data loading operations
async function loadCoefficients(
  filePath: string
): Promise<Result<CompoundData>> {
  try {
    const data = await parseCSV(filePath);
    return { success: true, value: data };
  } catch (error) {
    return {
      success: false,
      error: new ThermoCalcError('Failed to load data', 'LOAD_ERROR')
    };
  }
}
```

### 7.4 Immutability
- Use `readonly` for properties that shouldn't change
- Prefer `const` over `let`
- Use immutable update patterns

### 7.5 Type Guards
```typescript
function isNASA9Coefficients(
  coeffs: NASA7Coefficients | NASA9Coefficients
): coeffs is NASA9Coefficients {
  return 'b1' in coeffs && 'b2' in coeffs;
}
```

---

## 8. Testing Strategy

### 8.1 Unit Tests
- Test each utility function independently
- Validate polynomial calculations against known values
- Test temperature range selection logic
- Verify unit conversions

### 8.2 Integration Tests
- Test complete calculation workflows
- Validate results against Python version
- Test with real compound data
- Verify reaction calculations

### 8.3 Test Data
```typescript
// Create fixture data for testing
const CO2_TEST_DATA: NASA9CoefficientsRaw = {
  name: 'carbon dioxide',
  formula: 'CO2',
  state: 'g',
  formula_raw: 'C   1.00O   2.00    0.00    0.00    0.00',
  phase_flag: 0,
  mw: 44.0095,
  hf298: -393510,
  T_low: 200,
  T_high: 1000,
  dh298_0: 9365.0,
  a1: 24007.797,
  a2: -626.411601,
  a3: 5.30172524,
  a4: 0.002503813,
  a5: -2.13e-07,
  a6: -7.69e-10,
  a7: 2.85e-13,
  b1: -48371.9697,
  b2: -1.55189868,
  eq: 1
};
```

---

## 9. Migration Challenges

### 9.1 Python-Specific Features to Replace

| Python Feature | TypeScript Equivalent |
|---|---|
| `typing.Optional[T]` | `T \| null \| undefined` |
| `typing.Literal` | Template literal types |
| `@measure_time` decorator | Function wrapper/HOF |
| `logging` module | `console` or custom logger |
| Dictionary comprehensions | `Array.reduce()` or `Object.fromEntries()` |
| `**kwargs` | Rest parameters `...args` |

### 9.2 Numerical Precision
- Python uses arbitrary precision integers; JavaScript has only `number` (IEEE 754)
- Consider using libraries like `decimal.js` for high-precision requirements
- Validate that floating-point calculations match Python results

### 9.3 Data Loading
- Python's `pandas` → TypeScript CSV parsing libraries
- YAML loading → `js-yaml` library
- Ensure encoding compatibility (UTF-8)

---

## 10. Example Usage (Target API)

```typescript
import { H_T, S_T, G_T } from 'thermocalcdb-nasa';
import { Component, Temperature } from 'thermocalcdb-nasa/types';

// Define component
const CO2: Component = {
  name: 'carbon dioxide',
  formula: 'CO2',
  state: 'g'
};

// Define temperature
const temp: Temperature = {
  value: 500,
  unit: 'K'
};

// Load data source
const modelSource = await loadModelSource('./data');

// Calculate enthalpy
const enthalpy = await H_T({
  component: CO2,
  temperature: temp,
  modelSource,
  componentKey: 'Name-Formula',
  nasaType: 'nasa9',
  basis: 'molar'
});

console.log(enthalpy);
// { value: -391234.56, unit: 'J/mol' }

// Calculate Gibbs free energy
const gibbs = await G_T({
  component: CO2,
  temperature: temp,
  modelSource,
  nasaType: 'nasa9'
});
```

---

## 11. Deliverables

### 11.1 Code Artifacts
- [ ] Complete TypeScript source code
- [ ] Compiled JavaScript (ESM + CJS)
- [ ] Type declaration files (`.d.ts`)
- [ ] Source maps for debugging

### 11.2 Documentation
- [ ] API reference documentation
- [ ] Migration guide (Python → TypeScript)
- [ ] Usage examples
- [ ] Changelog

### 11.3 Quality Assurance
- [ ] Unit test suite (>80% coverage)
- [ ] Integration tests
- [ ] Performance benchmarks
- [ ] Validation against Python version

---

## 12. Timeline Summary

| Phase | Duration | Priority | Status |
|-------|----------|----------|--------|
| Phase 1: Foundation | Week 1 | HIGH | ⏳ Pending |
| Phase 2: Data Management | Week 2 | HIGH | ⏳ Pending |
| Phase 3: Core Calculations | Week 3 | HIGH | ⏳ Pending |
| Phase 4: Multi-Component | Week 4 | MEDIUM | ⏳ Pending |
| Phase 5: High-Level API | Week 5 | MEDIUM | ⏳ Pending |
| Phase 6: Testing & Docs | Week 6 | HIGH | ⏳ Pending |
| Phase 7: Optimization | Week 7 | LOW | ⏳ Pending |

**Total Estimated Time**: 7 weeks

---

## 13. Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Numerical precision differences | HIGH | Implement comprehensive test suite comparing outputs |
| Missing Python dependencies | MEDIUM | Identify and replace with TypeScript equivalents |
| Performance degradation | MEDIUM | Profile and optimize hot paths, consider WASM |
| Type safety gaps | LOW | Use strict TypeScript config and Zod validation |
| CSV parsing errors | MEDIUM | Robust error handling and data validation |

---

## 14. Success Criteria

✅ All core thermodynamic calculations produce identical results to Python version (within acceptable floating-point tolerance: 1e-10)

✅ Type-safe API with no `any` types in public interfaces

✅ Complete test coverage (>80%)

✅ API documentation published

✅ Performance within 2x of Python implementation

✅ Successfully processes all three CSV temperature range files

✅ Supports both NASA7 and NASA9 polynomial types

---

## Notes

- **Incremental Development**: Build and test each module independently before integration
- **Version Control**: Use Git with semantic versioning (semver)
- **Continuous Integration**: Setup CI/CD pipeline (GitHub Actions)
- **Peer Review**: Code review before merging major features
- **Backwards Compatibility**: Consider maintaining Python wrapper if needed
