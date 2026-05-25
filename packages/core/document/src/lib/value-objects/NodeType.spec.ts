import { Fragment } from '../entities/Fragment';
import { Node } from '../entities/Node';
import { ContentMatch } from './ContentMatch';
import { NodeType } from './NodeType';
import { Mark } from './Mark';
import {
  defaultMockSchema,
  createNodeSpec,
  createMockNodeType,
  paragraphType,
  headingType,
  textType,
  boldMarkType,
  linkMarkType,
  italicMarkType,
  createMockNode,
  mentionType,
  createMark,
} from '../../testing';

describe('NodeType', () => {
  describe('Constructor', () => {
    it('constructor, given valid spec, stores name', () => {
      const nodeType = new NodeType(
        'paragraph',
        defaultMockSchema,
        createNodeSpec()
      );

      expect(nodeType).toBeInstanceOf(NodeType);
      expect(nodeType.name).toBe('paragraph');
    });

    it('constructor, given valid spec, stores schema reference', () => {
      const nodeType = new NodeType(
        'paragraph',
        defaultMockSchema,
        createNodeSpec()
      );

      expect(nodeType.schema).toBe(defaultMockSchema);
    });

    it('constructor, given valid spec, stores spec', () => {
      const spec = createNodeSpec({ attrs: { level: { default: 1 } } });
      const nodeType = new NodeType('paragraph', defaultMockSchema, spec);

      expect(nodeType.spec).toBe(spec);
    });

    it('given default, is null', () => {
      const nodeType = new NodeType(
        'paragraph',
        defaultMockSchema,
        createNodeSpec({ attrs: { level: { default: 1 } } })
      );

      expect(nodeType.contentMatch).toBe(null);
    });

    it('given default, is null', () => {
      const nodeType = createMockNodeType(
        'paragraph',
        defaultMockSchema,
        createNodeSpec({ attrs: { level: { default: 1 } } })
      );

      expect(nodeType.inlineContent).toBe(null);
    });

    it('constructor, given empty name, throws error', () => {
      expect(
        () => new NodeType('', defaultMockSchema, createNodeSpec())
      ).toThrow('NodeType name cannot be empty');
    });

    it('constructor, given null name, throws error', () => {
      expect(
        () => new NodeType(null as never, defaultMockSchema, createNodeSpec())
      ).toThrow('NodeType name cannot be empty');
    });

    it('constructor, given undefined name, throws error', () => {
      expect(
        () =>
          new NodeType(undefined as never, defaultMockSchema, createNodeSpec())
      ).toThrow('NodeType name cannot be empty');
    });

    it('constructor, given whitespace name, throws error', () => {
      expect(
        () => new NodeType('  ', defaultMockSchema, createNodeSpec())
      ).toThrow('NodeType name cannot be empty');
    });

    it('constructor, given null schema, throws error', () => {
      expect(
        () => new NodeType('paragraph', null as never, createNodeSpec())
      ).toThrow('NodeType schema cannot be null');
    });

    it('constructor, given undefined schema, throws error', () => {
      expect(
        () => new NodeType('paragraph', undefined as never, createNodeSpec())
      ).toThrow('NodeType schema cannot be undefined');
    });

    it('constructor, given null spec, throws error', () => {
      expect(
        () => new NodeType('paragraph', defaultMockSchema, null as never)
      ).toThrow('NodeType spec cannot be null');
    });

    it('constructor, given undefined spec, throws error', () => {
      expect(
        () => new NodeType('paragraph', defaultMockSchema, undefined as never)
      ).toThrow('NodeType spec cannot be undefined');
    });
  });

  describe('equals()', () => {
    it('equals, given same name, returns true', () => {
      const nodeType1 = createMockNodeType();
      const nodeType2 = createMockNodeType();

      expect(nodeType1.equals(nodeType2)).toBe(true);
    });

    it('equals, given different name, returns false', () => {
      const nodeType1 = createMockNodeType('paragraph');
      const nodeType2 = createMockNodeType('heading');

      expect(nodeType1.equals(nodeType2)).toBe(false);
    });

    it('equals, given null parameter, throws error', () => {
      const nodeType = createMockNodeType('paragraph');

      expect(() => nodeType.equals(null as never)).toThrow(
        'NodeType equals parameter cannot be null'
      );
    });
  });

  describe('allowsMarkType', () => {
    it('given markSet is null, returns true', () => {
      const nodeType = createMockNodeType(
        'paragraph',
        defaultMockSchema,
        createNodeSpec()
      );
      nodeType.markSet = null;

      expect(nodeType.allowsMarkType(boldMarkType)).toBe(true);
    });

    it('given markType is in markSet, returns true', () => {
      const nodeType = createMockNodeType(
        'paragraph',
        defaultMockSchema,
        createNodeSpec()
      );
      nodeType.markSet = [boldMarkType, linkMarkType];

      expect(nodeType.allowsMarkType(boldMarkType)).toBe(true);
    });

    it('given markType is not in markSet, returns false', () => {
      const nodeType = createMockNodeType(
        'paragraph',
        defaultMockSchema,
        createNodeSpec()
      );
      nodeType.markSet = [boldMarkType, linkMarkType];

      expect(nodeType.allowsMarkType(italicMarkType)).toBe(false);
    });
  });

  describe('allowsMarks', () => {
    it('given markSet is null, returns true', () => {
      const nodeType = createMockNodeType(
        'paragraph',
        defaultMockSchema,
        createNodeSpec()
      );
      nodeType.markSet = null;
      const marks = [createMark(boldMarkType, { color: 'red' })];

      expect(nodeType.allowsMarks(marks)).toBe(true);
    });

    it('given all marks in markSet, returns true', () => {
      const nodeType = createMockNodeType(
        'paragraph',
        defaultMockSchema,
        createNodeSpec()
      );
      nodeType.markSet = [boldMarkType, linkMarkType];
      const marks = [
        createMark(boldMarkType, { color: 'red' }),
        createMark(linkMarkType, { href: 'https://example.com' }),
      ];

      expect(nodeType.allowsMarks(marks)).toBe(true);
    });
  });

  describe('allowedMarks', () => {
    it('given markSet is null, returns same reference', () => {
      const nodeType = createMockNodeType(
        'paragraph',
        defaultMockSchema,
        createNodeSpec()
      );
      nodeType.markSet = null;

      const marks = [
        createMark(boldMarkType, { color: 'red' }),
        createMark(linkMarkType, { href: 'https://example.com' }),
      ];

      expect(nodeType.allowedMarks(marks)).toBe(marks);
    });

    it('given one mark not allowed, returns filtered marks', () => {
      const nodeType = createMockNodeType(
        'paragraph',
        defaultMockSchema,
        createNodeSpec()
      );
      nodeType.markSet = [boldMarkType];
      const marks = [
        createMark(boldMarkType, { color: 'red' }),
        createMark(linkMarkType, { href: 'https://example.com' }),
      ];

      expect(nodeType.allowedMarks(marks)).toEqual([
        createMark(boldMarkType, { color: 'red' }),
      ]);
    });

    it('given all marks allowed, returns same reference', () => {
      const nodeType = createMockNodeType(
        'paragraph',
        defaultMockSchema,
        createNodeSpec()
      );
      nodeType.markSet = [boldMarkType, linkMarkType];
      const marks = [
        createMark(boldMarkType, { color: 'red' }),
        createMark(linkMarkType, { href: 'https://example.com' }),
      ];

      expect(nodeType.allowedMarks(marks)).toBe(marks);
    });

    it('given all marks not allowed, returns Mark.none', () => {
      const nodeType = createMockNodeType(
        'paragraph',
        defaultMockSchema,
        createNodeSpec()
      );
      nodeType.markSet = [boldMarkType];
      const marks = [
        createMark(linkMarkType, { href: 'https://example.com' }),
        createMark(italicMarkType, { color: 'blue' }),
      ];

      expect(nodeType.allowedMarks(marks)).toBe(Mark.none);
    });
  });

  describe('isLeaf', () => {
    it('given contentMatch is ContentMatch.empty, returns true', () => {
      const nodeType = createMockNodeType(
        'image',
        defaultMockSchema,
        createNodeSpec()
      );
      nodeType.contentMatch = ContentMatch.empty;

      expect(nodeType.isLeaf).toBe(true);
    });
  });

  describe('isText', () => {
    it('given name is "text", returns true', () => {
      expect(textType.isText).toBe(true);
    });
  });

  describe('isBlock', () => {
    it('given spec without inline and text flags, returns true', () => {
      const nodeType = createMockNodeType(
        'paragraph',
        defaultMockSchema,
        createNodeSpec()
      );

      expect(nodeType.isBlock).toBe(true);
    });

    it('given name is "text", returns false', () => {
      expect(textType.isBlock).toBe(false);
    });
  });

  describe('isInline', () => {
    it('given spec without inline and text flags, returns false', () => {
      const nodeType = createMockNodeType();

      expect(nodeType.isInline).toBe(false);
    });
  });

  describe('create()', () => {
    it('given text node type, throws error', () => {
      expect(() => textType.create()).toThrow(
        'NodeType.create cannot construct text nodes'
      );
    });

    it('given block type with no args, returns Node with defaults', () => {
      const nodeType = createMockNodeType(
        'paragraph',
        defaultMockSchema,
        createNodeSpec()
      );

      expect(nodeType.create()).toBeInstanceOf(Node);
    });

    it('create, given attrs and content, returns Node with provided values', () => {
      const nodeType = createMockNodeType(
        'paragraph',
        defaultMockSchema,
        createNodeSpec()
      );
      const childNode = new Node(headingType, {
        level: 2,
        visible: true,
      });

      const attrs = { visible: true, class: 'text-wrapper' };
      const content = Fragment.from([childNode]);
      const node = nodeType.create(attrs, content);

      expect(node.attrs).toEqual(attrs);
      expect(node.content).toBe(content);
    });

    it('given array of nodes as content, wraps in Fragment', () => {
      const nodeType = createMockNodeType(
        'paragraph',
        defaultMockSchema,
        createNodeSpec()
      );
      const childNode1 = new Node(headingType, {
        level: 1,
        visible: true,
      });
      const childNode2 = new Node(paragraphType, {
        level: 2,
        visible: true,
      });

      const attrs = { visible: true, class: 'text-wrapper' };
      const node = nodeType.create(attrs, [childNode1, childNode2]);

      expect(node.content.childCount).toBe(2);
      expect(node.content).toBeInstanceOf(Fragment);
    });
  });

  describe('validContent()', () => {
    it('given matching content, returns true', () => {
      const finalMatch = new ContentMatch(true, []);
      const match2 = new ContentMatch(false, [
        { type: paragraphType, next: finalMatch },
      ]);
      const match1 = new ContentMatch(false, [
        { type: headingType, next: match2 },
      ]);

      const nodeType = createMockNodeType(
        'doc',
        defaultMockSchema,
        createNodeSpec()
      );
      nodeType.contentMatch = match1;

      const content = Fragment.from([
        createMockNode(headingType),
        createMockNode(paragraphType),
      ]);

      expect(nodeType.validContent(content)).toBe(true);
    });

    it('validContent, given null, throws error', () => {
      const finalMatch = new ContentMatch(true, []);
      const match2 = new ContentMatch(false, [
        { type: paragraphType, next: finalMatch },
      ]);
      const match1 = new ContentMatch(false, [
        { type: headingType, next: match2 },
      ]);

      const nodeType = createMockNodeType(
        'doc',
        defaultMockSchema,
        createNodeSpec()
      );
      nodeType.contentMatch = match1;

      expect(() => nodeType.validContent(null as never)).toThrow(
        'NodeType validContent parameter cannot be null'
      );
    });

    it('validContent, given undefined, throws error', () => {
      const finalMatch = new ContentMatch(true, []);
      const match2 = new ContentMatch(false, [
        { type: paragraphType, next: finalMatch },
      ]);
      const match1 = new ContentMatch(false, [
        { type: headingType, next: match2 },
      ]);

      const nodeType = createMockNodeType(
        'doc',
        defaultMockSchema,
        createNodeSpec()
      );
      nodeType.contentMatch = match1;

      expect(() => nodeType.validContent(undefined as never)).toThrow(
        'NodeType validContent parameter cannot be undefined'
      );
    });

    it('given content with disallowed marks, returns false', () => {
      const nodeType = createMockNodeType(
        'paragraph',
        defaultMockSchema,
        createNodeSpec()
      );
      nodeType.contentMatch = ContentMatch.parse('paragraph', {
        paragraph: paragraphType,
      });
      nodeType.markSet = [boldMarkType];

      const content = Fragment.from([
        new Node(paragraphType, {}, undefined, [
          createMark(linkMarkType, { href: 'https://example.com' }),
        ]),
      ]);

      expect(nodeType.validContent(content)).toBe(false);
    });
  });

  describe('createChecked()', () => {
    it('given valid content, returns node', () => {
      const finalMatch = new ContentMatch(true, []);
      const match2 = new ContentMatch(false, [
        { type: paragraphType, next: finalMatch },
      ]);
      const match1 = new ContentMatch(false, [
        { type: headingType, next: match2 },
      ]);

      const nodeType = createMockNodeType(
        'doc',
        defaultMockSchema,
        createNodeSpec()
      );
      nodeType.contentMatch = match1;

      const content = Fragment.from([
        createMockNode(headingType),
        createMockNode(paragraphType),
      ]);

      const node = nodeType.createChecked({}, content);

      expect(node).toBeInstanceOf(Node);
    });

    it('given invalid content, throws RangeError', () => {
      const finalMatch = new ContentMatch(true, []);
      const match2 = new ContentMatch(false, [
        { type: paragraphType, next: finalMatch },
      ]);
      const match1 = new ContentMatch(false, [
        { type: headingType, next: match2 },
      ]);

      const nodeType = createMockNodeType(
        'doc',
        defaultMockSchema,
        createNodeSpec()
      );
      nodeType.contentMatch = match1;

      const content = Fragment.from([
        createMockNode(paragraphType),
        createMockNode(headingType),
      ]);

      expect(() => nodeType.createChecked({}, content)).toThrow(RangeError);
    });
  });

  describe('hasRequiredAttrs()', () => {
    it('given one attr without default, returns true', () => {
      const nodeType = createMockNodeType(
        'heading',
        defaultMockSchema,
        createNodeSpec({ attrs: { title: { default: 'Untitled' }, level: {} } })
      );

      expect(nodeType.hasRequiredAttrs()).toBe(true);
    });
  });

  describe('isTextblock()', () => {
    it('given block node with inlineContent true, returns true', () => {
      const nodeType = createMockNodeType(
        'paragraph',
        defaultMockSchema,
        createNodeSpec()
      );
      nodeType.inlineContent = true;

      expect(nodeType.isTextblock).toBe(true);
    });
  });

  describe('isAtom()', () => {
    it('given leaf node, returns true', () => {
      const nodeType = createMockNodeType(
        'image',
        defaultMockSchema,
        createNodeSpec()
      );
      nodeType.contentMatch = ContentMatch.empty;

      expect(nodeType.isAtom).toBe(true);
    });

    it('given non-leaf node with atom spec true, returns true', () => {
      expect(mentionType.isAtom).toBe(true);
    });
  });

  describe('createAndFill()', () => {
    it('given text node type, throws error', () => {
      expect(() => textType.createAndFill()).toThrow(
        'NodeType.createAndFill cannot construct text nodes'
      );
    });

    it('given content that cannot be filled, returns null', () => {
      const finalMatch = new ContentMatch(true, []);
      const match = new ContentMatch(false, [
        { type: paragraphType, next: finalMatch },
      ]);

      const nodeType = createMockNodeType(
        'doc',
        defaultMockSchema,
        createNodeSpec()
      );
      nodeType.contentMatch = match;

      const content = Fragment.from([createMockNode(headingType)]);
      const result = nodeType.createAndFill({}, content);

      expect(result).toBe(null);
    });

    it('given empty content and valid contentMatch, returns node', () => {
      const nodeType = createMockNodeType('doc', defaultMockSchema, {
        attrs: {},
      });
      nodeType.contentMatch = new ContentMatch(true, []);

      const result = nodeType.createAndFill();

      expect(result).toBeInstanceOf(Node);
    });

    it('given non-empty content that needs fill, returns node with complete content', () => {
      const finalMatch = new ContentMatch(true, []);
      const match2 = new ContentMatch(false, [
        { type: paragraphType, next: finalMatch },
      ]);
      const match1 = new ContentMatch(false, [
        { type: headingType, next: match2 },
      ]);

      const nodeType = createMockNodeType('doc', defaultMockSchema, {
        attrs: {},
      });
      nodeType.contentMatch = match1;

      const content = Fragment.from([createMockNode(paragraphType)]);
      const result = nodeType.createAndFill({}, content);

      expect(result).toBeInstanceOf(Node);
      expect(result?.content.childCount).toBe(2);
    });
  });

  describe('compatibleContent', () => {
    it('given same type, returns true', () => {
      const nodeType = createMockNodeType();
      nodeType.contentMatch = ContentMatch.parse('paragraph', {
        paragraph: nodeType,
      });

      expect(nodeType.compatibleContent(nodeType)).toBe(true);
    });

    it('given compatible contentMatch, returns true', () => {
      const nodeType1 = createMockNodeType('paragraph');
      const nodeType2 = createMockNodeType('paragraph');

      const match1 = ContentMatch.parse('paragraph', {
        paragraph: nodeType1,
      });

      const match2 = ContentMatch.parse('paragraph', {
        paragraph: nodeType1,
      });

      nodeType1.contentMatch = match1;
      nodeType2.contentMatch = match2;

      expect(nodeType1.compatibleContent(nodeType2)).toBe(true);
    });
  });

  describe('whitespace()', () => {
    it('given spec.whitespace "pre", returns "pre"', () => {
      const nodeType = createMockNodeType(
        'paragraph',
        defaultMockSchema,
        createNodeSpec({ whitespace: 'pre' })
      );

      expect(nodeType.whitespace).toBe('pre');
    });

    it('given spec.code true, returns "pre"', () => {
      const nodeType = createMockNodeType(
        'paragraph',
        defaultMockSchema,
        createNodeSpec({ code: true })
      );

      expect(nodeType.whitespace).toBe('pre');
    });
  });
});
