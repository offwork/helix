export interface NodeSpec {
  attrs?: Record<string, unknown>;
  inline?: boolean;
  marks?: string;
}

export interface MarkSpec {
  attrs?: Record<string, unknown>;
}
