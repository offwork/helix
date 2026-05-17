import { Fragment } from '../entities/Fragment';
import { Node } from '../entities/Node';
import { TextNode } from '../entities/TextNode';
import { MarkSpec, NodeSpec, SchemaSpec } from '../interfaces/SchemaSpec';
import { ContentMatch } from '../value-objects/ContentMatch';
import { Mark } from '../value-objects/Mark';
import { MarkType } from '../value-objects/MarkType';
import { NodeType } from '../value-objects/NodeType';

export class Schema {
  readonly nodes: Record<string, NodeType>;
  readonly marks: Record<string, MarkType>;
  readonly topNodeType: NodeType;

  constructor(spec: SchemaSpec) {
    this.validateParameter('nodes spec', spec.nodes);
    this.validateParameter('marks spec', spec.marks);

    if (!spec.nodes['text']) {
      throw Error("Every schema needs a 'text' type");
    }

    if (!spec.nodes['doc']) {
      throw Error("Every schema needs a 'doc' type");
    }

    if (spec.marks) {
      const specs = Object.keys(spec.nodes).concat(Object.keys(spec.marks));

      specs.forEach((item, index) => {
        if (specs.indexOf(item) !== index) {
          throw Error(`${item} can not be both a node and a mark`);
        }
      });
    }

    this.nodes = {};
    this.marks = {};

    this.populateRegistry(spec.nodes, spec.marks ?? {});

    this.topNodeType = this.nodes[spec.topNode ?? 'doc'];

    for (const [, type] of Object.entries(this.nodes)) {
      type.contentMatch = ContentMatch.parse(
        type.spec.content || '',
        this.nodes
      );
      type.inlineContent = type.spec.inline === true;

      if (type.spec.marks === "") {
        type.markSet = [];
      }
    }
  }

  text(text: string, marks?: readonly Mark[]): TextNode {
    const textNode = new TextNode(this.nodes['text'], {}, text, marks ? [...marks] : []);
    return textNode;
  }

  node(type: string, attrs?: Record<string, unknown>, content?: Fragment<Node> | Node[], marks?: readonly Mark[]): Node {
    if (!this.nodes[type]) {
      throw new Error(`Unknown node type: "${type}"`);
    }

    const node = this.nodes[type].create(attrs, content, marks ? [...marks] : []);
    return node;
  }

  mark(type: string, attrs?: Record<string, unknown>): Mark {
    if (!this.marks[type]) {
      throw new Error(`Unknown mark type: "${type}"`);
    }

    const mark = this.marks[type].create(attrs);
    return mark;
  }

  private populateRegistry(
    nodeSpec: Record<string, NodeSpec>,
    markSpec: Record<string, MarkSpec>
  ): void {
    for (const [name, spec] of Object.entries(nodeSpec)) {
      this.nodes[name] = new NodeType(name, this, spec);
    }

    Object.entries(markSpec).forEach(([name, spec], index) => {
      this.marks[name] = new MarkType(name, this, spec);
      this.marks[name].rank = index;
      this.marks[name].excluded = spec.excludes === undefined ? [this.marks[name]] : [];
    });
  }

  private validateParameter(paramName: string, paramValue: unknown): void {
    if (paramValue === null) {
      throw new Error(`Schema ${paramName} cannot be null`);
    }

    if (paramName !== 'marks spec' && paramValue === undefined) {
      throw new Error(`Schema ${paramName} cannot be undefined`);
    }
  }
}
