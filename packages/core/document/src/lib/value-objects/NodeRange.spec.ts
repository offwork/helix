import { Node } from '../entities/Node';
import { NodeRange } from './NodeRange';
import { NodeType } from './NodeType';
import { ResolvedPos } from './ResolvedPos';

const createMockNode = (name = 'paragraph'): Node =>
  new Node(new NodeType(name, {} as never, { attrs: {} }), {});

describe('NodeRange', () => {
  describe('constructor', () => {
    it('given valid parameters, creates NodeRange instance', () => {
      const $from = new ResolvedPos(1, [createMockNode(), 0, 0], 0);
      const $to = new ResolvedPos(3, [createMockNode(), 0, 0], 0);
      const range = new NodeRange($from, $to, 0);
      expect(range).toBeInstanceOf(NodeRange);
    });

    it('given null $from, throws error', () => {
      const $to = new ResolvedPos(3, [createMockNode(), 0, 0], 0);
      expect(() => new NodeRange(null as never, $to, 0)).toThrow(
        'NodeRange $from cannot be null'
      );
    });

    it('given undefined $from, throws error', () => {
      const $to = new ResolvedPos(3, [createMockNode(), 0, 0], 0);
      expect(() => new NodeRange(undefined as never, $to, 0)).toThrow(
        'NodeRange $from cannot be undefined'
      );
    });

    it('given null $to, throws error', () => {
      const $from = new ResolvedPos(1, [createMockNode(), 0, 0], 0);
      expect(() => new NodeRange($from, null as never, 0)).toThrow(
        'NodeRange $to cannot be null'
      );
    });

    it('given undefined $to, throws error', () => {
      const $from = new ResolvedPos(1, [createMockNode(), 0, 0], 0);
      expect(() => new NodeRange($from, undefined as never, 0)).toThrow(
        'NodeRange $to cannot be undefined'
      );
    });

    it('given null depth, throws error', () => {
      const $from = new ResolvedPos(1, [createMockNode(), 0, 0], 0);
      const $to = new ResolvedPos(3, [createMockNode(), 0, 0], 0);
      expect(() => new NodeRange($from, $to, null as never)).toThrow(
        'NodeRange depth cannot be null'
      );
    });

    it('given undefined depth, throws error', () => {
      const $from = new ResolvedPos(1, [createMockNode(), 0, 0], 0);
      const $to = new ResolvedPos(3, [createMockNode(), 0, 0], 0);
      expect(() => new NodeRange($from, $to, undefined as never)).toThrow(
        'NodeRange depth cannot be undefined'
      );
    });

    it('given negative depth, throws error', () => {
      const $from = new ResolvedPos(1, [createMockNode(), 0, 0], 0);
      const $to = new ResolvedPos(3, [createMockNode(), 0, 0], 0);
      expect(() => new NodeRange($from, $to, -1)).toThrow(
        'NodeRange depth cannot be a negative number'
      );
    });
  });

  describe('start', () => {
    it('given depth 0, returns position before the first child at depth 1', () => {
      const $from = new ResolvedPos(1, [createMockNode(), 0, 1], 0);
      const $to = new ResolvedPos(3, [createMockNode(), 0, 0], 0);
      const range = new NodeRange($from, $to, 0);

      expect(range.start).toBe(1);
    });
  });

  describe('end', () => {
    it('given depth 0, returns position after the last child at depth 1', () => {
      const childNode = createMockNode();
      const $from = new ResolvedPos(1, [createMockNode(), 0, 0], 0);
      const $to = new ResolvedPos(
        3,
        [createMockNode(), 0, 0, childNode, 0, 0],
        0
      );
      const range = new NodeRange($from, $to, 0);

      expect(range.end).toBe(childNode.nodeSize);
    });
  });

  describe('parrent', () => {
    it('given depth 0, returns node at depth 0', () => {
      const node = createMockNode();
      const $from = new ResolvedPos(1, [node, 0, 0], 0);
      const $to = new ResolvedPos(3, [node, 0, 0], 0);
      const range = new NodeRange($from, $to, 0);

      expect(range.parent).toBe(node);
    });
  });

  describe('startIndex', () => {
    it('given depth 0, returns $from index at depth', () => {
      const $from = new ResolvedPos(1, [createMockNode(), 2, 0], 0);
      const $to = new ResolvedPos(3, [createMockNode(), 0, 0], 0);
      const range = new NodeRange($from, $to, 0);

      expect(range.startIndex).toBe(2);
    });
  });

  describe('endIndex', () => {
    it('given depth 0, returns $to index at depth', () => {
      const $from = new ResolvedPos(1, [createMockNode(), 0, 0], 0);
      const $to = new ResolvedPos(3, [createMockNode(), 2, 3], 0);
      const range = new NodeRange($from, $to, 0);

      expect(range.endIndex).toBe(2);
    });
  });
});
