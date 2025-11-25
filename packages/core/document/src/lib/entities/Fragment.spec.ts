import { NodeType } from '../value-objects/NodeType';
import { Fragment } from './Fragment';
import { Node } from './Node';

describe('Fragment', () => {
  describe('creation', () => {
    it('creates empty fragment', () => {
      const fragment = Fragment.empty<Node>();

      expect(fragment).toBeInstanceOf(Fragment);
      expect(fragment.size).toBe(0);
    });

    it('creates fragment with nodes', () => {
      const node1 = new Node(new NodeType('paragraph'), { text: 'Hello' });
      const node2 = new Node(new NodeType('paragraph'), { text: 'World' });

      const fragment = Fragment.from([node1, node2]);

      expect(fragment).toBeInstanceOf(Fragment);
      expect(fragment.size).toBe(2);
    });
  });

  describe('child access', () => {
    it('accesses child by valid index', () => {
      const node1 = new Node(new NodeType('paragraph'), { text: 'Hello' });
      const node2 = new Node(new NodeType('paragraph'), { text: 'World' });

      const fragment = Fragment.from([node1, node2]);

      expect(fragment.child(0)).toBe(node1);
      expect(fragment.child(1)).toBe(node2);
    });

    it('throws on negative index', () => {
      const fragment = Fragment.from([
        new Node(new NodeType('paragraph'), { text: 'Hello' }),
      ]);

      expect(() => fragment.child(-1)).toThrow('Index out of bounds');
    });

    it('throws on index >= size', () => {
      const fragment = Fragment.from([
        new Node(new NodeType('paragraph'), { text: 'Hello' }),
      ]);

      expect(() => fragment.child(1)).toThrow('Index out of bounds');
      expect(() => fragment.child(5)).toThrow('Index out of bounds');
    });
  });
});
