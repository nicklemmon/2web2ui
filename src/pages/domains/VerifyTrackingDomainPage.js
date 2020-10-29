import React, { useEffect } from 'react';
import { Page } from 'src/components/matchbox';
import Domains from './components';
import { connect } from 'react-redux';
import { listTrackingDomains } from 'src/actions/trackingDomains';
import _ from 'lodash';

function VerifyTrackingDomainPage(props) {
  const { match, listTrackingDomains } = props;
  useEffect(() => {
    listTrackingDomains();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Domains.Container>
      <Page
        title="Verify Tracking Domain"
        breadcrumbAction={{
          content: 'Domains',
          onClick: () => props.history.push('/domains/list/tracking'),
        }}
        subtitle={match.params.id}
      >
        <Domains.TrackingDnsSection
          id={match.params.id}
          isSectionVisible={true}
          title="DNS Verification"
        />
      </Page>
    </Domains.Container>
  );
}

export default connect(null, { listTrackingDomains })(VerifyTrackingDomainPage);
