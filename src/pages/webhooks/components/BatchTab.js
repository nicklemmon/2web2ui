import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getBatches } from 'src/actions/webhooks';
import { PanelSectionTableCollection } from 'src/components/collection';
import { PanelSectionLoading } from 'src/components/loading';
import { Button, Panel } from 'src/components/matchbox';
import { Empty } from 'src/components';
import { selectWebhookBatches } from 'src/selectors/webhooks';

const columns = [
  { label: 'Delivery Time', sortKey: 'ts' }, //This is timestamp
  { label: 'Batch ID', sortKey: 'batch_id' },
  { label: 'Status', sortKey: 'status' },
  { label: 'Attempt #', sortKey: 'attempts' },
  { label: 'Response', sortKey: 'response_code' },
];

const getRowData = batch => [
  batch.formatted_time,
  batch.batch_id,
  batch.status,
  batch.attempts,
  batch.response_code,
];

export class BatchTab extends Component {
  componentDidMount() {
    this.refreshBatches();
  }

  refreshBatches = () => {
    const { webhook, getBatches } = this.props;
    const { id, subaccount } = webhook;

    return getBatches({ id, subaccount });
  };

  renderBatches() {
    const { batches, batchesLoading } = this.props;

    if (batchesLoading) {
      return <PanelSectionLoading />;
    }

    if (_.isEmpty(batches)) {
      return <Empty message="There are no batches for your webhook" />;
    }

    return (
      <PanelSectionTableCollection
        columns={columns}
        rows={batches}
        getRowData={getRowData}
        pagination={true}
        defaultSortColumn="ts"
        defaultSortDirection="desc"
      />
    );
  }

  render() {
    const { batchesLoading } = this.props;
    const buttonText = batchesLoading ? 'Refreshing...' : 'Refresh Batches';

    return (
      <>
        <Panel.LEGACY.Section>
          <Button variant="primary" disabled={batchesLoading} onClick={this.refreshBatches}>
            {buttonText}
          </Button>
        </Panel.LEGACY.Section>
        {this.renderBatches()}
      </>
    );
  }
}

const mapStateToProps = state => ({
  batches: selectWebhookBatches(state),
  batchesLoading: state.webhooks.batchesLoading,
});

export default connect(mapStateToProps, { getBatches })(BatchTab);
