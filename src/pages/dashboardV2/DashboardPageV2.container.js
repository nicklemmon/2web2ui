import React from 'react';
import { connect } from 'react-redux';
import { ROLES } from 'src/constants';
import hasGrants from 'src/helpers/conditions/hasGrants';
import { hasRole, isAdmin } from 'src/helpers/conditions/user';
import { fetch as getAccount, getUsage } from 'src/actions/account';
import { listAlerts } from 'src/actions/alerts';
import { selectRecentlyTriggeredAlerts } from 'src/selectors/alerts';
import {
  currentPlanNameSelector,
  selectTransmissionsInPlan,
  selectMonthlyRecipientValidationUsage,
  selectMonthlyTransmissionsUsage,
  selectEndOfBillingPeriod,
} from 'src/selectors/accountBillingInfo';
import { DashboardContextProvider } from './context/DashboardContext';
import DashboardPageV2 from './DashboardPageV2';
import { resolveStatus } from 'src/helpers/domains';

import { listApiKeys } from 'src/actions/api-keys';
import { list as listSendingDomains } from 'src/actions/sendingDomains';

function mapStateToProps(state) {
  const isPending = state.account.loading || state.account.usageLoading || state.alerts.listPending;
  const sendingDomains = state.sendingDomains.list;
  const apiKeys = state.apiKeys.keys;
  const canManageSendingDomains = hasGrants('sending_domains/manage')(state);
  const isAnAdmin = isAdmin(state);
  const isDev = hasRole(ROLES.DEVELOPER)(state);
  let verifySendingLink = '/domains/list/sending';
  let lastUsageDate = -1;
  let onboarding;

  // Set onboarding step one
  const addSendingDomainNeeded = (isAnAdmin || isDev) && sendingDomains.length === 0;
  if (addSendingDomainNeeded) onboarding = 'addSending';

  // Set onboarding step two
  const verifiedSendingDomains = sendingDomains
    .map(i => {
      return resolveStatus(i.status) === 'verified' ? i : null;
    })
    .filter(Boolean);

  if (sendingDomains.length === 1 && verifiedSendingDomains.length === 0) {
    verifySendingLink = `/domains/details/sending-bounce/${sendingDomains[0].domain}`;
  }

  const verifySendingNeeded = !addSendingDomainNeeded && verifiedSendingDomains.length === 0;
  if (verifySendingNeeded) onboarding = 'verifySending';

  // Set onboarding step three
  const createApiKeyNeeded =
    !addSendingDomainNeeded && !verifySendingNeeded && apiKeys.length === 0;

  if (createApiKeyNeeded) onboarding = 'createApiKey';

  // Set onboarding step four
  if (!addSendingDomainNeeded && !verifySendingNeeded && !createApiKeyNeeded)
    onboarding = 'startSending';

  lastUsageDate = state?.account?.rvUsage?.messaging?.last_usage_date;

  if (
    (!canManageSendingDomains && lastUsageDate === null) ||
    (!isAnAdmin && !isDev && lastUsageDate === null)
  )
    onboarding = 'fallback';

  return {
    lastUsageDate,
    verifySendingLink,
    onboarding,
    canManageSendingDomains,
    isAnAdmin,
    isDev,
    currentUser: state.currentUser,
    currentPlanName: currentPlanNameSelector(state),
    recentAlerts: selectRecentlyTriggeredAlerts(state),
    transmissionsThisMonth: selectMonthlyTransmissionsUsage(state),
    transmissionsInPlan: selectTransmissionsInPlan(state),
    validationsThisMonth: selectMonthlyRecipientValidationUsage(state),
    endOfBillingPeriod: selectEndOfBillingPeriod(state),
    pending: isPending,
    hasUpgradeLink: hasGrants('account/manage')(state),
    hasUsageSection: isAdmin(state),
  };
}

const mapDispatchToProps = {
  getAccount,
  listAlerts,
  getUsage,
  listSendingDomains,
  listApiKeys,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(props => {
  return (
    <DashboardContextProvider value={props}>
      <DashboardPageV2 />
    </DashboardContextProvider>
  );
});
