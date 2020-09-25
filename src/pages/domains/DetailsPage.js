import React, { useState, useEffect } from 'react';
import { Page, Layout, Banner, Button } from 'src/components/matchbox';
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
    getDomain,
    listTrackingDomains,
  } = props;
  const resolvedStatus = resolveStatus(domain.status);
  const [warningBanner, toggleBanner] = useState(true);
  const readyFor = resolveReadyFor(domain.status);
  const displaySendingAndBounceSection =
    resolvedStatus === 'verified' && readyFor.bounce && domain.status.spf_status === 'valid';
  const isTracking = Boolean(_.find(trackingDomainList, ['domain', match.params.id]));

  useEffect(() => {
    getDomain(match.params.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    listTrackingDomains();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              <ExternalLink to="https://www.sparkpost.com/docs/getting-started/requirements-for-sending-domains/#if-your-domain-is-blocked">
                Domains Documentation
              </ExternalLink>
            </Banner.Actions>
          </Banner>
        )}

        <Layout>
          <Domains.DomainStatusSection
            domain={domain}
            id={match.params.id}
            allowSubaccountDefault={allowSubaccountDefault}
            allowDefault={allowDefault}
            isTracking={isTracking}
          />
        </Layout>
        {resolvedStatus !== 'blocked' && !isTracking && (
          <>
            {!displaySendingAndBounceSection && (
              <Layout>
                <Domains.SetupForSending
                  domain={domain}
                  id={match.params.id}
                  resolvedStatus={resolvedStatus}
                />
              </Layout>
            )}
            {resolvedStatus !== 'unverified' && (
              <>
                {!displaySendingAndBounceSection && (
                  <Layout>
                    <Domains.SetupBounceDomainSection {...props} resolvedStatus={resolvedStatus} />
                  </Layout>
                )}
                {displaySendingAndBounceSection && (
                  <Layout>
                    <Domains.SendingAndBounceDomainSection
                      {...props}
                      resolvedStatus={resolvedStatus}
                    />
                  </Layout>
                )}

                <Layout>
                  <Domains.LinkTrackingDomainSection {...props} resolvedStatus={resolvedStatus} />
                </Layout>
              </>
            )}
          </>
        )}
        {resolvedStatus === 'unverified' && !isTracking && (
          <Layout>
            <Domains.VerifyEmailSection {...props} />
          </Layout>
        )}
        {isTracking && (
          <Layout>
            <Domains.TrackingDnsSection {...props} id={match.params.id} />
          </Layout>
        )}
        <Layout>
          <Domains.DeleteDomainSection
            {...props}
            id={match.params.id}
            resolvedStatus={resolvedStatus}
            isTracking={isTracking}
          />
        </Layout>
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
