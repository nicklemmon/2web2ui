/* eslint max-lines: ["error", 300] */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, Form, formValueSelector } from 'redux-form';

// Components
import { Panel, Grid, Button } from '@sparkpost/matchbox';
import { withRouter } from 'react-router-dom';
import ToggleBlock from 'src/components/toggleBlock/ToggleBlock';
import { TextFieldWrapper, SelectWrapper, RadioGroup, SubaccountTypeaheadWrapper } from 'src/components';
import { formatEditValues } from 'src/selectors/alerts';
import getOptions from '../helpers/getOptions';
import { METRICS } from '../constants/metrics';
import { FACETS } from '../constants/facets';
import { COMPARATOR } from '../constants/comparator';
import { CRITERIA } from '../constants/criteria';

// Helpers & Validation
import { required, integer, minNumber, maxLength, numberBetween } from 'src/helpers/validation';
import validateEmailList from '../helpers/validateEmailList';

const formName = 'alertForm';

const accountOptions = [
  { label: 'Master and all subaccounts', value: 'all', disabled: true },
  { label: 'Master account only', value: 'master', disabled: true },
  { label: 'Single Subaccount', value: 'subaccount', disabled: true }
];

export class AlertForm extends Component {

  // Prevents unchecked value from equaling ""
  parseToggle = (value) => !!value

  render() {
    const {
      submitting,
      assignTo,
      alert_metric = '',
      facet_name,
      handleSubmit,
      enabled,
      newAlert
    } = this.props;

    const submitText = submitting ? 'Submitting...' : (newAlert ? 'Create Alert' : 'Update Alert');
    const isSignals = alert_metric.startsWith('signals_');
    const isThreshold = (alert_metric === 'monthly_sending_limit' || alert_metric === 'signals_health_threshold');
    const getTargetValidation = () => {
      if (isThreshold) {
        if (isSignals) {
          return [required, numberBetween(0, 1)];
        } else {
          return [required, integer, minNumber(0)];
        }
      } else {
        return required;
      }
    };

    return (
      <Form onSubmit={handleSubmit}>
        <Panel>
          <Panel.Section>
            <Field
              name='name'
              label='Name'
              component={TextFieldWrapper}
              disabled={submitting}
              validate={[required, maxLength(24)]}
            />
            <Field
              name='alert_metric'
              label='Alert Type'
              component={SelectWrapper}
              options={getOptions(METRICS)}
              disabled={true}
              validate={required}
            />
            {isSignals &&
            <Field
              component={RadioGroup}
              label='Account'
              name='assignTo'
              options={accountOptions}
            />}
            {isSignals && assignTo === 'subaccount' &&
            <Field
              name='subaccount'
              component={SubaccountTypeaheadWrapper}
              disabled={true}
            />}
            {isSignals &&
            <label>Facet</label>}
            {isSignals &&
            <Grid>
              <Grid.Column xs={6} md={4}>
                <div>
                  <Field
                    name='facet_name'
                    component={SelectWrapper}
                    options={getOptions(FACETS)}
                    disabled={submitting}
                    validate={required}
                  />
                </div>
              </Grid.Column>
              {facet_name !== 'ALL' &&
              <Grid.Column xs={6} md={4}>
                <div>
                  <Field
                    name='facet_value'
                    component={TextFieldWrapper}
                    disabled={submitting}
                    validate={required}
                  />
                </div>
              </Grid.Column>}
            </Grid>}
            {isSignals && <br/>}
            <label>Criteria</label>
            <Grid>
              <Grid.Column xs={6} md={4}>
                <div>
                  <Field
                    name='threshold.error.comparator'
                    component={SelectWrapper}
                    options={getOptions(COMPARATOR)}
                    disabled={submitting || isThreshold}
                    validate={required}
                  />
                </div>
              </Grid.Column>
              <Grid.Column xs={6} md={4}>
                <div>
                  <Field
                    name='threshold.error.target'
                    component={TextFieldWrapper}
                    disabled={submitting}
                    validate={getTargetValidation()}
                  />
                </div>
              </Grid.Column>
              <Grid.Column xs={6} md={4}>
                <div>
                  <Field
                    name='criteria_metric'
                    component={SelectWrapper}
                    options={getOptions(CRITERIA)}
                    disabled={true}
                    validate={required}
                  />
                </div>
              </Grid.Column>
            </Grid>
            <br/>
            <Field
              name='email_addresses'
              label='Notify'
              component={TextFieldWrapper}
              disabled={submitting}
              validate={[required, validateEmailList]}
              multiline
            />
            <Grid>
              <Grid.Column xs={1} md={1}>
                <label>Enabled</label>
              </Grid.Column>
              <Grid.Column xs={1} md={1}>
                <div>
                  <Field
                    name='enabled'
                    checked={enabled}
                    component={ToggleBlock}
                    parse={this.parseToggle}
                    disabled={submitting}
                  />
                </div>
              </Grid.Column>
            </Grid>
            <br/>
            <Button submit primary disabled={submitting}>{submitText}</Button>
          </Panel.Section>
        </Panel>
      </Form>
    );
  }
}
const mapStateToProps = (state, props) => {
  const alertValues = formatEditValues(state, state.alerts.alert);
  const selector = formValueSelector(formName);

  return {
    disabled: props.pristine || props.submitting,
    alert_metric: selector(state, 'alert_metric'),
    facet_name: selector(state, 'facet_name'),
    assignTo: selector(state, 'assignTo'),
    subaccount: selector(state, 'subaccount'),
    enabled: selector(state, 'enabled'),
    initialValues: props.newAlert ? null : alertValues
  };
};

const formOptions = {
  form: formName,
  enableReinitialize: true
};

export default withRouter(connect(mapStateToProps, {})(reduxForm(formOptions)(AlertForm)));
