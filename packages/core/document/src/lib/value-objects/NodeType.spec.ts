import { Fragment } from '../entities/Fragment';
import { Node } from '../entities/Node';
import { NodeSpec } from '../interfaces/SchemaSpec';
import { ContentMatch } from './ContentMatch';
import { MarkType } from './MarkType';
import { NodeType } from './NodeType';

describe('NodeType', () => {
  describe('Constructor', () => {
    it('constructor, given valid spec, stores name', () => {
      const spec: NodeSpec = { attrs: {} };
      const mockSchema = {} as never;

      const nodeType = new NodeType('paragraph', mockSchema, spec);

      expect(nodeType).toBeInstanceOf(NodeType);
      expect(nodeType.name).toBe('paragraph');
    });

    it('constructor, given valid spec, stores schema reference', () => {
      const spec: NodeSpec = { attrs: {} };
      const mockSchema = {} as never;

      const nodeType = new NodeType('paragraph', mockSchema, spec);

      expect(nodeType.schema).toBe(mockSchema);
    });

    it('constructor, given valid spec, stores spec', () => {
      const spec: NodeSpec = { attrs: { level: 1 } };
      const mockSchema = {} as never;

      const nodeType = new NodeType('paragraph', mockSchema, spec);

      expect(nodeType.spec).toBe(spec);
    });

    it('given default, is null', () => {
      const spec: NodeSpec = { attrs: { level: 1 } };
      const mockSchema = {} as never;

      const nodeType = new NodeType('paragraph', mockSchema, spec);

      expect(nodeType.contentMatch).toBe(null);
    });

    it('given default, is null', () => {
      const spec: NodeSpec = { attrs: { level: 1 } };
      const mockSchema = {} as never;

      const nodeType = new NodeType('paragraph', mockSchema, spec);

      expect(nodeType.inlineContent).toBe(null);
    });

    it('constructor, given empty name, throws error', () => {
      const spec: NodeSpec = { attrs: {} };
      const mockSchema = {} as never;

      expect(() => new NodeType('', mockSchema, spec)).toThrow(
        'NodeType name cannot be empty'
      );
    });

    it('constructor, given null name, throws error', () => {
      const spec: NodeSpec = { attrs: {} };
      const mockSchema = {} as never;

      expect(() => new NodeType(null as never, mockSchema, spec)).toThrow(
        'NodeType name cannot be empty'
      );
    });

    it('constructor, given undefined name, throws error', () => {
      const spec: NodeSpec = { attrs: {} };
      const mockSchema = {} as never;

      expect(() => new NodeType(undefined as never, mockSchema, spec)).toThrow(
        'NodeType name cannot be empty'
      );
    });

    it('constructor, given whitespace name, throws error', () => {
      const spec: NodeSpec = { attrs: {} };
      const mockSchema = {} as never;

      expect(() => new NodeType('  ', mockSchema, spec)).toThrow(
        'NodeType name cannot be empty'
      );
    });

    it('constructor, given null schema, throws error', () => {
      const spec: NodeSpec = { attrs: {} };

      expect(() => new NodeType('paragraph', null as never, spec)).toThrow(
        'NodeType schema cannot be null'
      );
    });

    it('constructor, given undefined schema, throws error', () => {
      const spec: NodeSpec = { attrs: {} };

      expect(() => new NodeType('paragraph', undefined as never, spec)).toThrow(
        'NodeType schema cannot be undefined'
      );
    });

    it('constructor, given null spec, throws error', () => {
      const mockSchema = {} as never;

      expect(
        () => new NodeType('paragraph', mockSchema, null as never)
      ).toThrow('NodeType spec cannot be null');
    });

    it('constructor, given undefined spec, throws error', () => {
      const mockSchema = {} as never;

      expect(
        () => new NodeType('paragraph', mockSchema, undefined as never)
      ).toThrow('NodeType spec cannot be undefined');
    });
  });

  describe('equals()', () => {
    it('equals, given same name, returns true', () => {
      const mockSchema = {} as never;
      const spec: NodeSpec = { attrs: {} };

      const nodeType1 = new NodeType('paragraph', mockSchema, spec);
      const nodeType2 = new NodeType('paragraph', mockSchema, spec);

      expect(nodeType1.equals(nodeType2)).toBe(true);
    });

    it('equals, given different name, returns false', () => {
      const mockSchema = {} as never;
      const spec1: NodeSpec = { attrs: {} };
      const spec2: NodeSpec = { attrs: { level: 1 } };

      const nodeType1 = new NodeType('paragraph', mockSchema, spec1);
      const nodeType2 = new NodeType('heading', mockSchema, spec2);

      expect(nodeType1.equals(nodeType2)).toBe(false);
    });

    it('equals, given null parameter, throws error', () => {
      const mockSchema = {} as never;
      const spec: NodeSpec = { attrs: {} };

      const nodeType = new NodeType('paragraph', mockSchema, spec);

      expect(() => nodeType.equals(null as never)).toThrow(
        'NodeType equals parameter cannot be null'
      );
    });
  });

  describe('allowsMarkType', () => {
    const mockSchema = {} as never;

    it('given null parameter, throws error', () => {
      const nodeType = new NodeType('paragraph', mockSchema, {});
      expect(() => nodeType.allowsMarkType(null as never)).toThrow(
        'NodeType allowsMarkType parameter cannot be null'
      );
    });

    it('given non-MarkType parameter, throws error', () => {
      const nodeType = new NodeType('paragraph', mockSchema, {});
      expect(() => nodeType.allowsMarkType('bold' as never)).toThrow(
        'NodeType allowsMarkType parameter must be MarkType'
      );
    });

    it('given marks spec is undefined, returns true when inline is true', () => {
      const nodeType = new NodeType('text', mockSchema, { inline: true });
      const boldType = new MarkType('bold', mockSchema, {});
      expect(nodeType.allowsMarkType(boldType)).toBe(true);
    });

    it('given marks spec is undefined, returns false when inline is false', () => {
      const nodeType = new NodeType('paragraph', mockSchema, { inline: false });
      const boldType = new MarkType('bold', mockSchema, {});
      expect(nodeType.allowsMarkType(boldType)).toBe(false);
    });

    it('given marks spec is undefined, returns false when inline is undefined', () => {
      const nodeType = new NodeType('paragraph', mockSchema, {});
      const boldType = new MarkType('bold', mockSchema, {});
      expect(nodeType.allowsMarkType(boldType)).toBe(false);
    });

    it('given marks spec is "_", returns true for any mark type', () => {
      const nodeType = new NodeType('paragraph', mockSchema, { marks: '_' });
      const boldType = new MarkType('bold', mockSchema, {});
      const linkType = new MarkType('link', mockSchema, {});
      expect(nodeType.allowsMarkType(boldType)).toBe(true);
      expect(nodeType.allowsMarkType(linkType)).toBe(true);
    });

    it('given marks spec is "", returns false for any mark type', () => {
      const nodeType = new NodeType('code_block', mockSchema, { marks: '' });
      const boldType = new MarkType('bold', mockSchema, {});
      expect(nodeType.allowsMarkType(boldType)).toBe(false);
    });

    it('given marks spec is space-separated list, returns true for listed mark', () => {
      const nodeType = new NodeType('paragraph', mockSchema, {
        marks: 'bold italic',
      });
      const boldType = new MarkType('bold', mockSchema, {});
      expect(nodeType.allowsMarkType(boldType)).toBe(true);
    });

    it('given marks spec is space-separated list, returns false for unlisted mark', () => {
      const nodeType = new NodeType('paragraph', mockSchema, {
        marks: 'bold italic',
      });
      const linkType = new MarkType('link', mockSchema, {});
      expect(nodeType.allowsMarkType(linkType)).toBe(false);
    });
  });

  describe('isLeaf', () => {
    it('given spec.leaf true, returns true', () => {
      const mockSchema = {} as never;
      const spec: NodeSpec = { attrs: {}, leaf: true };
      const nodeType = new NodeType('image', mockSchema, spec);

      const result = nodeType.isLeaf;

      expect(result).toBe(true);
    });
  });

  describe('isText', () => {
    it('given spec.text true, returns true', () => {
      const mockSchema = {} as never;
      const spec: NodeSpec = { attrs: {}, text: true };
      const nodeType = new NodeType('paragraph', mockSchema, spec);

      const result = nodeType.isText;

      expect(result).toBe(true);
    });
  });

  describe('isBlock', () => {
    it('given spec without inline and text flags, returns true', () => {
      const mockSchema = {} as never;
      const spec: NodeSpec = { attrs: {} };
      const nodeType = new NodeType('paragraph', mockSchema, spec);

      expect(nodeType.isBlock).toBe(true);
    });
  });

  describe('isInline', () => {
    it('given spec without inline and text flags, returns false', () => {
      const mockSchema = {} as never;
      const spec: NodeSpec = { attrs: {} };
      const nodeType = new NodeType('paragraph', mockSchema, spec);

      expect(nodeType.isInline).toBe(false);
    });
  });

  describe('create()', () => {
    it('given text node type, throws error', () => {
      const mockSchema = {} as never;
      const spec: NodeSpec = { attrs: {}, text: true };
      const nodeType = new NodeType('text', mockSchema, spec);

      expect(() => nodeType.create()).toThrow(
        'NodeType.create cannot construct text nodes'
      );
    });

    it('given block type with no args, returns Node with defaults', () => {
      const mockSchema = {} as never;
      const spec: NodeSpec = { attrs: {} };
      const nodeType = new NodeType('paragraph', mockSchema, spec);

      expect(nodeType.create()).toBeInstanceOf(Node);
    });

    it('create, given attrs and content, returns Node with provided values', () => {
      const mockSchema = {} as never;
      const spec: NodeSpec = { attrs: {} };
      const nodeType = new NodeType('paragraph', mockSchema, spec);
      const childNode = new Node(new NodeType('heading', mockSchema, spec), {
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
      const mockSchema = {} as never;
      const spec: NodeSpec = { attrs: {} };
      const nodeType = new NodeType('paragraph', mockSchema, spec);
      const childNode1 = new Node(new NodeType('heading', mockSchema, spec), {
        level: 1,
        visible: true,
      });
      const childNode2 = new Node(new NodeType('paragraph', mockSchema, spec), {
        level: 2,
        visible: true,
      });

      const attrs = { visible: true, class: 'text-wrapper' };
      const node = nodeType.create(attrs, [childNode1, childNode2]);

      expect(node.content.childCount).toBe(2);
      expect(node.content).toBeInstanceOf(Fragment);
    });
  });

  describe('hasRequiredAttrs()', () => {
    it('given current attrs system without required concept, returns false', () => {
      const mockSchema = {} as never;
      const spec: NodeSpec = { attrs: { level: 1 } };
      const nodeType = new NodeType('heading', mockSchema, spec);

      expect(nodeType.hasRequiredAttrs()).toBe(false);
    });
  });

  describe('validContent()', () => {
    it('given matching content, returns true', () => {
      const mockSchema = {} as never;
      const spec: NodeSpec = { attrs: {} };

      const headingType = new NodeType('heading', mockSchema, spec);
      const paragraphType = new NodeType('paragraph', mockSchema, spec);

      const finalMatch = new ContentMatch(true, []);
      const match2 = new ContentMatch(false, [
        { type: paragraphType, next: finalMatch },
      ]);
      const match1 = new ContentMatch(false, [
        { type: headingType, next: match2 },
      ]);

      const nodeType = new NodeType('doc', mockSchema, spec);
      nodeType.contentMatch = match1;

      const content = Fragment.from([
        new Node(headingType, {}),
        new Node(paragraphType, {}),
      ]);

      expect(nodeType.validContent(content)).toBe(true);
    });

    it('validContent, given null, throws error', () => {
      const mockSchema = {} as never;
      const spec: NodeSpec = { attrs: {} };

      const headingType = new NodeType('heading', mockSchema, spec);
      const paragraphType = new NodeType('paragraph', mockSchema, spec);

      const finalMatch = new ContentMatch(true, []);
      const match2 = new ContentMatch(false, [
        { type: paragraphType, next: finalMatch },
      ]);
      const match1 = new ContentMatch(false, [
        { type: headingType, next: match2 },
      ]);

      const nodeType = new NodeType('doc', mockSchema, spec);
      nodeType.contentMatch = match1;

      expect(() => nodeType.validContent(null as never)).toThrow(
        'NodeType validContent parameter cannot be null'
      );
    });

    it('validContent, given undefined, throws error', () => {
      const mockSchema = {} as never;
      const spec: NodeSpec = { attrs: {} };

      const headingType = new NodeType('heading', mockSchema, spec);
      const paragraphType = new NodeType('paragraph', mockSchema, spec);

      const finalMatch = new ContentMatch(true, []);
      const match2 = new ContentMatch(false, [
        { type: paragraphType, next: finalMatch },
      ]);
      const match1 = new ContentMatch(false, [
        { type: headingType, next: match2 },
      ]);

      const nodeType = new NodeType('doc', mockSchema, spec);
      nodeType.contentMatch = match1;

      expect(() => nodeType.validContent(undefined as never)).toThrow(
        'NodeType validContent parameter cannot be undefined'
      );
    });
  });
});
