import React from 'react';
import { FORMATS } from 'src/constants';
import { OGOnlyWrapper } from 'src/components/hibana';
import { TableCollection, DisplayDate } from 'src/components';
import { PageLink } from 'src/components/links';
import { Box, Grid, Panel, Table, Tag } from 'src/components/matchbox';
import styles from './IncidentsCollection.module.scss';
import DatePicker from 'src/components/datePicker/DatePicker';

const RELATIVE_DATE_OPTIONS = ['day', '7days', '30days', '90days', 'custom'];

const columns = [
  { label: 'Details' },
  { label: 'Listed', sortKey: 'occurred_at' },
  { label: 'Resolved', sortKey: 'resolved_at' },
];

const getRowData = ({
  resource,
  id,
  blacklist_name,
  occurred_at_formatted,
  occurred_at_timestamp,
  resolved_at_timestamp,
  resolved_at_formatted,
}) => {
  return [
    <PageLink to={`/blocklist/incidents/${id}`}>
      <span className={styles.DetailsLink}>{resource}</span>
      <span> on </span> <span className={styles.DetailsLink}>{blacklist_name}</span>
    </PageLink>,
    <DisplayDate timestamp={occurred_at_timestamp} formattedDate={occurred_at_formatted} />,
    !resolved_at_formatted ? (
      <Tag color="yellow">Active</Tag>
    ) : (
      <DisplayDate timestamp={resolved_at_timestamp} formattedDate={resolved_at_formatted} />
    ),
  ];
};

const TableWrapper = props => (
  <>
    <div>
      <Table>{props.children}</Table>
    </div>
  </>
);

export const IncidentsCollection = props => {
  const { incidents, dateOptions, updateDateRange, search, updateTextField } = props;

  const renderHeader = ({ textFieldComponent }) => (
    <Grid>
      <OGOnlyWrapper as={Grid.Column} sm={12} lg={5}>
        <Box as={Grid.Column} xs={12} md={5}>
          <div className={styles.DatePicker}>
            <DatePicker
              {...dateOptions}
              relativeDateOptions={RELATIVE_DATE_OPTIONS}
              onChange={updateDateRange}
              dateFieldFormat={FORMATS.DATE}
              hideManualEntry
            />
          </div>
        </Box>
      </OGOnlyWrapper>
      <OGOnlyWrapper as={Grid.Column} sm={12} lg={7}>
        <Box as={Grid.Column} xs={12} md={7}>
          {textFieldComponent}
        </Box>
      </OGOnlyWrapper>
    </Grid>
  );

  return (
    <TableCollection
      wrapperComponent={TableWrapper}
      columns={columns}
      rows={incidents}
      getRowData={getRowData}
      pagination={true}
      filterBox={{
        show: true,
        exampleModifiers: ['resource', 'blacklist_name', 'status'],
        initialValue: search,
        itemToStringKeys: ['resource', 'blacklist_name', 'status'],
        wrapper: props => <div className={styles.FilterBox}>{props}</div>,
        onBlur: value => updateTextField(value),
      }}
      defaultSortColumn="resolved_at"
      defaultSortDirection="desc"
      saveCsv={false}
    >
      {({ filterBox, collection, pagination }) => (
        <>
          <Panel>
            <Panel.Section>{renderHeader({ textFieldComponent: filterBox })}</Panel.Section>
            {collection}
          </Panel>
          {pagination}
        </>
      )}
    </TableCollection>
  );
};

export default IncidentsCollection;
