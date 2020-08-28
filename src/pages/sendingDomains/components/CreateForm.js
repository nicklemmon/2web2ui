import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { Box, Button, Panel, Stack } from 'src/components/matchbox';
import { ButtonWrapper, TextFieldWrapper } from 'src/components';
import { PageLink } from 'src/components/links';
import { required } from 'src/helpers/validation';
import { hasSubaccounts } from 'src/selectors/subaccounts';
import SubaccountForm from './SubaccountForm';

const FORM_NAME = 'createSendingDomain';

export class CreateForm extends Component {
  render() {
    const { submitting, handleSubmit, hasSubaccounts } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <Panel.LEGACY.Section>
          <Stack>
            <Box maxWidth="1200">
              <p>
                We recommend using a subdomain e.g. <em>mail.mydomain.com</em>. Depending on how you
                want to use your domain, you may not be able to completely configure your DNS
                records if you use your organizational domain.
              </p>
            </Box>

            <Field
              component={TextFieldWrapper}
              label="Domain Name"
              placeholder="email.example.com"
              name="domain"
              // Do not try to validate sending domains, let our API make that decision
              validate={[required]}
              disabled={submitting}
            />

            {hasSubaccounts && <SubaccountForm formName={FORM_NAME} />}
          </Stack>
        </Panel.LEGACY.Section>

        <Panel.LEGACY.Section>
          <ButtonWrapper>
            <Button variant="primary" submit disabled={submitting}>
              {submitting ? 'Submitting...' : 'Add a Domain'}
            </Button>

            <PageLink
              as={Button}
              to="/account/sending-domains"
              variant="secondary"
              disabled={submitting}
            >
              Cancel
            </PageLink>
          </ButtonWrapper>
        </Panel.LEGACY.Section>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  hasSubaccounts: hasSubaccounts(state),
  initialValues: {
    assignTo: 'master',
  },
});

const formOptions = { form: FORM_NAME };
export default connect(mapStateToProps, {})(reduxForm(formOptions)(CreateForm));
