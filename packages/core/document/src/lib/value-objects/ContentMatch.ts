import { Fragment } from '../entities/Fragment';
import { Node } from '../entities/Node';
import { Edge } from '../interfaces/Edge';
import { NodeType } from './NodeType';

export class ContentMatch {
  private static _empty: ContentMatch;

  constructor(
    public readonly validEnd: boolean,
    public readonly edges: Edge[]
  ) {
    this.validateParameters(validEnd, edges);
  }

  static get empty(): ContentMatch {
    if (!ContentMatch._empty) {
      ContentMatch._empty = new ContentMatch(true, []);
    }
    return ContentMatch._empty;
  }

  get edgeCount(): number {
    return this.edges.length;
  }

  edge(index: number): Edge {
    if (index < 0) {
      throw new Error('ContentMatch edge index cannot be negative');
    }

    if (index >= this.edgeCount) {
      throw new Error('ContentMatch edge index out of bounds');
    }

    return this.edges[index];
  }

  matchType(type: NodeType): ContentMatch | null {
    if (type === null) {
      throw new Error('ContentMatch matchType parameter cannot be null');
    }

    if (!(type instanceof NodeType)) {
      throw new Error('ContentMatch matchType parameter must be NodeType');
    }

    for (const edge of this.edges) {
      if (edge.type === type) {
        return edge.next;
      }
    }

    return null;
  }

  matchFragment(
    fragment: Fragment<Node>,
    start = 0,
    end?: number
  ): ContentMatch | null {
    if (fragment === null) {
      throw new Error('ContentMatch matchFragment parameter cannot be null');
    }

    const endIndex = end ?? fragment.childCount;

    if (start < 0 || endIndex < start || endIndex > fragment.childCount) {
      throw new Error('ContentMatch matchFragment invalid range');
    }

    // Empty fragment always returns current match
    if (fragment.size === 0) return this;

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let current: ContentMatch | null = this;
    let index = start;

    while (index < endIndex && current) {
      const node = fragment.child(index);
      current = current.matchType(node.type);
      index++;
    }

    // If we reached a valid end, return the match.
    // Otherwise, the fragment ended prematurely return null
    return current && current.validEnd ? current : null;
  }

  equals(other: ContentMatch): boolean {
    if (other === null) {
      return false;
    }

    if (this === other) {
      return true;
    }

    if (this.validEnd !== other.validEnd) {
      return false;
    }

    if (this.edgeCount !== other.edgeCount) {
      return false;
    }

    for (let i = 0; i < this.edgeCount; i++) {
      const thisEdge = this.edges[i];
      const otherEdge = other.edges[i];

      if (
        thisEdge.type !== otherEdge.type ||
        thisEdge.next !== otherEdge.next
      ) {
        return false;
      }
    }

    return true;
  }

  defaultType(): NodeType | null {
    return this.edges.length > 0 ? this.edges[0].type : null;
  }

  compatible(other: ContentMatch): boolean {
    if (other === null || other === undefined) return false;

    for (const edge of this.edges) {
      for (const otherEdge of other.edges) {
        if (edge.type === otherEdge.type) return true;
      }
    }

    return false;
  }

  /* fillBefore(after: Fragment, toEnd = false, startIndex = 0): Fragment | null {
    let seen: ContentMatch[] = [this];
    function search(
      match: ContentMatch,
      types: readonly NodeType[]
    ): Fragment | null {
      let finished = match.matchFragment(after, startIndex);
      if (finished && (!toEnd || finished.validEnd))
        return Fragment.from(types.map((tp) => tp.createAndFill()!));

      for (let i = 0; i < match.next.length; i++) {
        let { type, next } = match.next[i];
        if (
          !(type.isText || type.hasRequiredAttrs()) &&
          seen.indexOf(next) == -1
        ) {
          seen.push(next);
          let found = search(next, types.concat(type));
          if (found) return found;
        }
      }
      return null;
    }

    return search(this, []);
  } */

  fillBefore(
    after: Fragment<Node>,
    toEnd = false,
    startIndex = 0
  ): Fragment<Node> | null {
    if (after === null) {
      throw new Error('ContentMatch fillBefore after parameter cannot be null');
    }

    return ContentMatch.doFill(this, after, toEnd);
  }

  private static doFill(
    match: ContentMatch,
    after: Fragment<Node>,
    toEnd: boolean
  ): Fragment<Node> | null {
    const filled: Node[] = [];

    for (;;) {
      const matched = match.matchFragment(after);
      if (matched && (!toEnd || matched.validEnd)) {
        return Fragment.from(filled);
      }

      const defaultNodeType = match.defaultType();
      if (!defaultNodeType) return null;

      filled.push(defaultNodeType.create());
      const next = match.matchType(defaultNodeType);
      if (!next) return null;

      match = next;
    }
  }

  private validateParameters(validEnd: boolean, edges: Edge[]): void {
    if (validEnd === null) {
      throw new Error('ContentMatch validEnd cannot be null');
    }

    if (edges === null) {
      throw new Error('ContentMatch edges cannot be null');
    }

    if (!Array.isArray(edges)) {
      throw new Error('ContentMatch edges must be array');
    }

    for (const edge of edges) {
      if (!edge.type) {
        throw new Error('ContentMatch edge must have type property');
      }

      if (!edge.next) {
        throw new Error('ContentMatch edge must have next property');
      }

      if (!(edge.type instanceof NodeType)) {
        throw new Error('ContentMatch edge.type must be NodeType');
      }

      if (!(edge.next instanceof ContentMatch)) {
        throw new Error('ContentMatch edge.next must be ContentMatch');
      }
    }
  }
}
