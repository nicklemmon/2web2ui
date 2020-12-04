import _ from 'lodash';

export const initialState = {
  updateError: null,
  loading: false,
  subscription: {},
  updateLoading: false,
  createLoading: false,
  usageLoading: false,
};

// eslint-disable-next-line
const FAKE_SUBSCRIPTION = {
  code: '250K-premier-0519',
  name: '250K Premier',
  overage: 0.85,
  period: 'month',
  plan_volume: 100000,
  recurring_charge: 76.35,
  type: 'default',
  self_serve: true,
  plan_volume_per_period: 100000,
};

// eslint-disable-next-line
const FAKE_GREEN_SUBSCRIPTION = {
  code: '250K-premier-0519-green',
  name: '250K Premier',
  overage: 0.85,
  period: 'month',
  plan_volume: 100000,
  recurring_charge: 76.35,
  type: 'default',
  self_serve: true,
  plan_volume_per_period: 100000,
};

export default (state = initialState, { type, meta, payload }) => {
  switch (type) {
    case 'FETCH_ACCOUNT_PENDING': {
      const { pending_cancellation, pending_downgrade, ...updated } = state;
      return { ...updated, loading: true };
    }

    case 'FETCH_ACCOUNT_SUCCESS': {
      return {
        ...state,
        loading: false,
        ...payload,
      };
    }

    case 'FETCH_ACCOUNT_FAIL':
      return { ...state, loading: false };

    /**
     * FETCH_ACCOUNT_SUCCESS simply spreads the payload into state,
     * so it's impossible to remove keys from the account -- this is
     * the main place we want to do that and it's usually just for testing
     */
    case 'REMOVE_ACCOUNT_BILLING': {
      const updated = { ...state, loading: false, ...payload };
      delete updated.billing;
      return updated;
    }

    case 'UPDATE_ACCOUNT_PENDING':
      return { ...state, updateLoading: true, updateError: null };

    case 'UPDATE_ACCOUNT_SUCCESS':
      return { ...state, updateLoading: false, ...meta.data };

    case 'UPDATE_ACCOUNT_FAIL':
      return { ...state, updateError: payload, updateLoading: false };

    case 'SET_ACCOUNT_OPTION_PENDING':
      return { ...state, updateLoading: true, updateError: null };

    case 'SET_ACCOUNT_OPTION_SUCCESS': {
      const { options = {} } = state; //Spread other account options
      const { ui = {} } = options; //Spread other account UI options
      return {
        ...state,
        updateLoading: false,
        options: { ...options, ui: _.merge(ui, meta.data.options.ui) },
      };
    }

    case 'SET_ACCOUNT_OPTION_FAIL':
      return { ...state, updateError: payload, updateLoading: false };

    case 'CREATE_ACCOUNT_PENDING':
      return { ...state, createLoading: true, createError: null };

    case 'CREATE_ACCOUNT_SUCCESS':
      return { ...state, createLoading: false, payload };

    case 'CREATE_ACCOUNT_FAIL':
      return { ...state, createError: payload, createLoading: false };

    case 'GET_BILLING_SUCCESS':
      return { ...state, billing: _.isEmpty(payload) ? null : payload, billingLoading: false };

    case 'GET_BILLING_FAIL':
      return { ...state, billingError: payload, billingLoading: false };

    case 'GET_BILLING_PENDING':
      return { ...state, billingLoading: true };

    case 'GET_USAGE_PENDING':
      return { ...state, usageLoading: true };

    //TODO: Dashboard usage (through account?include=usage) will eventually be consolidated and remove rvUsage
    case 'GET_USAGE_SUCCESS':
      return { ...state, usageLoading: false, rvUsage: _.isEmpty(payload) ? null : payload };

    case 'GET_USAGE_FAIL':
      return { ...state, usageLoading: false, usageError: payload };

    case 'CANCEL_ACCOUNT_PENDING':
      return { ...state, cancelLoading: true, cancelError: null };

    case 'CANCEL_ACCOUNT_SUCCESS':
      return { ...state, cancelLoading: false };

    case 'CANCEL_ACCOUNT_FAIL':
      return { ...state, cancelError: payload, cancelLoading: false };

    case 'RENEW_ACCOUNT_PENDING':
      return { ...state, cancelLoading: true, cancelError: null };

    case 'RENEW_ACCOUNT_SUCCESS':
      return { ...state, cancelLoading: false };

    case 'RENEW_ACCOUNT_FAIL':
      return { ...state, cancelError: payload, cancelLoading: false };

    default:
      return state;
  }
};
