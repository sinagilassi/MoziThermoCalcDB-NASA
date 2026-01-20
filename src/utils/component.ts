import { Component } from '@/types/models';
import { ComponentKey } from '@/types/constants';

/**
 * Basic component identifier helper mirroring Python set_component_id behavior.
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
