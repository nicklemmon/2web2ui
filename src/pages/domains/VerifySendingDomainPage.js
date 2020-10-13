import React, { useEffect } from 'react';
import { Page } from 'src/components/matchbox';
import { connect } from 'react-redux';
import { get as getDomain } from 'src/actions/sendingDomains';
import { selectDomain } from 'src/selectors/sendingDomains';
import { resolveStatus } from 'src/helpers/domains';
import Domains from './components';

function VerifySendingDomainsPage(props) {
  const { match, getDomain, domain } = props;
  const resolvedStatus = resolveStatus(domain.status);

  useEffect(() => {
    getDomain(match.params.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Domains.Container>
      <Page
        title="Verify Sending Domain"
        breadcrumbAction={{
          content: 'Domains',
          onClick: () => props.history.push('/domains/list/sending'),
        }}
        subtitle={domain.id}
      >
        <Domains.SetupForSending
          domain={domain}
          resolvedStatus={resolvedStatus}
          isSectionVisible={true}
        />
        <Domains.VerifyEmailSection domain={domain} isSectionVisible={true} />
      </Page>
    </Domains.Container>
  );
}

export default connect(
  state => ({
    domain: selectDomain(state),
    sendingDomainsPending: state.sendingDomains.getLoading,
  }),
  { getDomain },
)(VerifySendingDomainsPage);
