import { NodeSpec } from '../interfaces/SchemaSpec';

export class NodeType {
  readonly name: string;
  readonly schema: unknown;
  readonly spec: NodeSpec;

  constructor(name: string, schema: unknown, spec: NodeSpec) {
    if (!name || name.trim() === '') {
      throw new Error('NodeType name cannot be empty');
    }
    this.name = name;
    this.schema = schema;
    this.spec = spec;
  }

  equals(other: NodeType): boolean {
    return this.name === other.name;
  }
}
