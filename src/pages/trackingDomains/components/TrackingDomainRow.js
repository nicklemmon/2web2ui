import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  listTrackingDomains,
  updateTrackingDomain,
  deleteTrackingDomain,
  verifyTrackingDomain,
} from 'src/actions/trackingDomains';
import { Subaccount } from 'src/components';
import ActionPopover from 'src/components/actionPopover';
import { Grid, Panel, Tag } from 'src/components/matchbox';
import { DeleteModal, ConfirmationModal } from 'src/components/modals';
import { DomainStatusTag } from 'src/components/tags';
import styles from './TrackingDomainRow.module.scss';
import _ from 'lodash';

export function IsDefaultTag() {
  return (
    <Tag color="orange" className={styles.Tag}>
      Default
    </Tag>
  );
}

export class TrackingDomainRow extends Component {
  state = {
    deleteModalOpen: false,
    defaultModalOpen: false,
  };

  componentWillUnmount() {
    this.setState({
      deleteModalOpen: false,
      defaultModalOpen: false,
    });
  }

  toggleDeleteModal = () => {
    this.setState({ deleteModalOpen: !this.state.deleteModalOpen });
  };

  toggleDefaultModal = () => {
    this.setState({ defaultModalOpen: !this.state.defaultModalOpen });
  };

  delete = () => {
    const { domain, subaccountId, deleteTrackingDomain } = this.props;
    return deleteTrackingDomain({ domain, subaccountId }).catch(_.noop); // swallow error
  };

  update = data => {
    const {
      listTrackingDomains,
      updateTrackingDomain,
      domain,
      subaccountId: subaccount,
    } = this.props;
    return updateTrackingDomain({ domain, subaccount, ...data })
      .catch(_.noop) // ignore errors
      .then(() => listTrackingDomains());
  };

  toggleDefaultValue = () => {
    const { isDefault } = this.props;
    return this.update({ default: !isDefault });
  };

  retryVerification = () => {
    const { verifyTrackingDomain, domain, subaccountId } = this.props;
    verifyTrackingDomain({ domain, subaccountId });
  };

  renderModals() {
    const { domain, isDefault, deleting, updating } = this.props;
    const { deleteModalOpen, defaultModalOpen } = this.state;

    return (
      <div>
        <DeleteModal
          open={deleteModalOpen}
          title={`Permanently delete ${domain}?`}
          content={
            <p>
              <span>
                Any templates or transmissions that use this tracking domain directly will fail.
              </span>
              {isDefault && (
                <span>
                  <br />
                  <strong>Note: Deleting this domain will remove it as default, as well.</strong>
                </span>
              )}
            </p>
          }
          isPending={deleting}
          onDelete={this.delete}
          onCancel={this.toggleDeleteModal}
        />
        <ConfirmationModal
          open={defaultModalOpen}
          title={`${isDefault ? 'Remove' : 'Set'} default tracking domain (${domain})`}
          content={
            <p>
              {isDefault
                ? `Transmissions and templates that don't specify a tracking domain will no longer use ${domain}. Instead, they will use the system default until another default is selected.`
                : `Transmissions and templates that don't specify a tracking domain will now use ${domain}.`}
            </p>
          }
          isPending={updating}
          onConfirm={this.toggleDefaultValue}
          onCancel={this.toggleDefaultModal}
          confirmVerb={isDefault ? 'Remove Default' : 'Set as Default'}
        />
      </div>
    );
  }

  render() {
    const { domain, subaccountId, status, isDefault, verifying } = this.props;
    return (
      <>
        <Panel.LEGACY.Section>
          <Grid>
            <Grid.Column xs={12} md={8}>
              <span className={styles.DomainHeading}>{domain}</span>
              <div className={styles.TagRow}>
                {status !== 'verified' && (
                  <DomainStatusTag className={styles.Tag} status={status} />
                )}
                {isDefault && !subaccountId && <IsDefaultTag />}
                {subaccountId && (
                  <Subaccount
                    className={styles.Tag}
                    id={subaccountId}
                    isDefault={!!subaccountId && isDefault}
                  />
                )}
              </div>
            </Grid.Column>
            <Grid.Column xs={12} md={4}>
              <ActionPopover
                actions={[
                  {
                    content: this.props.isDefault ? 'Remove Default' : 'Set as Default',
                    onClick: () => this.toggleDefaultModal(),
                    visible: this.props.verified,
                  },
                  {
                    content: verifying.indexOf(domain) >= 0 ? 'Verifying...' : 'Retry Verification',
                    onClick: () => this.retryVerification(),
                    visible: !this.props.verified,
                  },
                  {
                    content: 'Delete',
                    onClick: () => this.toggleDeleteModal(),
                    visible: status !== 'pending' && status !== 'blocked',
                  },
                ]}
              />
            </Grid.Column>
          </Grid>
        </Panel.LEGACY.Section>

        {this.renderModals()}
      </>
    );
  }
}

const mapStateToProps = (state, { domain, default: isDefault, subaccount_id: subaccountId }) => ({
  isDefault,
  subaccountId,
  updating: state.trackingDomains.updating === domain,
  deleting: state.trackingDomains.deleting === domain,
});
export default connect(mapStateToProps, {
  listTrackingDomains,
  updateTrackingDomain,
  deleteTrackingDomain,
  verifyTrackingDomain,
})(TrackingDomainRow);
