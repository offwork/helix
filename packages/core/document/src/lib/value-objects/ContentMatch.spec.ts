import { ContentMatch } from './ContentMatch';
import { NodeType } from './NodeType';
import { Node } from '../entities/Node';
import { Fragment } from '../entities/Fragment';
import { Edge } from '../interfaces/Edge';

// Test Helpers
function createMockNodeType(
  name = 'paragraph',
  options: { inline?: boolean } = {}
): NodeType {
  return new NodeType(
    name,
    {},
    { attrs: { content: 'text*' }, inline: options.inline }
  );
}

function createMockContentMatch(
  validEnd = true,
  edges: Edge[] = []
): ContentMatch {
  return new ContentMatch(validEnd, edges);
}

function createMockNode(type?: NodeType): Node<Record<string, unknown>> {
  const nodeType = type || createMockNodeType();
  return new Node(nodeType, {});
}

function createMockFragment(
  nodes: Node<Record<string, unknown>>[] = []
): Fragment<Node<Record<string, unknown>>> {
  return nodes.length === 0 ? Fragment.empty() : Fragment.from(nodes);
}

describe('ContentMatch', () => {
  describe('constructor and validation', () => {
    it('creates with validEnd and edges', () => {
      expect(new ContentMatch(false, [])).toBeInstanceOf(ContentMatch);
    });

    it('throws when validEnd is null', () => {
      expect(() => new ContentMatch(null as never, [])).toThrow(
        'ContentMatch validEnd cannot be null'
      );
    });

    it('throws when edges is null', () => {
      expect(() => new ContentMatch(false, null as never)).toThrow(
        'ContentMatch edges cannot be null'
      );
    });

    it('throws when edges is not array', () => {
      expect(() => new ContentMatch(false, '' as never)).toThrow(
        'ContentMatch edges must be array'
      );
    });

    it('throws when edge missing type', () => {
      const mockContentMatch = createMockContentMatch();
      const edge = { next: mockContentMatch };

      expect(() => new ContentMatch(false, [edge as never])).toThrow(
        'ContentMatch edge must have type property'
      );
    });

    it('throws when edge missing next', () => {
      const mockNodeType = createMockNodeType();
      const edge = { type: mockNodeType };

      expect(() => new ContentMatch(false, [edge as never])).toThrow(
        'ContentMatch edge must have next property'
      );
    });

    it('throws when edge.type is not NodeType', () => {
      const mockContentMatch = createMockContentMatch();
      const edge = { type: 'not-a-nodetype', next: mockContentMatch };

      expect(() => new ContentMatch(false, [edge as never])).toThrow(
        'ContentMatch edge.type must be NodeType'
      );
    });

    it('throws when edge.next is not ContentMatch', () => {
      const mockNodeType = createMockNodeType();
      const edge = { type: mockNodeType, next: 'not-a-contentmatch' };

      expect(() => new ContentMatch(false, [edge as never])).toThrow(
        'ContentMatch edge.next must be ContentMatch'
      );
    });
  });

  describe('edge() and edgeCount', () => {
    it('edgeCount returns correct count', () => {
      const mockNodeType = createMockNodeType();
      const emptyMatch = createMockContentMatch();
      const edges = [
        { type: mockNodeType, next: emptyMatch },
        { type: mockNodeType, next: emptyMatch },
      ];
      const match = new ContentMatch(false, edges);

      expect(match.edgeCount).toBe(2);
    });

    it('edge(i) returns correct edge', () => {
      const mockNodeType1 = createMockNodeType('paragraph');
      const mockNodeType2 = createMockNodeType('heading');
      const emptyMatch = createMockContentMatch();
      const edge1 = { type: mockNodeType1, next: emptyMatch };
      const edge2 = { type: mockNodeType2, next: emptyMatch };
      const match = new ContentMatch(false, [edge1, edge2]);

      expect(match.edge(0)).toBe(edge1);
      expect(match.edge(1)).toBe(edge2);
    });

    it('edge(i) throws on negative index', () => {
      const match = createMockContentMatch();

      expect(() => match.edge(-1)).toThrow(
        'ContentMatch edge index cannot be negative'
      );
    });

    it('edge(i) throws on index >= edgeCount', () => {
      const mockNodeType = createMockNodeType();
      const emptyMatch = createMockContentMatch();
      const match = new ContentMatch(false, [
        { type: mockNodeType, next: emptyMatch },
      ]);

      expect(() => match.edge(1)).toThrow(
        'ContentMatch edge index out of bounds'
      );
    });
  });

  describe('validEnd query', () => {
    it('returns true when valid end', () => {
      const match = new ContentMatch(true, []);
      expect(match.validEnd).toBe(true);
    });

    it('returns false when not valid end', () => {
      const mockNodeType = createMockNodeType();
      const emptyMatch = createMockContentMatch();
      const match = new ContentMatch(false, [
        { type: mockNodeType, next: emptyMatch },
      ]);
      expect(match.validEnd).toBe(false);
    });
  });

  describe('empty() factory', () => {
    it('returns match with validEnd=true and no edges', () => {
      const match = ContentMatch.empty;
      expect(match.validEnd).toBe(true);
      expect(match.edgeCount).toBe(0);
    });

    it('returns same instance (singleton)', () => {
      const match1 = ContentMatch.empty;
      const match2 = ContentMatch.empty;
      expect(match1).toBe(match2);
    });
  });

  describe('matchType()', () => {
    it('returns next match when type matches', () => {
      const mockNodeType = createMockNodeType();
      const nextMatch = createMockContentMatch();
      const edge = { type: mockNodeType, next: nextMatch };
      const match = new ContentMatch(false, [edge]);

      const result = match.matchType(mockNodeType);
      expect(result).toBe(nextMatch);
    });

    it('returns null when no match', () => {
      const mockNodeType1 = createMockNodeType('paragraph');
      const mockNodeType2 = createMockNodeType('heading');
      const emptyMatch = createMockContentMatch();
      const match = new ContentMatch(false, [
        { type: mockNodeType1, next: emptyMatch },
      ]);

      const result = match.matchType(mockNodeType2);
      expect(result).toBeNull();
    });

    it('finds correct edge among multiple', () => {
      const mockNodeType1 = createMockNodeType('paragraph');
      const mockNodeType2 = createMockNodeType('heading');
      const match1 = createMockContentMatch();
      const match2 = createMockContentMatch();
      const edges = [
        { type: mockNodeType1, next: match1 },
        { type: mockNodeType2, next: match2 },
      ];
      const match = new ContentMatch(false, edges);

      expect(match.matchType(mockNodeType2)).toBe(match2);
    });

    it('returns null when no edges', () => {
      const match = createMockContentMatch();
      const mockNodeType = createMockNodeType();

      const result = match.matchType(mockNodeType);
      expect(result).toBeNull();
    });

    it('throws when type is null', () => {
      const match = createMockContentMatch();

      expect(() => match.matchType(null as never)).toThrow(
        'ContentMatch matchType parameter cannot be null'
      );
    });

    it('throws when type is not NodeType', () => {
      const match = createMockContentMatch();

      expect(() => match.matchType({} as never)).toThrow(
        'ContentMatch matchType parameter must be NodeType'
      );
    });

    it('does not mutate original', () => {
      const mockNodeType = createMockNodeType();
      const emptyMatch = createMockContentMatch();
      const edge = { type: mockNodeType, next: emptyMatch };
      const match = new ContentMatch(false, [edge]);
      const originalEdgeCount = match.edgeCount;

      match.matchType(mockNodeType);

      expect(match.edgeCount).toBe(originalEdgeCount);
      expect(match.validEnd).toBe(false);
    });
  });

  describe('matchFragment()', () => {
    it('returns same match for empty fragment', () => {
      const mockNodeType = createMockNodeType();
      const emptyMatch = createMockContentMatch();
      const match = new ContentMatch(false, [
        { type: mockNodeType, next: emptyMatch },
      ]);
      const fragment = createMockFragment();

      const result = match.matchFragment(fragment);
      expect(result).toBe(match);
    });

    it('returns next match for single node', () => {
      const mockNodeType = createMockNodeType();
      const nextMatch = createMockContentMatch();
      const edge = { type: mockNodeType, next: nextMatch };
      const match = new ContentMatch(false, [edge]);

      const node = createMockNode(mockNodeType);
      const fragment = createMockFragment([node]);

      const result = match.matchFragment(fragment);
      expect(result).toBe(nextMatch);
    });

    it('returns null on required mismatch', () => {
      const mockNodeType1 = createMockNodeType('paragraph');
      const mockNodeType2 = createMockNodeType('heading');
      const emptyMatch = createMockContentMatch();
      const match = new ContentMatch(false, [
        { type: mockNodeType1, next: emptyMatch },
      ]);

      const node = createMockNode(mockNodeType2);
      const fragment = createMockFragment([node]);

      const result = match.matchFragment(fragment);
      expect(result).toBeNull();
    });

    it('matches multiple nodes sequentially', () => {
      const mockNodeType1 = createMockNodeType('paragraph');
      const mockNodeType2 = createMockNodeType('heading');
      const finalMatch = createMockContentMatch();
      const match2 = new ContentMatch(false, [
        { type: mockNodeType2, next: finalMatch },
      ]);
      const match1 = new ContentMatch(false, [
        { type: mockNodeType1, next: match2 },
      ]);

      const node1 = createMockNode(mockNodeType1);
      const node2 = createMockNode(mockNodeType2);
      const fragment = createMockFragment([node1, node2]);

      const result = match1.matchFragment(fragment);
      expect(result).toBe(finalMatch);
    });

    it('throws when start is negative', () => {
      const match = createMockContentMatch();
      const fragment = createMockFragment();

      expect(() => match.matchFragment(fragment, -1)).toThrow(
        'ContentMatch matchFragment invalid range'
      );
    });

    it('throws when endIndex is less than start', () => {
      const match = createMockContentMatch();
      const fragment = createMockFragment();

      expect(() => match.matchFragment(fragment, 2, 1)).toThrow(
        'ContentMatch matchFragment invalid range'
      );
    });

    it('throws when endIndex exceeds fragment size', () => {
      const match = createMockContentMatch();
      const fragment = createMockFragment([createMockNode()]);

      expect(() => match.matchFragment(fragment, 0, 2)).toThrow(
        'ContentMatch matchFragment invalid range'
      );
    });

    it('returns current match when range is empty and validEnd is true', () => {
      const match = createMockContentMatch(true);
      const fragment = createMockFragment([createMockNode()]);

      const result = match.matchFragment(fragment, 0, 0);
      expect(result).toBe(match);
    });

    it('throws when fragment is null', () => {
      const match = createMockContentMatch();

      expect(() => match.matchFragment(null as never)).toThrow(
        'ContentMatch matchFragment parameter cannot be null'
      );
    });
  });

  describe('equals()', () => {
    it('returns true for same instance', () => {
      const match = createMockContentMatch();
      expect(match.equals(match)).toBe(true);
    });

    it('returns true for same values', () => {
      const mockNodeType = createMockNodeType();
      const nextMatch = createMockContentMatch();
      const edge1 = { type: mockNodeType, next: nextMatch };
      const edge2 = { type: mockNodeType, next: nextMatch };

      const match1 = new ContentMatch(false, [edge1]);
      const match2 = new ContentMatch(false, [edge2]);

      expect(match1.equals(match2)).toBe(true);
    });

    it('returns false for different validEnd', () => {
      const match1 = new ContentMatch(true, []);
      const match2 = new ContentMatch(false, []);
      expect(match1.equals(match2)).toBe(false);
    });

    it('returns false for different edge count', () => {
      const mockNodeType = createMockNodeType();
      const emptyMatch = createMockContentMatch();
      const match1 = new ContentMatch(false, [
        { type: mockNodeType, next: emptyMatch },
      ]);
      const match2 = new ContentMatch(false, []);
      expect(match1.equals(match2)).toBe(false);
    });

    it('returns false for different edge types', () => {
      const mockNodeType1 = createMockNodeType('paragraph');
      const mockNodeType2 = createMockNodeType('heading');
      const emptyMatch = createMockContentMatch();
      const match1 = new ContentMatch(false, [
        { type: mockNodeType1, next: emptyMatch },
      ]);
      const match2 = new ContentMatch(false, [
        { type: mockNodeType2, next: emptyMatch },
      ]);
      expect(match1.equals(match2)).toBe(false);
    });

    it('returns false when other is null', () => {
      const match = createMockContentMatch();
      expect(match.equals(null as never)).toBe(false);
    });
  });

  describe('defaultType', () => {
    it('returns null when edges array is empty', () => {
      const match = new ContentMatch(true, []);
      expect(match.defaultType()).toBeNull();
    });

    it("returns first edge's type when edges exist", () => {
      const typeA = createMockNodeType('heading');
      const typeB = createMockNodeType('paragraph');
      const nextMatch = new ContentMatch(true, []);
      const edges = [
        { type: typeA, next: nextMatch },
        { type: typeB, next: nextMatch },
      ];
      const match = new ContentMatch(false, edges);

      expect(match.defaultType()).toBe(typeA);
    });

    it('skips text type and returns first non-text type', () => {
      const realTextType = new NodeType('text', {}, { attrs: {}, text: true });
      const paragraphType = createMockNodeType('paragraph');
      const nextMatch = new ContentMatch(true, []);
      const edges = [
        { type: realTextType, next: nextMatch },
        { type: paragraphType, next: nextMatch },
      ];
      const match = new ContentMatch(false, edges);

      expect(match.defaultType()).toBe(paragraphType);
    });
  });

  describe('compatible(other)', () => {
    it('given same edge type, returns true', () => {
      const sharedType = createMockNodeType('paragraph');
      const nextMatch = createMockContentMatch();
      const match1 = new ContentMatch(false, [
        { type: sharedType, next: nextMatch },
      ]);
      const match2 = new ContentMatch(false, [
        { type: sharedType, next: nextMatch },
      ]);

      expect(match1.compatible(match2)).toBe(true);
    });

    it('given null or undefined parameter, returns false', () => {
      const match = createMockContentMatch();

      expect(match.compatible(null as never)).toBe(false);
      expect(match.compatible(undefined as never)).toBe(false);
    });
  });

  describe('fillBefore(after, toEnd, startIndex)', () => {
    it('given matching fragment, returns empty fragment', () => {
      const paragraphType = createMockNodeType('paragraph');
      const mockFragment = createMockFragment([new Node(paragraphType, {})]);
      const nextMatch = new ContentMatch(true, []);
      const match = createMockContentMatch(false, [
        { type: paragraphType, next: nextMatch },
      ]);

      const result = match.fillBefore(mockFragment, false);

      expect(result).toBeInstanceOf(Fragment);
      expect(result?.size).toBe(0);
    });

    it('given non-matching fragment with fillable gap, returns filled fragment', () => {
      const headingType = createMockNodeType('heading');
      const paragraphType = createMockNodeType('paragraph');

      const finalMatch = new ContentMatch(true, []);
      const match2 = new ContentMatch(false, [
        { type: paragraphType, next: finalMatch },
      ]);
      const match1 = new ContentMatch(false, [
        { type: headingType, next: match2 },
      ]);

      const result = match1.fillBefore(
        Fragment.from([new Node(paragraphType, {})]),
        false
      );

      expect(result).toBeInstanceOf(Fragment);
      expect(result?.childCount).toBe(1);
      expect(result?.child(0).type).toBe(headingType);
    });

    it('given toEnd true and match reaches valid end, returns filled fragment', () => {
      const headingType = createMockNodeType('heading');

      const finalMatch = new ContentMatch(true, []);
      const match = new ContentMatch(false, [
        { type: headingType, next: finalMatch },
      ]);

      const result = match.fillBefore(Fragment.empty(), true);

      expect(result).toBeInstanceOf(Fragment);
      expect(result?.childCount).toBe(1);
      expect(result?.child(0).type).toBe(headingType);
    });

    it('given toEnd true and match does not reach valid end, returns null', () => {
      const headingType = createMockNodeType('heading');
      const deadEnd = new ContentMatch(false, []);
      const match = new ContentMatch(false, [
        { type: headingType, next: deadEnd },
      ]);

      const result = match.fillBefore(Fragment.empty(), true);

      expect(result).toBeNull();
    });

    it('given null after parameter, throws error', () => {
      const match = createMockContentMatch();

      expect(() => match.fillBefore(null as never, false)).toThrow(
        'ContentMatch fillBefore after parameter cannot be null'
      );
    });

    it('given multiple nodes needed to fill, returns fragment with all nodes', () => {
      const headingType = createMockNodeType('heading');
      const paragraphType = createMockNodeType('paragraph');

      const finalMatch = new ContentMatch(true, []);
      const match2 = new ContentMatch(false, [
        { type: paragraphType, next: finalMatch },
      ]);
      const match1 = new ContentMatch(false, [
        { type: headingType, next: match2 },
      ]);

      const result = match1.fillBefore(Fragment.empty(), true);

      expect(result).toBeInstanceOf(Fragment);
      expect(result?.childCount).toBe(2);
      expect(result?.child(0).type).toBe(headingType);
      expect(result?.child(1).type).toBe(paragraphType);
    });

    it('given startIndex greater than 0, skips initial fragment children', () => {
      const headingType = createMockNodeType('heading');
      const paragraphType = createMockNodeType('paragraph');

      const finalMatch = new ContentMatch(true, []);
      const start = new ContentMatch(false, [
        { type: paragraphType, next: finalMatch },
      ]);

      const fragment = createMockFragment([
        new Node(headingType, {}),
        new Node(paragraphType, {}),
      ]);

      const result = start.fillBefore(fragment, false, 1);

      expect(result).toBeInstanceOf(Fragment);
      expect(result?.childCount).toBe(0);
    });

    it('given branching graph where first edge fails, explores second edge', () => {
      const headingType = createMockNodeType('heading');
      const paragraphType = createMockNodeType('paragraph');

      const deadEnd = new ContentMatch(false, []);
      const validEnd = new ContentMatch(true, []);

      const start = new ContentMatch(false, [
        { type: headingType, next: deadEnd },
        { type: paragraphType, next: validEnd },
      ]);

      const result = start.fillBefore(Fragment.empty(), true);

      expect(result).toBeInstanceOf(Fragment);
      expect(result?.childCount).toBe(1);
      expect(result?.child(0).type).toBe(paragraphType);
    });
  });

  describe('findWrapping(target)', () => {
    it('given target directly matches current state, returns empty array', () => {
      const headingType = createMockNodeType('heading');

      const nextMatch = new ContentMatch(false, []);

      const match = new ContentMatch(false, [
        { type: headingType, next: nextMatch },
      ]);

      expect(match.findWrapping(headingType)).toEqual([]);
    });

    it('given target matches through one wrapper, returns wrapper array', () => {
      const targetType = createMockNodeType('blockquote');
      const wrappingType = createMockNodeType('paragraph');

      const wrapperContentMatch = new ContentMatch(true, [
        { type: targetType, next: new ContentMatch(true, []) },
      ]);

      wrappingType.contentMatch = wrapperContentMatch;

      const match = new ContentMatch(false, [
        { type: wrappingType, next: wrapperContentMatch },
      ]);

      expect(match.findWrapping(targetType)).toEqual([wrappingType]);
    });

    it('given no wrapping path exists, returns null', () => {
      const targetType = createMockNodeType('blockquote');
      const otherType = createMockNodeType('paragraph');

      const match = new ContentMatch(false, [
        { type: otherType, next: new ContentMatch(false, []) },
      ]);

      expect(match.findWrapping(targetType)).toBeNull();
    });

    it('given target is null, throws error', () => {
      const match = new ContentMatch(false, [
        {
          type: createMockNodeType('paragraph'),
          next: new ContentMatch(false, []),
        },
      ]);

      expect(() => match.findWrapping(null as never)).toThrow(
        'ContentMatch findWrapping parameter cannot be null'
      );
    });

    it('given multiple depth wrapping needed, returns correct chain', () => {
      const targetType = createMockNodeType('blockquote');
      const innerType = createMockNodeType('section');
      const outerType = createMockNodeType('article');

      const innerContentMatch = new ContentMatch(true, [
        { type: targetType, next: new ContentMatch(true, []) },
      ]);
      innerType.contentMatch = innerContentMatch;

      const outerContentMatch = new ContentMatch(true, [
        { type: innerType, next: new ContentMatch(true, []) },
      ]);
      outerType.contentMatch = outerContentMatch;

      const match = new ContentMatch(false, [
        { type: outerType, next: new ContentMatch(false, []) },
      ]);

      expect(match.findWrapping(targetType)).toEqual([outerType, innerType]);
    });
  });
});
