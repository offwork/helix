import type { IFragment } from './IFragment';
import { SliceJSON } from './types/SliceJSON';

export interface ISlice {
  readonly content: IFragment;
  readonly openEnd: number;
  readonly openStart: number;
  readonly size: number;
  equals(other: ISlice): boolean;
  insertAt(pos: number, fragment: IFragment): ISlice | null;
  removeBetween(from: number, to: number): ISlice;
  toJSON(): SliceJSON | null;
  toString(): string;
}
