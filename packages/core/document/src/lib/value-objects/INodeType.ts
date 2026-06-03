import type { IFragment } from '../entities/IFragment';
import type { INode } from '../entities/INode';
import type { IMark } from './IMark';
import type { IMarkType } from './IMarkType';
import { NodeSpec } from '../interfaces/SchemaSpec';
import { Attrs } from '../utils/attrs';
import { Attribute } from './Attribute';
import { ContentMatch } from './ContentMatch';

export interface INodeType {
  readonly attrs: Record<string, Attribute>;
  readonly isAtom: boolean;
  readonly isBlock: boolean;
  readonly isInline: boolean;
  readonly isLeaf: boolean;
  readonly isText: boolean;
  readonly isTextblock: boolean;
  readonly name: string;
  readonly schema: unknown;
  readonly spec: NodeSpec;
  readonly whitespace: 'normal' | 'pre';
  contentMatch: ContentMatch | null;
  inlineContent: boolean | null;
  markSet: readonly IMarkType[] | null;
  allowsMarkType(markType: IMarkType): boolean;
  allowsMarks(marks: readonly IMark[]): boolean;
  allowedMarks(marks: readonly IMark[]): readonly IMark[];
  create(
    attrs?: Record<string, unknown>,
    content?: IFragment | INode[],
    marks?: IMark[]
  ): INode;
  createAndFill(
    attrs?: Record<string, unknown>,
    content?: IFragment | INode[],
    marks?: IMark[]
  ): INode | null;
  createChecked(
    attrs?: Record<string, unknown>,
    content?: IFragment | INode[],
    marks?: IMark[]
  ): INode;
  checkAttrs(attrs: Attrs): void;
  checkContent(content: IFragment): void;
  compatibleContent(other: INodeType): boolean;
  equals(other: INodeType): boolean;
  hasRequiredAttrs(): boolean;
  isInGroup(name: string): boolean;
  validContent(content: IFragment): boolean;
}
