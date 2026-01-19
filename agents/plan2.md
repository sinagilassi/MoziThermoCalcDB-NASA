# Model Source Data Structure & Agent Implementation Plan

## ThermoCalcDB-NASA TypeScript Package

---

## 1. Model Source Overview

### 1.1 Purpose

`model_source` is the core data structure that contains NASA polynomial coefficients for all compounds across multiple temperature ranges. It serves as the **central database** for thermodynamic calculations.

### 1.2 Key Characteristics

- **Multi-keyed access**: Each compound is accessible via three different key types
- **Temperature stratification**: Data organized by temperature ranges (200-1000K, 1000-6000K, 6000-20000K)
- **Sparse storage**: Not all compounds have all temperature ranges
- **Flexible lookup**: Supports different component identification strategies

---

## 2. Data Structure Specification

### 2.1 Complete Schema

```typescript
interface NASA9TemperatureRangeData {
  // Identification
  Name: string;                    // Common name (e.g., "carbon dioxide")
  Formula: string;                 // Chemical formula (e.g., "CO2")
  State: string;                   // Phase: 'g' (gas), 'l' (liquid), 's' (solid), 'cr' (crystal)
  formula_raw: string;             // CHEMKIN format (e.g., "C   1.00O   2.00...")
  phase_flag: number;              // Phase indicator (typically 0 for gas)

  // Molecular properties
  MW: number;                      // Molecular weight (g/mol)
  EnFo_IG: number;                 // Enthalpy of formation at 298K (J/mol)
  dEnFo_IG_298: number;           // ΔH(298-0) standard enthalpy (J/mol)

  // Temperature range
  Tmin: number;                    // Minimum temperature (K)
  Tmax: number;                    // Maximum temperature (K)

  // NASA9 polynomial coefficients
  a1: number;                      // Coefficient 1
  a2: number;                      // Coefficient 2
  a3: number;                      // Coefficient 3
  a4: number;                      // Coefficient 4
  a5: number;                      // Coefficient 5
  a6: number;                      // Coefficient 6
  a7: number;                      // Coefficient 7
  b1: number;                      // Integration constant 1
  b2: number;                      // Integration constant 2

  // Metadata
  nasa9_200_1000_K?: 1;           // Marker for temperature range (only present in appropriate range)
  nasa9_1000_6000_K?: 1;          // Marker for temperature range
  nasa9_6000_20000_K?: 1;         // Marker for temperature range
}

interface CompoundTemperatureRanges {
  nasa9_200_1000_K?: NASA9TemperatureRangeData;
  nasa9_1000_6000_K?: NASA9TemperatureRangeData;
  nasa9_6000_20000_K?: NASA9TemperatureRangeData;
}

interface ModelSource {
  // Key format: {ComponentKey}
  // Where ComponentKey can be:
  //   - "Name-State" (e.g., "carbon dioxide-g")
  //   - "Formula-State" (e.g., "CO2-g")
  //   - "Name-Formula" (e.g., "carbon dioxide-CO2")
  [componentKey: string]: CompoundTemperatureRanges;
}
```

### 2.2 Concrete Example Structure

