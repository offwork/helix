import type { NodeSpec } from '../interfaces/SchemaSpec';
import type { IAttribute } from './IAttribute';
import type { IContentMatch } from './IContentMatch';
import type { IFragment } from './IFragment';
import type { IMark } from './IMark';
import type { IMarkType } from './IMarkType';
import type { INode } from './INode';

export interface INodeType {
  readonly attrs: Record<string, IAttribute>;
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
  contentMatch: IContentMatch | null;
  inlineContent: boolean | null;
  markSet: readonly IMarkType[] | null;
  allowedMarks(marks: readonly IMark[]): readonly IMark[];
  allowsMarkType(markType: IMarkType): boolean;
  allowsMarks(marks: readonly IMark[]): boolean;
  checkAttrs(attrs: Record<string, unknown>): void;
  checkContent(content: IFragment): void;
  compatibleContent(other: INodeType): boolean;
  create(attrs?: Record<string, unknown>, content?: IFragment | INode[], marks?: IMark[]): INode;
  createAndFill(attrs?: Record<string, unknown>, content?: IFragment | INode[], marks?: IMark[]): INode | null;
  createChecked(attrs?: Record<string, unknown>, content?: IFragment | INode[], marks?: IMark[]): INode;
  equals(other: INodeType): boolean;
  hasRequiredAttrs(): boolean;
  isInGroup(name: string): boolean;
  validContent(content: IFragment): boolean;
}
