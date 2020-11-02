/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useEffect, useReducer } from 'react';
import { ApiErrorBanner, Empty, Loading } from 'src/components';
import { Panel } from 'src/components/matchbox';
import { usePageFilters } from 'src/hooks';
import { Pagination } from 'src/components/collection';
import { useTable, useSortBy, useFilters, usePagination } from 'react-table';
import useDomains from '../hooks/useDomains';
import { API_ERROR_MESSAGE } from '../constants';
import { DEFAULT_CURRENT_PAGE, DEFAULT_PER_PAGE } from 'src/constants';
import TableFilters, { reducer as tableFiltersReducer } from './TableFilters';
import TrackingDomainsTable from './TrackingDomainsTable';

const filtersInitialState = {
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

const initFiltersForTracking = {
  domainName: { defaultValue: undefined },
  verified: {
    defaultValue: undefined,
    validate: val => {
      return val === 'true' || val === 'false' || typeof val === 'boolean';
    },
  },
  unverified: {
    defaultValue: undefined,
    validate: val => {
      return val === 'true' || val === 'false' || typeof val === 'boolean';
    },
  },
  blocked: {
    defaultValue: undefined,
    validate: val => {
      return val === 'true' || val === 'false' || typeof val === 'boolean';
    },
  },
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
  const { filters, updateFilters } = usePageFilters(initFiltersForTracking);

  const data = React.useMemo(() => trackingDomains, [trackingDomains]);
  const columns = React.useMemo(
    () => [
      { Header: 'Blocked', accessor: 'blocked' },
      { Header: 'DefaultTrackingDomain', accessor: 'defaultTrackingDomain' },
      { Header: 'DomainName', accessor: 'domainName' },
      { Header: 'SharedWithSubaccounts', accessor: 'sharedWithSubaccounts' },
      { Header: 'SubaccountId', accessor: 'subaccountId' },
      { Header: 'SubaccountName', accessor: 'subaccountName' },
      { Header: 'Unverified', accessor: 'unverified' },
      { Header: 'Verified', accessor: 'verified' },
    ],
    [],
  );
  const sortBy = React.useMemo(
    () => [
      { id: 'blocked', desc: true, sortDescFirst: false },
      { id: 'defaultTrackingDomain', desc: true, sortDescFirst: false },
      { id: 'domainName', desc: false, sortDescFirst: false },
      { id: 'sharedWithSubaccounts', desc: true, sortDescFirst: false },
      { id: 'subaccountId', desc: true, sortDescFirst: false },
      { id: 'subaccountName', desc: true, sortDescFirst: false },
      { id: 'unverified', desc: true, sortDescFirst: false },
      { id: 'verified', desc: true, sortDescFirst: false },
    ],
    [],
  );
  const tableInstance = useTable(
    {
      columns,
      data,
      sortBy,
      initialState: {
        pageIndex: DEFAULT_CURRENT_PAGE - 1, // react-table takes a 0 base pageIndex
        pageSize: DEFAULT_PER_PAGE,
        filters: [],
        sortBy: [
          {
            id: 'domainName',
            desc: false,
          },
        ], // TODO: Set default sortBy
      },
    },
    useFilters,
    useSortBy,
    usePagination,
  );
  const {
    rows,
    setFilter,
    setAllFilters,
    toggleSortBy,
    state,
    gotoPage,
    setPageSize,
  } = tableInstance;

  const isEmpty = !listPending && rows?.length === 0;

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

  //sync the params with filters on page load
  useEffect(() => {
    // TODO: This part is important - come back to it
    // Object.keys(filters).forEach(key => {
    //   if (key === 'domainName') {
    //     // filtersDispatch({ type: 'DOMAIN_FILTER_CHANGE', value: filters['domainName'] });
    //   } else if (filters[key] === 'true') {
    //     filtersDispatch({ type: 'TOGGLE', name: key });
    //   }
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When filter state updates, update table state and the query parameters
  useEffect(() => {
    // TODO: This part is important - come back to it
    // if (!listPending) {
    //   function getFilterFromCheckbox(name) {
    //     return filtersState.checkboxes.find(item => item.name === name).isChecked
    //       ? true
    //       : undefined;
    //   }
    //   const filterStateToParams = () => {
    //     let params = {};
    //     for (let checkbox of filtersState.checkboxes) {
    //       params[checkbox.name] = checkbox.isChecked;
    //     }
    //     params.domainName = filtersState.domainNameFilter;
    //     return params;
    //   };
    //   updateFilters(filterStateToParams());
    // }
  }, [filtersState, listPending, updateFilters]);

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
    <>
      <Panel mb="400">
        <Panel.Section>
          <TableFilters>
            <TableFilters.DomainField
              disabled={listPending}
              value={filtersState.domainNameFilter}
              onChange={e => {
                filtersDispatch({ type: 'DOMAIN_FILTER_CHANGE', value: e.target.value });

                // TODO: Take into account domainStatus filter too

                setFilter('domainName', e.target.value);
              }}
            />

            <TableFilters.StatusPopover
              disabled={listPending}
              checkboxes={filtersState.checkboxes}
              onCheckboxChange={e => {
                filtersDispatch({ type: 'TOGGLE', name: e.target.name });
                const newFilters = filtersState.checkboxes.map(i => {
                  if (e.target.name === i.name) {
                    return { id: i.name, value: e.target.checked };
                  }

                  return { id: i.name, value: i.isChecked };
                });

                // TODO: Take into account domainStatus filter too

                setAllFilters(newFilters); // multi-filter apply [ { id: name, value: true | false } ]
              }}
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
                const selectedAttribute = selectedOption.getAttribute('data-sort-by');
                const selectedDirection = selectedOption.getAttribute('data-sort-direction');
                const desc = selectedDirection === 'desc' ? true : false;
                toggleSortBy(selectedAttribute, desc);
              }}
            />
          </TableFilters>
        </Panel.Section>

        {listPending && <Loading />}

        {isEmpty && <Empty message="There is no data to display" />}

        {!listPending && !isEmpty && <TrackingDomainsTable tableInstance={tableInstance} />}
      </Panel>

      <Pagination
        data={rows}
        pageBaseZero={true}
        currentPage={state.pageIndex}
        perPage={state.pageSize}
        saveCsv={false}
        onPageChange={page => {
          // TODO: Try to see if this is firing because of a mistake I made.... otherwise leave condition in place
          // Only adding this if condition because this keeps firing on load
          if (state.pageIndex !== page) {
            gotoPage(page);
          }
        }}
        onPerPageChange={perPage => {
          setPageSize(perPage);
        }}
      />
    </>
  );
}
