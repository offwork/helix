import type { INode } from './INode';

export interface IFragment {
  readonly childCount: number;
  readonly firstChild: INode | undefined;
  readonly lastChild: INode | undefined;
  readonly size: number;
  addToEnd(node: INode): IFragment;
  addToStart(node: INode): IFragment;
  append(other: IFragment): IFragment;
  child(index: number): INode;
  cut(from: number, to?: number): IFragment;
  descendants(callback: (node: INode, pos: number, parent: INode | null, index: number) => boolean | void): void;
  equals(other: IFragment): boolean;
  findIndex(pos: number): { index: number; offset: number };
  forEach(callback: (node: INode, offset: number, index: number) => void): void;
  maybeChild(index: number): INode | null;
  nodesBetween(from: number, to: number, callback: (node: INode, start: number, parent: INode | null, index: number) => boolean | void, nodeStart?: number, parent?: INode): void;
  replaceChild(index: number, node: INode): IFragment;
  slice(from: number, to: number): IFragment;
  textBetween(from: number, to: number, blockSeparator?: string | null, leafText?: string | null | ((leafNode: INode) => string)): string;
  toJSON(): Record<string, unknown>[] | null;
  toString(): string;
}
