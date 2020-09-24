import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { MoreHoriz } from '@sparkpost/matchbox-icons';
import { Tabs, TableCollection, Subaccount } from 'src/components';
import {
  ActionList,
  Box,
  Button,
  Modal,
  Popover,
  ScreenReaderOnly,
  Table,
  Tag,
} from 'src/components/matchbox';
import { formatDateTime } from 'src/helpers/date';
import { ButtonLink } from 'src/components/links';

const allReportsColumns = [
  { label: 'Name', sortKey: 'name' },
  { label: 'Last Modification', sortKey: 'modified' },
  { label: 'Created By', sortKey: 'creator' },
  {},
  {},
];

const myReportsColumns = [
  { label: 'Name', sortKey: 'name' },
  { label: 'Last Modification', sortKey: 'modified' },
  {},
];

const FilterBoxWrapper = props => (
  <Box borderBottom="400" padding="400">
    {props}
  </Box>
);

export function ReportsListModal(props) {
  const { reports, open, onClose, currentUser, handleDelete } = props;
  const handleReportChange = report => {
    props.handleReportChange(report);
    onClose();
  };

  const getActions = useCallback(
    (reportType, id, name) => {
      return (
        <Popover
          left
          id={`popover-${reportType}-${id}`}
          trigger={
            <Button
              variant="minimal"
              aria-controls={`popover-${reportType}-${id}`}
              data-id={`${reportType}-${id}`}
            >
              <Button.Icon as={MoreHoriz} />
              <ScreenReaderOnly>Open Menu</ScreenReaderOnly>
            </Button>
          }
        >
          <ActionList>
            <ActionList.Action content="Delete" onClick={() => handleDelete({ id, name })} />
          </ActionList>
        </Popover>
      );
    },
    [handleDelete],
  );

  const myReports = reports.filter(({ creator }) => creator === currentUser);

  const myReportsRows = report => {
    const { id, name, modified } = report;
    return [
      <ButtonLink
        onClick={() => {
          handleReportChange(report);
        }}
      >
        {name}
      </ButtonLink>,
      <div>{formatDateTime(modified)}</div>,
      getActions('myReports', id, name),
    ];
  };

  const allReportsRows = report => {
    const { id, name, modified, creator, subaccount_id, current_user_can_edit } = report;
    //conditionally render the actionlist
    const action = current_user_can_edit ? getActions('allReports', id, name) : '';

    return [
      <ButtonLink
        onClick={() => {
          handleReportChange(report);
        }}
      >
        {name}
      </ButtonLink>,
      <div>{formatDateTime(modified)}</div>,
      <div>{creator}</div>,
      <Tag>
        <Subaccount id={subaccount_id} master={subaccount_id === 0} />
      </Tag>,
      action,
    ];
  };

  return (
    <Modal open={open} onClose={onClose} showCloseButton maxWidth="1300">
      <Modal.Header>Saved Reports</Modal.Header>
      <Modal.Content p="0">
        {/* Use p instead of padding due to bug in matchbox 4.3.1*/}
        <Tabs tabs={[{ content: 'My Reports' }, { content: 'All Reports' }]} forceRender fitted>
          <Tabs.Item>
            <TableCollection
              rows={myReports}
              columns={myReportsColumns}
              getRowData={myReportsRows}
              wrapperComponent={Table}
              filterBox={{
                label: '',
                show: true,
                itemToStringKeys: ['name', 'modified'],
                exampleModifiers: ['name', 'modified'],
                maxWidth: '1250',
                wrapper: FilterBoxWrapper,
              }}
            />
          </Tabs.Item>
          <Tabs.Item>
            <TableCollection
              rows={reports}
              columns={allReportsColumns}
              getRowData={allReportsRows}
              wrapperComponent={Table}
              filterBox={{
                label: '',
                show: true,
                itemToStringKeys: ['name', 'modified', 'creator'],
                exampleModifiers: ['name', 'modified', 'creator'],
                maxWidth: '1250',
                wrapper: FilterBoxWrapper,
              }}
            />
          </Tabs.Item>
        </Tabs>
      </Modal.Content>
    </Modal>
  );
}

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser.username,
  };
};
export default connect(mapStateToProps)(ReportsListModal);
