import { Fragment } from '../entities/Fragment';
import { Node } from '../entities/Node';
import { TextNode } from '../entities/TextNode';
import { removeRange, insertInto } from './replace';
import { createSelfRefNodeType, paragraphType, textType } from '../../testing';

describe('removeRange', () => {
  describe('given flat range at child boundary', () => {
    it('removes the range and returns remaining fragment', () => {
      const node1 = new Node(paragraphType, {});
      const node2 = new Node(paragraphType, {});
      const node3 = new Node(paragraphType, {});
      const content = Fragment.from([node1, node2, node3]);

      const result = removeRange(content, 2, 4);

      expect(result.childCount).toBe(2);
      expect(result.child(0)).toBe(node1);
      expect(result.child(1)).toBe(node3);
    });
  });

  describe('given range inside a text node', () => {
    it('removes the text range and returns remaining fragment', () => {
      const text = new TextNode(textType, {}, 'helloworld');
      const content = Fragment.from([text]);

      const result = removeRange(content, 2, 7);

      expect((result.child(0) as TextNode).text).toBe('herld');
    });
  });

  describe('given non-flat range crossing child boundaries', () => {
    it('throws "Removing non-flat range"', () => {
      const inner1 = new Node(
        paragraphType,
        {},
        Fragment.from([new Node(paragraphType, {})]),
        []
      );
      const inner2 = new Node(
        paragraphType,
        {},
        Fragment.from([new Node(paragraphType, {})]),
        []
      );
      const content = Fragment.from([inner1, inner2]);

      expect(() => removeRange(content, 1, 5)).toThrow(
        'Removing non-flat range'
      );
    });
  });

  describe('given range inside a single non-text child', () => {
    it('removes recursively and returns updated fragment', () => {
      const child1 = new Node(paragraphType, {});
      const child2 = new Node(paragraphType, {});
      const parent = new Node(
        paragraphType,
        {},
        Fragment.from([child1, child2]),
        []
      );
      const content = Fragment.from([parent]);

      const result = removeRange(content, 1, 3);

      expect(result.child(0).content.childCount).toBe(1);
      expect(result.child(0).content.child(0)).toBe(child2);
    });
  });

  describe('given null child at index', () => {
    it('throws "Removing non-flat range"', () => {
      const content = Fragment.empty<Node>();

      expect(() => removeRange(content, 0, 0)).toThrow(
        'Removing non-flat range'
      );
    });
  });
});

describe('insertInto', () => {
  describe('given dist at child boundary', () => {
    it('inserts fragment at boundary and returns updated fragment', () => {
      const node1 = new Node(paragraphType, {});
      const node2 = new Node(paragraphType, {});
      const inserted = new Node(paragraphType, {});
      const content = Fragment.from([node1, node2]);

      const result = insertInto(content, 2, Fragment.from([inserted]));

      expect(result).not.toBeNull();
      expect(result?.childCount).toBe(3);
      expect(result?.child(1)).toBe(inserted);
    });
  });

  describe('given dist inside a text node', () => {
    it('inserts fragment and returns merged text', () => {
      const text = new TextNode(textType, {}, 'helloworld');
      const content = Fragment.from([text]);
      const insert = Fragment.from([new TextNode(textType, {}, ' ')]);

      const result = insertInto(content, 5, insert);

      expect(result).not.toBeNull();
      expect((result?.child(0) as TextNode).text).toBe('hello world');
    });
  });

  describe('given parent that rejects the insert', () => {
    it('returns null', () => {
      const node1 = new Node(paragraphType, {});
      const content = Fragment.from([node1]);
      const insert = Fragment.from([new Node(paragraphType, {})]);
      const rejectingParent = { canReplace: () => false } as unknown as Node;

      const result = insertInto(content, 0, insert, rejectingParent);

      expect(result).toBeNull();
    });
  });

  describe('given dist inside a non-text child', () => {
    it('inserts recursively and returns updated fragment', () => {
      const childType = createSelfRefNodeType('child');
      const child = new Node(childType, {});
      const parent = new Node(childType, {}, Fragment.from([child]), []);
      const content = Fragment.from([parent]);
      const inserted = new Node(childType, {});

      const result = insertInto(content, 1, Fragment.from([inserted]));

      expect(result).not.toBeNull();
      expect(result?.child(0).content.childCount).toBe(2);
    });
  });

  describe('given null child at index', () => {
    it('returns null', () => {
      const content = Fragment.empty<Node>();

      const result = insertInto(
        content,
        0,
        Fragment.from([new Node(paragraphType, {})])
      );

      expect(result).toBeNull();
    });
  });
});
