import { rekey, toCollection } from '../object';

describe('object', () => {
  describe('rekey', () => {
    it('returns empty object for empty object', () => {
      expect(rekey({}, 'test')).toEqual({});
    });

    it('returns object with new key', () => {
      const obj = {
        a: { label: 'A' },
        b: { label: 'B' },
        c: { label: 'C' }
      };

      expect(rekey(obj, 'label')).toEqual({
        A: { key: 'a', label: 'A' },
        B: { key: 'b', label: 'B' },
        C: { key: 'c', label: 'C' }
      });
    });
  });

  describe('toCollection', () => {
    it('returns empty array for empty object', () => {
      expect(toCollection({})).toEqual([]);
    });

    it('returns collection', () => {
      const obj = {
        one: { label: 'One' },
        two: { label: 'Two' }
      };

      expect(toCollection(obj)).toEqual([
        { key: 'one', label: 'One' },
        { key: 'two', label: 'Two' }
      ]);
    });
  });
});
