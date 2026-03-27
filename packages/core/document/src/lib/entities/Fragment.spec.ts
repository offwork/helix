import { Mark } from '../value-objects/Mark';
import { NodeType } from '../value-objects/NodeType';
import { Fragment } from './Fragment';
import { Node } from './Node';

const mockSchema = {} as never;
const spec = { attrs: {} };

function createMarks(...types: string[]): Mark<Record<string, unknown>>[] {
  return types.map((type) => new Mark(type, {}));
}

describe('Fragment', () => {
  describe('creation', () => {
    it('creates empty fragment', () => {
      const fragment = Fragment.empty<Node>();

      expect(fragment).toBeInstanceOf(Fragment);
      expect(fragment.childCount).toBe(0);
    });

    it('creates fragment with nodes', () => {
      const node1 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'Hello',
      });
      const node2 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'World',
      });

      const fragment = Fragment.from([node1, node2]);

      expect(fragment).toBeInstanceOf(Fragment);
      expect(fragment.childCount).toBe(2);
    });
  });

  describe('child access', () => {
    it('accesses child by valid index', () => {
      const node1 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'Hello',
      });
      const node2 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'World',
      });

      const fragment = Fragment.from([node1, node2]);

      expect(fragment.child(0)).toBe(node1);
      expect(fragment.child(1)).toBe(node2);
    });

    it('throws on negative index', () => {
      const fragment = Fragment.from([
        new Node(new NodeType('paragraph', mockSchema, spec), {
          text: 'Hello',
        }),
      ]);

      expect(() => fragment.child(-1)).toThrow(
        'Index out of bounds: -1 (size: 1)'
      );
    });

    it('throws on index >= size', () => {
      const fragment = Fragment.from([
        new Node(new NodeType('paragraph', mockSchema, spec), {
          text: 'Hello',
        }),
      ]);

      expect(() => fragment.child(1)).toThrow(
        'Index out of bounds: 1 (size: 1)'
      );
      expect(() => fragment.child(5)).toThrow(
        'Index out of bounds: 5 (size: 1)'
      );
    });
  });

  describe('firstChild and lastChild', () => {
    it('returns first and last child', () => {
      const node1 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'First',
      });
      const node2 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'Middle',
      });
      const node3 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'Last',
      });

      const fragment = Fragment.from([node1, node2, node3]);

      expect(fragment.firstChild).toBe(node1);
      expect(fragment.lastChild).toBe(node3);
    });

    it('returns undefined for empty fragment', () => {
      const fragment = Fragment.empty<Node>();

      expect(fragment.firstChild).toBeUndefined();
      expect(fragment.lastChild).toBeUndefined();
    });

    it('returns same node when fragment has one child', () => {
      const node = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'Only',
      });
      const fragment = Fragment.from([node]);

      expect(fragment.firstChild).toBe(node);
      expect(fragment.lastChild).toBe(node);
    });
  });

  describe('forEach', () => {
    it('iterates over all children', () => {
      const node1 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'First',
      });
      const node2 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'Second',
      });
      const node3 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'Third',
      });
      const fragment = Fragment.from([node1, node2, node3]);

      const visited: Node[] = [];
      fragment.forEach((node) => {
        visited.push(node);
      });

      expect(visited).toEqual([node1, node2, node3]);
    });

    it('passes index to callback', () => {
      const node1 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'First',
      });
      const node2 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'Second',
      });
      const fragment = Fragment.from([node1, node2]);

      const indces: number[] = [];
      fragment.forEach((node, index) => {
        indces.push(index);
      });

      expect(indces).toEqual([0, 1]);
    });

    it('does nothing for empty fragment', () => {
      const fragment = Fragment.empty<Node>();

      const visited: Node[] = [];
      fragment.forEach((node) => {
        visited.push(node);
      });

      expect(visited).toEqual([]);
    });
  });

  describe('slice', () => {
    it('slices fragment with valid range', () => {
      const node1 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'First',
      });
      const node2 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'Second',
      });
      const node3 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'Third',
      });
      const node4 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'Fourth',
      });
      const fragment = Fragment.from([node1, node2, node3, node4]);

      const slice = fragment.slice(1, 3);

      expect(slice.childCount).toBe(2);
      expect(slice.child(0)).toBe(node2);
      expect(slice.child(1)).toBe(node3);
    });

    it('slices from start when from is 0', () => {
      const node1 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'First',
      });
      const node2 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'Second',
      });
      const fragment = Fragment.from([node1, node2]);

      const slice = fragment.slice(0, 1);

      expect(slice.childCount).toBe(1);
      expect(slice.child(0)).toBe(node1);
    });

    it('slices to end when to equals size', () => {
      const node1 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'First',
      });
      const node2 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'Second',
      });
      const fragment = Fragment.from([node1, node2]);

      const slice = fragment.slice(1, 2);

      expect(slice.childCount).toBe(1);
      expect(slice.child(0)).toBe(node2);
    });

    it('returns empty fragment when from equals to', () => {
      const node = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'First',
      });
      const fragment = Fragment.from([node]);

      const slice = fragment.slice(0, 0);

      expect(slice.size).toBe(0);
    });

    it('throws when from is negative', () => {
      const fragment = Fragment.from([
        new Node(new NodeType('paragraph', mockSchema, spec), {
          text: 'First',
        }),
      ]);

      expect(() => fragment.slice(-1, 1)).toThrow(
        'Invalid slice range: [-1, 1) (size: 1)'
      );
    });

    it('throws when to exceeds size', () => {
      const fragment = Fragment.from([
        new Node(new NodeType('paragraph', mockSchema, spec), {
          text: 'First',
        }),
      ]);

      expect(() => fragment.slice(0, 5)).toThrow(
        'Invalid slice range: [0, 5) (size: 1)'
      );
    });

    it('throws when from is greater than to', () => {
      const fragment = Fragment.from([
        new Node(new NodeType('paragraph', mockSchema, spec), {
          text: 'First',
        }),
      ]);

      expect(() => fragment.slice(1, 0)).toThrow(
        'Invalid slice range: [1, 0) (size: 1)'
      );
    });
  });

  describe('size', () => {
    it('given text node, returns sum of nodeSize values', () => {
      const textType = new NodeType('text', {}, { text: true });
      const node = new Node(textType, {}, undefined, undefined, 'Hello World');
      const fragment = Fragment.from([node]);

      expect(fragment.size).toBe(11);
    });
  });

  describe('childCount', () => {
    it('returns 0 for empty fragment', () => {
      const fragment = Fragment.empty<Node>();
      expect(fragment.childCount).toBe(0);
    });

    it('returns number of children', () => {
      const nodeType = new NodeType('paragraph', {}, {});
      const nodes = [
        new Node(nodeType, {}),
        new Node(nodeType, {}),
        new Node(nodeType, {}),
      ];
      const fragment = Fragment.from(nodes);
      expect(fragment.childCount).toBe(3);
    });
  });

  describe('equals', () => {
    it('given both empty, returns true', () => {
      const fragment1 = Fragment.empty<Node>();
      const fragment2 = Fragment.empty<Node>();

      expect(fragment1.equals(fragment2)).toBe(true);
    });

    it('given different children, returns false', () => {
      const node1 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'First',
      });
      const node2 = new Node(new NodeType('heading', mockSchema, spec), {
        text: 'Middle',
      });
      const node3 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'Last',
      });

      const fragment1 = Fragment.from([node1, node2]);
      const fragment2 = Fragment.from([node1, node3]);

      expect(fragment1.equals(fragment2)).toBe(false);
    });

    it('given structurally equal children with different refs, returns true', () => {
      const sharedType = new NodeType('paragraph', mockSchema, spec);

      const nodeA = new Node(sharedType, { text: 'Hello' });
      const nodeB = new Node(sharedType, { text: 'Hello' });

      const fragment1 = Fragment.from([nodeA]);
      const fragment2 = Fragment.from([nodeB]);

      expect(fragment1.equals(fragment2)).toBe(true);
    });

    it('given null, throws error', () => {
      const fragment = Fragment.empty<Node>();
      expect(() => fragment.equals(null as never)).toThrow(
        'Fragment equals parameter cannot be null'
      );
    });

    it('given undefined, throws error', () => {
      const fragment = Fragment.empty<Node>();
      expect(() => fragment.equals(undefined as never)).toThrow(
        'Fragment equals parameter cannot be undefined'
      );
    });
  });

  describe('findIndex', () => {
    it('given pos is 0, returns index 0 and offset 0', () => {
      const node1 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'First',
      });

      const node2 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'Second',
      });

      const fragment = Fragment.from([node1, node2]);

      const result = fragment.findIndex(0);

      expect(result).toEqual({ index: 0, offset: 0 });
    });
  });

  it('given pos equals size, returns index childCount and offset size', () => {
    const node1 = new Node(new NodeType('paragraph', mockSchema, spec), {
      text: 'First',
    });

    const node2 = new Node(new NodeType('paragraph', mockSchema, spec), {
      text: 'Second',
    });

    const fragment = Fragment.from([node1, node2]);

    const result = fragment.findIndex(fragment.size);

    expect(result).toEqual({
      index: fragment.childCount,
      offset: fragment.size,
    });
  });

  it('given pos inside first child, returns index 0 and offset 0', () => {
    const node1 = new Node(new NodeType('paragraph', mockSchema, spec), {
      text: 'First',
    });

    const node2 = new Node(new NodeType('paragraph', mockSchema, spec), {
      text: 'Second',
    });

    const fragment = Fragment.from([node1, node2]);

    const result = fragment.findIndex(1);

    expect(result).toEqual({ index: 0, offset: 0 });
  });

  it('given negative pos, throws RangeError', () => {
    const fragment = Fragment.empty<Node>();

    expect(() => fragment.findIndex(-1)).toThrow(
      'Invalid position: -1 (size: 0)'
    );
  });

  it('given pos greater than size, throws RangeError', () => {
    const node = new Node(new NodeType('paragraph', mockSchema, spec), {
      text: 'First',
    });
    const fragment = Fragment.from([node]);

    expect(() => fragment.findIndex(100)).toThrow(
      'Invalid position: 100 (size: 2)'
    );
  });

  describe('cut', () => {
    it('given full range, returns this', () => {
      const node1 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'First',
      });

      const node2 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'Second',
      });

      const fragment = Fragment.from([node1, node2]);

      const result = fragment.cut(0, fragment.size);

      expect(result).toBe(fragment);
    });

    it('given empty range (from equals to), returns empty fragment', () => {
      const node1 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'First',
      });

      const node2 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'Second',
      });

      const fragment = Fragment.from([node1, node2]);

      const result = fragment.cut(1, 1);

      expect(result.size).toBe(0);
    });

    it('given partial range covering one child, returns that child', () => {
      const node1 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'First',
      });

      const node2 = new Node(new NodeType('paragraph', mockSchema, spec), {
        text: 'Second',
      });

      const fragment = Fragment.from([node1, node2]);

      const result = fragment.cut(0, 2);

      expect(result.childCount).toBe(1);
      expect(result.child(0)).toBe(node1);
    });

    it('given range cutting into text node, returns trimmed text node', () => {
      const textType = new NodeType('text', mockSchema, { text: true });
      const node = new Node(textType, {}, undefined, undefined, 'Hello World');
      const fragment = Fragment.from([node]);

      const result = fragment.cut(6, 11);

      expect(result.childCount).toBe(1);
      expect(result.child(0).text).toBe('World');
    });

    it('given range cutting into non-text node, returns trimmed node', () => {
      const child1 = new Node(new NodeType('paragraph', mockSchema, spec), {});
      const child2 = new Node(new NodeType('paragraph', mockSchema, spec), {});
      const parent = new Node(
        new NodeType('paragraph', mockSchema, spec),
        {},
        Fragment.from([child1, child2]),
        []
      );
      const fragment = Fragment.from([parent]);

      const result = fragment.cut(1, 3);

      expect(result.childCount).toBe(1);
      expect(result.child(0).content.childCount).toBe(1);
      expect(result.child(0).content.child(0)).toBe(child1);
    });
  });

  describe('append', () => {
    it('given other empty, returns this', () => {
      const node1 = new Node(new NodeType('paragraph', mockSchema, spec), {});

      const fragment = Fragment.from([node1]);

      const result = fragment.append(Fragment.empty<Node>());

      expect(result).toBe(fragment);
    });

    it('given this empty, returns other', () => {
      const empty = Fragment.empty<Node>();
      const other = Fragment.from([
        new Node(new NodeType('paragraph', mockSchema, spec), {}),
      ]);

      const result = empty.append(other);

      expect(result).toBe(other);
    });

    it('given both non-empty fragments, returns new fragment with all children', () => {
      const node1 = new Node(new NodeType('paragraph', mockSchema, spec), {});
      const node2 = new Node(new NodeType('paragraph', mockSchema, spec), {});
      const node3 = new Node(new NodeType('paragraph', mockSchema, spec), {});
      const node4 = new Node(new NodeType('paragraph', mockSchema, spec), {});

      const fragment1 = Fragment.from([node1, node2]);
      const fragment2 = Fragment.from([node3, node4]);

      const result = fragment1.append(fragment2);

      expect(Fragment.from([node1, node2, node3, node4]).equals(result)).toBe(
        true
      );
    });

    it('given last child of this and first child of other are text nodes with same marks, merges them into single node', () => {
      const textType = new NodeType('text', mockSchema, { text: true });
      const node1 = new Node(textType, {}, undefined, undefined, 'Hello ');
      const node2 = new Node(textType, {}, undefined, undefined, 'World');

      const fragment1 = Fragment.from([node1]);
      const fragment2 = Fragment.from([node2]);

      const result = fragment1.append(fragment2);
      const expected = Fragment.from([
        new Node(textType, {}, undefined, undefined, 'Hello World'),
      ]);

      expect(expected.equals(result)).toBe(true);
    });

    it('given last child of this and first child of other are text nodes with different marks, keeps them separate', () => {
      const textType = new NodeType('text', mockSchema, { text: true });
      const node1 = new Node(
        textType,
        {},
        undefined,
        createMarks('bold'),
        'Hello '
      );
      const node2 = new Node(
        textType,
        {},
        undefined,
        createMarks('italic'),
        'World'
      );

      const fragment1 = Fragment.from([node1]);
      const fragment2 = Fragment.from([node2]);

      const result = fragment1.append(fragment2);
      const expected = Fragment.from([
        new Node(textType, {}, undefined, createMarks('bold'), 'Hello '),
        new Node(textType, {}, undefined, createMarks('italic'), 'World'),
      ]);

      expect(expected.equals(result)).toBe(true);
    });
  });
});
