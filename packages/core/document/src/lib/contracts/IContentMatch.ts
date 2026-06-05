import type { IFragment } from './IFragment';
import type { INodeType } from './INodeType';

export interface IContentMatch {
  readonly edgeCount: number;
  readonly inlineContent: boolean;
  readonly validEnd: boolean;
  compatible(other: IContentMatch): boolean;
  defaultType(): INodeType | null;
  fillBefore(after: IFragment, toEnd?: boolean, startIndex?: number): IFragment | null;
  findWrapping(target: INodeType): INodeType[] | null;
  matchFragment(fragment: IFragment, start?: number, end?: number): IContentMatch | null;
  matchType(type: INodeType): IContentMatch | null;
}
