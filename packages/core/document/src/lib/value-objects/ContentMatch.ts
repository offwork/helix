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

  matchFragment(fragment: Fragment<Node>): ContentMatch | false | null {
    if (fragment === null) {
      throw new Error('ContentMatch matchFragment parameter cannot be null');
    }

    // Empty fragment always returns current match
    if (fragment.size === 0) {
      return this;
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let match: ContentMatch = this;

    for (let i = 0; i < fragment.size; i++) {
      const node = fragment.child(i);
      const next = match.matchType(node.type);

      if (next === null) {
        return null; // Required element couldn't fit
      }

      match = next;
    }

    // If we reached a valid end, return the match
    if (match.validEnd) {
      return match;
    }

    // Otherwise, the fragment ended prematurely
    return false;
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