```typescript
const model_source: ModelSource = {
  // Carbon Dioxide - All three key variations
  'carbon dioxide-g': {
    nasa9_200_1000_K: {
      Name: 'carbon dioxide',
      Formula: 'CO2',
      State: 'g',
      formula_raw: 'C   1.00O   2.00    0.00    0.00    0.00',
      phase_flag: 0,
      MW: 44.0095,
      EnFo_IG: -393510,
      Tmin: 200,
      Tmax: 1000,
      dEnFo_IG_298: 9365.0,
      a1: 24007.797,
      a2: -626.411601,
      a3: 5.30172524,
      a4: 0.002503813,
      a5: -2.13e-07,
      a6: -7.69e-10,
      a7: 2.85e-13,
      b1: -48371.9697,
      b2: -1.55189868,
      nasa9_200_1000_K: 1
    },
    nasa9_1000_6000_K: {
      Name: 'carbon dioxide',
      Formula: 'CO2',
      State: 'g',
      formula_raw: 'C   1.00O   2.00    0.00    0.00    0.00',
      phase_flag: 0,
      MW: 44.0095,
      EnFo_IG: -393510,
      Tmin: 1000,
      Tmax: 6000,
      dEnFo_IG_298: 9365.0,
      a1: 49436.5054,
      a2: -626.411728,
      a3: 5.30172524,
      a4: 0.002503813,
      a5: -2.13e-07,
      a6: -7.69e-10,
      a7: 2.85e-13,
      b1: -45281.9846,
      b2: -7.04827944,
      nasa9_1000_6000_K: 1
    },
    nasa9_6000_20000_K: {
      Name: 'carbon dioxide',
      Formula: 'CO2',
      State: 'g',
      formula_raw: 'C   1.00O   2.00    0.00    0.00    0.00',
      phase_flag: 0,
      MW: 44.0095,
      EnFo_IG: -393510,
      Tmin: 6000,
      Tmax: 20000,
      dEnFo_IG_298: 9365.0,
      a1: 117696.2357,
      a2: -1788.75906,
      a3: 8.29152319,
      a4: -9.22315e-05,
      a5: 4.86367e-09,
      a6: -1.89e-13,
      a7: 6.33e-18,
      b1: -39083.5059,
      b2: -26.52669281,
      nasa9_6000_20000_K: 1
    }
  },

  // Same compound with Formula-State key
  'CO2-g': {
    nasa9_200_1000_K: { /* Same data as above */ },
    nasa9_1000_6000_K: { /* Same data as above */ },
    nasa9_6000_20000_K: { /* Same data as above */ }
  },

  // Same compound with Name-Formula key
  'carbon dioxide-CO2': {
    nasa9_200_1000_K: { /* Same data as above */ },
    nasa9_1000_6000_K: { /* Same data as above */ },
    nasa9_6000_20000_K: { /* Same data as above */ }
  },

  // Methane - Example with only two temperature ranges
  'methane-g': {
    nasa9_200_1000_K: {
      Name: 'methane',
      Formula: 'CH4',
      State: 'g',
      formula_raw: 'C   1.00H   4.00    0.00    0.00    0.00',
      phase_flag: 0,
      MW: 16.04246,
      EnFo_IG: -74600,
      Tmin: 200,
      Tmax: 1000,
      dEnFo_IG_298: 10018.4,
      a1: -176685.0987,
      a2: 2788.10957,
      a3: -12.0257785,
      a4: 0.03917619,
      a5: -3.62e-05,
      a6: 2.03e-08,
      a7: -4.91e-12,
      b1: -23313.1436,
      b2: 89.0432275,
      nasa9_200_1000_K: 1
    },
    nasa9_1000_6000_K: {
      Name: 'methane',
      Formula: 'CH4',
      State: 'g',
      formula_raw: 'C   1.00H   4.00    0.00    0.00    0.00',
      phase_flag: 0,
      MW: 16.04246,
      EnFo_IG: -74600,
      Tmin: 1000,
      Tmax: 6000,
      dEnFo_IG_298: 10018.4,
      a1: 3730042.76,
      a2: -13835.01485,
      a3: 20.49107091,
      a4: -0.001961974759,
      a5: 4.72731e-07,
      a6: -3.73e-11,
      a7: 1.62e-15,
      b1: 75320.6691,
      b2: -121.9124889,
      nasa9_1000_6000_K: 1
    }
    // Note: No nasa9_6000_20000_K for methane
  },

  'CH4-g': {
    nasa9_200_1000_K: { /* Same as methane-g */ },
    nasa9_1000_6000_K: { /* Same as methane-g */ }
  },

  'methane-CH4': {
    nasa9_200_1000_K: { /* Same as methane-g */ },
    nasa9_1000_6000_K: { /* Same as methane-g */ }
  }
};
```

---

## 3. Component Key Strategy

### 3.1 Three Key Types Explained

```typescript
type ComponentKey = 'Name-State' | 'Formula-State' | 'Name-Formula';

// For CO2 (gas):
// - Name-State:     "carbon dioxide-g"
// - Formula-State:  "CO2-g"
// - Name-Formula:   "carbon dioxide-CO2"
```

