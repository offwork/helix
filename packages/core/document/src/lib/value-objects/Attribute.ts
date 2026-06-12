import { AttributeSpec } from '../interfaces/SchemaSpec';

export class Attribute {
  readonly hasDefault: boolean;
  readonly validate: ((value: unknown) => void) | undefined;

  constructor(public spec: AttributeSpec) {
    this.validateParameter('spec', spec);
    this.hasDefault = Object.prototype.hasOwnProperty.call(spec, 'default');

    if (typeof spec.validate === 'string') {
      const types = spec.validate.split('|');
      this.validate = (value: unknown) => {
        const typeName = value === null ? 'null' : typeof value;
        if (!types.includes(typeName))
          throw new RangeError(`Expected ${types}, got ${typeName}`);
      };
    } else {
      this.validate = spec.validate
    }
  }

  get isRequired(): boolean {
    return !this.hasDefault;
  }

  private validateParameter(
    parameterName: string,
    parameterValue: unknown
  ): void {
    if (parameterValue === null) {
      throw new Error(`Attribute ${parameterName} cannot be null`);
    }
    if (parameterValue === undefined) {
      throw new Error(`Attribute ${parameterName} cannot be undefined`);
    }
  }
}
