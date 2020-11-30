import React, { useState, useEffect } from 'react';
import { Page, Banner, Button, Box } from 'src/components/matchbox';
import { useRouteMatch } from 'react-router-dom';
import { connect } from 'react-redux';
import { get as getDomain, clearSendingDomain } from 'src/actions/sendingDomains';
import { list as listSubaccounts } from 'src/actions/subaccounts';
import { listTrackingDomains } from 'src/actions/trackingDomains';
import { selectDomain } from 'src/selectors/sendingDomains';
import { selectTrackingDomainsListHibana } from 'src/selectors/trackingDomains';
import { selectTrackingDomainCname } from 'src/selectors/account';
import { hasSubaccounts } from 'src/selectors/subaccounts';
import { resolveReadyFor, resolveStatus } from 'src/helpers/domains';
import { ExternalLink, SupportTicketLink } from 'src/components/links';
import { Bold, TranslatableText } from 'src/components/text';
import RedirectAndAlert from 'src/components/globalAlert/RedirectAndAlert';
import { Loading } from 'src/components/loading/Loading';
import _ from 'lodash';
import styled from 'styled-components';
import Domains from './components';
import { DETAILS_BASE_URL, EXTERNAL_LINKS } from './constants';

const StyledBox = styled(Box)`
  max-width: 600px;
`;
function DetailsPage(props) {
  const {
    match,
    history,
    sendingDomainsPending,
    trackingDomainListPending,
    sendingOrBounceDomain,
    getDomain,
    listTrackingDomains,
    clearSendingDomain,
    trackingDomainList,
    sendingDomainsGetError,
    listSubaccounts,
    hasSubaccounts,
    subaccounts,
    trackingDomainCname,
    trackingDomainListError,
  } = props;
  const [isTracking] = useState(useRouteMatch(`${DETAILS_BASE_URL}/tracking`));
  const [warningBanner, toggleBanner] = useState(true);
  const [trackingDomainNotFound, settrackingDomainNotFound] = useState(false);
  let domain = isTracking
    ? _.find(trackingDomainList, ['domain', match.params.id.toLowerCase()])
    : sendingOrBounceDomain;

  const handleAllDomains = () => {
    if (isTracking) return history.push('/domains/list/tracking');

    if (readyFor.bounce) return history.push('/domains/list/bounce');

    return history.push('/domains/list/sending');
  };

  useEffect(() => {
    if (!isTracking) getDomain(match.params.id);
    return () => {
      //reset the domain
      clearSendingDomain();
    };
  }, [clearSendingDomain, getDomain, isTracking, match.params.id]);
  useEffect(() => {
    listTrackingDomains().then(res => {
      //this logic redirects to list page when the tracking domain is not found in the list
      if (isTracking && !Boolean(_.find(res, ['domain', match.params.id.toLowerCase()]))) {
        settrackingDomainNotFound(true);
      }
    });
  }, [history, isTracking, listTrackingDomains, match.params.id]);

  useEffect(() => {
    if (hasSubaccounts && subaccounts?.length === 0) {
      listSubaccounts();
    }
  }, [hasSubaccounts, listSubaccounts, subaccounts]);

  if (!isTracking && sendingDomainsGetError) {
    return (
      <RedirectAndAlert
        to="/domains/list/sending"
        alert={{ type: 'error', message: sendingDomainsGetError.message }}
      />
    );
  }

  if (isTracking && (trackingDomainListError || trackingDomainNotFound)) {
    return (
      <RedirectAndAlert
        to="/domains/list/tracking"
        alert={{ type: 'error', message: 'Resource could not be found' }}
      />
    );
  }

  if (sendingDomainsPending || trackingDomainListPending) {
    return <Loading />;
  }
  if (!domain) {
    return null;
  }

  const resolvedStatus = isTracking ? domain.status : resolveStatus(domain.status);
  const readyFor = isTracking ? {} : resolveReadyFor(domain.status);
  const displaySendingAndBounceSection = readyFor.dkim && readyFor.bounce;

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
              <ExternalLink to={EXTERNAL_LINKS.VERIFY_SENDING_DOMAIN_OWNERSHIP}>
                Domains Documentation
              </ExternalLink>
            </Banner.Actions>
          </Banner>
        )}
        {resolvedStatus === 'unverified' && warningBanner && isTracking && (
          <Banner
            status="warning"
            title="Unverified domains will be removed two weeks after being added."
            onDismiss={() => {
              toggleBanner(false);
            }}
            mb="500"
          >
            <TranslatableText>
              To verify a tracking domain, edit its DNS settings to <Bold>add a CNAME record</Bold>{' '}
              with the value of <strong>{trackingDomainCname}</strong>.
            </TranslatableText>
            <Banner.Actions>
              <ExternalLink to={EXTERNAL_LINKS.TRACKING_DOMAIN_DOCUMENTATION}>
                Domains Documentation
              </ExternalLink>
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

        <Domains.TrackingDnsSection domain={domain} isSectionVisible={isTracking} />

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
    trackingDomainList: selectTrackingDomainsListHibana(state),
    trackingDomainCname: selectTrackingDomainCname(state),
    trackingDomainListError: state.trackingDomains.error,
    sendingDomainsPending: state.sendingDomains.getLoading,
    trackingDomainListPending: state.trackingDomains.listLoading,
    hasSubaccounts: hasSubaccounts(state),
    sendingDomainsGetError: state.sendingDomains.getError,
    sendingOrBounceDomain: selectDomain(state),
    subaccounts: state.subaccounts.list,
  }),
  { getDomain, listTrackingDomains, listSubaccounts, clearSendingDomain },
)(DetailsPage);
