const initialSubaccountState = {
  getError: null,
  getLoading: false,
  subaccount: {},
};

const initialState = {
  ...initialSubaccountState,
  list: [],
  listError: null,
  listLoading: false,
  ready: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'LIST_SUBACCOUNTS_PENDING':
      return { ...state, status: 'pending', listLoading: true, listError: null };

    case 'LIST_SUBACCOUNTS_SUCCESS':
      return { ...state, ready: true, status: 'success', listLoading: false, list: payload };

    case 'LIST_SUBACCOUNTS_FAIL':
      return { ...state, ready: true, status: 'error', listLoading: false, listError: payload };

    case 'GET_SUBACCOUNT_PENDING':
      return { ...state, getLoading: true, getError: null };

    case 'GET_SUBACCOUNT_SUCCESS':
      return { ...state, getLoading: false, subaccount: payload };

    case 'GET_SUBACCOUNT_FAIL':
      return { ...state, getLoading: false, getError: payload };

    case 'CLEAR_SUBACCOUNT':
      return { ...state, ...initialSubaccountState };

    default:
      return state;
  }
};
