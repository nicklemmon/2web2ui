import React from 'react';
import { connect } from 'react-redux';
import { authenticate } from 'src/actions/auth';
import { CenteredLogo } from 'src/components';
import { PageLink } from 'src/components/links';
import { Panel } from 'src/components/matchbox';
import qs from 'query-string';

import config from 'src/config';
import LoginForm from './components/LoginForm';
import RedirectBeforeLogin from './components/RedirectBeforeLogin';
import RedirectAfterLogin from './components/RedirectAfterLogin';
import { TFA_ROUTE, ENABLE_TFA_AUTH_ROUTE, SSO_AUTH_ROUTE } from 'src/constants';

export class AuthPage extends React.Component {
  componentDidMount() {
    const { username, access_token, authenticate } = this.props;
    // username required as we don't have context for who's token
    if (username && access_token) {
      authenticate(username, null, false, access_token);
    }
  }

  loginSubmit = ({ username, password, rememberMe }) => {
    this.props.authenticate(username, password, rememberMe);
  };

  render() {
    const { loggedIn, tfaEnabled, tfaRequired } = this.props;

    const hasSignup = (config.featureFlags || {}).has_signup;

    if (loggedIn) {
      return <RedirectAfterLogin />;
    }

    if (tfaEnabled) {
      return <RedirectBeforeLogin to={TFA_ROUTE} />;
    }

    if (tfaRequired) {
      return <RedirectBeforeLogin to={ENABLE_TFA_AUTH_ROUTE} />;
    }

    return (
      <React.Fragment>
        <CenteredLogo />
        <Panel.LEGACY sectioned title="Log In">
          <LoginForm onSubmit={this.loginSubmit} />
        </Panel.LEGACY>
        <Panel.LEGACY.Footer
          left={
            hasSignup && (
              <div>
                <small>
                  Don't have an account? <PageLink to="/join">Sign up</PageLink>.
                </small>
                <br />
              </div>
            )
          }
          right={
            <small>
              <PageLink to={SSO_AUTH_ROUTE}>Single Sign-On</PageLink>
            </small>
          }
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ auth, tfa }, { location }) => {
  const { token: access_token, username } = qs.parse(location.search);

  return {
    loggedIn: auth.loggedIn,
    tfaEnabled: tfa.enabled,
    tfaRequired: tfa.required,
    access_token,
    username,
  };
};

export default connect(mapStateToProps, { authenticate })(AuthPage);
