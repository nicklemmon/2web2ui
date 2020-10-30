import React, { useState, useEffect } from 'react';
import { Page } from 'src/components/matchbox';
import Domains from './components';
import { connect } from 'react-redux';
import { listTrackingDomains } from 'src/actions/trackingDomains';
import { selectTrackingDomainsListHibana } from 'src/selectors/trackingDomains';
import RedirectAndAlert from 'src/components/globalAlert/RedirectAndAlert';
import { Loading } from 'src/components';
import _ from 'lodash';

function VerifyTrackingDomainPage(props) {
  const { match, listTrackingDomains, error, trackingDomainsPending, trackingDomainList } = props;
  const domain = _.find(trackingDomainList, ['domain', match.params.id.toLowerCase()]);
  const [trackingDomainNotFound, settrackingDomainNotFound] = useState(false);

  useEffect(() => {
    listTrackingDomains();
  }, [listTrackingDomains]);

  useEffect(() => {
    listTrackingDomains().then(res => {
      if (!Boolean(_.find(res, ['domain', match.params.id.toLowerCase()]))) {
        settrackingDomainNotFound(true);
      }
    });
  }, [listTrackingDomains, match.params.id]);

  if (error || trackingDomainNotFound) {
    return (
      <RedirectAndAlert
        to="/domains/list"
        alert={{ type: 'error', message: `Domain ${match.params.id.toLowerCase()} not found` }}
      />
    );
  }
  if (trackingDomainsPending) {
    return <Loading />;
  }
  if (!domain) {
    return null;
  }
  return (
    <Domains.Container>
      <Page
        title="Verify Tracking Domain"
        breadcrumbAction={{
          content: 'Add Domain',
          onClick: () => props.history.push('/domains/create'),
        }}
        subtitle={match.params.id}
      >
        <Domains.TrackingDnsSection
          domain={domain}
          isSectionVisible={true}
          title="DNS Verification"
        />
      </Page>
    </Domains.Container>
  );
}

export default connect(
  state => ({
    trackingDomainsPending: state.trackingDomains.listLoading,
    error: state.trackingDomains.error,
    trackingDomainList: selectTrackingDomainsListHibana(state),
  }),
  { listTrackingDomains },
)(VerifyTrackingDomainPage);
