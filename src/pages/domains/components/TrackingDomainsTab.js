import React, { useEffect, useReducer } from 'react';
import { ApiErrorBanner, Empty, Loading } from 'src/components';
import { Panel } from 'src/components/matchbox';
import { useTable } from 'src/hooks';
import useDomains from '../hooks/useDomains';
import { API_ERROR_MESSAGE } from '../constants';
import TableFilters, { reducer as tableFiltersReducer } from './TableFilters';
import TrackingDomainsTable from './TrackingDomainsTable';

const filtersInitialState = {
  isSelectAllChecked: false,
  domainNameFilter: undefined,
  checkboxes: [
    {
      label: 'Tracking Domain',
      name: 'verified',
      isChecked: false,
    },
    {
      label: 'Unverified',
      name: 'unverified',
      isChecked: false,
    },
    {
      label: 'Blocked',
      name: 'blocked',
      isChecked: false,
    },
  ],
};

export default function TrackingDomainsTab() {
  const {
    listTrackingDomains,
    listPending,
    hasSubaccounts,
    listSubaccounts,
    subaccounts,
    trackingDomains,
    trackingDomainsListError,
  } = useDomains();
  const [filtersState, filtersDispatch] = useReducer(tableFiltersReducer, filtersInitialState);
  const [tableState, tableDispatch] = useTable(trackingDomains);
  const isEmpty = !listPending && tableState.rows?.length === 0;

  // Make initial requests
  useEffect(() => {
    listTrackingDomains();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (hasSubaccounts && subaccounts?.length === 0) {
      listSubaccounts();
    }
  }, [hasSubaccounts, listSubaccounts, subaccounts]);

  // When filter state updates, update table state
  useEffect(() => {
    function getFilterFromCheckbox(name) {
      return filtersState.checkboxes.find(item => item.name === name).isChecked ? true : undefined;
    }

    tableDispatch({
      type: 'FILTER',
      filters: [
        { name: 'domainName', value: filtersState.domainNameFilter },
        { name: 'verified', value: getFilterFromCheckbox('verified') },
        { name: 'unverified', value: getFilterFromCheckbox('unverified') },
        { name: 'blocked', value: getFilterFromCheckbox('blocked') },
      ],
    });
  }, [filtersState, tableDispatch]);

  if (trackingDomainsListError) {
    return (
      <ApiErrorBanner
        errorDetails={trackingDomainsListError.message}
        message={API_ERROR_MESSAGE}
        reload={() => listTrackingDomains()}
      />
    );
  }

  return (
    <Panel mb="0">
      <Panel.Section>
        <TableFilters>
          <TableFilters.DomainField
            disabled={listPending}
            value={filtersState.domainNameFilter}
            onChange={e => filtersDispatch({ type: 'DOMAIN_FILTER_CHANGE', value: e.target.value })}
          />

          <TableFilters.SortSelect
            disabled={listPending}
            defaultValue="domainName"
            options={[
              {
                label: 'Domain Name (A - Z)',
                value: 'domainName',
                'data-sort-direction': 'asc',
              },
              {
                label: 'Domain Name (Z - A)',
                value: 'domainName',
                'data-sort-direction': 'desc',
              },
            ]}
            onChange={e => {
              const { target } = e;
              const selectedOption = target.options[target.selectedIndex];

              return tableDispatch({
                type: 'SORT',
                sortBy: target.value,
                direction: selectedOption.getAttribute('data-sort-direction'),
              });
            }}
          />

          <TableFilters.StatusPopover
            disabled={listPending}
            checkboxes={filtersState.checkboxes}
            onCheckboxChange={e => filtersDispatch({ type: 'TOGGLE', name: e.target.name })}
          />
        </TableFilters>
      </Panel.Section>

      {listPending && <Loading />}

      {isEmpty && <Empty message="There is no data to display" />}

      {!listPending && !isEmpty && <TrackingDomainsTable rows={tableState.rows} />}
    </Panel>
  );
}
