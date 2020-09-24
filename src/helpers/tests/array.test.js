import { toSentence, filterByCollectionValues } from '../array';

describe('toSentence', () => {
  it('returns empty string for empty list', () => {
    expect(toSentence([])).toEqual('');
  });

  it('returns first value', () => {
    expect(toSentence(['first'])).toEqual('first');
  });

  it('returns both values joined by and', () => {
    expect(toSentence(['first', 'second'])).toEqual('first and second');
  });

  it('returns a sentence', () => {
    expect(toSentence(['first', 'second', 'third'])).toEqual('first, second, and third');
  });

  it('returns both values with specified conjuction', () => {
    expect(toSentence(['first', 'second'], 'or')).toEqual('first or second');
  });

  it('returns a sentence with specified conjunction', () => {
    expect(toSentence(['first', 'second', 'third'], 'or')).toEqual('first, second, or third');
  });
});

describe('filterByCollectionValues', () => {
  const bob = { firstName: 'Bob', lastName: 'Smith', isAwesome: true, isClean: false };
  const steve = { firstName: 'Steve', lastName: 'Smith', isAwesome: false, isClean: false };
  const erica = { firstName: 'Erica', lastName: 'Walker', isAwesome: true, isClean: true };
  const william = { firstName: 'William', lastName: 'Lemmon', isAwesome: true, isClean: true };
  const people = [bob, steve, erica, william];

  it('filters by one passed in filter value', () => {
    const arr = filterByCollectionValues(people, {
      filters: [{ name: 'firstName', value: 'Bob' }],
    });

    expect(arr).toStrictEqual([bob]);
  });

  it('filters regardless of type case', () => {
    const arr = filterByCollectionValues(people, {
      filters: [{ name: 'firstName', value: 'bob' }],
    });

    expect(arr).toStrictEqual([bob]);
  });

  it('filters based on partial match of the passed in filter value', () => {
    const arr = filterByCollectionValues(people, {
      filters: [{ name: 'firstName', value: 'Er' }],
    });

    expect(arr).toStrictEqual([erica]);
  });

  it('returns multiple results when multiple matches are present', () => {
    const arr = filterByCollectionValues(people, {
      filters: [{ name: 'lastName', value: 'Smith' }],
    });

    expect(arr).toStrictEqual([bob, steve]);
  });

  it('filters by multiple passed in filter values', () => {
    const arr = filterByCollectionValues(people, {
      filters: [
        { name: 'lastName', value: 'Smith' },
        { name: 'isAwesome', value: true },
      ],
    });

    expect(arr).toStrictEqual([bob]);
  });

  it('does not filter by values that are undefined', () => {
    const arr = filterByCollectionValues(people, {
      filters: [
        { name: 'firstName', value: undefined },
        { name: 'lastName', value: undefined },
      ],
    });

    expect(arr).toStrictEqual(people);
  });

  it('does not filter by values that are empty strings', () => {
    const arr = filterByCollectionValues(people, {
      filters: [
        { name: 'firstName', value: '' },
        { name: 'lastName', value: 'Smith' },
      ],
    });

    expect(arr).toStrictEqual([bob, steve]);
  });

  it('does not filter by values that are undefined when others are defined', () => {
    const arr = filterByCollectionValues(people, {
      filters: [
        { name: 'firstName', value: undefined },
        { name: 'lastName', value: 'Lemmon' },
      ],
    });

    expect(arr).toStrictEqual([william]);
  });

  it('returns all arr if the filters object is empty', () => {
    expect(filterByCollectionValues(people, { filters: [] })).toEqual(people);
  });
});
