import { Node } from '../entities/Node';

export class ResolvedPos {
  constructor(
    public readonly pos: number,
    public readonly doc: Node,
    public readonly depth: number
  ) {
    this.validateParameter('pos', pos);
    this.validateParameter('doc', doc);
    this.validateParameter('depth', depth);
  }

  equals(other: ResolvedPos): boolean {
    this.validateParameter('equals parameter', other);

    return this.pos === other.pos && this.doc === other.doc;
  }

  private validateParameter(paramName: string, paramValue: unknown): void {
    if (typeof paramValue === 'number' && paramValue < 0) {
      throw new Error(`ResolvedPos ${paramName} cannot be negative`);
    }

    if (paramValue === null) {
      throw new Error(`ResolvedPos ${paramName} cannot be null`);
    }

    if (paramValue === undefined) {
      throw new Error(`ResolvedPos ${paramName} cannot be undefined`);
    }
  }
}
