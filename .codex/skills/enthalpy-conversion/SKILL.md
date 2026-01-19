---
name: enthalpy-conversion
description: Convert enthalpy values between units of energy or energy per amount (e.g., J, kJ, J/mol, kJ/mol, BTU/lb).
metadata:
  short-description: Enthalpy unit conversion guidance
---

# Enthalpy Unit Conversion Skill

## When to Trigger

This skill should be triggered when the user asks to:

- Convert an enthalpy or specific enthalpy value from one set of units to another.
- Provide a conversion factor between enthalpy units.
- Explain how to convert enthalpy units in code (e.g., in TypeScript or Python).

## Principles of Enthalpy Unit Conversion

1. **Enthalpy** is a thermodynamic quantity measured in units of energy in the SI system (joules, J) or energy per amount (e.g., J/mol). :contentReference[oaicite:1]{index=1}
2. Conversion between energy units follows standard multiplication by conversion factors. For example:
   - 1 kJ = 1000 J :contentReference[oaicite:2]{index=2}
   - 1 BTU ≈ 1055 J :contentReference[oaicite:3]{index=3}
3. For **molar units**, multiply the energy units by the relevant amount factor (e.g., per mole as J/mol). :contentReference[oaicite:4]{index=4}

## Instructions for Conversion Logic

When converting enthalpy values, follow these steps:

1. **Normalize the input value** into a base unit (e.g., J or J/mol):
   - If input is in kJ, multiply by 1000.
   - If input is in BTU, multiply by ~1055 to get J.
2. **Apply amount basis** if needed:
   - For per mass basis (e.g., kJ/kg), account for mass units.
   - For per mole basis (e.g., J/mol), keep the molar denominator.
3. **Convert to the target unit**:
   - Divide or multiply by appropriate factors based on the target unit.
4. **Return a clear result** with both the converted value and units.

## Output Format

When providing a conversion result, the assistant should reply with:

- A brief explanation of the conversion performed.
- The calculation showing conversion factors used.
- The final numeric result with units.

### Example Output Structure


## TypeScript Code Snippet Example

If asked to show a TypeScript implementation for this conversion:

```ts
function convertEnthalpy(
  value: number,
  fromUnit: 'J' | 'kJ' | 'BTU',
  toUnit: 'J' | 'kJ' | 'BTU'
): number {
  const toJ = {
    'J': 1,
    'kJ': 1000,
    'BTU': 1055, // approximate
  };

  const valueInJ = value * toJ[fromUnit];
  return valueInJ / toJ[toUnit];
}

// Usage:
const result = convertEnthalpy(10, 'kJ', 'J');
console.log(`${result} J`); // 10000 J


---

## 🧠 How This Skill Works

✔ **Triggering:** It activates when the user asks for enthalpy unit conversions or examples.
✔ **Conversion Logic:** It uses standard energy unit conversion factors like:
- 1 kJ = 1000 J :contentReference[oaicite:5]{index=5}
- 1 BTU ≈ 1055 J :contentReference[oaicite:6]{index=6}
✔ **Output:** Gives a clear explanation and example TypeScript implementation.



