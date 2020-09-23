import React, { useEffect } from 'react';
import { Page, Layout, Banner } from 'src/components/matchbox';
import { get as getDomain } from 'src/actions/sendingDomains';
import Domains from './components';
import { connect } from 'react-redux';
import {
  selectAllowDefaultBounceDomains,
  selectAllSubaccountDefaultBounceDomains,
} from 'src/selectors/account';
import { selectDomain } from 'src/selectors/sendingDomains';
import { resolveStatus } from 'src/helpers/domains';
import { ExternalLink } from 'src/components/links';

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

        <Layout>
          <Domains.DomainStatusSection
            domain={props.domain}
            id={props.match.params.id}
            allowDefault
            allowSubaccountDefault
          />
        </Layout>
        <Layout>
          <Domains.SetupForSending domain={props.domain} id={props.match.params.id} />
        </Layout>
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
  }),
  { getDomain },
)(DetailsPage);
