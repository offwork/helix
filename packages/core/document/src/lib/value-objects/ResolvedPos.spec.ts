import { Fragment } from '../entities/Fragment';
import { Node } from '../entities/Node';
import { NodeType } from './NodeType';
import { ResolvedPos } from './ResolvedPos';

const path: (Node | number)[] = [];

const createMockNode = (name = 'paragraph'): Node =>
  new Node(new NodeType(name, {} as never, { attrs: {} }), {});

describe('ResolvedPos', () => {
  describe('constructor', () => {
    it('given valid parameters, stores pos, path and parentOffset', () => {
      const resolvedPos = new ResolvedPos(1, path, 5);

      expect(resolvedPos).toBeInstanceOf(ResolvedPos);
      expect(resolvedPos.pos).toBe(1);
      expect(resolvedPos.path).toBe(path);
      expect(resolvedPos.parentOffset).toBe(5);
    });

    it('given null pos, throws "ResolvedPos pos cannot be null"', () => {
      expect(() => new ResolvedPos(null as never, path, 5)).toThrow(
        'ResolvedPos pos cannot be null'
      );
    });

    it('given undefined pos, throws "ResolvedPos pos cannot be undefined"', () => {
      expect(() => new ResolvedPos(undefined as never, path, 5)).toThrow(
        'ResolvedPos pos cannot be undefined'
      );
    });

    it('given negative pos, throws "ResolvedPos pos cannot be negative"', () => {
      expect(() => new ResolvedPos(-1, path, 5)).toThrow(
        'ResolvedPos pos cannot be negative'
      );
    });

    it('given null path, throws "ResolvedPos path cannot be null"', () => {
      expect(() => new ResolvedPos(1, null as never, 5)).toThrow(
        'ResolvedPos path cannot be null'
      );
    });

    it('given undefined path, throws "ResolvedPos path cannot be undefined"', () => {
      expect(() => new ResolvedPos(1, undefined as never, 5)).toThrow(
        'ResolvedPos path cannot be undefined'
      );
    });

    it('given path length not multiple of 3, throws error', () => {
      const invalidPath = [1, createMockNode()];

      expect(() => new ResolvedPos(1, invalidPath, 5)).toThrow(
        'ResolvedPos path length must be a multiple of 3'
      );
    });

    it('given null parentOffset, throws "ResolvedPos parentOffset cannot be null"', () => {
      expect(() => new ResolvedPos(1, path, null as never)).toThrow(
        'ResolvedPos parentOffset cannot be null'
      );
    });

    it('given undefined parentOffset, throws "ResolvedPos parentOffset cannot be undefined"', () => {
      expect(() => new ResolvedPos(1, path, undefined as never)).toThrow(
        'ResolvedPos parentOffset cannot be undefined'
      );
    });

    it('given negative parentOffset, throws "ResolvedPos parentOffset cannot be negative"', () => {
      expect(() => new ResolvedPos(1, path, -1)).toThrow(
        'ResolvedPos parentOffset cannot be negative'
      );
    });
  });

  describe('depth', () => {
    it('given path with one level, is 0', () => {
      const resolvedPos = new ResolvedPos(1, [createMockNode(), 1, 0], 5);

      expect(resolvedPos.depth).toBe(0);
    });

    it('given path with two levels, is 1', () => {
      const resolvedPos = new ResolvedPos(
        1,
        [createMockNode(), 1, 0, createMockNode(), 2, 0],
        5
      );

      expect(resolvedPos.depth).toBe(1);
    });
  });

  describe('doc', () => {
    it('given valid path, returns root node', () => {
      const rootNode = createMockNode();
      const resolvedPos = new ResolvedPos(1, [rootNode, 1, 0], 5);

      expect(resolvedPos.doc).toBe(rootNode);
    });
  });

  describe('parent', () => {
    it('given depth 0, returns root node', () => {
      const rootNode = createMockNode();
      const resolvedPos = new ResolvedPos(1, [rootNode, 1, 0], 5);

      expect(resolvedPos.parent).toBe(rootNode);
    });

    it('given depth 1, returns node at depth 1', () => {
      const rootNode = createMockNode();
      const childNode = createMockNode();
      const resolvedPos = new ResolvedPos(
        1,
        [rootNode, 1, 0, childNode, 2, 0],
        5
      );

      expect(resolvedPos.parent).toBe(childNode);
    });
  });

  describe('node', () => {
    it('given depth 0, returns root node', () => {
      const rootNode = createMockNode();
      const resolvedPos = new ResolvedPos(1, [rootNode, 1, 0], 5);

      expect(resolvedPos.node(0)).toBe(rootNode);
    });

    it('given no arguments, returns parent node', () => {
      const rootNode = createMockNode();
      const childNode = createMockNode();
      const resolvedPos = new ResolvedPos(
        1,
        [rootNode, 1, 0, childNode, 2, 0],
        5
      );

      expect(resolvedPos.node()).toBe(childNode);
    });
  });

  describe('index', () => {
    it('given depth 0, returns index at root level', () => {
      const resolvedPos = new ResolvedPos(1, [createMockNode(), 1, 0], 5);

      expect(resolvedPos.index(0)).toBe(1);
    });

    it('given no arguments, returns index at current depth', () => {
      const resolvedPos = new ResolvedPos(
        1,
        [createMockNode(), 1, 0, createMockNode(), 2, 0],
        5
      );

      expect(resolvedPos.index()).toBe(2);
    });
  });

  describe('start', () => {
    it('given depth 0, returns 0', () => {
      const resolvedPos = new ResolvedPos(1, [createMockNode(), 1, 0], 5);

      expect(resolvedPos.start(0)).toBe(0);
    });
  });

  describe('end', () => {
    it('given depth 0, returns root content size', () => {
      const rootNode = createMockNode();
      const resolvedPos = new ResolvedPos(1, [rootNode, 1, 0], 5);

      expect(resolvedPos.end(0)).toBe(rootNode.content.size);
    });
  });

  describe('before', () => {
    it("given depth 0, throws 'There is no position before the top-level node'", () => {
      const resolvedPos = new ResolvedPos(1, [createMockNode(), 1, 0], 5);

      expect(() => resolvedPos.before(0)).toThrow(
        'There is no position before the top-level node'
      );
    });

    it('given depth 1, returns path start offset', () => {
      const resolvedPos = new ResolvedPos(
        1,
        [createMockNode(), 1, 0, createMockNode(), 2, 0],
        5
      );

      expect(resolvedPos.before(1)).toBe(0);
    });
  });

  describe('after', () => {
    it("given depth 0, throws 'There is no position after the top-level node'", () => {
      const resolvedPos = new ResolvedPos(1, [createMockNode(), 1, 0], 5);

      expect(() => resolvedPos.after(0)).toThrow(
        'There is no position after the top-level node'
      );
    });

    it('given depth 1, returns position after node', () => {
      const resolvedPos = new ResolvedPos(
        1,
        [createMockNode(), 1, 0, createMockNode(), 2, 0],
        5
      );

      expect(resolvedPos.after(1)).toBe(2);
    });
  });

  describe('textOffset', () => {
    it('given pos eqals last path offset, returns 0', () => {
      const resolvedPos = new ResolvedPos(0, [createMockNode(), 1, 0], 0);

      expect(resolvedPos.textOffset).toBe(0);
    });
  });

  describe('indexAfter', () => {
    it('given depth equals current depth and no textOffset, returns same as index', () => {
      const resolvedPos = new ResolvedPos(
        0,
        [createMockNode(), 1, 0, createMockNode(), 2, 0],
        0
      );

      expect(resolvedPos.indexAfter()).toBe(resolvedPos.index());
    });
  });

  describe('sameParent', () => {
    it('given positions with same parent, returns true', () => {
      const rootNode = createMockNode();
      const childNode = createMockNode();
      const resolvedPos1 = new ResolvedPos(
        1,
        [rootNode, 1, 0, childNode, 2, 0],
        1
      );
      const resolvedPos2 = new ResolvedPos(
        2,
        [rootNode, 1, 0, childNode, 2, 0],
        2
      );

      expect(resolvedPos1.sameParent(resolvedPos2)).toBe(true);
    });
  });

  describe('sharedDepth', () => {
    it('given pos inside current node, returns current depth', () => {
      const rootNode = createMockNode();
      const childNode = createMockNode();
      const resolvedPos = new ResolvedPos(
        1,
        [rootNode, 1, 0, childNode, 2, 0],
        1
      );

      expect(resolvedPos.sharedDepth(1)).toBe(1);
    });

    it('given pos at root level only, returns 0', () => {
      const rootNode = createMockNode();
      const childNode = createMockNode();
      const resolvedPos = new ResolvedPos(
        1,
        [rootNode, 1, 0, childNode, 2, 0],
        1
      );

      expect(resolvedPos.sharedDepth(2)).toBe(0);
    });
  });

  describe('max', () => {
    it('given other with greater pos, returns other', () => {
      const rootNode = createMockNode();
      const path = [rootNode, 0, 0];
      const a = new ResolvedPos(1, path, 0);
      const b = new ResolvedPos(3, path, 0);

      expect(a.max(b)).toBe(b);
    });
  });

  describe('min', () => {
    it('given other with smaller pos, returns other', () => {
      const rootNode = createMockNode();
      const path = [rootNode, 0, 0];
      const a = new ResolvedPos(3, path, 0);
      const b = new ResolvedPos(1, path, 0);

      expect(a.min(b)).toBe(b);
    });
  });

  describe('equals', () => {
    it('given same pos and doc, returns true', () => {
      const rootNode = createMockNode();
      const a = new ResolvedPos(1, [rootNode, 0, 0], 0);
      const b = new ResolvedPos(1, [rootNode, 0, 0], 0);

      expect(a.equals(b)).toBe(true);
    });

    it('given different pos, returns false', () => {
      const rootNode = createMockNode();
      const a = new ResolvedPos(1, [rootNode, 0, 0], 0);
      const b = new ResolvedPos(2, [rootNode, 0, 0], 0);

      expect(a.equals(b)).toBe(false);
    });

    it('given different doc, returns false', () => {
      const a = new ResolvedPos(1, [createMockNode(), 0, 0], 0);
      const b = new ResolvedPos(1, [createMockNode(), 0, 0], 0);

      expect(a.equals(b)).toBe(false);
    });

    it('given null, throws error', () => {
      const a = new ResolvedPos(1, [createMockNode(), 0, 0], 0);

      expect(() => a.equals(null as never)).toThrow(
        'ResolvedPos equals parameter cannot be null'
      );
    });
  });

  describe('resolve', () => {
    it('given pos is negative, throws RangeError', () => {
      const rootNode = createMockNode();

      expect(() => ResolvedPos.resolve(rootNode, -1)).toThrow(
        'Position -1 out of range'
      );
    });

    it('given pos exceeds document size, throws RangeError', () => {
      const rootNode = createMockNode();

      expect(() =>
        ResolvedPos.resolve(rootNode, rootNode.content.size + 1)
      ).toThrow(`Position ${rootNode.content.size + 1} out of range`);
    });

    it('given empty document and pos 0, returns ResolvedPos with depth 0 and parentOffset 0', () => {
      const rootNode = createMockNode();
      const resolvedPos = ResolvedPos.resolve(rootNode, 0);

      expect(resolvedPos?.depth).toBe(0);
      expect(resolvedPos?.parentOffset).toBe(0);
    });

    it('given document with one block child and pos inside block, returns depth 1 and parentOffset 0', () => {
      const childNode = createMockNode();
      const rootNode = new Node(
        createMockNode().type,
        {},
        Fragment.from([childNode])
      );
      const resolvedPos = ResolvedPos.resolve(rootNode, 1);

      expect(resolvedPos?.depth).toBe(1);
      expect(resolvedPos?.parentOffset).toBe(0);
    });
  });

  describe('nodeAfter', () => {
    it('given pos at end of parent, returns null', () => {
      const childNode = createMockNode();
      const rootNode = new Node(
        createMockNode().type,
        {},
        Fragment.from([childNode])
      );
      const resolvedPos = ResolvedPos.resolve(rootNode, 1);

      expect(resolvedPos?.nodeAfter).toBeNull();
    });

    it('given pos inside text node, returns remaining text node', () => {
      const textNode = new Node(
        new NodeType('text', {} as never, { attrs: {}, text: true }),
        {},
        undefined,
        [],
        'hello'
      );
      const rootNode = new Node(
        createMockNode().type,
        {},
        Fragment.from([textNode])
      );
      const resolvedPos = ResolvedPos.resolve(rootNode, 2);

      expect(resolvedPos?.nodeAfter?.text).toBe('llo');
    });

    it('given pos between nodes, returns full next node', () => {
      const firstNode = createMockNode();
      const secondNode = createMockNode();
      const rootNode = new Node(
        createMockNode().type,
        {},
        Fragment.from([firstNode, secondNode])
      );
      const resolvedPos = ResolvedPos.resolve(rootNode, 2);

      expect(resolvedPos?.nodeAfter).toBe(secondNode);
    });
  });

  describe('nodeBefore', () => {
    it('given pos at start of parent, returns null', () => {
      const childNode = createMockNode();
      const rootNode = new Node(
        createMockNode().type,
        {},
        Fragment.from([childNode])
      );
      const resolvedPos = ResolvedPos.resolve(rootNode, 0);

      expect(resolvedPos?.nodeBefore).toBeNull();
    });

    it('given pos inside text node, returns preceding text node', () => {
      const textNode = new Node(
        new NodeType('text', {} as never, { attrs: {}, text: true }),
        {},
        undefined,
        [],
        'hello'
      );
      const rootNode = new Node(
        createMockNode().type,
        {},
        Fragment.from([textNode])
      );
      const resolvedPos = ResolvedPos.resolve(rootNode, 2);

      expect(resolvedPos?.nodeBefore?.text).toBe('he');
    });
  });
});
