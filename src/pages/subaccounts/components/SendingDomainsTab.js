import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { PageLink } from 'src/components/links';
import { Button, Panel, Stack } from 'src/components/matchbox';
import { Loading } from 'src/components';
import { TableCollection, DomainStatusCell, StatusTooltipHeader } from 'src/components';
import { selectSendingDomainsForSubaccount } from 'src/selectors/sendingDomains';

// TODO: Could be accomplished using `<Box/>` or `<Text/>` when OG theme is removed
const CenteredText = styled.div`
  text-align: center;
`;

const columns = [
  { label: 'Domain', width: '30%', sortKey: 'domain' },
  { label: <StatusTooltipHeader />, width: '40%' },
];

export const getRowData = row => [
  <PageLink to={`/account/sending-domains/edit/${row.domain}`}>{row.domain}</PageLink>,
  <DomainStatusCell domain={row} />,
];

export class SendingDomainsTab extends Component {
  renderCollection() {
    const { domains } = this.props;

    return (
      <>
        <Panel marginBottom="0" borderBottom="0">
          <Panel.Section>
            <p>Sending Domains assigned to this subaccount.</p>
          </Panel.Section>
        </Panel>

        <TableCollection
          columns={columns}
          getRowData={getRowData}
          pagination={true}
          rows={domains}
        />
      </>
    );
  }

  renderEmpty() {
    return (
      <Panel>
        <Panel.Section>
          <CenteredText>
            <Stack>
              <p>
                This subaccount has no sending domains assigned to it. You can assign an existing
                one, or create a new one.
              </p>

              <div>
                <PageLink as={Button} variant="secondary" to="/account/sending-domains">
                  Manage Sending Domains
                </PageLink>
              </div>
            </Stack>
          </CenteredText>
        </Panel.Section>
      </Panel>
    );
  }

  render() {
    const { loading } = this.props;

    if (loading) {
      return <Loading minHeight="300px" />;
    }

    const showEmpty = this.props.domains.length === 0;

    return <>{showEmpty ? this.renderEmpty() : this.renderCollection()}</>;
  }
}

const mapStateToProps = (state, props) => ({
  loading: state.sendingDomains.listLoading,
  domains: selectSendingDomainsForSubaccount(state, props),
});

export default withRouter(connect(mapStateToProps)(SendingDomainsTab));
