import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Page } from '@sparkpost/matchbox';
import { fetch as fetchAccount, getPlans, getBillingInfo, getUsage } from 'src/actions/account';
import { list as getSendingIps } from 'src/actions/sendingIps';
import { selectBillingInfo, selectAccountBilling } from 'src/selectors/accountBillingInfo';
import { selectAccountAgeInDays } from 'src/selectors/accountAge';
import ConditionSwitch, { defaultCase } from 'src/components/auth/ConditionSwitch';
import { not } from 'src/helpers/conditions';
import { isSuspendedForBilling, isSelfServeBilling, hasAccountOptionEnabled } from 'src/helpers/conditions/account';
import { Loading } from 'src/components';
import BillingSummary from './components/BillingSummary';
import ManuallyBilledBanner from './components/ManuallyBilledBanner';
import SuspendedForBilling from './components/SuspendedForBilling';
import { list as getInvoices } from 'src/actions/invoices';

export class BillingSummaryPage extends Component {

  componentDidMount() {
    this.props.fetchAccount();
    this.props.getBillingInfo();
    this.props.getPlans();
    this.props.getSendingIps();
    this.props.getInvoices();
    this.props.getUsage();
  }

  render() {
    const { loading, account, billingInfo, sendingIps, invoices, accountAgeInDays, hasRecipientValidation } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Page title='Billing'>
        <ConditionSwitch>
          <SuspendedForBilling condition={isSuspendedForBilling} account={account} />
          <ManuallyBilledBanner condition={not(isSelfServeBilling)} account={account} onZuoraPlan={billingInfo.onZuoraPlan} />
          <BillingSummary
            condition={defaultCase}
            hasRecipientValidation={hasRecipientValidation}
            account={account}
            {...billingInfo} invoices={invoices}
            sendingIps={sendingIps}
            accountAgeInDays={accountAgeInDays}
          />
        </ConditionSwitch>
      </Page>
    );
  }
}

const mapStateToProps = (state) => {
  const { account, loading } = selectAccountBilling(state);
  return ({
    loading: loading || state.billing.plansLoading || !state.account.subscription,
    account,
    accountAgeInDays: selectAccountAgeInDays(state),
    billingInfo: selectBillingInfo(state),
    sendingIps: state.sendingIps.list,
    invoices: state.invoices.list,
    hasRecipientValidation: hasAccountOptionEnabled('recipient_validation')(state)
  });
};

export default connect(mapStateToProps, { getInvoices, getSendingIps, getPlans, fetchAccount, getBillingInfo, getUsage })(BillingSummaryPage);
