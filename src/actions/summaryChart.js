import { fetch as fetchMetrics } from 'actions/metrics';
import { refreshTypeaheadCache } from 'actions/reportFilters';
import { getQueryFromOptions, getMetricsFromKeys } from 'helpers/metrics';
import { getRelativeDates } from 'helpers/date';

export function refresh(updates = {}) {
  return (dispatch, getState) => {
    const state = getState();

    // if new metrics are included, convert them to their full representation from config
    if (updates.metrics) {
      updates.metrics = getMetricsFromKeys(updates.metrics);
    }

    // if relativeRange is included, merge in the calculated from/to values
    if (updates.relativeRange) {
      Object.assign(updates, getRelativeDates(updates.relativeRange) || {});
    }

    // refresh the typeahead cache if the date range has been updated
    const { from, to } = updates;
    if (from || to) {
      const params = getQueryFromOptions({ from, to });
      dispatch(refreshTypeaheadCache(params));
    }

    // merge in existing state
    const options = {
      ...state.summaryChart,
      ...state.reportFilters,
      ...updates
    };

    // convert new meta data into query param format
    const params = getQueryFromOptions(options);

    // get new data
    dispatch(fetchMetrics({ path: 'deliverability/time-series', params }))
      .then((results) => {

        // refresh the chart with the new data
        dispatch({
          type: 'REFRESH_SUMMARY_CHART',
          payload: {
            data: results,
            metrics: options.metrics,
            precision: params.precision
          }
        });

        // refresh the date range
        dispatch({
          type: 'REFRESH_REPORT_RANGE',
          payload: { ...options }
        });
      });
  };
}
