const initialState = {
  currentTestDetails: {},
  seedsPending: false,
  seeds: []
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'GET_SEEDS_PENDING':
      return { ...state, seedsPending: true, seedsError: null };
    case 'GET_SEEDS_SUCCESS':
      return { ...state, seedsPending: false, seeds: payload, seedsError: null };
    case 'GET_SEEDS_FAIL':
      return { ...state, seedsPending: false, seedsError: payload };
    case 'GET_INBOX_PLACEMENT_TEST_PENDING':
      return { ...state, getTestPending: true, getTestError: null };
    case 'GET_INBOX_PLACEMENT_TEST_SUCCESS':
      return { ...state, getTestPending: false, currentTestDetails: payload, getTestError: null };
    case 'GET_INBOX_PLACEMENT_TEST_FAIL':
      return { ...state, getTestPending: false, getTestError: payload };

    case 'GET_INBOX_PLACEMENT_TEST_BY_PROVIDER_PENDING':
      return { ...state, getByProviderPending: true, getByProviderError: null };
    case 'GET_INBOX_PLACEMENT_TEST_BY_PROVIDER_SUCCESS':
      return { ...state, getByProviderPending: false, placementsByProvider: payload, getByProviderError: null };
    case 'GET_INBOX_PLACEMENT_TEST_BY_PROVIDER_FAIL':
      return { ...state, getByProviderPending: false, getByProviderError: payload };

    case 'GET_INBOX_PLACEMENT_TEST_CONTENT_PENDING':
      return { ...state, getTestContentPending: true, getTestContentError: null };
    case 'GET_INBOX_PLACEMENT_TEST_CONTENT_SUCCESS':
      return { ...state, getTestContentPending: false, currentTestContent: payload, getTestContentError: null };
    case 'GET_INBOX_PLACEMENT_TEST_CONTENT_FAIL':
      return { ...state, getTestContentPending: false, getTestContentError: payload };

    default:
      return state;
  }
};
