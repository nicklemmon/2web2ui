const initialState = {
  createPending: false,
};

export default (state = initialState, { type, payload, meta }) => {
  switch (type) {

    case 'CREATE_REPORT_PENDING':
      return { ...state, createPending: true };

    case 'CREATE_REPORT_SUCCESS':
    case 'CREATE_REPORT_FAIL':
      return { ...state, createPending: false };

    default:
      return state;
  }
};
