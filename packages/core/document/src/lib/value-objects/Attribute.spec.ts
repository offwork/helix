import { Attribute } from './Attribute';

describe('Attribute', () => {
  describe('constructor', () => {
    it('giben valid spec, creates Attribute instance', () => {
      const spec = {};
      const attribute = new Attribute(spec);
      expect(attribute).toBeInstanceOf(Attribute);
    });

    it('given spec with default, sets hasDefault to true', () => {
      const spec = { default: 'defaultValue' };
      const attribute = new Attribute(spec);
      expect(attribute.hasDefault).toBe(true);
    });

    it('given spec null, throws error', () => {
      expect(() => new Attribute(null as never)).toThrow(
        'Attribute spec cannot be null'
      );
    });

    it('given spec undefined, throws error', () => {
      expect(() => new Attribute(undefined as never)).toThrow(
        'Attribute spec cannot be undefined'
      );
    });
  });

  describe('isRequired', () => {
    it('given spec without default key, returns true', () => {
      const spec = {};
      const attribute = new Attribute(spec);
      expect(attribute.isRequired).toBe(true);
    });
  });
});
