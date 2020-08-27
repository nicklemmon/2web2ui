import React from 'react';
import { connect } from 'react-redux';
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

  return {
    currentUser: state.currentUser,
    currentPlanName: currentPlanNameSelector(state),
    recentAlerts: selectRecentlyTriggeredAlerts(state),
    transmissionsThisMonth: selectMonthlyTransmissionsUsage(state),
    transmissionsInPlan: selectTransmissionsInPlan(state),
    validationsThisMonth: selectMonthlyRecipientValidationUsage(state),
    endOfBillingPeriod: selectEndOfBillingPeriod(state),
    pending: isPending,
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
