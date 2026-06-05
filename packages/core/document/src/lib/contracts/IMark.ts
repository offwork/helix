import type { IMarkType } from './IMarkType';

export interface IMark {
  readonly attrs: Record<string, unknown>;
  readonly type: IMarkType;
  addToSet(set: readonly IMark[]): readonly IMark[];
  equals(other: IMark): boolean;
  isInSet(set: readonly IMark[]): IMark | undefined;
  removeFromSet(set: readonly IMark[]): readonly IMark[];
  toJSON(): { type: string; attrs?: Record<string, unknown> };
}
