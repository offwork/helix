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

    for (const mark of marks) {
      if (!(mark instanceof Mark)) {
        throw new Error('MarkSet must be created with array of mark objects');
      }
    }

    return new MarkSet(marks);
  }

  get size(): number {
    return this.marks.length;
  }
}
