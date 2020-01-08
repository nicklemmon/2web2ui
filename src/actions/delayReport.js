import { fetchDeliverability, fetchDelayReasonsByDomain } from 'src/actions/metrics';
import { getMetricsFromKeys, getQueryFromOptions } from 'src/helpers/metrics';

const DELIVERABILITY_METRICS = getMetricsFromKeys([
  'count_accepted',
  'count_delayed',
  'count_delayed_first',
]);

export function refreshDelayReport(updates = {}) {
  return dispatch => {
    return Promise.all([
      dispatch(
        fetchDeliverability({
          type: 'GET_DELAY_REPORT_AGGREGATES',
          params: getQueryFromOptions({ ...updates, metrics: DELIVERABILITY_METRICS }),
        }),
      ),
      dispatch(fetchDelayReasonsByDomain(getQueryFromOptions(updates))),
    ]);
  };
}
