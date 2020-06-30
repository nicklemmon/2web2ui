const initialState = {
  scimTokenList: [],
  scimTokenListLoading: false,
  error: null,
  newScimToken: null,
  generateScimTokenSuccess: null,
  generateScimTokenPending: null,
  generateScimTokenError: null,
  deleteScimTokenSuccess: null,
  deleteScimTokenPending: null,
  deleteScimTokenError: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'GENERATE_SCIM_TOKEN_PENDING':
      return { ...state, generateScimTokenPending: true, generateScimTokenError: null };
    case 'GENERATE_SCIM_TOKEN_FAIL':
      return { ...state, generateScimTokenPending: false, generateScimTokenError: payload };
    case 'GENERATE_SCIM_TOKEN_SUCCESS':
      return {
        ...state,
        newScimToken: payload.key,
        generateScimTokenSuccess: true,
        generateScimTokenPending: false,
        generateScimTokenError: null,
      };
    // LIST_SCIM_TOKEN
    case 'LIST_SCIM_TOKEN_PENDING': {
      return { ...state, scimTokenListLoading: true, error: null };
    }

    case 'LIST_SCIM_TOKEN_SUCCESS': {
      return { ...state, scimTokenListLoading: false, scimTokenList: payload };
    }

    case 'LIST_SCIM_TOKEN_FAIL': {
      return { ...state, scimTokenListLoading: false, error: payload };
    }
    //DELETE_SCIM_TOKEN
    case 'DELETE_SCIM_TOKEN_SUCCESS': {
      return {
        ...state,
        deleteScimTokenSuccess: true,
        deleteScimTokenError: false,
        deleteScimTokenPending: false,
      };
    }

    case 'DELETE_SCIM_TOKEN_PENDING': {
      return {
        ...state,
        deleteScimTokenSuccess: false,
        deleteScimTokenError: false,
        deleteScimTokenPending: true,
      };
    }
    case 'DELETE_SCIM_TOKEN_FAIL': {
      return {
        ...state,
        deleteScimTokenSuccess: false,
        deleteScimTokenError: true,
        deleteScimTokenPending: false,
      };
    }
    case 'SCIM_TOKEN_ERROR_RESET': {
      return {
        ...state,
        deleteScimTokenSuccess: null,
        deleteScimTokenError: null,
        deleteScimTokenPending: null,
      };
    }
    default:
      return state;
  }
};
