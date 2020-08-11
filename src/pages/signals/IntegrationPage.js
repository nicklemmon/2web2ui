import _ from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { Box, Page } from 'src/components/matchbox';
import { CursorPaging, PerPageButtons } from 'src/components/collection';
import { PageDescription } from 'src/components/text';
import { DEFAULT_PER_PAGE_BUTTONS } from 'src/constants';
import { batchStatusOptions } from './constants/integration';
import IntegrationCollection from './components/IntegrationCollection';
import IntegrationPageFilter from './components/IntegrationPageFilter';
import usePageFilters from 'src/hooks/usePageFilters';

const batchStatusOptionValues = batchStatusOptions.map(op => op.value);

const validateBatchStatus = val => batchStatusOptionValues.includes(val);
const validateBatchIds = val => Array.isArray(val);
const validatePerPage = val =>
  !isNaN(val) && DEFAULT_PER_PAGE_BUTTONS.find(num => num === parseInt(val, 10)) !== undefined;
const validatePage = val => !isNaN(val) && val >= 0;

const normalizeNumber = val => val * 1;

const filterConfiguration = {
  batchIds: {
    validate: validateBatchIds,
    defaultValue: [],
  },
  batchStatus: {
    validate: validateBatchStatus,
    defaultValue: '',
  },
  perPage: {
    validate: validatePerPage,
    defaultValue: 10,
    normalize: normalizeNumber,
  },
  page: {
    validate: validatePage,
    defaultValue: 0,
    excludeFromRoute: true,
    normalize: normalizeNumber,
  },
};

const IntegrationPage = ({
  getIngestBatchEvents,
  eventsByPage,
  loadingStatus,
  nextCursor,
  totalCount,
}) => {
  const { filters, prevFilters, updateFilters } = usePageFilters(filterConfiguration);

  const getData = useCallback(() => {
    getIngestBatchEvents({
      batchIds: filters.batchIds,
      cursor: filters.page === 0 ? undefined : nextCursor,
      perPage: filters.perPage,
      statuses: filters.batchStatus ? [filters.batchStatus] : undefined,
    });
  }, [getIngestBatchEvents, filters, nextCursor]);

  const events = eventsByPage[filters.page];

  useEffect(() => {
    if (!events || !_.isEqual(_.omit(prevFilters, 'page'), _.omit(filters, 'page'))) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <Page title="Signals Integration">
      <PageDescription>Review the health of your Signals integration.</PageDescription>

      <IntegrationPageFilter
        disabled={loadingStatus === 'pending'}
        initialValues={filters}
        onChange={nextFilters => {
          updateFilters({ ...nextFilters, page: 0 });
        }}
      />
      <IntegrationCollection
        events={events}
        loadingStatus={loadingStatus}
        onRetry={() => {
          getData();
        }}
      />
      <Box display="flex" justifyContent="space-between">
        <CursorPaging
          currentPage={filters.page + 1}
          handleFirstPage={() => {
            updateFilters({ page: 0 });
          }}
          handlePageChange={nextPageNumber => {
            updateFilters({ page: nextPageNumber - 1 });
          }}
          nextDisabled={totalCount <= filters.perPage * (filters.page + 1)}
          previousDisabled={filters.page === 0}
          perPage={filters.perPage}
          totalCount={totalCount}
        />
        <PerPageButtons
          onPerPageChange={nextPageSize => {
            updateFilters({ perPage: nextPageSize, page: 0 });
          }}
          perPage={filters.perPage}
          totalCount={totalCount}
        />
      </Box>
    </Page>
  );
};

export default IntegrationPage;
