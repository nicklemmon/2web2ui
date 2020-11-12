import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Delete } from '@sparkpost/matchbox-icons';
import { useModal } from 'src/hooks';
import { deleteAlert, setMutedStatus } from 'src/actions/alerts';
import { showAlert } from 'src/actions/globalAlert';
import { Button, ScreenReaderOnly, Tag, Toggle } from 'src/components/matchbox';
import { DeleteModal, DisplayDate, TableCollection } from 'src/components';
import { PageLink } from 'src/components/links';
import { TranslatableText } from 'src/components/text';
import { METRICS } from '../constants/formConstants';
import OGStyles from './AlertCollection.module.scss';
import hibanaStyles from './AlertCollectionHibana.module.scss';
import useHibanaOverride from 'src/hooks/useHibanaOverride/useHibanaOverride';

const FILTER_BOX_CONFIG = {
  show: true,
  exampleModifiers: ['name'],
  itemToStringKeys: ['name'],
};

function getColumns() {
  return [
    { label: 'Alert Name', sortKey: 'name', width: '35%' },
    { label: 'Metric', sortKey: 'metric' },
    { label: 'Last Triggered', sortKey: 'last_triggered_timestamp' },
    { label: 'Mute', sortKey: 'muted' },
    { label: <ScreenReaderOnly>Actions</ScreenReaderOnly> },
  ];
}

export default function AlertCollection({ alerts }) {
  const styles = useHibanaOverride(OGStyles, hibanaStyles);
  const { setMutedStatusPending, deletePending } = useSelector(state => state.alerts);
  const reduxDispatch = useDispatch();
  const { closeModal, openModal, isModalOpen, meta = {} } = useModal();

  function handleToggle(alert) {
    return reduxDispatch(setMutedStatus({ muted: !alert.muted, id: alert.id })).then(() => {
      reduxDispatch(
        showAlert({
          type: 'success',
          message: 'Alert updated',
        }),
      );
    });
  }

  function handleDelete(alert) {
    return reduxDispatch(deleteAlert({ id: alert.id })).then(() => {
      reduxDispatch(showAlert({ type: 'success', message: 'Alert deleted' }));
      closeModal();
    });
  }

  function getRowData(alert) {
    return [
      <PageLink to={`/alerts/details/${alert.id}`}>{alert.name}</PageLink>,
      <Tag>{METRICS[alert.metric]}</Tag>,
      <DisplayDate
        timestamp={alert.last_triggered_timestamp}
        formattedDate={alert.last_triggered_formatted || 'Never Triggered'}
      />,
      <AlertToggle
        checked={alert.muted}
        id={alert.id}
        onToggle={() => handleToggle(alert)}
        disabled={setMutedStatusPending}
      />,
      <Button variant="minimal" onClick={() => openModal({ alert })}>
        <TranslatableText>Delete</TranslatableText>
        <Delete className={styles.Icon} />
      </Button>,
    ];
  }

  return (
    <>
      <TableCollection
        columns={getColumns()}
        rows={alerts}
        getRowData={getRowData}
        pagination={true}
        filterBox={FILTER_BOX_CONFIG}
        defaultSortColumn="last_triggered_timestamp"
        defaultSortDirection="desc"
      />

      <DeleteModal
        open={isModalOpen}
        title="Are you sure you want to delete this alert?"
        content={
          <p>
            <TranslatableText>The alert "</TranslatableText>
            <strong>{meta.alert?.name}</strong>
            <TranslatableText>
              " will be permanently removed. This cannot be undone.
            </TranslatableText>
          </p>
        }
        onDelete={() => handleDelete(meta.alert)}
        onCancel={() => closeModal()}
        deleting={deletePending}
      />
    </>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

function AlertToggle({ id, checked, onToggle }) {
  return (
    <Wrapper data-id="alert-toggle">
      <Toggle id={id.toString()} compact checked={checked} onChange={onToggle} />
    </Wrapper>
  );
}
