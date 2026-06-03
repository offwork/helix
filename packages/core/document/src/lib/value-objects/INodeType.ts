import { Fragment } from '../entities/Fragment';
import { Node } from '../entities/Node';
import { NodeSpec } from '../interfaces/SchemaSpec';
import { Attrs } from '../utils/attrs';
import { Attribute } from './Attribute';
import { ContentMatch } from './ContentMatch';
import { Mark } from './Mark';
import { MarkType } from './MarkType';

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
  markSet: readonly MarkType[] | null;
  allowsMarkType(markType: MarkType): boolean;
  allowsMarks(marks: readonly Mark[]): boolean;
  allowedMarks(marks: readonly Mark[]): readonly Mark[];
  create(
    attrs?: Record<string, unknown>,
    content?: Fragment | Node[],
    marks?: Mark[]
  ): Node;
  createAndFill(
    attrs?: Record<string, unknown>,
    content?: Fragment | Node[],
    marks?: Mark[]
  ): Node | null;
  createChecked(
    attrs?: Record<string, unknown>,
    content?: Fragment | Node[],
    marks?: Mark[]
  ): Node;
  checkAttrs(attrs: Attrs): void;
  checkContent(content: Fragment): void;
  compatibleContent(other: INodeType): boolean;
  equals(other: INodeType): boolean;
  hasRequiredAttrs(): boolean;
  isInGroup(name: string): boolean;
  validContent(content: Fragment): boolean;
}
