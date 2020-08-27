import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Subaccount } from 'src/components';
import ActionPopover from 'src/components/actionPopover';
import { Panel, ScreenReaderOnly } from 'src/components/matchbox';
import { PanelLoading, TableCollection, Empty, DeleteModal } from 'src/components';
import { deleteSuppression } from 'src/actions/suppressions';
import { showAlert } from 'src/actions/globalAlert';
import Detail from './Detail';

export function Results(props) {
  const { results = [], loading, deleting, subaccounts, hasSubaccounts } = props;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState({});
  const [deleteData, setDeleteData] = useState({ recipient: '' });

  function getRowData(row) {
    const { recipient, type, source, subaccount_id: subaccountId, subaccount_name } = row;
    const { hasSubaccounts, deleting } = props;
    const rowData = [
      recipient,
      type === 'transactional' ? 'Transactional' : 'Non-transactional',
      source,
    ];

    if (hasSubaccounts) {
      rowData.push(<Subaccount id={subaccountId} master={!subaccountId} name={subaccount_name} />);
    }

    rowData.push(
      <ActionPopover
        actions={[
          {
            content: 'View Details',
            onClick: () => openDetailModal(row),
          },
          {
            content: 'Delete',
            onClick: () => openDeleteModal(row),
            visible: !deleting,
          },
        ]}
      />,
    );

    return rowData;
  }

  function getColumns() {
    const { hasSubaccounts } = props;

    const columns = [
      { label: 'Recipient', sortKey: 'recipient' },
      { label: 'Type', sortKey: 'type', width: '18%' },
      { label: 'Source', width: '20%', sortKey: 'source' },
    ];

    if (hasSubaccounts) {
      columns.push({
        label: 'Subaccount',
        width: '18%',
        sortKey: row => parseInt(row.subaccount_id, 10),
      });
    }

    columns.push({ label: <ScreenReaderOnly>Actions</ScreenReaderOnly>, width: '21%' });

    return columns;
  }

  function deleteSuppression() {
    const { showAlert, deleteSuppression } = props;
    const { recipient } = deleteData;

    return deleteSuppression(deleteData).then(() => {
      setIsDeleteModalOpen(false);

      return showAlert({
        type: 'success',
        message: `${recipient} was successfully deleted from the suppression list`,
      });
    });
  }

  function openDetailModal(row) {
    setIsDetailModalOpen(true);
    setDetailData(row);
  }

  function openDeleteModal(row) {
    setIsDeleteModalOpen(true);
    setDeleteData(row);
  }

  if (loading) return <PanelLoading />;

  if (results === null) return <PlaceholderResults />;

  if (results.length === 0) return <EmptyResults />;

  return (
    <>
      <DeleteModal
        title={`Are you sure you want to delete ${deleteData.recipient} from suppression list?`}
        open={isDeleteModalOpen}
        content={<p>This can not be undone!</p>}
        isPending={deleting}
        onConfirm={deleteSuppression}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

      <Detail
        suppression={detailData}
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        subaccounts={subaccounts}
        hasSubaccounts={hasSubaccounts}
      />

      <TableCollection
        columns={getColumns()}
        rows={props.results}
        getRowData={getRowData}
        defaultSortColumn="recipient"
        pagination
      />
    </>
  );
}

function PlaceholderResults() {
  return (
    <Panel.LEGACY>
      <Empty message="Choose some options to see your suppressions" />
    </Panel.LEGACY>
  );
}

function EmptyResults() {
  return (
    <Panel.LEGACY>
      <Empty message="There are no results for your current query" />
    </Panel.LEGACY>
  );
}

export default connect(null, { deleteSuppression, showAlert })(Results);
