export class Mark<TAttrs = Record<string, unknown>> {
  readonly type: string;
  readonly attrs: TAttrs;
  constructor(type: string, attrs: TAttrs) {
    if (typeof type !== 'string') throw new Error('Type must be a string');
    if (typeof attrs !== 'object' || attrs === null || Array.isArray(attrs))
      throw new Error('Attrs must be an object');

    this.attrs = { ...attrs } as TAttrs;
    this.type = type;
  }

  equals(other: Mark<TAttrs>): boolean {
    return other.type === this.type && JSON.stringify(this.attrs) === JSON.stringify(other.attrs);
  }
}
