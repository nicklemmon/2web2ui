import React from 'react';
import styled from 'styled-components';
import { ScreenReaderOnly, Panel, Table } from 'src/components/matchbox';
import { TableCollection } from 'src/components/collection';
import { formatDateTime } from 'src/helpers/date';
import { Heading } from 'src/components/text';
import withJobs from '../containers/withJobs';
import JobFileName from './JobFileName';
import JobAddressCount from './JobAddressCount';
import JobActionLink from './JobActionLink';
import JobStatusTag from './JobStatusTag';

const NoPadding = styled.div`
  padding: 0;
`;

const RightAlignedText = styled.div`
  text-align: 'right';
`;

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
        <RightAlignedText>
          <JobActionLink fileHref={rejectedUrl} status={status} jobId={jobId} />
        </RightAlignedText>
      ),
      header: {
        label: <ScreenReaderOnly>Actions</ScreenReaderOnly>,
      },
    },
  ];

  const TableWrapper = props => (
    <Panel.LEGACY>
      <Panel.LEGACY.Section>
        <Heading as="h3" looksLike="h4">
          Recent Validations
        </Heading>
      </Panel.LEGACY.Section>

      <NoPadding as={Panel.LEGACY.Section}>
        <Table>{props.children}</Table>
      </NoPadding>
    </Panel.LEGACY>
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
