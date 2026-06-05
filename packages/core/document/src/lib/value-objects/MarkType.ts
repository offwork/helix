import { MarkSpec } from '../interfaces/SchemaSpec';
import { Attrs, checkAttrs } from '../utils/attrs';
import { Attribute } from './Attribute';
import type { IMark } from '../contracts/IMark';
import type { IMarkType } from '../contracts/IMarkType';
import { Mark } from './Mark';

export class MarkType implements IMarkType {
  readonly name: string;
  readonly schema: unknown;
  readonly spec: MarkSpec;
  readonly attrs: Record<string, Attribute>;
  excluded: readonly IMarkType[] = [];
  rank = 0;

  constructor(name: string, schema: unknown, spec: MarkSpec) {
    this.validateParameter('name', name);
    this.validateParameter('schema', schema);
    this.validateParameter('spec', spec);

    this.name = name;
    this.schema = schema;
    this.spec = spec;
    this.attrs = {};

    if (spec.attrs) {
      for (const [attrName, attrSpec] of Object.entries(spec.attrs)) {
        this.attrs[attrName] = new Attribute(attrSpec);
      }
    }
  }

  create(attrs?: Record<string, unknown>): Mark {
    return new Mark(this, attrs || {});
  }

  isInSet(set: readonly IMark[]): IMark | undefined {
    return set.find((mark) => mark.type === this);
  }

  removeFromSet(set: readonly IMark[]): readonly IMark[] {
    for (let i = 0; i < set.length; i++) {
      if (set[i].type === this) {
        return set.slice(0, i).concat(set.slice(i + 1));
      }
    }

    return set;
  }

  equals(other: MarkType): boolean {
    if (other === null) {
      throw new Error('MarkType equals parameter cannot be null');
    }

    return this.name === other.name;
  }

  excludes(other: IMarkType): boolean {
    return this.excluded.indexOf(other) > -1;
  }

  checkAttrs(attrs: Attrs): void {
    checkAttrs(this.attrs, attrs, 'mark', this.name);
  }

  private validateParameter(paramName: string, paramValue: unknown): void {
    if (paramName === 'name') {
      if (
        !paramValue ||
        (typeof paramValue === 'string' && paramValue.trim() === '')
      ) {
        throw new Error('MarkType name cannot be empty');
      }

      return;
    }

    if (paramValue === null) {
      throw new Error(`MarkType ${paramName} cannot be null`);
    }

    if (paramValue === undefined) {
      throw new Error(`MarkType ${paramName} cannot be undefined`);
    }
  }
}
