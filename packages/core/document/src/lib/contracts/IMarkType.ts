import type { IMark } from './IMark';

export interface IMarkType {
  readonly name: string;
  readonly rank: number;
  excluded: readonly IMarkType[];
  checkAttrs(attrs: Record<string, unknown>): void;
  excludes(other: IMarkType): boolean;
  isInSet(set: readonly IMark[]): IMark | undefined;
}
