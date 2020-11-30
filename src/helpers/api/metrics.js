export function getTimeSeries(params) {
  return {
    method: 'GET',
    url: '/v1/metrics/deliverability/time-series',
    params,
  };
}
