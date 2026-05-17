import { Mark } from './Mark';

export class MarkSet {
  private static readonly _empty: MarkSet = new MarkSet([]);
  private readonly marks: readonly Mark[];

  private constructor(marks: readonly Mark[]) {
    this.marks = [...marks];
  }

  static empty(): MarkSet {
    return MarkSet._empty;
  }

  static from(marks: Mark[]): MarkSet {
    if (marks.length === 0) return MarkSet._empty;

    MarkSet.validateMarks(marks);

    return new MarkSet(marks);
  }

  get size(): number {
    return this.marks.length;
  }

  add(mark: Mark): MarkSet {
    if (this.hasMark(mark)) {
      return this;
    }

    return new MarkSet([...this.marks, mark]);
  }

  remove(mark: Mark): MarkSet {
    if (!this.hasMark(mark)) {
      return this;
    }

    const newMarks = this.marks.filter(
      (existingMark) => existingMark.type !== mark.type
    );
    return new MarkSet(newMarks);
  }

  contains(mark: Mark): boolean {
    return this.hasMark(mark);
  }

  equals(other: MarkSet): boolean {
    if (this.size !== other.size) return false;

    return this.marks.every((mark) =>
      other.marks.some((otherMark) => mark.equals(otherMark))
    );
  }

  private static validateMarks(marks: unknown[]): void {
    for (const mark of marks) {
      if (!(mark instanceof Mark)) {
        throw new Error('MarkSet must be created with array of mark objects');
      }
    }
  }

  private hasMark(mark: Mark): boolean {
    return this.marks.some((existingMark) => existingMark.type === mark.type);
  }
}
