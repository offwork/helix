export interface IMarkType {
  readonly rank: number;
  excludes(other: IMarkType): boolean;
}