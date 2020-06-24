import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { ApiErrorBanner, Loading, Empty, PanelLoading } from 'src/components';
import { PageLink } from 'src/components/links';
import { Grid, Page, Panel } from 'src/components/matchbox';

import {
  getIncident,
  listIncidentsForResource,
  listIncidentsForBlocklist,
  listHistoricalResolvedIncidents,
} from 'src/actions/blocklist';
import {
  selectIncident,
  selectRelatedIncidentsForResource,
  selectRelatedIncidentsForBlocklist,
  selectHistoricalIncidents,
  selectDetailsPageError,
} from 'src/selectors/blocklist';
import IncidentDetails from './components/IncidentDetails';
import RelatedIncidents from './components/RelatedIncidents';

export const IncidentDetailsPage = ({
  id,
  error,
  loading,
  historicalIncidents,
  incident,
  incidentsForBlocklist,
  incidentsForResource,
  getIncident,
  listIncidentsForResource,
  listIncidentsForBlocklist,
  listHistoricalResolvedIncidents,
  incidentsForResourcePending,
  incidentsForBlocklistPending,
  historicalIncidentsPending,
}) => {
  useEffect(() => {
    getIncident(id).then(incident => {
      listIncidentsForResource(incident.resource);
      listIncidentsForBlocklist(incident.blacklist_name);
      listHistoricalResolvedIncidents(incident.blacklist_name, incident.resource);
    });
  }, [
    getIncident,
    id,
    listIncidentsForBlocklist,
    listIncidentsForResource,
    listHistoricalResolvedIncidents,
  ]);

  if (loading) {
    return <Loading />;
  }

  const {
    blacklist_name = '',
    resource = '',
    days_listed,
    resolved_at_timestamp,
    occurred_at_timestamp,
  } = incident || {};

  const renderContent = () => {
    if (error) {
      return (
        <div data-id="error-banner">
          <ApiErrorBanner
            message="Sorry, we seem to have had some trouble loading your blocklist incidents."
            errorDetails={error.message}
            reload={() => {
              getIncident(id).then(incident => {
                listIncidentsForResource(incident.resource);
                listIncidentsForBlocklist(incident.blacklist_name);
                listHistoricalResolvedIncidents(incident.blacklist_name, incident.resource);
              });
            }}
          />
        </div>
      );
    }

    const renderRelatedIncidentsForBlocklist = () => {
      if (incidentsForBlocklistPending) {
        return <PanelLoading />;
      }

      if (!incidentsForBlocklist.length) {
        return (
          <Panel>
            <Empty message={`No other recent ${blacklist_name} incidents`} />
          </Panel>
        );
      }

      return (
        <Panel data-id="related-incidents-blocklist">
          <RelatedIncidents
            incident={{ ...incident, id }}
            incidents={incidentsForBlocklist}
            type="blocklist"
            header={`Other Recent ${blacklist_name} Incidents`}
          />
        </Panel>
      );
    };

    const renderRelatedIncidentsForResource = () => {
      if (incidentsForResourcePending) {
        return <PanelLoading />;
      }
      if (!incidentsForResource.length) {
        return (
          <Panel>
            <Empty message={`No other recent ${resource} incidents`} />
          </Panel>
        );
      }
      return (
        <Panel data-id="related-incidents-resource">
          <RelatedIncidents
            incident={{ ...incident, id }}
            incidents={incidentsForResource}
            header={`Other Recent ${resource} Incidents`}
          />
        </Panel>
      );
    };

    return (
      <>
        {historicalIncidentsPending ? (
          <PanelLoading minHeight="150px" />
        ) : (
          <Panel sectioned data-id="incident-details">
            <IncidentDetails
              resourceName={resource}
              blocklistName={blacklist_name}
              listedTimestamp={occurred_at_timestamp}
              resolvedTimestamp={resolved_at_timestamp}
              daysListed={days_listed}
              historicalIncidents={historicalIncidents}
            />
          </Panel>
        )}

        <Grid>
          <Grid.Column lg={6} xs={12}>
            {renderRelatedIncidentsForBlocklist()}
          </Grid.Column>
          <Grid.Column lg={6} xs={12}>
            {renderRelatedIncidentsForResource()}
          </Grid.Column>
        </Grid>
      </>
    );
  };

  return (
    <Page
      title={`Blocklist Incident | ${resource || ''} | ${blacklist_name || ''}`}
      breadcrumbAction={{
        content: 'Blocklist Incidents',
        to: '/blocklist/incidents',
        component: PageLink,
      }}
    >
      {renderContent()}
    </Page>
  );
};

const mapStateToProps = (state, props) => {
  const { id } = props.match.params;

  return {
    historicalIncidents: selectHistoricalIncidents(state),
    historicalIncidentsPending: state.blocklist.historicalIncidentsPending,
    id,
    incident: selectIncident(state),
    incidentsForResource: selectRelatedIncidentsForResource(state),
    incidentsForResourcePending: state.blocklist.incidentsForResourcePending,
    incidentsForBlocklist: selectRelatedIncidentsForBlocklist(state),
    incidentsForBlocklistPending: state.blocklist.incidentsForBlocklistPending,
    error: selectDetailsPageError(state),
    loading: state.blocklist.incidentPending,
  };
};
export default connect(mapStateToProps, {
  getIncident,
  listIncidentsForResource,
  listIncidentsForBlocklist,
  listHistoricalResolvedIncidents,
})(IncidentDetailsPage);
