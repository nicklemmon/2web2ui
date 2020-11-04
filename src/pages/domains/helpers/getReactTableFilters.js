/**
 * getReactTableFilters maps object keys to an array of objects with id and value properties. (passed into react-table)
 *
 * @param {object} params - The object of key value pairs
 *
 * @returns {array} {id: "keyName", value: true}
 */
export default params => {
  return Object.entries(params)
    .map(keyValueArr => {
      // keyValueArr[0] = params key
      // keyValueArr[1] = params value
      if (!keyValueArr[1]) {
        // if the value of the object key is falsy -> return null so the filter(Boolean removes)
        return null;
      }

      return {
        id: keyValueArr[0],
        value: keyValueArr[1],
      };
    })
    .filter(Boolean);
};
