import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import qs from 'query-string';
import { Portal, Popover } from '@sparkpost/matchbox';
import { Cancel, Help } from '@sparkpost/matchbox-icons';
import { entitledToOnlineSupport } from 'src/selectors/support';
import * as supportActions from 'src/actions/support';
import SupportForm from './components/SupportForm';
import SearchPanel from './components/SearchPanel';
import { getBase64Contents } from 'src/helpers/file';
import styles from './Support.module.scss';

export class Support extends Component {
  componentDidMount () {
    this.maybeOpenTicket();
  }

  componentDidUpdate (prevProps) {
    const { location } = this.props;

    if (location.search && location.search !== prevProps.location.search) {
      this.maybeOpenTicket();
    }
  }

  // Opens and hydrates support ticket form from query params
  maybeOpenTicket = () => {
    const { location, openSupportPanel, hydrateTicketForm } = this.props;
    const { supportTicket, supportMessage: message, supportSubject: subject } = qs.parse(location.search);

    if (supportTicket) {
      openSupportPanel({ view: 'ticket' });
      hydrateTicketForm({ message, subject });
    }
  }

  onSubmit = async(values) => {
    const { createTicket } = this.props;
    const { message, subject, attachment } = values;
    let ticket = { message, subject };

    if (attachment) {
      const encoded = await getBase64Contents(attachment);
      ticket = { ...ticket, attachment: { filename: attachment.name, content: encoded }};
    }

    return createTicket(ticket);
  };

  togglePanel = () => {
    const { showPanel, showTicketForm, toggleSupportPanel, toggleTicketForm } = this.props;

    // handling reseting doc search when closed
    if (!showPanel && showTicketForm) {
      toggleTicketForm();
    }
    toggleSupportPanel();
  }

  toggleForm = () => {
    this.props.toggleTicketForm();
  }

  renderPanel () {
    const { showTicketForm } = this.props;

    return showTicketForm
      ? <SupportForm
        onSubmit={this.onSubmit}
        onCancel={this.toggleForm}
        onContinue={this.toggleForm} />
      : <SearchPanel toggleForm={this.toggleForm} />;
  }

  render() {
    const { loggedIn, entitledToOnlineSupport, showPanel } = this.props;

    if (!loggedIn || !entitledToOnlineSupport) {
      return null;
    }

    const Icon = showPanel ? Cancel : Help;

    const triggerMarkup = (
      <a className={styles.Button} onClick={this.togglePanel}>
        <Icon className={styles.Icon} size={33} />
      </a>
    );

    return (
      <Portal containerId='support-portal'>
        <div className={styles.Support}>
          <Popover
            top
            left
            fixed
            className={styles.Popover}
            open={showPanel}
            trigger={triggerMarkup}>

            {this.renderPanel()}

          </Popover>
        </div>
      </Portal>
    );
  }
}

const mapStateToProps = (state) => ({
  loggedIn: state.auth.loggedIn,
  entitledToOnlineSupport: entitledToOnlineSupport(state),
  showPanel: state.support.showPanel,
  showTicketForm: state.support.showTicketForm
});

export default withRouter(connect(mapStateToProps, supportActions)(Support));
