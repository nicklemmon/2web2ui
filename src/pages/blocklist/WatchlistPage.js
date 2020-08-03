import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ApiErrorBanner, Loading } from 'src/components';
import { PageLink } from 'src/components/links';
import { Page } from 'src/components/matchbox';
import { PageDescription } from 'src/components/text';
import { selectBlocklistedCount } from 'src/selectors/blocklist';
import { listMonitors } from 'src/actions/blocklist';
import MonitorsCollection from './components/MonitorsCollection';
import RemoveFromWatchlistModal from './components/RemoveFromWatchlistModal';
import CongratsBanner from './components/CongratsBanner';

export const WatchlistPage = props => {
  const { loading, listMonitors, monitors, hasBlocklisted, error } = props;

  const [showCongrats, setShowCongrats] = useState(true);
  const [monitorToDelete, setMonitorToDelete] = useState(null);

  const closeModal = () => setMonitorToDelete(null);

  useEffect(() => {
    listMonitors();
  }, [listMonitors]);

  if (loading) {
    return <Loading />;
  }

  const renderContent = () => {
    if (error) {
      return (
        <div data-id="error-banner">
          <ApiErrorBanner
            message="Sorry, we seem to have had some trouble loading your watched IPs and domains."
            errorDetails={error.message}
            reload={() => {
              listMonitors();
            }}
          />
        </div>
      );
    }

    return (
      <>
        {showCongrats && !hasBlocklisted && (
          <CongratsBanner onDismiss={() => setShowCongrats(false)} />
        )}
        <div data-id="monitors-table">
          <MonitorsCollection monitors={monitors} handleDelete={setMonitorToDelete} />
        </div>
      </>
    );
  };

  return (
    <Page
      title="Watched IPs and Domains"
      primaryAction={{
        content: 'Add IP or Sending Domain',
        to: '/signals/blocklist/watchlist/add',
        component: PageLink,
      }}
      breadcrumbAction={{
        content: 'Blocklisting Incidents',
        to: '/signals/blocklist/incidents',
        component: PageLink,
      }}
    >
      <PageDescription>
        Below are your watched IP addresses and domains. Select any one below to learn more or make
        updates.
      </PageDescription>
      {renderContent()}
      <RemoveFromWatchlistModal monitorToDelete={monitorToDelete} closeModal={closeModal} />
    </Page>
  );
};

const mapStateToProps = state => ({
  hasBlocklisted: selectBlocklistedCount(state) > 0,
  monitors: state.blocklist.monitors,
  error: state.blocklist.monitorsError,
  loading: state.blocklist.monitorsPending,
});
export default connect(mapStateToProps, { listMonitors })(WatchlistPage);
