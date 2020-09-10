import React from 'react';
import { connect } from 'react-redux';
import { ROLES } from 'src/constants';
import hasGrants from 'src/helpers/conditions/hasGrants';
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

function mapStateToProps(state) {
  const isPending = state.account.loading || state.account.usageLoading || state.alerts.listPending;
  const userRole = state.currentUser.access_level;
  const hasSetupDocumentationPanel =
    userRole === ROLES.SUPER_USER || userRole === ROLES.ADMIN || userRole === ROLES.DEVELOPER;

  return {
    currentUser: state.currentUser,
    currentPlanName: currentPlanNameSelector(state),
    recentAlerts: selectRecentlyTriggeredAlerts(state),
    transmissionsThisMonth: selectMonthlyTransmissionsUsage(state),
    transmissionsInPlan: selectTransmissionsInPlan(state),
    validationsThisMonth: selectMonthlyRecipientValidationUsage(state),
    endOfBillingPeriod: selectEndOfBillingPeriod(state),
    pending: isPending,
    hasSetupDocumentationPanel,
    hasAddSendingDomainLink: hasGrants('sending_domains/manage')(state),
    hasGenerateApiKeyLink: hasGrants('api_keys/manage')(state),
    hasUpgradeLink: hasGrants('account/manage')(state),
  };
}

const mapDispatchToProps = {
  getAccount,
  getUsage,
  listAlerts,
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
