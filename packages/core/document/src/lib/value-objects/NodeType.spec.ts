import { NodeSpec } from '../interfaces/SchemaSpec';
import { NodeType } from './NodeType';

describe('NodeType', () => {
  describe('Contruction', () => {
    it('constructor, given valid spec, stores name', () => {
      const spec: NodeSpec = { name: 'paragraph' };
      const mockSchema = {} as never;

      const nodeType = new NodeType('paragraph', mockSchema, spec);

      expect(nodeType.name).toBe('paragraph');
    });

    it('constructor, given valid spec, stores schema reference', () => {
      const spec: NodeSpec = { name: 'paragraph' };
      const mockSchema = {} as never;

      const nodeType = new NodeType('paragraph', mockSchema, spec);

      expect(nodeType.schema).toBe(mockSchema);
    });

    it('constructor, given valid spec, stores spec', () => {
      const spec: NodeSpec = { name: 'paragraph', attrs: { level: 1 } };
      const mockSchema = {} as never;

      const nodeType = new NodeType('paragraph', mockSchema, spec);

      expect(nodeType.spec).toBe(spec);
    });
  });
});
