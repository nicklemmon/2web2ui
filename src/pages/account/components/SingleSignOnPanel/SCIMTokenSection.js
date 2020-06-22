import React from 'react';
import { Button, Modal, Panel, Stack, Text } from 'src/components/matchbox';
import { ButtonWrapper, CopyField, LabelledValue, ShortKeyCode } from 'src/components';
import useModal from 'src/hooks/useModal';
import Heading from 'src/components/text/Heading';
import { showAlert } from 'src/actions/globalAlert';
export default function SCIMTokenSection(props) {
  const { scimTokenList, newScimToken, generateScimToken, listScimToken, deleteScimToken } = props;
  const getActions =
    scimTokenList.length > 0
      ? [
          {
            content: 'Delete Token',
            onClick: () => {
              openModal({ name: 'Delete Token' });
            },
            color: 'orange',
          },
          {
            content: 'Generate SCIM Token',
            onClick: () => {
              openModal({ name: 'Override Token' });
            },
            color: 'orange',
          },
        ]
      : [
          {
            content: 'Generate SCIM Token',
            onClick: () => {
              handleGenerateToken();
            },
            color: 'orange',
          },
        ];
  const { closeModal, isModalOpen, openModal, meta: { name } = {} } = useModal();
  const handleGenerateToken = () => {
    generateScimToken().then(() => {
      openModal({ name: 'Generate SCIM Token' });
      listScimToken();
    });
  };
  const handleDeleteToken = () => {
    deleteScimToken({ id: scimTokenList[0].id }).then(() => {
      listScimToken();
      closeModal();
      showAlert({ type: 'success', message: 'SCIM token deleted' });
    });
  };
  const renderModalByName = name => {
    switch (name) {
      case 'Override Token':
        return (
          <Panel title="Generate SCIM Token">
            <Panel.Section>
              <Stack>
                <p>
                  <Text as="span" fontWeight="medium">
                    Override Your Current Token?
                  </Text>
                </p>
                <p>
                  Creating a new token will
                  <Text as="span" fontWeight="medium">
                    <strong> override the existing token.</strong>
                  </Text>
                </p>
              </Stack>
            </Panel.Section>
            <Panel.Section>
              <ButtonWrapper>
                <Button
                  variant="primary"
                  onClick={() => {
                    closeModal();
                    handleGenerateToken();
                  }}
                >
                  Generate New Token
                </Button>
                <Button variant="secondary" onClick={() => closeModal()}>
                  Cancel
                </Button>
              </ButtonWrapper>
            </Panel.Section>
          </Panel>
        );
      case 'Delete Token':
        return (
          <Panel title="Delete SCIM Token">
            <Panel.Section>
              <Stack>
                <p>
                  <Text as="span">
                    The token will be immediately and permanently removed. This cannot be undone.
                  </Text>
                </p>
              </Stack>
            </Panel.Section>
            <Panel.Section>
              <ButtonWrapper>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDeleteToken();
                  }}
                >
                  Delete SCIM Token
                </Button>
                <Button variant="secondary" onClick={() => closeModal()}>
                  Cancel
                </Button>
              </ButtonWrapper>
            </Panel.Section>
          </Panel>
        );

      default:
      case 'Generate SCIM Token':
        return (
          <Panel title="Generate SCIM Token">
            <Panel.Section>
              <Stack>
                <p>Copy this token!</p>
                <p>
                  Make sure to copy your SCIM token now.{' '}
                  <Text as="span" fontWeight="medium">
                    <strong>You won't be able to see it again!</strong>
                  </Text>
                </p>
                <CopyField value={newScimToken} />
              </Stack>
            </Panel.Section>
            <Panel.Section>
              <Button variant="primary" onClick={() => closeModal()}>
                Continue
              </Button>
            </Panel.Section>
          </Panel>
        );
    }
  };
  return (
    <Panel.Section title="SCIM Token" actions={getActions}>
      <LabelledValue label="SCIM Token">
        <Heading as="h6">
          {scimTokenList.length > 0 ? (
            <ShortKeyCode shortKey={scimTokenList[0].short_key} />
          ) : (
            'No token generated'
          )}
        </Heading>
      </LabelledValue>
      <Modal open={isModalOpen} onClose={() => closeModal()} showCloseButton>
        {isModalOpen && renderModalByName(name)}
      </Modal>
    </Panel.Section>
  );
}
