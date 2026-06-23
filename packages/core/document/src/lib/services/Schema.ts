import { Fragment } from '../entities/Fragment';
import { Node } from '../entities/Node';
import { TextNode } from '../entities/TextNode';
import { MarkSpec, NodeSpec, SchemaSpec } from '../interfaces/SchemaSpec';
import { ContentMatch } from '../value-objects/ContentMatch';
import type { IMark } from '../contracts/IMark';
import type { INode } from '../contracts/INode';
import { MarkType } from '../value-objects/MarkType';
import { NodeType } from '../value-objects/NodeType';
import { NodeJSON } from '../contracts/types/NodeJSON';
import { OrderedMap } from '../value-objects/OrderedMap';

export class Schema {
  readonly nodes: Record<string, NodeType>;
  readonly marks: Record<string, MarkType>;
  readonly cached: Record<string, unknown> = {};
  readonly linebreakReplacement: NodeType | null = null;
  readonly topNodeType: NodeType;
  readonly spec: SchemaSpec;
  readonly nodeFromJSON: (json: NodeJSON) => Node;
  readonly markFromJSON: (json: {
    type: string;
    attrs?: Record<string, unknown>;
  }) => IMark;

  constructor(spec: SchemaSpec) {
    this.validateParameter('nodes spec', spec.nodes);
    this.validateParameter('marks spec', spec.marks);

    const nodes = OrderedMap.from(spec.nodes);
    const marks = OrderedMap.from(spec.marks ?? {});

    if (!nodes.get('text')) {
      throw Error("Every schema needs a 'text' type");
    }

    if (!nodes.get('doc')) {
      throw Error("Every schema needs a 'doc' type");
    }

    if (marks) {
      const names: string[] = [];
      nodes.forEach((name) => names.push(name));
      marks.forEach((name) => names.push(name));

      names.forEach((item, index) => {
        if (names.indexOf(item) !== index) {
          throw Error(`${item} can not be both a node and a mark`);
        }
      });
    }

    this.nodes = {};
    this.marks = {};

    this.populateRegistry(nodes, marks);

    this.topNodeType = this.nodes[spec.topNode ?? 'doc'];

    for (const [, type] of Object.entries(this.nodes)) {
      type.contentMatch = ContentMatch.parse(
        type.spec.content || '',
        this.nodes
      );
      type.inlineContent = type.contentMatch.inlineContent;

      if (type.spec.marks === '') {
        type.markSet = [];
      }

      if (type.spec.linebreakReplacement) {
        if (this.linebreakReplacement)
          throw new RangeError('Multiple linebreak nodes defined');
        if (!type.isInline || !type.isLeaf)
          throw new RangeError(
            'Linebreak replacement nodes must be inline leaf nodes'
          );
        this.linebreakReplacement = type;
      }
    }

    this.nodeFromJSON = (json) => Node.fromJSON(this, json);
    this.markFromJSON = (json: {
      type: string;
      attrs?: Record<string, unknown>;
    }) => {
      return this.marks[json.type].create(json.attrs);
    };

    this.spec = spec;
  }

  text(text: string, marks?: readonly IMark[]): TextNode {
    const textNode = new TextNode(
      this.nodes['text'],
      {},
      text,
      marks ? [...marks] : []
    );
    return textNode;
  }

  node(
    type: string,
    attrs?: Record<string, unknown>,
    content?: Fragment | INode[],
    marks?: readonly IMark[]
  ): Node {
    if (!this.nodes[type]) {
      throw new Error(`Unknown node type: "${type}"`);
    }

    const node = this.nodes[type].create(
      attrs,
      content,
      marks ? [...marks] : []
    );
    return node;
  }

  nodeType(type: string): NodeType {
    if (!this.nodes[type]) {
      throw new RangeError(`Unknown node type: ${type}`);
    }

    return this.nodes[type];
  }

  mark(type: string, attrs?: Record<string, unknown>): IMark {
    if (!this.marks[type]) {
      throw new Error(`Unknown mark type: "${type}"`);
    }

    const mark = this.marks[type].create(attrs);
    return mark;
  }

  private populateRegistry(
    nodeSpec: OrderedMap<NodeSpec>,
    markSpec: OrderedMap<MarkSpec>
  ): void {
    nodeSpec.forEach((name, spec) => {
      this.nodes[name] = new NodeType(name, this, spec);
    });

    let index = 0;
    markSpec.forEach((name, spec) => {
      this.marks[name] = new MarkType(name, this, spec);
      this.marks[name].rank = index++;
      this.marks[name].excluded =
        spec.excludes === undefined ? [this.marks[name]] : [];
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
