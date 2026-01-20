import { Component } from '@/types/models';
import { ComponentKey } from '@/types/constants';

/**
 * Basic component identifier helper mirroring Python set_component_id behavior.
 * @returns The component ID string based on the specified key.
 * @param opts.component The component object.
 * @param opts.componentKey The component key type to use for ID generation.
 *
 * Example:
 * ```ts
 * const component: Component = { name: 'dihydrogen', formula: 'H2', state: 'g' };
 * const componentId = setComponentId({ component, componentKey: 'Formula-State' });
 * console.log(componentId); // Outputs: "H2-g"
 * ```
 */
export function setComponentId(opts: { component: Component; componentKey: ComponentKey }): string {
  const { component, componentKey } = opts;

  // NOTE: set component id
  switch (componentKey) {
    case 'Name-Formula':
      return `${component.name}-${component.formula}`;
    case 'Formula-State':
      return `${component.formula}-${component.state}`;
    case 'Name-State':
    default:
      return `${component.name}-${component.state}`;
  }
}
