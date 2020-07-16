import React, { Component } from 'react';
import { Delete, ContentCopy } from '@sparkpost/matchbox-icons';
import { DeleteModal, Loading } from 'src/components';
import { PageLink } from 'src/components/links';
import { Box, Button, Page } from 'src/components/matchbox';
import withAlert from './containers/DetailsPage.container';
import { AlertDetails } from './components/AlertDetails';
import AlertIncidents from './components/AlertIncidents';
import RedirectAndAlert from 'src/components/globalAlert/RedirectAndAlert';
import { useHibana } from 'src/context/HibanaContext';
import styles from './DetailsPage.module.scss';
import _ from 'lodash';

export class DetailsPageComponent extends Component {
  state = {
    isDeleteModalOpen: false,
  };

  componentDidMount() {
    const { id, getAlert, hasSubaccounts, listSubaccounts, getIncidents } = this.props;
    getAlert({ id });
    getIncidents({ id });
    if (hasSubaccounts) {
      listSubaccounts();
    }
  }

  closeDeleteModal = () => {
    this.setState({ isDeleteModalOpen: false });
  };

  openDeleteModal = () => {
    this.setState({ isDeleteModalOpen: true });
  };

  handleDelete = () => {
    const { id, deleteAlert, showUIAlert, alert, history } = this.props;
    const { name } = alert;

    return deleteAlert({ id }).then(() => {
      this.closeDeleteModal();
      history.push('/alerts');
      showUIAlert({ type: 'success', message: `Alert: ${name} Deleted` });
    });
  };

  subaccountIdToString = id => {
    const { subaccounts } = this.props;
    if (id === -1) {
      return 'Master and all subaccounts';
    }
    if (id === 0) {
      return 'Master account';
    }
    const matchedSubaccount = subaccounts.find(subaccount => subaccount.id === id) || {};
    return `${matchedSubaccount.name} (${matchedSubaccount.id})`;
  };

  DuplicateDeleteAction = () => {
    const { isHibanaEnabled, id } = this.props;
    return (
      <>
        <Box textAlign="right" position="relative" bottom="28px">
          <PageLink as={Button} flat to={`/alerts/create/${id}`}>
            {!isHibanaEnabled && <ContentCopy className={styles.Icon} />}
            <span>Duplicate</span>
            {isHibanaEnabled && (
              <Box marginLeft="200">
                <ContentCopy />
              </Box>
            )}
          </PageLink>

          <Button flat onClick={this.openDeleteModal}>
            {!isHibanaEnabled && <Delete className={styles.Icon} />}
            <span>Delete</span>
            {isHibanaEnabled && (
              <Box marginLeft="200">
                <Delete />
              </Box>
            )}
          </Button>
        </Box>
      </>
    );
  };

  EditAction = () => (
    <PageLink
      as={Button}
      to={`/alerts/edit/${this.props.id}`}
      variant="primary"
      className={styles.Actions}
    >
      Edit Alert
    </PageLink>
  );

  render() {
    const {
      loading,
      deletePending,
      alert = {},
      error,
      id,
      hasSubaccounts,
      incidents,
      isHibanaEnabled,
    } = this.props;
    const { isDeleteModalOpen } = this.state;
    const { name } = alert;

    if (loading) {
      return <Loading />;
    }

    if (error) {
      return <RedirectAndAlert to="/alerts" alert={{ type: 'error', message: error.message }} />;
    }

    const renderPagePrimaryArea = isHibanaEnabled ? this.EditAction : this.DuplicateDeleteAction;

    const renderComponentPrimaryArea = isHibanaEnabled
      ? this.DuplicateDeleteAction
      : this.EditAction;

    return (
      <Page
        title={name || 'Alert'}
        breadcrumbAction={{ content: 'Back to Alerts', to: '/alerts', component: PageLink }}
        primaryArea={renderPagePrimaryArea()}
      >
        {!_.isEmpty(alert) && (
          <AlertDetails
            alert={alert}
            id={id}
            subaccountIdToString={this.subaccountIdToString}
            hasSubaccounts={hasSubaccounts}
            renderPrimaryAreaComponent={renderComponentPrimaryArea}
          />
        )}
        {alert.metric !== 'blacklist' && (
          <AlertIncidents
            alert={alert}
            incidents={incidents}
            subaccountIdToString={this.subaccountIdToString}
          />
        )}
        <DeleteModal
          open={isDeleteModalOpen}
          title="Are you sure you want to delete this alert?"
          content={
            <p>
              The alert "<strong>{name}</strong>" will be permanently removed. This cannot be
              undone.
            </p>
          }
          onDelete={this.handleDelete}
          onCancel={this.closeDeleteModal}
          isPending={deletePending}
        />
      </Page>
    );
  }
}

const DetailsPage = props => {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;
  return <DetailsPageComponent isHibanaEnabled={isHibanaEnabled} {...props} />;
};
export default withAlert(DetailsPage);
