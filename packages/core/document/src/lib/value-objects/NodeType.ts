import { Fragment } from '../entities/Fragment';
import { Node } from '../entities/Node';
import { NodeSpec } from '../interfaces/SchemaSpec';
import { Attribute } from './Attribute';
import { ContentMatch } from './ContentMatch';
import { Mark } from './Mark';
import { MarkType } from './MarkType';

export class NodeType {
  readonly name: string;
  readonly schema: unknown;
  readonly spec: NodeSpec;
  readonly attrs: Record<string, Attribute>;

  contentMatch: ContentMatch | null = null;
  inlineContent: boolean | null = null;
  markSet: readonly MarkType[] | null = null;

  constructor(name: string, schema: unknown, spec: NodeSpec) {
    this.validateParameter('name', name);
    this.validateParameter('schema', schema);
    this.validateParameter('spec', spec);

    this.attrs = {};
    if (spec.attrs) {
      for (const [attrName, attrSpec] of Object.entries(spec.attrs)) {
        this.attrs[attrName] = new Attribute(attrSpec);
      }
    }

    this.name = name;
    this.schema = schema;
    this.spec = spec;
  }

  equals(other: NodeType): boolean {
    if (other === null) {
      throw new Error('NodeType equals parameter cannot be null');
    }

    return this.name === other.name;
  }

  allowsMarkType(markType: MarkType): boolean {
    return this.markSet === null || this.markSet.indexOf(markType) > -1;
  }

  allowsMarks(marks: Mark[]): boolean {
    if (this.markSet === null) return true;
    return marks.every(
      (mark) => this.markSet && this.markSet.indexOf(mark.type) > -1
    );
  }

  allowedMarks(marks: readonly Mark[]): readonly Mark[] {
    if (this.markSet === null) return marks;
    let copy: Mark[] | null = null;
    for (let i = 0; i < marks.length; i++) {
      if (this.markSet.indexOf(marks[i].type) > -1) {
        if (copy) copy.push(marks[i] as Mark);
      } else {
        if (!copy) copy = marks.slice(0, i) as Mark[];
      }
    }
    return !copy ? marks : copy.length ? copy : Mark.none;
  }

  get isLeaf(): boolean {
    return this.contentMatch === ContentMatch.empty;
  }

  get isText(): boolean {
    return this.name === 'text';
  }

  get isBlock(): boolean {
    return !(this.name === 'text' || this.spec.inline);
  }

  get isInline(): boolean {
    return !this.isBlock;
  }

  get isTextblock(): boolean {
    return this.isBlock && this.inlineContent === true;
  }

  get isAtom(): boolean {
    return this.isLeaf || this.spec.atom === true;
  }

  get whitespace(): 'normal' | 'pre' {
    return this.spec.code ? 'pre' : this.spec.whitespace || 'normal';
  }

  create(
    attrs?: Record<string, unknown>,
    content?: Fragment<Node> | Node[],
    marks?: Mark[]
  ): Node {
    if (this.isText)
      throw new Error('NodeType.create cannot construct text nodes');

    const nodes = Array.isArray(content)
      ? Fragment.from(content)
      : content || Fragment.empty<Node>();

    return new Node(this, attrs || {}, nodes, marks || []);
  }

  createAndFill(
    attrs?: Record<string, unknown>,
    content?: Fragment<Node> | Node[],
    marks?: Mark[]
  ): Node | null {
    if (this.isText)
      throw new Error('NodeType.createAndFill cannot construct text nodes');

    let nodes = Array.isArray(content)
      ? Fragment.from(content)
      : content ?? Fragment.empty<Node>();

    if (nodes.size) {
      const before = this.contentMatch?.fillBefore(nodes);
      if (!before) return null;
      nodes = before.append(nodes);
    }

    const matched = this.contentMatch?.matchFragment(nodes);
    const after = matched && matched.fillBefore(Fragment.empty(), true);
    if (!after) return null;

    return new Node(this, attrs || {}, nodes.append(after), marks || []);
  }

  hasRequiredAttrs(): boolean {
    for (const attr of Object.values(this.attrs)) {
      if (attr.isRequired) {
        return true;
      }
    }
    return false;
  }

  isInGroup(name: string): boolean {
    if (!this.spec.group) return false;

    return this.spec.group.split(' ').includes(name);
  }

  validContent(content: Fragment<Node>): boolean {
    if (content === null)
      throw new Error('NodeType validContent parameter cannot be null');

    if (content === undefined)
      throw new Error('NodeType validContent parameter cannot be undefined');

    const result = this.contentMatch?.matchFragment(content);
    if (!result || !result.validEnd) return false;

    for (let i = 0; i < content.childCount; i++) {
      if (!this.allowsMarks(content.child(i).marks)) return false
    }

    return true;
  }

  createChecked(attrs?: Record<string, unknown>, content?: Fragment<Node> | Node[], marks?: Mark[]): Node {
    const node = this.create(attrs, content, marks);
    this.checkContent(node.content);
    return node;
  }

  compatibleContent(other: NodeType): boolean {
    return this === other || this.contentMatch?.compatible(other.contentMatch ?? ContentMatch.empty) === true;
  }

  private checkContent(content: Fragment<Node>): void {
    if (!this.validContent(content)) {
      throw new RangeError(
        `Invalid content for node ${this.name}: ${content.toString()}`
      );
    }
  }

  private validateParameter(paramName: string, paramValue: unknown): void {
    if (paramName === 'name') {
      if (
        !paramValue ||
        (typeof paramValue === 'string' && paramValue.trim() === '')
      ) {
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
