import { NodeType } from '../value-objects/NodeType';
import { Fragment } from './Fragment';
import { Node } from './Node';

describe('Fragment', () => {
  describe('creation', () => {
    it('creates empty fragment', () => {
      const fragment = Fragment.empty<Node>();

      expect(fragment).toBeInstanceOf(Fragment);
      expect(fragment.size).toBe(0);
    });

    it('creates fragment with nodes', () => {
      const node1 = new Node(new NodeType('paragraph'), { text: 'Hello' });
      const node2 = new Node(new NodeType('paragraph'), { text: 'World' });

      const fragment = Fragment.from([node1, node2]);

      expect(fragment).toBeInstanceOf(Fragment);
      expect(fragment.size).toBe(2);
    });
  });
});
