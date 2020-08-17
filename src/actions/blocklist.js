import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

export const listBlocklists = () =>
  sparkpostApiRequest({
    type: 'LIST_BLOCKLISTS',
    meta: {
      method: 'GET',
      url: '/v1/blocklist-monitors/blocklists',
    },
  });

export function listMonitors() {
  return sparkpostApiRequest({
    type: 'LIST_MONITORS',
    meta: {
      method: 'GET',
      url: '/v1/blocklist-monitors',
      showErrorAlert: false,
    },
  });
}

export function watchlistAdd(resource) {
  try {
    return sparkpostApiRequest({
      type: 'ADD_WATCHLIST',
      meta: {
        method: 'POST',
        url: '/v1/blocklist-monitors',
        showErrorAlert: false,
        data: {
          resource,
        },
      },
    });
  } catch (err) {
    return Promise.reject(err);
  }
}

export function deleteMonitor(resource) {
  return sparkpostApiRequest({
    type: 'DELETE_MONITOR',
    meta: {
      method: 'DELETE',
      url: `/v1/blocklist-monitors/${resource}`,
      resource,
    },
  });
}

export function listIncidents(from, to) {
  return sparkpostApiRequest({
    type: 'LIST_INCIDENTS',
    meta: {
      method: 'GET',
      url: '/v1/blocklist-monitors/incidents',
      showErrorAlert: false,
      params: {
        from,
        to,
      },
    },
  });
}

export function getIncident(incidentId) {
  return sparkpostApiRequest({
    type: 'GET_INCIDENT',
    meta: {
      method: 'GET',
      url: `/v1/blocklist-monitors/incidents/${incidentId}`,
      showErrorAlert: false,
    },
  });
}

export function listIncidentsForResource(resource, from = '2019-01-01') {
  return sparkpostApiRequest({
    type: 'LIST_INCIDENTS_FOR_RESOURCE',
    meta: {
      method: 'GET',
      url: `/v1/blocklist-monitors/incidents`,
      showErrorAlert: false,
      params: {
        resources: resource,
        from,
      },
    },
  });
}

export function listIncidentsForBlocklist(blocklists, from = '2019-01-01') {
  return sparkpostApiRequest({
    type: 'LIST_INCIDENTS_FOR_BLOCKLIST',
    meta: {
      method: 'GET',
      url: `/v1/blocklist-monitors/incidents`,
      showErrorAlert: false,
      params: {
        blocklists,
        from,
      },
    },
  });
}

export function listHistoricalResolvedIncidents(
  blocklists,
  resource,
  from = '2019-01-01',
  limit = 7,
) {
  return sparkpostApiRequest({
    type: 'LIST_HISTORICAL_INCIDENTS',
    meta: {
      method: 'GET',
      url: `/v1/blocklist-monitors/${resource}/incidents`,
      showErrorAlert: false,
      params: {
        blocklists,
        limit,
        from,
        status: 'resolved',
      },
    },
  });
}
