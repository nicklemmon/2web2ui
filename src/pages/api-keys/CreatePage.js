import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { createApiKey, listGrants, listSubaccountGrants } from 'src/actions/api-keys';
import { showAlert } from 'src/actions/globalAlert';
import { getFormLoading } from 'src/selectors/api-keys';
import { hasSubaccounts } from 'src/selectors/subaccounts';

import ApiKeyForm from './components/ApiKeyForm';
import { Loading } from 'src/components';
import { PageLink } from 'src/components/links';
import { Page, Panel } from 'src/components/matchbox';

const breadcrumbAction = {
  content: 'API Keys',
  Component: PageLink,
  to: '/account/api-keys',
};

export class CreatePage extends React.Component {
  componentDidMount() {
    this.props.listGrants();
    if (this.props.hasSubaccounts) {
      this.props.listSubaccountGrants();
    }
  }

  onSubmit = values => {
    const { createApiKey, history, showAlert } = this.props;

    return createApiKey(values).then(() => {
      showAlert({ type: 'success', message: 'API key created' });
      history.push('/account/api-keys');
    });
  };

  render() {
    if (this.props.loading) {
      return <Loading />;
    }

    return (
      <Page title="Create API Key" breadcrumbAction={breadcrumbAction}>
        <Panel.LEGACY>
          <ApiKeyForm onSubmit={this.onSubmit} isReadOnly={false} />
        </Panel.LEGACY>
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  loading: getFormLoading(state),
  hasSubaccounts: hasSubaccounts(state),
});

export default withRouter(
  connect(mapStateToProps, { createApiKey, listGrants, listSubaccountGrants, showAlert })(
    CreatePage,
  ),
);
