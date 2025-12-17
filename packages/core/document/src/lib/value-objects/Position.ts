export class Position {
  readonly offset: number;

  constructor(offset: number) {
    this.validateOffset(offset);
    this.offset = offset;
  }

  equals(other: Position): boolean {
    if (other === null) {
      throw new Error('Position equals parameter cannot be null');
    }

    return other.offset === this.offset;
  }

  private validateOffset(offset: number): void {
    if (offset < 0) {
      throw new Error('Position offset cannot be negative');
    }

    if (offset === null) {
      throw new Error('Position offset cannot be null');
    }

    if (offset === undefined) {
      throw new Error('Position offset cannot be undefined');
    }
  }
}
