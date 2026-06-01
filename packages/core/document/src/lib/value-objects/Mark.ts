import { deepEqual } from '../utils/deep-equal';
import { MarkType } from './MarkType';

export class Mark {
  readonly type: MarkType;
  readonly attrs: Record<string, unknown>;
  static readonly none: readonly Mark[] = [];

  constructor(type: MarkType, attrs: Record<string, unknown>) {
    if (!(type instanceof MarkType))
      throw new Error('Type must be a MarkType instance');
    if (typeof attrs !== 'object' || attrs === null || Array.isArray(attrs))
      throw new Error('Attrs must be an object');

    this.attrs = { ...attrs };
    this.type = type;
  }

  static sameSet(a: readonly Mark[], b: readonly Mark[]): boolean {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
      if (!a[i].equals(b[i])) return false;
    }

    return true;
  }

  equals(other: Mark): boolean {
    if (!this.validateMark(other)) return false;

    return deepEqual(this.attrs, other.attrs);
  }

  isInSet(set: readonly Mark[]): boolean {
    if (set === null || set === undefined) {
      throw new Error(`Mark isInSet set cannot be ${set}`);
    }

    return set.some((mark) => this.equals(mark));
  }

  removeFromSet(set: readonly Mark[]): readonly Mark[] {
    if (set === null || set === undefined) {
      throw new Error(`Mark removeFromSet set cannot be ${set}`);
    }

    for (let i = 0; i < set.length; i++) {
      if (this.equals(set[i])) {
        return set.slice(0, i).concat(set.slice(i + 1));
      }
    }

    return set;
  }

  addToSet(set: readonly Mark[]): readonly Mark[] {
    if (set.length === 0) return [this];

    let copy: Mark[] | null = null;

    for (let i = 0; i < set.length; i++) {
      if (this.equals(set[i])) return set;
      else if (this.type.excludes(set[i].type)) {
        if (!copy) copy = set.slice(0, i) as Mark[];
      } else if (set[i].type.excludes(this.type)) {
        return set;
      } else if (set[i].type.rank > this.type.rank) {
        if (!copy) copy = set.slice(0, i) as Mark[];
        copy.push(this);
        copy.push(...(set.slice(i) as Mark[]));
        return copy;
      } else if (copy) {
        copy.push(set[i]);
      }
    }

    if (!copy) copy = set.slice() as Mark[];
    copy.push(this);
    return copy;
  }

  private validateMark(other: Mark): boolean {
    if (other === null || other === undefined)
      throw new Error(`Mark cannot be ${other}`);

    return this.type === other.type;
  }
}
