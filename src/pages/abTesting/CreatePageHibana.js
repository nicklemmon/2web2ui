import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setSubaccountQuery } from 'src/helpers/subaccounts';

// Actions
import { createAbTestDraft } from 'src/actions/abTesting';
import { showAlert } from 'src/actions/globalAlert';
import { listTemplates } from 'src/actions/templates';

// Components
import { PageLink } from 'src/components/links';
import { Panel, Page, Text } from 'src/components/matchbox';
import AbTestCreateForm from './components/AbTestCreateForm.container';
export class CreatePageHibana extends Component {
  componentDidMount() {
    // Get templates here for the typeahead
    // Ensures the list is always up to date
    this.props.listTemplates();
  }

  create = values => {
    const { createAbTestDraft, showAlert, history } = this.props;
    const { id, name, subaccount, default_variant = {} } = values;
    const subaccountId = subaccount ? subaccount.id : null;
    const default_template = { template_id: default_variant.id };
    const abTest = { id, name, default_template };

    return createAbTestDraft({ abTest, subaccount: subaccountId }).then(() => {
      showAlert({ type: 'success', message: 'A/B test draft created' });
      history.push(`/ab-testing/${abTest.id}/1${setSubaccountQuery(subaccountId)}`);
    });
  };

  render() {
    return (
      <Page
        breadcrumbAction={{ content: 'Back to A/B Tests', component: PageLink, to: '/ab-testing' }}
      >
        <Text as="h1" fontWeight="500" marginTop={-15} mb={20}>
          Create a New A/B Test
        </Text>
        <Panel>
          <AbTestCreateForm onSubmit={this.create} />
        </Panel>
      </Page>
    );
  }
}

export default connect(null, { createAbTestDraft, showAlert, listTemplates })(CreatePageHibana);
