import React, { useEffect } from 'react';
import { Page, Layout } from 'src/components/matchbox';
import { connect } from 'react-redux';
import { fetch as getAccount, getUsage } from 'src/actions/account';
import { getSubscription } from 'src/actions/billing';
import { MessagingUsageSection } from './components/MessagingUsageSection';
import { FeatureUsageSection } from './components/FeatureUsageSection';
import { RVUsageSection } from './components/RVUsageSection';
import { Loading } from 'src/components';

export function UsagePage({
  getAccount,
  getSubscription,
  getUsage,
  usage,
  rvUsage,
  subscription,
  billingSubscription,
  loading,
}) {
  useEffect(() => {
    getAccount({ include: 'usage' });
  }, [getAccount]);

  useEffect(() => {
    getSubscription();
  }, [getSubscription]);

  useEffect(() => {
    getUsage();
  }, [getUsage]);

  if (loading) return <Loading />;

  return (
    <Page title="Usage">
      <Layout>
        <MessagingUsageSection usage={usage} subscription={subscription} />
      </Layout>
      <Layout>
        <FeatureUsageSection billingSubscription={billingSubscription} />
      </Layout>
      <Layout>{rvUsage && <RVUsageSection rvUsage={rvUsage} />}</Layout>
    </Page>
  );
}

const mapStateToProps = state => {
  return {
    usage: state.account.usage,
    rvUsage: state.account.rvUsage,
    subscription: state.account.subscription,
    billingSubscription: state.billing.subscription,
    loading: state.account.loading || state.billing.loading || state.billing.usageLoading,
  };
};

export default connect(mapStateToProps, { getAccount, getSubscription, getUsage })(UsagePage);
