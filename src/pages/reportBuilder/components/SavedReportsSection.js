import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { PRESET_REPORT_CONFIGS } from '../constants/presetReport';
import TypeSelect from 'src/components/typeahead/TypeSelect';
import { Button, Column, Columns } from 'src/components/matchbox';
import { TranslatableText } from 'src/components/text';
import { Edit, FolderOpen, Save } from '@sparkpost/matchbox-icons';
import { selectCondition } from 'src/selectors/accessConditionState';
import { isUserUiOptionSet } from 'src/helpers/conditions/user';
import { getReports } from 'src/actions/reports';

const SavedReportsSection = props => {
  /* eslint-disable no-unused-vars */
  const [modalStatus, setModalStatus] = useState('');
  const reports = props.reports.map(report => ({ ...report, key: report.id }));

  useEffect(() => {
    if (props.isSavedReportsEnabled) {
      props.getReports();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Columns
      alignY="bottom" // pull buttons to bottom when side by side
      collapseBelow="md"
    >
      <Column>
        <TypeSelect
          label="Report"
          disabled={props.status === 'loading'}
          id="report-typeahead"
          itemToString={report => (report ? report.name : '')} // return empty string when nothing is selected
          label="Report"
          onChange={props.handleReportChange}
          placeholder="Select a Report"
          renderItem={report => (
            <TypeSelect.Item label={report.name} meta={report.creator || 'Default'} />
          )}
          results={[
            ...reports.filter(({ creator }) => creator === props.currentUser.username),
            ...reports.filter(({ creator }) => creator !== props.currentUser.username),
            ...PRESET_REPORT_CONFIGS,
          ]}
          selectedItem={props.selectedItem}
        />
      </Column>
      {props.isSavedReportsEnabled && (
        <Column width="content">
          <Button variant="tertiary" onClick={() => setModalStatus('edit')}>
            <TranslatableText>Edit Details</TranslatableText>
            <Button.Icon as={Edit} marginLeft="100" />
          </Button>
          <Button variant="tertiary" onClick={() => setModalStatus('save')}>
            <TranslatableText>Save Changes</TranslatableText>
            <Button.Icon as={Save} marginLeft="100" />
          </Button>
          <Button variant="tertiary" onClick={() => setModalStatus('view')}>
            <TranslatableText>View All Reports</TranslatableText>
            <Button.Icon as={FolderOpen} marginLeft="100" />
          </Button>
        </Column>
      )}
    </Columns>
  );
};

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  isSavedReportsEnabled: selectCondition(isUserUiOptionSet('allow_saved_reports'))(state),
  reports: state.reports.list,
  status: state.reports.status,
});

export default connect(mapStateToProps, { getReports })(SavedReportsSection);
