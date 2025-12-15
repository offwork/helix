import { MarkSpec } from '../interfaces/SchemaSpec';

export class MarkType {
  readonly name: string;
  readonly schema: unknown;
  readonly spec: MarkSpec;

  constructor(name: string, schema: unknown, spec: MarkSpec) {
    this.validateParameter('name', name);
    this.validateParameter('schema', schema);
    this.validateParameter('spec', spec);

    this.name = name;
    this.schema = schema;
    this.spec = spec;
  }

  equals(other: MarkType): boolean {
    if (other === null) {
      throw new Error('MarkType equals parameter cannot be null');
    }

    return this.name === other.name;
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
