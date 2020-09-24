import React from 'react';
import { connect } from 'react-redux';
import {
  create as createSendingDomain,
  list as listSendingDomains,
} from 'src/actions/sendingDomains';
import { list as listSubaccounts } from 'src/actions/subaccounts';
import { showAlert } from 'src/actions/globalAlert';
import { createTrackingDomain, listTrackingDomains } from 'src/actions/trackingDomains';
import {
  selectDomains as selectSendingDomains,
  selectReadyForBounce,
} from 'src/selectors/sendingDomains';
import { selectTrackingDomainsList } from 'src/selectors/trackingDomains';
import { hasSubaccounts } from 'src/selectors/subaccounts';
import { DomainsProvider } from '../context/DomainsContext';

function mapStateToProps(state) {
  return {
    sendingDomains: selectSendingDomains(state),
    sendingDomainsListError: state.sendingDomains.listError,
    bounceDomains: selectReadyForBounce(state),
    listPending: state.sendingDomains.listLoading || state.trackingDomains.listLoading,
    createPending: state.sendingDomains.createLoading || state.trackingDomains.createLoading,
    hasSubaccounts: hasSubaccounts(state),
    subaccounts: state.subaccounts.list,
    trackingDomains: selectTrackingDomainsList(state),
    trackingDomainsListError: state.trackingDomains.error,
  };
}

const mapDispatchToProps = {
  createSendingDomain,
  createTrackingDomain,
  listSendingDomains,
  listSubaccounts,
  listTrackingDomains,
  showAlert,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(({ children, ...props }) => {
  return <DomainsProvider value={props}>{children}</DomainsProvider>;
});
