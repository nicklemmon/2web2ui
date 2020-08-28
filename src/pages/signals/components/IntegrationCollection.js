import React from 'react';
import { ApiErrorBanner, Empty, PanelLoading } from 'src/components';
import { Panel } from 'src/components/matchbox';
import { TableCollection } from 'src/components/collection';
import { columns } from '../constants/integration';
import formatRow from './FormatRow';

const IntegrationCollection = ({ events = [], loadingStatus, onRetry }) => {
  if (loadingStatus === 'fail') {
    return <ApiErrorBanner reload={onRetry} />;
  }

  if (loadingStatus === 'pending') {
    return <PanelLoading />;
  }

  if (events.length === 0) {
    return (
      <Panel.LEGACY>
        <Empty message="No Data Found!" />
      </Panel.LEGACY>
    );
  }

  return (
    <TableCollection
      columns={columns}
      rows={events}
      getRowData={formatRow}
      updateQueryString={false}
    />
  );
};

export default IntegrationCollection;
