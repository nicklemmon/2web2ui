import { formatCountries } from 'src/helpers/billing';

const initialState = {
  plansError: null,
  countriesError: null,
  selectedPromo: {},
  promoPending: false,
};

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
      return { ...state, bundlesLoading: false, bundles: action.payload };

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
