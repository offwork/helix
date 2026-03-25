import { Node } from '../entities/Node';
import { ResolvedPos } from './ResolvedPos';

export class NodeRange {
  constructor(
    public readonly $from: ResolvedPos,
    public readonly $to: ResolvedPos,
    public readonly depth: number
  ) {
    this.validateParameter($from, '$from');
    this.validateParameter($to, '$to');
    this.validateParameter(depth, 'depth');
  }

  get start(): number {
    return this.$from.before(this.depth + 1);
  }

  get end(): number {
    return this.$to.after(this.depth + 1);
  }

  get parent(): Node {
    return this.$from.node(this.depth);
  }

  get startIndex(): number {
    return this.$from.index(this.depth);
  }

  get endIndex(): number {
    return this.$to.indexAfter(this.depth);
  }

  private validateParameter<T>(
    parameter: T,
    parameterName: string
  ): asserts parameter is NonNullable<T> {
    if (parameter === null) {
      throw new Error(`NodeRange ${parameterName} cannot be null`);
    }
    if (parameter === undefined) {
      throw new Error(`NodeRange ${parameterName} cannot be undefined`);
    }
    if (
      parameterName === 'depth' &&
      typeof parameter === 'number' &&
      parameter < 0
    ) {
      throw new Error(`NodeRange ${parameterName} cannot be a negative number`);
    }
  }
}
