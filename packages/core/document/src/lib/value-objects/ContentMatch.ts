import { Fragment } from '../entities/Fragment';
import { Node } from '../entities/Node';
import { Edge } from '../interfaces/Edge';
import { NodeType } from './NodeType';

type Active = {
  match: ContentMatch;
  type: NodeType | null;
  via: Active | null;
};
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

    // If we reached a valid end, return the match. Otherwise, return null
    return current;
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
    for (const edge of this.edges) {
      if (!(edge.type.isText || edge.type.hasRequiredAttrs())) {
        return edge.type;
      }
    }
    return null;
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

  fillBefore(
    after: Fragment<Node>,
    toEnd = false,
    startIndex = 0
  ): Fragment<Node> | null {
    if (after === null) {
      throw new Error('ContentMatch fillBefore after parameter cannot be null');
    }

    const seen: ContentMatch[] = [this];

    const search = (
      match: ContentMatch,
      types: NodeType[]
    ): Fragment<Node> | null => {
      const finished = match.matchFragment(after, startIndex);
      if (finished && (!toEnd || finished.validEnd)) {
        return Fragment.from(types.map((tp) => tp.create()));
      }

      for (const edge of match.edges) {
        if (
          !(edge.type.isText || edge.type.hasRequiredAttrs()) &&
          seen.indexOf(edge.next) === -1
        ) {
          seen.push(edge.next);
          const found = search(edge.next, types.concat(edge.type));
          if (found) return found;
        }
      }
      return null;
    };

    return search(this, []);
  }

  findWrapping(target: NodeType): NodeType[] | null {
    if (target === null) {
      throw new Error('ContentMatch findWrapping parameter cannot be null');
    }

    const seen: Record<string, boolean> = {};
    const active: Active[] = [{ match: this, type: null, via: null }];

    while (active.length) {
      const current = active?.shift();
      if (!current) continue;

      if (current.match.matchType(target)) {
        const result: NodeType[] = [];
        let obj: Active | null = current;
        while (obj?.type) {
          result.push(obj.type);
          obj = obj.via;
        }
        return result.reverse();
      }

      for (const edge of current.match.edges) {
        if (
          !edge.type.isLeaf &&
          !edge.type.hasRequiredAttrs() &&
          !(edge.type.name in seen) &&
          (!current.type || edge.next.validEnd) &&
          edge.type.contentMatch
        ) {
          active.push({
            match: edge.type.contentMatch,
            type: edge.type,
            via: current,
          });
          seen[edge.type.name] = true;
        }
      }
    }

    return null;
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
