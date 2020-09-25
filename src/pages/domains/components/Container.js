import React from 'react';
import { connect } from 'react-redux';
import {
  get as getDomain,
  list as listSendingDomains,
  update as updateSendingDomain,
  create as createSendingDomain,
  remove as deleteDomain,
  verifyDkim,
  verify,
  verifyMailbox,
  verifyAbuse,
  verifyPostmaster,
} from 'src/actions/sendingDomains';
import { list as listSubaccounts } from 'src/actions/subaccounts';
import { showAlert } from 'src/actions/globalAlert';
import {
  createTrackingDomain,
  listTrackingDomains,
  updateTrackingDomain,
  deleteTrackingDomain,
  verifyTrackingDomain,
} from 'src/actions/trackingDomains';
import { selectSendingDomainsRows, selectBounceDomainsRows } from 'src/selectors/sendingDomains';
import { selectTrackingDomainsRows } from 'src/selectors/trackingDomains';
import { hasSubaccounts } from 'src/selectors/subaccounts';
import { DomainsProvider } from '../context/DomainsContext';

function mapStateToProps(state) {
  return {
    sendingDomains: selectSendingDomainsRows(state),
    sendingDomainsListError: state.sendingDomains.listError,
    bounceDomains: selectBounceDomainsRows(state),
    listPending:
      state.sendingDomains.listLoading ||
      state.trackingDomains.listLoading ||
      state.subaccounts.listLoading,
    createPending: state.sendingDomains.createLoading || state.trackingDomains.createLoading,
    hasSubaccounts: hasSubaccounts(state),
    subaccounts: state.subaccounts.list,
    trackingDomains: selectTrackingDomainsRows(state),
    trackingDomainsListError: state.trackingDomains.error,
  };
}

const mapDispatchToProps = {
  createSendingDomain,
  createTrackingDomain,
  getDomain,
  listSendingDomains,
  updateSendingDomain,
  listSubaccounts,
  listTrackingDomains,
  verify,
  verifyDkim,
  verifyMailbox,
  verifyAbuse,
  verifyPostmaster,
  showAlert,
  deleteDomain,
  updateTrackingDomain,
  deleteTrackingDomain,
  verifyTrackingDomain,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(({ children, ...props }) => {
  return <DomainsProvider value={props}>{children}</DomainsProvider>;
});
