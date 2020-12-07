import React from 'react';
import { Page, Layout } from 'src/components/matchbox';
import { ApiErrorBanner, Loading } from 'src/components';
import { useSparkPostQuery } from 'src/hooks';
import {
  selectEndOfBillingPeriod,
  selectStartOfBillingPeriod,
} from 'src/selectors/accountBillingInfo';
import {
  getAccount,
  getSubscription,
  getUsage,
  //getUsageHistory
} from 'src/helpers/api';
import { MessagingUsageSection, FeatureUsageSection, RVUsageSection } from './components';

export default function UsagePage() {
  // API Requests
  const { data: account, status: accountStatus, refetch: accountRefetch } = useSparkPostQuery(() =>
    getAccount({ include: 'usage' }),
  );
  const { data: usage, status: usageStatus, refetch: usageRefetch } = useSparkPostQuery(getUsage);
  // const {
  //   data: usageHistory,
  //   status: usageHistoryStatus,
  //   refetch: usageHistoryRefetch,
  // } = useSparkPostQuery(getUsageHistory);
  const {
    data: subscription,
    status: subscriptionStatus,
    refetch: subscriptionRefetch,
  } = useSparkPostQuery(getSubscription);

  // API Status Handling
  // const statuses = [accountStatus, usageStatus, usageHistoryStatus, subscriptionStatus];
  const statuses = [accountStatus, usageStatus, subscriptionStatus];
  const isLoading = statuses.includes('loading');
  const isError = statuses.includes('error');

  function handleReload() {
    accountRefetch();
    usageRefetch();
    // usageHistoryRefetch();
    subscriptionRefetch();
  }

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <Page title="Usage">
        <ApiErrorBanner
          message="Sorry, we seem to be having trouble loading this page."
          reload={handleReload}
        />
      </Page>
    );
  }

  // Merging data so existing selectors can work together to grab from a common object
  // const data = { account, subscription, usage, usageHistory };
  const data = { account, subscription, usage };
  const endOfBillingPeriod = selectEndOfBillingPeriod(data);
  const startOfBillingPeriod = selectStartOfBillingPeriod(data);
  const accountUsage = data.account.usage;
  const accountSubscription = data.account.subscription;
  const billingSubscription = data.subscription;
  const rvUsage = data.usage.recipient_validation;
  // const rvUsageHistory = data.usageHistory.recipient_validation;
  const rvUsageHistory = [
    {
      date: '2020-08-15',
      usage: 12355,
    },
    {
      date: '2020-08-16',
      usage: 11343,
    },
    {
      date: '2020-08-17',
      usage: 13500,
    },
    {
      date: '2020-08-18',
      usage: 13500,
    },
    {
      date: '2020-08-19',
      usage: 13500,
    },
  ];

  return (
    <Page title="Usage">
      <Layout>
        <MessagingUsageSection
          usage={accountUsage}
          subscription={accountSubscription}
          endOfBillingPeriod={endOfBillingPeriod}
          startOfBillingPeriod={startOfBillingPeriod}
        />
      </Layout>

      <Layout>
        <FeatureUsageSection billingSubscription={billingSubscription} />
      </Layout>

      {rvUsage ? (
        <Layout>
          <RVUsageSection rvUsage={rvUsage} rvUsageHistory={rvUsageHistory} />
        </Layout>
      ) : null}
    </Page>
  );
}
