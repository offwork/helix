import { Fragment } from '../entities/Fragment';
import { Node } from '../entities/Node';
import { Slice } from './Slice';

const content = Fragment.empty<Node>();
const nonEmptyContent = { size: 3 } as Fragment<Node>;

describe('Slice Value Object', () => {
  describe('constructor', () => {
    it('returns Slice instance', () => {
      const slice = new Slice(content, 0, 0);

      expect(slice).toBeInstanceOf(Slice);
    });

    it('given null content, throws "Slice content cannot be null"', () => {
      expect(() => new Slice(null as never, 0, 0)).toThrow(
        'Slice content cannot be null'
      );
    });

    it('given undefined content, throws "Slice content cannot be undefined"', () => {
      expect(() => new Slice(undefined as never, 0, 0)).toThrow(
        'Slice content cannot be undefined'
      );
    });

    it('given negative openStart, throws "Slice openStart cannot be negative"', () => {
      expect(() => new Slice(content, -1, 0)).toThrow(
        'Slice openStart cannot be negative'
      );
    });

    it('given negative openEnd, throws "Slice openEnd cannot be negative"', () => {
      expect(() => new Slice(content, 0, -1)).toThrow(
        'Slice openEnd cannot be negative'
      );
    });

    it('given float openStart, throws "Slice openStart must be an integer"', () => {
      expect(() => new Slice(content, 1.7, 0)).toThrow(
        'Slice openStart must be an integer'
      );
    });

    it('given float openEnd, throws "Slice openEnd must be an integer"', () => {
      expect(() => new Slice(content, 1, 0.3)).toThrow(
        'Slice openEnd must be an integer'
      );
    });

    it('throws error when openEnd is less than openStart', () => {
      expect(() => new Slice(content, 2, 1)).toThrow(
        'Slice openEnd cannot be less than openStart'
      );
    });

    it('throws error when empty fragment has non-zero openStart', () => {
      expect(() => new Slice(content, 1, 1)).toThrow(
        'Slice with empty content must have zero opens'
      );
    });

    it('throws error when empty fragment has non-zero openEnd', () => {
      expect(() => new Slice(content, 1, 2)).toThrow(
        'Slice with empty content must have zero opens'
      );
    });
  });

  describe('equals', () => {
    it('returns true when all properties match', () => {
      const slice1 = new Slice(nonEmptyContent, 1, 2);
      const slice2 = new Slice(nonEmptyContent, 1, 2);

      expect(slice1.equals(slice2)).toBe(true);
    });

    it('returns false when content differs', () => {
      const content2 = { size: 5 } as Fragment<Node>;
      const slice1 = new Slice(nonEmptyContent, 1, 2);
      const slice2 = new Slice(content2, 1, 2);

      expect(slice1.equals(slice2)).toBe(false);
    });

    it('returns false when openStart differs', () => {
      const slice1 = new Slice(nonEmptyContent, 1, 2);
      const slice2 = new Slice(nonEmptyContent, 2, 2);

      expect(slice1.equals(slice2)).toBe(false);
    });

    it('returns false when openEnd differs', () => {
      const slice1 = new Slice(nonEmptyContent, 1, 2);
      const slice2 = new Slice(nonEmptyContent, 1, 3);

      expect(slice1.equals(slice2)).toBe(false);
    });
  });

  describe('size', () => {
    it('returns content.childCount', () => {
      const slice = new Slice(content, 0, 0);

      expect(slice.size).toBe(content.childCount);
    });
  });

  describe('Slice.empty', () => {
    it('returns Slice instance', () => {
      expect(Slice.empty).toBeInstanceOf(Slice);
    });

    it('has Fragment.empty content and zero opens', () => {
      expect(Slice.empty.openStart).toBe(0);
      expect(Slice.empty.openEnd).toBe(0);
    });
  });
});
