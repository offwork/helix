import { ContentMatch } from '../value-objects/ContentMatch';
import { Fragment } from './Fragment';
import { Node } from './Node';
import { TextNode } from './TextNode';
import { Schema } from '../services/Schema';
import {
  paragraphType,
  textType,
  headingType,
  createMockNodeType,
  defaultMockSchema,
  createNodeSpec,
  createSchemaSpec,
  createMarkSpec,
  imageType,
} from '../../testing';

describe('Fragment', () => {
  describe('creation', () => {
    it('creates empty fragment', () => {
      const fragment = Fragment.empty();

      expect(fragment).toBeInstanceOf(Fragment);
      expect(fragment.childCount).toBe(0);
    });

    it('creates fragment with nodes', () => {
      const node1 = new Node(paragraphType, {
        text: 'Hello',
      });
      const node2 = new Node(paragraphType, {
        text: 'World',
      });

      const fragment = Fragment.from([node1, node2]);

      expect(fragment).toBeInstanceOf(Fragment);
      expect(fragment.childCount).toBe(2);
    });
  });

  describe('child access', () => {
    it('accesses child by valid index', () => {
      const node1 = new Node(paragraphType, {
        text: 'Hello',
      });
      const node2 = new Node(paragraphType, {
        text: 'World',
      });

      const fragment = Fragment.from([node1, node2]);

      expect(fragment.child(0)).toBe(node1);
      expect(fragment.child(1)).toBe(node2);
    });

    it('throws on negative index', () => {
      const fragment = Fragment.from([
        new Node(paragraphType, {
          text: 'Hello',
        }),
      ]);

      expect(() => fragment.child(-1)).toThrow(
        'Index out of bounds: -1 (size: 1)'
      );
    });

    it('throws on index >= size', () => {
      const fragment = Fragment.from([
        new Node(paragraphType, {
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
      const node1 = new Node(paragraphType, {
        text: 'First',
      });
      const node2 = new Node(paragraphType, {
        text: 'Middle',
      });
      const node3 = new Node(paragraphType, {
        text: 'Last',
      });

      const fragment = Fragment.from([node1, node2, node3]);

      expect(fragment.firstChild).toBe(node1);
      expect(fragment.lastChild).toBe(node3);
    });

    it('returns undefined for empty fragment', () => {
      const fragment = Fragment.empty();

      expect(fragment.firstChild).toBeUndefined();
      expect(fragment.lastChild).toBeUndefined();
    });

    it('returns same node when fragment has one child', () => {
      const node = new Node(paragraphType, {
        text: 'Only',
      });
      const fragment = Fragment.from([node]);

      expect(fragment.firstChild).toBe(node);
      expect(fragment.lastChild).toBe(node);
    });
  });

  describe('forEach', () => {
    it('iterates over all children', () => {
      const node1 = new Node(paragraphType, {
        text: 'First',
      });
      const node2 = new Node(paragraphType, {
        text: 'Second',
      });
      const node3 = new Node(paragraphType, {
        text: 'Third',
      });
      const fragment = Fragment.from([node1, node2, node3]);

      const visited: Node[] = [];
      fragment.forEach((node) => {
        visited.push(node as Node);
      });

      expect(visited).toEqual([node1, node2, node3]);
    });

    it('does nothing for empty fragment', () => {
      const fragment = Fragment.empty();

      const visited: Node[] = [];
      fragment.forEach((node) => {
        visited.push(node as Node);
      });

      expect(visited).toEqual([]);
    });

    it('given non-empty content, calls callback with node offset and index', () => {
      const node1 = new Node(paragraphType, {
        text: 'First',
      });
      const node2 = new Node(paragraphType, {
        text: 'Second',
      });
      const content = Fragment.from([node1, node2]);

      const callback = jest.fn();
      content.forEach(callback);

      expect(callback).toHaveBeenCalledWith(node1, 0, 0);
    });
  });

  describe('slice', () => {
    it('slices fragment with valid range', () => {
      const node1 = new Node(paragraphType, {
        text: 'First',
      });
      const node2 = new Node(paragraphType, {
        text: 'Second',
      });
      const node3 = new Node(paragraphType, {
        text: 'Third',
      });
      const node4 = new Node(paragraphType, {
        text: 'Fourth',
      });
      const fragment = Fragment.from([node1, node2, node3, node4]);

      const slice = fragment.slice(1, 3);

      expect(slice.childCount).toBe(2);
      expect(slice.child(0)).toBe(node2);
      expect(slice.child(1)).toBe(node3);
    });

    it('slices from start when from is 0', () => {
      const node1 = new Node(paragraphType, {
        text: 'First',
      });
      const node2 = new Node(paragraphType, {
        text: 'Second',
      });
      const fragment = Fragment.from([node1, node2]);

      const slice = fragment.slice(0, 1);

      expect(slice.childCount).toBe(1);
      expect(slice.child(0)).toBe(node1);
    });

    it('slices to end when to equals size', () => {
      const node1 = new Node(paragraphType, {
        text: 'First',
      });
      const node2 = new Node(paragraphType, {
        text: 'Second',
      });
      const fragment = Fragment.from([node1, node2]);

      const slice = fragment.slice(1, 2);

      expect(slice.childCount).toBe(1);
      expect(slice.child(0)).toBe(node2);
    });

    it('returns empty fragment when from equals to', () => {
      const node = new Node(paragraphType, {
        text: 'First',
      });
      const fragment = Fragment.from([node]);

      const slice = fragment.slice(0, 0);

      expect(slice.size).toBe(0);
    });

    it('throws when from is negative', () => {
      const fragment = Fragment.from([
        new Node(paragraphType, {
          text: 'First',
        }),
      ]);

      expect(() => fragment.slice(-1, 1)).toThrow(
        'Invalid slice range: [-1, 1) (size: 1)'
      );
    });

    it('throws when to exceeds size', () => {
      const fragment = Fragment.from([
        new Node(paragraphType, {
          text: 'First',
        }),
      ]);

      expect(() => fragment.slice(0, 5)).toThrow(
        'Invalid slice range: [0, 5) (size: 1)'
      );
    });

    it('throws when from is greater than to', () => {
      const fragment = Fragment.from([
        new Node(paragraphType, {
          text: 'First',
        }),
      ]);

      expect(() => fragment.slice(1, 0)).toThrow(
        'Invalid slice range: [1, 0) (size: 1)'
      );
    });
  });

  describe('childCount', () => {
    it('returns 0 for empty fragment', () => {
      const fragment = Fragment.empty();
      expect(fragment.childCount).toBe(0);
    });

    it('returns number of children', () => {
      const nodes = [
        new Node(paragraphType, {}),
        new Node(paragraphType, {}),
        new Node(paragraphType, {}),
      ];
      const fragment = Fragment.from(nodes);
      expect(fragment.childCount).toBe(3);
    });
  });

  describe('equals', () => {
    it('given both empty, returns true', () => {
      const fragment1 = Fragment.empty();
      const fragment2 = Fragment.empty();

      expect(fragment1.equals(fragment2)).toBe(true);
    });

    it('given different children, returns false', () => {
      const node1 = new Node(paragraphType, {
        text: 'First',
      });
      const node2 = new Node(headingType, {
        text: 'Middle',
      });
      const node3 = new Node(paragraphType, {
        text: 'Last',
      });

      const fragment1 = Fragment.from([node1, node2]);
      const fragment2 = Fragment.from([node1, node3]);

      expect(fragment1.equals(fragment2)).toBe(false);
    });

    it('given structurally equal children with different refs, returns true', () => {
      const nodeA = new Node(paragraphType, { text: 'Hello' });
      const nodeB = new Node(paragraphType, { text: 'Hello' });

      const fragment1 = Fragment.from([nodeA]);
      const fragment2 = Fragment.from([nodeB]);

      expect(fragment1.equals(fragment2)).toBe(true);
    });

    it('given null, throws error', () => {
      const fragment = Fragment.empty();
      expect(() => fragment.equals(null as never)).toThrow(
        'Fragment equals parameter cannot be null'
      );
    });

    it('given undefined, throws error', () => {
      const fragment = Fragment.empty();
      expect(() => fragment.equals(undefined as never)).toThrow(
        'Fragment equals parameter cannot be undefined'
      );
    });
  });

  describe('findIndex', () => {
    it('given pos is 0, returns index 0 and offset 0', () => {
      const node1 = new Node(paragraphType, {
        text: 'First',
      });

      const node2 = new Node(paragraphType, {
        text: 'Second',
      });

      const fragment = Fragment.from([node1, node2]);

      const result = fragment.findIndex(0);

      expect(result).toEqual({ index: 0, offset: 0 });
    });
  });

  it('given pos equals size, returns index childCount and offset size', () => {
    const node1 = new Node(paragraphType, {
      text: 'First',
    });

    const node2 = new Node(paragraphType, {
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
    const node1 = new Node(paragraphType, {
      text: 'First',
    });

    const node2 = new Node(paragraphType, {
      text: 'Second',
    });

    const fragment = Fragment.from([node1, node2]);

    const result = fragment.findIndex(1);

    expect(result).toEqual({ index: 0, offset: 0 });
  });

  it('given negative pos, throws RangeError', () => {
    const fragment = Fragment.empty();

    expect(() => fragment.findIndex(-1)).toThrow(
      'Invalid position: -1 (size: 0)'
    );
  });

  it('given pos greater than size, throws RangeError', () => {
    const node = new Node(paragraphType, {
      text: 'First',
    });
    const fragment = Fragment.from([node]);

    expect(() => fragment.findIndex(100)).toThrow(
      'Invalid position: 100 (size: 2)'
    );
  });

  describe('cut', () => {
    it('given full range, returns this', () => {
      const node1 = new Node(paragraphType, {
        text: 'First',
      });

      const node2 = new Node(paragraphType, {
        text: 'Second',
      });

      const fragment = Fragment.from([node1, node2]);

      const result = fragment.cut(0, fragment.size);

      expect(result).toBe(fragment);
    });

    it('given empty range (from equals to), returns empty fragment', () => {
      const node1 = new Node(paragraphType, {
        text: 'First',
      });

      const node2 = new Node(paragraphType, {
        text: 'Second',
      });

      const fragment = Fragment.from([node1, node2]);

      const result = fragment.cut(1, 1);

      expect(result.size).toBe(0);
    });

    it('given partial range covering one child, returns that child', () => {
      const node1 = new Node(paragraphType, {
        text: 'First',
      });

      const node2 = new Node(paragraphType, {
        text: 'Second',
      });

      const fragment = Fragment.from([node1, node2]);

      const result = fragment.cut(0, 2);

      expect(result.childCount).toBe(1);
      expect(result.child(0)).toBe(node1);
    });

    it('given range cutting into non-text node, returns trimmed node', () => {
      const child1 = new Node(paragraphType, {});
      const child2 = new Node(paragraphType, {});
      const parent = new Node(
        paragraphType,
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

    it('given range cutting into a text node, returns trimmed text node', () => {
      const text = new TextNode(textType, {}, 'helloworld');
      const fragment = Fragment.from([text]);

      const result = fragment.cut(2, 7);

      expect((result.child(0) as TextNode).text).toBe('llowo');
    });
  });

  describe('append', () => {
    it('given other empty, returns this', () => {
      const node1 = new Node(paragraphType, {});

      const fragment = Fragment.from([node1]);

      const result = fragment.append(Fragment.empty());

      expect(result).toBe(fragment);
    });

    it('given this empty, returns other', () => {
      const empty = Fragment.empty();
      const other = Fragment.from([new Node(paragraphType, {})]);

      const result = empty.append(other);

      expect(result).toBe(other);
    });

    it('given both non-empty fragments, returns new fragment with all children', () => {
      const node1 = new Node(paragraphType, {});
      const node2 = new Node(paragraphType, {});
      const node3 = new Node(paragraphType, {});
      const node4 = new Node(paragraphType, {});

      const fragment1 = Fragment.from([node1, node2]);
      const fragment2 = Fragment.from([node3, node4]);

      const result = fragment1.append(fragment2);

      expect(Fragment.from([node1, node2, node3, node4]).equals(result)).toBe(
        true
      );
    });

    it('given two fragments ending and starting with same-markup text nodes, merges them', () => {
      const text1 = new TextNode(textType, {}, 'Hello');
      const text2 = new TextNode(textType, {}, ' World');

      const frag1 = Fragment.from([text1]);
      const frag2 = Fragment.from([text2]);

      const result = frag1.append(frag2);

      expect(result.childCount).toBe(1);
    });
  });

  describe('maybeChild()', () => {
    it('given valid index, returns child node', () => {
      const node1 = new Node(paragraphType, {
        text: 'First',
      });
      const node2 = new Node(paragraphType, {
        text: 'Second',
      });

      const fragment = Fragment.from([node1, node2]);

      expect(fragment.maybeChild(0)).toBe(node1);
    });

    it('given invalid index, returns null', () => {
      const node1 = new Node(paragraphType, {
        text: 'First',
      });

      const fragment = Fragment.from([node1]);

      expect(fragment.maybeChild(-1)).toBeNull();
    });
  });

  describe('nodesBetween()', () => {
    it('given range covering all children, visits all nodes', () => {
      const node1 = new Node(paragraphType, {
        text: 'First',
      });
      const node2 = new Node(paragraphType, {
        text: 'Second',
      });

      const fragment = Fragment.from([node1, node2]);

      const visited: Node[] = [];
      fragment.nodesBetween(0, fragment.size, (node) => {
        visited.push(node as Node);
      });

      expect(visited).toEqual([node1, node2]);
    });

    it("given callback returning false, does not descend into that node's children", () => {
      const child1 = new Node(paragraphType, {
        text: 'Child 1',
      });
      const child2 = new Node(paragraphType, {
        text: 'Child 2',
      });
      const parent = new Node(
        paragraphType,
        {},
        Fragment.from([child1, child2]),
        []
      );
      const fragment = Fragment.from([parent]);

      const visited: Node[] = [];
      fragment.nodesBetween(0, fragment.size, (node) => {
        visited.push(node as Node);
        return false;
      });

      expect(visited).toEqual([parent]);
    });
  });

  describe('descendants()', () => {
    it('given non-empty fragment, visits all descendant nodes', () => {
      const child1 = new Node(paragraphType, {
        text: 'Child 1',
      });
      const child2 = new Node(paragraphType, {
        text: 'Child 2',
      });
      const parent = new Node(
        paragraphType,
        {},
        Fragment.from([child1, child2]),
        []
      );
      const fragment = Fragment.from([parent]);

      const visited: Node[] = [];
      fragment.descendants((node) => {
        visited.push(node as Node);
      });

      expect(visited).toEqual([parent, child1, child2]);
    });
  });

  describe('textBetween()', () => {
    it('given text nodes in range, returns concatenated text', () => {
      const textNode1 = new TextNode(textType, {}, 'Hello');
      const textNode2 = new TextNode(textType, {}, 'World');
      const fragment = Fragment.from([textNode1, textNode2]);

      const result = fragment.textBetween(0, fragment.size);

      expect(result).toBe('HelloWorld');
    });

    it('given block separator, inserts separator between blocks', () => {
      const text1 = new TextNode(textType, {}, 'Hello');
      const text2 = new TextNode(textType, {}, 'World');

      const para1 = new Node(paragraphType, {}, Fragment.from([text1]), []);
      const para2 = new Node(paragraphType, {}, Fragment.from([text2]), []);

      const fragment = Fragment.from([para1, para2]);

      expect(fragment.textBetween(0, fragment.size, '\n')).toBe('Hello\nWorld');
    });

    it('given leaf node with leafText, includes leaf text', () => {
      const nodeType = createMockNodeType(
        'image',
        defaultMockSchema,
        createNodeSpec()
      );
      nodeType.contentMatch = ContentMatch.empty;
      const fragment = Fragment.from([new Node(nodeType, {})]);

      expect(fragment.textBetween(0, fragment.size, null, '[image]')).toBe(
        '[image]'
      );
    });
  });

  describe('replaceChild()', () => {
    it('given valid index and new node, returns new fragment with replaced child', () => {
      const node1 = new Node(paragraphType, {});
      const node2 = new Node(paragraphType, {});
      const newNode = new Node(headingType, {});

      const fragment = Fragment.from([node1, node2]);
      const result = fragment.replaceChild(0, newNode);

      expect(result.child(0)).toBe(newNode);
    });

    it('given same node at index, returns same reference', () => {
      const node1 = new Node(paragraphType, {});
      const fragment = Fragment.from([node1]);

      expect(fragment.replaceChild(0, node1)).toBe(fragment);
    });
  });

  describe('addToStart', () => {
    it('given a node, returns new fragment with node prepended', () => {
      const node1 = new Node(paragraphType, {});
      const node2 = new Node(paragraphType, {});
      const fragment = Fragment.from([node2]);

      expect(fragment.addToStart(node1).child(0)).toBe(node1);
    });
  });

  describe('addToEnd', () => {
    it('given a node, returns new fragment with node appended', () => {
      const node1 = new Node(paragraphType, {});
      const node2 = new Node(paragraphType, {});
      const fragment = Fragment.from([node1]);

      expect(fragment.addToEnd(node2).child(1)).toBe(node2);
    });
  });

  describe('toString', () => {
    it('given non-empty fragment, returns string representation', () => {
      const node = new Node(paragraphType, {});
      const fragment = Fragment.from([node]);

      expect(fragment.toString()).toBe(`<${node}>`);
    });
  });

  describe('toJSON', () => {
    it('given empty fragment, returns null', () => {
      const fragment = Fragment.empty();

      expect(fragment.toJSON()).toBeNull();
    });

    it('given non-empty fragment, returns array of node json objects', () => {
      const node1 = new Node(paragraphType, {});
      const node2 = new Node(paragraphType, {});
      const fragment = Fragment.from([node1, node2]);

      expect(fragment.toJSON()).toEqual([
        { type: node1.type.name },
        { type: node2.type.name },
      ]);
    });
  });

  describe('fromJSON', () => {
    it('given null, returns empty fragment', () => {
      const schema = new Schema({
        nodes: createSchemaSpec(),
        marks: createMarkSpec(),
      });

      expect(Fragment.fromJSON(schema, null)).toEqual(Fragment.empty());
    });

    it('given array of node json objects, returns fragment with corresponding nodes', () => {
      const schema = new Schema({
        nodes: createSchemaSpec(),
        marks: createMarkSpec(),
      });

      const node1 = schema.node('paragraph');
      const node2 = schema.node('paragraph');

      const json = [node1.toJSON(), node2.toJSON()];

      expect(Fragment.fromJSON(schema, json)).toEqual(
        Fragment.from([node1, node2])
      );
    });
  });

  describe('findDiffStart', () => {
    describe('when comparing empty fragment to empty fragment', () => {
      it('returns null', () => {
        const fragment = Fragment.empty();
        const otherFragment = Fragment.empty();

        expect(fragment.findDiffStart(otherFragment)).toBeNull();
      });
    });

    describe('when comparing identical fragments', () => {
      it('returns null', () => {
        const node = new Node(paragraphType, {});
        const fragment = Fragment.from([node]);
        const otherFragment = Fragment.from([node]);

        expect(fragment.findDiffStart(otherFragment)).toBeNull();
      });
    });

    describe('when first child markup differs', () => {
      it('returns 0', () => {
        const paragraphNode = new Node(paragraphType, {});
        const headingNode = new Node(headingType, {});
        const fragment = Fragment.from([paragraphNode]);
        const otherFragment = Fragment.from([headingNode]);

        expect(fragment.findDiffStart(otherFragment)).toEqual(0);
      });
    });

    describe('when second child differs', () => {
      it('returns size of first child', () => {
        const paragraph = new Node(paragraphType, {});
        const heading = new Node(headingType, {});
        const image = new Node(imageType, {});
        const fragment = Fragment.from([paragraph, heading]);
        const other = Fragment.from([paragraph, image]);

        expect(fragment.findDiffStart(other)).toBe(paragraph.nodeSize);
      });
    });

    describe('when other is shorter', () => {
      it('returns divergence position', () => {
        const firstChild = new Node(paragraphType, {});
        const secondChild = new Node(headingType, {});
        const fragment = Fragment.from([firstChild, secondChild]);
        const other = Fragment.from([firstChild]);

        expect(fragment.findDiffStart(other)).toBe(firstChild.nodeSize);
      });
    });

    describe('given pos offset', () => {
      it('returns offset divergence position', () => {
        const paragraph = new Node(paragraphType, {});
        const heading = new Node(headingType, {});
        const fragment = Fragment.from([paragraph]);
        const other = Fragment.from([heading]);

        expect(fragment.findDiffStart(other, 10)).toBe(10);
      });
    });

    describe('when text nodes differ mid-text', () => {
      it('returns char position', () => {
        const textA = new TextNode(textType, {}, 'hello', []);
        const textB = new TextNode(textType, {}, 'helXo', []);
        const fragment = Fragment.from([textA]);
        const other = Fragment.from([textB]);

        expect(fragment.findDiffStart(other)).toBe(3);
      });
    });

    describe('when child nodes have inner content that differs', () => {
      it('returns inner position', () => {
        const innerA = new Node(paragraphType, {});
        const innerB = new Node(headingType, {});
        const parentA = new Node(paragraphType, {}, Fragment.from([innerA]));
        const parentB = new Node(paragraphType, {}, Fragment.from([innerB]));
        const fragment = Fragment.from([parentA]);
        const other = Fragment.from([parentB]);

        expect(fragment.findDiffStart(other)).toBe(1);
      });
    });

  });
});
