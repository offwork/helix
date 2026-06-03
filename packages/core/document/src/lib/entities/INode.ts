import type { IFragment } from './IFragment';
import { Mark } from '../value-objects/Mark';
import type { INodeType } from '../value-objects/INodeType';
import { ContentMatch } from '../value-objects/ContentMatch';
import { ResolvedPos } from '../value-objects/ResolvedPos';
import { MarkType } from '../value-objects/MarkType';
import { Slice } from '../value-objects/Slice';

export interface INode {
  readonly attrs: Record<string, unknown>;
  readonly childCount: number;
  readonly content: IFragment;
  readonly firstChild: INode | undefined;
  readonly inlineContent: boolean | null;
  readonly isAtom: boolean;
  readonly isBlock: boolean;
  readonly isInline: boolean;
  readonly isLeaf: boolean;
  readonly isText: boolean;
  readonly isTextblock: boolean;
  readonly lastChild: INode | undefined;
  readonly marks: Mark[];
  readonly nodeSize: number;
  readonly type: INodeType;
  canAppend(other: INode): boolean;
  canReplace(
    from: number,
    to: number,
    replacement?: IFragment,
    start?: number,
    end?: number
  ): boolean;
  canReplaceWith(
    from: number,
    to: number,
    type: INodeType,
    marks?: readonly Mark[]
  ): boolean;
  child(index: number): INode;
  childAfter(pos: number): {
    node: INode | null;
    index: number;
    offset: number;
  };
  childBefore(pos: number): {
    node: INode | null;
    index: number;
    offset: number;
  };
  check(): void;
  contentMatchAt(pos: number): ContentMatch;
  copy(content?: IFragment): INode;
  cut(from: number, to?: number): INode;
  equals(other: INode): boolean;
  forEach(callback: (node: INode, offset: number, index: number) => void): void;
  hasMarkup(
    type: INodeType,
    attrs?: Record<string, unknown>,
    marks?: readonly Mark[]
  ): boolean;
  mark(marks: Mark[]): INode;
  maybeChild(index: number): INode | null;
  nodeAt(pos: number): INode | null;
  nodesBetween(
    from: number,
    to: number,
    callback: (
      node: INode,
      pos: number,
      parent: INode | null,
      index: number
    ) => void | boolean,
    startPos?: number
  ): void;
  rangeHasMark(from: number, to: number, type: Mark | MarkType): boolean;
  replace(from: number, to: number, replacement: Slice): INode;
  resolve(pos: number): ResolvedPos;
  resolveNoCache(pos: number): ResolvedPos;
  sameMarkup(other: INode): boolean;
  slice(from: number, to?: number, includeParents?: boolean): Slice;
  toString(): string;
}
