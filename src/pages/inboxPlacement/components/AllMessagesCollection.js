import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import startCase from 'lodash/startCase';
import { CheckCircle } from '@sparkpost/matchbox-icons';
import { tokens } from '@sparkpost/design-tokens-hibana';
import { getInboxPlacementMessage } from 'src/actions/inboxPlacement';
import { TableCollection } from 'src/components/collection';
import { PanelLoading } from 'src/components/loading';
import { Button, CodeBlock, Modal, Panel, Stack } from 'src/components/matchbox';
import useModal from 'src/hooks/useModal';

export const renderPassFail = value => {
  switch (value) {
    case 'pass':
      return <CheckCircle color={tokens.color_green_700} data-id="auth-passed" size="24" />;
    case null:
      return '---';
    default:
      return startCase(value);
  }
};

export const AllMessagesCollection = ({
  data = [],
  getInboxPlacementMessage,
  messagesById,
  testId,
}) => {
  const { closeModal, isModalOpen, meta = {}, openModal } = useModal();
  const message = messagesById[meta.id];

  useEffect(() => {
    if (meta.id && !message) {
      getInboxPlacementMessage(testId, meta.id);
    }
  }, [getInboxPlacementMessage, testId, message, meta]);

  const columns = [
    {
      component: ({ email_address }) => email_address,
      header: {
        label: 'Seed Domain',
        sortKey: 'email_address',
      },
    },
    {
      component: ({ folder, tab }) => (
        <>
          {startCase(folder)}
          {tab && ` | ${startCase(tab)} Folder`}
        </>
      ),
      header: {
        label: 'Folder Placement',
        sortKey: 'folder', // only by folder
      },
    },
    {
      component: ({ spf }) => renderPassFail(spf),
      header: {
        label: 'SPF',
        sortKey: 'spf', // sort by text
        minWidth: '100px',
      },
    },
    {
      component: ({ dkim }) => renderPassFail(dkim),
      header: {
        label: 'DKIM',
        sortKey: 'dkim', // sort by text
        minWidth: '100px',
      },
    },
    {
      component: ({ dmarc }) => renderPassFail(dmarc),
      header: {
        label: 'DMARC',
        sortKey: 'dmarc', // sort by text
        minWidth: '100px',
      },
    },
    {
      component: ({ id, email_address }) => {
        return (
          <Button onClick={() => openModal({ id, email_address })} title="Opens a dialog">
            View Header
          </Button>
        );
      },
      header: {
        label: 'Headers',
      },
    },
  ];
  const renderRow = columns => props =>
    columns.map(({ component: Component }) => <Component {...props} />);

  return (
    <>
      <TableCollection
        columns={columns.map(({ header }) => header)}
        rows={data}
        getRowData={renderRow(columns)}
        defaultSortColumn="email_address"
        defaultSortDirection="asc"
        filterBox={false}
      />
      <Modal open={isModalOpen} onClose={() => closeModal()} showCloseButton>
        {isModalOpen && (
          <>
            {!message || message.status !== 'loaded' ? (
              <PanelLoading />
            ) : (
              <Panel title="Email Header" sectioned>
                <Stack>
                  <p>{message.email_address}</p>
                  <CodeBlock code={message.headers || ''} />
                </Stack>
              </Panel>
            )}
          </>
        )}
      </Modal>
    </>
  );
};

const mapStateToProps = state => ({
  messagesById: state.inboxPlacement.messagesById,
});

export default connect(mapStateToProps, { getInboxPlacementMessage })(AllMessagesCollection);
