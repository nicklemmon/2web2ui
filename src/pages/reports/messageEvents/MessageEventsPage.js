/* eslint-disable max-lines */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { snakeToFriendly } from 'src/helpers/string';
import { Box, Button, Page, Panel, ScreenReaderOnly } from 'src/components/matchbox';
import {
  PanelLoading,
  TableCollection,
  CursorPaging,
  PerPageButtons,
  ApiErrorBanner,
  Empty,
} from 'src/components';
import DisplayDate from 'src/components/displayDate/DisplayDate';
import MessageEventsSearch from './components/MessageEventsSearch';
import ViewDetailsButton from './components/ViewDetailsButton';
import {
  getMessageEvents,
  changePage,
  getMessageEventsCSV,
  clearCSV,
} from 'src/actions/messageEvents';
import { selectMessageEvents, selectMessageEventsCSV } from 'src/selectors/messageEvents';
import { formatToCsv, download } from 'src/helpers/downloading';
import { DEFAULT_PER_PAGE_BUTTONS } from 'src/constants';
import OGStyles from './MessageEventsPage.module.scss';
import hibanaStyles from './MessageEventsPage.module.scss';
import { useHibana } from 'src/context/HibanaContext';
import useHibanaOverride from 'src/hooks/useHibanaOverride';
import _ from 'lodash';

const errorMsg = 'Sorry, we seem to have had some trouble loading your message events.';
const emptyMessage = 'There are no message events for your current query';

const columns = [
  { label: 'Event' },
  { label: 'Subject' },
  { label: 'Recipient' },
  { label: 'From Address' },
  { label: 'Time' },
  { label: <ScreenReaderOnly>Actions</ScreenReaderOnly> },
];

export class MessageEventsPageComponent extends Component {
  state = {
    currentPage: 1,
    perPage: 25,
  };

  componentDidUpdate(prevProps) {
    const { search, getMessageEvents, eventsCSV } = this.props;
    const { perPage } = this.state;
    //Refresh the page & load new data if the search filters have changed
    if (!_.isEqual(prevProps.search, search)) {
      this.setState({ currentPage: 1 });
      getMessageEvents({ perPage, ...search });
    }
    if (!prevProps.eventsCSV.length && eventsCSV.length) {
      this.downloadCSV();
    }
  }

  downloadCSV = () => {
    const { eventsCSV, clearCSV } = this.props;
    const url = formatToCsv({ data: eventsCSV, returnBlob: true });
    const now = Math.floor(Date.now() / 1000);
    download({ name: `sparkpost-csv-${now}.csv`, url });
    clearCSV();
  };

  handlePageChange = currentPage => {
    this.setState({ currentPage });
    const { changePage } = this.props;
    return changePage(currentPage);
  };

  handlePerPageChange = perPage => {
    const { search, getMessageEvents } = this.props;
    this.setState({ perPage, currentPage: 1 });
    getMessageEvents({ perPage, ...search });
  };

  //Reload the first page w/ api call, NOT from cache
  handleFirstPage = () => {
    const { search, getMessageEvents } = this.props;
    const { perPage } = this.state;
    this.setState({ currentPage: 1 });
    getMessageEvents({ perPage, ...search });
  };

  isPreviousDisabled = () => {
    const { currentPage } = this.state;
    return currentPage <= 1;
  };

  isNextDisabled = () => {
    const { hasMorePagesAvailable } = this.props;
    return !hasMorePagesAvailable;
  };

  getCSV = () => {
    const { search, getMessageEventsCSV } = this.props;
    getMessageEventsCSV(search);
  };

  getRowData = rowData => {
    const { styles } = this.props;
    const { timestamp, formattedDate, type, friendly_from, rcpt_to, subject } = rowData;
    return [
      <div className={styles.WordWrap}>{snakeToFriendly(type)}</div>,
      <div className={styles.MessageSubject}>{subject}</div>,
      rcpt_to,
      friendly_from,
      <div className={styles.WordWrap}>
        <DisplayDate
          timestamp={timestamp}
          formattedDate={formattedDate}
          diffTime={59}
          diffScale="seconds"
        />
      </div>,
      <ViewDetailsButton {...rowData} />,
    ];
  };

  renderError() {
    const { error, getMessageEvents, search } = this.props;
    return (
      <ApiErrorBanner
        message={errorMsg}
        errorDetails={error.message}
        reload={() => getMessageEvents(search)}
      />
    );
  }

  renderCollection() {
    const {
      events,
      empty,
      loading,
      totalCount,
      styles,
      eventsCSVLoading,
      isHibanaEnabled,
    } = this.props;
    const { currentPage, perPage } = this.state;

    if (loading) {
      return <PanelLoading />;
    }
    const perPageProps = isHibanaEnabled ? {} : { className: styles.RightAlignedButtons };
    const saveCSVProps = isHibanaEnabled ? { variant: 'monochrome-secondary' } : {};
    const content = empty ? (
      <Panel.LEGACY>
        <Empty message={emptyMessage} />
      </Panel.LEGACY>
    ) : (
      <div>
        <TableCollection
          columns={columns}
          rows={events}
          getRowData={this.getRowData}
          defaultSortColumn="timestamp"
          defaultSortDirection="desc"
        />

        <Box display="flex" justifyContent="space-between">
          <Box>
            <CursorPaging
              currentPage={currentPage}
              handlePageChange={this.handlePageChange}
              previousDisabled={this.isPreviousDisabled()}
              nextDisabled={this.isNextDisabled()}
              handleFirstPage={this.handleFirstPage}
              perPage={perPage}
              totalCount={totalCount}
            />
          </Box>
          <div {...perPageProps}>
            <Box display="flex" alignItems="center">
              <PerPageButtons
                totalCount={totalCount}
                data={events}
                onPerPageChange={this.handlePerPageChange}
                perPageButtons={DEFAULT_PER_PAGE_BUTTONS}
                perPage={perPage}
                saveCsv={true}
              />
              <Button onClick={this.getCSV} disabled={eventsCSVLoading} {...saveCSVProps}>
                {eventsCSVLoading ? 'Saving CSV...' : 'Save as CSV'}
              </Button>
            </Box>
          </div>
        </Box>
      </div>
    );

    return content;
  }

  render() {
    const { error } = this.props;

    return (
      <Page title="Events Search">
        <MessageEventsSearch />
        {error ? this.renderError() : this.renderCollection()}
      </Page>
    );
  }
}

const MessageEventsPage = props => {
  const styles = useHibanaOverride(OGStyles, hibanaStyles);
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  return (
    <MessageEventsPageComponent {...props} styles={styles} isHibanaEnabled={isHibanaEnabled} />
  );
};

const mapStateToProps = state => {
  const events = selectMessageEvents(state);
  const eventsCSV = selectMessageEventsCSV(state);
  const { messageEvents } = state;
  const {
    loading,
    error,
    search,
    totalCount,
    hasMorePagesAvailable,
    eventsCSVLoading,
  } = messageEvents;
  return {
    events: events,
    loading,
    error,
    empty: events.length === 0,
    search,
    totalCount,
    hasMorePagesAvailable,
    eventsCSV,
    eventsCSVLoading,
  };
};

export default connect(mapStateToProps, {
  getMessageEvents,
  getMessageEventsCSV,
  changePage,
  clearCSV,
})(MessageEventsPage);
