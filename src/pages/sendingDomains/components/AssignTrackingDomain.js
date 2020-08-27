import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import { SubduedText } from 'src/components/text';
import { PageLink } from 'src/components/links';
import { Button, Panel } from 'src/components/matchbox';
import { showAlert } from 'src/actions/globalAlert';
import { SendingDomainSection } from './SendingDomainSection';
import { update as updateSendingDomain } from 'src/actions/sendingDomains';
import { listTrackingDomains } from 'src/actions/trackingDomains';
import { selectTrackingDomainsOptions } from 'src/selectors/trackingDomains';
import { PanelLoading } from 'src/components/loading';
import { SelectWrapper } from 'src/components/reduxFormWrappers';

export class AssignTrackingDomain extends Component {
  componentDidMount() {
    this.props.listTrackingDomains();
  }

  updateTrackingDomain = ({ trackingDomain: tracking_domain }) => {
    const {
      domain: { id, subaccount_id: subaccount },
      showAlert,
    } = this.props;
    return this.props
      .updateSendingDomain({ id, subaccount, tracking_domain })
      .then(() =>
        showAlert({
          type: 'success',
          message: 'Tracking domain assignment updated.',
        }),
      )
      .catch(err =>
        showAlert({
          type: 'error',
          message: 'Could not update tracking domain assignment.',
          details: err.message,
        }),
      );
  };

  renderTrackingDomains() {
    const { listLoading, trackingDomains, pristine, submitting } = this.props;

    if (listLoading) {
      return <PanelLoading />;
    }

    return (
      <Panel.LEGACY>
        <form onSubmit={this.props.handleSubmit(this.updateTrackingDomain)}>
          <Panel.LEGACY.Section>
            <Field
              component={SelectWrapper}
              name="trackingDomain"
              options={trackingDomains}
              disabled={submitting}
              label="Linked Tracking Domain"
              helpText="Domains must be verified to be linked to a sending domain."
            />
          </Panel.LEGACY.Section>
          <Panel.LEGACY.Section>
            <Button variant="primary" submit disabled={submitting || pristine}>
              {submitting ? 'Updating...' : 'Update Tracking Domain'}
            </Button>
          </Panel.LEGACY.Section>
        </form>
      </Panel.LEGACY>
    );
  }

  render() {
    return (
      <SendingDomainSection title="Select a Tracking Domain">
        <SendingDomainSection.Left>
          <SubduedText mt="300">
            <span>Link to a tracking domain to track opens, clicks, and unsubscribes.</span>
            <br />
            <PageLink to="/account/tracking-domains/create">Create a tracking domain.</PageLink>
          </SubduedText>
        </SendingDomainSection.Left>
        <SendingDomainSection.Right>{this.renderTrackingDomains()}</SendingDomainSection.Right>
      </SendingDomainSection>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    trackingDomains: selectTrackingDomainsOptions(state, props),
    initialValues: {
      trackingDomain: props.domain.tracking_domain,
    },
  };
}

const formOptions = {
  enableReinitialize: true,
  form: 'AssignTrackingDomain',
};

export default connect(mapStateToProps, { showAlert, listTrackingDomains, updateSendingDomain })(
  reduxForm(formOptions)(AssignTrackingDomain),
);
