import React, { useEffect } from 'react';
import { Page, Layout } from 'src/components/matchbox';
import { get as getDomain } from 'src/actions/sendingDomains';
import Domains from './components';
import { connect } from 'react-redux';
import {
  selectAllowDefaultBounceDomains,
  selectAllSubaccountDefaultBounceDomains,
} from 'src/selectors/account';
import { selectDomain } from 'src/selectors/sendingDomains';

function DetailsPage(props) {
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
