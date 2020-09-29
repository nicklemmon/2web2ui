import React, { useEffect } from 'react';
import { Page } from 'src/components/matchbox';
import { get as getDomain } from 'src/actions/sendingDomains';
import Domains from './components';
import { connect } from 'react-redux';
import { selectDomain } from 'src/selectors/sendingDomains';
import { selectCondition } from 'src/selectors/accessConditionState';
import { hasAccountOptionEnabled } from 'src/helpers/conditions/account';
import { selectHasAnyoneAtDomainVerificationEnabled } from 'src/selectors/account';
import _ from 'lodash';

function VerifyBounceDomainPage(props) {
  const { isByoipAccount, domain, match, getDomain } = props;
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
          isByoipAccount={isByoipAccount}
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
    hasAnyoneAtEnabled: selectHasAnyoneAtDomainVerificationEnabled(state),
    isByoipAccount: selectCondition(hasAccountOptionEnabled('byoip_customer'))(state),
  }),
  { getDomain },
)(VerifyBounceDomainPage);
