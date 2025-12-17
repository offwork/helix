import { Position } from './Position';

describe('Position', () => {
  describe('constructor', () => {
    it('given valid offset, creates Position instance', () => {
      const position = new Position(5);

      expect(position).toBeInstanceOf(Position);
    });

    it('given valid offset, stores offset value', () => {
      const position = new Position(5);

      expect(position.offset).toBe(5);
    });

    it('given negative offset, throws "Position offset cannot be negative"', () => {
      expect(() => new Position(-2)).toThrow(
        'Position offset cannot be negative'
      );
    });

    it('given null offset, throws "Position offset cannot be null"', () => {
      expect(() => new Position(null as never)).toThrow(
        'Position offset cannot be null'
      );
    });

    it('given undefined offset, throws "Position offset cannot be undefined"', () => {
      expect(() => new Position(undefined as never)).toThrow(
        'Position offset cannot be undefined'
      );
    });
  });

  describe('equals', () => {
    it('given Positions with same offset, returns true', () => {
      const position1 = new Position(7);
      const position2 = new Position(7);

      expect(position1.equals(position2)).toBe(true);
    });

    it('given Position different offset returns false', () => {
      const position1 = new Position(7);
      const position2 = new Position(0);

      expect(position1.equals(position2)).toBe(false);
    });

    it('given null parameter, throws "Position equals parameter cannot be null"', () => {
      const position1 = new Position(7);

      expect(() => position1.equals(null as never)).toThrow(
        'Position equals parameter cannot be null'
      );
    });
  });
});
