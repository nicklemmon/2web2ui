import React, { useEffect, useReducer, useState } from 'react';
import { ApiErrorBanner, Empty, Loading } from 'src/components';

import { usePageFilters } from 'src/hooks';
import { Panel, Pagination } from 'src/components/matchbox';
import { Pagination } from 'src/components/collection';

//

import useDomains from '../hooks/useDomains';
import { API_ERROR_MESSAGE } from '../constants';
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
  const domains = renderBounceOnly ? bounceDomains : sendingDomains;

  const [filtersState, filtersDispatch] = useReducer(tableFiltersReducer, filtersInitialState);

  // const [tableState, tableDispatch] = useTable(domains, { paginate: true });
  // const [sort, setSort] = useState({ by: 'creationTime', direction: 'desc' });
  // const isEmpty = !listPending && tableState.rows?.length === 0;

  // const [filtersState, filtersDispatch] = useReducer(tableFiltersReducer, filtersInitialState);
  // const [tableState, tableDispatch] = useTable(domains);
  // const [sort, setSort] = useState({ by: 'creationTime', direction: 'desc' });
  // const isEmpty = !listPending && tableState.rows?.length === 0;
  const { filters, updateFilters, resetFilters } = usePageFilters(initFiltersForSending);
  //resets state when tabs tabs switched from Sending -> Bounce or Bounce -> Sending
  useEffect(() => {
    // filtersDispatch({ type: 'RESET', state: filtersInitialState });
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
        // filtersDispatch({ type: 'DOMAIN_FILTER_CHANGE', value: filters['domainName'] });
      } else if (filters[key] === 'true') {
        // filtersDispatch({ type: 'TOGGLE', name: key })
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When filter state updates, update table state and the query parameters
  useEffect(() => {
    if (!listPending) {
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

      // tableDispatch({
      //   type: 'FILTER',
      //   filters: [
      //     { name: 'domainName', value: filtersState.domainNameFilter },
      //     { name: 'readyForSending', value: getFilterFromCheckbox('readyForSending') },
      //     { name: 'readyForDKIM', value: getFilterFromCheckbox('readyForDKIM') },
      //     { name: 'readyForBounce', value: getFilterFromCheckbox('readyForBounce') },
      //     { name: 'validSPF', value: getFilterFromCheckbox('validSPF') },
      //     { name: 'unverified', value: getFilterFromCheckbox('unverified') },
      //     { name: 'blocked', value: getFilterFromCheckbox('blocked') },
      //   ],
      // });
    }
  }, [filtersState, listPending, tableDispatch, updateFilters]);

  useEffect(() => {
    if (!listPending) {
      // tableDispatch({
      //   type: 'SORT',
      //   sortBy: sort.by,
      //   direction: sort.direction,
      // });
    }
  }, [sort, listPending, tableDispatch]);

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
              onChange={e =>
                // filtersDispatch({ type: 'DOMAIN_FILTER_CHANGE', value: e.target.value })
              }
            />

            <TableFilters.StatusPopover
              disabled={listPending}
              checkboxes={filtersState.checkboxes}
              onCheckboxChange={e => filtersDispatch({ type: 'TOGGLE', name: e.target.name })}
            />

            <TableFilters.SortSelect
              disabled={listPending}
              defaultValue="creationTime"
              value={sort.by}
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

                setSort({
                  by: selectedOption.getAttribute('data-sort-by'),
                  direction: selectedOption.getAttribute('data-sort-direction'),
                });
              }}
            />
          </TableFilters>
        </Panel.Section>

        {/* {listPending && <Loading />} */}

        {/* {isEmpty && <Empty message="There is no data to display" />} */}

        {/* {!listPending && !isEmpty && <SendingDomainsTable rows={tableState.rows} />} */}
      </Panel>

      {/*
      <Pagination
        data={tableState.rawData}
        saveCsv={false}
        onPageChange={page => {
          page += 1; // because matchbox Pagination component gives back 0 base page argument, while it takes a 1 base currentPage prop
          // Only adding this if condition because this keeps firing on load
          if (tableState.currentPage !== page) {
            tableDispatch({
              type: 'CHANGE_PAGE',
              page: page,
            });
          }
        }}
        onPerPageChange={perPage => {
          tableDispatch({
            type: 'CHANGE_PER_PAGE',
            perPage,
          });
        }}
      /> */}
    </>
  );
}
