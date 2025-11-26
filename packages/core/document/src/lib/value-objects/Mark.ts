export class Mark<TAttrs = Record<string, unknown>> {
  readonly type: string;
  readonly attrs: TAttrs;
  constructor(type: string, attrs: TAttrs) {
    this.attrs = { ...attrs } as TAttrs;
    this.type = type;
  }
}
