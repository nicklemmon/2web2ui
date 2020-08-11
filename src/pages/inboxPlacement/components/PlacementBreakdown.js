import React from 'react';
import { PanelSectionTableCollection } from 'src/components/collection';
import { PageLink } from 'src/components/links';
import { slugToFriendly } from 'src/helpers/string';
import { formatPercent } from 'src/helpers/units';
import { PLACEMENT_FILTER_TYPES } from '../constants/types';

const getPlacementNameByType = (type, { mailbox_provider, region, sending_ip }) => {
  switch (type) {
    case PLACEMENT_FILTER_TYPES.REGION:
      return region;
    case PLACEMENT_FILTER_TYPES.SENDING_IP:
      return sending_ip;
    case PLACEMENT_FILTER_TYPES.MAILBOX_PROVIDER:
      return mailbox_provider;
    default:
      return '';
  }
};

const PlacementBreakdown = ({ data = [], type }) => {
  const columns = [
    {
      component: props => {
        const name = getPlacementNameByType(type, props);

        return (
          <PageLink to={`/inbox-placement/details/${props.id}/${type}/${name}`}>{name}</PageLink>
        );
      },
      header: {
        label: slugToFriendly(type),
        sortKey: props => (getPlacementNameByType(type, props) || '').toLowerCase(),
      },
    },
    {
      component: ({ region }) => region,
      header: {
        label: 'Region',
        sortKey: 'region',
      },
      visible: () => type === PLACEMENT_FILTER_TYPES.MAILBOX_PROVIDER,
    },
    {
      component: ({ placement }) => formatPercent(placement.inbox_pct * 100),
      header: {
        label: 'Inbox',
        sortKey: 'placement.inbox_pct',
        minWidth: '72px',
      },
    },
    {
      component: ({ placement }) => formatPercent(placement.spam_pct * 100),
      header: {
        label: 'Spam',
        sortKey: 'placement.spam_pct',
        minWidth: '72px',
      },
    },
    {
      component: ({ placement }) => formatPercent(placement.missing_pct * 100),
      header: {
        label: 'Missing',
        sortKey: 'placement.missing_pct',
        minWidth: '72px',
      },
    },
  ];
  const visibleColumns = columns.filter(({ visible = () => true }) => visible());
  const renderRow = columns => props =>
    columns.map(({ component: Component }) => <Component {...props} />);

  return (
    <PanelSectionTableCollection
      columns={visibleColumns.map(({ header }) => header)}
      rows={data}
      getRowData={renderRow(visibleColumns)}
      defaultSortColumn="placement.inbox_pct"
      defaultSortDirection="desc"
      filterBox={false}
      pagination={true}
      saveCsv={true}
    />
  );
};

export default PlacementBreakdown;
