import { Mark } from './Mark';
import { MarkSet } from './MarkSet';

describe('MarkSet Value Object', () => {
  describe('Construction', () => {
    it('should create empty markset via static factory', () => {
      const markSet = MarkSet.empty();

      expect(markSet).toBeInstanceOf(MarkSet);
    });
    it('should return same instance for multiple empty() calls', () => {
      const markSet1 = MarkSet.empty();
      const markSet2 = MarkSet.empty();

      expect(markSet1).toBe(markSet2);
    });
    it('should create markset from array', () => {
      const mark1 = new Mark('strong', { color: 'red' });
      const mark2 = new Mark('italic', {});

      const markSet = MarkSet.from([mark1, mark2]);

      expect(markSet).toBeInstanceOf(MarkSet);
    });
    it('should create empty markset when from() gets empty array', () => {
      const markSet = MarkSet.from([]);

      expect(markSet).toBeInstanceOf(MarkSet);
    });
    it('should throw when array contains non-mark values', () => {
      expect(() => MarkSet.from(['bold'] as never)).toThrow(
        'MarkSet must be created with array of mark objects'
      );
    }); // Validation
    it('should store marks immutably', () => {
      const mark1 = new Mark('strong', { color: 'red' });
      const mark2 = new Mark('italic', {});
      const mark3 = new Mark('', {});

      const marks = [mark1, mark2];

      const markSet = MarkSet.from(marks);
      marks.push(mark3);

      expect(markSet.size).toBe(2);
    });
  });

  describe('Basic properties', () => {
    it('should return correct size for empty markset', () => {
      const markSet = MarkSet.empty();

      expect(markSet.size).toBe(0);
    });
    it('should return correct size for markset with marks', () => {
      const mark1 = new Mark('strong', { color: 'red' });
      const mark2 = new Mark('italic', {});

      const markSet = MarkSet.from([mark1, mark2]);

      expect(markSet.size).toEqual(2);
    });
  });
});
