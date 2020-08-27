import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Loading } from 'src/components';
import { PageLink } from 'src/components/links';
import { Page, Panel } from 'src/components/matchbox';

import SubaccountCreateForm from './components/SubaccountCreateForm';

import { create as createSubaccount } from 'src/actions/subaccounts';
import { listSubaccountGrants } from 'src/actions/api-keys';
import { listPools } from 'src/actions/ipPools';
import { showAlert } from 'src/actions/globalAlert';

const breadcrumbAction = {
  content: 'Subaccounts',
  Component: PageLink,
  to: '/account/subaccounts',
};

export class CreatePage extends Component {
  componentDidMount() {
    this.props.listSubaccountGrants();
    this.props.listPools();
  }

  onSubmit = values => {
    const { createSubaccount, history, showAlert } = this.props;

    return createSubaccount(values).then(({ subaccount_id }) => {
      showAlert({ type: 'success', message: `Subaccount ${subaccount_id} created` });
      history.push(`/account/subaccounts/${subaccount_id}`);
    });
  };

  render() {
    if (this.props.loading) {
      return <Loading />;
    }

    return (
      <div>
        <Page title="Create Subaccount" breadcrumbAction={breadcrumbAction} />
        <Panel.LEGACY>
          <SubaccountCreateForm onSubmit={this.onSubmit} />
        </Panel.LEGACY>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.apiKeys.subaccountGrantsLoading || state.ipPools.listLoading,
});

export default withRouter(
  connect(mapStateToProps, { listSubaccountGrants, listPools, createSubaccount, showAlert })(
    CreatePage,
  ),
);
