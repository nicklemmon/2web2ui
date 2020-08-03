import React, { useCallback } from 'react';
import { DoNotDisturbOn } from '@sparkpost/matchbox-icons';
import classNames from 'classnames';
import { PageLink } from 'src/components/links';
import { Button } from 'src/components/matchbox';
import useHibanaOverride from 'src/hooks/useHibanaOverride';
import FilterSortCollection from 'src/components/collection/FilterSortCollection';
import OGStyles from './MonitorsCollection.module.scss';
import hibanaStyles from './MonitorsCollectionHibana.module.scss';

const filterBoxConfig = {
  show: true,
  itemToStringKeys: ['resource'],
  placeholder: 'Search By: Sending Domain or IP',
  wrapper: props => <div>{props}</div>,
  fieldMaxWidth: '100%',
};

const selectOptions = [
  { value: 'Sort By', label: 'Sort By', disabled: true },
  { value: 'last_listed_at', label: 'Date Listed' },
  { value: 'watched_at', label: 'Date Added' },
  { value: 'resource', label: 'Resource Name' },
  { value: 'active_listing_count', label: 'Current Listings' },
  { value: 'total_listing_count', label: 'Historic Listings' },
];

export const MonitorsCollection = props => {
  const { monitors, handleDelete } = props;
  const styles = useHibanaOverride(OGStyles, hibanaStyles);

  const columns = [
    { label: 'Watched' },
    { label: 'Current Blocklistings', width: '15%', className: styles.ListingDetails },
    { label: 'Historic Blocklistings', width: '15%', className: styles.ListingDetails },
    { label: '', width: '20%' },
  ];

  const getRowData = useCallback(
    ({ resource, active_listing_count, total_listing_count }) => {
      return [
        <div className={styles.NameDetails}>
          <PageLink to={`/signals/blocklist/incidents?search=${resource}`}>{resource}</PageLink>
        </div>,
        <div className={classNames(styles.ListingDetails, styles.ListingDetailsCell)}>
          {active_listing_count}
        </div>,
        <div className={classNames(styles.ListingDetails, styles.ListingDetailsCell)}>
          {total_listing_count}
        </div>,
        <div className={styles.Delete}>
          <Button variant="minimal" onClick={() => handleDelete(resource)}>
            <span>Remove from Watchlist</span>
            {/* These inline styles should be removed if Matchbox can handle this independently */}
            <DoNotDisturbOn style={{ marginLeft: '3px' }} />
          </Button>
        </div>,
      ];
    },
    [
      handleDelete,
      styles.Delete,
      styles.ListingDetails,
      styles.ListingDetailsCell,
      styles.NameDetails,
    ],
  );

  return (
    <FilterSortCollection
      columns={columns}
      selectOptions={selectOptions}
      filterBoxConfig={filterBoxConfig}
      defaultSortColumn="date_listed"
      rows={monitors}
      getRowData={getRowData}
      saveCsv={false}
    />
  );
};

export default MonitorsCollection;
