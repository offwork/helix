export interface NodeSpec {
  attrs?: Record<string, unknown>;
  inline?: boolean;
  marks?: string;
  leaf?: boolean;
  text?: boolean;
}

export interface MarkSpec {
  attrs?: Record<string, unknown>;
}
