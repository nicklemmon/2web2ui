import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { TableCollection, Loading } from 'src/components';
import { PageLink } from 'src/components/links';
import { Button, Panel, Stack } from 'src/components/matchbox';
import { filterBoxConfig } from 'src/pages/api-keys/tableConfig';
import { getSubaccountApiKeys } from 'src/selectors/api-keys';
import { setSubaccountQuery } from 'src/helpers/subaccounts';

const columns = [
  { label: 'Name', width: '40%', sortKey: 'label' },
  { label: 'Key', width: '20%' },
];

export class ApiKeysTab extends Component {
  renderCollection(keys) {
    return (
      <TableCollection
        columns={columns}
        getRowData={this.getRowData}
        pagination={true}
        rows={keys}
        filterBox={filterBoxConfig}
      />
    );
  }

  getRowData = ({ id, label, short_key }) => {
    const subaccountId = this.props.id;

    // unlike api keys page, no need to check if user can edit as that logic checks if subaccount_id exists which is always true here
    return [
      <PageLink to={`/account/api-keys/edit/${id}${setSubaccountQuery(subaccountId)}`}>
        {label}
      </PageLink>,
      <code>{short_key}••••••••</code>,
    ];
  };

  renderEmpty() {
    return (
      <Panel>
        <Panel.Section style={{ textAlign: 'center' }}>
          <Stack>
            <p>
              This subaccount has no API Keys assigned to it. You can assign an existing one, or
              create a new one.
            </p>

            <div>
              <PageLink as={Button} variant="secondary" to="/account/api-keys">
                Manage API Keys
              </PageLink>
            </div>
          </Stack>
        </Panel.Section>
      </Panel>
    );
  }

  render() {
    const { loading } = this.props;

    if (loading) {
      return <Loading minHeight="300px" />;
    }

    const { keys } = this.props;
    const showEmpty = keys.length === 0;

    return <>{showEmpty ? this.renderEmpty() : this.renderCollection(keys)}</>;
  }
}

const mapStateToProps = (state, props) => ({
  loading: state.apiKeys.keysLoading,
  keys: getSubaccountApiKeys(state, props),
});

export default withRouter(connect(mapStateToProps, {})(ApiKeysTab));
