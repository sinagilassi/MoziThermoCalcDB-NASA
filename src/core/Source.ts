import { ComponentKey } from '../types/constants';
import { Component, Temperature } from '../types/models';
import { ComponentEquationSource, ModelSource, Source as SourceType } from '../types/external';

/**
 * Placeholder Source implementation. Replace with real data lookup in future work.
 */
export class Source implements SourceType {
  constructor(public readonly model_source: ModelSource, public readonly component_key: ComponentKey) {}

  // TODO: wire to actual data store
  getEquationSource(_args: {
    component: Component;
    componentKey: string;
    propName: string;
  }): ComponentEquationSource | null {
    return null;
  }
}
