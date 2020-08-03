import React, { useEffect } from 'react';
import { Page, Layout } from 'src/components/matchbox';
import { connect } from 'react-redux';
import { fetch as getAccount } from 'src/actions/account';
import { getSubscription } from 'src/actions/billing';
import { MessagingUsageSection } from './components/MessagingUsageSection';
import { FeatureUsageSection } from './components/FeatureUsageSection';

export function UsagePage({
  getAccount,
  getSubscription,
  usage,
  subscription,
  billingSubscription,
}) {
  useEffect(() => {
    getAccount({ include: 'usage' });
  }, [getAccount]);

  useEffect(() => {
    getSubscription();
  }, [getSubscription]);

  return (
    <Page title="Usage">
      <Layout>
        <MessagingUsageSection usage={usage} subscription={subscription} />
      </Layout>
      <Layout>
        <FeatureUsageSection billingSubscription={billingSubscription} />
      </Layout>
    </Page>
  );
}

const mapStateToProps = state => {
  return {
    usage: state.account.usage,
    subscription: state.account.subscription,
    billingSubscription: state.billing.subscription,
  };
};

export default connect(mapStateToProps, { getAccount, getSubscription })(UsagePage);
