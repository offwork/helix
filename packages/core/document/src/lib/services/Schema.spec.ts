import { Node } from '../entities/Node';
import { MarkSpec, NodeSpec } from '../interfaces/SchemaSpec';
import { ContentMatch } from '../value-objects/ContentMatch';
import { Mark } from '../value-objects/Mark';
import { MarkType } from '../value-objects/MarkType';
import { NodeType } from '../value-objects/NodeType';
import { Schema } from './Schema';

function createNodeSpec(extra?: Record<string, NodeSpec>): Record<string, NodeSpec> {
  return {
    doc: { content: 'paragraph+' },
    text: { text: true },
    paragraph: { attrs: {} },
    heading: { attrs: {} },
    ...extra,
  };
}

function createMarkSpec(extra?: Record<string, MarkSpec>): Record<string, MarkSpec> {
  return {
    strong: { attrs: {} },
    em: { attrs: {} },
    ...extra,
  };
}

describe('Schema', () => {
  describe('constructor', () => {
    it('given valid nodes and marks specs, creates Schema instance', () => {
      const schema = new Schema({ nodes: createNodeSpec(), marks: createMarkSpec() });

      expect(schema).toBeInstanceOf(Schema);
    });

    it('given null nodes spec, throws "Schema nodes spec cannot be null"', () => {
      expect(
        () => new Schema({ nodes: null as never, marks: createMarkSpec() })
      ).toThrow('Schema nodes spec cannot be null');
    });

    it('given undefined nodes spec, throws "Schema nodes spec cannot be undefined"', () => {
      expect(
        () => new Schema({ nodes: undefined as never, marks: createMarkSpec() })
      ).toThrow('Schema nodes spec cannot be undefined');
    });

    it('given null marks spec, throws "Schema marks spec cannot be null"', () => {
      expect(
        () => new Schema({ nodes: createNodeSpec(), marks: null as never })
      ).toThrow('Schema marks spec cannot be null');
    });

    it('given no text node in spec, throws', () => {
      expect(
        () =>
          new Schema({
            nodes: { doc: { content: 'paragraph+' }, paragraph: {} },
          })
      ).toThrow("Every schema needs a 'text' type");
    });

    it('given no doc node in spec, throws', () => {
      expect(
        () =>
          new Schema({
            nodes: { text: { text: true }, paragraph: {} },
          })
      ).toThrow("Every schema needs a 'doc' type");
    });

    it('given same name in nodes and marks, throws', () => {
      expect(
        () =>
          new Schema({
            nodes: {
              doc: { content: 'paragraph+' },
              text: { text: true },
              strong: {},
            },
            marks: { strong: {} },
          })
      ).toThrow('strong can not be both a node and a mark');
    });

    it('given node with content expression, sets contentMatch', () => {
      const schema = new Schema({ nodes: createNodeSpec(), marks: createMarkSpec() });

      expect(schema.nodes.doc.contentMatch).toBeInstanceOf(ContentMatch);
    });

    it('given inline node, inlineContent is true', () => {
      const schema = new Schema({
        nodes: createNodeSpec({ span: { inline: true, content: 'text*' } }),
        marks: createMarkSpec(),
      });

      expect(schema.nodes.span.inlineContent).toBe(true);
    });

    it(`given node with marks "", markSet is empty array`, () => {
      const schema = new Schema({
        nodes: createNodeSpec({ span: { content: 'text*', marks: '' } }),
        marks: createMarkSpec(),
      });

      expect(schema.nodes.span.markSet).toEqual([]);
    });

    it('given marks in order, rank reflects insertion order', () => {
      const schema = new Schema({
        nodes: createNodeSpec(),
        marks: {
          em: { attrs: {} },
          strong: { attrs: {} },
        },
      });

      expect(schema.marks.em.rank).toBeLessThan(schema.marks.strong.rank);
    });

    it('given marks with no excludes spec, excluded contains self', () => {
      const schema = new Schema({
        nodes: createNodeSpec(),
        marks: {
          em: { attrs: {} },
          strong: { attrs: {} },
        },
      });

      expect(schema.marks.em.excluded).toContain(schema.marks.em);
    });

    it(`given marks with excludes "", excludes is empty array`, () => {
      const schema = new Schema({
        nodes: createNodeSpec(),
        marks: createMarkSpec({ em: { attrs: {}, excludes: '' }, strong: { attrs: {}, excludes: '' } }),
      });

      expect(schema.marks.em.excluded).toEqual([]);
    });

    it('given no topNode in spec, topNodeType is doc NodeType', () => {
      const schema = new Schema({ nodes: createNodeSpec(), marks: createMarkSpec() });

      expect(schema.topNodeType).toBe(schema.nodes.doc);
    });

    it('given topNode in spec, topNodeType is that NodeType', () => {
      const schema = new Schema({
        nodes: createNodeSpec(),
        marks: createMarkSpec(),
        topNode: 'paragraph',
      });

      expect(schema.topNodeType).toBe(schema.nodes.paragraph);
    });
  });

  describe('text()', () => {
    it('given a string to text(), returns TextNode', () => {
      const schema = new Schema({ nodes: createNodeSpec(), marks: createMarkSpec() });
      const textNode = schema.text('hello');

      expect(textNode).toBeInstanceOf(Node);
    });
  });

  describe('node()', () => {
    it('given a string type to node(), returns Node of that type', () => {
      const schema = new Schema({ nodes: createNodeSpec(), marks: createMarkSpec() });
      const headingNode = schema.node('heading');

      expect(headingNode.type).toBe(schema.nodes.heading);
    });

    it('given unknown string type to node(), throws', () => {
      const schema = new Schema({ nodes: createNodeSpec(), marks: createMarkSpec() });

      expect(() => schema.node('unknown')).toThrow(
        'Unknown node type: "unknown"'
      );
    });
  });

  describe('mark()', () => {
    it('given a string type to mark(), returns Mark', () => {
      const schema = new Schema({ nodes: createNodeSpec(), marks: createMarkSpec() });
      const strongMark = schema.mark('strong');

      expect(strongMark).toBeInstanceOf(Mark);
    });

    it('given unknown string type to mark(), throws', () => {
      const schema = new Schema({ nodes: createNodeSpec(), marks: createMarkSpec() });

      expect(() => schema.mark('unknown')).toThrow(
        'Unknown mark type: "unknown"'
      );
    });
  });

  describe('nodes property', () => {
    it('given valid nodes spec, contains NodeType instance for each spec', () => {
      const schema = new Schema({ nodes: createNodeSpec(), marks: createMarkSpec() });

      expect(schema.nodes.paragraph).toBeInstanceOf(NodeType);
      expect(schema.nodes.heading).toBeInstanceOf(NodeType);

      expect(schema.nodes.paragraph.name).toBe('paragraph');
      expect(schema.nodes.heading.name).toBe('heading');
    });
  });

  describe('marks property', () => {
    test('given valid marks spec, contains MarkType instance for each spec', () => {
      const schema = new Schema({ nodes: createNodeSpec(), marks: createMarkSpec() });

      expect(schema.marks.strong).toBeInstanceOf(MarkType);
      expect(schema.marks.em).toBeInstanceOf(MarkType);

      expect(schema.marks.strong.name).toBe('strong');
      expect(schema.marks.em.name).toBe('em');
    });
  });
});