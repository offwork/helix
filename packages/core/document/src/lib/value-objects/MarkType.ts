import { MarkSpec } from '../interfaces/SchemaSpec';
import { Mark } from './Mark';

export class MarkType {
  readonly name: string;
  readonly schema: unknown;
  readonly spec: MarkSpec;
  excluded: readonly MarkType[] = [];
  rank = 0;

  constructor(name: string, schema: unknown, spec: MarkSpec) {
    this.validateParameter('name', name);
    this.validateParameter('schema', schema);
    this.validateParameter('spec', spec);

    this.name = name;
    this.schema = schema;
    this.spec = spec;
  }

  create(attrs?: Record<string, unknown>): Mark {
    return new Mark(this, attrs || {});
  }

  isInSet(set: readonly Mark[]): Mark | undefined {
    return set.find((mark) => mark.type === this);
  }

  removeFromSet(set: readonly Mark[]): readonly Mark[] {
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
  
  excludes(other: MarkType): boolean {
    return this.excluded.indexOf(other) > -1;
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
