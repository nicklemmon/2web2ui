import { useReducer, useCallback } from 'react';
import { getInitialGroupState, getInitialFilterState, remapGroupings } from './helpers';

const initialGroupingsState = [{ AND: {} }];

const initialState = {
  groupings: remapGroupings(initialGroupingsState),
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_GROUPING_TYPE': {
      const { groupings } = state;
      const targetGroup = groupings[action.groupingIndex];
      targetGroup.type = action.groupingType;

      return { ...state, groupings };
    }

    case 'SET_FILTER_TYPE': {
      const { groupings } = state;
      const targetFilter = groupings[action.groupingIndex].filters[action.filterIndex];
      targetFilter.type = action.filterType;
      targetFilter.values = [];

      return { ...state, groupings };
    }

    case 'SET_FILTER_COMPARE_BY': {
      const { groupings } = state;
      const targetFilter = groupings[action.groupingIndex].filters[action.filterIndex];
      targetFilter.compareBy = action.compareBy;
      targetFilter.values = [];

      return { ...state, groupings };
    }

    case 'SET_FILTER_VALUES': {
      const { groupings } = state;
      const targetFilter = groupings[action.groupingIndex].filters[action.filterIndex];
      targetFilter.values = action.values;

      return { ...state, groupings };
    }

    case 'ADD_GROUPING': {
      const groupings = state.groupings;
      const updatedGroupings = [...groupings, getInitialGroupState()];

      return {
        ...state,
        groupings: updatedGroupings,
      };
    }

    case 'ADD_FILTER': {
      const { groupings } = state;
      const targetFilters = groupings[action.groupingIndex].filters;
      targetFilters.push(getInitialFilterState());

      return { ...state, groupings };
    }

    case 'REMOVE_FILTER': {
      let updatedGroupings = state.groupings
        // Remove clicked on filters
        .map((grouping, groupingIndex) => {
          if (groupingIndex === action.groupingIndex) {
            return {
              ...grouping,
              filters: grouping.filters.filter(
                (_filter, filterIndex) => filterIndex !== action.filterIndex,
              ),
            };
          }

          return grouping;
        })
        // If there are no filters left in the group, then remove the entire group
        .filter((grouping, groupingIndex) => {
          if (groupingIndex === action.groupingIndex) {
            const groupingHasFilters = Boolean(
              grouping.filters.find(filter => filter.values.length > 0),
            );

            return groupingHasFilters;
          }

          return true;
        })
        // Remove any undefined entries
        .filter(Boolean);

      // If the last filter is totally cleared out, re-populate it with the default state
      if (updatedGroupings.length === 0) {
        updatedGroupings = remapGroupings(initialGroupingsState);
      }

      return { ...state, groupings: updatedGroupings };
    }

    case 'CLEAR_FILTERS': {
      return {
        ...state,
        groupings: remapGroupings(initialGroupingsState),
      };
    }

    default:
      throw new Error(`${action.type} is not supported.`);
  }
}

export default function useFiltersSection() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setGroupingType = useCallback(
    ({ groupingType, groupingIndex }) => {
      return dispatch({
        type: 'SET_GROUPING_TYPE',
        groupingType,
        groupingIndex,
      });
    },
    [dispatch],
  );

  const setFilterType = useCallback(
    ({ filterType, filterIndex, groupingIndex }) => {
      return dispatch({
        type: 'SET_FILTER_TYPE',
        filterType,
        filterIndex,
        groupingIndex,
      });
    },
    [dispatch],
  );

  const setFilterCompareBy = useCallback(
    ({ compareBy, filterIndex, groupingIndex }) => {
      return dispatch({
        type: 'SET_FILTER_COMPARE_BY',
        compareBy,
        filterIndex,
        groupingIndex,
      });
    },
    [dispatch],
  );

  const setFilterValues = useCallback(
    ({ values, filterIndex, groupingIndex }) => {
      return dispatch({
        type: 'SET_FILTER_VALUES',
        values,
        filterIndex,
        groupingIndex,
      });
    },
    [dispatch],
  );

  const addGrouping = useCallback(() => {
    return dispatch({ type: 'ADD_GROUPING' });
  }, [dispatch]);

  const addFilter = useCallback(
    ({ groupingIndex }) => {
      return dispatch({
        type: 'ADD_FILTER',
        groupingIndex,
      });
    },
    [dispatch],
  );

  const removeFilter = useCallback(
    ({ groupingIndex, filterIndex }) => {
      return dispatch({
        type: 'REMOVE_FILTER',
        groupingIndex,
        filterIndex,
      });
    },
    [dispatch],
  );

  const clearFilters = () => dispatch({ type: 'CLEAR_FILTERS' });

  return {
    state,
    actions: {
      setGroupingType,
      setFilterType,
      setFilterCompareBy,
      setFilterValues,
      addGrouping,
      addFilter,
      removeFilter,
      clearFilters,
    },
  };
}