### 3.2 Why Multiple Keys?

**Flexibility in Component Identification:**

```typescript
// User might specify component as:
const component1 = { name: 'carbon dioxide', formula: 'CO2', state: 'g' };
const component2 = { formula: 'CO2', state: 'g' };  // Only formula known
const component3 = { name: 'carbon dioxide', formula: 'CO2' };  // State might be inferred

// Each can be looked up efficiently:
// setComponentId(component1, 'Name-State')    → "carbon dioxide-g"
// setComponentId(component2, 'Formula-State') → "CO2-g"
// setComponentId(component3, 'Name-Formula')  → "carbon dioxide-CO2"
```

### 3.3 Key Generation Algorithm

```typescript
function setComponentId(
  component: Component,
  componentKey: ComponentKey
): string {
  switch (componentKey) {
    case 'Name-State':
      return `${component.name}-${component.state}`;

    case 'Formula-State':
      return `${component.formula}-${component.state}`;

    case 'Name-Formula':
      return `${component.name}-${component.formula}`;

    default:
      throw new Error(`Unknown component key type: ${componentKey}`);
  }
}
```

---

## 4. Data Loading Strategy

### 4.1 Source Files

Three CSV files containing NASA9 coefficients:

1. **gas_nasa9_coeffs_min_0_max_1000.csv**
   - Temperature range: 200-1000K (note: actually starts at 200K, not 0K)
   - All gas-phase compounds

2. **gas_nasa9_coeffs_min_1000_max_6000.csv**
   - Temperature range: 1000-6000K
   - Intermediate temperature compounds

3. **gas_nasa9_coeffs_min_6000_max_20000.csv**
   - Temperature range: 6000-20000K
   - High-temperature compounds (sparse - not all compounds)

### 4.2 CSV Column Mapping

```typescript
// CSV Header
const csvColumns = [
  'name',           // → Name
  'formula',        // → Formula
  'state',          // → State
  'formula_raw',    // → formula_raw
  'phase_flag',     // → phase_flag
  'mw',             // → MW
  'hf298',          // → EnFo_IG
  'T_low',          // → Tmin
  'T_high',         // → Tmax
  'dh298_0',        // → dEnFo_IG_298
  'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7',  // → a1-a7
  'b1', 'b2',       // → b1, b2
  'eq'              // → Range marker (typically 1)
];
```

### 4.3 Data Transformation Pipeline

```typescript
interface DataLoaderPipeline {
  // Step 1: Parse CSV files
  parseCSV(filePath: string): Promise<RawCSVRow[]>;

  // Step 2: Validate and transform rows
  validateRow(row: RawCSVRow): NASA9TemperatureRangeData | null;

  // Step 3: Determine temperature range from file
  identifyRange(fileName: string): 'nasa9_200_1000_K' | 'nasa9_1000_6000_K' | 'nasa9_6000_20000_K';

  // Step 4: Generate all three key variations per compound
  generateKeys(data: NASA9TemperatureRangeData): {
    nameState: string;
    formulaState: string;
    nameFormula: string;
  };

  // Step 5: Build nested structure
  buildModelSource(allData: NASA9TemperatureRangeData[]): ModelSource;
}
```

### 4.4 Implementation Example

```typescript
// File: src/data/DataLoader.ts
export class DataLoader {
  async loadModelSource(): Promise<ModelSource> {
    const modelSource: ModelSource = {};

    // Load all three temperature range files
    const ranges = [
      { file: 'gas_nasa9_coeffs_min_0_max_1000.csv', key: 'nasa9_200_1000_K' },
      { file: 'gas_nasa9_coeffs_min_1000_max_6000.csv', key: 'nasa9_1000_6000_K' },
      { file: 'gas_nasa9_coeffs_min_6000_max_20000.csv', key: 'nasa9_6000_20000_K' }
    ] as const;

    for (const { file, key } of ranges) {
      const rows = await this.parseCSV(file);

      for (const row of rows) {
        const data = this.transformRow(row);

        // Generate all three key variations
        const keys = this.generateKeys(data);

        // Add to all three key entries
        for (const compoundKey of Object.values(keys)) {
          if (!modelSource[compoundKey]) {
            modelSource[compoundKey] = {};
          }
          modelSource[compoundKey][key] = data;
        }
      }
    }

    return modelSource;
  }

  private generateKeys(data: NASA9TemperatureRangeData) {
    return {
      nameState: `${data.Name}-${data.State}`,
      formulaState: `${data.Formula}-${data.State}`,
      nameFormula: `${data.Name}-${data.Formula}`
    };
  }
}
```

