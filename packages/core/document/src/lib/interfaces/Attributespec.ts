export interface AttributeSpec {
  default?: unknown;
  validate?: (value: unknown) => void;
}