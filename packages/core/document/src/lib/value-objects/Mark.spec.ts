import { Mark } from './Mark';

function createMark<TAttrs = Record<string, unknown>>(
  type: string,
  attrs: TAttrs
): Mark<TAttrs> {
  return new Mark(type, attrs);
}

describe('Mark Value Object', () => {
  describe('Construction', () => {
    it('should create mark with type and attrs', () => {
      const mark = createMark('bold', { color: 'purple' });

      expect(mark.type).toBe('bold');
      expect(mark.attrs).toEqual({ color: 'purple' });
    });

    it('should throw when type is null', () => {
      expect(() => createMark(null as never, {})).toThrow(
        'Type must be a string'
      );
    });

    it('should throw when type is undefined', () => {
      expect(() => createMark(undefined as never, {})).toThrow(
        'Type must be a string'
      );
    });

    it('should throw when attrs is null', () => {
      expect(() => createMark('bold', null as never)).toThrow(
        'Attrs must be an object'
      );
    });

    it('should throw when attrs is undefined', () => {
      expect(() => createMark('bold', undefined as never)).toThrow(
        'Attrs must be an object'
      );
    });
  });

  describe('Equality', () => {
    it('should return true for marks with same type and attrs', () => {
      const mark = createMark('bold', { color: 'purple' });
      const mark2 = createMark('bold', { color: 'purple' });

      expect(mark.equals(mark2)).toBe(true);
    });

    it('should throw when comparing with null', () => {
      expect(() =>
        createMark('bold', { color: 'purple' }).equals(null as never)
      ).toThrow('Mark cannot be null or undefined');
    });

    it('should throw when comparing with undefined', () => {
      expect(() =>
        createMark('bold', { color: 'purple' }).equals(undefined as never)
      ).toThrow('Mark cannot be null or undefined');
    });

    it('should return false for different types', () => {
      const mark = createMark('bold', { color: 'purple' });
      const mark2 = createMark('italic', { color: 'red' });
      expect(mark.equals(mark2)).toBe(false);
    });

    it('should return false for different attrs', () => {
      const mark = createMark('bold', { color: 'purple' });
      const mark2 = createMark('bold', { color: 'blue' });
      expect(mark.equals(mark2)).toBe(false);
    });

    it('should return true for self comparison', () => {
      const mark = createMark('bold', { color: 'purple' });
      expect(mark.equals(mark)).toBe(true);
    });

    it('should handle empty attrs equality', () => {
      expect(createMark('', {}).equals(createMark('', {}))).toBe(true);
    });
  });
});
