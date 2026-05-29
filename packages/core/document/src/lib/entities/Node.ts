import { deepEqual } from '../utils/deep-equal';
import { ContentMatch } from '../value-objects/ContentMatch';
import { Mark } from '../value-objects/Mark';
import { NodeType } from '../value-objects/NodeType';
import { ResolvedPos } from '../value-objects/ResolvedPos';
import { Fragment } from './Fragment';

export class Node<TAttrs = Record<string, unknown>> {
  readonly type: NodeType;
  readonly attrs: TAttrs;
  readonly content: Fragment<Node>;
  readonly marks: Mark[];

  constructor(
    type: NodeType,
    attrs: TAttrs,
    content?: Fragment<Node>,
    marks?: Mark[]
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

    if (marks === null) {
      throw new Error('Node marks cannot be null');
    }

    this.type = type;
    this.attrs = attrs;
    this.content = content || Fragment.empty<Node>();
    this.marks = marks || [];
  }

  get childCount(): number {
    return this.content.childCount;
  }

  get nodeSize(): number {
    if (this.type.isLeaf) {
      return 1;
    }

    return 2 + this.content.size;
  }

  get firstChild(): Node | undefined {
    return this.content.firstChild;
  }

  get lastChild(): Node | undefined {
    return this.content.lastChild;
  }

  get isBlock(): boolean {
    return this.type.isBlock;
  }

  get isInline(): boolean {
    return this.type.isInline;
  }

  get isText(): boolean {
    return this.type.isText;
  }

  get isLeaf(): boolean {
    return this.type.isLeaf;
  }

  get isAtom(): boolean {
    return this.type.isAtom;
  }

  get isTextblock(): boolean {
    return this.type.isTextblock;
  }

  get inlineContent(): boolean | null {
    return this.type.inlineContent;
  }

  equals(other: Node): boolean {
    if (other === null) throw new Error('Node equals parameter cannot be null');

    if (other === undefined)
      throw new Error('Node equals parameter cannot be undefined');

    return (
      this === other ||
      (this.sameMarkup(other) && this.content.equals(other.content))
    );
  }

  copy(content?: Fragment<Node>): Node<TAttrs> {
    if (content === this.content) return this;
    return new Node(
      this.type,
      this.attrs,
      content ?? Fragment.empty<Node>(),
      this.marks
    );
  }

  cut(from: number, to: number = this.content.size): Node<TAttrs> {
    if (from === 0 && to === this.content.size) return this;
    return this.copy(this.content.cut(from, to));
  }

  child(index: number): Node {
    return this.content.child(index);
  }

  maybeChild(index: number): Node | null {
    return this.content.maybeChild(index);
  }

  mark(marks: Mark[]): Node<TAttrs> {
    if (marks === this.marks) return this;
    return new Node(this.type, this.attrs, this.content, marks);
  }

  sameMarkup(other: Node): boolean {
    return this.hasMarkup(other.type, other.attrs, other.marks);
  }

  hasMarkup(
    type: NodeType,
    attrs?: Record<string, unknown>,
    marks?: readonly Mark[]
  ): boolean {
    return (
      this.type === type &&
      deepEqual(this.attrs, attrs ?? {}) &&
      Mark.sameSet(this.marks, marks ?? Mark.none)
    );
  }

  forEach(callback: (node: Node, offset: number, index: number) => void): void {
    this.content.forEach(callback);
  }

  contentMatchAt(index: number): ContentMatch {
    const match = this.type.contentMatch?.matchFragment(this.content, 0, index);

    if (!match) {
      throw new Error('Called contentMatchAt on a node with invalid content');
    }

    return match;
  }

  resolveNoCache(pos: number): ResolvedPos {
    return ResolvedPos.resolve(this as Node, pos);
  }

  nodeAt(pos: number): Node | null {
    for (let node: Node | null = this as Node; ; ) {
      const { index, offset } = node.content.findIndex(pos);
      node = node.content.maybeChild(index);
      if (!node) return null;
      if (offset === pos || node.type.isText) return node;
      pos -= offset + 1;
    }
  }

  childAfter(pos: number): {
    node: Node | null;
    index: number;
    offset: number;
  } {
    const { index, offset } = this.content.findIndex(pos);
    return {
      node: this.content.maybeChild(index),
      index,
      offset,
    };
  }

  childBefore(pos: number): {
    node: Node | null;
    index: number;
    offset: number;
  } {
    return pos == 0
      ? { node: null, index: 0, offset: 0 }
      : this.childAfter(pos - 1);
  }

  toString(): string {
    return this.type.name;
  }

  canReplace(
    from: number,
    to: number,
    replacement: Fragment<Node> = Fragment.empty<Node>(),
    start = 0,
    end = replacement.childCount
  ): boolean {
    const one = this.contentMatchAt(from).matchFragment(
      replacement,
      start,
      end
    );
    const two = one && one.matchFragment(this.content, to);
    if (!two || !two.validEnd) return false;
    for (let i = start; i < end; i++) {
      if (!this.type.allowsMarks(replacement.child(i).marks)) return false;
    }
    return true;
  }
}
