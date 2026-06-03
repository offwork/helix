import type { IFragment } from '../entities/IFragment';
import { empty } from '../entities/FragmentFactory';
import { insertInto, removeRange } from '../utils/replace';
export class Slice {
  static readonly empty = new Slice(empty(), 0, 0);

  constructor(
    public readonly content: IFragment,
    public readonly openStart: number,
    public readonly openEnd: number
  ) {
    Slice.validateParameters(content, openStart, openEnd);
  }

  static maxOpen(fragment: IFragment, openIsolating = true): Slice {
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

  insertAt(pos: number, fragment: IFragment): Slice | null {
    const content = insertInto(this.content, pos + this.openStart, fragment);
    return content && new Slice(content, this.openStart, this.openEnd);
  }

  removeBetween(from: number, to: number): Slice {
    return new Slice(
      removeRange(this.content, from + this.openStart, to + this.openStart),
      this.openStart,
      this.openEnd
    );
  }

  private static validateParameters(
    content: IFragment,
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
