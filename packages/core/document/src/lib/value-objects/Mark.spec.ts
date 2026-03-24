import { Mark } from './Mark';

function createMark<TAttrs extends Record<string, unknown>>(
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

  describe('Merge', () => {
    it('should return new mark with merged attrs for same type', () => {
      const mark1 = createMark('link', { href: 'example.com' });
      const mark2 = createMark('link', { title: 'Example' });

      const merged = mark1.merge(mark2);

      expect(merged).not.toBeNull();
      expect(merged?.type).toBe('link');
      expect(merged?.attrs).toEqual({ href: 'example.com', title: 'Example' });
    });

    it('should return null for different types', () => {
      const mark1 = createMark('bold', {});
      const mark2 = createMark('italic', {});

      expect(mark1.merge(mark2)).toBeNull();
    });

    it('should override attrs with same keys', () => {
      const mark1 = createMark('link', { href: 'old.com', title: 'Old' });
      const mark2 = createMark('link', { href: 'new.com' });

      const merged = mark1.merge(mark2);

      expect(merged).not.toBeNull();
      expect(merged?.attrs).toEqual({ href: 'new.com', title: 'Old' });
    });

    it('should throw when merging with null', () => {
      const mark = createMark('bold', {});
      expect(() => mark.merge(null as never)).toThrow(
        'Mark cannot be null or undefined'
      );
    });

    it('should throw when merging with undefined', () => {
      const mark = createMark('bold', {});
      expect(() => mark.merge(undefined as never)).toThrow(
        'Mark cannot be null or undefined'
      );
    });
  });

  describe('isInSet', () => {
    it('given mark is in set, returns true', () => {
      const mark = createMark('bold', { color: 'purple' });
      const set = [createMark('italic', { color: 'purple' }), mark];

      expect(mark.isInSet(set)).toBe(true);
    });

    it('given null set, throws error', () => {
      const mark = createMark('bold', { color: 'purple' });
      expect(() => mark.isInSet(null as never)).toThrow(
        'Mark isInSet set cannot be null or undefined'
      );
    });
  });

  describe('removeFromSet', () => {
    it('given mark is in set, returns new set without the mark', () => {
      const mark = createMark('bold', { color: 'purple' });
      const set = [createMark('italic', { color: 'purple' }), mark];

      const newSet = mark.removeFromSet(set);

      expect(newSet).toEqual([createMark('italic', { color: 'purple' })]);
    });

    it('given mark is not in set, returns same reference', () => {
      const mark = createMark('bold', { color: 'purple' });
      const set = [createMark('italic', { color: 'purple' })];

      const newSet = mark.removeFromSet(set);

      expect(newSet).toBe(set);
    });

    it('given null or undefined set, throws error', () => {
      const mark = createMark('bold', { color: 'purple' });
      expect(() => mark.removeFromSet(null as never)).toThrow(
        'Mark removeFromSet set cannot be null or undefined'
      );
    });
  });
});
