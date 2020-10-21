import React, { Component } from 'react';
import { connect } from 'react-redux';
import { list as listDomains } from 'src/actions/sendingDomains';
import { list as listSubaccounts } from 'src/actions/subaccounts';

import { hasSubaccounts } from 'src/selectors/subaccounts';
import { hasUnverifiedDomains, selectDomains } from 'src/selectors/sendingDomains';
import {
  Loading,
  TableCollection,
  Subaccount,
  DomainStatusCell,
  StatusTooltipHeader,
  ApiErrorBanner,
} from 'src/components';
import { Page } from 'src/components/matchbox';
import { Setup } from 'src/components/images';
import { PageLink } from 'src/components/links';
import UnverifiedWarningBanner from './components/UnverifiedWarningBanner';
import VerifyToken from './components/VerifyToken';
import { LINKS } from 'src/constants';

export class ListPage extends Component {
  componentDidMount() {
    this.props.listDomains();
    if (hasSubaccounts && this.props.subaccounts.length === 0) {
      this.props.listSubaccounts();
    }
  }

  getColumns = () => {
    const { hasSubaccounts } = this.props;

    const columns = [
      { label: 'Domain', width: '30%', sortKey: 'domain' },
      { label: <StatusTooltipHeader />, width: '40%' },
    ];

    if (hasSubaccounts) {
      columns.push({
        label: 'Subaccount',
        width: '20%',
        sortKey: sd => [sd.subaccount_id, sd.shared_with_subaccounts],
      });
    }

    return columns;
  };

  getRowData = row => {
    const { hasSubaccounts } = this.props;
    const { domain, shared_with_subaccounts, subaccount_id, subaccount_name } = row;

    const rowData = [
      <PageLink to={`/account/sending-domains/edit/${domain}`}>{domain}</PageLink>,
      <DomainStatusCell domain={row} />,
    ];

    if (hasSubaccounts) {
      const subaccountCol =
        subaccount_id || shared_with_subaccounts ? (
          <Subaccount
            all={shared_with_subaccounts}
            id={subaccount_id}
            name={subaccount_name}
            shrinkLength={12}
          />
        ) : null;

      rowData.push(subaccountCol);
    }

    return rowData;
  };

  renderCollection() {
    return (
      <TableCollection
        columns={this.getColumns()}
        getRowData={this.getRowData}
        pagination={true}
        rows={this.props.domains}
        filterBox={{
          show: true,
          itemToStringKeys: ['domain'],
          keyMap: { default: 'is_default_bounce_domain' },
          exampleModifiers: ['domain', 'subaccount_id', 'default'],
        }}
        defaultSortColumn="domain"
      />
    );
  }

  renderError() {
    return (
      <ApiErrorBanner
        errorDetails={this.props.listError.message}
        message="Sorry, we seem to have had some trouble loading your domains."
        reload={this.props.listDomains}
      />
    );
  }

  render() {
    const { listError, listLoading, domains, hasUnverifiedDomains } = this.props;

    if (listLoading) {
      return <Loading />;
    }

    const primaryAction = {
      content: 'Add a Domain',
      Component: PageLink,
      to: {
        pathname: '/account/sending-domains/create',
        state: { triggerGuide: this.props.location?.state?.triggerGuide },
      },
    };

    return (
      <Page
        title="Sending Domains"
        primaryAction={primaryAction}
        empty={{
          show: domains.length === 0,
          title: 'Manage Your Domains',
          content: <p>Create and configure your sending and bounce domains.</p>,
          image: Setup,
          secondaryAction: {
            content: 'Learn more',
            to: LINKS.SENDING_SETUP,
            external: true,
          },
        }}
      >
        <VerifyToken />
        {hasUnverifiedDomains && <UnverifiedWarningBanner />}
        {listError ? this.renderError() : this.renderCollection()}
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  domains: selectDomains(state),
  listError: state.sendingDomains.listError,
  hasSubaccounts: hasSubaccounts(state),
  hasUnverifiedDomains: hasUnverifiedDomains(state),
  listLoading: state.sendingDomains.listLoading,
  subaccounts: state.subaccounts.list,
});

export default connect(mapStateToProps, { listDomains, listSubaccounts })(ListPage);
