import { fetch as getMetrics } from 'src/actions/metrics';
import { getMetricsFromKeys, getQueryFromOptions } from 'src/helpers/metrics';

const DELIVERABILITY_METRICS = getMetricsFromKeys([
  'count_accepted',
  'count_clicked',
  'count_sent',
  'count_unique_clicked_approx',
  'count_unique_confirmed_opened_approx',
]);

const LINK_METRICS = getMetricsFromKeys(['count_clicked', 'count_raw_clicked_approx']);

export function refreshEngagementReport(updates = {}) {
  return dispatch => {
    return Promise.all([
      dispatch(
        getMetrics({
          params: getQueryFromOptions({ ...updates, metrics: DELIVERABILITY_METRICS }),
          path: 'deliverability',
          type: 'GET_ENGAGEMENT_AGGREGATE_METRICS',
        }),
      ),
      dispatch(
        getMetrics({
          params: getQueryFromOptions({ ...updates, metrics: LINK_METRICS }),
          path: 'deliverability/link-name',
          type: 'GET_ENGAGEMENT_LINK_METRICS',
        }),
      ),
    ]);
  };
}
