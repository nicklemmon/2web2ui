import { createSelector } from 'reselect';
import { formatDateTime } from '../helpers/date';
import moment from 'moment';

const getIncident = state => state.blocklist.incident || {};

const getIncidents = state => state.blocklist.incidents;
const getMonitors = state => state.blocklist.monitors;

const getIncidentsForResource = state => state.blocklist.incidentsForResource || [];

const getIncidentsForBlocklist = state => state.blocklist.incidentsForBlocklist || [];

const getHistoricalIncidents = state => state.blocklist.historicalIncidents || [];

const getIncidentError = state => state.blocklist.incidentError || false;

const getIncidentsForResourceError = state => state.blocklist.incidentsForResourceError || false;

const getHistoricalIncidentsError = state => state.blocklist.historicalIncidentsError || false;

const getIncidentsForBlocklistError = state => state.blocklist.incidentsForBlocklistError || false;

const getDaysListed = (resolvedDate, occurredDate) => {
  const resolvedMoment = resolvedDate === null ? moment() : moment(resolvedDate);
  return resolvedMoment.diff(moment(occurredDate), 'days') || 1;
};

const enrichIncident = incident => ({
  ...incident,
  occurred_at_timestamp: incident.occurred_at ? Date.parse(incident.occurred_at) : 0,
  occurred_at_formatted: incident.occurred_at ? formatDateTime(incident.occurred_at) : null,
  resolved_at_timestamp: incident.resolved_at ? Date.parse(incident.resolved_at) : 0,
  resolved_at_formatted: incident.resolved_at ? formatDateTime(incident.resolved_at) : null,
  days_listed: getDaysListed(incident.resolved_at, incident.occurred_at),
  status: incident.status === 'flagged' ? 'active' : 'resolved',
});

export const selectIncident = createSelector([getIncident], incident => enrichIncident(incident));

export const selectIncidentsList = createSelector([getIncidents], incidents =>
  incidents.map(incident => enrichIncident(incident)),
);

const sortActiveThenListedDate = (a, b) => {
  const aIsActive = a.status === 'active';
  const bIsActive = b.status === 'active';
  if (aIsActive && bIsActive) {
    return b.occurred_at_timestamp - a.occurred_at_timestamp;
  } else if (aIsActive && !bIsActive) {
    return -1;
  } else if (!aIsActive && bIsActive) {
    return 1;
  } else {
    return b.resolved_at_timestamp - a.resolved_at_timestamp;
  }
};

export const selectRelatedIncidentsForResource = createSelector(
  [getIncidentsForResource, getIncident],
  (incidents, currentIncident) =>
    incidents
      .filter(
        incident =>
          incident.id !== currentIncident.id &&
          incident.blacklist_name !== currentIncident.blacklist_name,
      )
      .map(incident => enrichIncident(incident))
      .sort(sortActiveThenListedDate)
      .slice(0, 3),
);

export const selectRelatedIncidentsForBlocklist = createSelector(
  [getIncidentsForBlocklist, getIncident],
  (incidents, currentIncident) =>
    incidents
      .filter(
        incident =>
          incident.id !== currentIncident.id && incident.resource !== currentIncident.resource,
      )
      .map(incident => enrichIncident(incident))
      .sort(sortActiveThenListedDate)
      .slice(0, 3),
);

export const selectHistoricalIncidents = createSelector(
  [getHistoricalIncidents, getIncident],
  (incidents, currentIncident) =>
    incidents
      .filter(incident => incident.id !== currentIncident.id)
      .map(incident => enrichIncident(incident))
      .slice(0, 6),
);

export const selectDetailsPageError = createSelector(
  [
    getIncidentError,
    getIncidentsForResourceError,
    getIncidentsForBlocklistError,
    getHistoricalIncidentsError,
  ],
  (incidentError, resourceError, blocklistError, historicalError) => {
    // Return the first error object we find
    switch (true) {
      case incidentError !== false:
        return incidentError;
      case resourceError !== false:
        return resourceError;
      case blocklistError !== false:
        return blocklistError;
      case historicalError !== false:
        return historicalError;
      default:
        return false;
    }
  },
);

export const selectBlocklistedCount = createSelector([getMonitors], monitors =>
  monitors.reduce(
    (totalBlocklistCount, monitor) => totalBlocklistCount + monitor.active_listing_count,
    0,
  ),
);
