import { useEffect, useReducer } from 'react';
import _ from 'lodash';
import { filterByCollectionValues } from 'src/helpers/array';

const initialState = {
  rawData: [],
  rows: [],
  sortBy: undefined,
  sortDirection: undefined,
};

function useTable(data = []) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: 'DATA_LOADED', data });
  }, [data]);

  return [state, dispatch];
}

function getSortedRows({ rows, sortBy, sortDirection }) {
  if (sortBy) {
    return _.orderBy(rows, sortBy, sortDirection || 'asc');
  }

  return rows;
}

function getSortDirection({ state, column }) {
  if (state.sortBy === column) {
    return state.sortDirection === 'asc' ? 'desc' : 'asc';
  }

  return 'asc';
}

function reducer(state, action) {
  switch (action.type) {
    case 'DATA_LOADED': {
      return {
        ...state,
        rawData: action.data,
        rows: action.data,
      };
    }

    case 'FILTER': {
      const sortedFilteredRows = getSortedRows({
        rows: filterByCollectionValues(state.rawData, { filters: action.filters }),
        sortBy: state.sortBy,
        sortDirection: state.sortDirection,
      });

      return {
        ...state,
        rows: sortedFilteredRows,
      };
    }

    case 'SORT': {
      const column = action.sortBy;
      const direction = action.direction || getSortDirection({ state, column });
      const sortedRows = getSortedRows({
        rows: state.rows,
        sortBy: column,
        sortDirection: direction,
      });

      return {
        ...state,
        rows: sortedRows,
        sortBy: column,
        sortDirection: direction,
      };
    }

    default:
      throw new Error(`${action.type} is not supported.`);
  }
}

export default useTable;
