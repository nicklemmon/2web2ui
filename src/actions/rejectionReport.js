import { fetchRejectionReasonsByDomain, fetchDeliverability } from 'src/actions/metrics';
import {
  getQueryFromOptions,
  getMetricsFromKeys,
  getQueryFromOptionsV2,
} from 'src/helpers/metrics';

const REJECTION_METRICS = getMetricsFromKeys(['count_rejected', 'count_targeted']);

export function refreshRejectionReport(updates = {}) {
  return dispatch => {
    const params = getQueryFromOptions({ ...updates, metrics: REJECTION_METRICS });

    return Promise.all([
      dispatch(fetchRejectionReasonsByDomain(params)),
      dispatch(
        fetchDeliverability({
          type: 'GET_REJECTION_AGGREGATES',
          params,
        }),
      ),
    ]);
  };
}

export function refreshRejectionReportV2(updates = {}) {
  return dispatch => {
    const params = getQueryFromOptionsV2({ ...updates, metrics: REJECTION_METRICS });

    return Promise.all([
      dispatch(fetchRejectionReasonsByDomain(params)),
      dispatch(
        fetchDeliverability({
          type: 'GET_REJECTION_AGGREGATES',
          params,
        }),
      ),
    ]);
  };
}
