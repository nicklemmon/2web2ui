import React, { useReducer } from 'react';
import { connect } from 'react-redux';
import {
  Banner,
  Box,
  Button,
  Drawer,
  ScreenReaderOnly,
  Select,
  Stack,
} from 'src/components/matchbox';
import { FILTER_KEY_MAP } from 'src/helpers/metrics';
import { Add, Close } from '@sparkpost/matchbox-icons';
import { TranslatableText, Comparison } from 'src/components/text';
import {
  fetchMetricsDomains,
  fetchMetricsCampaigns,
  fetchMetricsSendingIps,
  fetchMetricsIpPools,
  fetchMetricsTemplates,
} from 'src/actions/metrics';
import { list as listSubaccounts } from 'src/actions/subaccounts';
import { list as listSendingDomains } from 'src/actions/sendingDomains';
import { selectCacheReportBuilder } from 'src/selectors/reportFilterTypeaheadCache';
import { useReportBuilderContext } from '../../context/ReportBuilderContext';
import Typeahead from './Typeahead';
import styled from 'styled-components';

const initialState = {
  filters: [null, null],
  filterType: undefined,
  error: null,
};

const StyledButton = styled(Button)`
  position: absolute;
  top: -40px;
  right: 0;
`;

const RemoveButton = ({ onClick }) => (
  <StyledButton padding="200" variant="minimal" onClick={onClick} size="small">
    <ScreenReaderOnly>Remove Filter</ScreenReaderOnly>
    <Button.Icon as={Close} />
  </StyledButton>
);

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_FILTER':
      return { ...state, filters: [...state.filters, null] };
    case 'REMOVE_FILTER':
      return {
        ...state,
        filters: state.filters.filter((_filter, filterIndex) => filterIndex !== action.index),
      };
    case 'SET_FILTER':
      const newFilters = state.filters;
      newFilters[action.index] = action.value;
      return { ...state, error: null, filters: newFilters };
    case 'SET_FILTER_TYPE':
      return { error: null, filters: [null, null], filterType: action.filterType };
    case 'RESET_FORM':
      return { ...initialState, filters: [null, null], filterType: undefined };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    default:
      throw new Error(`${action.type} is not supported.`);
  }
};

function CompareByForm({
  // reportOptions,
  fetchMetricsDomains,
  fetchMetricsCampaigns,
  fetchMetricsSendingIps,
  fetchMetricsIpPools,
  fetchMetricsTemplates,
  listSubaccounts,
  listSendingDomains,
  typeaheadCache,
  handleSubmit,
}) {
  const { state: reportOptions } = useReportBuilderContext();
  const { comparisons } = reportOptions;

  const getInitialState = compareFilters => {
    if (!compareFilters || !compareFilters.length) {
      return initialState;
    }

    return { filterType: FILTER_KEY_MAP[comparisons[0].type], filters: comparisons };
  };
  const [state, dispatch] = useReducer(reducer, getInitialState(comparisons));
  const { filters, filterType, error } = state;

  function handleFormSubmit(e) {
    e.preventDefault();

    const cleanedFilters = filters.filter(filter => filter !== null); //filters the filter filters

    if (cleanedFilters.length < 2 && cleanedFilters.length > 0) {
      return dispatch({ type: 'SET_ERROR', error: 'Select more than one item to compare' });
    }
    // eslint-disable-next-line
    handleSubmit({ comparisons: cleanedFilters });
  }

  const FILTER_TYPES = [
    {
      label: 'Recipient Domain',
      value: 'domains',
      action: fetchMetricsDomains,
    },
    {
      label: 'Sending IP',
      value: 'sending_ips',
      action: fetchMetricsSendingIps,
    },
    {
      label: 'IP Pool',
      value: 'ip_pools',
      action: fetchMetricsIpPools,
    },
    {
      label: 'Campaign',
      value: 'campaigns',
      action: fetchMetricsCampaigns,
    },
    {
      label: 'Template',
      value: 'templates',
      action: fetchMetricsTemplates,
    },
    {
      label: 'Sending Domain',
      value: 'sending_domains',
      action: listSendingDomains,
    },
    {
      label: 'Subaccount',
      value: 'subaccounts',
      action: listSubaccounts,
    },
  ];

  const filterConfig = FILTER_TYPES.find(item => item.value === filterType);
  const filterAction = filterConfig?.action;
  const filterLabel = filterConfig?.label;

  const areInputsFilled = filters.every(filter => filter !== null);

  return (
    <form onSubmit={handleFormSubmit}>
      <Box padding="500" paddingBottom="8rem">
        <Stack>
          {error && (
            <Banner size="small" status="danger">
              {error}
            </Banner>
          )}
          <Select
            placeholder="Select Resource"
            placeholderValue="Select Resource"
            id="compare_select"
            label="Type"
            onChange={e => {
              dispatch({ type: 'SET_FILTER_TYPE', filterType: e.target.value });
            }}
            options={FILTER_TYPES.map(({ label, value }) => ({ label, value }))}
            value={filterType || 'Select Resource'}
          />
          {filterType &&
            filters.map((filter, index) => {
              const filteredTypeaheadResults = typeaheadCache[filterLabel]?.filter(
                typeaheadItem => {
                  return !filters.some(filter => typeaheadItem.value === filter?.value);
                },
              );
              return (
                <Box key={`filter-typeahead-${index}`} position="relative">
                  {index > 0 && filter && filters.length > 2 ? (
                    <RemoveButton
                      onClick={() => {
                        dispatch({ type: 'REMOVE_FILTER', index });
                      }}
                    />
                  ) : null}
                  <Stack marginTop="200">
                    <Box>
                      <Typeahead
                        id={`typeahead-${index}`}
                        lookaheadRequest={filterAction}
                        label={filterLabel}
                        labelHidden
                        dispatch={dispatch}
                        itemToString={item => (item?.value ? item.value : '')}
                        selectedItem={filter}
                        results={filteredTypeaheadResults}
                        onChange={value => {
                          dispatch({ type: 'SET_FILTER', index, value });
                        }}
                      />
                    </Box>
                    {index < filters.length - 1 && ( //Only the last one
                      <Box>
                        <Comparison>And</Comparison>
                      </Box>
                    )}
                  </Stack>
                </Box>
              );
            })}
          {filterType && areInputsFilled && (
            <Box>
              <Button
                onClick={() => {
                  dispatch({ type: 'ADD_FILTER' });
                }}
                size="small"
              >
                <TranslatableText>{`Add ${filterLabel}`}</TranslatableText>
                <Button.Icon as={Add} />
              </Button>
            </Box>
          )}
        </Stack>
      </Box>
      <Drawer.Footer>
        <Box display="flex">
          <Box pr="100" flex="1">
            <Button width="100%" type="submit" variant="primary">
              Compare
            </Button>
          </Box>
          <Box pl="100" flex="1">
            <Button
              width="100%"
              onClick={() => {
                dispatch({ type: 'RESET_FORM' });
              }}
              variant="secondary"
            >
              Clear Comparison
            </Button>
          </Box>
        </Box>
      </Drawer.Footer>
    </form>
  );
}

export default connect(state => ({ typeaheadCache: selectCacheReportBuilder(state) }), {
  fetchMetricsDomains,
  fetchMetricsCampaigns,
  fetchMetricsSendingIps,
  fetchMetricsIpPools,
  fetchMetricsTemplates,
  listSubaccounts,
  listSendingDomains,
})(CompareByForm);
