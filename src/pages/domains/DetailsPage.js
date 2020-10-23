import React, { useState, useEffect } from 'react';
import { Page, Banner, Button, Box } from 'src/components/matchbox';
import { useRouteMatch } from 'react-router-dom';
import { get as getDomain } from 'src/actions/sendingDomains';
import Domains from './components';
import { connect } from 'react-redux';
import { selectDomain } from 'src/selectors/sendingDomains';
import { resolveReadyFor, resolveStatus } from 'src/helpers/domains';
import { ExternalLink, SupportTicketLink } from 'src/components/links';
import { selectTrackingDomainsList } from 'src/selectors/trackingDomains';
import { Loading } from 'src/components/loading/Loading';
import { listTrackingDomains } from 'src/actions/trackingDomains';
import _ from 'lodash';
import { TranslatableText } from 'src/components/text';
import styled from 'styled-components';
import { DETAILS_BASE_URL, EXTERNAL_LINKS } from './constants';
import RedirectAndAlert from 'src/components/globalAlert/RedirectAndAlert';

const StyledBox = styled(Box)`
  max-width: 600px;
`;
function DetailsPage(props) {
  const {
    match,
    history,
    sendingDomainsPending,
    trackingDomainListPending,
    domain,
    getDomain,
    listTrackingDomains,
    trackingDomainList,
    sendingDomainsGetError,
  } = props;
  const resolvedStatus = resolveStatus(domain.status);
  const [warningBanner, toggleBanner] = useState(true);
  const readyFor = resolveReadyFor(domain.status);
  const displaySendingAndBounceSection =
    readyFor.dkim && readyFor.bounce && domain.status.spf_status === 'valid';

  const [isTracking] = useState(useRouteMatch(`${DETAILS_BASE_URL}/tracking`));

  const handleAllDomains = () => {
    if (isTracking) return history.push('/domains/list/tracking');

    if (readyFor.bounce) return history.push('/domains/list/bounce');

    return history.push('/domains/list/sending');
  };

  useEffect(() => {
    if (!isTracking) getDomain(match.params.id);
  }, [getDomain, isTracking, match.params.id]);
  useEffect(() => {
    if (isTracking) listTrackingDomains();
  }, [isTracking, listTrackingDomains]);

  if (sendingDomainsPending || trackingDomainListPending) {
    return <Loading />;
  }

  if (sendingDomainsGetError && !isTracking) {
    return (
      <RedirectAndAlert
        to="/domains/list/sending"
        alert={{ type: 'error', message: sendingDomainsGetError.message }}
      />
    );
  }

  if (
    isTracking &&
    !Boolean(_.find(trackingDomainList, ['domain', match.params.id.toLowerCase()]))
  ) {
    return (
      <RedirectAndAlert
        to="/domains/list/tracking"
        alert={{ type: 'error', message: 'Resource could not be found' }}
      />
    );
  }

  return (
    <Domains.Container>
      <Page
        title="Domain Details"
        breadcrumbAction={{
          content: 'All Domains',
          onClick: handleAllDomains,
        }}
      >
        {resolvedStatus === 'unverified' && warningBanner && !isTracking && (
          <Banner
            status="warning"
            title="Unverified domains will be removed two weeks after being added."
            onDismiss={() => {
              toggleBanner(false);
            }}
            mb="500"
          >
            <TranslatableText>
              It can take 24 to 48 hours for the DNS records to propogate and verify the domain.
            </TranslatableText>
            <Banner.Actions>
              <ExternalLink to="/">Domains Documentation</ExternalLink>
            </Banner.Actions>
          </Banner>
        )}
        {resolvedStatus === 'blocked' && (
          <Banner status="danger" title="This domain has been blocked by SparkPost" mb="500">
            <StyledBox>
              If your domain’s status is “Blocked”, it’s generally because your domain is already in
              use by another SparkPost account, your domain has been previously blocked for sending
              abusive traffic through our service or another provider, or because one or more of our
              requirements are not met.
            </StyledBox>
            <Banner.Actions>
              <SupportTicketLink as={Button}>Create Support ticket</SupportTicketLink>
              <ExternalLink to={EXTERNAL_LINKS.BLOCKED_DOMAIN_DOCUMENTATION}>
                Domains Documentation
              </ExternalLink>
            </Banner.Actions>
          </Banner>
        )}

        <Domains.DomainStatusSection domain={domain} id={match.params.id} isTracking={isTracking} />

        <Domains.SetupForSending
          domain={domain}
          isSectionVisible={
            resolvedStatus !== 'blocked' && !isTracking && !displaySendingAndBounceSection
          }
        />
        <Domains.SetupBounceDomainSection
          domain={domain}
          isSectionVisible={
            resolvedStatus !== 'blocked' && !isTracking && !displaySendingAndBounceSection
          }
        />
        <Domains.SendingAndBounceDomainSection
          domain={domain}
          isSectionVisible={
            resolvedStatus !== 'blocked' && !isTracking && displaySendingAndBounceSection
          }
        />

        <Domains.LinkTrackingDomainSection
          domain={domain}
          isSectionVisible={
            resolvedStatus !== 'blocked' && !isTracking && resolvedStatus !== 'unverified'
          }
        />

        <Domains.VerifyEmailSection
          domain={domain}
          isSectionVisible={resolvedStatus === 'unverified' && !isTracking}
        />

        <Domains.TrackingDnsSection id={match.params.id} isSectionVisible={isTracking} />

        <Domains.DeleteDomainSection
          domain={domain}
          history={history}
          id={match.params.id}
          isTracking={isTracking}
        />
      </Page>
    </Domains.Container>
  );
}

export default connect(
  state => ({
    domain: selectDomain(state),
    trackingDomainList: selectTrackingDomainsList(state),
    sendingDomainsPending: state.sendingDomains.getLoading,
    trackingDomainListPending: state.trackingDomains.listLoading,
    trackingDomainList: selectTrackingDomainsList(state),
    sendingDomainsGetError: state.sendingDomains.getError,
  }),
  { getDomain, listTrackingDomains },
)(DetailsPage);
