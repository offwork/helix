import { Mark } from './Mark';
import { MarkSet } from './MarkSet';

describe('MarkSet Value Object', () => {
  describe('Construction', () => {
    it('empty, given no parameters, returns MarkSet instance', () => {
      const markSet = MarkSet.empty();

      expect(markSet).toBeInstanceOf(MarkSet);
    });

    it('empty, given multiple calls, returns same instance', () => {
      const markSet1 = MarkSet.empty();
      const markSet2 = MarkSet.empty();

      expect(markSet1).toBe(markSet2);
    });

    it('from, given marks array, returns MarkSet instance', () => {
      const mark1 = new Mark('strong', { color: 'red' });
      const mark2 = new Mark('italic', {});

      const markSet = MarkSet.from([mark1, mark2]);

      expect(markSet).toBeInstanceOf(MarkSet);
    });

    it('from, given empty array, returns empty MarkSet', () => {
      const markSet = MarkSet.from([]);

      expect(markSet).toBeInstanceOf(MarkSet);
    });

    it('from, given non-mark values, throws error', () => {
      expect(() => MarkSet.from(['bold'] as never)).toThrow(
        'MarkSet must be created with array of mark objects'
      );
    });

    it('from, given external array mutated, MarkSet remains unchanged', () => {
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
    it('size, given empty markset, returns 0', () => {
      const markSet = MarkSet.empty();

      expect(markSet.size).toBe(0);
    });

    it('size, given markset with marks, returns correct count', () => {
      const mark1 = new Mark('strong', { color: 'red' });
      const mark2 = new Mark('italic', {});

      const markSet = MarkSet.from([mark1, mark2]);

      expect(markSet.size).toEqual(2);
    });
  });

  describe('add() method', () => {
    it('add, given empty markset, returns new markset with mark', () => {
      const markSet = MarkSet.empty();
      const mark = new Mark('bold', {});

      const result = markSet.add(mark);

      expect(result).toBeInstanceOf(MarkSet);
    });

    it('add, given markset with marks, returns new markset with added mark', () => {
      const mark1 = new Mark('strong', { color: 'red' });
      const mark2 = new Mark('italic', {});
      const mark3 = new Mark('underline', {});

      const markSet = MarkSet.from([mark1, mark2]);

      const result = markSet.add(mark3);

      expect(result).toBeInstanceOf(MarkSet);
    });

    it('add, given mark with same type exists, returns same instance', () => {
      const mark1 = new Mark('strong', { weight: '900' });
      const mark2 = new Mark('strong', {});

      const markSet = MarkSet.from([mark1]);

      const result = markSet.add(mark2);

      expect(result).toBe(markSet);
    });

    it('add, given mark added, original markset remains unchanged', () => {
      const mark1 = new Mark('strong', { color: 'red' });
      const mark2 = new Mark('italic', {});
      const mark3 = new Mark('underline', {});

      const markSet = MarkSet.from([mark1, mark2]);

      markSet.add(mark3);

      expect(markSet.size).toBe(2);
    });
  });

  describe('contains() method', () => {
    it('contains, given mark type exists, returns true', () => {
      const markStrong = new Mark('strong', { color: 'red' });
      const markItalic = new Mark('italic', {});

      const markSet = MarkSet.from([markStrong, markItalic]);

      expect(markSet.contains(markItalic)).toBe(true);
    });

    it('contains, given mark type does not exist, returns false', () => {
      const markStrong = new Mark('strong', { color: 'red' });
      const markItalic = new Mark('italic', {});
      const markUnderline = new Mark('underline', {});

      const markSet = MarkSet.from([markStrong, markItalic]);

      expect(markSet.contains(markUnderline)).toBe(false);
    });

    it('contains, given empty markset, returns false', () => {
      const markStrong = new Mark('strong', { color: 'red' });
      const markSet = MarkSet.empty();

      expect(markSet.contains(markStrong)).toBe(false);
    });
  });

  describe('remove() method', () => {
    it('remove, given mark exists, returns new markset without mark', () => {
      const mark = new Mark('strong', { color: 'red' });
      const markSet = MarkSet.from([mark]);

      const result = markSet.remove(mark);

      expect(result).toBeInstanceOf(MarkSet);
      expect(result.contains(mark)).toBe(false);
    });

    it('remove, given mark does not exist, returns same instance', () => {
      const markStrong = new Mark('strong', { color: 'red' });
      const markItalic = new Mark('italic', {});
      const markUnderline = new Mark('underline', {});

      const markSet = MarkSet.from([markStrong, markItalic]);

      const result = markSet.remove(markUnderline);

      expect(result).toBe(markSet);
    });

    it('remove, given empty markset, returns same instance', () => {
      const mark = new Mark('strong', { color: 'red' });
      const markSet = MarkSet.empty();

      const result = markSet.remove(mark);

      expect(result).toBe(markSet);
    });

    it('remove, given mark removed, original markset remains unchanged', () => {
      const mark1 = new Mark('strong', { color: 'red' });
      const mark2 = new Mark('italic', {});
      const mark3 = new Mark('underline', {});

      const markSet = MarkSet.from([mark1, mark2, mark3]);

      markSet.remove(mark3);

      expect(markSet.size).toBe(3);
    });
  });
});
