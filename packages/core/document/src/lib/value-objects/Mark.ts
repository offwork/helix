import { deepEqual } from '../utils/deep-equal';
import type { IMarkType } from '../contracts/IMarkType';
import type { IMark } from '../contracts/IMark';
import { MarkJSON } from '../contracts';

export class Mark implements IMark {
  readonly type: IMarkType;
  readonly attrs: Record<string, unknown>;
  static readonly none: readonly Mark[] = [];

  constructor(type: IMarkType, attrs: Record<string, unknown>) {
    if (type === null || type === undefined)
      throw new Error('type coannot be null or undefined');
    if (typeof attrs !== 'object' || attrs === null || Array.isArray(attrs))
      throw new Error('Attrs must be an object');

    this.attrs = { ...attrs };
    this.type = type;
  }

  static fromJSON(
    schema: {
      marks: Record<string, IMarkType>;
    },
    json: MarkJSON
  ): Mark {
    if (json === null) {
      throw new RangeError('Invalid input for Mark.fromJSON');
    }

    const type = schema.marks[json.type];
    if (!type) {
      throw new RangeError(`There is no mark type ${json.type} in this schema`);
    }

    return new Mark(type, json.attrs || {});
  }

  static sameSet(a: readonly IMark[], b: readonly IMark[]): boolean {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
      if (!a[i].equals(b[i])) return false;
    }

    return true;
  }

  addToSet(set: readonly IMark[]): readonly IMark[] {
    if (set.length === 0) return [this];

    let copy: IMark[] | null = null;

    for (let i = 0; i < set.length; i++) {
      if (this.equals(set[i])) return set;
      else if (this.type.excludes(set[i].type)) {
        if (!copy) copy = set.slice(0, i);
      } else if (set[i].type.excludes(this.type)) {
        return set;
      } else if (set[i].type.rank > this.type.rank) {
        if (!copy) copy = set.slice(0, i);
        copy.push(this);
        copy.push(...set.slice(i));
        return copy;
      } else if (copy) {
        copy.push(set[i]);
      }
    }

    if (!copy) copy = set.slice();
    copy.push(this);
    return copy;
  }

  equals(other: IMark): boolean {
    if (!this.validateMark(other)) return false;

    return deepEqual(this.attrs, other.attrs);
  }

  isInSet(set: readonly IMark[]): IMark | undefined {
    if (set === null || set === undefined) {
      throw new Error(`Mark isInSet set cannot be ${set}`);
    }

    return set.find((mark) => this.equals(mark));
  }

  removeFromSet(set: readonly IMark[]): readonly IMark[] {
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

  toJSON(): MarkJSON {
    const json: MarkJSON = {
      type: this.type.name,
    };

    if (Object.keys(this.attrs).length > 0) {
      json.attrs = { ...this.attrs };
    }

    return json;
  }

  private validateMark(other: IMark): boolean {
    if (other === null || other === undefined)
      throw new Error(`Mark cannot be ${other}`);

    return this.type === other.type;
  }
}
