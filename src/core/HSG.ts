import { DataExtractor } from './DataExtractor';
import {
  En_IG_NASA9_polynomial,
  En_IG_NASA9_polynomial_ranges,
  En_IG_NASA7_polynomial,
  En_IG_NASA7_polynomial_ranges
} from '@/thermo/enthalpy';
import {
  S_IG_NASA9_polynomial,
  S_IG_NASA9_polynomial_ranges,
  S_IG_NASA7_polynomial,
  S_IG_NASA7_polynomial_ranges
} from '@/thermo/entropy';
import { GiFrEn_IG, GiFrEn_IG_ranges } from '@/thermo/gibbs';
import { Cp_IG_NASA9_polynomial, Cp_IG_NASA7_polynomial } from '@/thermo/heatCapacity';
import { requireCoeffs, toMassBasis } from '@/utils/tools';
import { setComponentId } from '@/utils/component';
import { BasisType, ComponentKey, NASARangeType, NASAType } from '@/types/constants';
import { ComponentEquationSource, Source, TemperatureRangeData } from '@/types/external';
import { Component, CustomProp, Temperature } from '@/types/models';

const REQ_COEFFS_NASA7 = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7'] as const;
const REQ_COEFFS_NASA9 = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'b1', 'b2'] as const;
const REQ_PROPS = ['MW'] as const;

export class HSG extends DataExtractor {
  componentId: string;
  basis: BasisType;
  component: Component;
  component_key: ComponentKey;

  nasa9_200_1000_coefficients?: TemperatureRangeData | null;
  nasa9_1000_6000_coefficients?: TemperatureRangeData | null;
  nasa9_6000_20000_coefficients?: TemperatureRangeData | null;
  nasa7_200_1000_coefficients?: TemperatureRangeData | null;
  nasa7_1000_6000_coefficients?: TemperatureRangeData | null;
  nasa7_6000_20000_coefficients?: TemperatureRangeData | null;

  private _props?: Record<string, number> | null;

  // NOTE: constructor
  constructor(opts: {
    source: Source;
    component: Component;
    component_key: ComponentKey;
    nasa_type: NASAType;
    basis?: BasisType;
  }) {
    super(opts.source);
    this.component = opts.component;
    this.component_key = opts.component_key;
    this.basis = opts.basis ?? 'molar';

    this.componentId = setComponentId({
      component: this.component,
      componentKey: this.component_key
    });

    // Extract NASA9 coefficients if specified
    if (opts.nasa_type === 'nasa9') {
      this.nasa9_200_1000_coefficients = this._extract_nasa_coefficients('nasa9_200_1000_K');
      this.nasa9_1000_6000_coefficients = this._extract_nasa_coefficients('nasa9_1000_6000_K');
      this.nasa9_6000_20000_coefficients = this._extract_nasa_coefficients('nasa9_6000_20000_K');
    }

    // Extract NASA7 coefficients if specified
    if (opts.nasa_type === 'nasa7') {
      this.nasa7_200_1000_coefficients = this._extract_nasa_coefficients('nasa7_200_1000_K');
      this.nasa7_1000_6000_coefficients = this._extract_nasa_coefficients('nasa7_1000_6000_K');
      this.nasa7_6000_20000_coefficients = this._extract_nasa_coefficients('nasa7_6000_20000_K');
    }
  }

  get props(): Record<string, number> | null | undefined {
    return this._props;
  }

  set props(value: Record<string, number> | null | undefined) {
    this._props = value;
  }

  private _extract_nasa_coefficients(prop_name: NASARangeType): TemperatureRangeData | null {
    const eq_src: ComponentEquationSource | null = this._get_equation_source({
      component: this.component,
      component_key: this.component_key,
      prop_name
    });
    if (!eq_src) {
      return null;
    }
    return eq_src.source;
  }

  private _set_props(coeffs: TemperatureRangeData): Record<string, number> | null {
    try {
      return requireCoeffs(coeffs, REQ_PROPS);
    } catch {
      return null;
    }
  }

  // NOTE: set NASA coefficients
  private _set_nasa_coefficients(nasa_type: NASARangeType): Record<string, number> | null {
    let coeffs: TemperatureRangeData | null | undefined;
    let pack: Record<string, number> | null = null;

    try {
      switch (nasa_type) {
        case 'nasa9_200_1000_K':
          coeffs = this.nasa9_200_1000_coefficients;
          pack = coeffs ? requireCoeffs(coeffs, REQ_COEFFS_NASA9) : null;
          break;
        case 'nasa9_1000_6000_K':
          coeffs = this.nasa9_1000_6000_coefficients;
          pack = coeffs ? requireCoeffs(coeffs, REQ_COEFFS_NASA9) : null;
          break;
        case 'nasa9_6000_20000_K':
          coeffs = this.nasa9_6000_20000_coefficients;
          pack = coeffs ? requireCoeffs(coeffs, REQ_COEFFS_NASA9) : null;
          break;
        case 'nasa7_200_1000_K':
          coeffs = this.nasa7_200_1000_coefficients;
          pack = coeffs ? requireCoeffs(coeffs, REQ_COEFFS_NASA7) : null;
          break;
        case 'nasa7_1000_6000_K':
          coeffs = this.nasa7_1000_6000_coefficients;
          pack = coeffs ? requireCoeffs(coeffs, REQ_COEFFS_NASA7) : null;
          break;
        case 'nasa7_6000_20000_K':
          coeffs = this.nasa7_6000_20000_coefficients;
          pack = coeffs ? requireCoeffs(coeffs, REQ_COEFFS_NASA7) : null;
          break;
        default:
          return null;
      }

      if (!coeffs || !pack) {
        return null;
      }

      this.props = this._set_props(coeffs);
      return pack;
    } catch {
      return null;
    }
  }

