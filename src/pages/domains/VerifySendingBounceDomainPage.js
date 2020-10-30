import React, { useEffect } from 'react';
import { Page } from 'src/components/matchbox';
import Domains from './components';
import { get as getDomain } from 'src/actions/sendingDomains';
import { connect } from 'react-redux';
import RedirectAndAlert from 'src/components/globalAlert/RedirectAndAlert';
import { Loading } from 'src/components';
import { selectDomain } from 'src/selectors/sendingDomains';

function VerifySendingBounceDomainPage(props) {
  const { match, getDomain, domain, error, sendingDomainsPending } = props;

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
        title="Verify Sending/Bounce Domain"
        subtitle={domain.id}
        breadcrumbAction={{
          content: 'Add Domain',
          onClick: () => props.history.push('/domains/create'),
        }}
      >
        <Domains.SendingAndBounceDomainSection domain={domain} isSectionVisible={true} />
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
)(VerifySendingBounceDomainPage);
