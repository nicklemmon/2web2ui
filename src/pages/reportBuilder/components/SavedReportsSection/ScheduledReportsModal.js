import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MoreHoriz } from '@sparkpost/matchbox-icons';
import { DeleteModal, TableCollection } from 'src/components';
import { deleteScheduledReport, getScheduledReports } from 'src/actions/reports';
import { useModal } from 'src/hooks';
import {
  ActionList,
  Box,
  Button,
  LabelValue,
  Modal,
  Popover,
  ScreenReaderOnly,
  Table,
  Tag,
} from 'src/components/matchbox';
import { Loading } from 'src/components/loading';
import { PageLink } from 'src/components/links';
import { showAlert } from 'src/actions/globalAlert';

const FilterBoxWrapper = props => <Box>{props}</Box>;

//This is because Modal.Footer only accepts Button as children
const PageLinkAsButton = props => {
  return <PageLink as={Button} {...props} />;
};
PageLinkAsButton.displayName = 'Button';

export function ScheduledReportsModal(props) {
  const { report, open, onClose } = props;
  const {
    closeModal: closeDeleteModal,
    openModal: openDeleteModal,
    isModalOpen: isDeleteModalOpen,
    meta = {},
  } = useModal();
  const dispatch = useDispatch();
  const { scheduledReports = [], getScheduledReportsStatus, deleteSchedulePending } = useSelector(
    state => state.reports,
  );

  useEffect(() => {
    if (report.id && open) {
      dispatch(getScheduledReports(report.id));
    }
  }, [dispatch, report, open]);

  const handleDelete = () => {
    const { scheduledReport } = meta;
    dispatch(deleteScheduledReport(report.id, scheduledReport.schedule_id)).then(() => {
      dispatch(
        showAlert({
          type: 'success',
          message: `Successfully deleted ${scheduledReport.name}`,
        }),
      );
      dispatch(getScheduledReports(report.id));
      closeDeleteModal();
    });
  };

  const scheduledReportRows = scheduledReport => {
    const { name, recipients, schedule_id, isLast } = scheduledReport;

    return [
      <PageLink to={`/signals/schedule/${report.id}/${schedule_id}`}>{name}</PageLink>,
      <Tag>Email ({recipients.length})</Tag>,
      <Popover
        left
        top={isLast}
        id={schedule_id}
        trigger={
          <Button variant="minimal" aria-controls={schedule_id} data-id={schedule_id}>
            <Button.Icon as={MoreHoriz} />
            <ScreenReaderOnly>Open Menu</ScreenReaderOnly>
          </Button>
        }
      >
        <ActionList>
          <ActionList.Action
            content="Delete"
            onClick={() => openDeleteModal({ scheduledReport })}
          />
        </ActionList>
      </Popover>,
    ];
  };

  if (open && getScheduledReportsStatus === 'error') {
    onClose();
  }

  return (
    <>
      <Modal open={open} onClose={onClose} showCloseButton maxWidth="1300">
        <Modal.Header>Schedules For Reports</Modal.Header>
        <Modal.Content>
          <LabelValue>
            <LabelValue.Label>Report</LabelValue.Label>
            <LabelValue.Value>{report.name}</LabelValue.Value>
          </LabelValue>
        </Modal.Content>
        <Modal.Content p="0">
          {getScheduledReportsStatus === 'loading' ? (
            <Box paddingTop="800">
              <Loading minHeight="250px" />
            </Box>
          ) : (
            <TableCollection
              headerComponent={() => null}
              rows={scheduledReports}
              getRowData={scheduledReportRows}
              wrapperComponent={Table}
              filterBox={{
                label: '',
                show: true,
                itemToStringKeys: ['name'],
                placeholder: 'Search report name',
                maxWidth: '1250',
                wrapper: FilterBoxWrapper,
              }}
            >
              {({ filterBox, collection, pagination }) => (
                <>
                  <Box borderTop="400" borderBottom="400" padding="500">
                    {filterBox}
                  </Box>
                  {collection}
                  {pagination}
                </>
              )}
            </TableCollection>
          )}
        </Modal.Content>
        <Modal.Footer>
          <PageLinkAsButton variant="primary" to={`/signals/schedule/${report.id}`}>
            Add Schedule
          </PageLinkAsButton>
          <Button onClick={onClose}>Cancel</Button>
        </Modal.Footer>
      </Modal>
      <DeleteModal
        title="Are you sure you want to Delete Scheduled Report"
        open={isDeleteModalOpen}
        content={
          <p>
            Are you sure you want to delete {meta.scheduledReport?.name} this action cannot be
            undone.
          </p>
        }
        isPending={deleteSchedulePending}
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
      />
    </>
  );
}

export default ScheduledReportsModal;
