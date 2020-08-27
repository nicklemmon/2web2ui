import React, { useMemo } from 'react';
import { PageLink } from 'src/components/links';
import { Panel, Table, Tag, Text } from 'src/components/matchbox';
import PropTypes from 'prop-types';
import { DisplayDate, Empty, PanelLoading, TableCollection } from 'src/components';

const TableWrapper = props => (
  <>
    <div>
      <Table>{props.children}</Table>
    </div>
  </>
);

const RelatedIncidents = ({ incidents = [], loading, name = '', type = '' }) => {
  const columns = useMemo(() => {
    switch (type) {
      case 'resource': {
        return [{ label: 'Blocklist' }, { label: 'Date Listed' }, { label: 'Date Resolved' }];
      }
      case 'blocklist': {
        return [{ label: 'Resource' }, { label: 'Date Listed' }, { label: 'Date Resolved' }];
      }
      case 'history': {
        return [{ label: 'Date Listed' }, { label: 'Date Resolved' }];
      }
      default: {
        return [];
      }
    }
  }, [type]);

  if (loading) {
    return <PanelLoading minHeight="315px" />;
  }

  if (!incidents.length) {
    const message =
      type === 'history'
        ? `No historical incidents for ${name}`
        : `No other recent ${name} incidents`;

    return (
      <Panel.LEGACY>
        <Empty message={message} />
      </Panel.LEGACY>
    );
  }

  const getRowData = ({
    resource,
    id,
    blocklist_name,
    occurred_at_timestamp,
    occurred_at_formatted,
    occurred_at_formatted_date_only,
    resolved_at_timestamp,
    resolved_at_formatted,
    resolved_at_formatted_date_only,
  }) => {
    if (type === 'history') {
      return [
        <PageLink to={`/signals/blocklist/incidents/${id}`}>
          <DisplayDate timestamp={occurred_at_timestamp} formattedDate={occurred_at_formatted} />
        </PageLink>,
        !resolved_at_formatted ? (
          <Tag color="red">Active</Tag>
        ) : (
          <DisplayDate timestamp={resolved_at_timestamp} formattedDate={resolved_at_formatted} />
        ),
      ];
    }
    return [
      <PageLink to={`/signals/blocklist/incidents/${id}`}>
        <strong>
          <Text as="span" fontWeight="normal">
            {type === 'blocklist' ? resource : blocklist_name}
          </Text>
        </strong>
      </PageLink>,
      <DisplayDate
        timestamp={occurred_at_timestamp}
        formattedDate={occurred_at_formatted_date_only}
      />,
      !resolved_at_formatted ? (
        <Tag color="red">Active</Tag>
      ) : (
        <DisplayDate
          timestamp={resolved_at_timestamp}
          formattedDate={resolved_at_formatted_date_only}
        />
      ),
    ];
  };

  return (
    <Panel.LEGACY data-id={`related-incidents-${type}`}>
      <TableCollection
        wrapperComponent={TableWrapper}
        columns={columns}
        rows={incidents}
        getRowData={getRowData}
        pagination={true}
        defaultSortColumn="resolved_at"
        defaultSortDirection="desc"
        saveCsv={false}
      />
    </Panel.LEGACY>
  );
};

export default RelatedIncidents;

RelatedIncidents.propTypes = {
  type: PropTypes.oneOf(['resource', 'blocklist', 'history']),
};
