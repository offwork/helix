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

  describe('validate', () => {
    describe('given string "number" and a non-number value', () => {
      it('throws RangeError', () => {
        const attribute = new Attribute({ validate: 'number' });

        expect(() => attribute.validate?.('hello')).toThrow(RangeError);
      });
    });

    describe('given string "number" and a number value', () => {
      it('does not throw', () => {
        const attribute = new Attribute({ validate: 'number' });
        expect(() => attribute.validate?.(42)).not.toThrow();
      });
    });

    describe('given string "null" and null value', () => {
      it('does not throw', () => {
        const attribute = new Attribute({ validate: 'null' });
        expect(() => attribute.validate?.(null)).not.toThrow();
      });
    });

    describe('given string "number|string" and a string value', () => {
      it('does not throw', () => {
        const attribute = new Attribute({ validate: 'number|string' });
        expect(() => attribute.validate?.('hello')).not.toThrow();
      });
    });
  });
});
