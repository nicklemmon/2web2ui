import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Setup } from 'src/components/images';
import { PageLink } from 'src/components/links';
import { Page } from 'src/components/matchbox';

import { listApiKeys, hideNewApiKey } from 'src/actions/api-keys';
import { list as listSubaccounts } from 'src/actions/subaccounts';

import {
  Loading,
  Subaccount,
  TableCollection,
  ApiErrorBanner,
  ApiKeySuccessBanner,
  ShortKeyCode,
} from 'src/components';
import { filterBoxConfig } from './tableConfig';
import { selectKeysForAccount } from 'src/selectors/api-keys';
import { hasSubaccounts } from 'src/selectors/subaccounts';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import { LINKS } from 'src/constants';

const primaryAction = {
  content: 'Create API Key',
  Component: PageLink,
  to: '/account/api-keys/create',
};

export class ListPage extends Component {
  state = { copied: false };

  // only want to show the new key after a create
  componentWillUnmount() {
    this.props.hideNewApiKey();
  }

  componentDidMount() {
    this.props.listApiKeys();
    if (hasSubaccounts && this.props.subaccounts.length === 0) {
      this.props.listSubaccounts();
    }
  }

  getLabel = ({ canCurrentUserEdit, id, subaccount_id, label }) => {
    if (canCurrentUserEdit) {
      return (
        <PageLink to={`/account/api-keys/edit/${id}${setSubaccountQuery(subaccount_id)}`}>
          {label}
        </PageLink>
      );
    } else {
      return (
        <PageLink to={`/account/api-keys/view/${id}${setSubaccountQuery(subaccount_id)}`}>
          {label}
        </PageLink>
      );
    }
  };

  getRowData = key => {
    const { short_key, subaccount_id, subaccount_name } = key;
    const { hasSubaccounts } = this.props;
    const rowData = [this.getLabel(key), <ShortKeyCode shortKey={short_key} />];

    if (hasSubaccounts) {
      rowData.push(<Subaccount id={subaccount_id} name={subaccount_name} shrinkLength={12} />);
    }

    return rowData;
  };

  getColumns = () => {
    const { hasSubaccounts } = this.props;
    const columns = [{ label: 'Name', width: '40%', sortKey: 'label' }, { label: 'Key' }];

    if (hasSubaccounts) {
      columns.push({ label: 'Subaccount', width: '20%', sortKey: 'subaccount_id' });
    }

    return columns;
  };

  onReloadApiBanner = () => {
    this.props.listApiKeys();
  };

  renderBanner() {
    return <ApiKeySuccessBanner title="New API Key" />;
  }

  renderCollection() {
    const { keys } = this.props;

    return (
      <TableCollection
        columns={this.getColumns()}
        getRowData={this.getRowData}
        pagination={true}
        rows={keys}
        filterBox={filterBoxConfig}
        defaultSortColumn="label"
        defaultSortDirection="desc"
      />
    );
  }

  renderError() {
    return (
      <ApiErrorBanner
        errorDetails={this.props.error.message}
        message="Sorry, we seem to have had some trouble loading your API keys."
        reload={this.onReloadApiBanner}
      />
    );
  }

  render() {
    const { error, loading, newKey, keys } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Page
        primaryAction={primaryAction}
        title="API Keys"
        empty={{
          show: keys.length === 0,
          image: Setup,
          content: <p>Create an API key you can use to access our REST or SMTP API services.</p>,
          secondaryAction: {
            content: 'View our API Docs',
            external: true,
            to: LINKS.API_DOCS,
          },
        }}
      >
        {newKey && this.renderBanner()}
        {error ? this.renderError() : this.renderCollection()}
      </Page>
    );
  }
}

const mapStateToProps = state => {
  const { error, newKey, keysLoading } = state.apiKeys;
  return {
    hasSubaccounts: hasSubaccounts(state),
    subaccounts: state.subaccounts.list,
    keys: selectKeysForAccount(state),
    error,
    newKey,
    loading: keysLoading,
  };
};

export default connect(mapStateToProps, { listApiKeys, listSubaccounts, hideNewApiKey })(ListPage);
