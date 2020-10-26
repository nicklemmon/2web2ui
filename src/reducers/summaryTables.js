import { DEFAULT_PER_PAGE as PER_PAGE, DEFAULT_CURRENT_PAGE as CURRENT_PAGE } from 'src/constants';
export const DEFAULT = '@@DEFAULT_TABLE';

const initialState = {
  [DEFAULT]: {
    currentPage: CURRENT_PAGE,
    order: undefined, // example, { ascending: true, dataKey: 'example_column' }
    perPage: PER_PAGE,
  },
};

const summaryTablesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_SUMMARY_TABLE': {
      const {
        payload: { tableName, ...payload },
      } = action;

      return {
        ...state,
        [tableName]: { ...state[DEFAULT], ...state[tableName], ...payload },
      };
    }

    case 'RESET_SUMMARY_TABLE': {
      const {
        payload: { tableName, ...payload },
      } = action;

      return {
        ...state,
        [tableName]: { ...state[DEFAULT], ...payload },
      };
    }

    default:
      return state;
  }
};

export default summaryTablesReducer;
