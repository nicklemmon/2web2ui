/**
 * getReactTableFilters maps object keys to an array of objects with id and value properties. (passed into react-table)
 *
 * @param {object} params - The object of key value pairs
 *
 * @returns {array} {id: "keyName", value: false}
 */
export default params => {
  return Object.entries(params)
    .map(([key, value]) => {
      if (value === true) {
        return null;
      }

      if (('domainName' === key && !value) || (typeof value === 'string' && value.length === 0)) {
        return null;
      }

      return {
        id: key,
        value: value,
      };
    })
    .filter(Boolean);
};
