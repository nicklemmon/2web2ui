import React, { useCallback, useContext, useMemo, useReducer, createContext } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import { selectFeatureFlaggedMetrics } from 'src/selectors/metrics';
import { getRelativeDates } from 'src/helpers/date';
import {
  getMetricsFromKeys,
  getPrecision as getRawPrecision,
  getRollupPrecision,
} from 'src/helpers/metrics';
import { getLocalTimezone } from 'src/helpers/date';
import { dedupeFilters } from 'src/helpers/reports';
import { stringifyTypeaheadfilter } from 'src/helpers/string';
import { selectCondition } from 'src/selectors/accessConditionState';
import { isAccountUiOptionSet } from 'src/helpers/conditions/account';
import config from 'src/config';
import { hydrateFilters } from '../helpers';

const ReportOptionsContext = createContext({});

const initialState = {
  filters: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_FILTERS': {
      const mergedFilters = dedupeFilters([...state.filters, ...action.payload]);
      if (mergedFilters.length === state.filters.length) {
        return state;
      }
      return { ...state, filters: mergedFilters };
    }

    case 'REMOVE_FILTER':
      return {
        ...state,
        filters: [
          ...state.filters.slice(0, action.payload),
          ...state.filters.slice(action.payload + 1),
        ],
      };

    case 'SET_FILTERS':
      return {
        ...state,
        filters: action.payload,
      };

    case 'CLEAR_FILTERS':
      return { ...state, filters: [] };

    case 'UPDATE_REPORT_OPTIONS': {
      const { payload, meta } = action;
      const { useMetricsRollup } = meta;
      let update = { ...state, ...payload };
      const getPrecision = useMetricsRollup ? getRollupPrecision : getRawPrecision;

      if (!update.timezone || !useMetricsRollup) {
        update.timezone = getLocalTimezone();
      }

      if (!update.metrics) {
        update.metrics = config.reportBuilder.defaultMetrics;
      }

      if (payload.filters) {
        update.filters = dedupeFilters(payload.filters);
      }

      if (!update.relativeRange) {
        update.relativeRange = '7days';
      }

      //old version of update

      const rollupPrecision = useMetricsRollup && update.precision;
      if (update.relativeRange !== 'custom') {
        const { from, to } = getRelativeDates(update.relativeRange, {
          precision: rollupPrecision,
        });
        //for metrics rollup, when using the relative dates, get the precision, else use the given precision
        //If precision is not in the URL, get the recommended precision.
        const precision = getPrecision({ from, to, precision: rollupPrecision });
        update = { ...update, from, to, precision };
      } else {
        const precision = getPrecision({
          from: update.from,
          to: moment(update.to),
          precision: rollupPrecision,
        });

        update = { ...update, precision };
      }
      return {
        ...update,
        isReady: true,
      };
    }

    default:
      return state;
  }
};

const reducerV2 = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REPORT_OPTIONS': {
      const { payload, meta } = action;
      const { useMetricsRollup, subaccounts } = meta;
      let update = { ...state, ...payload };
      const getPrecision = useMetricsRollup ? getRollupPrecision : getRawPrecision;

      if (!update.timezone || !useMetricsRollup) {
        update.timezone = getLocalTimezone();
      }

      if (!update.metrics) {
        update.metrics = config.reportBuilder.defaultMetrics;
      }

      // If queryFilters, then was converted over from older filters.
      if (payload.queryFilters) {
        update.filters = hydrateFilters(payload.queryFilters, { subaccounts });
      }

      if (!update.relativeRange) {
        update.relativeRange = '7days';
      }

      //old version of update

      const rollupPrecision = useMetricsRollup && update.precision;
      if (update.relativeRange !== 'custom') {
        const { from, to } = getRelativeDates(update.relativeRange, {
          precision: rollupPrecision,
        });
        //for metrics rollup, when using the relative dates, get the precision, else use the given precision
        //If precision is not in the URL, get the recommended precision.
        const precision = getPrecision({ from, to, precision: rollupPrecision });
        update = { ...update, from, to, precision };
      } else {
        const precision = getPrecision({
          from: update.from,
          to: moment(update.to),
          precision: rollupPrecision,
        });

        update = { ...update, precision };
      }
      return {
        ...update,
        isReady: true,
      };
    }

    default:
      return state;
  }
};

const getSelectors = reportOptions => {
  const selectDateOptions = {
    from: moment(reportOptions.from)
      .utc()
      .format(),
    to: moment(reportOptions.to)
      .utc()
      .format(),
    range: reportOptions.relativeRange,
    timezone: reportOptions.timezone,
    precision: reportOptions.precision,
  };

  const selectTypeaheadFilters = {
    filters: (reportOptions.filters || []).map(stringifyTypeaheadfilter),
  };

  const selectSummaryMetrics = {
    metrics: (reportOptions.metrics || []).map(metric =>
      typeof metric === 'string' ? metric : metric.key,
    ),
    //TODO RB CLEANUP: can probably remove the check if it's an object
  };

  const selectSummaryMetricsProcessed = getMetricsFromKeys(reportOptions.metrics || [], true);

  /**
   * Converts reportOptions for url sharing
   */
  const selectReportSearchOptions = { ...selectDateOptions, ...selectTypeaheadFilters };

  /**
   * Converts reportOptions for url sharing for the summary chart
   */
  const selectSummaryChartSearchOptions = {
    ...selectDateOptions,
    ...selectTypeaheadFilters,
    ...selectSummaryMetrics,
  };

  return {
    selectSummaryMetricsProcessed,
    selectReportSearchOptions,
    selectSummaryChartSearchOptions,
  };
};

const ReportOptionsContextProvider = props => {
  const { useMetricsRollup, isComparatorsEnabled, subaccounts } = props;
  const [state, dispatch] = useReducer(isComparatorsEnabled ? reducerV2 : reducer, initialState);

  const refreshReportOptions = useCallback(
    payload => {
      dispatch({
        type: 'UPDATE_REPORT_OPTIONS',
        payload,
        meta: { useMetricsRollup, subaccounts },
      });
    },
    [dispatch, useMetricsRollup, subaccounts],
  );

  const addFilters = useCallback(
    payload => {
      dispatch({
        type: 'ADD_FILTERS',
        payload,
      });
    },
    [dispatch],
  );

  const removeFilter = useCallback(
    payload => {
      dispatch({
        type: 'REMOVE_FILTER',
        payload,
      });
    },
    [dispatch],
  );

  //Not currently used but I am leaving them here for now.
  const setFilters = useCallback(
    payload => {
      dispatch({
        type: 'SET_FILTERS',
        payload,
      });
    },
    [dispatch],
  );

  //Not currently used but I am leaving them here for now.
  const clearFilters = useCallback(() => {
    dispatch({
      type: 'CLEAR_FILTERS',
    });
  }, [dispatch]);

  const actions = { addFilters, clearFilters, setFilters, removeFilter, refreshReportOptions };
  const selectors = useMemo(() => getSelectors(state), [state]);
  return (
    <ReportOptionsContext.Provider value={{ state, actions, selectors }}>
      {props.children}
    </ReportOptionsContext.Provider>
  );
};

const mapStateToProps = state => ({
  subaccounts: state.subaccounts.list,
  useMetricsRollup: selectFeatureFlaggedMetrics(state).useMetricsRollup,
  isComparatorsEnabled: selectCondition(isAccountUiOptionSet('allow_report_filters_v2'))(state),
});

export const ReportBuilderContextProvider = connect(mapStateToProps)(ReportOptionsContextProvider);

export const useReportBuilderContext = () => useContext(ReportOptionsContext);
