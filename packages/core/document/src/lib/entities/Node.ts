import { Attrs } from '../utils/attrs';
import { deepEqual } from '../utils/deep-equal';
import { replace } from '../utils/replace';
import { Mark } from '../value-objects/Mark';
import { ResolvedPos } from '../value-objects/ResolvedPos';
import { Slice } from '../value-objects/Slice';
import { Fragment } from './Fragment';
import type { IContentMatch } from '../contracts/IContentMatch';
import type { IFragment } from '../contracts/IFragment';
import type { IMark } from '../contracts/IMark';
import type { IMarkType } from '../contracts/IMarkType';
import type { INode } from '../contracts/INode';
import type { INodeType } from '../contracts/INodeType';
import type { ISlice } from '../contracts/ISlice';
import { SyntheticSchema } from '../contracts/types/SyntheticSchema';
import { NodeJSON } from '../contracts/types/NodeJSON';

export class Node implements INode {
  readonly type: INodeType;
  readonly attrs: Record<string, unknown>;
  readonly content: Fragment;
  readonly marks: IMark[];

  constructor(
    type: INodeType,
    attrs: Record<string, unknown>,
    content?: Fragment,
    marks?: IMark[]
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
    this.content = content || Fragment.empty();
    this.marks = marks || [];
  }

  static fromJSON(schema: SyntheticSchema, json: NodeJSON): Node {
    if (!json) throw new RangeError('Invalid input for Node.fromJSON');
    const marks = json.marks?.map((m) => schema.markFromJSON(m)) ?? [];
    if (json.type === 'text')
      return schema.text(json.text ?? '', marks) as Node;
    const content = Fragment.from(
      (json.content ?? []).map((c) => schema.nodeFromJSON(c))
    );
    return schema.nodeType(json.type).create(json.attrs, content, marks);
  }

  get childCount(): number {
    return this.content.childCount;
  }

  get children(): INode[] {
    return this.content.toArray();
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

  copy(content?: IFragment): Node {
    if (content === this.content) return this;
    return new Node(
      this.type,
      this.attrs,
      (content as Fragment) ?? Fragment.empty(),
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

  descendants(
    callback: (
      node: INode,
      pos: number,
      parent: INode | null,
      index: number
    ) => boolean | void
  ): void {
    this.nodesBetween(0, this.content.size, callback);
  }

  maybeChild(index: number): INode | null {
    return this.content.maybeChild(index);
  }

  mark(marks: IMark[]): Node {
    if (marks === this.marks) return this;
    return new Node(this.type, this.attrs, this.content, marks);
  }

  sameMarkup(other: INode): boolean {
    return this.hasMarkup(other.type, other.attrs, other.marks);
  }

  hasMarkup(
    type: INodeType,
    attrs?: Record<string, unknown>,
    marks?: readonly IMark[]
  ): boolean {
    return (
      this.type === type &&
      deepEqual(this.attrs, attrs ?? {}) &&
      Mark.sameSet(this.marks, marks ?? Mark.none)
    );
  }

  forEach(
    callback: (node: INode, offset: number, index: number) => void
  ): void {
    this.content.forEach(callback);
  }

  contentMatchAt(index: number): IContentMatch {
    const match = this.type.contentMatch?.matchFragment(this.content, 0, index);

    if (!match) {
      throw new Error('Called contentMatchAt on a node with invalid content');
    }

    return match;
  }

  resolveNoCache(pos: number): ResolvedPos {
    return ResolvedPos.resolve(this, pos);
  }

  nodeAt(pos: number): INode | null {
    const { index: firstIndex, offset: firstOffset } =
      this.content.findIndex(pos);
    let child: INode | null = this.content.maybeChild(firstIndex);
    let remaining = pos;
    let offset = firstOffset;

    while (child) {
      if (offset === remaining || child.type.isText) return child;
      remaining -= offset + 1;
      const { index, offset: nextOffset } = child.content.findIndex(remaining);
      offset = nextOffset;
      child = child.content.maybeChild(index);
    }

    return null;
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
    replacement = Fragment.empty(),
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

  rangeHasMark(from: number, to: number, type: IMark | IMarkType): boolean {
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
    type: INodeType,
    marks?: readonly IMark[]
  ): boolean {
    if (marks && !this.type.allowsMarks(marks)) return false;
    const start = this.contentMatchAt(from).matchType(type);
    const end = start && start.matchFragment(this.content, to);
    return end ? end.validEnd : false;
  }

  canAppend(other: INode): boolean {
    if (other.content.size) {
      return this.canReplace(
        this.childCount,
        this.childCount,
        other.content as Fragment
      );
    }
    return this.type.compatibleContent(other.type);
  }

  check(): void {
    this.type.checkContent(this.content);
    this.type.checkAttrs(this.attrs as Attrs);
    let copy: readonly IMark[] = Mark.none;
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
    return ResolvedPos.resolveCached(this, pos);
  }

  replace(from: number, to: number, slice: ISlice): Node {
    return replace(
      this.resolve(from),
      this.resolve(to),
      slice as Slice
    ) as Node;
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
    const content = node.content.cut(
      $from.pos - start,
      $to.pos - start
    ) as Fragment;
    return new Slice(content, $from.depth - depth, $to.depth - depth);
  }

  toJSON(): NodeJSON {
    const json: NodeJSON = {
      type: this.type.name,
    };

    if (Object.keys(this.attrs).length > 0) {
      json.attrs = { ...this.attrs };
    }

    if (this.marks.length > 0) {
      json.marks = this.marks.map((mark) => mark.toJSON());
    }

    if (this.content.size > 0) {
      json.content = [];
      this.content.forEach((node) => {
        (json.content as NodeJSON[]).push(node.toJSON());
      });
    }

    return json;
  }
}
