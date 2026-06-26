import type { IMark } from './IMark';
import type { INode } from './INode';

export interface IResolvedPos {
  readonly depth: number;
  readonly doc: INode;
  readonly nodeAfter: INode | null;
  readonly nodeBefore: INode | null;
  readonly parent: INode;
  readonly parentOffset: number;
  readonly pos: number;
  readonly textOffset: number;
  after(depth?: number | null): number;
  before(depth?: number | null): number;
  end(depth?: number | null): number;
  equals(other: IResolvedPos): boolean;
  index(depth?: number | null): number;
  indexAfter(depth?: number | null): number;
  marks(): readonly IMark[];
  marksAcross($end: IResolvedPos): readonly IMark[] | null;
  max(other: IResolvedPos): IResolvedPos;
  min(other: IResolvedPos): IResolvedPos;
  node(depth?: number | null): INode;
  posAtIndex(index: number, depth?: number | null): number;
  sameParent(other: IResolvedPos): boolean;
  sharedDepth(pos: number): number;
  start(depth?: number | null): number;
  toString(): string;
}
