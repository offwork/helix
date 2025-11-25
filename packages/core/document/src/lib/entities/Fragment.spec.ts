import { Fragment } from './Fragment';
import { Node } from './Node';

describe('Fragment', () => {
  describe('creation', () => {
    test('creates empty fragment', () => {
      const fragment = Fragment.empty<Node>();

      expect(fragment).toBeInstanceOf(Fragment);
      expect(fragment.size).toBe(0);
    });
  });
});
