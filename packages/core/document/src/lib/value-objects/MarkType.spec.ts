import { MarkSpec } from '../interfaces/SchemaSpec';
import { MarkType } from './MarkType';

const mockSchema = {} as never;
const spec: MarkSpec = { attrs: {} };

describe('MarkType', () => {
  describe('constructor', () => {
    it('given valid parameters, returns instance of MarkType', () => {
      const markType = new MarkType('paragraph', mockSchema, spec);
      expect(markType).toBeInstanceOf(MarkType);
      expect(markType.name).toBe('paragraph');
    });

    it('given empty name string, throws "MarkType name cannot be empty"', () => {
      expect(() => new MarkType('', mockSchema, spec)).toThrow(
        'MarkType name cannot be empty'
      );
    });

    it('given whitespace-only name, throws "MarkType name cannot be empty"', () => {
      expect(() => new MarkType('  ', mockSchema, spec)).toThrow(
        'MarkType name cannot be empty'
      );
    });

    it('given null name, throws "MarkType name cannot be empty"', () => {
      expect(() => new MarkType(null as never, mockSchema, spec)).toThrow(
        'MarkType name cannot be empty'
      );
    });

    it('given undefined name, throws "MarkType name cannot be empty"', () => {
      expect(() => new MarkType(undefined as never, mockSchema, spec)).toThrow(
        'MarkType name cannot be empty'
      );
    });

    it('given null schema, throws "MarkType schema cannot be null"', () => {
      expect(() => new MarkType('paragraph', null as never, spec)).toThrow(
        'MarkType schema cannot be null'
      );
    });

    it('given undefined schema, throws "MarkType schema cannot be undefined"', () => {
      expect(() => new MarkType('paragraph', undefined as never, spec)).toThrow(
        'MarkType schema cannot be undefined'
      );
    });

    it('given null spec, throws "MarkType spec cannot be null"', () => {
      expect(
        () => new MarkType('paragraph', mockSchema, null as never)
      ).toThrow('MarkType spec cannot be null');
    });

    it('given undefined spec, throws "MarkType spec cannot be undefined"', () => {
      expect(
        () => new MarkType('paragraph', mockSchema, undefined as never)
      ).toThrow('MarkType spec cannot be undefined');
    });
  });

  describe('equals', () => {
    it('given MarkTypes with same name, returns true', () => {
      const markType1 = new MarkType('strong', mockSchema, spec);
      const markType2 = new MarkType('strong', mockSchema, {
        attrs: { color: 'blue' },
      });

      expect(markType1.equals(markType2)).toBe(true);
    });

    it('given MarkTypes with different names, returns false', () => {
      const markType1 = new MarkType('strong', mockSchema, spec);
      const markType2 = new MarkType('em', mockSchema, {
        attrs: { color: 'blue' },
      });

      expect(markType1.equals(markType2)).toBe(false);
    });

    it('given null parameter, throws "MarkType equals parameter cannot be null"', () => {
      const markType1 = new MarkType('strong', mockSchema, spec);

      expect(() => markType1.equals(null as never)).toThrow(
        'MarkType equals parameter cannot be null'
      );
    });
  });
});
