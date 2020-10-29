import * as metrics from '../metrics';
import { snapshotActionCases } from '../../__testHelpers__/snapshotActionHelpers';
import { isUserUiOptionSet } from 'src/helpers/conditions/user';
jest.mock('src/actions/helpers/sparkpostApiRequest');
jest.mock('src/helpers/conditions/user', () => ({ isUserUiOptionSet: jest.fn(() => () => false) }));

describe('Metrics Actions', () => {
  snapshotActionCases('fetch', [
    {
      name: 'metrics domains',
      actionCreator: metrics.fetchMetricsDomains,
    },
    {
      name: 'metrics campaigns',
      actionCreator: metrics.fetchMetricsCampaigns,
    },
    {
      name: 'metrics sending ips',
      actionCreator: metrics.fetchMetricsSendingIps,
    },
    {
      name: 'metrics ip pools',
      actionCreator: metrics.fetchMetricsIpPools,
    },
    {
      name: 'metrics templates',
      actionCreator: metrics.fetchMetricsTemplates,
    },
    {
      name: 'metrics (time series)',
      actionCreator: metrics.getTimeSeries,
    },
    {
      name: 'Deliverability',
      actionCreator: () =>
        metrics.fetchDeliverability({ params: {}, type: 'GET_ACCEPTED_AGGREGATES' }),
    },
    {
      name: 'Bounce Classifications',
      actionCreator: metrics.fetchBounceClassifications,
    },
    {
      name: 'Bounce Reasons',
      actionCreator: metrics.fetchBounceReasons,
    },
    {
      name: 'Bounce Reasons By Domain',
      actionCreator: () =>
        metrics.fetchBounceReasonsByDomain({}, 'FETCH_METRICS_BOUNCE_REASONS_BY_DOMAIN'),
    },
    {
      name: 'Rejection Reasons By Domain',
      actionCreator: metrics.fetchRejectionReasonsByDomain,
    },
    {
      name: 'Delay Reasons By Domain',
      actionCreator: metrics.fetchDelayReasonsByDomain,
    },
    {
      name: 'Deliveries By Attempt',
      actionCreator: metrics.fetchDeliveriesByAttempt,
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
