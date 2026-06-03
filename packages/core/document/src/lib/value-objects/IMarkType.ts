import { Attrs } from '../utils/attrs';

export interface IMarkType {
  readonly name: string;
  excluded: readonly IMarkType[];
  rank: number;
  excludes(other: IMarkType): boolean;
  checkAttrs(attrs: Attrs): void;
}
