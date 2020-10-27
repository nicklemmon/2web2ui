import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { Grid, Box } from 'src/components/matchbox';
import { TextFieldWrapper, SubaccountTypeaheadWrapper } from 'src/components';
import { email as emailValidator, required } from 'src/helpers/validation';
import { onEnter } from 'src/helpers/keyEvents';
import styles from './EmailSearch.module.scss';

export class FilterForm extends Component {
  state = {
    email: '',
    subaccountId: null,
  };

  handleChange = event => {
    const { value } = event.target;
    const { email } = this.state;

    if (email !== value) {
      //ignore unchanged events
      this.setState({ email: value }, this.refresh);
    }
  };

  handleSubaccountSelect = subaccount => {
    // If a subaccount is selected, update state accordingly, otherwise clear it
    const selectedSubaccount = subaccount ? subaccount.id : '';

    this.setState({ subaccountId: selectedSubaccount }, this.refresh);
  };

  refresh() {
    const { email, subaccountId } = this.state;
    if (emailValidator(email) === undefined) {
      this.props.onSubmit({ email, subaccountId });
    }
  }

  render() {
    const { hasSubaccounts } = this.props;

    return (
      <Grid>
        <Grid.Column xs={12} md={hasSubaccounts ? 6 : 12}>
          <Box mb={['300', null, null, '0']}>
            <label htmlFor="email" className={styles.ScreenReaderOnly}>
              Recipient Email
            </label>

            <Field
              name="email"
              onBlur={this.handleChange}
              onKeyDown={onEnter(this.handleChange)}
              component={TextFieldWrapper}
              title="Email"
              validate={[required, emailValidator]}
              placeholder="Recipient Email"
            />
          </Box>
        </Grid.Column>

        {hasSubaccounts && (
          <Grid.Column xs={12} md={6}>
            <Box>
              <label htmlFor="subaccount" className={styles.ScreenReaderOnly}>
                Subaccount
              </label>

              <Field
                name="subaccount"
                component={SubaccountTypeaheadWrapper}
                label=""
                onChange={e => this.handleSubaccountSelect(e)}
                placeholder="Subaccount"
              />
            </Box>
          </Grid.Column>
        )}
      </Grid>
    );
  }
}

const formName = 'recipientSearch';

const formOptions = { form: formName };
export default connect(null, {})(reduxForm(formOptions)(FilterForm));
