export const rekey = (obj, nextKey) =>
  Object.keys(obj).reduce(
    (acc, key) => ({ ...acc, [obj[key][nextKey]]: { ...obj[key], key } }),
    {},
  );

export const toCollection = obj =>
  Object.keys(obj).reduce((acc, key) => [...acc, { ...obj[key], key }], []);

/**
 * Gets the first key within an object based on the passed in value.
 * Mainly useful when dealing with an object with known, unique key-value pairs.
 *
 * @param {object} object object to find relevant keys by value
 * @param {any} value value by which to find relevant object key
 */
export const getKeyByValue = (object, value) => {
  return Object.keys(object).find(key => object[key] === value);
};
