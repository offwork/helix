export interface NodeSpec {
  attrs?: Record<string, AttributeSpec>;
  inline?: boolean;
  marks?: string;
  leaf?: boolean;
  text?: boolean;
}

export interface MarkSpec {
  attrs?: Record<string, unknown>;
}

export interface AttributeSpec {
  default?: unknown;
  validate?: (value: unknown) => void;
}
