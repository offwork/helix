import { Node } from './Node';
import { NodeType } from '../value-objects/NodeType';
import { ContentMatch } from '../value-objects/ContentMatch';
import { ResolvedPos } from '../value-objects/ResolvedPos';
import { TextNode } from './TextNode';
import { Slice } from '../value-objects/Slice';
import { ReplaceError } from '../errors/ReplaceError';
import { empty, from } from './FragmentFactory';
import { Schema } from '../services/Schema';
import { INode } from '../contracts';
import {
  defaultMockSchema,
  defaultNodeSpec,
  paragraphType,
  headingType,
  spanType,
  mentionType,
  boldMarkType,
  italicMarkType,
  createMark,
  mockChildNode,
  mockContent,
  textType,
  createNodeSpec,
  createMockNodeType,
  createSchemaSpec,
  createMarkSpec,
} from '../../testing';
import { Fragment } from './Fragment';

describe('Node', () => {
  describe('constructor', () => {
    it('given type null, throws error', () => {
      expect(() => new Node(null as never, {})).toThrow(
        'Node type cannot be null'
      );
    });

    it('given type undefined, throws error', () => {
      expect(() => new Node(undefined as never, {})).toThrow(
        'Node type cannot be undefined'
      );
    });

    it('given attrs null, throws error', () => {
      expect(() => new Node(paragraphType, null as never)).toThrow(
        'Node attrs cannot be null'
      );
    });

    it('given attrs undefined, throws error', () => {
      expect(() => new Node(paragraphType, undefined as never)).toThrow(
        'Node attrs cannot be undefined'
      );
    });

    it('given null marks, throws error', () => {
      const mockContent = from([mockChildNode]);

      expect(
        () => new Node(paragraphType, {}, mockContent, null as never)
      ).toThrow('Node marks cannot be null');
    });
  });

  describe('childCount', () => {
    it('returns content.childCount', () => {
      const mockContent = from([mockChildNode]);

      const node = new Node(paragraphType, {}, mockContent, []);

      expect(node.childCount).toBe(1);
    });
  });

  describe('nodeSize', () => {
    it('given leaf node, returns 1', () => {
      const nodeType = createMockNodeType(
        'image',
        defaultMockSchema,
        createNodeSpec()
      );
      nodeType.contentMatch = ContentMatch.empty;
      const mockContent = from([mockChildNode]);

      const node = new Node(nodeType, {}, mockContent, []);

      expect(node.nodeSize).toBe(1);
    });

    it('given container node, returns 2 + content.size', () => {
      const mockContent = from([mockChildNode]);

      const node = new Node(paragraphType, {}, mockContent, []);

      expect(node.nodeSize).toBe(2 + mockContent.size);
    });
  });

  describe('equals', () => {
    it('given same type/attrs/content/marks, returns true', () => {
      const node1 = new Node(
        paragraphType,
        { level: 1, visible: true },
        mockContent,
        []
      );
      const node2 = new Node(
        paragraphType,
        { level: 1, visible: true },
        mockContent,
        []
      );

      expect(node1.equals(node2)).toBe(true);
    });
  });

  describe('copy', () => {
    it('given different content, returns new node with same type/attrs/marks/', () => {
      const node = new Node(
        paragraphType,
        { level: 1, visible: true },
        mockContent,
        []
      );

      const newChildNode = new Node(paragraphType, {});
      const newContent = from([newChildNode]);

      const copy = node.copy(newContent);

      expect(copy).not.toBe(node);
      expect(copy.type).toBe(node.type);
      expect(copy.attrs).toEqual(node.attrs);
      expect(copy.marks).toEqual(node.marks);
    });
  });

  describe('cut', () => {
    it('given from 0 and to content size, returns this', () => {
      const node = new Node(
        paragraphType,
        { level: 1, visible: true },
        mockContent,
        []
      );

      const cut = node.cut(0, mockContent.size);

      expect(cut).toBe(node);
    });

    it('given partial range, returns new node with cut content', () => {
      const child1 = new Node(paragraphType, {});
      const child2 = new Node(paragraphType, {});
      const content = from([child1, child2]);
      const node = new Node(paragraphType, {}, content, []);

      const result = node.cut(0, 2);

      expect(result).not.toBe(node);
      expect(result.content.childCount).toBe(1);
    });
  });

  describe('child', () => {
    it('given valid index, returns child node', () => {
      const child1 = new Node(paragraphType, {});
      const child2 = new Node(paragraphType, {});
      const content = from([child1, child2]);
      const node = new Node(paragraphType, {}, content, []);

      expect(node.child(0)).toBe(child1);
    });
  });

  describe('maybeChild', () => {
    it('given valid index, returns child node', () => {
      const child1 = new Node(paragraphType, {});
      const child2 = new Node(paragraphType, {});
      const content = from([child1, child2]);
      const node = new Node(paragraphType, {}, content, []);

      expect(node.maybeChild(0)).toBe(child1);
    });

    it('given invalid index, returns null', () => {
      const child1 = new Node(paragraphType, {});
      const child2 = new Node(paragraphType, {});
      const content = from([child1, child2]);
      const node = new Node(paragraphType, {}, content, []);

      expect(node.maybeChild(2)).toBeNull();
    });
  });

  describe('firstChild', () => {
    it('given non-empty content, returns first child', () => {
      const child1 = new Node(paragraphType, {});
      const child2 = new Node(paragraphType, {});
      const content = from([child1, child2]);
      const node = new Node(paragraphType, {}, content, []);

      expect(node.firstChild).toBe(child1);
    });
  });

  describe('lastChild', () => {
    it('given non-empty content, returns last child', () => {
      const child1 = new Node(paragraphType, {});
      const child2 = new Node(paragraphType, {});
      const content = from([child1, child2]);
      const node = new Node(paragraphType, {}, content, []);

      expect(node.lastChild).toBe(child2);
    });
  });

  describe('mark', () => {
    it('given same maerks reference, returns same reference', () => {
      const marks = [createMark(boldMarkType, { color: 'purple' })];
      const node = new Node(paragraphType, {}, mockContent, marks);

      const newNode = node.mark(marks);

      expect(newNode).toBe(node);
    });

    it('given different marks, returns new node updating marks', () => {
      const marks = [createMark(boldMarkType, { color: 'purple' })];
      const node = new Node(paragraphType, {}, mockContent, marks);

      const newMarks = [createMark(italicMarkType, { color: 'red' })];
      const newNode = node.mark(newMarks);

      expect(newNode).not.toBe(node);
    });
  });

  describe('hasMarkup', () => {
    it('given matching type/attrs/marks, returns true', () => {
      const marks = [createMark(boldMarkType, { color: 'purple' })];
      const node = new Node(paragraphType, { level: 1 }, mockContent, marks);

      expect(node.hasMarkup(paragraphType, { level: 1 }, marks)).toBe(true);
    });

    it('given non-matching type, returns false', () => {
      const marks = [createMark(boldMarkType, { color: 'purple' })];
      const node = new Node(paragraphType, { level: 1 }, mockContent, marks);

      expect(node.hasMarkup(headingType, { level: 1 }, marks)).toBe(false);
    });
  });

  describe('forEach', () => {
    it('given non-empty content, calls callback with each child node/offset/index', () => {
      const child1 = new Node(paragraphType, {});
      const child2 = new Node(paragraphType, {});
      const content = from([child1, child2]);
      const node = new Node(paragraphType, {}, content, []);

      const callback = jest.fn();

      node.forEach(callback);

      expect(callback).toHaveBeenCalledWith(child1, 0, 0);
      expect(callback).toHaveBeenCalledWith(child2, child1.nodeSize, 1);
    });
  });

  describe('contentMatchAt', () => {
    it('given valid index, returns ContentMatch for content at index', () => {
      const nodeType = new NodeType(
        'paragraph',
        defaultMockSchema,
        defaultNodeSpec
      );
      nodeType.contentMatch = ContentMatch.parse('paragraph', {
        paragraph: nodeType,
      });

      const child1 = new Node(nodeType, {});
      const child2 = new Node(nodeType, {});
      const content = from([child1, child2]);
      const node = new Node(nodeType, {}, content, []);

      const match = node.contentMatchAt(1);

      expect(match).toBeInstanceOf(ContentMatch);
    });

    it('given index that fails to find content match, throws error', () => {
      const child1 = new Node(paragraphType, {});
      const content = from([child1]);
      const node = new Node(paragraphType, {}, content, []);

      expect(() => node.contentMatchAt(1)).toThrow(
        'Called contentMatchAt on a node with invalid content'
      );
    });
  });

  describe('resolveNoCache', () => {
    it('given valid pos, returns ResolvedPos', () => {
      const child1 = new Node(paragraphType, {});
      const child2 = new Node(paragraphType, {});
      const content = from([child1, child2]);
      const node = new Node(paragraphType, {}, content, []);

      const resolvedPos = node.resolveNoCache(1);

      expect(resolvedPos).toBeInstanceOf(ResolvedPos);
    });
  });

  describe('nodeAt', () => {
    it('given pos beyond content, returns null', () => {
      const child1 = new Node(paragraphType, {});
      const content = from([child1]);
      const node = new Node(paragraphType, {}, content, []);

      expect(node.nodeAt(node.content.size)).toBeNull();
    });

    it('given valid pos, returns node at position', () => {
      const child1 = new Node(paragraphType, {});
      const child2 = new Node(paragraphType, {});
      const content = from([child1, child2]);
      const node = new Node(paragraphType, {}, content, []);

      expect(node.nodeAt(2)).toBe(child2);
    });
  });

  describe('childAfter', () => {
    it('given pos 0, returns first child with index 0 and offset 0', () => {
      const child = new Node(paragraphType, {});
      const node = new Node(paragraphType, {}, from([child]), []);

      const result = node.childAfter(0);

      expect(result).toEqual({ node: child, index: 0, offset: 0 });
    });

    it('given pos at end of content, returns null node with index of last child and offset of last child end', () => {
      const child = new Node(paragraphType, {});
      const node = new Node(paragraphType, {}, from([child]), []);

      const result = node.childAfter(node.content.size);

      expect(result).toEqual({ node: null, index: 1, offset: child.nodeSize });
    });
  });

  describe('childBefore', () => {
    it('given pos 0, returns null node with index 0 and offset 0', () => {
      const child = new Node(paragraphType, {});
      const node = new Node(paragraphType, {}, from([child]), []);

      const result = node.childBefore(0);

      expect(result).toEqual({ node: null, index: 0, offset: 0 });
    });

    it('given pos at boundary, returns previous child with index of previous child and offset of previous child start', () => {
      const child1 = new Node(paragraphType, {});
      const child2 = new Node(paragraphType, {});
      const node = new Node(paragraphType, {}, from([child1, child2]), []);

      const result = node.childBefore(child1.nodeSize);

      expect(result).toEqual({ node: child1, index: 0, offset: 0 });
    });
  });

  describe('type delegates getter', () => {
    it('given block node, isBlock returns true', () => {
      const node = new Node(paragraphType, {}, mockContent, []);

      expect(node.isBlock).toBe(true);
    });

    it('given inline node, isInline returns true', () => {
      const node = new Node(spanType, {}, mockContent, []);

      expect(node.isInline).toBe(true);
    });

    it('given text node, isText returns true', () => {
      const node = new Node(textType, {}, mockContent, []);

      expect(node.isText).toBe(true);
    });

    it('given leaf node, isLeaf returns true', () => {
      const nodeType = createMockNodeType(
        'image',
        defaultMockSchema,
        createNodeSpec()
      );
      nodeType.contentMatch = ContentMatch.empty;
      const node = new Node(nodeType, {}, mockContent, []);

      expect(node.isLeaf).toBe(true);
    });

    it('given atom node, isAtom returns true', () => {
      const node = new Node(mentionType, {}, mockContent, []);

      expect(node.isAtom).toBe(true);
    });

    it('given textblock node, isTextblock returns true', () => {
      const nodeType = new NodeType('p', defaultMockSchema, defaultNodeSpec);
      nodeType.inlineContent = true;
      const node = new Node(nodeType, {}, mockContent, []);

      expect(node.isTextblock).toBe(true);
    });

    it('given node with inlineContent set, inlineContent returns value', () => {
      const nodeType = new NodeType('p', defaultMockSchema, defaultNodeSpec);
      nodeType.inlineContent = true;
      const node = new Node(nodeType, {}, mockContent, []);

      expect(node.inlineContent).toBe(true);
    });
  });

  describe('toString', () => {
    // Node.spec.ts
    it('given a node, returns string representation', () => {
      const node = new Node(paragraphType, {});

      expect(node.toString()).toBe('paragraph');
    });
  });

  describe('canReplace', () => {
    it('given valid replacement matching content, returns true', () => {
      const nodeType = new NodeType('doc', defaultMockSchema, defaultNodeSpec);
      nodeType.contentMatch = ContentMatch.parse('paragraph', {
        paragraph: paragraphType,
      });

      const child = new Node(paragraphType, {});
      const node = new Node(nodeType, {}, from([child]), []);
      const replacement = from([new Node(paragraphType, {})]);

      expect(node.canReplace(0, 1, replacement)).toBe(true);
    });

    it('given replacement that breaks content model, returns false', () => {
      const nodeType = new NodeType('doc', defaultMockSchema, defaultNodeSpec);
      nodeType.contentMatch = ContentMatch.parse('paragraph', {
        paragraph: paragraphType,
      });

      const child = new Node(paragraphType, {});
      const node = new Node(nodeType, {}, from([child]), []);
      const replacement = from([new Node(headingType, {})]);

      expect(node.canReplace(0, 1, replacement)).toBe(false);
    });

    it('given empty replacement and valid range, returns true', () => {
      const nodeType = new NodeType('doc', defaultMockSchema, defaultNodeSpec);
      nodeType.contentMatch = ContentMatch.parse('paragraph*', {
        paragraph: paragraphType,
      });

      const child = new Node(paragraphType, {});
      const node = new Node(nodeType, {}, from([child]), []);

      expect(node.canReplace(0, 1)).toBe(true);
    });

    it('given replacement with disallowed marks, returns false', () => {
      const nodeType = new NodeType('doc', defaultMockSchema, defaultNodeSpec);
      nodeType.contentMatch = ContentMatch.parse('paragraph', {
        paragraph: paragraphType,
      });
      nodeType.markSet = [];

      const child = new Node(paragraphType, {});
      const node = new Node(nodeType, {}, from([child]), []);
      const markedNode = new Node(paragraphType, {}, undefined, [
        createMark(boldMarkType, {}),
      ]);
      const replacement = from([markedNode]);

      expect(node.canReplace(0, 1, replacement)).toBe(false);
    });
  });

  describe('nodesBetween', () => {
    it('given range covering all children, visits all nodes with startPos', () => {
      const child1 = new Node(paragraphType, {});
      const child2 = new Node(paragraphType, {});
      const content = from([child1, child2]);
      const node = new Node(paragraphType, {}, content, []);

      const visited: { node: Node; pos: number }[] = [];
      node.nodesBetween(0, content.size, (n, pos) => {
        visited.push({ node: n as Node, pos });
      });

      expect(visited[0]).toEqual({ node: child1, pos: 0 });
    });

    it('given startPos provided, offsets visited node positions', () => {
      const child1 = new Node(paragraphType, {});
      const content = from([child1]);
      const node = new Node(paragraphType, {}, content, []);

      const visited: number[] = [];
      node.nodesBetween(
        0,
        content.size,
        (n, pos) => {
          visited.push(pos);
        },
        10
      );

      expect(visited[0]).toBe(10);
    });
  });

  describe('rangeHasMark', () => {
    it('given to equals from, returns false', () => {
      const node = new Node(paragraphType, {}, empty(), []);

      expect(node.rangeHasMark(1, 1, boldMarkType)).toBe(false);
    });

    it('given mark present in range, returns true', () => {
      const mark = createMark(boldMarkType, {});
      const text = new TextNode(textType, {}, 'hello', [mark]);
      const node = new Node(paragraphType, {}, from([text]), []);

      expect(node.rangeHasMark(0, text.nodeSize, boldMarkType)).toBe(true);
    });

    it('given mark not present in range, returns false', () => {
      const text = new TextNode(textType, {}, 'hello', []);
      const node = new Node(paragraphType, {}, from([text]), []);

      expect(node.rangeHasMark(0, text.nodeSize, boldMarkType)).toBe(false);
    });
  });

  describe('canReplaceWith', () => {
    it('given type matching content, returns true', () => {
      const nodeType = new NodeType('doc', defaultMockSchema, defaultNodeSpec);
      nodeType.contentMatch = ContentMatch.parse('paragraph', {
        paragraph: paragraphType,
      });

      const child = new Node(paragraphType, {});
      const node = new Node(nodeType, {}, from([child]), []);

      expect(node.canReplaceWith(0, 1, paragraphType)).toBe(true);
    });

    it('given type not matching content, returns false', () => {
      const nodeType = new NodeType('doc', defaultMockSchema, defaultNodeSpec);
      nodeType.contentMatch = ContentMatch.parse('paragraph', {
        paragraph: paragraphType,
      });

      const child = new Node(paragraphType, {});
      const node = new Node(nodeType, {}, from([child]), []);

      expect(node.canReplaceWith(0, 1, headingType)).toBe(false);
    });

    it('given marks not allowed by node type, returns false', () => {
      const nodeType = new NodeType('doc', defaultMockSchema, defaultNodeSpec);
      nodeType.contentMatch = ContentMatch.parse('paragraph', {
        paragraph: paragraphType,
      });
      nodeType.markSet = [];

      const child = new Node(paragraphType, {});
      const node = new Node(nodeType, {}, from([child]), []);

      expect(
        node.canReplaceWith(0, 1, paragraphType, [createMark(boldMarkType, {})])
      ).toBe(false);
    });
  });

  describe('canAppend', () => {
    it('given other with compatible non-empty content, returns true', () => {
      const nodeType = new NodeType('doc', defaultMockSchema, defaultNodeSpec);
      nodeType.contentMatch = ContentMatch.parse('paragraph*', {
        paragraph: paragraphType,
      });

      const child = new Node(paragraphType, {});
      const node = new Node(nodeType, {}, from([child]), []);
      const other = new Node(
        nodeType,
        {},
        from([new Node(paragraphType, {})]),
        []
      );

      expect(node.canAppend(other)).toBe(true);
    });

    it('given other content not allowed by content model, returns false', () => {
      const nodeType = new NodeType('doc', defaultMockSchema, defaultNodeSpec);
      nodeType.contentMatch = ContentMatch.parse('paragraph*', {
        paragraph: paragraphType,
      });

      const node = new Node(nodeType, {}, empty(), []);
      const other = new Node(nodeType, {}, empty(), []);

      expect(node.canAppend(other)).toBe(true);
    });
  });

  describe('check', () => {
    it('given valid node, does not throw', () => {
      const nodeType = new NodeType('doc', defaultMockSchema, defaultNodeSpec);
      nodeType.contentMatch = ContentMatch.empty;

      const node = new Node(nodeType, {}, empty(), []);

      expect(() => node.check()).not.toThrow();
    });

    it('given node with invalid content, throws RangeError', () => {
      const nodeType = new NodeType('doc', defaultMockSchema, defaultNodeSpec);
      nodeType.contentMatch = ContentMatch.parse('paragraph', {
        paragraph: paragraphType,
      });

      const node = new Node(
        nodeType,
        {},
        from([new Node(headingType, {})]),
        []
      );

      expect(() => node.check()).toThrow(RangeError);
    });

    it('given node with invalid mark set order, throws RangeError', () => {
      const mark1 = createMark(boldMarkType, {});
      const mark2 = createMark(italicMarkType, {});
      boldMarkType.rank = 2;
      italicMarkType.rank = 1;

      const node = new Node(paragraphType, {}, empty(), [mark1, mark2]);

      expect(() => node.check()).toThrow(RangeError);
    });
  });

  describe('resolve', () => {
    it('given valid pos, returns ResolvedPos', () => {
      const child = new Node(paragraphType, {});
      const node = new Node(paragraphType, {}, from([child]), []);

      expect(node.resolve(1)).toBeInstanceOf(ResolvedPos);
    });
  });

  describe('replace', () => {
    it('given valid slice, returns new node with replaced content', () => {
      const nodeType = new NodeType('doc', defaultMockSchema, defaultNodeSpec);
      nodeType.contentMatch = ContentMatch.parse('paragraph*', {
        paragraph: paragraphType,
      });
      const child1 = new Node(paragraphType, {});
      const child2 = new Node(paragraphType, {});
      const root = new Node(nodeType, {}, from([child1, child2]), []);
      const inserted = new Node(paragraphType, {});
      const slice = new Slice(from([inserted]), 0, 0);

      const result = root.replace(0, child1.nodeSize, slice);

      expect(result.childCount).toBe(2);
    });

    it('given invalid slice, throws ReplaceError', () => {
      const nodeType = new NodeType('doc', defaultMockSchema, defaultNodeSpec);
      nodeType.contentMatch = ContentMatch.parse('paragraph*', {
        paragraph: paragraphType,
      });
      const child = new Node(paragraphType, {});
      const root = new Node(nodeType, {}, from([child]), []);
      const slice = new Slice(from([child]), 2, 2);

      expect(() => root.replace(0, child.nodeSize, slice)).toThrow(
        ReplaceError
      );
    });
  });

  describe('slice', () => {
    it('given from equals to, returns Slice.empty', () => {
      const child = new Node(paragraphType, {});
      const nodeType = new NodeType('doc', defaultMockSchema, defaultNodeSpec);
      nodeType.contentMatch = ContentMatch.parse('paragraph*', {
        paragraph: paragraphType,
      });
      const root = new Node(nodeType, {}, from([child]), []);

      expect(root.slice(0, 0)).toBe(Slice.empty);
    });

    it('given valid range, returns slice with correct content', () => {
      const child1 = new Node(paragraphType, {});
      const child2 = new Node(paragraphType, {});
      const nodeType = new NodeType('doc', defaultMockSchema, defaultNodeSpec);
      nodeType.contentMatch = ContentMatch.parse('paragraph*', {
        paragraph: paragraphType,
      });
      const root = new Node(nodeType, {}, from([child1, child2]), []);

      const result = root.slice(0, child1.nodeSize);

      expect(result).toBeInstanceOf(Slice);
      expect(result.content.childCount).toBe(1);
    });

    it('given includeParents true, returns slice with depth 0', () => {
      const child = new Node(paragraphType, {});
      const nodeType = new NodeType('doc', defaultMockSchema, defaultNodeSpec);
      nodeType.contentMatch = ContentMatch.parse('paragraph*', {
        paragraph: paragraphType,
      });
      const root = new Node(nodeType, {}, from([child]), []);

      const result = root.slice(0, child.nodeSize, true);

      expect(result.openStart).toBe(0);
      expect(result.openEnd).toBe(0);
    });
  });

  describe('toJSON', () => {
    it('given node with no attrs and no content, returns object with only type name', () => {
      const node = new Node(paragraphType, {});

      expect(node.toJSON()).toEqual({ type: 'paragraph' });
    });

    it('given node with attrs, returns object with type name and attrs', () => {
      const node = new Node(paragraphType, { level: 1, visible: true });

      expect(node.toJSON()).toEqual({
        type: 'paragraph',
        attrs: { level: 1, visible: true },
      });
    });

    it('given node with marks, returns object with marks array', () => {
      const marks = [createMark(boldMarkType, { color: 'purple' })];
      const node = new Node(paragraphType, {}, empty(), marks);

      expect(node.toJSON()).toEqual({
        type: 'paragraph',
        marks: [{ type: 'bold', attrs: { color: 'purple' } }],
      });
    });

    it('given node with content, returns object with content array', () => {
      const child = new Node(paragraphType, {});
      const node = new Node(paragraphType, {}, from([child]), []);

      expect(node.toJSON()).toEqual({
        type: 'paragraph',
        content: [{ type: 'paragraph' }],
      });
    });
  });

  describe('fromJSON', () => {
    it('given null json, throws RangeError', () => {
      expect(() => Node.fromJSON(defaultMockSchema, null as never)).toThrow(
        RangeError
      );
    });

    it('given simple node json, returns Node instance', () => {
      const schema = new Schema({
        nodes: createSchemaSpec(),
        marks: createMarkSpec(),
      });

      expect(Node.fromJSON(schema, { type: 'paragraph' })).toBeInstanceOf(Node);
    });

    it('given node json with marks, returns Node with marks', () => {
      const schema = new Schema({
        nodes: createSchemaSpec(),
        marks: createMarkSpec(),
      });

      const json = {
        type: schema.node('paragraph').type.name,
        marks: [schema.mark('strong').toJSON()],
      };

      expect(Node.fromJSON(schema, json).marks.length).toBe(1);
    });

    it('given text node json, returns TextNode', () => {
      const schema = new Schema({
        nodes: createSchemaSpec(),
        marks: createMarkSpec(),
      });

      const json = { type: 'text', text: 'hello' };

      expect(Node.fromJSON(schema, json)).toBeInstanceOf(TextNode);
    });
  });

  describe('descendants', () => {
    describe('given a node with children', () => {
      it('calls callback for each child with correct pos and parent', () => {
        const inner1 = new TextNode(textType, {}, 'Hello');
        const inner2 = new TextNode(textType, {}, 'world');
        const content = from([inner1, inner2]);
        const node = new Node(paragraphType, {}, content, []);

        const visited: INode[] = [];
        node.descendants((child) => {
          visited.push(child);
        });

        expect(visited).toEqual([inner1, inner2]);
      });
    });
  });

  describe('children', () => {
    describe('given node with no content', () => {
      it('returns empty array', () => {
        const parent = new Node(paragraphType, {});
        expect(parent.children).toEqual([]);
      });
    });

    describe('given node with children', () => {
      it('returns array of child nodes', () => {
        const child1 = new TextNode(textType, {}, 'Hello');
        const child2 = new TextNode(textType, {}, 'world');
        const parent = new Node(
          paragraphType,
          {},
          Fragment.from([child1, child2])
        );
        expect(parent.children).toEqual([child1, child2]);
      });
    });
  });

  describe('textContent', () => {
    describe('given leaf node with leafText defined', () => {
      it('returns leafText result', () => {
        const imageType = new NodeType('image', defaultMockSchema, {
          leafText: (node) => node.attrs['alt'] as string,
        });
        imageType.contentMatch = ContentMatch.empty;
        const node = new Node(imageType, { alt: 'cat' });

        const result = node.textContent;

        expect(result).toBe('cat');
      });
    });

    describe('given non-leaf node with text content', () => {
      it('returns concatenated text', () => {
        const textNode = new TextNode(textType, {}, 'merhaba');
        const para = new Node(paragraphType, {}, from([textNode]));

        const result = para.textContent;

        expect(result).toBe('merhaba');
      });
    });
  });

  describe('textBetween', () => {
    describe('given from/to range over text content', () => {
      it('returns content.textBetween(from, to) result', () => {
        const text = new TextNode(textType, {}, 'hello');
        const parent = new Node(paragraphType, {}, from([text]));

        const result = parent.textBetween(0, 5);

        expect(result).toBe('hello');
      });
    });

    describe('given blockSeparator across multiple block nodes', () => {
      it('forwards blockSeparator to content.textBetween', () => {
        const text1 = new TextNode(textType, {}, 'hello');
        const text2 = new TextNode(textType, {}, 'world');
        const block1 = new Node(paragraphType, {}, from([text1]));
        const block2 = new Node(paragraphType, {}, from([text2]));
        const root = new Node(paragraphType, {}, from([block1, block2]));

        const result = root.textBetween(0, root.content.size, '\n');

        expect(result).toBe('hello\nworld');
      });
    });

    describe('given leafText function over a leaf node', () => {
      it('forwards leafText to content.textBetween', () => {
        const imageType = new NodeType(
          'image',
          defaultMockSchema,
          defaultNodeSpec
        );
        imageType.contentMatch = ContentMatch.empty;
        const image = new Node(imageType, { alt: 'cat' });
        const parent = new Node(paragraphType, {}, from([image]));

        const result = parent.textBetween(
          0,
          parent.content.size,
          '',
          (n) => n.attrs['alt'] as string
        );

        expect(result).toBe('cat');
      });
    });
  });
});
