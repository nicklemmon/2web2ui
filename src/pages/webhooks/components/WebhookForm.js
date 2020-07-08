import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector, Field } from 'redux-form';
import { selectInitialSubaccountValue, getSelectedEvents } from 'src/selectors/webhooks';
import { hasSubaccounts } from 'src/selectors/subaccounts';
import { withRouter } from 'react-router-dom';
import { Button, Panel, Stack, Tooltip } from 'src/components/matchbox';
import CheckboxWrapper from 'src/components/reduxFormWrappers/CheckboxWrapper';
import useHibanaOverride from 'src/hooks/useHibanaOverride';
import { selectWebhookEventListing } from 'src/selectors/eventListing';
import {
  NameField,
  TargetField,
  EventsRadioGroup,
  AuthDropDown,
  BasicAuthFields,
  OAuth2Fields,
  ActiveField,
} from './Fields';
import SubaccountSection from './SubaccountSection';
import formatEditValues from '../helpers/formatEditValues';
import OGStyles from './WebhookForm.module.scss';
import HibanaStyles from './WebhookFormHibana.module.scss';

const formName = 'webhookForm';

export function EventCheckBoxes({ events, disabled }) {
  const styles = useHibanaOverride(OGStyles, HibanaStyles);

  return (
    <div className={styles.CheckboxGrid}>
      {events.map(({ key, display_name, description, name = `events.${key}` }) => (
        <div key={key}>
          <Tooltip dark content={description}>
            <Field
              label={display_name}
              type="checkbox"
              name={name}
              component={CheckboxWrapper}
              disabled={disabled}
            />
          </Tooltip>
        </div>
      ))}
    </div>
  );
}

export function AuthFields({ authType, disabled }) {
  if (authType === 'basic') {
    return <BasicAuthFields disabled={disabled} />;
  }
  if (authType === 'oauth2') {
    return <OAuth2Fields disabled={disabled} />;
  }
  return null;
}

export class WebhookForm extends Component {
  render() {
    const {
      handleSubmit,
      auth,
      eventListing,
      showEvents,
      newWebhook,
      hasSubaccounts,
      pristine,
      submitting,
    } = this.props;
    const submitText = submitting
      ? 'Submitting...'
      : newWebhook
      ? 'Create Webhook'
      : 'Update Webhook';

    return (
      <form onSubmit={handleSubmit}>
        <Panel.Section>
          <Stack>
            <NameField disabled={submitting} />
            <TargetField disabled={submitting} />
          </Stack>
        </Panel.Section>
        {hasSubaccounts ? (
          <Panel.Section>
            <SubaccountSection newWebhook={newWebhook} formName={formName} disabled={submitting} />
          </Panel.Section>
        ) : null}
        <Panel.Section>
          <Stack>
            <EventsRadioGroup disabled={submitting} />
            {showEvents && <EventCheckBoxes events={eventListing} disabled={submitting} />}
          </Stack>
        </Panel.Section>
        <Panel.Section>
          <Stack>
            <AuthDropDown disabled={submitting} />
            <AuthFields authType={auth} disabled={submitting} />
          </Stack>
        </Panel.Section>
        {newWebhook ? null : (
          <Panel.Section>
            <ActiveField disabled={submitting} />
          </Panel.Section>
        )}
        <Panel.Section>
          <Button submit variant="primary" disabled={pristine || submitting}>
            {submitText}
          </Button>
        </Panel.Section>
      </form>
    );
  }
}

const mapStateToProps = (state, props) => {
  const selector = formValueSelector(formName);
  const { eventsRadio, auth } = selector(state, 'eventsRadio', 'auth');
  const webhookValues = props.newWebhook ? {} : formatEditValues(state.webhooks.webhook);

  return {
    showEvents: eventsRadio === 'select',
    auth,
    hasSubaccounts: hasSubaccounts(state),
    eventListing: selectWebhookEventListing(state),
    initialValues: {
      assignTo: 'all',
      eventsRadio: props.allChecked || props.newWebhook ? 'all' : 'select',
      subaccount: !props.newWebhook ? selectInitialSubaccountValue(state, props) : null,
      ...webhookValues,
      events: props.newWebhook ? {} : getSelectedEvents(state),
    },
  };
};

const formOptions = {
  form: formName,
  enableReinitialize: true,
};

export default withRouter(connect(mapStateToProps, {})(reduxForm(formOptions)(WebhookForm)));
