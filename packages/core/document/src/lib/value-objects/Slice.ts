import { SliceJSON, SyntheticSchema } from '../contracts';
import { Fragment } from '../entities/Fragment';
import { empty } from '../entities/FragmentFactory';
import { insertInto, removeRange } from '../utils/replace';
import type { ISlice } from '../contracts/ISlice';
export class Slice {
  static readonly empty = new Slice(empty(), 0, 0);

  constructor(
    public readonly content: Fragment,
    public readonly openStart: number,
    public readonly openEnd: number
  ) {
    Slice.validateParameters(content, openStart, openEnd);
  }

  static fromJSON(schema: SyntheticSchema, json: SliceJSON | null): Slice {
    if (!json) return Slice.empty;
    const content = Fragment.fromJSON(schema, json.content);
    return new Slice(content, json.openStart ?? 0, json.openEnd ?? 0);
  }

  static maxOpen(fragment: Fragment, openIsolating = true): Slice {
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

  equals(other: ISlice): boolean {
    return (
      this.content.equals(other.content) &&
      this.openStart === other.openStart &&
      this.openEnd === other.openEnd
    );
  }

  insertAt(pos: number, fragment: Fragment): Slice | null {
    const content = insertInto(this.content, pos + this.openStart, fragment) as Fragment;
    return content && new Slice(content, this.openStart, this.openEnd);
  }

  removeBetween(from: number, to: number): Slice {
    return new Slice(
      removeRange(this.content, from + this.openStart, to + this.openStart) as Fragment,
      this.openStart,
      this.openEnd
    );
  }

  toJSON(): SliceJSON | null {
    const json: SliceJSON = { content: this.content.size ? this.content.toJSON() : null };

    if (this.openStart > 0) {
      json.openStart = this.openStart;
    }

    if (this.openEnd > 0) {
      json.openEnd = this.openEnd;
    }

    return this.content.size ? json : null;
  }

  toString(): string {
    return `${this.content.toString()}(${this.openStart},${this.openEnd})`;
  }

  private static validateParameters(
    content: Fragment,
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
