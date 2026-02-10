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
      const node1 = new Node(type, spec, mockContent, []);
      const node2 = new Node(type, spec, mockContent, []);

      expect(node1.equals(node2)).toBe(true);
    });
  });
});
