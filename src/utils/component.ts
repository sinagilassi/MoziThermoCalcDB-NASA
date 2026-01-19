import { Component } from '../types/models';
import { ComponentKey } from '../types/constants';

/**
 * Basic component identifier helper mirroring Python set_component_id behavior.
 */
export function setComponentId(opts: { component: Component; componentKey: ComponentKey }): string {
  const { component, componentKey } = opts;
  if (componentKey === 'Name-Formula') {
    return `${component.name}-${component.formula}`;
  }
  if (componentKey === 'Formula-State') {
    return `${component.formula}-${component.state}`;
  }
  return component.name;
}
