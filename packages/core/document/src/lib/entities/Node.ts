import { Mark } from '../value-objects/Mark';
import { NodeType } from '../value-objects/NodeType';
import { Fragment } from './Fragment';

export class Node<TAttrs = Record<string, unknown>> {
  readonly type: NodeType;
  readonly attrs: TAttrs;
  readonly content: Fragment<Node>;
  readonly marks: Mark[];
  readonly text: string | undefined;

  constructor(
    type: NodeType,
    attrs: TAttrs,
    content?: Fragment<Node>,
    marks?: Mark[],
    text?: string
  ) {
    if (type === null) {
      throw new Error('Node type cannot be null');
    }

    if (type === undefined) {
      throw new Error('Node type cannot be undefined');
    }

    if (attrs === null) {
      throw new Error('Node attrs cannot be null');
    }

    if (attrs === undefined) {
      throw new Error('Node attrs cannot be undefined');
    }

    if (content === null) {
      throw new Error('Node content cannot be null');
    }

    if (marks === null) {
      throw new Error('Node marks cannot be null');
    }

    if (text === null) {
      throw new Error('Node text cannot be null');
    }

    if (typeof text === 'string' && text.trim() === '') {
      throw new Error('Node text cannot be empty');
    }

    this.type = type;
    this.attrs = attrs;
    this.content = content || Fragment.empty<Node>();
    this.marks = marks || [];
    this.text = text;
  }

  get childCount(): number {
    return this.content.childCount;
  }

  get nodeSize(): number {
    if (this.type.isLeaf) {
      return 1;
    }

    if (this.type.isText && this.text) {
      return this.text.length;
    }

    return 2 + this.content.size;
  }
}
