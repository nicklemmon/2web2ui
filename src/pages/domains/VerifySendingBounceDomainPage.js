import React, { useEffect } from 'react';
import { Page } from 'src/components/matchbox';
import Domains from './components';
import { get as getDomain } from 'src/actions/sendingDomains';
import { connect } from 'react-redux';
import { selectDomain } from 'src/selectors/sendingDomains';

function VerifySendingBounceDomainPage(props) {
  const { match, getDomain, domain } = props;

  useEffect(() => {
    getDomain(match.params.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Domains.Container>
      <Page title="Verify Sending/Bounce Domain" subtitle={domain.id}>
        <Domains.SendingAndBounceDomainSection domain={domain} isSectionVisible={true} />
      </Page>
    </Domains.Container>
  );
}

export default connect(
  state => ({
    domain: selectDomain(state),
  }),
  { getDomain },
)(VerifySendingBounceDomainPage);
