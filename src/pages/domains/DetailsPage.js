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
import { selectTrackingDomainsOptions } from 'src/selectors/trackingDomains';
import { selectCondition } from 'src/selectors/accessConditionState';
import { hasAccountOptionEnabled } from 'src/helpers/conditions/account';
import { selectHasAnyoneAtDomainVerificationEnabled } from 'src/selectors/account';
import { Loading } from 'src/components/loading/Loading';

function DetailsPage(props) {
  const resolvedStatus = resolveStatus(props.domain.status);
  const [warningBanner, toggleBanner] = useState(true);
  const readyFor = resolveReadyFor(props.domain.status);
  const displaySendingAndBounceSection =
    resolvedStatus === 'verified' && readyFor.bounce && props.domain.status.spf_status === 'valid';

  useEffect(() => {
    props.getDomain(props.match.params.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (props.sendingDomainsPending) {
    return <Loading />;
  }

  return (
    <Domains.Container>
      <Page
        title="Domain Details"
        breadcrumbAction={{
          content: 'All Domains',
          onClick: () => props.history.push('/domains/list/sending'),
        }}
      >
        {resolvedStatus === 'unverified' && warningBanner && (
          <Banner
            status="warning"
            title="Unverified domains will be removed two weeks after being added."
            onDismiss={() => {
              toggleBanner(false);
            }}
            mb="500"
          >
            It can take 24 to 48 hours for the DNS records to propogate and verify the domain.
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
            domain={props.domain}
            id={props.match.params.id}
            allowDefault
            allowSubaccountDefault
          />
        </Layout>
        {resolvedStatus !== 'blocked' && (
          <>
            {!displaySendingAndBounceSection && (
              <Layout>
                <Domains.SetupForSending
                  domain={props.domain}
                  id={props.match.params.id}
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
        {resolvedStatus === 'unverified' && (
          <Layout>
            <Domains.VerifyEmailSection {...props} />
          </Layout>
        )}
        <Layout>
          <Domains.DeleteDomainSection {...props} resolvedStatus={resolvedStatus} />
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
    isByoipAccount: selectCondition(hasAccountOptionEnabled('byoip_customer'))(state),
    hasAnyoneAtEnabled: selectHasAnyoneAtDomainVerificationEnabled(state),
    sendingDomainsPending: state.sendingDomains.getLoading,
  }),
  { getDomain },
)(DetailsPage);
