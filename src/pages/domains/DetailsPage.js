import React, { useState, useEffect } from 'react';
import { Page, Banner, Button } from 'src/components/matchbox';
import { get as getDomain } from 'src/actions/sendingDomains';
import Domains from './components';
import { connect } from 'react-redux';
import {
  selectAllowDefaultBounceDomains,
  selectAllSubaccountDefaultBounceDomains,
} from 'src/selectors/account';
import { selectDomain } from 'src/selectors/sendingDomains';
import { resolveReadyFor, resolveStatus } from 'src/helpers/domains';
import { ExternalLink, SupportTicketLink } from 'src/components/links';
import {
  selectTrackingDomainsOptions,
  selectTrackingDomainsList,
} from 'src/selectors/trackingDomains';
import { selectCondition } from 'src/selectors/accessConditionState';
import { hasAccountOptionEnabled } from 'src/helpers/conditions/account';
import { selectHasAnyoneAtDomainVerificationEnabled } from 'src/selectors/account';
import { Loading } from 'src/components/loading/Loading';
import { listTrackingDomains } from 'src/actions/trackingDomains';
import _ from 'lodash';
import { TranslatableText } from 'src/components/text';
import { EXTERNAL_LINKS } from './constants';

function DetailsPage(props) {
  const {
    trackingDomainList,
    match,
    history,
    sendingDomainsPending,
    trackingDomainListPending,
    allowSubaccountDefault,
    allowDefault,
    domain,
    isByoipAccount,
    trackingDomains,
    hasAnyoneAtEnabled,
    getDomain,
    listTrackingDomains,
  } = props;
  const resolvedStatus = resolveStatus(domain.status);
  const [warningBanner, toggleBanner] = useState(true);
  const readyFor = resolveReadyFor(domain.status);
  const displaySendingAndBounceSection =
    resolvedStatus === 'verified' && readyFor.bounce && domain.status.spf_status === 'valid';
  const isTracking = Boolean(_.find(trackingDomainList, ['domain', match.params.id.toLowerCase()]));

  useEffect(() => {
    getDomain(match.params.id);
  }, [getDomain, match.params.id]);
  useEffect(() => {
    listTrackingDomains();
  }, [listTrackingDomains]);

  if (sendingDomainsPending || trackingDomainListPending) {
    return <Loading />;
  }

  return (
    <Domains.Container>
      <Page
        title="Domain Details"
        breadcrumbAction={{
          content: 'All Domains',
          onClick: () =>
            isTracking
              ? history.push('/domains/list/tracking')
              : history.push('/domains/list/sending'),
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
            ??
            <Banner.Actions>
              <SupportTicketLink as={Button}>Create Support ticket</SupportTicketLink>
              <ExternalLink to={EXTERNAL_LINKS.BLOCKED_DOMAIN_DOCUMENTATION}>
                Domains Documentation
              </ExternalLink>
            </Banner.Actions>
          </Banner>
        )}

        <Domains.DomainStatusSection
          domain={domain}
          id={match.params.id}
          allowSubaccountDefault={allowSubaccountDefault}
          allowDefault={allowDefault}
          isTracking={isTracking}
        />

        <Domains.SetupForSending
          domain={domain}
          id={match.params.id}
          resolvedStatus={resolvedStatus}
          isSectionVisible={
            resolvedStatus !== 'blocked' && !isTracking && !displaySendingAndBounceSection
          }
        />
        <Domains.SetupBounceDomainSection
          domain={domain}
          isByoipAccount={isByoipAccount}
          isSectionVisible={
            resolvedStatus !== 'blocked' && !isTracking && !displaySendingAndBounceSection
          }
        />
        <Domains.SendingAndBounceDomainSection
          domain={domain}
          isByoipAccount={isByoipAccount}
          isSectionVisible={
            resolvedStatus !== 'blocked' && !isTracking && displaySendingAndBounceSection
          }
        />

        <Domains.LinkTrackingDomainSection
          domain={domain}
          trackingDomains={trackingDomains}
          isSectionVisible={
            resolvedStatus !== 'blocked' && !isTracking && resolvedStatus !== 'unverified'
          }
        />

        <Domains.VerifyEmailSection
          domain={domain}
          hasAnyoneAtEnabled={hasAnyoneAtEnabled}
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
    allowDefault: selectAllowDefaultBounceDomains(state),
    allowSubaccountDefault: selectAllSubaccountDefaultBounceDomains(state),
    trackingDomains: selectTrackingDomainsOptions(state),
    trackingDomainList: selectTrackingDomainsList(state),
    isByoipAccount: selectCondition(hasAccountOptionEnabled('byoip_customer'))(state),
    hasAnyoneAtEnabled: selectHasAnyoneAtDomainVerificationEnabled(state),
    sendingDomainsPending: state.sendingDomains.getLoading,
    trackingDomainListPending: state.trackingDomains.listLoading,
  }),
  { getDomain, listTrackingDomains },
)(DetailsPage);
