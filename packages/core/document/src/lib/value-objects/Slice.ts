import { Fragment } from '../entities/Fragment';
import { Node } from '../entities/Node';

export class Slice {
  static readonly empty = new Slice(Fragment.empty<Node>(), 0, 0);

  constructor(
    public readonly content: Fragment<Node>,
    public readonly openStart: number,
    public readonly openEnd: number
  ) {
    Slice.validateParameters(content, openStart, openEnd);
  }

  static maxOpen(fragment: Fragment<Node>, openIsolating = true): Slice {
    let openStart = 0,
      openEnd = 0;
    for (
      let n = fragment.firstChild;
      n && !n.isLeaf && (openIsolating || !n.type.spec.isolating);
      n = n.firstChild
    )
      openStart++;
    for (
      let n = fragment.lastChild;
      n && !n.isLeaf && (openIsolating || !n.type.spec.isolating);
      n = n.lastChild
    )
      openEnd++;
    return new Slice(fragment, openStart, openEnd);
  }

  get size(): number {
    return this.content.size - this.openStart - this.openEnd;
  }

  equals(other: Slice): boolean {
    return (
      this.content.equals(other.content) &&
      this.openStart === other.openStart &&
      this.openEnd === other.openEnd
    );
  }

  toString(): string {
    return `${this.content.toString()}(${this.openStart},${this.openEnd})`;
  }

  private static validateParameters(
    content: Fragment<Node>,
    openStart: number,
    openEnd: number
  ): void {
    if (content === null) {
      throw new Error('Slice content cannot be null');
    }

    if (content === undefined) {
      throw new Error('Slice content cannot be undefined');
    }

    if (typeof openStart === 'number' && openStart < 0) {
      throw new Error('Slice openStart cannot be negative');
    }

    if (typeof openEnd === 'number' && openEnd < 0) {
      throw new Error('Slice openEnd cannot be negative');
    }

    if (!Number.isInteger(openStart)) {
      throw new Error('Slice openStart must be an integer');
    }

    if (!Number.isInteger(openEnd)) {
      throw new Error('Slice openEnd must be an integer');
    }

    if (openEnd < openStart) {
      throw new Error('Slice openEnd cannot be less than openStart');
    }

    if (content.size === 0 && (openStart !== 0 || openEnd !== 0)) {
      throw new Error('Slice with empty content must have zero opens');
    }
  }
}
