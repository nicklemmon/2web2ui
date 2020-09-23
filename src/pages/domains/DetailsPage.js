import React, { useEffect } from 'react';
import { Page, Layout, Banner, Button } from 'src/components/matchbox';
import { get as getDomain } from 'src/actions/sendingDomains';
import Domains from './components';
import { connect } from 'react-redux';
import {
  selectAllowDefaultBounceDomains,
  selectAllSubaccountDefaultBounceDomains,
} from 'src/selectors/account';
import { selectDomain } from 'src/selectors/sendingDomains';
import { resolveStatus } from 'src/helpers/domains';
import { ExternalLink, SupportTicketLink } from 'src/components/links';
import { selectTrackingDomainsOptions } from 'src/selectors/trackingDomains';
import { selectCondition } from 'src/selectors/accessConditionState';
import { hasAccountOptionEnabled } from 'src/helpers/conditions/account';

function DetailsPage(props) {
  const resolvedStatus = resolveStatus(props.domain.status);
  useEffect(() => {
    props.getDomain(props.match.params.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Domains.Container>
      <Page
        title="Domain Details"
        breadcrumbAction={{
          content: 'All Domains',
          onClick: () => props.history.push('/domains/list/sending'),
        }}
      >
        {resolvedStatus === 'unverified' && (
          <Banner
            status="warning"
            title="Unverified domains will be removed two weeks after being added."
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
            It can take 24 to 48 hours for the DNS records to propogate and verify the domain.
            <Banner.Actions>
              <SupportTicketLink as={Button}>Create Support ticket</SupportTicketLink>
              <ExternalLink to="/">Domains Documentation</ExternalLink>
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
            <Layout>
              <Domains.SetupForSending domain={props.domain} id={props.match.params.id} />
            </Layout>
            <Layout>
              <Domains.SetupBounceDomainSection {...props} />
            </Layout>
            <Layout>
              <Domains.LinkTrackingDomainSection {...props} />
            </Layout>
          </>
        )}
        <Layout>
          <Domains.DeleteDomainSection {...props} />
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
  }),
  { getDomain },
)(DetailsPage);
