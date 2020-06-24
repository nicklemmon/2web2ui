import * as blocklistSelectors from '../blocklist';
const RealDate = Date;

describe('Blocklist Selectors: ', () => {
  let incidents, monitors;
  let formattedIncidents;
  beforeAll(() => {
    global.Date.now = jest.fn(() => new Date('2019-12-27T10:20:30Z').getTime());
  });
  afterAll(() => {
    global.Date = RealDate;
  });
  beforeEach(() => {
    incidents = [
      {
        id: 'id-1',
        resource: 'foo',
        blacklist_name: 'spamhaus-sbl',
        occurred_at: '2019-07-23T12:48:00.000Z',
        status: 'active',
      },
    ];

    formattedIncidents = [
      {
        ...incidents[0],
        occurred_at_formatted: 'Jul 23 2019, 8:48am',
        occurred_at_timestamp: 1563886080000,
        resolved_at_formatted: null,
        resolved_at_timestamp: 0,
        days_listed: 156,
        status: 'resolved',
      },
    ];

    monitors = [
      {
        resource: 'foo',
        currently_blacklisted_on: ['bar'],
        last_listed_at: '2019-07-23T12:48:00.000Z',
        watched_at: '2019-07-23T12:48:00.000Z',
        total_listing_count: 12,
        active_listing_count: 2,
      },
    ];
  });

  it('selectIncidentsList returns formatted incidents data', () => {
    expect(blocklistSelectors.selectIncidentsList({ blocklist: { incidents } })).toEqual(
      formattedIncidents,
    );
  });

  it('selectIncident returns formatted incident for active incident', () => {
    expect(blocklistSelectors.selectIncident({ blocklist: { incident: incidents[0] } })).toEqual(
      formattedIncidents[0],
    );
  });

  it('selectIncident returns formatted incident with resolved date', () => {
    const resolvedIncident = {
      ...incidents[0],
      resolved_at: '2019-07-25T12:48:00.000Z',
    };

    const formattedResolvedIncident = {
      ...formattedIncidents[0],
      resolved_at: '2019-07-25T12:48:00.000Z',
      resolved_at_formatted: 'Jul 25 2019, 8:48am',
      resolved_at_timestamp: 1564058880000,
      days_listed: 2,
    };

    expect(
      blocklistSelectors.selectIncident({ blocklist: { incident: resolvedIncident } }),
    ).toEqual(formattedResolvedIncident);
  });

  it('selectIncident returns formatted incident with listed length < 1 day as 1 day', () => {
    const resolvedZeroDayIncident = {
      ...incidents[0],
      resolved_at: '2019-07-23T12:49:00.000Z',
    };
    expect(
      blocklistSelectors.selectIncident({ blocklist: { incident: resolvedZeroDayIncident } }),
    ).toHaveProperty('days_listed', 1);
  });

  it('selectBlocklistedCount returns total number of resources blocklisted', () => {
    expect(blocklistSelectors.selectBlocklistedCount({ blocklist: { monitors } })).toEqual(2);
  });

  it('selectRelatedIncidentsForResource returns resources not including the current incident', () => {
    const incident = {
      id: 'id-1',
      resource: 'foo',
      blacklist_name: 'spamhaus-sbl',
      occurred_at: '2019-07-23T12:48:00.000Z',
    };

    const incidentsForResource = [
      {
        id: 'id-1',
        resource: 'foo',
        blacklist_name: 'spamhaus-sbl',
        occurred_at: '2019-07-23T12:48:00.000Z',
      },
      {
        id: 'id-2',
        resource: 'foo',
        blacklist_name: 'spamhaus-sbl 2',
        occurred_at: '2019-07-23T12:48:00.000Z',
      },
      {
        id: 'id-3',
        resource: 'foo',
        blacklist_name: 'spamhaus-sbl 3',
        occurred_at: '2019-07-23T12:48:00.000Z',
      },
      {
        id: 'id-4',
        resource: 'foo',
        blacklist_name: 'spamhaus-sbl 4',
        occurred_at: '2019-07-23T12:48:00.000Z',
      },
      {
        id: 'id-5',
        resource: 'foo',
        blacklist_name: 'spamhaus-sbl 5',
        occurred_at: '2019-07-23T12:48:00.000Z',
      },
    ];

    expect(
      blocklistSelectors.selectRelatedIncidentsForResource({
        blocklist: { incidentsForResource, incident },
      }),
    ).toHaveLength(3);

    // list of 3 where one is same id, so 2 total
    expect(
      blocklistSelectors.selectRelatedIncidentsForResource({
        blocklist: { incidentsForResource: incidentsForResource.slice(0, 3), incident },
      }),
    ).toHaveLength(2);

    // list of 3 where none have current id, so 3 total
    expect(
      blocklistSelectors.selectRelatedIncidentsForResource({
        blocklist: { incidentsForResource: incidentsForResource.slice(1), incident },
      }),
    ).toHaveLength(3);
  });

  it('selectRelatedIncidentsForBlocklist returns resources not including the current incident', () => {
    const incident = {
      id: 'id-1',
      resource: 'foo',
      blacklist_name: 'spamhaus-sbl',
      occurred_at: '2019-07-23T12:48:00.000Z',
    };

    const incidentsForBlocklist = [
      {
        id: 'id-1',
        resource: 'foo 1',
        blacklist_name: 'spamhaus-sbl',
        occurred_at: '2019-07-23T12:48:00.000Z',
      },
      {
        id: 'id-2',
        resource: 'foo 2',
        blacklist_name: 'spamhaus-sbl',
        occurred_at: '2019-07-23T12:48:00.000Z',
      },
      {
        id: 'id-3',
        resource: 'foo 3',
        blacklist_name: 'spamhaus-sbl',
        occurred_at: '2019-07-23T12:48:00.000Z',
      },
      {
        id: 'id-4',
        resource: 'foo 4',
        blacklist_name: 'spamhaus-sbl',
        occurred_at: '2019-07-23T12:48:00.000Z',
      },
      {
        id: 'id-5',
        resource: 'foo 5',
        blacklist_name: 'spamhaus-sbl',
        occurred_at: '2019-07-23T12:48:00.000Z',
      },
    ];

    expect(
      blocklistSelectors.selectRelatedIncidentsForBlocklist({
        blocklist: { incidentsForBlocklist, incident },
      }),
    ).toHaveLength(3);

    // list of 3 where one is same id, so 2 total
    expect(
      blocklistSelectors.selectRelatedIncidentsForBlocklist({
        blocklist: { incidentsForBlocklist: incidentsForBlocklist.slice(0, 3), incident },
      }),
    ).toHaveLength(2);

    // list of 3 where none have current id, so 3 total
    expect(
      blocklistSelectors.selectRelatedIncidentsForBlocklist({
        blocklist: { incidentsForBlocklist: incidentsForBlocklist.slice(1), incident },
      }),
    ).toHaveLength(3);
  });

  it('selectHistoricalIncidents returns 3 resources not including the current incident', () => {
    const incident = {
      id: 'id-1',
      resource: 'foo',
      blacklist_name: 'spamhaus-sbl',
      occurred_at: '2019-07-23T12:48:00.000Z',
    };

    const historicalIncidents = [
      {
        id: 'id-1',
        resource: 'foo',
        blacklist_name: 'spamhaus-sbl',
        occurred_at: '2019-07-22T12:48:00.000Z',
      },
      {
        id: 'id-2',
        resource: 'foo',
        blacklist_name: 'spamhaus-sbl',
        occurred_at: '2019-07-21T12:48:00.000Z',
      },
      {
        id: 'id-3',
        resource: 'foo',
        blacklist_name: 'spamhaus-sbl',
        occurred_at: '2019-07-20T12:48:00.000Z',
      },
      {
        id: 'id-4',
        resource: 'foo',
        blacklist_name: 'spamhaus-sbl',
        occurred_at: '2019-07-19T12:48:00.000Z',
      },
      {
        id: 'id-5',
        resource: 'foo',
        blacklist_name: 'spamhaus-sbl',
        occurred_at: '2019-07-18T12:48:00.000Z',
      },
      {
        id: 'id-6',
        resource: 'foo',
        blacklist_name: 'spamhaus-sbl',
        occurred_at: '2019-07-17T12:48:00.000Z',
      },
      {
        id: 'id-7',
        resource: 'foo',
        blacklist_name: 'spamhaus-sbl',
        occurred_at: '2019-07-16T12:48:00.000Z',
      },
    ];

    // list of 7 where one is same id, so 6 total
    expect(
      blocklistSelectors.selectHistoricalIncidents({
        blocklist: { historicalIncidents, incident },
      }),
    ).toHaveLength(6);

    // list of 3 where one is same id, so 2 total
    expect(
      blocklistSelectors.selectHistoricalIncidents({
        blocklist: { historicalIncidents: historicalIncidents.slice(0, 3), incident },
      }),
    ).toHaveLength(2);

    // list of 6 where none have current id, so 6 total
    expect(
      blocklistSelectors.selectHistoricalIncidents({
        blocklist: { historicalIncidents: historicalIncidents.slice(1), incident },
      }),
    ).toHaveLength(6);
  });

  it('selectDetailsPageError returns the incident error before other error types', () => {
    const incidentError = { error: 'incident' };
    const resourceError = { error: 'resource' };
    expect(
      blocklistSelectors.selectDetailsPageError({
        blocklist: { incidentError, incidentsForResourceError: resourceError },
      }),
    ).toEqual(incidentError);
  });

  it('selectDetailsPageError returns the first error it finds after incident error is not there', () => {
    const incidentsForResourceError = { error: 'resource' };
    const incidentsForBlocklistError = { error: 'blocklist' };
    const historicalIncidentsError = { error: 'historical' };
    expect(
      blocklistSelectors.selectDetailsPageError({
        blocklist: {
          incidentsForBlocklistError,
          incidentsForResourceError,
          historicalIncidentsError,
        },
      }),
    ).toEqual(incidentsForResourceError);
  });

  it('selectDetailsPageError returns the first error it finds after incident error is not there - 2', () => {
    const incidentsForResourceError = false;
    const incidentsForBlocklistError = { error: 'blocklist' };
    const historicalIncidentsError = { error: 'historical' };
    expect(
      blocklistSelectors.selectDetailsPageError({
        blocklist: {
          incidentsForBlocklistError,
          incidentsForResourceError,
          historicalIncidentsError,
        },
      }),
    ).toEqual(incidentsForBlocklistError);
  });

  it('selectDetailsPageError returns the first error it finds after incident error is not there - 3', () => {
    const incidentsForResourceError = false;
    const incidentsForBlocklistError = false;
    const historicalIncidentsError = { error: 'historical' };
    expect(
      blocklistSelectors.selectDetailsPageError({
        blocklist: {
          incidentsForBlocklistError,
          incidentsForResourceError,
          historicalIncidentsError,
        },
      }),
    ).toEqual(historicalIncidentsError);
  });
});
