import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Button, Panel, Stack } from 'src/components/matchbox';
import { required } from 'src/helpers/validation';
import { TextFieldWrapper } from 'src/components';

export class NameForm extends Component {
  render() {
    const { pristine, submitting, handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <Panel.Section>
          <Stack>
            <Field
              // for redux-form
              name="firstName"
              component={TextFieldWrapper}
              // for the matchbox component
              id="firstName"
              label="First Name"
              validate={required}
              autoComplete="given-name"
            />

            <Field
              name="lastName"
              id="lastName"
              label="Last Name"
              component={TextFieldWrapper}
              validate={required}
              autoComplete="family-name"
            />
          </Stack>
        </Panel.Section>

        <Panel.Section>
          <Button variant="primary" submit disabled={submitting || pristine}>
            {submitting ? 'Updating Profile' : 'Update Profile'}
          </Button>
        </Panel.Section>
      </form>
    );
  }
}

const mapStateToProps = ({ currentUser }) => ({
  initialValues: {
    firstName: currentUser.first_name,
    lastName: currentUser.last_name,
  },
});

const formOptions = {
  form: 'profileName',
  enableReinitialize: true, // required to update initial values from redux state
};

// breaks if you do reduxForm first
export default connect(mapStateToProps)(reduxForm(formOptions)(NameForm));
