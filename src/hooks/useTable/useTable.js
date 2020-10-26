import { useEffect, useReducer } from 'react';
import { DEFAULT_CURRENT_PAGE, DEFAULT_PER_PAGE as PER_PAGE } from 'src/constants';
import _ from 'lodash';
import { filterByCollectionValues } from 'src/helpers/array';

const { log } = console;

const initialState = {
  rawData: [],
  rows: [],
  paginateData: false,
  sortBy: undefined,
  sortDirection: undefined,
  currentPage: DEFAULT_CURRENT_PAGE,
  perPage: PER_PAGE,
};

function useTable(data = [], { paginate }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const shouldPaginate = paginate || state.paginateData;

  useEffect(() => {
    dispatch({ type: 'DATA_LOADED', data, paginateData: shouldPaginate });
  }, [data, shouldPaginate]);

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

/**
 * Note: It's really important currentPage starts at 1, NOT 0, for getPaginationStart to provide the correct start and slice correctly
 */
function slicePage(data, start, perPage) {
  return data.slice(start, start + perPage);
}

/**
 * Note: It's really important currentPage starts at 1, NOT 0, for this function to do what's expected
 */
function getPaginationStart({ currentPage, perPage }) {
  return (currentPage - 1) * perPage;
}

function reducer(state, action) {
  switch (action.type) {
    case 'DATA_LOADED': {
      let rows = action.data.map(i => i);

      if (action.paginateData) {
        const start = getPaginationStart(state);
        rows = slicePage(rows, start, state.perPage);
      }

      return {
        ...state,
        rawData: action.data,
        rows,
        paginateData: action.paginateData,
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

      const start = getPaginationStart({
        currentPage: action.page,
        perPage: state.perPage,
      });

      const rows = slicePage(
        state.rawData.map(i => i),
        start,
        state.perPage,
      );

      return {
        ...state,
        rows,
      };
    }

    case 'CHANGE_PER_PAGE': {
      const rows = action.data.slice(0, action.perPage);
      return {
        ...state,
        perPage: action.perPage,
        currentPage: DEFAULT_CURRENT_PAGE,
        rows,
      };
    }

    default:
      throw new Error(`${action.type} is not supported.`);
  }
}

export default useTable;
