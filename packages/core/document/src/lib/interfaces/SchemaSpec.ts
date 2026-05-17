export interface SchemaSpec {
  nodes: Record<string, NodeSpec>;
  marks?: Record<string, MarkSpec>;
  topNode?: string;
}

export interface NodeSpec {
  content?: string;
  attrs?: Record<string, AttributeSpec>;
  inline?: boolean;
  group?: string;
  marks?: string;
  leaf?: boolean;
  text?: boolean;
}

export interface MarkSpec {
  attrs?: Record<string, unknown>;
  excludes?: string;
  group?: string;
}

export interface AttributeSpec {
  default?: unknown;
  validate?: (value: unknown) => void;
}