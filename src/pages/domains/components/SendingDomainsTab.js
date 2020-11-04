import React, { useEffect, useReducer } from 'react';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table'; // https://react-table.tanstack.com/docs/api/overview
import { ApiErrorBanner, Empty, Loading } from 'src/components';
import { Pagination } from 'src/components/collection';
import { Panel } from 'src/components/matchbox';
import { DEFAULT_CURRENT_PAGE, DEFAULT_PER_PAGE } from 'src/constants';
import { usePageFilters } from 'src/hooks';
import { API_ERROR_MESSAGE } from '../constants';
import useDomains from '../hooks/useDomains';
import SendingDomainsTable from './SendingDomainsTable';
import TableFilters, { reducer as tableFiltersReducer } from './TableFilters';

const filtersInitialState = {
  domainName: '',
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
  const [filtersState, filtersStateDispatch] = useReducer(tableFiltersReducer, filtersInitialState);

  /** note: usePageFilters is used to sync url/route to state... Cant use react-table for that */
  // eslint-disable-next-line no-unused-vars
  const { filters, updateFilters, resetFilters } = usePageFilters(initFiltersForSending);

  const domains = renderBounceOnly ? bounceDomains : sendingDomains;

  const data = React.useMemo(() => domains, [domains]);
  const columns = React.useMemo(
    () => [
      { Header: 'Blocked', accessor: 'blocked' },
      { Header: 'CreationTime', accessor: 'creationTime' },
      { Header: 'DefaultBounceDomain', accessor: 'defaultBounceDomain' },
      { Header: 'DomainName', accessor: 'domainName' },
      { Header: 'ReadyForBounce', accessor: 'readyForBounce' },
      { Header: 'ReadyForDKIM', accessor: 'readyForDKIM' },
      { Header: 'ReadyForSending', accessor: 'readyForSending' },
      { Header: 'SharedWithSubaccounts', accessor: 'sharedWithSubaccounts' },
      { Header: 'SubaccountId', accessor: 'subaccountId', canFilter: false },
      { Header: 'SubaccountName', accessor: 'subaccountName', canFilter: false },
      { Header: 'Unverified', accessor: 'unverified' },
      { Header: 'ValidSPF', accessor: 'validSPF' },
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
  const { rows, setAllFilters, toggleSortBy, state, gotoPage, setPageSize } = tableInstance;

  const isEmpty = !listPending && rows?.length === 0;

  // resets state when tabs tabs switched from Sending -> Bounce or Bounce -> Sending
  useEffect(() => {
    filtersStateDispatch({ type: 'RESET', state: filtersInitialState });
    resetFilters();
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
        currentPage={state.pageIndex + 1}
        perPage={state.pageSize}
        saveCsv={false}
        onPageChange={page => gotoPage(page)}
        onPerPageChange={perPage => {
          setPageSize(perPage);
        }}
      />
    </>
  );
}
