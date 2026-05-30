import { Attribute } from '../value-objects/Attribute';

export type Attrs = Record<string, unknown>;

export function checkAttrs(
  attrs: Record<string, Attribute>,
  values: Attrs,
  type: string,
  name: string
): void {
  for (const key in values) {
    if (!(key in attrs)) {
      throw new RangeError(
        `Unsupported attribute ${key} for ${type} of type ${name}`
      );
    }
  }

  for (const key in attrs) {
    const attr = attrs[key];
    if (attr.spec.validate) {
      attr.spec.validate(values[key]);
    }
  }
}
