import { Fragment } from "./Fragment";

describe('Fragment', () => {
  describe('creation', () => {
    it('creates empty fragment', () => {
      const fragment = new Fragment();

      expect(fragment.size).toBe(0);
    });
  });
});
