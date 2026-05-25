import { Mark } from './Mark';
import { MarkType } from './MarkType';
import {
  defaultMockSchema,
  defaultMarkSpec,
  boldMarkType,
  italicMarkType,
  createMarkType,
} from '../../testing';

describe('MarkType', () => {
  describe('constructor', () => {
    it('given valid parameters, returns instance of MarkType', () => {
      expect(
        createMarkType('paragraph', defaultMockSchema, defaultMarkSpec)
      ).toBeInstanceOf(MarkType);
      expect(
        createMarkType('paragraph', defaultMockSchema, defaultMarkSpec).name
      ).toBe('paragraph');
    });

    it('given empty name string, throws "MarkType name cannot be empty"', () => {
      expect(() =>
        createMarkType('', defaultMockSchema, defaultMarkSpec)
      ).toThrow('MarkType name cannot be empty');
    });

    it('given whitespace-only name, throws "MarkType name cannot be empty"', () => {
      expect(() =>
        createMarkType('  ', defaultMockSchema, defaultMarkSpec)
      ).toThrow('MarkType name cannot be empty');
    });

    it('given null name, throws "MarkType name cannot be empty"', () => {
      expect(() =>
        createMarkType(null as never, defaultMockSchema, defaultMarkSpec)
      ).toThrow('MarkType name cannot be empty');
    });

    it('given undefined name, throws "MarkType name cannot be empty"', () => {
      expect(() =>
        createMarkType(undefined as never, defaultMockSchema, defaultMarkSpec)
      ).toThrow('MarkType name cannot be empty');
    });

    it('given null schema, throws "MarkType schema cannot be null"', () => {
      expect(() =>
        createMarkType('paragraph', null as never, defaultMarkSpec)
      ).toThrow('MarkType schema cannot be null');
    });

    it('given undefined schema, throws "MarkType schema cannot be undefined"', () => {
      expect(() =>
        createMarkType('paragraph', undefined as never, defaultMarkSpec)
      ).toThrow('MarkType schema cannot be undefined');
    });

    it('given null spec, throws "MarkType spec cannot be null"', () => {
      expect(() =>
        createMarkType('paragraph', defaultMockSchema, null as never)
      ).toThrow('MarkType spec cannot be null');
    });

    it('given undefined spec, throws "MarkType spec cannot be undefined"', () => {
      expect(() =>
        createMarkType('paragraph', defaultMockSchema, undefined as never)
      ).toThrow('MarkType spec cannot be undefined');
    });
  });

  describe('equals', () => {
    it('given MarkTypes with same name, returns true', () => {
      const markType1 = createMarkType(
        'strong',
        defaultMockSchema,
        defaultMarkSpec
      );
      const markType2 = createMarkType('strong', defaultMockSchema, {
        attrs: { color: 'blue' },
      });

      expect(markType1.equals(markType2)).toBe(true);
    });

    it('given MarkTypes with different names, returns false', () => {
      const markType1 = createMarkType(
        'strong',
        defaultMockSchema,
        defaultMarkSpec
      );
      const markType2 = createMarkType('em', defaultMockSchema, {
        attrs: { color: 'blue' },
      });

      expect(markType1.equals(markType2)).toBe(false);
    });

    it('given null parameter, throws "MarkType equals parameter cannot be null"', () => {
      const markType1 = createMarkType(
        'strong',
        defaultMockSchema,
        defaultMarkSpec
      );

      expect(() => markType1.equals(null as never)).toThrow(
        'MarkType equals parameter cannot be null'
      );
    });
  });

  describe('create', () => {
    it('given no attrrs, creates Mark with empty attrs', () => {
      const newMark = boldMarkType.create();

      expect(newMark).toEqual(new Mark(boldMarkType, {}));
    });

    it('given attrs, creates Mark with given attrs', () => {
      const newMark = boldMarkType.create({ color: 'red' });

      expect(newMark).toEqual(new Mark(boldMarkType, { color: 'red' }));
    });
  });

  describe('isInSet', () => {
    it('given mark of this type in set, returns the mark', () => {
      const mark1 = new Mark(boldMarkType, { color: 'red' });
      const mark2 = new Mark(boldMarkType, { color: 'blue' });
      const set = [mark1, mark2];

      expect(boldMarkType.isInSet(set)).toBe(mark1);
    });

    it('given no mark of this type in set, returns undefined', () => {
      const mark1 = new Mark(italicMarkType, { color: 'red' });
      const set = [mark1];

      expect(boldMarkType.isInSet(set)).toBeUndefined();
    });
  });

  describe('removeFromSet', () => {
    it('given mark of this type in set, returns new set without the mark', () => {
      const mark1 = new Mark(boldMarkType, { color: 'red' });
      const mark2 = new Mark(italicMarkType, { color: 'blue' });
      const set = [mark1, mark2];

      expect(boldMarkType.removeFromSet(set)).toEqual([mark2]);
    });

    it('given no mark of this type in set, returns returns same reference', () => {
      const mark1 = new Mark(italicMarkType, { color: 'red' });
      const set = [mark1];

      expect(boldMarkType.removeFromSet(set)).toBe(set);
    });
  });
});
