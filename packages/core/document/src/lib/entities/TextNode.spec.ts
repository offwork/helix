import { TextNode } from './TextNode';
import {
  textType,
  boldMarkType,
  italicMarkType,
  createMark,
} from '../../testing';

describe('TextNode', () => {
  describe('constructor', () => {
    it('given valid type, text and marks, creates a TextNode instance', () => {
      const attrs = { color: 'red' };
      const text = 'hello world';
      const marks = [createMark(boldMarkType, {})];

      const textNode = new TextNode(textType, attrs, text, marks);

      expect(textNode).toBeInstanceOf(TextNode);
    });

    it('given empty text, throws RangeError', () => {
      const attrs = { color: 'red' };
      const text = '';

      expect(() => new TextNode(textType, attrs, text)).toThrow(
        'Node text cannot be empty'
      );
    });

    it('given null text, throws RangeError', () => {
      const attrs = { color: 'red' };
      const text = null as never;

      expect(() => new TextNode(textType, attrs, text)).toThrow(
        'Node text cannot be empty'
      );
    });

    it('given whitespace-only text, creates TextNode', () => {
      const textNode = new TextNode(textType, {}, ' ');

      expect(textNode.text).toBe(' ');
    });
  });

  describe('nodeSize', () => {
    it('given text, returns length of text', () => {
      const attrs = { color: 'red' };
      const text = 'hello world';

      const textNode = new TextNode(textType, attrs, text);

      expect(textNode.nodeSize).toBe(11);
    });
  });

  describe('textBetween', () => {
    it('given range, returns sliced text', () => {
      const attrs = { color: 'red' };
      const text = 'hello world';

      const textNode = new TextNode(textType, attrs, text);

      expect(textNode.textBetween(0, 5)).toBe('hello');
    });
  });

  describe('withText', () => {
    it('given same text, returns same reference', () => {
      const attrs = { color: 'red' };
      const text = 'hello world';

      const textNode = new TextNode(textType, attrs, text);
      const result = textNode.withText(text);

      expect(result).toBe(textNode);
    });

    it('given different text, returns new TextNode with updated text', () => {
      const attrs = { color: 'red' };

      const textNode = new TextNode(textType, attrs, 'hello world');
      const result = textNode.withText('Hola mundo');

      expect(result).not.toBe(textNode);
      expect(result.text).toBe('Hola mundo');
    });
  });

  describe('mark', () => {
    it('given same marks, returns same reference', () => {
      const attrs = { color: 'red' };
      const text = 'hello world';
      const marks = [createMark(boldMarkType, {})];

      const textNode = new TextNode(textType, attrs, text, marks);
      const result = textNode.mark(marks);

      expect(result).toBe(textNode);
    });

    it('given different marks, returns new TextNode with updated marks', () => {
      const attrs = { color: 'red' };
      const text = 'hello world';
      const marks = [createMark(boldMarkType, {})];
      const newMarks = [createMark(italicMarkType, {})];

      const textNode = new TextNode(textType, attrs, text, marks);
      const result = textNode.mark(newMarks);

      expect(result).not.toBe(textNode);
      expect(result.marks).toEqual(newMarks);
    });
  });

  describe('cut', () => {
    it('given full range, returns same reference', () => {
      const attrs = { color: 'red' };
      const text = 'hello world';

      const textNode = new TextNode(textType, attrs, text);
      const result = textNode.cut(0, text.length);

      expect(result).toBe(textNode);
    });

    it('given partial range, returns new TextNode with sliced text', () => {
      const attrs = { color: 'red' };
      const text = 'hello world';

      const textNode = new TextNode(textType, attrs, text);
      const result = textNode.cut(0, 5);

      expect(result).not.toBe(textNode);
      expect(result.text).toBe('hello');
    });
  });

  describe('equals', () => {
    it('given same text and same marks, returns true', () => {
      const marks = [createMark(boldMarkType, {})];

      const textNode1 = new TextNode(textType, {}, 'hello', marks);
      const textNode2 = new TextNode(textType, {}, 'hello', marks);

      expect(textNode1.equals(textNode2)).toBe(true);
    });

    it('given different text, returns false', () => {
      const attrs = { color: 'red' };
      const marks = [createMark(boldMarkType, {})];

      const textNode1 = new TextNode(textType, attrs, 'hello world', marks);
      const textNode2 = new TextNode(textType, attrs, 'Hola mundo', marks);

      expect(textNode1.equals(textNode2)).toBe(false);
    });

    it('given same text but different marks, returns false', () => {
      const textNode1 = new TextNode(textType, {}, 'hello', [createMark(boldMarkType, {})]);
      const textNode2 = new TextNode(textType, {}, 'hello', [createMark(italicMarkType, {})]);

      expect(textNode1.equals(textNode2)).toBe(false);
    });

    it('given same text but one has no marks, returns false', () => {
      const textNode1 = new TextNode(textType, {}, 'hello', [createMark(boldMarkType, {})]);
      const textNode2 = new TextNode(textType, {}, 'hello', []);

      expect(textNode1.equals(textNode2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('given a text node, returns string representation', () => {
      const textNode = new TextNode(textType, {}, 'hello');

      expect(textNode.toString()).toBe('"hello"');
    });
  });

  describe('toJSON', () => {
    it('given text node, returns object with type and text', () => {
      const textNode = new TextNode(textType, {}, 'hello');

      expect(textNode.toJSON()).toEqual({
        type: 'text',
        text: 'hello',
      });
    });
  });
});
