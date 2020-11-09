import React from 'react';
import { connect } from 'react-redux';
import { ROLES } from 'src/constants';
import hasGrants from 'src/helpers/conditions/hasGrants';
import { hasRole, isAdmin } from 'src/helpers/conditions/user';
import { fetch as getAccount, getUsage } from 'src/actions/account';
import { listAlerts } from 'src/actions/alerts';
import { list as listSendingDomains } from 'src/actions/sendingDomains';
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

function mapStateToProps(state) {
  const isPending = state.account.loading || state.account.usageLoading || state.alerts.listPending;
  const isAdminOrDev = isAdmin(state) || hasRole(ROLES.DEVELOPER)(state);

  return {
    canManageSendingDomains: hasGrants('sending_domains/manage')(state),
    isAdminOrDev,
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
  getUsage,
  listAlerts,
  listSendingDomains,
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
