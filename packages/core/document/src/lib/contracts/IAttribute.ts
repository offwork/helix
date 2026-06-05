import type { AttributeSpec } from '../interfaces/SchemaSpec';

export interface IAttribute {
  readonly hasDefault: boolean;
  readonly isRequired: boolean;
  readonly spec: AttributeSpec;
}
