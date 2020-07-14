import * as metrics from '../metrics';
import { snapshotActionCases } from '../../__testHelpers__/snapshotActionHelpers';
import { isUserUiOptionSet } from 'src/helpers/conditions/user';
jest.mock('src/actions/helpers/sparkpostApiRequest');
jest.mock('src/helpers/conditions/user', () => ({ isUserUiOptionSet: jest.fn(() => () => false) }));

describe('Metrics Actions', () => {
  snapshotActionCases('fetch', [
    {
      name: 'metrics domains',
      action: metrics.fetchMetricsDomains,
    },
    {
      name: 'metrics campaigns',
      action: metrics.fetchMetricsCampaigns,
    },
    {
      name: 'metrics sending ips',
      action: metrics.fetchMetricsSendingIps,
    },
    {
      name: 'metrics ip pools',
      action: metrics.fetchMetricsIpPools,
    },
    {
      name: 'metrics templates',
      action: metrics.fetchMetricsTemplates,
    },
    {
      name: 'metrics (time series)',
      action: metrics.getTimeSeries,
    },
    {
      name: 'Deliverability',
      action: () => metrics.fetchDeliverability({ params: {}, type: 'GET_ACCEPTED_AGGREGATES' }),
    },
    {
      name: 'Bounce Classifications',
      action: metrics.fetchBounceClassifications,
    },
    {
      name: 'Bounce Reasons',
      action: metrics.fetchBounceReasons,
    },
    {
      name: 'Bounce Reasons By Domain',
      action: () =>
        metrics.fetchBounceReasonsByDomain({}, 'FETCH_METRICS_BOUNCE_REASONS_BY_DOMAIN'),
    },
    {
      name: 'Rejection Reasons By Domain',
      action: metrics.fetchRejectionReasonsByDomain,
    },
    {
      name: 'Delay Reasons By Domain',
      action: metrics.fetchDelayReasonsByDomain,
    },
    {
      name: 'Deliveries By Attempt',
      action: metrics.fetchDeliveriesByAttempt,
    },
  ]);

  it('makes request using rollup query param when ui option is set', () => {
    isUserUiOptionSet.mockImplementationOnce(() => () => true);
    const dispatch = jest.fn(a => a);
    const thunk = metrics.fetch({ path: 'foo/1', params: { foo: 'bar' } });
    thunk(dispatch, jest.fn);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'FETCH_METRICS',
      meta: {
        method: 'GET',
        url: '/v1/metrics/foo/1',
        params: {
          foo: 'bar',
          rollup: true,
        },
      },
    });
  });
});
