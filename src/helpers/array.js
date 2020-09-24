import _ from 'lodash';

export const toSentence = (array, conjuctionTerm = 'and') => {
  const conjunction = array.length >= 3 ? `, ${conjuctionTerm} ` : ` ${conjuctionTerm} `;
  return (
    array.slice(0, -2).join(', ') + //combines all elements except the last 2 into comma separated items.
    (array.slice(0, -2).length ? ', ' : '') + //appends comma before appending last 2 items unless there are <=2 item in the whole array
    array.slice(-2).join(conjunction)
  ); //joins the last 2 items using oxford comma for >=3 items and append to end of sentence.
};

/**
 * @param {*} arr - Array to filter
 * @param {*} filters - Set of filters applied to the passed in array.
 * @example // TODO: Flesh this out
 */
export const filterByCollectionValues = (arr, { filters }) => {
  const hasEmptyFilters =
    filters.filter(filter => filter.value)?.length === 0 || _.isEmpty(filters);

  if (hasEmptyFilters) return arr;

  const relevantFilters = [];
  const filterConfig = {};

  filters.forEach(filter => {
    if (filter.value === '') return;

    arr.forEach(item => {
      if (item.hasOwnProperty(filter.name)) {
        relevantFilters.push(filter);
      }
    });
  });

  relevantFilters.forEach(filter => {
    filterConfig[filter.name] = filter.value;
  });

  // eslint-disable-next-line
  const truthyFilterConfig = _.pickBy(filterConfig, _.identity);

  return arr.filter(item => {
    for (let key in truthyFilterConfig) {
      const normalizedItemValue = item[key]?.toString().toLowerCase();
      const normalizedFilterVal = truthyFilterConfig[key]?.toString().toLowerCase();

      if (normalizedFilterVal?.length === 0 || !normalizedItemValue?.includes(normalizedFilterVal))
        return false;
    }

    return true;
  });
};
