import React, { useEffect, useReducer } from 'react';
import { ApiErrorBanner, Empty, Loading } from 'src/components';
import { Panel } from 'src/components/matchbox';
import { usePageFilters } from 'src/hooks';
import { Pagination } from 'src/components/collection';
import { useTable, useSortBy, useFilters, usePagination } from 'react-table'; // https://react-table.tanstack.com/docs/api/overview
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

  // filtersState, UI -> data struct (might be replacable with react-table too)
  const [filtersState, filtersDispatch] = useReducer(tableFiltersReducer, filtersInitialState);
  const { filters, updateFilters } = usePageFilters(initFiltersForTracking);

  const data = React.useMemo(() => trackingDomains, [trackingDomains]);
  const columns = React.useMemo(
    () => [
      { Header: 'Blocked', accessor: 'blocked', sortDescFirst: false },
      { Header: 'DefaultTrackingDomain', accessor: 'defaultTrackingDomain', sortDescFirst: false },
      { Header: 'DomainName', accessor: 'domainName', sortDescFirst: false },
      { Header: 'SharedWithSubaccounts', accessor: 'sharedWithSubaccounts', sortDescFirst: false },
      { Header: 'SubaccountId', accessor: 'subaccountId', sortDescFirst: false },
      { Header: 'SubaccountName', accessor: 'subaccountName', sortDescFirst: false },
      { Header: 'Unverified', accessor: 'unverified', sortDescFirst: false },
      { Header: 'Verified', accessor: 'verified', sortDescFirst: false },
    ],
    [],
  );
  const sortBy = React.useMemo(
    () => [
      { id: 'blocked', desc: true },
      { id: 'defaultTrackingDomain', desc: true },
      { id: 'domainName', desc: false },
      { id: 'sharedWithSubaccounts', desc: true },
      { id: 'subaccountId', desc: true, canFilter: false },
      { id: 'subaccountName', desc: true, canFilter: false },
      { id: 'unverified', desc: true },
      { id: 'verified', desc: true },
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
                // TODO: Probably want to add a debounce event for as they're typing so we dont update on every keystroke
                filtersDispatch({ type: 'DOMAIN_FILTER_CHANGE', value: e.target.value });

                const newFilters = Object.keys(filters).map(i => {
                  if ('domainName' === i) {
                    return { id: i, value: e.target.value };
                  }
                  return {
                    id: i,
                    value:
                      filtersState.checkboxes[filtersState.checkboxes.map(i => i.name).indexOf(i)]
                        .isChecked || false,
                  };
                });

                setAllFilters(newFilters);
              }}
            />

            <TableFilters.StatusPopover
              disabled={listPending}
              checkboxes={filtersState.checkboxes}
              onCheckboxChange={e => {
                filtersDispatch({ type: 'TOGGLE', name: e.target.name });

                const newFilters = Object.keys(filters).map(i => {
                  if ('domainName' === i) {
                    return { id: 'domainName', value: filtersState.domainNameFilter };
                  } else if (e.target.name === i) {
                    return { id: i, value: e.target.checked };
                  }

                  return {
                    id: i,
                    value:
                      filtersState.checkboxes[filtersState.checkboxes.map(i => i.name).indexOf(i)]
                        .isChecked || false,
                  };
                });

                setAllFilters(newFilters);
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