  // SECTION: Calculate absolute enthalpy
  calc_absolute_enthalpy(temperature: Temperature, nasa_type: NASARangeType): CustomProp | null {
    const pack = this._set_nasa_coefficients(nasa_type);
    if (!pack) return null;

    const isNASA9 = nasa_type.startsWith('nasa9');
    const enthalpy = isNASA9
      ? En_IG_NASA9_polynomial({ ...(pack as any), temperature })
      : En_IG_NASA7_polynomial({ ...(pack as any), temperature });

    if (!enthalpy) return null;
    if (this.basis === 'mass' && this.props && 'MW' in this.props) {
      return toMassBasis(enthalpy, this.props.MW);
    }
    return enthalpy;
  }

  // SECTION: Calculate absolute entropy
  calc_absolute_entropy(temperature: Temperature, nasa_type: NASARangeType): CustomProp | null {
    const pack = this._set_nasa_coefficients(nasa_type);
    if (!pack) return null;

    const isNASA9 = nasa_type.startsWith('nasa9');
    const entropy = isNASA9
      ? S_IG_NASA9_polynomial({ ...(pack as any), temperature })
      : S_IG_NASA7_polynomial({ ...(pack as any), temperature });

    if (!entropy) return null;
    if (this.basis === 'mass' && this.props && 'MW' in this.props) {
      return toMassBasis(entropy, this.props.MW);
    }
    return entropy;
  }

  // SECTION: Calculate Gibbs free energy
  calc_gibbs_free_energy(temperature: Temperature, nasa_type: NASARangeType): CustomProp | null {
    const pack = this._set_nasa_coefficients(nasa_type);
    if (!pack) return null;

    const method = nasa_type.includes('nasa9') ? 'NASA9' : 'NASA7';
    const gibbs =
      method === 'NASA9'
        ? GiFrEn_IG({ method, ...(pack as any), temperature })
        : GiFrEn_IG({ method, ...(pack as any), temperature });

    if (!gibbs) return null;
    if (this.basis === 'mass' && this.props && 'MW' in this.props) {
      return toMassBasis(gibbs, this.props.MW);
    }
    return gibbs;
  }

  // SECTION: Calculate heat capacity
  calc_heat_capacity(temperature: Temperature, nasa_type: NASARangeType): CustomProp | null {
    const pack = this._set_nasa_coefficients(nasa_type);
    if (!pack) return null;

    const isNASA9 = nasa_type.startsWith('nasa9');
    const heatCapacity = isNASA9
      ? Cp_IG_NASA9_polynomial({ ...(pack as any), temperature })
      : Cp_IG_NASA7_polynomial({ ...(pack as any), temperature });

    if (!heatCapacity) return null;
    if (this.basis === 'mass' && this.props && 'MW' in this.props) {
      return toMassBasis(heatCapacity, this.props.MW);
    }
    return heatCapacity;
  }

  // SECTION: Calculate enthalpy range
  calc_absolute_enthalpy_range(temperatures: Temperature[], nasa_type: NASARangeType) {
    const pack = this._set_nasa_coefficients(nasa_type);
    if (!pack) return null;

    const isNASA9 = nasa_type.startsWith('nasa9');
    const enthalpyRange = isNASA9
      ? En_IG_NASA9_polynomial_ranges({ ...(pack as any), temperatures })
      : En_IG_NASA7_polynomial_ranges({ ...(pack as any), temperatures });

    return enthalpyRange ?? null;
  }

  // SECTION: Calculate entropy range
  calc_absolute_entropy_range(temperatures: Temperature[], nasa_type: NASARangeType) {
    const pack = this._set_nasa_coefficients(nasa_type);
    if (!pack) return null;

    const isNASA9 = nasa_type.startsWith('nasa9');
    const entropyRange = isNASA9
      ? S_IG_NASA9_polynomial_ranges({ ...(pack as any), temperatures })
      : S_IG_NASA7_polynomial_ranges({ ...(pack as any), temperatures });

    return entropyRange ?? null;
  }

  // SECTION: Calculate Gibbs free energy range
  calc_gibbs_free_energy_range(temperatures: Temperature[], nasa_type: NASARangeType) {
    const pack = this._set_nasa_coefficients(nasa_type);
    if (!pack) return null;

    const method = nasa_type.includes('nasa9') ? 'NASA9' : 'NASA7';
    const gibbsRange = GiFrEn_IG_ranges({ method, ...(pack as any), temperatures });
    return gibbsRange ?? null;
  }
}
