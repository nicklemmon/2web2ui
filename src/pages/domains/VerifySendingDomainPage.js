import React, { useEffect } from 'react';
import { Page } from 'src/components/matchbox';
import { connect } from 'react-redux';
import { get as getDomain } from 'src/actions/sendingDomains';
import { selectDomain } from 'src/selectors/sendingDomains';
import { resolveStatus } from 'src/helpers/domains';
import Domains from './components';
import RedirectAndAlert from 'src/components/globalAlert/RedirectAndAlert';
import { Loading } from 'src/components';

function VerifySendingDomainsPage(props) {
  const { match, getDomain, domain, error, sendingDomainsPending } = props;
  const resolvedStatus = resolveStatus(domain.status);

  useEffect(() => {
    getDomain(match.params.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <RedirectAndAlert to="/domains/list/" alert={{ type: 'error', message: error.message }} />
    );
  }

  if (sendingDomainsPending) {
    return <Loading />;
  }

  return (
    <Domains.Container>
      <Page
        title="Verify Sending Domain"
        breadcrumbAction={{
          content: 'Add Domain',
          onClick: () => props.history.push('/domains/create'),
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
    error: state.sendingDomains.getError,
  }),
  { getDomain },
)(VerifySendingDomainsPage);
