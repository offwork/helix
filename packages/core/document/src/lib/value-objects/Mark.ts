export class Mark {
  type: string;
  attrs: Record<string, unknown>;
  constructor(type: string, attrs: Record<string, unknown>) {
    this.attrs = attrs;
    this.type = type;
  }
}
