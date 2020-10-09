import { FILTER_KEY_MAP } from 'src/helpers/metrics';

const getFilterType = value => {
  return Object.keys(FILTER_KEY_MAP).find(key => FILTER_KEY_MAP[key] === value);
};
export const hydrateFilters = (groupings, { subaccounts = [] } = {}) => {
  return groupings.map(grouping => {
    const groupingKeys = Object.keys(grouping);
    const groupingType = groupingKeys[0];
    const filters = Object.keys(grouping[groupingType]);

    return {
      [groupingType]: filters.reduce((ret, filter) => {
        const filterObj = grouping[groupingType][filter];
        const comparisons = Object.keys(filterObj);
        ret[filter] = comparisons.reduce((filterRet, comparison) => {
          switch (comparison) {
            case 'eq':
            case 'notEq': {
              if (filter === 'subaccounts') {
                filterRet[comparison] = filterObj[comparison].map(value => {
                  const subaccount = subaccounts.find(subaccount => subaccount.id === value) || {};

                  const { name, id } = subaccount;
                  return {
                    value: name ? `${name} (ID ${id})` : `Subaccount ${value}`,
                    id: value,
                    type: getFilterType(filter),
                  };
                });
              } else {
                filterRet[comparison] = filterObj[comparison].map(value => {
                  return { value, type: getFilterType(filter) };
                });
              }

              return filterRet;
            }
            case 'like':
            case 'notLike':
            default:
              filterRet[comparison] = filterObj[comparison];
              return filterRet;
          }
        }, {});

        return ret;
      }, {}),
    };
  });
};

export const dehydrateFilters = groupings => {
  return groupings.map(grouping => {
    const groupingKeys = Object.keys(grouping);
    const groupingType = groupingKeys[0];
    const filters = Object.keys(grouping[groupingType]);

    return {
      [groupingType]: filters.reduce((ret, filter) => {
        const filterObj = grouping[groupingType][filter];
        const comparisons = Object.keys(filterObj);
        ret[filter] = comparisons.reduce((filterRet, comparison) => {
          switch (comparison) {
            case 'eq':
            case 'notEq': {
              if (filter === 'subaccounts') {
                filterRet[comparison] = filterObj[comparison].map(({ id }) => id);
              } else {
                filterRet[comparison] = filterObj[comparison].map(({ value }) => value);
              }

              return filterRet;
            }
            case 'like':
            case 'notLike':
            default:
              filterRet[comparison] = filterObj[comparison];
              return filterRet;
          }
        }, {});

        return ret;
      }, {}),
    };
  });
};
