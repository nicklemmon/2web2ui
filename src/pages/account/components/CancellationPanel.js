import React, { useState } from 'react';
import { connect } from 'react-redux';
import { fetch as fetchAccount, renewAccount } from 'src/actions/account';
import { Heading } from 'src/components/text';
import { ConfirmationModal } from 'src/components';
import { Button, Panel, Stack } from 'src/components/matchbox';
import { showAlert } from 'src/actions/globalAlert';
import { GUIDE_IDS } from 'src/constants';
import { formatDate } from 'src/helpers/date';
import { withRouter } from 'react-router-dom';
import ErrorTracker from 'src/helpers/errorTracker';
const ACCOUNT_CANCEL_LINK = '/account/cancel';

export function CancellationPanel(props) {
  const [showCancelAccountModal, setShowCancelAccountModal] = useState(false);
  const onRenewAccount = () => {
    const { renewAccount, fetchAccount, showAlert } = props;
    return renewAccount().then(() => {
      showAlert({ type: 'success', message: 'Your account will not be cancelled.' });
      return fetchAccount();
    });
  };

  const handleCancelAccount = () => {
    try {
      window.Appcues.show(GUIDE_IDS.CANCEL_ACCOUNT);
    } catch (error) {
      ErrorTracker.report('account-cancellation-guide-warning', error, {
        level: 'warning',
      });
      setShowCancelAccountModal(true);
    }
  };

  const handleCancel = () => {
    props.history.push(ACCOUNT_CANCEL_LINK);
  };

  const toggleCancel = () => {
    setShowCancelAccountModal(false);
  };

  const { account } = props;
  const { pending_cancellation, cancelLoading } = account;

  if (pending_cancellation) {
    return (
      <Panel.LEGACY title="Pending Account Cancellation">
        <Panel.LEGACY.Section>
          <Stack>
            <Heading as="h3" looksLike="h6">
              Account is set to cancel {formatDate(pending_cancellation.effective_date)}
            </Heading>

            <p>
              You can undo your cancellation at anytime <strong>before</strong> 8:00 UTC on your
              cancel date. We hope you decide to stay!
            </p>
          </Stack>
        </Panel.LEGACY.Section>

        <Panel.LEGACY.Section>
          <Button variant="primary" disabled={cancelLoading} onClick={onRenewAccount}>
            Don't cancel my account!
          </Button>
        </Panel.LEGACY.Section>
      </Panel.LEGACY>
    );
  }

  return (
    <>
      <Panel.LEGACY title="Request Account Cancellation">
        <Panel.LEGACY.Section>
          <Stack>
            <p>
              If you choose to cancel your account, it will be cancelled at the end of your billing
              cycle. You can change your mind at any time until 8am UTC on the date of cancellation.
            </p>
            <div>
              <span>Before your cancellation date:</span>
              <ul>
                <li>You can continue to send up to your monthly limit.</li>
                <li>You may not go into overage.</li>
                <li>You may not use our recipient validation feature.</li>
              </ul>
            </div>
            <div>
              <span>After your cancellation date:</span>
              <ul>
                <li>You will no longer be able to log in using your account credentials.</li>
                <li>
                  You will no longer be able to send email or make API calls using your API keys.
                </li>
                <li>
                  Any dedicated IPs on your account will be unrecoverable and may be assigned to
                  other SparkPost accounts.
                </li>
              </ul>
            </div>
          </Stack>
        </Panel.LEGACY.Section>
        <Panel.LEGACY.Section>
          <Button variant="destructive" onClick={handleCancelAccount}>
            Cancel Account
          </Button>
        </Panel.LEGACY.Section>
      </Panel.LEGACY>
      <ConfirmationModal
        open={showCancelAccountModal}
        title="Are you sure you want to cancel your account?"
        content={
          <p>
            If you cancel, you can send emails up to your monthly limit before your cancel date, but
            you cannot overage past that. You will not be able to validate email addresses using
            recipient validation. Any dedicated IPs assigned to your account will be unrecoverable
            after your cancel date and might be assigned to other SparkPost accounts.
          </p>
        }
        onConfirm={handleCancel}
        onCancel={toggleCancel}
        confirmVerb="Cancel My Account"
        cancelVerb="Keep My Account"
      />
    </>
  );
}

const mapStateToProps = ({ account }) => ({
  account,
});

export default withRouter(
  connect(mapStateToProps, { fetchAccount, renewAccount, showAlert })(CancellationPanel),
);