---

## 5. Agent Implementation Plan

### 5.1 Core Responsibilities

The agent (TypeScript package) must:

1. **Load and parse** the three CSV files
2. **Build** the nested `model_source` structure
3. **Provide efficient lookup** by component key
4. **Select correct temperature range** based on query temperature
5. **Extract coefficients** for calculations
6. **Cache** data for performance

### 5.2 Module Architecture

```
src/
├── data/
│   ├── DataLoader.ts           # CSV parsing and loading
│   ├── DataCache.ts            # In-memory caching
│   └── DataValidator.ts        # Schema validation
├── core/
│   ├── Source.ts               # Data source wrapper
│   ├── HSG.ts                  # Single component calculator
│   └── HSGs.ts                 # Multi-component calculator
├── utils/
│   └── componentId.ts          # Key generation utilities
└── types/
    ├── models.ts               # Core types
    └── external.ts             # External interfaces
```

### 5.3 Source Class Design

```typescript
// File: src/core/Source.ts
export class Source {
  private modelSource: ModelSource;
  private componentKey: ComponentKey;

  constructor(modelSource: ModelSource, componentKey: ComponentKey) {
    this.modelSource = modelSource;
    this.componentKey = componentKey;
  }

  /**
   * Get equation source for a specific component and temperature range
   */
  getEquationSource(opts: {
    component: Component;
    componentKey: string;
    propName: NASARangeType;
  }): ComponentEquationSource | null {
    // 1. Generate component ID
    const componentId = setComponentId(opts.component, opts.componentKey as ComponentKey);

    // 2. Look up compound data
    const compoundData = this.modelSource[componentId];
    if (!compoundData) {
      console.warn(`Component not found: ${componentId}`);
      return null;
    }

    // 3. Get temperature range data
    const rangeData = compoundData[opts.propName];
    if (!rangeData) {
      console.warn(`Temperature range not found: ${opts.propName} for ${componentId}`);
      return null;
    }

    // 4. Extract coefficients
    const coefficients: NASA9Coefficients = {
      a1: rangeData.a1,
      a2: rangeData.a2,
      a3: rangeData.a3,
      a4: rangeData.a4,
      a5: rangeData.a5,
      a6: rangeData.a6,
      a7: rangeData.a7,
      b1: rangeData.b1,
      b2: rangeData.b2
    };

    // 5. Return structured data
    return {
      component: opts.component,
      temperatureRange: opts.propName,
      source: {
        parms_values: coefficients as unknown as Record<string, number>
      }
    };
  }
}
```

### 5.4 HSG Coefficient Extraction

```typescript
// File: src/core/HSG.ts
export class HSG {
  private source: Source;
  private component: Component;
  private componentKey: ComponentKey;
  private nasaType: NASAType;

  /**
   * Get coefficients for a specific temperature range
   */
  private getCoefficients(rangeType: NASARangeType): NASA9Coefficients | null {
    const eqSource = this.source.getEquationSource({
      component: this.component,
      componentKey: this.componentKey,
      propName: rangeType
    });

    if (!eqSource) return null;

    return eqSource.source.parms_values as unknown as NASA9Coefficients;
  }

  /**
   * Calculate enthalpy at specific temperature
   */
  calc_absolute_enthalpy(
    temperature: Temperature,
    rangeType: NASARangeType
  ): CustomProp | null {
    const coeffs = this.getCoefficients(rangeType);
    if (!coeffs) return null;

    // Use NASA9 polynomial calculation
    const T_kelvin = convertToKelvin(temperature);
    const H = En_IG_NASA9_polynomial(T_kelvin, coeffs);

    return {
      value: H,
      unit: 'J/mol',
      description: `Enthalpy at ${T_kelvin}K`
    };
  }
}
```

