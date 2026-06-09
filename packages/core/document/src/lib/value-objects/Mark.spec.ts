import { Mark } from './Mark';
import {
  createMarkType,
  boldMarkType,
  italicMarkType,
  createMark,
  createSchemaSpec,
  createMarkSpec,
} from '../../testing';
import { Schema } from '../services/Schema';

describe('Mark', () => {
  describe('constructor', () => {
    it('given valid MarkType and attrs, creates Mark instance', () => {
      const mark = createMark(boldMarkType, { color: 'purple' });

      expect(mark).toBeInstanceOf(Mark);
    });

    it('given valid MarkType and attrs, stores type', () => {
      const mark = createMark(boldMarkType, { color: 'purple' });

      expect(mark.type).toBe(boldMarkType);
    });

    it('given valid MarkType and attrs, stores attrs', () => {
      const mark = createMark(boldMarkType, { color: 'purple' });

      expect(mark.attrs).toEqual({ color: 'purple' });
    });

    it('given null type, throws error', () => {
      expect(() => createMark(null as never, {})).toThrow(
        'type coannot be null or undefined'
      );
    });

    it('given undefined type, throws error', () => {
      expect(() => createMark(undefined as never, {})).toThrow(
        'type coannot be null or undefined'
      );
    });

    it('given null attrs, throws error', () => {
      expect(() => createMark(boldMarkType, null as never)).toThrow(
        'Attrs must be an object'
      );
    });

    it('given undefined attrs, throws error', () => {
      expect(() => createMark(boldMarkType, undefined as never)).toThrow(
        'Attrs must be an object'
      );
    });
  });

  describe('equals', () => {
    it('given same type and attrs, returns true', () => {
      const mark = createMark(boldMarkType, { color: 'purple' });
      const mark2 = createMark(boldMarkType, { color: 'purple' });

      expect(mark.equals(mark2)).toBe(true);
    });

    it('given null, throws error', () => {
      expect(() =>
        createMark(boldMarkType, { color: 'purple' }).equals(null as never)
      ).toThrow('Mark cannot be null');
    });

    it('given undefined, throws error', () => {
      expect(() =>
        createMark(boldMarkType, { color: 'purple' }).equals(undefined as never)
      ).toThrow('Mark cannot be undefined');
    });

    it('given different type, returns false', () => {
      const mark = createMark(boldMarkType, { color: 'purple' });
      const mark2 = createMark(italicMarkType, { color: 'purple' });
      expect(mark.equals(mark2)).toBe(false);
    });

    it('given different attrs, returns false', () => {
      const mark = createMark(boldMarkType, { color: 'purple' });
      const mark2 = createMark(boldMarkType, { color: 'red' });
      expect(mark.equals(mark2)).toBe(false);
    });

    it('given self comparison, returns true', () => {
      const mark = createMark(boldMarkType, { color: 'purple' });
      expect(mark.equals(mark)).toBe(true);
    });
  });

  describe('isInSet', () => {
    it('given mark is in set, returns the mark', () => {
      const mark = createMark(boldMarkType, { color: 'purple' });
      const set = [createMark(italicMarkType, { color: 'purple' }), mark];

      expect(mark.isInSet(set)).toBe(mark);
    });

    it('given null set, throws error', () => {
      const mark = createMark(boldMarkType, { color: 'purple' });
      expect(() => mark.isInSet(null as never)).toThrow(
        'Mark isInSet set cannot be null'
      );
    });

    it('given undefined set, throws error', () => {
      const mark = createMark(boldMarkType, { color: 'purple' });
      expect(() => mark.isInSet(undefined as never)).toThrow(
        'Mark isInSet set cannot be undefined'
      );
    });
  });

  describe('removeFromSet', () => {
    it('given mark is in set, returns new set without the mark', () => {
      const mark = createMark(boldMarkType, { color: 'purple' });
      const set = [createMark(italicMarkType, { color: 'purple' }), mark];

      const newSet = mark.removeFromSet(set);

      expect(newSet).toEqual([createMark(italicMarkType, { color: 'purple' })]);
    });

    it('given mark is not in set, returns same reference', () => {
      const mark = createMark(boldMarkType, { color: 'purple' });
      const set = [createMark(italicMarkType, { color: 'purple' })];

      const newSet = mark.removeFromSet(set);

      expect(newSet).toBe(set);
    });

    it('given null set, throws error', () => {
      const mark = createMark(boldMarkType, { color: 'purple' });
      expect(() => mark.removeFromSet(null as never)).toThrow(
        'Mark removeFromSet set cannot be null'
      );
    });

    it('given undefined set, throws error', () => {
      const mark = createMark(boldMarkType, { color: 'purple' });
      expect(() => mark.removeFromSet(undefined as never)).toThrow(
        'Mark removeFromSet set cannot be undefined'
      );
    });
  });

  describe('addToSet', () => {
    it('given mark already in set, returns same reference', () => {
      const mark = createMark(boldMarkType, { color: 'purple' });
      const set = [mark];

      const newSet = mark.addToSet(set);

      expect(newSet).toBe(set);
    });

    it('given empty set, returns set with this mark', () => {
      const mark = createMark(boldMarkType, { color: 'purple' });
      const set: Mark[] = [];

      const newSet = mark.addToSet(set);

      expect(newSet).toEqual([mark]);
    });

    it('given mark with lower rank, insert before existing mark', () => {
      const mark1 = createMark(createMarkType('strong', {}, {}), {});
      const mark2 = createMark(createMarkType('em', {}, {}), {});
      mark1.type.rank = 1;
      mark2.type.rank = 2;

      const set = [mark2];

      const newSet = mark1.addToSet(set);

      expect(newSet).toEqual([mark1, mark2]);
    });

    it('given mark excluded by existing mark, returns same reference', () => {
      const mark1 = createMark(createMarkType('strong', {}, {}), {});
      const mark2 = createMark(createMarkType('em', {}, {}), {});
      mark1.type.rank = 1;
      mark2.type.rank = 2;
      mark2.type.excluded = [mark1.type];

      const set = [mark2];

      const newSet = mark1.addToSet(set);

      expect(newSet).toBe(set);
    });

    it('given mark that excludes existing mark, returns set without existing mark', () => {
      const mark1 = createMark(createMarkType('strong', {}, {}), {});
      const mark2 = createMark(createMarkType('em', {}, {}), {});
      mark1.type.rank = 1;
      mark2.type.rank = 2;
      mark1.type.excluded = [mark2.type];

      const set = [mark2];

      const newSet = mark1.addToSet(set);

      expect(newSet).toEqual([mark1]);
    });
  });

  describe('sameSet()', () => {
    it('given equal sets, returns true', () => {
      const marks1 = [
        createMark(boldMarkType, { color: 'purple' }),
        createMark(italicMarkType, { color: 'purple' }),
      ];
      const marks2 = [
        createMark(boldMarkType, { color: 'purple' }),
        createMark(italicMarkType, { color: 'purple' }),
      ];

      expect(Mark.sameSet(marks1, marks2)).toBe(true);
    });

    it('given sets of different length, returns false', () => {
      const marks1 = [createMark(boldMarkType, { color: 'purple' })];
      const marks2 = [
        createMark(boldMarkType, { color: 'purple' }),
        createMark(italicMarkType, { color: 'purple' }),
      ];

      expect(Mark.sameSet(marks1, marks2)).toBe(false);
    });

    it('given sets same length but different marks, returns false', () => {
      const marks1 = [
        createMark(boldMarkType, { color: 'purple' }),
        createMark(italicMarkType, { color: 'purple' }),
      ];
      const marks2 = [
        createMark(italicMarkType, { color: 'blue' }),
        createMark(italicMarkType, { color: 'purple' }),
      ];

      expect(Mark.sameSet(marks1, marks2)).toBe(false);
    });
  });

  describe('toJSON', () => {
    it('given mark with no attrs, returns object with only type name', () => {
      const mark = createMark(boldMarkType, {});

      expect(mark.toJSON()).toEqual({ type: 'bold' });
    });

    it('given mark with attrs, returns object with type name and attrs', () => {
      const mark = createMark(boldMarkType, { color: 'purple' });

      expect(mark.toJSON()).toEqual({
        type: 'bold',
        attrs: { color: 'purple' },
      });
    });
  });

  describe('fromJSON', () => {
    it('given valid json with no attrs, returns Mark instance', () => {
      const schema = new Schema({
        nodes: createSchemaSpec(),
        marks: createMarkSpec(),
      });
      const json = { type: 'strong' };
      const mark = Mark.fromJSON(schema, json);

      expect(mark).toBeInstanceOf(Mark);
    });

    it('given valid json with attrs, returns Mark with correct attrs', () => {
      const schema = new Schema({
        nodes: createSchemaSpec(),
        marks: createMarkSpec(),
      });
      const json = { type: 'strong', attrs: { color: 'purple' } };
      const mark = Mark.fromJSON(schema, json);

      expect(mark.attrs).toEqual({ color: 'purple' });
    });

    it('given null json, throws RangeError', () => {
      const schema = new Schema({
        nodes: createSchemaSpec(),
        marks: createMarkSpec(),
      });

      expect(() => Mark.fromJSON(schema, null as never)).toThrow(
        'Invalid input for Mark.fromJSON'
      );
    });

    it('given json with unknown type, throws RangeError', () => {
      const schema = new Schema({
        nodes: createSchemaSpec(),
        marks: createMarkSpec(),
      });
      const json = { type: 'unknown_mark' };

      expect(() => Mark.fromJSON(schema, json)).toThrow(
        'There is no mark type unknown_mark in this schema'
      );
    });
  });

  describe('setFrom', () => {
    it('given undefined value, returns Mark.none', () => {
      expect(Mark.setFrom(undefined as never)).toBe(Mark.none);
    });

    it('given null value, returns Mark.none', () => {
      expect(Mark.setFrom(null as never)).toBe(Mark.none);
    });

    it('given empty array, returns Mark.none', () => {
      expect(Mark.setFrom([])).toBe(Mark.none);
    });

    it('given single mark, returns array containing that mark', () => {
      const mark = createMark(createMarkType('strong', {}, {}), {});

      expect(Mark.setFrom(mark)[0]).toBe(mark);
    });

    it('given sorted array, returns sorted copy', () => {
      const mark1 = createMark(createMarkType('strong', {}, {}), {});
      const mark2 = createMark(createMarkType('em', {}, {}), {});
      const mark3 = createMark(createMarkType('underline', {}, {}), {});
      mark1.type.rank = 1;
      mark2.type.rank = 2;
      mark3.type.rank = 3;

      const sortedMarks = [mark1, mark2, mark3];

      expect(Mark.setFrom(sortedMarks)).toEqual(sortedMarks);
    });

    it('given unsorted array, returns array sorted by rank', () => {
      const mark1 = createMark(createMarkType('strong', {}, {}), {});
      const mark2 = createMark(createMarkType('em', {}, {}), {});
      const mark3 = createMark(createMarkType('underline', {}, {}), {});
      mark1.type.rank = 2;
      mark2.type.rank = 3;
      mark3.type.rank = 1;

      const sortedMarks = [mark2, mark1, mark3];

      expect(Mark.setFrom(sortedMarks)).toEqual([mark3, mark1, mark2]);
    });

    it('given array with one mark, returns copy not same reference', () => {
      const mark = createMark(createMarkType('strong', {}, {}), {});
      const marks = [mark];

      expect(Mark.setFrom(marks)).not.toBe(marks);
    });
  });
});
