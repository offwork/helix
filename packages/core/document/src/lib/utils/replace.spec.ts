import { Node } from '../entities/Node';
import { TextNode } from '../entities/TextNode';
import { ReplaceError } from '../errors/ReplaceError';
import { ResolvedPos } from '../value-objects/ResolvedPos';
import { NodeType } from '../value-objects/NodeType';
import { ContentMatch } from '../value-objects/ContentMatch';
import { Slice } from '../value-objects/Slice';
import {
  removeRange,
  insertInto,
  addNode,
  checkJoin,
  joinable,
  close,
  addRange,
  replaceTwoWay,
  replaceThreeWay,
  prepareSliceForReplace,
  replaceOuter,
  replace,
} from './replace';
import {
  boldMarkType,
  createMark,
  createSelfRefNodeType,
  defaultMockSchema,
  defaultNodeSpec,
  headingType,
  paragraphType,
  textType,
} from '../../testing';
import { empty, from } from '../entities/FragmentFactory';

describe('removeRange', () => {
  describe('given flat range at child boundary', () => {
    it('removes the range and returns remaining fragment', () => {
      const node1 = new Node(paragraphType, {});
      const node2 = new Node(paragraphType, {});
      const node3 = new Node(paragraphType, {});
      const content = from([node1, node2, node3]);

      const result = removeRange(content, 2, 4);

      expect(result.childCount).toBe(2);
      expect(result.child(0)).toBe(node1);
      expect(result.child(1)).toBe(node3);
    });
  });

  describe('given range inside a text node', () => {
    it('removes the text range and returns remaining fragment', () => {
      const text = new TextNode(textType, {}, 'helloworld');
      const content = from([text]);

      const result = removeRange(content, 2, 7);

      expect((result.child(0) as TextNode).text).toBe('herld');
    });
  });

  describe('given non-flat range crossing child boundaries', () => {
    it('throws "Removing non-flat range"', () => {
      const inner1 = new Node(
        paragraphType,
        {},
        from([new Node(paragraphType, {})]),
        []
      );
      const inner2 = new Node(
        paragraphType,
        {},
        from([new Node(paragraphType, {})]),
        []
      );
      const content = from([inner1, inner2]);

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
        from([child1, child2]),
        []
      );
      const content = from([parent]);

      const result = removeRange(content, 1, 3);

      expect(result.child(0).content.childCount).toBe(1);
      expect(result.child(0).content.child(0)).toBe(child2);
    });
  });

  describe('given null child at index', () => {
    it('throws "Removing non-flat range"', () => {
      const content = empty();

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
      const content = from([node1, node2]);

      const result = insertInto(content, 2, from([inserted]));

      expect(result).not.toBeNull();
      expect(result?.childCount).toBe(3);
      expect(result?.child(1)).toBe(inserted);
    });
  });

  describe('given dist inside a text node', () => {
    it('inserts fragment and returns merged text', () => {
      const text = new TextNode(textType, {}, 'helloworld');
      const content = from([text]);
      const insert = from([new TextNode(textType, {}, ' ')]);

      const result = insertInto(content, 5, insert);

      expect(result).not.toBeNull();
      expect((result?.child(0) as TextNode).text).toBe('hello world');
    });
  });

  describe('given parent that rejects the insert', () => {
    it('returns null', () => {
      const node1 = new Node(paragraphType, {});
      const content = from([node1]);
      const insert = from([new Node(paragraphType, {})]);
      const rejectingParent = { canReplace: () => false } as unknown as Node;

      const result = insertInto(content, 0, insert, rejectingParent);

      expect(result).toBeNull();
    });
  });

  describe('given dist inside a non-text child', () => {
    it('inserts recursively and returns updated fragment', () => {
      const childType = createSelfRefNodeType('child');
      const child = new Node(childType, {});
      const parent = new Node(childType, {}, from([child]), []);
      const content = from([parent]);
      const inserted = new Node(childType, {});

      const result = insertInto(content, 1, from([inserted]));

      expect(result).not.toBeNull();
      expect(result?.child(0).content.childCount).toBe(2);
    });
  });

  describe('given null child at index', () => {
    it('returns null', () => {
      const content = empty();

      const result = insertInto(
        content,
        0,
        from([new Node(paragraphType, {})])
      );

      expect(result).toBeNull();
    });
  });

  describe('addNode', () => {
    it('given non-text node, pushes to target', () => {
      const target: Node[] = [];
      const node = new Node(paragraphType, {});

      addNode(node, target);

      expect(target).toHaveLength(1);
    });

    it('given text node with same markup as last, merges into last', () => {
      const text1 = new TextNode(textType, {}, 'hello');
      const text2 = new TextNode(textType, {}, ' world');
      const target: Node[] = [text1];

      addNode(text2, target);

      expect(target).toHaveLength(1);
      expect((target[0] as TextNode).text).toBe('hello world');
    });

    it('given text node with different markup, pushes to target', () => {
      const mark = createMark(boldMarkType, {});
      const text1 = new TextNode(textType, {}, 'hello');
      const text2 = new TextNode(textType, {}, ' world', [mark]);
      const target: Node[] = [text1];

      addNode(text2, target);

      expect(target).toHaveLength(2);
    });
  });
  describe('checkJoin', () => {
    it('given compatible nodes, does not throw', () => {
      const node1 = new Node(paragraphType, {});
      const node2 = new Node(paragraphType, {});

      expect(() => checkJoin(node1, node2)).not.toThrow();
    });

    it('given incompatible nodes, throws ReplaceError', () => {
      const node1 = new Node(paragraphType, {});
      const node2 = new Node(headingType, {});

      expect(() => checkJoin(node1, node2)).toThrow(ReplaceError);
    });
  });

  describe('joinable', () => {
    it('given compatible nodes at depth, returns node', () => {
      const child = new Node(paragraphType, {});
      const root = new Node(paragraphType, {}, from([child]), []);
      const $before = ResolvedPos.resolve(root, 1);
      const $after = ResolvedPos.resolve(root, 1);

      expect(joinable($before, $after, 0)).toBe(root);
    });

    it('given incompatible nodes at depth, throws ReplaceError', () => {
      const child1 = new Node(paragraphType, {});
      const child2 = new Node(headingType, {});
      const root1 = new Node(paragraphType, {}, from([child1]), []);
      const root2 = new Node(headingType, {}, from([child2]), []);
      const $before = ResolvedPos.resolve(root1, 0);
      const $after = ResolvedPos.resolve(root2, 0);

      expect(() => joinable($before, $after, 0)).toThrow(ReplaceError);
    });
  });

  describe('close', () => {
    it('given valid content, returns node copy with content', () => {
      const nodeType = new NodeType('doc', defaultMockSchema, defaultNodeSpec);
      nodeType.contentMatch = ContentMatch.parse('paragraph', {
        paragraph: paragraphType,
      });

      const child = new Node(paragraphType, {});
      const content = from([child]);
      const node = new Node(nodeType, {}, empty(), []);

      const result = close(node, content);

      expect(result.content).toBe(content);
    });

    it('given invalid content, throws RangeError', () => {
      const nodeType = new NodeType('doc', defaultMockSchema, defaultNodeSpec);
      nodeType.contentMatch = ContentMatch.parse('paragraph', {
        paragraph: paragraphType,
      });

      const node = new Node(nodeType, {}, empty(), []);

      expect(() =>
        close(node, from([new Node(headingType, {})]))
      ).toThrow(RangeError);
    });
  });

  describe('addRange', () => {
    it('given null start and null end, does nothing', () => {
      const target: Node[] = [];

      addRange(null, null, 0, target);

      expect(target).toHaveLength(0);
    });

    it('given start and end at same depth, adds nodes between', () => {
      const child1 = new Node(paragraphType, {});
      const child2 = new Node(paragraphType, {});
      const root = new Node(
        paragraphType,
        {},
        from([child1, child2]),
        []
      );
      const $start = ResolvedPos.resolve(root, 0);
      const $end = ResolvedPos.resolve(root, root.content.size);
      const target: Node[] = [];

      addRange($start, $end, 0, target);

      expect(target).toHaveLength(2);
    });
  });

  describe('replaceTwoWay', () => {
    it('given from and to in middle, returns surrounding nodes', () => {
      const child1 = new Node(paragraphType, {});
      const child2 = new Node(paragraphType, {});
      const child3 = new Node(paragraphType, {});
      const root = new Node(
        paragraphType,
        {},
        from([child1, child2, child3]),
        []
      );
      const $from = ResolvedPos.resolve(root, child1.nodeSize);
      const $to = ResolvedPos.resolve(root, child1.nodeSize + child2.nodeSize);

      const result = replaceTwoWay($from, $to, 0);

      expect(result.childCount).toBe(2);
    });
  });

  describe('replaceThreeWay', () => {
    it('given flat range with slice content, returns merged fragment', () => {
      const child1 = new Node(paragraphType, {});
      const child2 = new Node(paragraphType, {});
      const child3 = new Node(paragraphType, {});
      const root = new Node(
        paragraphType,
        {},
        from([child1, child2, child3]),
        []
      );
      const $from = ResolvedPos.resolve(root, 0);
      const $to = ResolvedPos.resolve(root, root.content.size);
      const $start = ResolvedPos.resolve(root, 0);
      const $end = ResolvedPos.resolve(root, root.content.size);

      const result = replaceThreeWay($from, $start, $end, $to, 0);

      expect(result.childCount).toBe(3);
    });
  });

  describe('prepareSliceForReplace', () => {
    it('given slice with openStart 0, returns start and end resolved positions', () => {
      const child = new Node(paragraphType, {});
      const root = new Node(paragraphType, {}, from([child]), []);
      const $along = ResolvedPos.resolve(root, 0);
      const slice = new Slice(from([child]), 0, 0);

      const result = prepareSliceForReplace(slice, $along);

      expect(result.start).toBeInstanceOf(ResolvedPos);
      expect(result.end).toBeInstanceOf(ResolvedPos);
    });
  });

  describe('replaceOuter', () => {
    it('given empty slice, returns node with replaceTwoWay content', () => {
      const child1 = new Node(paragraphType, {});
      const child2 = new Node(paragraphType, {});
      const nodeType = new NodeType('doc', defaultMockSchema, defaultNodeSpec);
      nodeType.contentMatch = ContentMatch.parse('paragraph*', {
        paragraph: paragraphType,
      });
      const root = new Node(nodeType, {}, from([child1, child2]), []);
      const $from = ResolvedPos.resolve(root, child1.nodeSize);
      const $to = ResolvedPos.resolve(root, child1.nodeSize);

      const result = replaceOuter($from, $to, Slice.empty, 0);

      expect(result.childCount).toBe(2);
    });

    it('given flat slice, returns node with slice content inserted', () => {
      const child1 = new Node(paragraphType, {});
      const child2 = new Node(paragraphType, {});
      const nodeType = new NodeType('doc', defaultMockSchema, defaultNodeSpec);
      nodeType.contentMatch = ContentMatch.parse('paragraph*', {
        paragraph: paragraphType,
      });
      const root = new Node(nodeType, {}, from([child1, child2]), []);
      const $from = ResolvedPos.resolve(root, 0);
      const $to = ResolvedPos.resolve(root, child1.nodeSize);
      const inserted = new Node(paragraphType, {});
      const slice = new Slice(from([inserted]), 0, 0);

      const result = replaceOuter($from, $to, slice, 0);

      expect(result.childCount).toBe(2);
    });

    it('given slice with openStart, uses replaceThreeWay', () => {
      const innerType = createSelfRefNodeType('inner');
      const inner1 = new Node(innerType, {});
      const inner2 = new Node(innerType, {});
      const outer = new Node(
        innerType,
        {},
        from([inner1, inner2]),
        []
      );
      const root = new Node(innerType, {}, from([outer]), []);
      const $from = ResolvedPos.resolve(root, 1);
      const $to = ResolvedPos.resolve(root, root.content.size - 1);
      const slice = new Slice(from([new Node(innerType, {})]), 1, 1);

      const result = replaceOuter($from, $to, slice, 0);

      expect(result).toBeInstanceOf(Node);
    });
  });

  describe('replace', () => {
    it('given valid slice, returns replaced node', () => {
      const nodeType = new NodeType('doc', defaultMockSchema, defaultNodeSpec);
      nodeType.contentMatch = ContentMatch.parse('paragraph*', {
        paragraph: paragraphType,
      });
      const child = new Node(paragraphType, {});
      const root = new Node(nodeType, {}, from([child]), []);
      const $from = ResolvedPos.resolve(root, 0);
      const $to = ResolvedPos.resolve(root, child.nodeSize);

      const result = replace($from, $to, Slice.empty);

      expect(result).toBeInstanceOf(Node);
    });

    it('given slice openStart deeper than from depth, throws ReplaceError', () => {
      const nodeType = new NodeType('doc', defaultMockSchema, defaultNodeSpec);
      nodeType.contentMatch = ContentMatch.parse('paragraph*', {
        paragraph: paragraphType,
      });
      const child = new Node(paragraphType, {});
      const root = new Node(nodeType, {}, from([child]), []);
      const $from = ResolvedPos.resolve(root, 0);
      const $to = ResolvedPos.resolve(root, child.nodeSize);
      const slice = new Slice(from([child]), 2, 2);

      expect(() => replace($from, $to, slice)).toThrow(ReplaceError);
    });

    it('given inconsistent open depths, throws ReplaceError', () => {
      const nodeType = new NodeType('doc', defaultMockSchema, defaultNodeSpec);
      nodeType.contentMatch = ContentMatch.parse('paragraph*', {
        paragraph: paragraphType,
      });
      const child = new Node(paragraphType, {});
      const root = new Node(nodeType, {}, from([child]), []);
      const $from = ResolvedPos.resolve(root, 0);
      const $to = ResolvedPos.resolve(root, child.nodeSize);
      const slice = new Slice(from([child]), 0, 1);

      expect(() => replace($from, $to, slice)).toThrow(ReplaceError);
    });
  });
});
