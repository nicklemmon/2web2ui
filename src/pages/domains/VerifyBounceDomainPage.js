import React, { useEffect } from 'react';
import { Page } from 'src/components/matchbox';
import { get as getDomain } from 'src/actions/sendingDomains';
import Domains from './components';
import { connect } from 'react-redux';
import { selectDomain } from 'src/selectors/sendingDomains';
import _ from 'lodash';

function VerifyBounceDomainPage(props) {
  const { domain, match, getDomain } = props;
  useEffect(() => {
    getDomain(match.params.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Domains.Container>
      <Page
        title="Verify Bounce Domain"
        breadcrumbAction={{
          content: 'Domains',
          onClick: () => props.history.push('/domains/list/bounce'),
        }}
        subtitle={domain.id}
      >
        <Domains.SetupBounceDomainSection
          title="DNS Verification"
          domain={domain}
          isSectionVisible={true}
        />
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
)(VerifyBounceDomainPage);
