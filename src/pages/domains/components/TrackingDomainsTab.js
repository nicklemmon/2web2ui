import _ from 'lodash';
import React, { useEffect, useReducer } from 'react';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table'; // https://react-table.tanstack.com/docs/api/overview
import { ApiErrorBanner, Empty, Loading } from 'src/components';
import { Pagination } from 'src/components/collection';
import { Panel } from 'src/components/matchbox';
import { DEFAULT_CURRENT_PAGE, DEFAULT_PER_PAGE } from 'src/constants';
import { usePageFilters } from 'src/hooks';
import { API_ERROR_MESSAGE } from '../constants';
import useDomains from '../hooks/useDomains';
import TableFilters, { reducer as tableFiltersReducer } from './TableFilters';
import TrackingDomainsTable from './TrackingDomainsTable';

const filtersInitialState = {
  domainName: undefined,
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

  // filtersState, UI -> data struct (might be replacable with react-table too)
  const [filtersState, filtersStateDispatch] = useReducer(tableFiltersReducer, filtersInitialState);
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
  const sortBy = React.useMemo(() => [{ id: 'domainName', desc: false }], []);
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
        ],
      },
    },
    useFilters,
    useSortBy,
    usePagination,
  );
  const { rows, setAllFilters, toggleSortBy, state, gotoPage, setPageSize } = tableInstance;

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

  // sync the params with filters on page load
  useEffect(() => {
    Object.keys(filters).forEach(key => {
      if (key === 'domainName') {
        filtersStateDispatch({ type: 'DOMAIN_FILTER_CHANGE', value: filters['domainName'] }); // SET UI INPUT VALUES
      } else if (filters[key] === 'true') {
        filtersStateDispatch({ type: 'TOGGLE', name: key }); // SET UI INPUT VALUES
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When filter state updates, update table state and the query parameters
  useEffect(() => {
    if (!listPending) {
      const filterStateToParams = () => {
        let params = {};
        for (let checkbox of filtersState.checkboxes) {
          params[checkbox.name] = checkbox.isChecked;
        }
        params.domainName = filtersState.domainName;
        return params;
      };
      const filterStateParams = filterStateToParams();
      updateFilters(filterStateParams);
      let reactTableFilters = Object.entries(filterStateParams).map(x => ({
        id: x[0],
        value: x[1],
      }));
      setAllFilters(reactTableFilters);
    }
  }, [filtersState, listPending, setAllFilters, updateFilters]);

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
              value={filtersState.domainName}
              onChange={e => {
                filtersStateDispatch({ type: 'DOMAIN_FILTER_CHANGE', value: e.target.value });
              }}
            />

            <TableFilters.StatusPopover
              disabled={listPending}
              checkboxes={filtersState.checkboxes}
              onCheckboxChange={e => {
                filtersStateDispatch({ type: 'TOGGLE', name: e.target.name });
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
                const selectedDirection = selectedOption.getAttribute('data-sort-direction');
                const desc = selectedDirection === 'desc' ? true : false;
                toggleSortBy('domainName', desc);
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
