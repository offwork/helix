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

  equals(other: Slice): boolean {
    return (
      this.content === other.content &&
      this.openStart === other.openStart &&
      this.openEnd === other.openEnd
    );
  }

  get size(): number {
    return this.content.size;
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
