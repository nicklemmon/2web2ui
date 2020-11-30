export const rekey = (obj, nextKey) => (
  Object.keys(obj).reduce((acc, key) => ({ ...acc, [obj[key][nextKey]]: { ...obj[key], key }}), {})
);

export const toCollection = (obj) => (
  Object.keys(obj).reduce((acc, key) => [...acc, { ...obj[key], key }], [])
);
