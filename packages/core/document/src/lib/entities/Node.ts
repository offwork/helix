import { Attrs } from '../utils/attrs';
import { deepEqual } from '../utils/deep-equal';
import { replace } from '../utils/replace';
import { ContentMatch } from '../value-objects/ContentMatch';
import { Mark } from '../value-objects/Mark';
import { MarkType } from '../value-objects/MarkType';
import { NodeType } from '../value-objects/NodeType';
import { ResolvedPos } from '../value-objects/ResolvedPos';
import { Slice } from '../value-objects/Slice';
import { empty } from './FragmentFactory';
import { Fragment } from './Fragment';
import type { INode } from './INode';

export class Node implements INode {
  readonly type: NodeType;
  readonly attrs: Record<string, unknown>;
  readonly content: Fragment;
  readonly marks: Mark[];

  constructor(
    type: NodeType,
    attrs: Record<string, unknown>,
    content?: Fragment,
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
    this.content = content || empty();
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

  get firstChild(): INode | undefined {
    return this.content.firstChild;
  }

  get lastChild(): INode | undefined {
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

  equals(other: INode): boolean {
    if (other === null) throw new Error('Node equals parameter cannot be null');

    if (other === undefined)
      throw new Error('Node equals parameter cannot be undefined');

    return (
      this === other ||
      (this.sameMarkup(other) && this.content.equals(other.content))
    );
  }

  copy(content?: Fragment): Node {
    if (content === this.content) return this;
    return new Node(
      this.type,
      this.attrs,
      content ?? empty(),
      this.marks
    );
  }

  cut(from: number, to: number = this.content.size): Node {
    if (from === 0 && to === this.content.size) return this;
    return this.copy(this.content.cut(from, to));
  }

  child(index: number): INode {
    return this.content.child(index);
  }

  maybeChild(index: number): INode | null {
    return this.content.maybeChild(index);
  }

  mark(marks: Mark[]): Node {
    if (marks === this.marks) return this;
    return new Node(this.type, this.attrs, this.content, marks);
  }

  sameMarkup(other: INode): boolean {
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

  forEach(callback: (node: INode, offset: number, index: number) => void): void {
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

  nodeAt(pos: number): INode | null {
    for (let node: INode | null = this as Node; ; ) {
      const { index, offset } = node.content.findIndex(pos);
      node = node.content.maybeChild(index);
      if (!node) return null;
      if (offset === pos || node.type.isText) return node;
      pos -= offset + 1;
    }
  }

  childAfter(pos: number): {
    node: INode | null;
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
    node: INode | null;
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
    replacement = empty(),
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

  nodesBetween(
    from: number,
    to: number,
    callback: (
      node: INode,
      pos: number,
      parent: INode | null,
      index: number
    ) => void | boolean,
    startPos = 0
  ): void {
    this.content.nodesBetween(from, to, callback, startPos, this as INode);
  }

  rangeHasMark(from: number, to: number, type: Mark | MarkType): boolean {
    let found = false;
    if (to > from) {
      this.nodesBetween(from, to, (node) => {
        if (type.isInSet(node.marks)) found = true;
        return !found;
      });
    }
    return found;
  }

  canReplaceWith(
    from: number,
    to: number,
    type: NodeType,
    marks?: readonly Mark[]
  ): boolean {
    if (marks && !this.type.allowsMarks(marks)) return false;
    const start = this.contentMatchAt(from).matchType(type);
    const end = start && start.matchFragment(this.content, to);
    return end ? end.validEnd : false;
  }

  canAppend(other: Node): boolean {
    if (other.content.size) {
      return this.canReplace(this.childCount, this.childCount, other.content);
    }
    return this.type.compatibleContent(other.type);
  }

  check(): void {
    this.type.checkContent(this.content);
    this.type.checkAttrs(this.attrs as Attrs);
    let copy: readonly Mark[] = Mark.none;
    for (let i = 0; i < this.marks.length; i++) {
      const mark = this.marks[i];
      mark.type.checkAttrs(mark.attrs);
      copy = mark.addToSet(copy);
    }
    if (!Mark.sameSet(copy, this.marks)) {
      throw new RangeError(
        `Invalid collection of marks for node ${
          this.type.name
        }: ${this.marks.map((m) => m.type.name)}`
      );
    }
    this.content.forEach((node) => node.check());
  }

  resolve(pos: number): ResolvedPos {
    return this.resolveNoCache(pos);
  }

  replace(from: number, to: number, slice: Slice): Node {
    return replace(this.resolve(from), this.resolve(to), slice);
  }

  slice(
    from: number,
    to: number = this.content.size,
    includeParents = false
  ): Slice {
    if (from === to) return Slice.empty;
    const $from = this.resolve(from);
    const $to = this.resolve(to);
    const depth = includeParents ? 0 : $from.sharedDepth(to);
    const start = $from.start(depth);
    const node = $from.node(depth);
    const content = node.content.cut($from.pos - start, $to.pos - start);
    return new Slice(content, $from.depth - depth, $to.depth - depth);
  }
}
