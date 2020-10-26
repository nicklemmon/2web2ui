import { useEffect, useReducer } from 'react';
import { DEFAULT_CURRENT_PAGE as CURRENT_PAGE, DEFAULT_PER_PAGE as PER_PAGE } from 'src/constants';
import _ from 'lodash';
import { filterByCollectionValues } from 'src/helpers/array';

const { log } = console;

const initialState = {
  rawData: [],
  rows: [],
  sortBy: undefined,
  sortDirection: undefined,
  currentPage: CURRENT_PAGE,
  perPage: PER_PAGE,
};

function useTable(data = []) {
  const [state, dispatch] = useReducer(reducer, initialState);

  log('useTable data: ', data);

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

    case 'CHANGE_PAGE': {
      log('CHANGE_PAGE', action.page);
      return {
        ...state,
      };
    }

    case 'CHANGE_PER_PAGE': {
      log('CHANGE_PER_PAGE', action.perPage);
      return {
        ...state,
      };
    }

    default:
      throw new Error(`${action.type} is not supported.`);
  }
}

export default useTable;
