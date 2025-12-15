import { NodeSpec } from '../interfaces/SchemaSpec';
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
});
