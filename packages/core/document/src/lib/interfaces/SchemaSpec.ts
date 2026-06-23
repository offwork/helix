import { INode } from "../contracts";

export interface SchemaSpec {
  nodes: Record<string, NodeSpec>;
  marks?: Record<string, MarkSpec>;
  topNode?: string;
}

export interface NodeSpec {
  atom?: boolean;
  attrs?: Record<string, AttributeSpec>;
  code?: boolean;
  content?: string;
  group?: string;
  inline?: boolean;
  isolating?: boolean;
  leafText?: (node: INode) => string
  linebreakReplacement?: boolean;
  marks?: string;
  whitespace?: 'normal' | 'pre';
}

export interface MarkSpec {
  attrs?: Record<string, AttributeSpec>;
  excludes?: string;
  group?: string;
  inclusive?: boolean;
}

export interface AttributeSpec {
  default?: unknown;
  validate?: string | ((value: unknown) => void);
}