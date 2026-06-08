import { IMark } from '../contracts';
import type { INode } from '../contracts/INode';

export class ResolvedPos {
  constructor(
    public readonly pos: number,
    public readonly path: (INode | number)[],
    public readonly parentOffset: number
  ) {
    this.validateParameters('pos', pos);
    this.validateParameters('path', path);
    this.validateParameters('parentOffset', parentOffset);
  }

  get depth(): number {
    return this.path.length / 3 - 1;
  }

  get doc(): INode {
    return this.node(0);
  }

  get parent(): INode {
    return this.node();
  }

  get textOffset(): number {
    return this.pos - (this.path[this.path.length - 1] as number);
  }

  get nodeAfter(): INode | null {
    if (this.index() === this.parent.childCount) return null;
    const child = this.parent.content.child(this.index());
    return this.textOffset ? child.cut(this.textOffset) : child;
  }

  get nodeBefore(): INode | null {
    const parent = this.parent;
    if (this.textOffset > 0) {
      const child = parent.content.child(this.index());
      return child.cut(0, this.textOffset);
    }

    if (this.index() == 0) return null;
    return parent.content.child(this.index() - 1);
  }

  static resolve(doc: INode, pos: number): ResolvedPos {
    if (!(pos >= 0 && pos <= doc.content.size)) {
      throw new RangeError(`Position ${pos} out of range`);
    }

    const path: (INode | number)[] = [];
    let start = 0,
      parentOffset = pos;

    for (let node = doc; ; ) {
      const { index, offset } = node.content.findIndex(parentOffset);
      const rem = parentOffset - offset;
      path.push(node, index, start + offset);
      if (!rem) break;
      node = node.content.child(index);
      if (node.type.isText) break;
      parentOffset = rem - 1;
      start += offset + 1;
    }

    return new ResolvedPos(pos, path, parentOffset);
  }

  index(depth?: number | null): number {
    const resolvedDepth = this.resolveDepth(depth);
    return this.path[resolvedDepth * 3 + 1] as number;
  }

  node(depth?: number | null): INode {
    const resolvedDepth = this.resolveDepth(depth);
    return this.path[resolvedDepth * 3] as INode;
  }

  start(depth?: number | null): number {
    const resolvedDepth = this.resolveDepth(depth);
    return resolvedDepth === 0
      ? 0
      : (this.path[resolvedDepth * 3 - 1] as number) + 1;
  }

  end(depth?: number | null): number {
    const node = this.node(depth);
    return this.start(depth) + node.content.size;
  }

  before(depth?: number | null): number {
    const resolvedDepth = this.resolveDepth(depth);
    if (resolvedDepth === 0) {
      throw new Error('There is no position before the top-level node');
    }

    if (resolvedDepth === this.depth + 1) return this.pos;

    return this.path[resolvedDepth * 3 - 1] as number;
  }

  after(depth?: number | null): number {
    const resolvedDepth = this.resolveDepth(depth);
    if (resolvedDepth === 0) {
      throw new Error('There is no position after the top-level node');
    }

    if (resolvedDepth === this.depth + 1) return this.pos;

    return (
      (this.path[resolvedDepth * 3 - 1] as number) +
      (this.path[resolvedDepth * 3] as INode).nodeSize
    );
  }

  indexAfter(depth?: number | null): number {
    const resolvedDepth = this.resolveDepth(depth);
    return (
      this.index(resolvedDepth) +
      (resolvedDepth == this.depth && !this.textOffset ? 0 : 1)
    );
  }

  sameParent(other: ResolvedPos): boolean {
    return this.pos - this.parentOffset === other.pos - other.parentOffset;
  }

  sharedDepth(pos: number): number {
    for (let depth = this.depth; depth > 0; depth--) {
      if (this.start(depth) <= pos && this.end(depth) >= pos) {
        return depth;
      }
    }
    return 0;
  }

  max(other: ResolvedPos): ResolvedPos {
    return this.pos > other.pos ? this : other;
  }

  min(other: ResolvedPos): ResolvedPos {
    return this.pos < other.pos ? this : other;
  }

  marksAcross($end: ResolvedPos): readonly IMark[] | null {
    const after = this.parent.maybeChild(this.index());
    if (!after || !after.isInline) return null;

    let marks: readonly IMark[] = after.marks;
    const next = $end.parent.maybeChild($end.index());
    for (let i = 0; i < marks.length; i++) {
      if (
        marks[i].type.inclusive === false &&
        (!next || !marks[i].isInSet(next.marks))
      ) {
        marks = marks[i--].removeFromSet(marks);
      }
    }
    return marks;
  }

  marks(): readonly IMark[] {
    const parent = this.parent;
    const index = this.index();

    if (parent.content.size === 0) return [];
    if (this.textOffset) return parent.child(index).marks;

    let main = parent.maybeChild(index - 1);
    let other = parent.maybeChild(index);

    if (!main) {
      const tmp = main;
      main = other;
      other = tmp;
    }
    if (!main) return [];

    let marks: readonly IMark[] = main.marks;
    for (let i = 0; i < marks.length; i++) {
      if (
        marks[i].type.inclusive === false &&
        (!other || !marks[i].isInSet(other.marks))
      ) {
        marks = marks[i--].removeFromSet(marks);
      }
    }
    return marks;
  }

  posAtIndex(index: number, depth?: number | null): number {
    const resolvedDepth = this.resolveDepth(depth);
    let pos = this.start(resolvedDepth);
    for (let i = 0; i < index; i++) {
      pos += (this.node(resolvedDepth).content.child(i) as INode).nodeSize;
    }
    return pos;
  }

  static resolveCached(doc: INode, pos: number): ResolvedPos {
    let cache = resolveCache.get(doc);
    if (cache) {
      for (let i = 0; i < cache.elts.length; i++) {
        const elt = cache.elts[i];
        if (elt.pos === pos) return elt;
      }
    } else {
      resolveCache.set(doc, (cache = new ResolveCache()));
    }
    const result = (cache.elts[cache.i] = ResolvedPos.resolve(doc, pos));
    cache.i = (cache.i + 1) % resolveCacheSize;
    return result;
  }

  equals(other: ResolvedPos): boolean {
    if (other === null)
      throw new Error('ResolvedPos equals parameter cannot be null');
    return this.pos === other.pos && this.doc === other.doc;
  }

  private resolveDepth(depth?: number | null): number {
    if (depth === null || depth === undefined) {
      return this.depth;
    }

    if (depth < 0) {
      return this.depth + depth;
    }

    return depth;
  }

  private validateParameters(name: string, value: unknown) {
    if (value === null) {
      throw new Error(`ResolvedPos ${name} cannot be null`);
    }

    if (value === undefined) {
      throw new Error(`ResolvedPos ${name} cannot be undefined`);
    }

    if (typeof value === 'number' && value < 0) {
      throw new Error(`ResolvedPos ${name} cannot be negative`);
    }

    if (name === 'path' && Array.isArray(value) && value.length % 3 !== 0) {
      throw new Error('ResolvedPos path length must be a multiple of 3');
    }
  }
}

class ResolveCache {
  elts: ResolvedPos[] = [];
  i = 0;
}
const resolveCacheSize = 12;
const resolveCache = new WeakMap<INode, ResolveCache>();
