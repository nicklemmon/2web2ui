import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Panel, Stack } from 'src/components/matchbox';
import EnableTfaForm from 'src/components/enableTfaForm/EnableTfaForm';
import RedirectAfterLogin from './components/RedirectAfterLogin';
import { login } from 'src/actions/auth';

export class EnableTfaPage extends React.Component {
  state = {};

  afterEnable = () => {
    const { token, username, refreshToken } = this.props.tfa;
    this.props.login({
      authData: {
        access_token: token,
        username,
        refresh_token: refreshToken,
      },
      saveCookie: true,
    });
  };

  render() {
    const { loggedIn } = this.props;

    if (loggedIn) {
      return <RedirectAfterLogin />;
    }

    return (
      <Panel.LEGACY sectioned title="Enable Two Factor Authentication">
        <Stack>
          <p>
            Your administrator requires all users on this account to use two factor authentication.
          </p>
          <EnableTfaForm afterEnable={this.afterEnable} />
        </Stack>
      </Panel.LEGACY>
    );
  }
}

const mapStateToProps = ({ auth, tfa }) => ({
  loggedIn: auth.loggedIn,
  tfa,
});

export default withRouter(connect(mapStateToProps, { login })(EnableTfaPage));
