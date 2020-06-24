import * as blocklist from '../blocklist';
import sparkpostApiRequest from '../helpers/sparkpostApiRequest';

jest.mock('src/actions/helpers/sparkpostApiRequest', () => jest.fn(a => a));

describe('Action Creator: Blocklist', () => {
  it('it makes request to list incidents', async () => {
    await blocklist.listIncidents('2019-12-01T10:10', '2019-12-11T10:10');
    expect(sparkpostApiRequest).toHaveBeenCalledWith({
      type: 'LIST_INCIDENTS',
      meta: {
        method: 'GET',
        url: '/v1/blacklist-monitors/incidents',
        showErrorAlert: false,
        params: {
          from: '2019-12-01T10:10',
          to: '2019-12-11T10:10',
        },
      },
    });
  });

  it('it makes request to get a specific incident', async () => {
    await blocklist.getIncident('abc123');
    expect(sparkpostApiRequest).toHaveBeenCalledWith({
      type: 'GET_INCIDENT',
      meta: {
        method: 'GET',
        url: `/v1/blacklist-monitors/incidents/abc123`,
        showErrorAlert: false,
      },
    });
  });

  it('it makes request to get list incidents for a specific resource', async () => {
    await blocklist.listIncidentsForResource('123.123.123.1');
    expect(sparkpostApiRequest).toHaveBeenCalledWith({
      type: 'LIST_INCIDENTS_FOR_RESOURCE',
      meta: {
        method: 'GET',
        url: `/v1/blacklist-monitors/incidents`,
        showErrorAlert: false,
        params: {
          resources: '123.123.123.1',
          from: '2019-01-01',
        },
      },
    });
  });

  it('it makes request to list incidents for a specific blocklist', async () => {
    await blocklist.listIncidentsForBlocklist('spamhaus');
    expect(sparkpostApiRequest).toHaveBeenCalledWith({
      type: 'LIST_INCIDENTS_FOR_BLOCKLIST',
      meta: {
        method: 'GET',
        url: `/v1/blacklist-monitors/incidents`,
        showErrorAlert: false,
        params: {
          from: '2019-01-01',
          blacklists: 'spamhaus',
        },
      },
    });
  });

  it('it makes request to list historical incidents for a specific resource and blocklist', async () => {
    await blocklist.listHistoricalResolvedIncidents('spamhaus', '123.123.123.1');
    expect(sparkpostApiRequest).toHaveBeenCalledWith({
      type: 'LIST_HISTORICAL_INCIDENTS',
      meta: {
        method: 'GET',
        url: `/v1/blacklist-monitors/123.123.123.1/incidents`,
        showErrorAlert: false,
        params: {
          from: '2019-01-01',
          blacklists: 'spamhaus',
          limit: 7,
          status: 'resolved',
        },
      },
    });
  });

  it('makes a request to add watchlist resource', async () => {
    await blocklist.watchlistAdd('192.168.0.1');
    expect(sparkpostApiRequest).toHaveBeenCalledWith({
      type: 'ADD_WATCHLIST',
      meta: {
        method: 'POST',
        url: '/v1/blacklist-monitors',
        showErrorAlert: false,
        data: {
          resource: '192.168.0.1',
        },
      },
    });
  });

  it('it makes request to list monitors', async () => {
    await blocklist.listMonitors();
    expect(sparkpostApiRequest).toHaveBeenCalledWith({
      type: 'LIST_MONITORS',
      meta: {
        method: 'GET',
        url: '/v1/blacklist-monitors',
        showErrorAlert: false,
      },
    });
  });

  it('it makes request to delete monitor', async () => {
    await blocklist.deleteMonitor('test');
    expect(sparkpostApiRequest).toHaveBeenCalledWith({
      type: 'DELETE_MONITOR',
      meta: {
        method: 'DELETE',
        url: '/v1/blacklist-monitors/test',
        resource: 'test',
      },
    });
  });

  it('it makes request to list blocklists', async () => {
    await blocklist.listBlocklists();
    expect(sparkpostApiRequest).toHaveBeenCalledWith({
      type: 'LIST_BLOCKLISTS',
      meta: {
        method: 'GET',
        url: '/v1/blacklist-monitors/blacklists',
      },
    });
  });
});
