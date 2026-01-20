import { ComponentKey } from '../types/constants';
import { ComponentEquationSource, Source } from '../types/external';
import { Component, NASA7Coefficients, NASA9Coefficients } from '../types/models';

/**
 * Minimal data extractor that defers to an injected Source implementation.
 */
export class DataExtractor {
  constructor(protected readonly source: Source) {}

  protected _get_equation_source(opts: {
    component: Component;
    component_key: ComponentKey;
    prop_name: string;
  }): ComponentEquationSource | null {
    return (
      this.source.getDataSource({
        component: opts.component,
        componentKey: opts.component_key,
        propName: opts.prop_name as any
      }) ?? null
    );
  }
}
