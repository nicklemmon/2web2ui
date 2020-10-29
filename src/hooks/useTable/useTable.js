import { useEffect, useReducer } from 'react';
import { DEFAULT_CURRENT_PAGE, DEFAULT_PER_PAGE } from 'src/constants';
import _ from 'lodash';
import { filterByCollectionValues } from 'src/helpers/array';

const { log } = console;

const initialState = {
  rawData: [],
  rows: [],
  paginate: false,
  sortBy: undefined,
  sortDirection: undefined,
  currentPage: DEFAULT_CURRENT_PAGE,
  perPage: DEFAULT_PER_PAGE,
};

function useTable(data = [], stateOverride = {}) {
  let newInitialState = {
    ...initialState,
    ...stateOverride,
  };

  const [state, dispatch] = useReducer(reducer, newInitialState);

  useEffect(() => {
    dispatch({ type: 'DATA_LOADED', data });
  }, [data]);

  return [state, dispatch];
}

function getSortedRows({ rows, sortBy, sortDirection }) {
  log('rows, sortBy, sortDirection: ', rows, sortBy, sortDirection);

  if (sortBy) {
    return _.orderBy(rows, sortBy, sortDirection || 'asc');
  }

  return rows;
}

function getSortDirection({ state, column }) {
  log('state, column: ', state, column);
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
      const column = state.sortBy;
      const direction = state.direction || getSortDirection({ state, column });
      let paginatedRows;

      log(column, direction);

      const sortedRows = getSortedRows({
        rows: action.data,
        sortBy: column,
        sortDirection: direction,
      });

      log('sortedRows: ', sortedRows);

      if (state.paginate) {
        const start = getPaginationStart(state);
        paginatedRows = slicePage(sortedRows, start, state.perPage);
      }

      log('paginatedRows: ', paginatedRows);

      return {
        ...state,
        rawData: sortedRows,
        rows: state.paginate ? paginatedRows : sortedRows,
        paginate: state.paginate,
      };
    }

    // TODO: Filtering needs to reset pagination state
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

    // TODO: Double check sorting takes into account the correct page number they're on if it has pagination
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
      const column = action.sortBy;
      const direction = action.direction || getSortDirection({ state, column });

      const sortedRows = getSortedRows({
        rows: state.rawData,
        sortBy: column,
        sortDirection: direction,
      });

      log('sortedRows: ', sortedRows);

      const start = getPaginationStart({
        currentPage: action.page,
        perPage: state.perPage,
      });

      log('start: ', start);

      const rows = slicePage(
        sortedRows.map(i => i),
        start,
        state.perPage,
      );

      log(rows);

      return {
        ...state,
        rows,
        currentPage: action.page,
      };
    }

    case 'CHANGE_PER_PAGE': {
      const column = action.sortBy;
      const direction = action.direction || getSortDirection({ state, column });

      const sortedRows = getSortedRows({
        rows: state.rawData,
        sortBy: column,
        sortDirection: direction,
      });

      const rows = slicePage(sortedRows, 0, action.perPage);

      log(rows);

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
