import React, { useReducer, useCallback } from 'react';
import { Box, Button, Drawer, Grid, Inline, Select } from 'src/components/matchbox';
import Typeahead from './Typeahead';
import { Add, Close } from '@sparkpost/matchbox-icons';
import _ from 'lodash';
import {
  fetchMetricsDomains,
  fetchMetricsCampaigns,
  fetchMetricsSendingIps,
  fetchMetricsIpPools,
  fetchMetricsTemplates,
} from 'src/actions/metrics';
import { list as listSubaccounts } from 'src/actions/subaccounts';
import { list as listSendingDomains } from 'src/actions/sendingDomains';
import { initTypeaheadCache, setFilters } from 'src/actions/reportOptions';
import { connect } from 'react-redux';
import { selectCacheReportBuilder } from 'src/selectors/reportFilterTypeaheadCache';
import styles from './ReportOptions.module.scss';

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_FILTER_TYPE': {
      const { filters } = state;
      filters.push({ value: [] });
      return { ...state, filters };
    }
    case 'REMOVE_FILTER_TYPE': {
      const { filters } = state;

      return {
        ...state,
        filters: _.filter(filters, (_filter, index) => {
          return index !== action.index;
        }),
      };
    }

    case 'SET_FILTER_TYPE': {
      const { filters } = state;
      filters[action.index].key = action.filterType;
      filters[action.index].value = [];
      return {
        ...state,
        filters,
      };
    }

    case 'ADD_FILTER': {
      const { filters } = state;
      filters[action.index].value = action.value;
      return {
        ...state,
        filters,
      };
    }

    case 'RESET_FILTERS': {
      return {
        ...state,
        filters: [{ value: [] }], //initial state
      };
    }

    default:
      return state;
  }
};

function AddFiltersSection({
  reportOptions = {},
  setFilters,
  closeDrawer,
  //Typeahead fetching
  fetchMetricsDomains,
  fetchMetricsCampaigns,
  fetchMetricsSendingIps,
  fetchMetricsIpPools,
  fetchMetricsTemplates,
  listSubaccounts,
  listSendingDomains,
  typeaheadCache,
}) {
  const { filters: initialFilters = [] } = reportOptions;

  const [state, dispatch] = useReducer(reducer, {
    //Initialized format of filters as [{ key: key, value: [array of values]}, ...]
    filters: initialFilters.length
      ? _.map(
          _.reduce(
            //Groups and cleans up value array
            initialFilters,
            (acc, value) => {
              acc[value.type] = acc[value.type] || [];
              acc[value.type].push(value);
              return acc;
            },
            {},
          ),
          //Restructures to be an array instead of an object
          (value, key) => {
            return { key, value };
          },
        )
      : [{ value: [] }], //Empty initial value if there are no initial filters
  });

  const FILTER_REQUESTS = {
    'Recipient Domain': fetchMetricsDomains,
    Subaccount: listSubaccounts,
    Campaign: fetchMetricsCampaigns,
    Template: fetchMetricsTemplates,
    'Sending Domain': listSendingDomains,
    'IP Pool': fetchMetricsIpPools,
    'Sending IP': fetchMetricsSendingIps,
  };

  const cleanFilters = useCallback(
    key => {
      return Object.keys(FILTER_REQUESTS).filter(selectKey => {
        return (
          key === selectKey || !_.find(state.filters, ({ key: stateKey }) => stateKey === selectKey)
        );
      });
    },
    [state.filters, FILTER_REQUESTS],
  );

  const { filters } = state;

  const handleSubmit = () => {
    //Formats the filters for the query
    const filters = state.filters.reduce((acc, { key, value }) => {
      if (!key) {
        return acc;
      }

      return [...acc, ...value];
    }, []);
    setFilters(filters);
    closeDrawer();
  };

  return (
    <>
      <Box p="500" paddingBottom="100px">
        {filters.map(({ key, value }, index) => (
          <Box key={`filters_section_${index}`} mb="500">
            <Box mb="200">
              <Grid>
                <Grid.Column>
                  <Select
                    id={`select-resource-${index}`}
                    options={cleanFilters(key).map(value => ({ value, label: value }))}
                    placeholder="Select Resource"
                    placeholderValue="Select Resource"
                    value={key || 'Select Resource'}
                    label="Type"
                    onChange={({ target: { value } }) => {
                      dispatch({ type: 'SET_FILTER_TYPE', filterType: value, index });
                    }}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Inline align="right">
                    <Button
                      size="small"
                      onClick={() => {
                        dispatch({ type: 'REMOVE_FILTER_TYPE', index });
                      }}
                    >
                      <span>Remove&nbsp;</span>
                      <Close />
                    </Button>
                  </Inline>
                  <Box>
                    <strong className={styles.Conditional}>equals</strong>
                  </Box>
                </Grid.Column>
              </Grid>
            </Box>
            <Box>
              {key && (
                <Typeahead
                  id={`filter_typeahead_${index}`}
                  lookaheadRequest={FILTER_REQUESTS[key]}
                  reportOption={reportOptions}
                  index={index}
                  dispatch={dispatch}
                  value={value}
                  type={key}
                  label={key}
                  results={typeaheadCache[key]}
                />
              )}
            </Box>
          </Box>
        ))}
        <Button onClick={() => dispatch({ type: 'ADD_FILTER_TYPE' })}>
          <span>Add Filter</span>&nbsp;
          <Add />
        </Button>
      </Box>
      <Drawer.Footer>
        <Box display="flex">
          <Box pr="100" flex="1">
            <Button width="100%" onClick={handleSubmit} variant="primary">
              Apply Filters
            </Button>
          </Box>
          <Box pl="100" flex="1">
            <Button
              width="100%"
              onClick={() => {
                dispatch({ type: 'RESET_FILTERS' });
              }}
              variant="secondary"
            >
              Clear Filters
            </Button>
          </Box>
        </Box>
      </Drawer.Footer>
    </>
  );
}

export default connect(
  state => ({
    typeaheadCache: selectCacheReportBuilder(state),
  }),
  {
    fetchMetricsDomains,
    fetchMetricsCampaigns,
    fetchMetricsSendingIps,
    fetchMetricsIpPools,
    fetchMetricsTemplates,
    listSubaccounts,
    listSendingDomains,
    initTypeaheadCache,
    setFilters,
  },
)(AddFiltersSection);
