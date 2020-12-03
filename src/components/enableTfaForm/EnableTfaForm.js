import React from 'react';
import { connect } from 'react-redux';
import { VpnKey } from '@sparkpost/matchbox-icons';
import { QRCode } from 'react-qr-svg';
import styled from 'styled-components';
import ButtonWrapper from 'src/components/buttonWrapper';
import { Button, Grid, Panel, Stack, TextField } from 'src/components/matchbox';
import { Loading } from 'src/components/loading/Loading';
import { getTfaSecret, toggleTfa, setPhoneNumber } from 'src/actions/tfa';
import { showAlert } from 'src/actions/globalAlert';
import EnableTfaFormPropTypes from './EnableTfaForm.propTypes';
import { usernameSelector } from 'src/selectors/currentUser';
import styles from './EnableTfaForm.module.scss';

const RightAlignedText = styled.div`
  text-align: 'right';
`;

const QRIcon = styled.div`
  width: 230px;
`;

export class EnableTfaForm extends React.Component {
  state = {
    phoneNumber: '',
    code: '',
  };

  componentDidMount() {
    this.props.getTfaSecret();
  }

  componentDidUpdate(prevProps) {
    const { togglePending, toggleError, showAlert, afterEnable } = this.props;
    // If we just finished a toggle operation without an error, hit the afterEnable callback.
    if (prevProps.togglePending && !togglePending && !toggleError) {
      showAlert({ type: 'success', message: 'Two-factor authentication enabled' });
      afterEnable();
    }
  }

  handleInputChange = ({ target }) => {
    this.setState({ code: target.value });
  };

  handlePhoneNumberChange = ({ target }) => {
    this.setState({ phoneNumber: target.value });
  };

  onEnable = () => {
    const { toggleTfa } = this.props;
    return toggleTfa({ enabled: true, code: this.state.code });
  };

  onSubmitPhoneNumber = () => {
    const { setPhoneNumber } = this.props;
    return setPhoneNumber({ phoneNumber: this.state.phoneNumber });
  };

  renderForm() {
    return (
      <RenderedForm
        {...this.props}
        code={this.state.code}
        handleInputChange={this.handleInputChange}
        onEnable={this.onEnable}
        onSubmitPhoneNumber={this.onSubmitPhoneNumber}
        handlePhoneNumberChange={this.handlePhoneNumberChange}
      />
    );
  }

  render() {
    return this.renderForm();
  }
}

export const RenderedForm = props => {
  const {
    code,
    phoneNumber,
    handleInputChange,
    handlePhoneNumberChange,
    onClose,
    onEnable,
    onSubmitPhoneNumber,
    updatePhoneNumberPending,
    updatePhoneNumberError,
    secret,
    togglePending,
    toggleError,
    username,
  } = props;

  if (!secret) {
    return (
      <div className={styles.Loading}>
        <Loading />
      </div>
    );
  }

  const qrData = `otpauth://totp/${username}?secret=${encodeURIComponent(secret)}&issuer=SparkPost`;

  return (
    <form onSubmit={e => e.preventDefault()}>
      <Panel.LEGACY.Section>
        <Stack space="600">
          <Grid>
            <Grid.Column xs={12} md={7}>
              <Stack>
                <h6>Step 1: Configure your 2FA app</h6>
                <p>
                  To enable 2FA, you'll need to have a 2FA auth app installed on your phone or
                  tablet (examples include Google Authenticator, Duo Mobile, and Authy).
                </p>
                <p>
                  Most apps will let you get set up by scanning our QR code from within the app. If
                  you prefer, you can type in the key manually.
                </p>
                <p>
                  <strong>
                    <VpnKey /> <code>{secret}</code>
                  </strong>
                </p>
              </Stack>
            </Grid.Column>
            <Grid.Column xs={12} md={5}>
              <RightAlignedText>
                <QRIcon as={QRCode} bgColor="#FFFFFF" fgColor="#000000" level="Q" value={qrData} />
              </RightAlignedText>
            </Grid.Column>
          </Grid>
          <Grid>
            <Grid.Column xs={12} md={7}>
              <Stack>
                <h6>Step 2: Enter a phone number (Optional)</h6>
                <p>Enter a phone number if you choose to recieve 2FA codes via SMS.</p>
                <TextField
                  id="tfa-setup-phone-number"
                  required={true}
                  data-lpignore={true}
                  label="Phone number"
                  error={
                    updatePhoneNumberError
                      ? 'Problem adding you phone number, please try again'
                      : ''
                  }
                  placeholder="Enter your phone number (optional)"
                  onChange={handlePhoneNumberChange}
                  value={phoneNumber}
                />
                <ButtonWrapper>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={updatePhoneNumberPending}
                    onClick={onSubmitPhoneNumber}
                  >
                    {updatePhoneNumberPending ? 'Updating' : 'Add Phone Number'}
                  </Button>
                </ButtonWrapper>
              </Stack>
            </Grid.Column>
          </Grid>
          <Grid>
            <Grid.Column xs={12} md={7}>
              <Stack>
                <h6>Step 3: Enter a 2FA code</h6>
                <p>
                  Generate a code from your newly-activated 2FA app (or enter one we sent to your
                  phone number) to confirm that you're all set up.
                </p>
                <TextField
                  id="tfa-setup-passcode"
                  required={true}
                  data-lpignore={true}
                  label="Passcode"
                  error={toggleError ? 'Problem verifying your code, please try again' : ''}
                  placeholder="Enter a generated 2FA passcode"
                  onChange={handleInputChange}
                  value={code}
                />
              </Stack>
            </Grid.Column>
          </Grid>
        </Stack>
      </Panel.LEGACY.Section>

      <Panel.LEGACY.Section>
        <ButtonWrapper>
          <Button type="submit" variant="primary" disabled={togglePending} onClick={onEnable}>
            {togglePending ? 'Verifying Code...' : 'Enable 2FA'}
          </Button>
          {onClose && (
            <Button variant="secondary" disabled={togglePending} onClick={onClose}>
              Cancel
            </Button>
          )}
        </ButtonWrapper>
      </Panel.LEGACY.Section>
    </form>
  );
};

EnableTfaForm.propTypes = EnableTfaFormPropTypes;

const mapStateToProps = state => ({
  ...state.tfa,
  username: state.currentUser.email || usernameSelector(state),
  enabled: state.tfa.enabled === true,
});

export default connect(mapStateToProps, {
  getTfaSecret,
  setPhoneNumber,
  toggleTfa,
  showAlert,
})(EnableTfaForm);
