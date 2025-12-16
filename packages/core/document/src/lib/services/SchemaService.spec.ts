import { MarkSpec, NodeSpec } from '../interfaces/SchemaSpec';
import { MarkType } from '../value-objects/MarkType';
import { NodeType } from '../value-objects/NodeType';
import { SchemaService } from './SchemaService';

const nodeSpec: Record<string, NodeSpec> = {
  paragraph: { attrs: {} },
  heading: { attrs: {} },
};

const markSpec: Record<string, MarkSpec> = {
  strong: { attrs: {} },
  em: { attrs: {} },
};

describe('SchemaService', () => {
  describe('constructor', () => {
    it('given valid nodes and marks specs, creates SchemaService instance', () => {
      const schema = new SchemaService(nodeSpec, markSpec);

      expect(schema).toBeInstanceOf(SchemaService);
    });

    it('given null nodes spec, throws "SchemaService nodes spec cannot be null"', () => {
      expect(() => new SchemaService(null as never, markSpec)).toThrow(
        'SchemaService nodes spec cannot be null'
      );
    });

    it('given undefined nodes spec, throws "SchemaService nodes spec cannot be undefined"', () => {
      expect(() => new SchemaService(undefined as never, markSpec)).toThrow(
        'SchemaService nodes spec cannot be undefined'
      );
    });

    it('given null marks spec, throws "SchemaService marks spec cannot be null"', () => {
      expect(() => new SchemaService(nodeSpec, null as never)).toThrow(
        'SchemaService marks spec cannot be null'
      );
    });

    it('given undefined marks spec, throws "SchemaService marks spec cannot be undefined"', () => {
      expect(() => new SchemaService(nodeSpec, undefined as never)).toThrow(
        'SchemaService marks spec cannot be undefined'
      );
    });
  });

  describe('nodes property', () => {
    it('given valid nodes spec, contains NodeType instance for each spec', () => {
      const schema = new SchemaService(nodeSpec, markSpec);

      expect(schema.nodes.paragraph).toBeInstanceOf(NodeType);
      expect(schema.nodes.heading).toBeInstanceOf(NodeType);

      expect(schema.nodes.paragraph.name).toBe('paragraph');
      expect(schema.nodes.heading.name).toBe('heading');
    });
  });

  describe('marks property', () => {
    test('given valid marks spec, contains MarkType instance for each spec', () => {
      const schema = new SchemaService(nodeSpec, markSpec);

      expect(schema.marks.strong).toBeInstanceOf(MarkType);
      expect(schema.marks.em).toBeInstanceOf(MarkType);

      expect(schema.marks.strong.name).toBe('strong');
      expect(schema.marks.em.name).toBe('em');
    });
  });
});
