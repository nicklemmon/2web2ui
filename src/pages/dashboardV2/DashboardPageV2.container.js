import React from 'react';
import { connect } from 'react-redux';
import { ROLES } from 'src/constants';
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

  return {
    currentUser: state.currentUser,
    currentPlanName: currentPlanNameSelector(state),
    recentAlerts: selectRecentlyTriggeredAlerts(state),
    transmissionsThisMonth: selectMonthlyTransmissionsUsage(state),
    transmissionsInPlan: selectTransmissionsInPlan(state),
    validationsThisMonth: selectMonthlyRecipientValidationUsage(state),
    endOfBillingPeriod: selectEndOfBillingPeriod(state),
    pending: isPending,
    hasSetupDocumentationPanel: userRole === ROLES.ADMIN || userRole === ROLES.DEVELOPER,
    hasAddSendingDomainLink: userRole === ROLES.ADMIN || userRole === ROLES.DEVELOPER, // TODO: Replace with grants
    hasGenerateApiKeyLink: userRole === ROLES.ADMIN || userRole === ROLES.DEVELOPER, // TODO: Replace with grants
    hasUpgradeLink: userRole === ROLES.ADMIN, // TODO: Replace with grants
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
