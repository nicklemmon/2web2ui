import React, { useEffect, useReducer, useState } from 'react';
import { ApiErrorBanner, Empty, Loading } from 'src/components';
import { Panel } from 'src/components/matchbox';
import { Pagination } from 'src/components/collection';
import { useTable } from 'src/hooks';
import useDomains from '../hooks/useDomains';
import { API_ERROR_MESSAGE } from '../constants';
import SendingDomainsTable from './SendingDomainsTable';
import TableFilters, { reducer as tableFiltersReducer } from './TableFilters';

const filtersInitialState = {
  isSelectAllChecked: false,
  domainNameFilter: undefined,
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
  const [tableState, tableDispatch] = useTable(domains);
  const [sort, setSort] = useState({ by: 'creationTime', direction: 'desc' });
  const isEmpty = !listPending && tableState.rows?.length === 0;

  // Make initial requests
  useEffect(() => {
    listSendingDomains();
  }, [listSendingDomains]);

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
        { name: 'readyForSending', value: getFilterFromCheckbox('readyForSending') },
        { name: 'readyForDKIM', value: getFilterFromCheckbox('readyForDKIM') },
        { name: 'readyForBounce', value: getFilterFromCheckbox('readyForBounce') },
        { name: 'validSPF', value: getFilterFromCheckbox('validSPF') },
        { name: 'unverified', value: getFilterFromCheckbox('unverified') },
        { name: 'blocked', value: getFilterFromCheckbox('blocked') },
      ],
    });
  }, [filtersState, tableDispatch]);

  useEffect(() => {
    if (!listPending) {
      tableDispatch({
        type: 'SORT',
        sortBy: sort.by,
        direction: sort.direction,
      });
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
                filtersDispatch({ type: 'DOMAIN_FILTER_CHANGE', value: e.target.value })
              }
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

            <TableFilters.StatusPopover
              disabled={listPending}
              checkboxes={filtersState.checkboxes}
              onCheckboxChange={e => filtersDispatch({ type: 'TOGGLE', name: e.target.name })}
            />
          </TableFilters>
        </Panel.Section>

        {listPending && <Loading />}

        {isEmpty && <Empty message="There is no data to display" />}

        {!listPending && !isEmpty && <SendingDomainsTable rows={tableState.rows} />}
      </Panel>

      <Pagination
        data={tableState.rows}
        saveCsv={false}
        onPageChange={page => {
          return tableDispatch({
            type: 'CHANGE_PAGE',
            page,
          });
        }}
        onPerPageChange={perPage => {
          return tableDispatch({
            type: 'CHANGE_PER_PAGE',
            perPage,
          });
        }}
      />
    </>
  );
}