---

## 6. Data Access Patterns

### 6.1 Single Component Query

```typescript
// User provides component
const component: Component = {
  name: 'carbon dioxide',
  formula: 'CO2',
  state: 'g'
};

// User provides temperature
const temperature: Temperature = { value: 500, unit: 'K' };

// System workflow:
// 1. Generate component ID: "carbon dioxide-g" (using Name-State key)
// 2. Look up in model_source: model_source['carbon dioxide-g']
// 3. Select temperature range: T=500K → use 'nasa9_200_1000_K'
// 4. Access: model_source['carbon dioxide-g']['nasa9_200_1000_K']
// 5. Extract coefficients and calculate
```

### 6.2 Multi-Component Batch Query

```typescript
// Multiple components
const components: Component[] = [
  { name: 'carbon dioxide', formula: 'CO2', state: 'g' },
  { name: 'methane', formula: 'CH4', state: 'g' },
  { name: 'water', formula: 'H2O', state: 'g' }
];

// System workflow:
// 1. Generate IDs for all: ['carbon dioxide-g', 'methane-g', 'water-g']
// 2. Create HSG objects for each
// 3. Select appropriate temperature range for each
// 4. Calculate properties in parallel/batch
```

### 6.3 Temperature Range Selection

```typescript
function selectTemperatureRange(
  temperature: Temperature,
  nasaType: NASAType
): NASARangeType {
  const T_K = convertToKelvin(temperature);

  if (T_K <= 1000) {
    return nasaType === 'nasa7' ? 'nasa7_200_1000_K' : 'nasa9_200_1000_K';
  } else if (T_K <= 6000) {
    return nasaType === 'nasa7' ? 'nasa7_1000_6000_K' : 'nasa9_1000_6000_K';
  } else {
    return nasaType === 'nasa7' ? 'nasa7_6000_20000_K' : 'nasa9_6000_20000_K';
  }
}
```

---

## 7. Edge Cases & Handling

### 7.1 Missing Temperature Range

```typescript
// Problem: User requests T=7000K for methane, but methane only has data up to 6000K
const result = getCoefficients('methane-g', 'nasa9_6000_20000_K');
// result = undefined

// Solution: Fallback strategy
function getCoefficientsWithFallback(
  componentId: string,
  preferredRange: NASARangeType
): NASA9Coefficients | null {
  const compoundData = modelSource[componentId];
  if (!compoundData) return null;

  // Try preferred range
  if (compoundData[preferredRange]) {
    return compoundData[preferredRange];
  }

  // Fallback: Use highest available range
  if (compoundData.nasa9_1000_6000_K) {
    console.warn(`Using 1000-6000K range for ${componentId} (requested range unavailable)`);
    return compoundData.nasa9_1000_6000_K;
  }

  return compoundData.nasa9_200_1000_K || null;
}
```

### 7.2 Unknown Component

```typescript
// Problem: User requests compound not in database
const component = { name: 'unobtainium', formula: 'Uo', state: 'g' };
const result = lookupComponent('unobtainium-g');
// result = undefined

// Solution: Clear error messaging
if (!result) {
  throw new ThermoCalcError(
    `Component not found in database: ${componentId}`,
    'COMPONENT_NOT_FOUND',
    { componentId, availableKeys: Object.keys(modelSource).slice(0, 10) }
  );
}
```

### 7.3 Duplicate Keys

```typescript
// All three keys point to same data - ensure consistency
// When updating data, update all three key variations
function updateCompound(data: NASA9TemperatureRangeData, range: NASARangeType) {
  const keys = generateKeys(data);

  for (const key of Object.values(keys)) {
    if (!modelSource[key]) modelSource[key] = {};
    modelSource[key][range] = data;
  }
}
```

---

## 8. Performance Optimization

### 8.1 Lazy Loading

```typescript
class LazyModelSource {
  private cache: Map<string, CompoundTemperatureRanges> = new Map();

  async get(componentId: string): Promise<CompoundTemperatureRanges | null> {
    // Check cache first
    if (this.cache.has(componentId)) {
      return this.cache.get(componentId)!;
    }

    // Load only if needed
    const data = await this.loadCompound(componentId);
    if (data) {
      this.cache.set(componentId, data);
    }

    return data;
  }
}
```

