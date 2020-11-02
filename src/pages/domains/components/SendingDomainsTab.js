/* eslint-disable no-unused-vars */
import React, { useEffect, useReducer, useState } from 'react';
import { ApiErrorBanner, Empty, Loading } from 'src/components';
import { usePageFilters } from 'src/hooks';
import { Panel } from 'src/components/matchbox';
import { Pagination } from 'src/components/collection';
import { useTable, useSortBy, useFilters, usePagination } from 'react-table';
import useDomains from '../hooks/useDomains';
import { API_ERROR_MESSAGE } from '../constants';
import { DEFAULT_CURRENT_PAGE, DEFAULT_PER_PAGE } from 'src/constants';
import SendingDomainsTable from './SendingDomainsTable';
import TableFilters, { reducer as tableFiltersReducer } from './TableFilters';

const filtersInitialState = {
  domainNameFilter: '',
  checkboxes: [
    {
      label: 'Sending Domain',
      name: 'readyForSending',
      isChecked: false,
    },
    {
      label: 'DKIM Signing',
      name: 'readyForDKIM',
      isChecked: false,
    },
    {
      label: 'Bounce',
      name: 'readyForBounce',
      isChecked: false,
    },
    {
      label: 'SPF Valid',
      name: 'validSPF',
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

const initFiltersForSending = {
  domainName: { defaultValue: undefined },
  readyForSending: {
    defaultValue: undefined,
    validate: val => {
      return val === 'true' || val === 'false' || typeof val === 'boolean';
    },
  },
  readyForDKIM: {
    defaultValue: undefined,
    validate: val => {
      return val === 'true' || val === 'false' || typeof val === 'boolean';
    },
  },
  readyForBounce: {
    defaultValue: undefined,
    validate: val => {
      return val === 'true' || val === 'false' || typeof val === 'boolean';
    },
  },
  validSPF: {
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

export default function SendingDomainsTab({ renderBounceOnly = false }) {
  const {
    listSendingDomains,
    sendingDomains,
    bounceDomains,
    sendingDomainsListError,
    hasSubaccounts,
    subaccounts,
    listPending,
    listSubaccounts,
  } = useDomains();

  // filtersState, UI -> data struct (might be replacable with react-table too)
  const [filtersState, filtersDispatch] = useReducer(tableFiltersReducer, filtersInitialState);
  const { filters, updateFilters, resetFilters } = usePageFilters(initFiltersForSending);

  const domains = renderBounceOnly ? bounceDomains : sendingDomains;

  const data = React.useMemo(() => domains, [domains]);
  const columns = React.useMemo(
    () => [
      { Header: 'Blocked', accessor: 'blocked', filterValue: false },
      { Header: 'CreationTime', accessor: 'creationTime', filterValue: false },
      { Header: 'DefaultBounceDomain', accessor: 'defaultBounceDomain', filterValue: false },
      { Header: 'DomainName', accessor: 'domainName', filterValue: '' },
      { Header: 'ReadyForBounce', accessor: 'readyForBounce', filterValue: false },
      { Header: 'ReadyForDKIM', accessor: 'readyForDKIM', filterValue: false },
      { Header: 'ReadyForSending', accessor: 'readyForSending', filterValue: false },
      { Header: 'SharedWithSubaccounts', accessor: 'sharedWithSubaccounts', filterValue: false },
      { Header: 'SubaccountId', accessor: 'subaccountId', canFilter: false },
      { Header: 'SubaccountName', accessor: 'subaccountName', canFilter: false },
      { Header: 'Unverified', accessor: 'unverified', filterValue: false },
      { Header: 'ValidSPF', accessor: 'validSPF', filterValue: false },
    ],
    [],
  );
  const sortBy = React.useMemo(
    () => [
      { id: 'creationTime', desc: true },
      { id: 'blocked', desc: true },
      { id: 'creationTime', desc: true },
      { id: 'defaultBounceDomain', desc: true },
      { id: 'domainName', desc: true },
      { id: 'readyForBounce', desc: true },
      { id: 'readyForDKIM', desc: true },
      { id: 'readyForSending', desc: true },
      { id: 'sharedWithSubaccounts', desc: true },
      { id: 'subaccountId', desc: true },
      { id: 'subaccountName', desc: true },
      { id: 'unverified', desc: true },
      { id: 'validSPF', desc: true },
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
            id: 'creationTime',
            desc: true,
          },
        ],
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

  // resets state when tabs tabs switched from Sending -> Bounce or Bounce -> Sending
  useEffect(() => {
    filtersDispatch({ type: 'RESET', state: filtersInitialState });
    resetFilters();
    // useTables reset
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderBounceOnly]);

  // Make initial requests
  useEffect(() => {
    listSendingDomains();
  }, [listSendingDomains]);

  useEffect(() => {
    if (hasSubaccounts && subaccounts?.length === 0) {
      listSubaccounts();
    }
  }, [hasSubaccounts, listSubaccounts, subaccounts]);

  // sync the params with filters on page load
  useEffect(() => {
    // TODO: This part is important - come back to it
    // Object.keys(filters).forEach(key => {
    //   if (key === 'domainName') {
    //     // filtersDispatch({ type: 'DOMAIN_FILTER_CHANGE', value: filters['domainName'] });
    //   } else if (filters[key] === 'true') {
    //     // filtersDispatch({ type: 'TOGGLE', name: key })
    //   }
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When filter state updates, update table state and the query parameters
  useEffect(() => {
    if (!listPending) {
      /** TODO: This part is important - come back to it
      function getFilterFromCheckbox(name) {
        return filtersState.checkboxes.find(item => item.name === name).isChecked
          ? true
          : undefined;
      }
      const filterStateToParams = () => {
        let params = {};
        for (let checkbox of filtersState.checkboxes) {
          params[checkbox.name] = checkbox.isChecked;
        }
        params.domainName = filtersState.domainNameFilter;
        return params;
      };
      updateFilters(filterStateToParams());
      tableDispatch({
        type: 'FILTER',
        filters: [
          { name: 'domainName', value: filtersState.domainNameFilter },
          { name: 'readyForSending', value: getFilterFromCheckbox('readyForSending') },
          { name: 'readyForDKIM', value: getFilterFromCheckbox('readyForDKIM') },
          { name: 'readyForBounce', value: getFilterFromCheckbox('readyForBounce') },
          { name: 'validSPF', value: getFilterFromCheckbox('validSPF') },
          { name: 'unverified', value: getFilterFromCheckbox('unverified') },
          { name: 'blocked', value: getFilterFromCheckbox('blocked') },
        ],
      }); */
    }
  }, [listPending]);

  if (sendingDomainsListError) {
    return (
      <ApiErrorBanner
        errorDetails={sendingDomainsListError.message}
        message={API_ERROR_MESSAGE}
        reload={() => listSendingDomains()}
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

                // TODO: Take into account domainName filter too

                setAllFilters(newFilters); // multi-filter apply [ { id: name, value: true | false } ]
              }}
            />

            <TableFilters.SortSelect
              disabled={listPending}
              defaultValue="creationTime"
              value=""
              options={[
                {
                  label: 'Date Added (Newest - Oldest)',
                  value: 'creationTimeDesc',
                  'data-sort-by': 'creationTime',
                  'data-sort-direction': 'desc',
                },
                {
                  label: 'Date Added (Oldest - Newest)',
                  value: 'creationTimeAsc',
                  'data-sort-by': 'creationTime',
                  'data-sort-direction': 'asc',
                },
                {
                  label: 'Domain Name (A - Z)',
                  value: 'domainNameAsc',
                  'data-sort-by': 'domainName',
                  'data-sort-direction': 'asc',
                },
                {
                  label: 'Domain Name (Z - A)',
                  value: 'domainNameDesc',
                  'data-sort-by': 'domainName',
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

        {!listPending && !isEmpty && <SendingDomainsTable tableInstance={tableInstance} />}
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
