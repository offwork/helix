import { NodeSpec } from '../interfaces/SchemaSpec';

export class NodeType {
  readonly name: string;
  readonly schema: unknown;
  readonly spec: NodeSpec;

  constructor(name: string, schema: unknown, spec: NodeSpec) {
    this.validateParameter('name', name);
    this.validateParameter('schema', schema);
    this.validateParameter('spec', spec);

    this.name = name;
    this.schema = schema;
    this.spec = spec;
  }

  equals(other: NodeType): boolean {
    if(other === null) {
      throw new Error('NodeType equals parameter cannot be null');
    }

    return this.name === other.name;
  }

  private validateParameter(paramName: string, paramValue: unknown): void {
    if (paramName === 'name') {
      if (!paramValue || (typeof paramValue === 'string' && paramValue.trim() === '')) {
        throw new Error(`NodeType ${paramName} cannot be empty`);
      }

      return;
    }

    if (paramValue === null) {
      throw new Error(`NodeType ${paramName} cannot be null`);
    }

    if (paramValue === undefined) {
      throw new Error(`NodeType ${paramName} cannot be undefined`);
    }
  }
}
