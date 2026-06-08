import type { IMark } from './IMark';

export interface IMarkType {
  readonly name: string;
  rank: number;
  inclusive?: boolean;
  excluded: readonly IMarkType[];
  checkAttrs(attrs: Record<string, unknown>): void;
  excludes(other: IMarkType): boolean;
  isInSet(set: readonly IMark[]): IMark | undefined;
}
