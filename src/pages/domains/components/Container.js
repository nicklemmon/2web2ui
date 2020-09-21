import React from 'react';
import { connect } from 'react-redux';
import {
  list as listSendingDomains,
  update as updateSendingDomain,
  remove as deleteDomain,
  verifyDkim,
} from 'src/actions/sendingDomains';
import { list as listSubaccounts } from 'src/actions/subaccounts';
import { listTrackingDomains } from 'src/actions/trackingDomains';
import {
  selectDomains as selectSendingDomains,
  selectReadyForBounce,
} from 'src/selectors/sendingDomains';
import { selectTrackingDomainsList } from 'src/selectors/trackingDomains';
import { hasSubaccounts } from 'src/selectors/subaccounts';
import { DomainsProvider } from '../context/DomainsContext';
import { showAlert } from 'src/actions/globalAlert';

function mapStateToProps(state) {
  return {
    sendingDomains: selectSendingDomains(state),
    sendingDomainsListError: state.sendingDomains.listError,
    bounceDomains: selectReadyForBounce(state),
    pending: state.sendingDomains.listLoading || state.trackingDomains.listLoading,
    hasSubaccounts: hasSubaccounts(state),
    subaccounts: state.subaccounts.list,
    trackingDomains: selectTrackingDomainsList(state),
    trackingDomainsListError: state.trackingDomains.error,
  };
}

const mapDispatchToProps = {
  listSendingDomains,
  updateSendingDomain,
  listSubaccounts,
  listTrackingDomains,
  verifyDkim,
  showAlert,
  deleteDomain,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(({ children, ...props }) => {
  return <DomainsProvider value={props}>{children}</DomainsProvider>;
});
