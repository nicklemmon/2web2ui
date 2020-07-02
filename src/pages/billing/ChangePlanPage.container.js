import React from 'react';
import ChangePlanPage from './ChangePlanPage';
import { ChangePlanProvider } from './context/ChangePlanContext';
import { getBillingInfo } from 'src/actions/account';
import { getSubscription, getBundles, getPlans, getBillingCountries } from 'src/actions/billing';
import { selectAvailableBundles, selectAccountBilling } from 'src/selectors/accountBillingInfo';
import { connect } from 'react-redux';

const ChangePlanPageContainer = props => (
  <ChangePlanProvider {...props}>
    <ChangePlanPage />
  </ChangePlanProvider>
);

const mapDispatchToProps = {
  getSubscription,
  getBundles,
  getPlans,
  getBillingInfo,
  getBillingCountries,
};

const mapStateToProps = state => {
  const { account, loading: accountLoading } = selectAccountBilling(state);
  const { countriesLoading, bundlesLoading, bundlePlansLoading } = state.billing;
  return {
    subscription: state.billing.subscription,
    plans: state.billing.bundlePlans,
    bundles: selectAvailableBundles(state),
    loading: countriesLoading || bundlesLoading || accountLoading || bundlePlansLoading,
    billingCountries: state.billing.countries,
    account,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePlanPageContainer);
