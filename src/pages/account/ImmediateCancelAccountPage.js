import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApiErrorBanner, Loading } from 'src/components';
import { cancelAccount, fetch as fetchAccount } from 'src/actions/account';
import styles from './ImmediateCancelAccountPage.module.scss';
import { showAlert } from 'src/actions/globalAlert';
import { segmentTrack, SEGMENT_EVENTS } from 'src/helpers/segment';

const ACCOUNT_SETTINGS_ROUTE = '/account/settings';

export const LOAD_STATE = {
  PENDING: 1,
  SUCCESS: 2,
  FAILURE: 3,
};

export class ImmediateCancelAccountPage extends Component {
  state = {
    loading: LOAD_STATE.PENDING,
  };

  componentDidMount() {
    return this.handlePlanCancellation();
  }

  handlePlanCancellation = () => {
    const { cancelAccount, history, showAlert, fetchAccount } = this.props;
    this.setState({ loading: LOAD_STATE.PENDING });
    return cancelAccount()
      .then(
        () => {
          fetchAccount();
          segmentTrack(SEGMENT_EVENTS.ACCOUNT_CANCELLED);
        },
        error => {
          this.setState({ loading: LOAD_STATE.FAILURE, error });
        },
      )
      .then(
        () => {
          showAlert({
            message: 'Your plan is set to be cancelled.',
            type: 'success',
          });
          history.replace(ACCOUNT_SETTINGS_ROUTE);
        },
        error => {
          this.setState({ loading: LOAD_STATE.FAILURE, error });
        },
      );
  };

  renderError() {
    return (
      <div className={styles.ErrorBanner}>
        <ApiErrorBanner
          errorDetails={this.state.error.message}
          message="Sorry, we had some trouble cancelling your plan."
          reload={this.handlePlanCancellation}
        />
      </div>
    );
  }

  render() {
    const { loading } = this.state;

    if (loading === LOAD_STATE.PENDING) {
      return <Loading />;
    }

    return (
      <div className={styles.MessageBlock}>
        {loading === LOAD_STATE.FAILURE && this.renderError()}
      </div>
    );
  }
}

const mapDispatchToProps = {
  cancelAccount,
  showAlert,
  fetchAccount,
};

export default withRouter(connect(null, mapDispatchToProps)(ImmediateCancelAccountPage));
