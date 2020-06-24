export const initialState = {
  blocklistsPending: false,
  blocklists: [],
  blocklistsError: null,
  monitorsPending: false,
  monitors: [],
  monitorsError: null,
  incidentsPending: false,
  incidents: [],
  incidentsError: null,
  deleteMonitorPending: false,
  deleteMonitorError: null,
};

export default (state = initialState, { type, payload, meta }) => {
  switch (type) {
    case 'LIST_BLOCKLISTS_PENDING':
      return { ...state, blocklistsPending: true, blocklistsError: null };
    case 'LIST_BLOCKLISTS_FAIL':
      return { ...state, blocklistsPending: false, blocklistsError: payload };
    case 'LIST_BLOCKLISTS_SUCCESS':
      return { ...state, blocklists: payload, blocklistsPending: false, blocklistsError: null };

    case 'LIST_MONITORS_PENDING':
      return { ...state, monitorsPending: true, monitorsError: null };
    case 'LIST_MONITORS_FAIL':
      return { ...state, monitorsPending: false, monitorsError: payload };
    case 'LIST_MONITORS_SUCCESS':
      return { ...state, monitors: payload, monitorsPending: false, monitorsError: null };

    case 'LIST_INCIDENTS_PENDING':
      return { ...state, incidentsPending: true, incidentsError: null };
    case 'LIST_INCIDENTS_FAIL':
      return { ...state, incidentsPending: false, incidentsError: payload };
    case 'LIST_INCIDENTS_SUCCESS':
      return { ...state, incidents: payload, incidentsPending: false, incidentsError: null };

    case 'GET_INCIDENT_PENDING':
      return { ...state, incidentPending: true, incidentError: null };
    case 'GET_INCIDENT_FAIL':
      return { ...state, incidentPending: false, incidentError: payload };
    case 'GET_INCIDENT_SUCCESS':
      return { ...state, incident: payload, incidentPending: false, incidentError: null };

    case 'LIST_INCIDENTS_FOR_RESOURCE_PENDING':
      return { ...state, incidentsForResourcePending: true, incidentsForResourceError: null };
    case 'LIST_INCIDENTS_FOR_RESOURCE_FAIL':
      return { ...state, incidentsForResourcePending: false, incidentsForResourceError: payload };
    case 'LIST_INCIDENTS_FOR_RESOURCE_SUCCESS':
      return {
        ...state,
        incidentsForResource: payload,
        incidentsForResourcePending: false,
        incidentsForResourceError: null,
      };

    case 'LIST_INCIDENTS_FOR_BLOCKLIST_PENDING':
      return { ...state, incidentsForBlocklistPending: true, incidentsForBlocklistError: null };
    case 'LIST_INCIDENTS_FOR_BLOCKLIST_FAIL':
      return { ...state, incidentsForBlocklistPending: false, incidentsForBlocklistError: payload };
    case 'LIST_INCIDENTS_FOR_BLOCKLIST_SUCCESS':
      return {
        ...state,
        incidentsForBlocklist: payload,
        incidentsForBlocklistPending: false,
        incidentsForBlocklistError: null,
      };

    case 'LIST_HISTORICAL_INCIDENTS_PENDING':
      return { ...state, historicalIncidentsPending: true, historicalIncidentsError: null };
    case 'LIST_HISTORICAL_INCIDENTS_FAIL':
      return { ...state, historicalIncidentsPending: false, historicalIncidentsError: payload };
    case 'LIST_HISTORICAL_INCIDENTS_SUCCESS':
      return {
        ...state,
        historicalIncidents: payload,
        historicalIncidentsPending: false,
        historicalIncidentsError: null,
      };

    case 'ADD_WATCHLIST_PENDING':
      return { ...state, watchlistAddPending: true, watchlistAddError: null };
    case 'ADD_WATCHLIST_FAIL':
      return { ...state, watchlistAddPending: false, watchlistAddError: payload };
    case 'ADD_WATCHLIST_SUCCESS':
      return { ...state, watchlistAddPending: false, watchlistAddError: null };

    case 'DELETE_MONITOR_PENDING':
      return { ...state, deleteMonitorPending: true, deleteMonitorError: null };
    case 'DELETE_MONITOR_FAIL':
      return { ...state, deleteMonitorPending: false, deleteMonitorError: payload };
    case 'DELETE_MONITOR_SUCCESS':
      return {
        ...state,
        deleteMonitorPending: false,
        deleteMonitorError: null,
        monitors: state.monitors.filter(a => a.resource !== meta.resource),
      };
    default:
      return state;
  }
};
