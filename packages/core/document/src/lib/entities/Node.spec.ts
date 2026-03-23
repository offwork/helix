import { Node } from './Node';
import { NodeType } from '../value-objects/NodeType';
import { Fragment } from './Fragment';

const mockSchema = {} as never;
const spec = { attrs: {} };
const type = new NodeType('paragraph', mockSchema, spec);
const mockChildNode = new Node(type, { attrs: {}, text: true });
const mockContent = Fragment.from<Node>([mockChildNode]);

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
      expect(() => new Node(type, null as never)).toThrow(
        'Node attrs cannot be null'
      );
    });

    it('given attrs undefined, throws error', () => {
      expect(() => new Node(type, undefined as never)).toThrow(
        'Node attrs cannot be undefined'
      );
    });

    it('given null content, throws error', () => {
      expect(() => new Node(type, {}, null as never)).toThrow(
        'Node content cannot be null'
      );
    });

    it('given null marks, throws error', () => {
      const childNode = new Node(type, {});
      const mockContent = Fragment.from<Node>([childNode]);

      expect(() => new Node(type, {}, mockContent, null as never)).toThrow(
        'Node marks cannot be null'
      );
    });

    it('given null text, throws error', () => {
      const childNode = new Node(type, {});
      const mockContent = Fragment.from<Node>([childNode]);

      expect(() => new Node(type, {}, mockContent, [], null as never)).toThrow(
        'Node text cannot be null'
      );
    });

    it('given empty text, throws error', () => {
      const childNode = new Node(type, {});
      const mockContent = Fragment.from<Node>([childNode]);

      expect(() => new Node(type, {}, mockContent, [], '')).toThrow(
        'Node text cannot be empty'
      );
    });
  });

  describe('childCount', () => {
    it('returns content.childCount', () => {
      const childNode = new Node(type, {});
      const mockContent = Fragment.from<Node>([childNode]);

      const node = new Node(type, {}, mockContent, []);

      expect(node.childCount).toBe(1);
    });
  });

  describe('nodeSize', () => {
    it('given leaf node, returns 1', () => {
      const image = new NodeType('image', mockSchema, { leaf: true });
      const childNode = new Node(type, {});
      const mockContent = Fragment.from<Node>([childNode]);

      const node = new Node(image, {}, mockContent, []);

      expect(node.nodeSize).toBe(1);
    });

    it('given text node, returns text.length', () => {
      const textType = new NodeType('text', mockSchema, { text: true });
      const childNode = new Node(type, {});
      const mockContent = Fragment.from<Node>([childNode]);

      const text = 'Hello';
      const node = new Node(textType, {}, mockContent, [], text);

      expect(node.nodeSize).toBe(text.length);
    });

    it('given container node, returns 2 + content.size', () => {
      const paragraphType = new NodeType('paragraph', mockSchema, spec);
      const childNode = new Node(paragraphType, {});
      const mockContent = Fragment.from<Node>([childNode]);

      const node = new Node(paragraphType, {}, mockContent, []);

      expect(node.nodeSize).toBe(2 + mockContent.size);
    });
  });

  describe('equals', () => {
    it('given same type/attrs/content/marks, returns true', () => {
      const node1 = new Node(
        type,
        { level: 1, visible: true },
        mockContent,
        []
      );
      const node2 = new Node(
        type,
        { level: 1, visible: true },
        mockContent,
        []
      );

      expect(node1.equals(node2)).toBe(true);
    });

    it('given text nodes with different text, returns false', () => {
      const node1 = new Node(
        type,
        { level: 1, visible: true },
        mockContent,
        [],
        'Hello'
      );
      const node2 = new Node(
        type,
        { level: 1, visible: true },
        mockContent,
        [],
        'World'
      );

      expect(node1.equals(node2)).toBe(false);
    });

    it('given null, throws error', () => {
      const node = new Node(
        type,
        { level: 1, visible: true },
        mockContent,
        [],
        'Hello'
      );

      expect(() => node.equals(null as never)).toThrow(
        'Node equals parameter cannot be null'
      );
    });

    it('given undefined, throws error', () => {
      const node = new Node(
        type,
        { level: 1, visible: true },
        mockContent,
        [],
        'Hello'
      );

      expect(() => node.equals(undefined as never)).toThrow(
        'Node equals parameter cannot be undefined'
      );
    });
  });

  describe('copy', () => {
    it('given same content, returns same node', () => {
      const node = new Node(
        type,
        { level: 1, visible: true },
        mockContent,
        [],
        'Hello'
      );

      const copy = node.copy(mockContent);

      expect(copy).toBe(node);
    });

    it('given different content, returns new node with same type/attrs/marks/', () => {
      const node = new Node(type, { level: 1, visible: true }, mockContent, []);

      const newChildNode = new Node(type, {});
      const newContent = Fragment.from<Node>([newChildNode]);

      const copy = node.copy(newContent);

      expect(copy).not.toBe(node);
      expect(copy.type).toBe(node.type);
      expect(copy.attrs).toEqual(node.attrs);
      expect(copy.marks).toEqual(node.marks);
    });
  });

  describe('cut', () => {
    it('given from 0 and to content size, returns this', () => {
      const node = new Node(type, { level: 1, visible: true }, mockContent, []);

      const cut = node.cut(0, mockContent.size);

      expect(cut).toBe(node);
    });

    it('given text node full range, returns this', () => {
      const textType = new NodeType('text', mockSchema, { text: true });
      const node = new Node(textType, {}, undefined, undefined, 'Hello');

      expect(node.cut(0, 5)).toBe(node);
    });

    it('given text node partial range, returns trimmed text node', () => {
      const textType = new NodeType('text', mockSchema, { text: true });
      const node = new Node(textType, {}, undefined, undefined, 'Hello World');

      const result = node.cut(6, 11);

      expect(result.text).toBe('World');
    });

    it('given partial range, returns new node with cut content', () => {
      const child1 = new Node(new NodeType('paragraph', mockSchema, spec), {});
      const child2 = new Node(new NodeType('paragraph', mockSchema, spec), {});
      const content = Fragment.from([child1, child2]);
      const node = new Node(
        new NodeType('paragraph', mockSchema, spec),
        {},
        content,
        []
      );

      const result = node.cut(0, 2);

      expect(result).not.toBe(node);
      expect(result.content.childCount).toBe(1);
    });
  });
});
