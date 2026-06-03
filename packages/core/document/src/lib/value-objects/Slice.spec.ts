import { Fragment } from '../entities/Fragment';
import { Node } from '../entities/Node';
import { Slice } from './Slice';
import { ContentMatch } from './ContentMatch';
import {
  createMockNode,
  paragraphType,
  headingType,
  emptyContent,
  nonEmptyContent,
  createMockNodeType,
  createSelfRefNodeType,
} from '../../testing';

describe('Slice Value Object', () => {
  describe('constructor', () => {
    it('returns Slice instance', () => {
      const slice = new Slice(emptyContent, 0, 0);

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
      expect(() => new Slice(emptyContent, -1, 0)).toThrow(
        'Slice openStart cannot be negative'
      );
    });

    it('given negative openEnd, throws "Slice openEnd cannot be negative"', () => {
      expect(() => new Slice(emptyContent, 0, -1)).toThrow(
        'Slice openEnd cannot be negative'
      );
    });

    it('given float openStart, throws "Slice openStart must be an integer"', () => {
      expect(() => new Slice(emptyContent, 1.7, 0)).toThrow(
        'Slice openStart must be an integer'
      );
    });

    it('given float openEnd, throws "Slice openEnd must be an integer"', () => {
      expect(() => new Slice(emptyContent, 1, 0.3)).toThrow(
        'Slice openEnd must be an integer'
      );
    });

    it('throws error when openEnd is less than openStart', () => {
      expect(() => new Slice(emptyContent, 2, 1)).toThrow(
        'Slice openEnd cannot be less than openStart'
      );
    });

    it('throws error when empty fragment has non-zero openStart', () => {
      expect(() => new Slice(emptyContent, 1, 1)).toThrow(
        'Slice with empty content must have zero opens'
      );
    });

    it('throws error when empty fragment has non-zero openEnd', () => {
      expect(() => new Slice(emptyContent, 1, 2)).toThrow(
        'Slice with empty content must have zero opens'
      );
    });
  });

  describe('equals', () => {
    it('returns true when all properties match', () => {
      const node = createMockNode(paragraphType);
      const content = Fragment.from([node]);
      const slice1 = new Slice(content, 1, 2);
      const slice2 = new Slice(content, 1, 2);

      expect(slice1.equals(slice2)).toBe(true);
    });

    it('returns false when content differs', () => {
      const content1 = Fragment.from([createMockNode(paragraphType)]);
      const content2 = Fragment.from([createMockNode(headingType)]);
      const slice1 = new Slice(content1, 1, 2);
      const slice2 = new Slice(content2, 1, 2);

      expect(slice1.equals(slice2)).toBe(false);
    });

    it('returns false when openStart differs', () => {
      const node = createMockNode(paragraphType);
      const content = Fragment.from([node]);
      const slice1 = new Slice(content, 1, 2);
      const slice2 = new Slice(content, 2, 2);

      expect(slice1.equals(slice2)).toBe(false);
    });

    it('returns false when openEnd differs', () => {
      const node = createMockNode(paragraphType);
      const content = Fragment.from([node]);
      const slice1 = new Slice(content, 1, 2);
      const slice2 = new Slice(content, 1, 3);

      expect(slice1.equals(slice2)).toBe(false);
    });

    it('given structurally equal content but different references, returns true', () => {
      const node = createMockNode(paragraphType);
      const content1 = Fragment.from([node]);
      const content2 = Fragment.from([node]);
      const slice1 = new Slice(content1, 1, 2);
      const slice2 = new Slice(content2, 1, 2);

      expect(slice1.equals(slice2)).toBe(true);
    });
  });

  describe('size', () => {
    it('given zero opens, returns content.size', () => {
      const slice = new Slice(emptyContent, 0, 0);

      expect(slice.size).toBe(emptyContent.childCount);
    });

    it('given non-zero openStart and openEnd, returns content.size minus openStart and openEnd', () => {
      const slice = new Slice(nonEmptyContent, 1, 2);

      expect(slice.size).toBe(nonEmptyContent.size - 3);
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

  describe('toString', () => {
    it('given non-empty slice, returns content string with open depths', () => {
      const node = createMockNode(paragraphType);
      const content = Fragment.from([node]);
      const slice = new Slice(content, 1, 2);

      expect(slice.toString()).toBe(`${content.toString()}(1,2)`);
    });
  });

  describe('maxOpen', () => {
    it('given fragment with non-leaf first and last children, returns slice with correct open depths', () => {
      const node1 = createMockNode(paragraphType);
      const node2 = createMockNode(headingType);
      const content = Fragment.from([node1, node2]);
      const slice = Slice.maxOpen(content);

      expect(slice.openStart).toBe(1);
      expect(slice.openEnd).toBe(1);
    });

    it('given fragment with leaf first child, returns openStart 0', () => {
      const leafType = createMockNodeType('image');
      leafType.contentMatch = ContentMatch.empty;
      const node = createMockNode(leafType);
      const content = Fragment.from([node]);
      const slice = Slice.maxOpen(content);

      expect(slice.openStart).toBe(0);
    });

    it('given empty fragment, returns slice with zero opens', () => {
      const slice = Slice.maxOpen(Fragment.empty());

      expect(slice.openStart).toBe(0);
      expect(slice.openEnd).toBe(0);
    });
  });

  describe('insertAt()', () => {
    it('given valid pos and fragment, returns new Slice with fragment inserted', () => {
      const node1 = new Node(paragraphType, {});
      const node2 = new Node(paragraphType, {});
      const inserted = new Node(paragraphType, {});
      const slice = new Slice(Fragment.from([node1, node2]), 0, 0);

      const result = slice.insertAt(2, Fragment.from([inserted]));

      expect(result).not.toBeNull();
      expect(result?.content.childCount).toBe(3);
      expect(result?.content.child(1)).toBe(inserted);
    });

    it('given openStart offset, preserves openStart and openEnd on result', () => {
      const innerType = createSelfRefNodeType('inner');
      const inner1 = new Node(innerType, {});
      const inner2 = new Node(innerType, {});
      const outer = new Node(
        innerType,
        {},
        Fragment.from([inner1, inner2]),
        []
      );
      const slice = new Slice(Fragment.from([outer]), 1, 1);
      const inserted = new Node(innerType, {});

      const result = slice.insertAt(2, Fragment.from([inserted]));

      expect(result).not.toBeNull();
      expect(result?.openStart).toBe(1);
      expect(result?.openEnd).toBe(1);
    });
  });

  describe('removeBetween()', () => {
    it('given valid range, returns new Slice with range removed', () => {
      const node1 = new Node(paragraphType, {});
      const node2 = new Node(paragraphType, {});
      const node3 = new Node(paragraphType, {});
      const slice = new Slice(Fragment.from([node1, node2, node3]), 0, 0);

      const result = slice.removeBetween(2, 4);

      expect(result.content.childCount).toBe(2);
      expect(result.content.child(0)).toBe(node1);
      expect(result.content.child(1)).toBe(node3);
    });

    it('given openStart offset, preserves openStart and openEnd on result', () => {
      const innerType = createSelfRefNodeType('inner');
      const inner1 = new Node(innerType, {});
      const inner2 = new Node(innerType, {});
      const outer = new Node(
        innerType,
        {},
        Fragment.from([inner1, inner2]),
        []
      );
      const slice = new Slice(Fragment.from([outer]), 1, 1);

      const result = slice.removeBetween(0, 2);

      expect(result.openStart).toBe(1);
      expect(result.openEnd).toBe(1);
    });
  });
});
