import { OrderedMap } from './OrderedMap';

describe('OrderedMap', () => {
  describe('from', () => {
    it('given a plain object, creates an OrderedMap instance', () => {
      const map = OrderedMap.from({ a: 1 });
      expect(map).toBeInstanceOf(OrderedMap);
    });

    it('given an existing OrderedMap instance, returns it as-is', () => {
      const original = OrderedMap.from({ a: 1 });
      const result = OrderedMap.from(original);
      expect(result).toBe(original);
    });
  });

  describe('get', () => {
    it('given an existing key, returns its value', () => {
      const map = OrderedMap.from({ a: 1 });
      expect(map.get('a')).toBe(1);
    });

    it('given a missing key, returns undefined', () => {
      const map = OrderedMap.from({ a: 1 });
      expect(map.get('missing')).toBeUndefined();
    });
  });

  describe('forEach', () => {
    it('given a map with multiple entries, iterates in insertion order', () => {
      const map = OrderedMap.from({ a: 1, b: 2 });
      const seen: [string, number][] = [];

      map.forEach((key, value) => seen.push([key, value]));

      expect(seen).toEqual([['a', 1], ['b', 2]]);
    });
  });
});