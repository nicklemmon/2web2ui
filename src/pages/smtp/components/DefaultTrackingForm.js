import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Panel, Stack } from 'src/components/matchbox';
import { ToggleBlock } from 'src/components/toggleBlock';

export class DefaultTrackingForm extends Component {
  render() {
    const { updateLoading, toggle } = this.props;
    return (
      <Panel.LEGACY sectioned title="Engagement Tracking">
        <Stack>
          <p>
            Engagement tracking allows the ability to show how many recipients opened messages or
            clicked links. This is the default setting for engagement tracking for SMTP.
          </p>

          <Field
            name="options.smtp_tracking_default"
            component={ToggleBlock}
            label="SMTP Engagement Tracking"
            type="checkbox"
            disabled={updateLoading}
            onChange={toggle}
          />
        </Stack>
      </Panel.LEGACY>
    );
  }
}

const mapStateToProps = ({ account }) => ({
  updateLoading: account.updateLoading,
  initialValues: {
    ...account,
  },
});

const formOptions = {
  form: 'smtpDefaultOptions',
};

export default connect(mapStateToProps)(reduxForm(formOptions)(DefaultTrackingForm));
