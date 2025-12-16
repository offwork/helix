import { Node } from './Node';
import { NodeType } from '../value-objects/NodeType';

interface ParagraphAttrs {
  align: 'left' | 'center' | 'right';
}

const mockSchema = {} as never;
const spec = { attrs: {} };

describe('Node', () => {
  it('should create a node with type and attrs', () => {
    const type = new NodeType('paragraph', mockSchema, spec);
    const attrs: ParagraphAttrs = { align: 'left' };

    const node = new Node<ParagraphAttrs>(type, attrs);

    expect(node.type.name).toBe('paragraph');
    expect(node.attrs.align).toBe('left');
  });

  it('should create a node with empty attrs', () => {
    const type = new NodeType('paragraph', mockSchema, spec);
    const attrs = {};

    const node = new Node(type, attrs);

    expect(node.type.name).toBe('paragraph');
    expect(node.attrs).toEqual({});
  });
});
