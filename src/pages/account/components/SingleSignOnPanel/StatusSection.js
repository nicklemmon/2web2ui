import React from 'react';
import styled from 'styled-components';
import { Panel } from 'src/components/matchbox';
import { ArrowForward, PowerSettingsNew } from '@sparkpost/matchbox-icons';
import { ConfirmationModal } from 'src/components/modals';
import LabelledValue from 'src/components/labelledValue/LabelledValue';
import { PageLink } from 'src/components/links';

const ActionWrapper = styled.span`
  display: inline-flex;
  align-items: center;
`;

const ActionIcon = styled.span`
  margin-left: 3px;
`;

export class StatusSection extends React.Component {
  state = {
    isModalOpen: false,
  };

  componentDidUpdate(prevProps) {
    const { updatedAt } = this.props;

    if (updatedAt !== prevProps.updatedAt) {
      this.setState({ isModalOpen: false });
    }
  }

  cancel = () => {
    this.setState({ isModalOpen: false });
  };

  disable = () => {
    const { cert, provider } = this.props;
    this.props.updateAccountSingleSignOn({ cert, enabled: false, provider });
  };

  enable = () => {
    const { cert, provider } = this.props;
    this.props.updateAccountSingleSignOn({ cert, enabled: true, provider });
  };

  toggle = () => {
    if (this.props.enabled) {
      this.setState({ isModalOpen: true });
    } else {
      this.enable();
    }
  };

  renderControls() {
    const { enabled, updating } = this.props;
    const { isModalOpen } = this.state;
    return (
      <React.Fragment>
        <LabelledValue label="Status">
          <h6>{enabled ? 'Enabled' : 'Disabled'}</h6>
          {enabled && (
            <p>
              <PageLink to="/account/users">
                Manage single sign-on users <ArrowForward />
              </PageLink>
            </p>
          )}
        </LabelledValue>
        <ConfirmationModal
          confirming={updating}
          open={isModalOpen}
          title="Are you sure you want to disable Single Sign-On?"
          content={<p>This will disable Single Sign-On for all your users.</p>}
          confirmVerb="Disable"
          onCancel={this.cancel}
          onConfirm={this.disable}
        />
      </React.Fragment>
    );
  }

  render() {
    const { readOnly, provider, enabled, updating } = this.props;

    if (!provider) {
      return null;
    }

    return (
      <Panel.LEGACY.Section
        actions={[
          {
            color: 'orange',
            content: enabled ? (
              <ActionWrapper>
                <span>Disable SSO</span>

                <ActionIcon as={PowerSettingsNew} />
              </ActionWrapper>
            ) : (
              <ActionWrapper>
                <span>Enable SSO</span>

                <ActionIcon as={PowerSettingsNew} />
              </ActionWrapper>
            ),
            disabled: updating || readOnly,
            onClick: this.toggle,
          },
        ]}
      >
        {this.renderControls()}
      </Panel.LEGACY.Section>
    );
  }
}

export default StatusSection;
