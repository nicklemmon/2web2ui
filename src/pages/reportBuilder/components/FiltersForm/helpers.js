// Used to remap data to include rendering logic for the UI
import _ from 'lodash';

export function remapGroupings(groupings) {
  return groupings.map(grouping => {
    const groupingKeys = Object.keys(grouping);
    const groupingType = groupingKeys[0];
    const filters = Object.keys(grouping[groupingType]);

    if (filters.length === 0) {
      return {
        type: groupingType,
        filters: [getInitialFilterState()],
      };
    }

    return {
      type: groupingType,
      filters: _.flatten(
        filters.map(filter => {
          const filterObj = grouping[groupingType][filter];
          const comparisons = Object.keys(filterObj);

          return comparisons.map(compareBy => {
            return {
              type: filter,
              compareBy: compareBy,
              values: _.get(filterObj, compareBy),
            };
          });
        }),
      ),
    };
  });
}

export function getInitialFilterState() {
  return {
    type: undefined,
    compareBy: 'eq',
    values: [],
  };
}

export function getInitialGroupState() {
  return {
    type: 'AND',
    filters: [getInitialFilterState()],
  };
}

// Used to get UI-related state
export function getGroupingFields(remappedGroupings) {
  const groupings = remappedGroupings;
  const getValueFieldType = compareBy => {
    switch (compareBy) {
      case 'eq':
      case 'notEq':
        return 'typeahead';

      case 'like':
      case 'notLike':
        return 'multi-entry';

      default:
        return undefined;
    }
  };

  return remappedGroupings.map((grouping, groupingIndex) => {
    return {
      ...grouping,

      // Renders below all groups *except* the last one in the list
      hasAndBetweenGroups: groupingIndex + 1 < groupings.length,

      // Renders below the last group in the list when one of the filters has values
      hasAndButton:
        groupingIndex + 1 === groupings.length &&
        groupings[groupingIndex].filters.find(filter => filter.values.length > 0),

      filters: grouping.filters.map((filter, filterIndex) => {
        return {
          ...filter,

          // The form comparison field does not render without a type selected,
          hasCompareBySelect: !!filter.type,

          // Controls whether a filter has "like" comparison options
          hasCompareByLikeOptions: !!filter.type && filter.type !== 'subaccounts',

          // Filter comparison type controls which type of form control renders next
          valueField: filter.type ? getValueFieldType(filter.compareBy) : undefined,

          // Renders on the first group of filters only and when valid filter values exist
          hasGroupingTypeRadioGroup: filterIndex === 0 && filter.values.length > 0,

          // Renders when the grouping is an "AND", when valid filter values exist, on the last filter
          hasAndButton:
            grouping.type === 'AND' &&
            filter.values.length > 0 &&
            filterIndex + 1 === grouping.filters.length,

          // Renders when the grouping is an "OR", when valid filter values exist, on the last filter
          hasOrButton:
            grouping.type === 'OR' &&
            filter.values.length &&
            filterIndex + 1 === grouping.filters.length,

          // Renders comparison text ("OR" or "AND") when more than one grouping exists but not on the last filter in the grouping
          hasComparisonBetweenFilters:
            grouping.filters.length > 1 && filterIndex + 1 !== grouping.filters.length,

          // Renders when there is more than 1 grouping in the form
          hasRemoveButton:
            (groupingIndex === 0 && grouping.filters.length > 1) || groupingIndex > 0,
        };
      }),
    };
  });
}

export function remapFormData(groupingFields) {
  return groupingFields
    .map(grouping => {
      const groupingHasValues = Boolean(grouping.filters.find(filter => filter.values.length > 0));
      const groupingType = grouping.type; // "AND" or "OR"

      // Only reformat and return a grouping when it has valid filters within
      if (!groupingHasValues) return undefined;

      // Converts filters array to object/key structure
      const formattedFilters = grouping.filters.reduce((obj, filter) => {
        const filterHasValues = filter.values.length > 0;
        const comparisonWithValues = _.setWith({}, filter.compareBy, filter.values); // Pairs values with the grouping type, i.e., `"domains": [ ...values ]`
        const filterObj = {
          [filter.type]: {
            ...obj[filter.type],
            ...comparisonWithValues,
          },
        };

        return {
          ...obj,
          ...(filterHasValues ? filterObj : undefined), // Only incorporate the object key and its comparisons when values are present
        };
      }, {});

      return {
        [groupingType]: {
          ...formattedFilters,
        },
      };
    })
    .filter(Boolean); // Remove undefined entries in the object
}
