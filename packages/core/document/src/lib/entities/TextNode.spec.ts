import { MarkSpec } from '../interfaces/SchemaSpec';
import { Mark } from '../value-objects/Mark';
import { MarkType } from '../value-objects/MarkType';
import { NodeType } from '../value-objects/NodeType';
import { TextNode } from './TextNode';

const createMark = (type: MarkType, attrs: Record<string, unknown>) =>
  new Mark(type, attrs);

const mockSchema = {} as never;
const spec: MarkSpec = { attrs: {} };

describe('TextNode', () => {
  describe('constructor', () => {
    it('given valid type, text and marks, creates a TextNode instance', () => {
      const nodeType = new NodeType('text', mockSchema, { attrs: {} });
      const attrs = { color: 'red' };
      const text = 'hello world';
      const marks = [createMark(new MarkType('bold', mockSchema, spec), {})];

      const textNode = new TextNode(nodeType, attrs, text, marks);

      expect(textNode).toBeInstanceOf(TextNode);
    });

    it('given empty text, throws RangeError', () => {
      const nodeType = new NodeType('text', mockSchema, { attrs: {} });
      const attrs = { color: 'red' };
      const text = '';

      expect(() => new TextNode(nodeType, attrs, text)).toThrow(
        'Node text cannot be empty'
      );
    });

    it('given null text, throws RangeError', () => {
      const nodeType = new NodeType('text', mockSchema, { attrs: {} });
      const attrs = { color: 'red' };
      const text = null as never;

      expect(() => new TextNode(nodeType, attrs, text)).toThrow(
        'Node text cannot be empty'
      );
    });
  });

  describe('nodeSize', () => {
    it('given text, returns length of text', () => {
      const nodeType = new NodeType('text', mockSchema, { attrs: {} });
      const attrs = { color: 'red' };
      const text = 'hello world';

      const textNode = new TextNode(nodeType, attrs, text);

      expect(textNode.nodeSize).toBe(11);
    });
  });

  describe('textBetween', () => {
    it('given range, returns sliced text', () => {
      const nodeType = new NodeType('text', mockSchema, { attrs: {} });
      const attrs = { color: 'red' };
      const text = 'hello world';

      const textNode = new TextNode(nodeType, attrs, text);

      expect(textNode.textBetween(0, 5)).toBe('hello');
    });
  });

  describe('withText', () => {
    it('given same text, returns same reference', () => {
      const nodeType = new NodeType('text', mockSchema, { attrs: {} });
      const attrs = { color: 'red' };
      const text = 'hello world';

      const textNode = new TextNode(nodeType, attrs, text);
      const result = textNode.withText(text);

      expect(result).toBe(textNode);
    });

    it('given different text, returns new TextNode with updated text', () => {
      const nodeType = new NodeType('text', mockSchema, { attrs: {} });
      const attrs = { color: 'red' };

      const textNode = new TextNode(nodeType, attrs, 'hello world');
      const result = textNode.withText('Hola mundo');

      expect(result).not.toBe(textNode);
      expect(result.text).toBe('Hola mundo');
    });
  });

  describe('mark', () => {
    it('given same marks, returns same reference', () => {
      const nodeType = new NodeType('text', mockSchema, { attrs: {} });
      const attrs = { color: 'red' };
      const text = 'hello world';
      const marks = [createMark(new MarkType('bold', mockSchema, spec), {})];

      const textNode = new TextNode(nodeType, attrs, text, marks);
      const result = textNode.mark(marks);

      expect(result).toBe(textNode);
    });

    it('given different marks, returns new TextNode with updated marks', () => {
      const nodeType = new NodeType('text', mockSchema, { attrs: {} });
      const attrs = { color: 'red' };
      const text = 'hello world';
      const marks = [createMark(new MarkType('bold', mockSchema, spec), {})];
      const newMarks = [
        createMark(new MarkType('italic', mockSchema, spec), {}),
      ];

      const textNode = new TextNode(nodeType, attrs, text, marks);
      const result = textNode.mark(newMarks);

      expect(result).not.toBe(textNode);
      expect(result.marks).toEqual(newMarks);
    });
  });

  describe('cut', () => {
    it('given full range, returns same reference', () => {
      const nodeType = new NodeType('text', mockSchema, { attrs: {} });
      const attrs = { color: 'red' };
      const text = 'hello world';

      const textNode = new TextNode(nodeType, attrs, text);
      const result = textNode.cut(0, text.length);

      expect(result).toBe(textNode);
    });

    it('given partial range, returns new TextNode with sliced text', () => {
      const nodeType = new NodeType('text', mockSchema, { attrs: {} });
      const attrs = { color: 'red' };
      const text = 'hello world';

      const textNode = new TextNode(nodeType, attrs, text);
      const result = textNode.cut(0, 5);

      expect(result).not.toBe(textNode);
      expect(result.text).toBe('hello');
    });
  });

  describe('equals', () => {
    it('given different text, returns false', () => {
      const nodeType = new NodeType('text', mockSchema, { attrs: {} });
      const attrs = { color: 'red' };
      const marks = [createMark(new MarkType('bold', mockSchema, spec), {})];

      const textNode1 = new TextNode(nodeType, attrs, 'hello world', marks);
      const textNode2 = new TextNode(nodeType, attrs, 'Hola mundo', marks);

      expect(textNode1.equals(textNode2)).toBe(false);
    });
  });
});
