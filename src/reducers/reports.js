const initialState = {
  createPending: false,
  list: [],
  status: 'idle',
  saveStatus: 'idle',
  report: {},
  deletePending: false,
  getReportPending: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'CREATE_REPORT_PENDING':
      return { ...state, saveStatus: 'loading' };
    case 'CREATE_REPORT_SUCCESS':
      return { ...state, saveStatus: 'success' };
    case 'CREATE_REPORT_FAIL':
      return { ...state, saveStatus: 'error' };

    case 'UPDATE_REPORT_PENDING':
      return { ...state, saveStatus: 'loading' };
    case 'UPDATE_REPORT_SUCCESS':
      return { ...state, saveStatus: 'success' };
    case 'UPDATE_REPORT_FAIL':
      return { ...state, saveStatus: 'error' };

    case 'GET_REPORTS_PENDING':
      return { ...state, list: [], status: 'loading' };
    case 'GET_REPORTS_SUCCESS':
      return { ...state, list: payload, status: 'success' };
    case 'GET_REPORTS_FAIL':
      return { ...state, status: 'error' };

    case 'DELETE_REPORT_PENDING':
      return { ...state, deletePending: true };
    case 'DELETE_REPORT_SUCCESS':
    case 'DELETE_REPORT_FAIL':
      return { ...state, deletePending: false };

    case 'GET_REPORT_PENDING':
      return { ...state, report: {}, getReportPending: true };
    case 'GET_REPORT_SUCCESS':
      return { ...state, report: payload, getReportPending: false };
    case 'GET_REPORT_FAIL':
      return { ...state, getReportPending: false };

    default:
      return state;
  }
};
