import { AttributeSpec } from "../interfaces/SchemaSpec";

export class Attribute {
  readonly hasDefault: boolean;
  constructor(public spec: AttributeSpec) {
    this.validateParameter('spec', spec);
    this.hasDefault = Object.prototype.hasOwnProperty.call(spec, 'default');
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
