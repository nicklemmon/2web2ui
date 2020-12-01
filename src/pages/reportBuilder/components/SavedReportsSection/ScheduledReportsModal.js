import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TableCollection } from 'src/components';
import { getScheduledReports } from 'src/actions/reports';
import { Box, Button, LabelValue, Modal, Table, Tag } from 'src/components/matchbox';
import { Loading } from 'src/components/loading';
import { PageLink } from 'src/components/links';

const FilterBoxWrapper = props => <Box>{props}</Box>;

//This is because Modal.Footer only accepts Button as children
const PageLinkAsButton = props => {
  return <PageLink as={Button} {...props} />;
};
PageLinkAsButton.displayName = 'Button';

export function ScheduledReportsModal(props) {
  const { report, open, onClose } = props;
  const dispatch = useDispatch();
  const { scheduledReports = [], getScheduledReportsStatus } = useSelector(state => state.reports);

  useEffect(() => {
    if (report.id && open) {
      dispatch(getScheduledReports(report.id));
    }
  }, [dispatch, report, open]);

  const scheduledReportRows = scheduledReport => {
    const { name, recipients, schedule_id } = scheduledReport;

    return [
      <PageLink to={`/signals/schedule/${report.id}/${schedule_id}`}>{name}</PageLink>,
      <Tag>Email ({recipients.length})</Tag>,
    ];
  };

  if (open && getScheduledReportsStatus === 'error') {
    onClose();
  }

  return (
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
  );
}

export default ScheduledReportsModal;
