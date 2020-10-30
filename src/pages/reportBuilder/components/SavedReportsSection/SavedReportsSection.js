import React, { useState } from 'react';
import { connect } from 'react-redux';
import { PRESET_REPORT_CONFIGS } from '../../constants/presetReport';
import TypeSelect from 'src/components/typeahead/TypeSelect';
import { Button, Column, Columns } from 'src/components/matchbox';
import { Bold, TranslatableText } from 'src/components/text';
import { Edit, FolderOpen, Save } from '@sparkpost/matchbox-icons';
import SaveReportModal from './SaveReportModal';
import { deleteReport, getReports } from 'src/actions/reports';
import ReportsListModal from './ReportsListModal';
import { DeleteModal } from 'src/components/modals';
import { showAlert } from 'src/actions/globalAlert';
import { useReportBuilderContext } from '../../context/ReportBuilderContext';

const SavedReportsSection = props => {
  /* eslint-disable no-unused-vars */
  const [modalStatus, setModalStatus] = useState('');
  const reports = props.reports.map(report => ({ ...report, key: report.id }));
  const [focusedReport, setFocusedReport] = useState({});

  const { actions } = useReportBuilderContext();
  const { refreshReportOptions } = actions;

  const onDelete = () => {
    const { deleteReport, getReports, showAlert } = props;
    deleteReport(focusedReport.id).then(() => {
      setModalStatus('');
      showAlert({
        type: 'success',
        message: `You have successfully deleted ${focusedReport.name}`,
      });
      // Unsets the report if it's the report that's deleted.
      if (focusedReport.id === props.selectedItem.id) {
        refreshReportOptions({
          metrics: undefined,
          filters: [],
          relativeRange: undefined,
          precision: undefined,
          timezone: undefined,
        });
        props.handleReportChange(null);
      }
      getReports();
    });
  };

  const openDeleteModal = reportToDelete => {
    setFocusedReport(reportToDelete);
    setModalStatus('delete');
  };

  const openEditModal = reportToEdit => {
    setFocusedReport(reportToEdit);
    setModalStatus('edit');
  };

  return (
    <Columns
      alignY="bottom" // pull buttons to bottom when side by side
      collapseBelow="md"
    >
      <Column>
        <TypeSelect
          disabled={props.status === 'loading'}
          label="Report"
          id="report-typeahead"
          itemToString={report => (report ? report.name : '')} // return empty string when nothing is selected
          onChange={props.handleReportChange}
          placeholder="Select a Report"
          renderItem={report => (
            <TypeSelect.Item
              label={report.name}
              itemToString={item => item.key}
              meta={report.creator || 'Default'}
            />
          )}
          results={[
            ...reports.filter(({ creator }) => creator === props.currentUser.username),
            ...reports.filter(({ creator }) => creator !== props.currentUser.username),
            ...PRESET_REPORT_CONFIGS,
          ]}
          selectedItem={props.selectedItem}
        />
      </Column>
      <Column width="content">
        <Button
          data-id="edit-report-details-button"
          variant="tertiary"
          onClick={() => {
            setFocusedReport(props.selectedItem);
            setModalStatus('edit');
          }}
          disabled={
            !props.selectedItem ||
            !props.selectedItem.current_user_can_edit ||
            props.selectedItem.type === 'preset'
          }
        >
          <TranslatableText>Edit Details</TranslatableText>
          <Button.Icon as={Edit} ml="100" />
        </Button>
        <SaveReportModal
          open={modalStatus === 'edit'}
          report={focusedReport}
          setReport={props.handleReportChange}
          onCancel={() => {
            setModalStatus('');
            setFocusedReport({});
          }}
        />
        <Button
          data-id="save-report-changes-button"
          variant="tertiary"
          onClick={() => {
            setFocusedReport(props.selectedItem);
            setModalStatus('save');
          }}
          disabled={
            !props.selectedItem ||
            !props.selectedItem.current_user_can_edit ||
            props.selectedItem.type === 'preset'
          }
        >
          <TranslatableText>Save Changes</TranslatableText>
          <Button.Icon as={Save} ml="100" />
        </Button>

        <Button variant="tertiary" onClick={() => setModalStatus('view')}>
          <TranslatableText>View All Reports</TranslatableText>
          <Button.Icon as={FolderOpen} ml="100" />
        </Button>
      </Column>

      <SaveReportModal
        open={modalStatus === 'save'}
        saveQuery
        isOwner={props.currentUser.userName === focusedReport.creator}
        report={focusedReport}
        setReport={props.handleReportChange}
        onCancel={() => {
          setModalStatus('');
          setFocusedReport({});
        }}
      />

      <DeleteModal
        title="Are you sure you want to delete your saved report?"
        confirmVerb="Delete"
        content={
          <p>
            The report <Bold>"{focusedReport.name}"</Bold> will be permanently removed. This cannot
            be undone.
          </p>
        }
        open={modalStatus === 'delete'}
        isPending={props.isDeletePending}
        onCancel={() => {
          setModalStatus('');
          setFocusedReport({});
        }}
        onConfirm={onDelete}
      />

      <ReportsListModal
        open={modalStatus === 'view'}
        onClose={() => {
          setModalStatus('');
        }}
        handleDelete={openDeleteModal}
        handleEdit={openEditModal}
        handleReportChange={props.handleReportChange}
        reports={reports}
      />
    </Columns>
  );
};

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  reports: state.reports.list,
  status: state.reports.status,
  isDeletePending: state.reports.deletePending,
});

export default connect(mapStateToProps, { getReports, deleteReport, showAlert })(
  SavedReportsSection,
);
