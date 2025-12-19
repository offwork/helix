import { Node } from '../entities/Node';
import { ResolvedPos } from './ResolvedPos';

const node = {} as Node;

describe('ResolvedPos', () => {
  describe('constructor', () => {
    it('given valid parameters, creates ResolvedPos instance', () => {
      const resolvedPos = new ResolvedPos(1, node, 5);

      expect(resolvedPos).toBeInstanceOf(ResolvedPos);
      expect(resolvedPos.pos).toBe(1);
      expect(resolvedPos.doc).toBe(node);
      expect(resolvedPos.depth).toBe(5);
    });

    it('given negative pos, throws "ResolvedPos pos cannot be negative"', () => {
      expect(() => new ResolvedPos(-1, node, 5)).toThrow(
        'ResolvedPos pos cannot be negative'
      );
    });

    it('given null pos, throws "ResolvedPos pos cannot be null"', () => {
      expect(() => new ResolvedPos(null as never, node, 5)).toThrow(
        'ResolvedPos pos cannot be null'
      );
    });

    it('given undefined pos, throws "ResolvedPos pos cannot be undefined"', () => {
      expect(() => new ResolvedPos(undefined as never, node, 5)).toThrow(
        'ResolvedPos pos cannot be undefined'
      );
    });

    it('given null doc, throws "ResolvedPos doc cannot be null"', () => {
      expect(() => new ResolvedPos(1, null as never, 5)).toThrow(
        'ResolvedPos doc cannot be null'
      );
    });

    it('given undefined doc, throws "ResolvedPos doc cannot be undefined"', () => {
      expect(() => new ResolvedPos(1, undefined as never, 5)).toThrow(
        'ResolvedPos doc cannot be undefined'
      );
    });

    it('given negative depth, throws "ResolvedPos depth cannot be negative"', () => {
      expect(() => new ResolvedPos(1, node, -2)).toThrow(
        'ResolvedPos depth cannot be negative'
      );
    });

    it('given null depth, throws "ResolvedPos depth cannot be null"', () => {
      expect(() => new ResolvedPos(1, node, null as never)).toThrow(
        'ResolvedPos depth cannot be null'
      );
    });

    it('given undefined depth, throws "ResolvedPos depth cannot be undefined"', () => {
      expect(() => new ResolvedPos(1, node, undefined as never)).toThrow(
        'ResolvedPos depth cannot be undefined'
      );
    });
  });

  describe('equals', () => {
    it('given ResolvedPos with same pos and doc, returns true', () => {
      const resolvedPos1 = new ResolvedPos(1, node, 5);
      const resolvedPos2 = new ResolvedPos(1, node, 5);

      expect(resolvedPos1.equals(resolvedPos2)).toBe(true);
    });

    it('given ResolvedPos with different pos, returns false', () => {
      const resolvedPos1 = new ResolvedPos(1, node, 5);
      const resolvedPos2 = new ResolvedPos(3, node, 5);

      expect(resolvedPos1.equals(resolvedPos2)).toBe(false);
    });

    it('given ResolvedPos with different doc, returns false', () => {
      const node2 = {} as Node;
      const resolvedPos1 = new ResolvedPos(1, node, 5);
      const resolvedPos2 = new ResolvedPos(1, node2, 4);

      expect(resolvedPos1.equals(resolvedPos2)).toBe(false);
    });

    it('given null parameter, throws "ResolvedPos equals parameter cannot be null"', () => {
      const resolvedPos = new ResolvedPos(1, node, 5);

      expect(() => resolvedPos.equals(null as never)).toThrow(
        'ResolvedPos equals parameter cannot be null'
      );
    });
  });
});
