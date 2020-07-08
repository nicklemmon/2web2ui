import React, { Component } from 'react';
import { connect } from 'react-redux';
import { listPools } from 'src/actions/ipPools';
import { Loading, TableCollection, ApiErrorBanner } from 'src/components';
import { PageLink, SupportTicketLink } from 'src/components/links';
import { Banner, Page, Stack } from 'src/components/matchbox';
import { openSupportTicketForm } from 'src/actions/support';
import { not } from 'src/helpers/conditions';
import { selectCondition } from 'src/selectors/accessConditionState';
import { getOrderedIpPools, shouldShowIpPurchaseCTA } from 'src/selectors/ipPools';
import { isSelfServeBilling } from 'src/helpers/conditions/account';

const columns = [
  { label: 'Name', sortKey: 'name', width: '40%' },
  { label: 'ID', sortKey: 'id', width: '40%' },
  {
    label: 'Number of IPs Assigned',
    align: 'right',
    sortKey: pool => pool.ips.length,
    width: '35%',
  },
];

export const getRowData = ({ id, name, ips }) => {
  const nameLink = <PageLink to={`/account/ip-pools/edit/${id}`}>{name}</PageLink>;

  return [nameLink, id, <div style={{ textAlign: 'right' }}>{ips.length.toString()}</div>];
};

export class IpPoolsList extends Component {
  componentDidMount() {
    this.props.listPools();
  }

  renderError() {
    const { error, listPools } = this.props;
    return (
      <ApiErrorBanner
        message="Sorry, we seem to have had some trouble loading your ip pools."
        errorDetails={error.message}
        reload={listPools}
      />
    );
  }

  renderCollection() {
    const { ipPools } = this.props;

    return (
      <TableCollection
        columns={columns}
        rows={ipPools}
        getRowData={getRowData}
        pagination={true}
        filterBox={{
          show: true,
          exampleModifiers: ['name', 'id'],
          itemToStringKeys: ['name', 'id'],
        }}
      />
    );
  }

  render() {
    const { loading, error, showPurchaseCTA, isManuallyBilled, openSupportTicketForm } = this.props;

    if (loading) {
      return <Loading />;
    }

    const createAction = {
      content: 'Create IP Pool',
      Component: PageLink,
      to: '/account/ip-pools/create',
    };
    const purchaseActions = showPurchaseCTA
      ? isManuallyBilled
        ? [
            {
              content: 'Request IPs',
              onClick: () => openSupportTicketForm({ issueId: 'request_new_ip' }),
            },
          ]
        : [{ content: 'Purchase IPs', Component: PageLink, to: '/account/billing' }]
      : null;

    return (
      <Page primaryAction={createAction} secondaryActions={purchaseActions} title="IP Pools">
        <Banner
          status="info"
          title="SparkPost now supports Strict TLS and Custom Messaging Expiration"
          marginBottom="500"
        >
          <Stack>
            <p>
              To adjust these settings, please{' '}
              <SupportTicketLink>submit a support ticket</SupportTicketLink> or contact your TAM.
            </p>
            <p>Following implementation, changes may take up to 2 weeks to propagate.</p>
          </Stack>
        </Banner>
        {error ? this.renderError() : this.renderCollection()}
      </Page>
    );
  }
}

function mapStateToProps(state) {
  const { ipPools } = state;
  return {
    ipPools: getOrderedIpPools(state),
    loading: ipPools.listLoading,
    error: ipPools.listError,
    isManuallyBilled: selectCondition(not(isSelfServeBilling))(state),
    showPurchaseCTA: shouldShowIpPurchaseCTA(state),
  };
}

export default connect(mapStateToProps, { listPools, openSupportTicketForm })(IpPoolsList);
