import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// components
import { LabelledValue } from 'src/components';
import { SubduedText } from 'src/components/text';
import { UnstyledLink } from 'src/components/matchbox';
import VerifyEmail from './VerifyEmail';
import { SendingDomainSection } from './SendingDomainSection';
import SetupInstructionPanel from './SetupInstructionPanel';

// actions
import { showAlert } from 'src/actions/globalAlert';
import { verifyDkim } from 'src/actions/sendingDomains';
import { updateUserUIOptions, get as getCurrentUser } from 'src/actions/currentUser';
import { hasAutoVerifyEnabledSelector } from 'src/selectors/account';
import { selectCondition } from 'src/selectors/accessConditionState';
import { isUserUiOptionSet } from 'src/helpers/conditions/user';
import { resolveReadyFor } from 'src/helpers/domains';
import { trackCustomConversionGoal } from 'src/helpers/vwo';
import config from 'src/config';

export class SetupSending extends Component {
  state = {
    // verify via email modal
    open: false,
  };

  verifyDomain = () => {
    const {
      domain: { id, subaccount_id: subaccount },
      verifyDkim,
      showAlert,
      sawVideoWhileSignUp,
    } = this.props;

    return verifyDkim({ id, subaccount }).then(results => {
      const readyFor = resolveReadyFor(results);

      switch (sawVideoWhileSignUp) {
        case 'true':
          trackCustomConversionGoal([204]);
          this.props.updateUserUIOptions({ sawVideoWhileSignUp: 'vwo goal triggered' }).then(() => {
            this.props.getCurrentUser();
          });
          break;
        case 'false':
          trackCustomConversionGoal([205]);
          this.props.updateUserUIOptions({ sawVideoWhileSignUp: 'vwo goal triggered' }).then(() => {
            this.props.getCurrentUser();
          });
          break;
        default:
          break;
      }

      if (readyFor.dkim) {
        showAlert({
          type: 'success',
          message: `You have successfully verified DKIM record of ${id}`,
        });
      } else {
        showAlert({
          type: 'error',
          message: `Unable to verify DKIM record of ${id}. ${results.dns.dkim_error}`,
        });
      }
    });
  };

  renderText() {
    const { domain } = this.props;
    const readyFor = resolveReadyFor(domain.status);
    let content = null;

    if (!readyFor.sending && !readyFor.dkim) {
      content = (
        <SubduedText mt="300">
          <strong>To use this domain for sending</strong>, add this TXT record to your DNS settings,
          paying close attention to the specified hostname.
        </SubduedText>
      );

      // Append second paragraph for mailbox verification
      if (config.featureFlags.allow_mailbox_verification) {
        content = (
          <React.Fragment>
            {content}
            <SubduedText mt="300">
              We recommend DNS verification, but if you don't have DNS access, you can{' '}
              <UnstyledLink id="verify-with-email" onClick={this.toggleVerifyViaEmailModal}>
                {' '}
                set this domain up for sending via email.
              </UnstyledLink>
            </SubduedText>
            {this.state.open && (
              <VerifyEmail
                id={domain.id}
                open={this.state.open}
                onCancel={this.toggleVerifyViaEmailModal}
                subaccount={domain.subaccount_id}
              />
            )}
          </React.Fragment>
        );
      }
    }

    if (readyFor.sending && !readyFor.dkim) {
      content = (
        <SubduedText mt="300">
          This domain is <strong>ready for sending</strong>, but if you plan to use it for sending,
          we still recommend that you add this TXT record to make it <strong>ready for DKIM</strong>{' '}
          as well.
        </SubduedText>
      );
    }

    return content;
  }

  toggleVerifyViaEmailModal = () => {
    this.setState({ open: !this.state.open });
  };

  renderTxtRecordPanel() {
    const {
      domain: { dkimHostname, dkimValue, status },
      hasAutoVerifyEnabled,
      verifyDkimLoading,
    } = this.props;
    const readyFor = resolveReadyFor(status);

    return (
      <SetupInstructionPanel
        isAutoVerified={hasAutoVerifyEnabled}
        isVerified={readyFor.sending && readyFor.dkim}
        isVerifying={verifyDkimLoading}
        onVerify={this.verifyDomain}
        recordType="TXT"
        verifyButtonIdentifier="verify-dkim"
      >
        <LabelledValue label="Type">
          <p>TXT</p>
        </LabelledValue>
        <LabelledValue label="Hostname">
          <p>{dkimHostname}</p>
        </LabelledValue>
        <LabelledValue label="Value">
          <p>{dkimValue}</p>
        </LabelledValue>
      </SetupInstructionPanel>
    );
  }

  render() {
    return (
      <SendingDomainSection title="Set Up For Sending">
        <SendingDomainSection.Left>{this.renderText()}</SendingDomainSection.Left>
        <SendingDomainSection.Right>{this.renderTxtRecordPanel()}</SendingDomainSection.Right>
      </SendingDomainSection>
    );
  }
}

const mapStateToProps = state => ({
  hasAutoVerifyEnabled: hasAutoVerifyEnabledSelector(state),
  verifyDkimError: state.sendingDomains.verifyDkimError,
  verifyDkimLoading: state.sendingDomains.verifyDkimLoading,
  sawVideoWhileSignUp: selectCondition(isUserUiOptionSet('sawVideoWhileSignUp'))(state),
});

export default withRouter(
  connect(mapStateToProps, { verifyDkim, showAlert, updateUserUIOptions, getCurrentUser })(
    SetupSending,
  ),
);
