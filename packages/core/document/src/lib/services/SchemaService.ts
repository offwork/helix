import { MarkSpec, NodeSpec } from '../interfaces/SchemaSpec';
import { MarkType } from '../value-objects/MarkType';
import { NodeType } from '../value-objects/NodeType';

export class SchemaService {
  readonly nodes: Record<string, NodeType>;
  readonly marks: Record<string, MarkType>;

  constructor(
    nodeSpec: Record<string, NodeSpec>,
    markSpec: Record<string, MarkSpec>
  ) {
    this.validateParameter('nodes spec', nodeSpec);
    this.validateParameter('marks spec', markSpec);

    this.nodes = {};
    this.marks = {};

    this.populateRegistry(nodeSpec, markSpec);
  }

  private populateRegistry(
    nodeSpec: Record<string, NodeSpec>,
    markSpec: Record<string, MarkSpec>
  ): void {
    for (const [name, spec] of Object.entries(nodeSpec)) {
      this.nodes[name] = new NodeType(name, this, spec);
    }

    for (const [name, spec] of Object.entries(markSpec)) {
      this.marks[name] = new MarkType(name, this, spec);
    }
  }

  private validateParameter(paramName: string, paramValue: unknown): void {
    if (paramValue === null) {
      throw new Error(`SchemaService ${paramName} cannot be null`);
    }

    if (paramValue === undefined) {
      throw new Error(`SchemaService ${paramName} cannot be undefined`);
    }
  }
}
