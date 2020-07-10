import { connect } from 'react-redux';
import { showAlert } from 'src/actions/globalAlert';

import {
  getAccountSingleSignOnDetails,
  updateAccountSingleSignOn,
} from 'src/actions/accountSingleSignOn';

import { getTfaStatus } from 'src/actions/tfa';

import { logout } from 'src/actions/auth';

import { update as updateAccount } from 'src/actions/account';

import EnforceTfaPanel from './EnforceTfaPanel';
import { getBundleTierByPlanCode } from 'src/selectors/accountBillingInfo';

const mapStateToProps = state => {
  const { accountSingleSignOn, account, tfa } = state;
  return {
    loading: accountSingleSignOn.loading || tfa.enabled === null,
    ssoEnabled: accountSingleSignOn.enabled,
    tfaRequired:
      getBundleTierByPlanCode(state) === 'starter' && account.tfa_required
        ? false
        : account.tfa_required,
    tfaUpdatePending: account.updateLoading,
    tfaEnabled: tfa.enabled,
  };
};

const mapDispatchToProps = {
  getAccountSingleSignOnDetails,
  getTfaStatus,
  updateAccountSingleSignOn,
  updateAccount,
  logout,
  showAlert,
};

export default connect(mapStateToProps, mapDispatchToProps)(EnforceTfaPanel);
