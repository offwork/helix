import { INode } from "../contracts";
import { OrderedMap } from "../value-objects/OrderedMap";

export interface SchemaSpec {
  nodes: Record<string, NodeSpec> | OrderedMap<NodeSpec>;
  marks?: Record<string, MarkSpec> | OrderedMap<MarkSpec>;
  topNode?: string;
}

export interface NodeSpec {
  atom?: boolean;
  attrs?: Record<string, AttributeSpec>;
  code?: boolean;
  content?: string;
  defining?: boolean;
  definingAsContext?: boolean;
  definingForContent?: boolean;
  draggable?: boolean;
  group?: string;
  inline?: boolean;
  isolating?: boolean;
  leafText?: (node: INode) => string
  linebreakReplacement?: boolean;
  marks?: string;
  selectable?: boolean;
  toDebugString?: (node: INode) => string;
  whitespace?: 'normal' | 'pre';
}

export interface MarkSpec {
  attrs?: Record<string, AttributeSpec>;
  code?: boolean;
  excludes?: string;
  group?: string;
  inclusive?: boolean;
  spanning?: boolean;
}

export interface AttributeSpec {
  default?: unknown;
  validate?: string | ((value: unknown) => void);
}