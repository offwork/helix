import { Node } from '../entities/Node';

export class ResolvedPos {
  constructor(
    public readonly pos: number,
    public readonly path: (Node | number)[],
    public readonly parentOffset: number
  ) {
    this.validateParameters('pos', pos);
    this.validateParameters('path', path);
    this.validateParameters('parentOffset', parentOffset);
  }

  get depth(): number {
    return this.path.length / 3 - 1;
  }

  get doc(): Node {
    return this.node(0);
  }

  get parent(): Node {
    return this.node();
  }

  get textOffset(): number {
    return this.pos - (this.path[this.path.length - 1] as number);
  }

  index(depth?: number | null): number {
    const resolvedDepth = this.resolveDepth(depth);
    return this.path[resolvedDepth * 3 + 1] as number;
  }

  node(depth?: number | null): Node {
    const resolvedDepth = this.resolveDepth(depth);
    return this.path[resolvedDepth * 3] as Node;
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

    return this.path[resolvedDepth * 3 - 1] as number;
  }

  after(depth?: number | null): number {
    const resolvedDepth = this.resolveDepth(depth);
    if (resolvedDepth === 0) {
      throw new Error('There is no position after the top-level node');
    }

    return (
      (this.path[resolvedDepth * 3 - 1] as number) +
      (this.path[resolvedDepth * 3] as Node).nodeSize
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

  private resolveDepth(depth?: number | null): number {
    if (depth === null || depth === undefined) {
      return this.depth;
    }

    if (depth < 0) {
      return this.depth + depth;
    }

    return depth;
  }

  equals(other: ResolvedPos): boolean {
    if (other === null)
      throw new Error('ResolvedPos equals parameter cannot be null');
    return this.pos === other.pos && this.doc === other.doc;
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