### 8.2 Precomputed Index

```typescript
interface ModelSourceIndex {
  // Quick lookup: which compounds are available?
  availableCompounds: Set<string>;

  // Which temperature ranges per compound?
  temperatureRanges: Map<string, Set<NASARangeType>>;

  // Fast validation
  hasCompound(id: string): boolean;
  hasRange(id: string, range: NASARangeType): boolean;
}
```

### 8.3 Memory Management

```typescript
// For large datasets, consider:
// 1. Store only unique coefficient sets
// 2. Use references for duplicate data
// 3. Compress unused ranges

interface CompactModelSource {
  // Shared data pool
  coefficientPool: NASA9Coefficients[];

  // Lightweight references
  compounds: Map<string, {
    ranges: Map<NASARangeType, number>  // Index into coefficientPool
  }>;
}
```

---

## 9. Implementation Checklist

### Phase 1: Data Loading (Week 1-2)
- [ ] Create CSV parser with proper type validation
- [ ] Implement column mapping (csv headers → TypeScript interface)
- [ ] Build `generateKeys()` utility
- [ ] Create `DataLoader` class
- [ ] Test with all three CSV files
- [ ] Validate data completeness
- [ ] Handle missing values gracefully

### Phase 2: Data Structure (Week 2-3)
- [ ] Define complete TypeScript interfaces
- [ ] Implement `ModelSource` builder
- [ ] Create compound key index
- [ ] Add temperature range index
- [ ] Implement data validation layer
- [ ] Test data access patterns

### Phase 3: Source Integration (Week 3-4)
- [ ] Implement `Source` class
- [ ] Add `getEquationSource()` method
- [ ] Handle missing temperature ranges
- [ ] Add error handling and logging
- [ ] Test with HSG class integration
- [ ] Validate coefficient extraction

### Phase 4: Testing & Validation (Week 4-5)
- [ ] Unit tests for key generation
- [ ] Integration tests for data loading
- [ ] Validate against Python version
- [ ] Test edge cases (missing ranges, unknown compounds)
- [ ] Performance benchmarks
- [ ] Memory usage analysis

### Phase 5: Documentation (Week 5-6)
- [ ] Document model_source structure
- [ ] Add JSDoc comments
- [ ] Create usage examples
- [ ] Write migration guide
- [ ] API reference documentation

---

## 10. Example Usage Scenarios

### 10.1 Basic Component Lookup

```typescript
import { loadModelSource } from './data/DataLoader';
import { Source } from './core/Source';

// Load data
const modelSource = await loadModelSource();

// Create source with preferred key type
const source = new Source(modelSource, 'Name-State');

// Look up component
const co2 = { name: 'carbon dioxide', formula: 'CO2', state: 'g' };
const eqSource = source.getEquationSource({
  component: co2,
  componentKey: 'Name-State',
  propName: 'nasa9_200_1000_K'
});

console.log(eqSource?.source.parms_values);
// { a1: 24007.797, a2: -626.411601, ... }
```

### 10.2 Flexible Key Access

```typescript
// Same compound, different key types
const co2_by_name = modelSource['carbon dioxide-g'];
const co2_by_formula = modelSource['CO2-g'];
const co2_by_both = modelSource['carbon dioxide-CO2'];

// All three reference the same data
console.log(
  co2_by_name['nasa9_200_1000_K'].MW ===
  co2_by_formula['nasa9_200_1000_K'].MW
); // true
```

### 10.3 Temperature Range Selection

```typescript
import { H_T } from './app';

const co2 = { name: 'carbon dioxide', formula: 'CO2', state: 'g' };

// Low temperature - uses nasa9_200_1000_K
const H_500K = H_T({
  component: co2,
  temperature: { value: 500, unit: 'K' },
  model_source: modelSource
});

// High temperature - uses nasa9_6000_20000_K
const H_8000K = H_T({
  component: co2,
  temperature: { value: 8000, unit: 'K' },
  model_source: modelSource
});
```

