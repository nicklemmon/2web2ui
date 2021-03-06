import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { ApiErrorBanner, Loading, PanelLoading } from 'src/components';
import { PageLink } from 'src/components/links';
import { Grid, Layout, Page, Panel, Stack, Text } from 'src/components/matchbox';
import { useHibana } from 'src/context/HibanaContext';
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
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  useEffect(() => {
    getIncident(id).then(incident => {
      listIncidentsForResource(incident.resource);
      listIncidentsForBlocklist(incident.blocklist_name);
      listHistoricalResolvedIncidents(incident.blocklist_name, incident.resource);
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
    blocklist_name = '',
    resource = '',
    days_listed,
    resolved_at_timestamp,
    occurred_at_timestamp,
  } = incident || {};

  const renderError = () => (
    <div data-id="error-banner">
      <ApiErrorBanner
        message="Sorry, we seem to have had some trouble loading your blocklist incidents."
        errorDetails={error.message}
        reload={() => {
          getIncident(id).then(incident => {
            listIncidentsForResource(incident.resource);
            listIncidentsForBlocklist(incident.blocklist_name);
            listHistoricalResolvedIncidents(incident.blocklist_name, incident.resource);
          });
        }}
      />
    </div>
  );

  const renderOGContent = () => {
    if (error) {
      return renderError();
    }

    return (
      <>
        <Grid>
          <Grid.Column lg={6} xs={12}>
            <Panel.LEGACY data-id="incident-details">
              <IncidentDetails
                resourceName={resource}
                blocklistName={blocklist_name}
                listedTimestamp={occurred_at_timestamp}
                resolvedTimestamp={resolved_at_timestamp}
                daysListed={days_listed}
                historicalIncidents={historicalIncidents}
              />
            </Panel.LEGACY>
          </Grid.Column>
          <Grid.Column lg={6} xs={12}>
            {historicalIncidentsPending ? (
              <PanelLoading minHeight="250px" />
            ) : (
              <RelatedIncidents
                incident={{ ...incident, id }}
                incidents={historicalIncidents}
                loading={historicalIncidentsPending}
                name={`${resource} on ${blocklist_name}`}
                type="history"
              />
            )}
          </Grid.Column>
        </Grid>
        <Grid>
          <Grid.Column lg={6} xs={12}>
            <RelatedIncidents
              incident={{ ...incident, id }}
              incidents={incidentsForBlocklist}
              loading={incidentsForBlocklistPending}
              name={blocklist_name}
              type="blocklist"
            />
          </Grid.Column>
          <Grid.Column lg={6} xs={12}>
            <RelatedIncidents
              incident={{ ...incident, id }}
              incidents={incidentsForResource}
              loading={incidentsForResourcePending}
              name={resource}
              type="resource"
            />
          </Grid.Column>
        </Grid>
      </>
    );
  };

  const renderHibanaContent = () => {
    if (error) {
      return renderError();
    }

    return (
      <>
        <Layout>
          <Layout.Section annotated>
            <Layout.SectionTitle>Incident Details</Layout.SectionTitle>
          </Layout.Section>
          <Layout.Section>
            {historicalIncidentsPending ? (
              <PanelLoading minHeight="150px" />
            ) : (
              <Panel.LEGACY data-id="incident-details">
                <IncidentDetails
                  resourceName={resource}
                  blocklistName={blocklist_name}
                  listedTimestamp={occurred_at_timestamp}
                  resolvedTimestamp={resolved_at_timestamp}
                  daysListed={days_listed}
                />
              </Panel.LEGACY>
            )}
          </Layout.Section>
        </Layout>
        <Layout>
          <Layout.Section annotated>
            <Layout.SectionTitle>Historic Incidents</Layout.SectionTitle>
            Previous incidents involving {resource} and {blocklist_name}
          </Layout.Section>
          <Layout.Section>
            <RelatedIncidents
              incident={{ ...incident, id }}
              incidents={historicalIncidents}
              loading={historicalIncidentsPending}
              name={`${resource} on ${blocklist_name}`}
              type="history"
            />
          </Layout.Section>
        </Layout>
        <Layout>
          <Layout.Section annotated>
            <Layout.SectionTitle>Other Incidents for this Resource</Layout.SectionTitle>
            <Stack space="400">
              <Text>Most recent incidents involving {resource}</Text>
              <PageLink to={`/signals/blocklist/incidents?search=resource:${resource}`}>
                View All Incidents for this Resource
              </PageLink>
            </Stack>
          </Layout.Section>
          <Layout.Section>
            <RelatedIncidents
              incident={{ ...incident, id }}
              incidents={incidentsForResource}
              loading={incidentsForResourcePending}
              name={resource}
              type="resource"
            />
          </Layout.Section>
        </Layout>
        <Layout>
          <Layout.Section annotated>
            <Layout.SectionTitle>Other Incidents for this Blocklist</Layout.SectionTitle>
            <Stack space="400">
              <Text> Most recent incidents involving {blocklist_name}</Text>
              <PageLink
                to={`/signals/blocklist/incidents?search=bloacklist_name:${blocklist_name}`}
              >
                View All Incidents for this Blocklist
              </PageLink>
            </Stack>
          </Layout.Section>
          <Layout.Section>
            <RelatedIncidents
              incident={{ ...incident, id }}
              incidents={incidentsForBlocklist}
              loading={incidentsForResourcePending}
              name={blocklist_name}
              type="blocklist"
            />
          </Layout.Section>
        </Layout>
      </>
    );
  };

  return (
    <Page
      title="Blocklist Incident"
      breadcrumbAction={{
        content: 'Blocklist Incidents',
        to: '/signals/blocklist/incidents',
        component: PageLink,
      }}
    >
      {isHibanaEnabled ? renderHibanaContent() : renderOGContent()}
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
