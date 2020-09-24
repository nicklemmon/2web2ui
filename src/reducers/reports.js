const initialState = {
  createPending: false,
  list: [],
  status: 'idle',
  deletePending: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'CREATE_REPORT_PENDING':
      return { ...state, createPending: true };
    case 'CREATE_REPORT_SUCCESS':
    case 'CREATE_REPORT_FAIL':
      return { ...state, createPending: false };

    case 'GET_REPORTS_PENDING':
      return { ...state, list: [], status: 'loading' };
    case 'GET_REPORTS_SUCCESS':
      return { ...state, list: payload, status: 'idle' };
    case 'GET_REPORTS_FAIL':
      return { ...state, status: 'error' };

    case 'DELETE_REPORT_PENDING':
      return { ...state, deletePending: true };
    case 'DELETE_REPORT_SUCCESS':
    case 'DELETE_REPORT_FAIL':
      return { ...state, deletePending: false };

    default:
      return state;
  }
};
