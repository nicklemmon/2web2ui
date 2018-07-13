import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getMessageHistory, getDocumentation } from 'src/actions/messageEvents';
import RedirectAndAlert from 'src/components/globalAlert/RedirectAndAlert';
import { isMessageHistoryEmpty, selectMessageHistory, selectInitialEventId, getSelectedEventFromMessageHistory, getSelectedEventFromEventsList, getMessageIdParam } from 'src/selectors/messageEvents';
import { getPath } from 'src/helpers/messageEvents';
import { Page, Grid } from '@sparkpost/matchbox';
import { Loading } from 'src/components';
import HistoryTable from './components/HistoryTable';
import EventDetails from './components/EventDetails';

const breadcrumbAction = {
  content: 'All Message Events',
  Component: Link,
  to: '/reports/message-events'
};

export class EventPage extends Component {
  static defaultProps = {
    messageHistory: []
  }

  componentDidMount() {
    this.handleRefresh();
    this.props.getDocumentation();
  }

  handleRefresh = () => {
    const { messageId, getMessageHistory } = this.props;
    getMessageHistory({ messageId });
  }

  componentWillReceiveProps({ selectedEventId }) {
    const { messageId, match } = this.props;
    if (selectedEventId && messageId && !match.params.eventId) {
      this.props.history.replace(getPath(messageId, selectedEventId));
    }
  }

  handleEventClick = (selectedEventId) => {
    const { history, messageId } = this.props;
    history.push(getPath(messageId, selectedEventId));
  }

  render() {
    const { isMessageHistoryEmpty, isOrphanEvent, loading, messageId, messageHistory, documentation, selectedEventId, selectedEvent } = this.props;

    if ((!isOrphanEvent && isMessageHistoryEmpty) || (isOrphanEvent && !selectedEvent)) {
      const errorMessageInfo = isOrphanEvent ? `event_id # ${selectedEventId}` : `message_id # ${messageId}`;
      return (
        <RedirectAndAlert
          to="/reports/message-events"
          alert={{ type: 'warning', message: `Unable to find event(s) data with ${errorMessageInfo}` }}
        />
      );
    }

    const pageContent = loading
      ? <Loading />
      : (
        <Grid>
          <Grid.Column xs={12} md={isOrphanEvent ? 12 : 6}>
            <EventDetails details={selectedEvent} documentation={documentation}/>
          </Grid.Column>
          {!isOrphanEvent &&
            <Grid.Column xs={12} md={6}>
              <HistoryTable
                messageHistory={messageHistory}
                selectedId={selectedEventId}
                handleEventClick={this.handleEventClick}
                handleRefresh={this.handleRefresh}/>
            </Grid.Column>
          }
        </Grid>
      );


    const title = isOrphanEvent ? `Event: ${selectedEventId}` : `Message: ${messageId}`;

    return <Page title={title} breadcrumbAction={breadcrumbAction}>{pageContent}</Page>;
  }
}

const mapStateToProps = (state, props) => {
  const messageId = getMessageIdParam(state, props);
  const isOrphanEvent = messageId === '<empty>';

  const selectedEvent = isOrphanEvent ? getSelectedEventFromEventsList(state, props) : getSelectedEventFromMessageHistory(state, props);

  return {
    isMessageHistoryEmpty: isMessageHistoryEmpty(state, props),
    isOrphanEvent: messageId === '<empty>', //event without a message_id property
    loading: state.messageEvents.historyLoading || state.messageEvents.documentationLoading,
    messageHistory: selectMessageHistory(state, props),
    messageId,
    documentation: state.messageEvents.documentation,
    selectedEventId: selectInitialEventId(state, props),
    selectedEvent
  };
};

export default connect(mapStateToProps, { getMessageHistory, getDocumentation })(EventPage);
