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

  /**
   * Compares this mark with another mark for equality.
   *
   * Two marks are considered equal if they have the same type and
   * equivalent attributes (shallow comparison).
   *
   * @param other - The mark to compare with
   * @returns true if marks are equal, false otherwise
   *
   * @remarks
   * Currently supports flat attributes only. Nested objects are compared
   * by reference, not deep equality. Deep equality support is planned for
   * future milestones.
   *
   * @example
   * ```typescript
   * const mark1 = new Mark('bold', { color: 'red' });
   * const mark2 = new Mark('bold', { color: 'red' });
   * mark1.equals(mark2); // true
   * ```
   */
  equals(other: Mark<TAttrs>): boolean {
    if (other.type !== this.type) {
      return false;
    }

    const thisKeys = Object.keys(this.attrs as object);
    const otherKeys = Object.keys(other.attrs as object);

    if (thisKeys.length !== otherKeys.length) {
      return false;
    }

    return thisKeys.every((key) => {
      return (
        this.attrs[key as keyof TAttrs] === other.attrs[key as keyof TAttrs]
      );
    });
  }
}
