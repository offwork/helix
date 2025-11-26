import { Mark } from "./Mark";

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
      expect(() => new Mark(null as never, {})).toThrow('Type must be a string');
    });
  });
});
