import React from 'react';
import { ScreenReaderOnly, Panel, Table } from 'src/components/matchbox';
import { TableCollection } from 'src/components/collection';
import { formatDateTime } from 'src/helpers/date';
import { Heading } from 'src/components/text';
import withJobs from '../containers/withJobs';
import JobFileName from './JobFileName';
import JobAddressCount from './JobAddressCount';
import JobActionLink from './JobActionLink';
import JobStatusTag from './JobStatusTag';

export const JobsTableCollection = ({ jobs }) => {
  const columns = [
    {
      dataCellComponent: ({ filename }) => <JobFileName filename={filename} />,
      header: {
        label: 'File Name',
        sortKey: 'filename',
      },
    },
    {
      dataCellComponent: ({ uploadedAt }) => formatDateTime(uploadedAt),
      header: {
        label: 'Date Uploaded',
        sortKey: 'uploadedAt',
      },
    },
    {
      dataCellComponent: ({ status }) => <JobStatusTag status={status} />,
      header: {
        label: 'Status',
        sortKey: 'status',
      },
    },
    {
      dataCellComponent: ({ addressCount, status }) => (
        <JobAddressCount count={addressCount} status={status} />
      ),
      header: {
        label: 'Total',
        sortKey: 'addressCount',
      },
    },
    {
      dataCellComponent: ({ rejectedUrl, status, jobId }) => (
        <div style={{ textAlign: 'right' }}>
          <JobActionLink fileHref={rejectedUrl} status={status} jobId={jobId} />
        </div>
      ),
      header: {
        label: <ScreenReaderOnly>Actions</ScreenReaderOnly>,
      },
    },
  ];

  const TableWrapper = props => (
    <Panel>
      <Panel.Section>
        <Heading as="h3" looksLike="h4">
          Recent Validations
        </Heading>
      </Panel.Section>

      <Panel.Section style={{ padding: 0 }}>
        <Table>{props.children}</Table>
      </Panel.Section>
    </Panel>
  );

  const renderRow = columns => props =>
    columns.map(({ dataCellComponent: DataCellComponent }) => <DataCellComponent {...props} />);

  return (
    <TableCollection
      columns={columns.map(({ header }) => header)}
      defaultSortColumn="uploadedAt"
      defaultSortDirection="desc"
      getRowData={renderRow(columns)}
      rows={jobs}
      pagination
      wrapperComponent={TableWrapper}
    />
  );
};

export default withJobs(JobsTableCollection);
