import { Mark } from './Mark';

describe('Mark Value Object', () => {
  describe('Construction', () => {
    it('should create mark with type and attrs', () => {
      const type = 'bold';
      const attrs = { color: 'purple' };

      const mark = new Mark(type, attrs);

      expect(mark.type).toBe('bold');
      expect(mark.attrs).toEqual({ color: 'purple' });
    });

    it('should throw when type is null', () => {
      expect(() => new Mark(null as never, {})).toThrow(
        'Type must be a string'
      );
    });

    it('should throw when type is undefined', () => {
      expect(() => new Mark(undefined as never, {})).toThrow(
        'Type must be a string'
      );
    });

    it('should throw when attrs is null', () => {
      expect(() => new Mark('bold', null as never)).toThrow(
        'Attrs must be an object'
      );
    });

    it('should throw when attrs is undefined', () => {
      expect(() => new Mark('bold', undefined as never)).toThrow(
        'Attrs must be an object'
      );
    });
  });

  describe('Equals', () => {
    it('should return true for marks with same type and attrs', () => {
      const mark1 = new Mark('bold', { color: 'purple' });
      const mark2 = new Mark('bold', { color: 'purple' });

      expect(mark1.equals(mark2)).toBe(true);
    });
  });
});
