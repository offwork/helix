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

      expect(() => fragment.child(-1)).toThrow(
        'Index out of bounds: -1 (size: 1)'
      );
    });

    it('throws on index >= size', () => {
      const fragment = Fragment.from([
        new Node(new NodeType('paragraph'), { text: 'Hello' }),
      ]);

      expect(() => fragment.child(1)).toThrow(
        'Index out of bounds: 1 (size: 1)'
      );
      expect(() => fragment.child(5)).toThrow(
        'Index out of bounds: 5 (size: 1)'
      );
    });
  });

  describe('firstChild and lastChild', () => {
    it('returns first and last child', () => {
      const node1 = new Node(new NodeType('paragraph'), { text: 'First' });
      const node2 = new Node(new NodeType('paragraph'), { text: 'Middle' });
      const node3 = new Node(new NodeType('paragraph'), { text: 'Last' });

      const fragment = Fragment.from([node1, node2, node3]);

      expect(fragment.firstChild).toBe(node1);
      expect(fragment.lastChild).toBe(node3);
    });

    it('returns undefined for empty fragment', () => {
      const fragment = Fragment.empty<Node>();

      expect(fragment.firstChild).toBeUndefined();
      expect(fragment.lastChild).toBeUndefined();
    });

    it('returns same node when fragment has one child', () => {
      const node = new Node(new NodeType('paragraph'), { text: 'Only' });
      const fragment = Fragment.from([node]);

      expect(fragment.firstChild).toBe(node);
      expect(fragment.lastChild).toBe(node);
    });
  });

  describe('forEach', () => {
    it('iterates over all children', () => {
      const node1 = new Node(new NodeType('paragraph'), { text: 'First' });
      const node2 = new Node(new NodeType('paragraph'), { text: 'Second' });
      const node3 = new Node(new NodeType('paragraph'), { text: 'Third' });
      const fragment = Fragment.from([node1, node2, node3]);

      const visited: Node[] = [];
      fragment.forEach((node) => {
        visited.push(node);
      });

      expect(visited).toEqual([node1, node2, node3]);
    });

    it('passes index to callback', () => {
      const node1 = new Node(new NodeType('paragraph'), { text: 'First' });
      const node2 = new Node(new NodeType('paragraph'), { text: 'Second' });
      const fragment = Fragment.from([node1, node2]);

      const indces: number[] = [];
      fragment.forEach((node, index) => {
        indces.push(index);
      });

      expect(indces).toEqual([0, 1]);
    });

    it('does nothing for empty fragment', () => {
      const fragment = Fragment.empty<Node>();

      const visited: Node[] = [];
      fragment.forEach((node) => {
        visited.push(node);
      });

      expect(visited).toEqual([]);
    });
  });
});
