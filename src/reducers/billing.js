import { formatCountries } from 'src/helpers/billing';

const initialState = {
  countriesError: null,
  selectedPromo: {},
  promoPending: false,
};

const FAKE_GREEN_PLANS = [
  {
    bundle: '100K-premier-0519',
    status: 'public',
    tier: 'premier',
    type: 'messaging',
    green: true,
    products: [
      { product: 'dedicated_ip', plan: 'ip-0519' },
      { product: 'online_support', plan: 'online-support' },
      { product: 'phone_support', plan: 'phone-support' },
      { product: 'reports', plan: 'reports-premier' },
      { product: 'sso', plan: 'sso' },
      { product: 'subaccounts', plan: 'subaccounts-premier' },
      { product: 'tfa_required', plan: 'tfa-required' },
      { product: 'messaging', plan: '100K-premier-0519' },
    ],
    messaging: {
      billing_id: '2c92c0f96a34607a016a504621c11e1b',
      plan: '100K-premier-0519',
      product: 'messaging',
      price: 75,
      overage: 0.85,
      volume: 100000,
    },
  },
  {
    bundle: '250K-premier-0519',
    status: 'public',
    tier: 'premier',
    type: 'messaging',
    green: true,
    products: [
      { product: 'dedicated_ip', plan: 'ip-0519' },
      { product: 'online_support', plan: 'online-support' },
      { product: 'phone_support', plan: 'phone-support' },
      { product: 'reports', plan: 'reports-premier' },
      { product: 'sso', plan: 'sso' },
      { product: 'subaccounts', plan: 'subaccounts-premier' },
      { product: 'tfa_required', plan: 'tfa-required' },
      { product: 'messaging', plan: '250K-premier-0519' },
    ],
    messaging: {
      billing_id: '2c92c0f96a34607f016a5047fa0f5188',
      plan: '250K-premier-0519',
      product: 'messaging',
      price: 170,
      overage: 0.7,
      volume: 250000,
    },
  },
  {
    bundle: '500K-premier-0519',
    status: 'public',
    tier: 'premier',
    type: 'messaging',
    green: true,
    products: [
      { product: 'dedicated_ip', plan: 'ip-0519' },
      { product: 'online_support', plan: 'online-support' },
      { product: 'phone_support', plan: 'phone-support' },
      { product: 'reports', plan: 'reports-premier' },
      { product: 'sso', plan: 'sso' },
      { product: 'subaccounts', plan: 'subaccounts-premier' },
      { product: 'tfa_required', plan: 'tfa-required' },
      { product: 'messaging', plan: '500K-premier-0519' },
    ],
    messaging: {
      billing_id: '2c92c0f86a345944016a5049650b5947',
      plan: '500K-premier-0519',
      product: 'messaging',
      price: 290,
      overage: 0.6,
      volume: 500000,
    },
  },
  {
    bundle: '1M-premier-0519',
    status: 'public',
    tier: 'premier',
    type: 'messaging',
    green: true,
    products: [
      { product: 'dedicated_ip', plan: 'ip-0519' },
      { product: 'online_support', plan: 'online-support' },
      { product: 'phone_support', plan: 'phone-support' },
      { product: 'reports', plan: 'reports-premier' },
      { product: 'sso', plan: 'sso' },
      { product: 'subaccounts', plan: 'subaccounts-premier' },
      { product: 'tfa_required', plan: 'tfa-required' },
      { product: 'messaging', plan: '1M-premier-0519' },
    ],
    messaging: {
      billing_id: '2c92c0f86a34593d016a504a82535c50',
      plan: '1M-premier-0519',
      product: 'messaging',
      price: 525,
      overage: 0.55,
      volume: 1000000,
    },
  },
  {
    bundle: '2.5M-0817',
    status: 'secret',
    tier: 'premier',
    type: 'messaging',
    green: true,
    products: [
      { product: 'dedicated_ip', plan: 'ip-0519' },
      { product: 'online_support', plan: 'online-support' },
      { product: 'phone_support', plan: 'phone-support' },
      { product: 'reports', plan: 'reports-premier' },
      { product: 'sso', plan: 'sso' },
      { product: 'subaccounts', plan: 'subaccounts-premier' },
      { product: 'tfa_required', plan: 'tfa-required' },
      { product: 'messaging', plan: '2.5M-0817' },
    ],
    messaging: {
      billing_id: '2c92c0f85d7d53d6015d80ed8f2b0ce5',
      plan: '2.5M-0817',
      product: 'messaging',
      price: 899,
      overage: 0.4,
      volume: 2500000,
    },
  },
];

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_COUNTRIES_BILLING_PENDING':
      return { ...state, countriesLoading: true, countriesError: null };

    case 'GET_COUNTRIES_BILLING_SUCCESS':
      return {
        ...state,
        countriesLoading: false,
        countries: formatCountries(action.payload),
      };

    case 'GET_COUNTRIES_BILLING_FAIL':
      return { ...state, countriesLoading: false, countriesError: action.payload };

    case 'VERIFY_PROMO_CODE_SUCCESS':
      return {
        ...state,
        promoPending: false,
        selectedPromo: { promoCode: action.meta.promoCode, ...action.payload },
      };

    case 'VERIFY_PROMO_CODE_FAIL':
      return { ...state, promoPending: false, promoError: action.payload };

    case 'VERIFY_PROMO_CODE_PENDING':
      return { ...state, promoPending: true, promoError: undefined };

    case 'REMOVE_ACTIVE_PROMO':
      return { ...state, promoPending: false, promoError: undefined, selectedPromo: {} };

    case 'GET_BUNDLES_PENDING':
      return { ...state, bundlesLoading: true, bundlesError: null };

    case 'GET_BUNDLES_SUCCESS':
      return { ...state, bundlesLoading: false, bundles: [...action.payload, ...FAKE_GREEN_PLANS] };

    case 'GET_BUNDLES_FAIL':
      return { ...state, bundlesLoading: false, bundlesError: action.payload };

    case 'GET_NEW_PLANS_PENDING':
      return { ...state, bundlePlansLoading: true, bundlesError: null };

    case 'GET_NEW_PLANS_SUCCESS':
      return { ...state, bundlePlansLoading: false, bundlePlans: action.payload };

    case 'GET_NEW_PLANS_FAIL':
      return { ...state, bundlePlansLoading: false, bundlesError: action.payload };

    case 'GET_SUBSCRIPTION_PENDING':
      return { ...state, loading: true, Error: null };

    case 'GET_SUBSCRIPTION_SUCCESS':
      return { ...state, loading: false, subscription: action.payload };

    case 'GET_SUBSCRIPTION_FAIL':
      return { ...state, loading: false, Error: action.payload };

    default:
      return state;
  }
};
