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
  const sendingDomains = state.sendingDomains.list;
  const verifiedDomains = selectVerifiedDomains(state);
  const apiKeysForSending = selectApiKeysForSending(state);
  const canManageSendingDomains = hasGrants('sending_domains/manage')(state);
  const isAnAdmin = isAdmin(state);
  const isDev = hasRole(ROLES.DEVELOPER)(state);
  let verifySendingLink = '/domains/list/sending';
  let lastUsageDate = state?.account?.rvUsage?.messaging?.last_usage_date;
  let onboarding;

  if (lastUsageDate === null) {
    const addSendingDomainNeeded = (isAnAdmin || isDev) && sendingDomains.length === 0;
    if (addSendingDomainNeeded) onboarding = 'addSending';

    if (sendingDomains.length === 1 && verifiedDomains.length === 0) {
      verifySendingLink = `/domains/details/sending-bounce/${sendingDomains[0].domain}`;
    }

    const verifySendingNeeded = !addSendingDomainNeeded && verifiedDomains.length === 0;
    if (verifySendingNeeded) onboarding = 'verifySending';

    const createApiKeyNeeded =
      !addSendingDomainNeeded && !verifySendingNeeded && apiKeysForSending.length === 0;

    if (createApiKeyNeeded) onboarding = 'createApiKey';

    if (!addSendingDomainNeeded && !verifySendingNeeded && !createApiKeyNeeded)
      onboarding = 'startSending';

    if (!canManageSendingDomains || (!isAnAdmin && !isDev)) onboarding = 'fallback';
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