### 10.4 Reaction Calculations

```typescript
import { dH_rxn_STD } from './app';

// Combustion: CH4 + 2O2 → CO2 + 2H2O
const reaction: Reaction = {
  available_components: [
    { name: 'methane', formula: 'CH4', state: 'g' },
    { name: 'oxygen', formula: 'O2', state: 'g' },
    { name: 'carbon dioxide', formula: 'CO2', state: 'g' },
    { name: 'water', formula: 'H2O', state: 'g' }
  ],
  reaction: 'CH4 + 2*O2 -> CO2 + 2*H2O',
  reaction_stoichiometry: {
    'CH4': -1,
    'O2': -2,
    'CO2': 1,
    'H2O': 2
  }
};

const dH = dH_rxn_STD({
  reaction,
  temperature: { value: 298.15, unit: 'K' },
  model_source: modelSource
});

console.log(`ΔH_rxn = ${dH?.value} ${dH?.unit}`);
// ΔH_rxn = -890300 J/mol (approximately)
```

---

## 11. Validation Strategy

### 11.1 Data Integrity Checks

```typescript
async function validateModelSource(modelSource: ModelSource): Promise<ValidationReport> {
  const issues: string[] = [];

  for (const [key, ranges] of Object.entries(modelSource)) {
    // Check key format
    if (!key.includes('-')) {
      issues.push(`Invalid key format: ${key}`);
    }

    // Check temperature ranges
    for (const [rangeKey, data] of Object.entries(ranges)) {
      // Validate coefficients exist
      if (!data.a1 || !data.b1) {
        issues.push(`Missing coefficients for ${key} at ${rangeKey}`);
      }

      // Validate temperature bounds
      if (data.Tmin >= data.Tmax) {
        issues.push(`Invalid temperature range for ${key}: ${data.Tmin} >= ${data.Tmax}`);
      }

      // Validate molecular weight
      if (data.MW <= 0) {
        issues.push(`Invalid molecular weight for ${key}: ${data.MW}`);
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues,
    totalCompounds: Object.keys(modelSource).length / 3,  // Divide by 3 for duplicate keys
    totalRanges: Object.values(modelSource).reduce(
      (sum, ranges) => sum + Object.keys(ranges).length,
      0
    )
  };
}
```

### 11.2 Cross-Reference Python Results

```typescript
// Test against known Python calculations
const testCases = [
  {
    component: { name: 'carbon dioxide', formula: 'CO2', state: 'g' },
    temperature: { value: 500, unit: 'K' },
    expected_H: -391234.56,  // From Python
    tolerance: 1e-6
  },
  // ... more test cases
];

for (const test of testCases) {
  const result = H_T({
    component: test.component,
    temperature: test.temperature,
    model_source: modelSource
  });

  const error = Math.abs((result!.value - test.expected_H) / test.expected_H);
  if (error > test.tolerance) {
    console.error(`Test failed: error = ${error}`);
  }
}
```

---

## 12. Summary

### Key Points

✅ **`model_source` is a nested dictionary** with three levels:

   1. Component Key (string)
   2. Temperature Range (NASARangeType)
   3. Coefficient Data (NASA9TemperatureRangeData)

✅ **Triple-key redundancy** enables flexible component lookup:

   - Name-State (e.g., "carbon dioxide-g")
   - Formula-State (e.g., "CO2-g")
   - Name-Formula (e.g., "carbon dioxide-CO2")

✅ **Sparse data structure** - not all compounds have all temperature ranges

✅ **Data loaded from three CSV files** representing different temperature ranges

✅ **Agent responsibilities**:

   - Load and parse CSV files
   - Build nested model_source structure
   - Provide efficient lookup and coefficient extraction
   - Handle missing ranges gracefully
   - Support both single and multi-component queries

### Next Steps

1. Implement `DataLoader` class
2. Build `Source` integration
3. Test with real CSV data
4. Validate against Python version
5. Optimize for performance
6. Document thoroughly

This plan provides the foundation for a robust, type-safe TypeScript implementation that mirrors the Python package's functionality while leveraging TypeScript's strengths in type safety and modern JavaScript features.
