import { Mark } from './Mark';

export class MarkSet {
  private static readonly _empty: MarkSet = new MarkSet([]);
  private readonly marks: readonly Mark<Record<string, unknown>>[];

  private constructor(marks: Mark<Record<string, unknown>>[]) {
    this.marks = [...marks];
  }

  static empty(): MarkSet {
    return MarkSet._empty;
  }

  static from(marks: Mark<Record<string, unknown>>[]): MarkSet {
    if (marks.length === 0) return MarkSet._empty;

    MarkSet.validateMarks(marks);

    return new MarkSet(marks);
  }

  get size(): number {
    return this.marks.length;
  }

  add(mark: Mark<Record<string, unknown>>): MarkSet {
    if (this.hasMark(mark)) {
      return this;
    }

    return new MarkSet([...this.marks, mark]);
  }

  remove(mark: Mark<Record<string, unknown>>): MarkSet {
    if (!this.hasMark(mark)) {
      return this;
    }

    const newMarks = this.marks.filter((value) => value.type !== mark.type);
    return new MarkSet(newMarks);
  }

  contains(mark: Mark<Record<string, unknown>>): boolean {
    return this.hasMark(mark);
  }

  private static validateMarks(marks: unknown[]): void {
    for (const mark of marks) {
      if (!(mark instanceof Mark)) {
        throw new Error('MarkSet must be created with array of mark objects');
      }
    }
  }

  private hasMark(mark: Mark<Record<string, unknown>>): boolean {
    return this.marks.some((existingMark) => existingMark.type === mark.type);
  }
}
