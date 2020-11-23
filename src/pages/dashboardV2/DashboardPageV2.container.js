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
import { selectApiKeysForSending } from 'src/selectors/api-keys';
import { listApiKeys } from 'src/actions/api-keys';
import { selectVerifiedDomains } from 'src/selectors/sendingDomains';
import { list as listSendingDomains } from 'src/actions/sendingDomains';

function mapStateToProps(state) {
  const isAnAdmin = isAdmin(state);
  const isDev = hasRole(ROLES.DEVELOPER)(state);
  let verifySendingLink = '/domains/list/sending';
  // TODO: https://sparkpost.atlassian.net/browse/FE-1249 - rvUsage rename
  let lastUsageDate = state?.account?.rvUsage?.messaging?.last_usage_date;

  // TODO: Move onboarding to a higher state/provider where it can be pulled into any area of the app
  const sendingDomains = state.sendingDomains.list;
  const verifiedDomains = selectVerifiedDomains(state);
  const apiKeysForSending = selectApiKeysForSending(state);
  const canViewUsage = hasGrants('usage/view')(state);
  const canManageApiKeys = hasGrants('api_keys/manage')(state);
  const canManageSendingDomains = hasGrants('sending_domains/manage')(state);

  let onboarding;
  if (canManageSendingDomains && canManageApiKeys && canViewUsage && lastUsageDate === null) {
    const addSendingDomainNeeded = sendingDomains.length === 0;
    if (addSendingDomainNeeded) onboarding = 'addSending';

    const verifySendingNeeded = !addSendingDomainNeeded && verifiedDomains.length === 0;
    if (verifySendingNeeded) onboarding = 'verifySending';

    const createApiKeyNeeded =
      !addSendingDomainNeeded && !verifySendingNeeded && apiKeysForSending.length === 0;

    if (createApiKeyNeeded) onboarding = 'createApiKey';

    if (!addSendingDomainNeeded && !verifySendingNeeded && !createApiKeyNeeded)
      onboarding = 'startSending';
  } else {
    onboarding = 'fallback';
  }

  if (onboarding && sendingDomains.length === 1 && onboarding === 'verifySending') {
    verifySendingLink = `/domains/details/sending-bounce/${sendingDomains[0].domain}`;
  }

  const isPending =
    state.account.loading ||
    state.apiKeys.keysLoading ||
    state.sendingDomains.listLoading ||
    state.account.usageLoading ||
    state.alerts.listPending;

  return {
    verifySendingLink,
    onboarding,
    canViewUsage,
    canManageSendingDomains,
    canManageApiKeys,
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
