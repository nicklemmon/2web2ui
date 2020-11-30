import { rekey, toCollection, getKeyByValue } from '../object';

describe('object', () => {
  describe('rekey', () => {
    it('returns empty object for empty object', () => {
      expect(rekey({}, 'test')).toEqual({});
    });

    it('returns object with new key', () => {
      const obj = {
        a: { label: 'A' },
        b: { label: 'B' },
        c: { label: 'C' },
      };

      expect(rekey(obj, 'label')).toEqual({
        A: { key: 'a', label: 'A' },
        B: { key: 'b', label: 'B' },
        C: { key: 'c', label: 'C' },
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
        two: { label: 'Two' },
      };

      expect(toCollection(obj)).toEqual([
        { key: 'one', label: 'One' },
        { key: 'two', label: 'Two' },
      ]);
    });
  });

  describe('getKeyByValue', () => {
    it('returns the key according to the passed in object and value', () => {
      const myObject = {
        hello: 'friend',
        you: 'are',
        number: 1,
        orNumber: 1,
      };

      expect(getKeyByValue(myObject, 'friend')).toBe('hello');
      expect(getKeyByValue(myObject, 'are')).toBe('you');
      expect(getKeyByValue(myObject, 1)).toBe('number');
      expect(getKeyByValue(myObject, 1)).not.toBe('orNumber');
    });
  });
});
