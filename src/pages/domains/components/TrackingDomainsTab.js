/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useEffect, useReducer } from 'react';
import { ApiErrorBanner, Empty, Loading } from 'src/components';
import { Panel } from 'src/components/matchbox';
import { usePageFilters } from 'src/hooks';
import { Pagination } from 'src/components/pagination';
import useDomains from '../hooks/useDomains';
import { API_ERROR_MESSAGE } from '../constants';
import TableFilters, { reducer as tableFiltersReducer } from './TableFilters';
import TrackingDomainsTable from './TrackingDomainsTable';
const { log } = console;

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

  // const [tableState, tableDispatch] = useTable(trackingDomains);
  // const isEmpty = !listPending && tableState.rows?.length === 0;
  const { filters, updateFilters } = usePageFilters(initFiltersForTracking);

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
      //     { name: 'verified', value: getFilterFromCheckbox('verified') },
      //     { name: 'unverified', value: getFilterFromCheckbox('unverified') },
      //     { name: 'blocked', value: getFilterFromCheckbox('blocked') },
      //   ],
      // });
    }
  }, [filtersState, listPending, updateFilters]);
  // tableDispatch

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
                // filtersDispatch({ type: 'DOMAIN_FILTER_CHANGE', value: e.target.value })
              }}
            />

            <TableFilters.StatusPopover
              disabled={listPending}
              checkboxes={filtersState.checkboxes}
              onCheckboxChange={e => {
                // filtersDispatch({ type: 'TOGGLE', name: e.target.name });
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

                // return tableDispatch({
                //   type: 'SORT',
                //   sortBy: target.value,
                //   direction: selectedOption.getAttribute('data-sort-direction'),
                // });
              }}
            />
          </TableFilters>
        </Panel.Section>

        {listPending && <Loading />}

        {/* {isEmpty && <Empty message="There is no data to display" />} */}

        {/* {!listPending && !isEmpty && <TrackingDomainsTable rows={tableState.rows} />} */}
      </Panel>

      {/* <Pagination
        pages={1}
        pageRange={3}
        currentPage={1}
        perPage={10}
        totalCount={100}
        handlePagination={() => {
          log('handlePerPageChange');
        }}
        handlePerPageChange={() => {
          log('handlePerPageChange');
        }}
      /> */}
    </>
  );
}
